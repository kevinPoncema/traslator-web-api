import React, { useState, useEffect, useRef } from 'react';
import NoSportedMssages from './components/NoSportedMssages';
import SelectedLeanguaje from './components/SelectedLeanguaje'; 
import PermissionModal from './components/PermissionModal';
import LoadingModal from './components/LoadingModal';
import TranslationBoxes from './components/TranslationBoxes';

// Constantes
const DEBOUNCE_DELAY = 500; 
const isTranslatorSupported = 'Translator' in window;
const safeUpper = (lang) => (lang && typeof lang === 'string' ? lang.toUpperCase() : '...');

const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português',
  'pl': 'Polski',
  'uk': 'Українська',
  'ja': 'Japanese',
  'zh': 'Chinese',
  'ko': 'Korean',
};

function App() {
  const [originalLanguage, setOriginalLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [actualSourceLanguage, setActualSourceLanguage] = useState("en");
  const [debouncedText, setDebouncedText] = useState("");


  const [modelStatus, setModelStatus] = useState(isTranslatorSupported ? 'initializing' : 'unsupported');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [hasUserStarted, setHasUserStarted] = useState(false); 

  const translatorRef = useRef(null);
  const detectorRef = useRef(null);
  
  useEffect(() => {
    if (!hasUserStarted || !isTranslatorSupported) {
      return;
    }

    const modelStatusCallback = (status) => {
      setModelStatus(status.state);
      if (status.state === 'downloading' && status.progress !== undefined) {
          setDownloadProgress(Math.round(status.progress * 100));
      }
    };

    const loadTranslator = async (sourceLang) => {
      try {
        if (sourceLang === targetLanguage) {
          console.warn("El idioma de origen y destino no pueden ser iguales");
          if (targetLanguage !== 'es') {
            setTargetLanguage('es');
          } else {
            setTargetLanguage('en');
          }
          return;
        }

        if (!SUPPORTED_LANGUAGES[sourceLang] || !SUPPORTED_LANGUAGES[targetLanguage]) {
          console.warn("Combinación de idiomas no soportada. Usando español como fallback.");
          setTargetLanguage('es');
          return;
        }

        setModelStatus('loading');
        
        if (!detectorRef.current && 'LanguageDetector' in window) {
            detectorRef.current = await LanguageDetector.create();
        }
        
        await Translator.availability({ sourceLanguage: sourceLang, targetLanguage: targetLanguage });
        
        const tempTranslator = await Translator.create({
          sourceLanguage: sourceLang,
          targetLanguage: targetLanguage,
          modelStatusCallback: modelStatusCallback,
        });

        translatorRef.current = tempTranslator;
        setModelStatus('ready');

      } catch (error) {
        console.error("Fallo al cargar el traductor:", error);
        if (targetLanguage !== 'es') {
          setTargetLanguage('es');
        }
        setModelStatus('error');
      }
    };
    
    
    let langToLoad = originalLanguage === "auto" ? actualSourceLanguage : originalLanguage;
    
    if (langToLoad === targetLanguage) {
      const newTarget = targetLanguage === 'es' ? 'en' : 'es';
      setTargetLanguage(newTarget);
      return;
    }

    if (translatorRef.current?.sourceLanguage !== langToLoad || translatorRef.current?.targetLanguage !== targetLanguage) {
         loadTranslator(langToLoad);
    }
    
  }, [hasUserStarted, originalLanguage, targetLanguage, actualSourceLanguage]); 


  useEffect(() => {
    if (originalLanguage !== "auto" || !detectorRef.current) {
        return;
    }
    
    const handler = setTimeout(async () => {
        if (originalText.trim().length > 2) {
            try {
              const results = await detectorRef.current.detect(originalText);
              const topResult = results[0]; 
              
              if (topResult && topResult.detectedLanguage !== "und" && topResult.confidence > 0.5 && SUPPORTED_LANGUAGES[topResult.detectedLanguage]) {
                  if (topResult.detectedLanguage !== actualSourceLanguage) {
                      setActualSourceLanguage(topResult.detectedLanguage); 
                  }
              } else {
                  if (actualSourceLanguage !== 'en') {
                      setActualSourceLanguage('en');
                  }
              }
            } catch (error) {
              console.error("Error en detección de idioma:", error);
              if (actualSourceLanguage !== 'en') {
                  setActualSourceLanguage('en');
              }
            }
        } else if (actualSourceLanguage !== 'en') {
             setActualSourceLanguage('en');
        }
    }, DEBOUNCE_DELAY);

    return () => {
        clearTimeout(handler);
    };

  }, [originalText, originalLanguage, actualSourceLanguage]); 


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(originalText);
    }, 350);
    return () => clearTimeout(handler);
  }, [originalText]);

  useEffect(() => {
    if (modelStatus !== 'ready' || !debouncedText.trim() || !actualSourceLanguage) {
      setTranslatedText(""); 
      return;
    }

    const translateStreaming = async () => {
      const translator = translatorRef.current;
      if (!translator) return;

      setIsTranslating(true);
      setTranslatedText("");
      let fullTranslation = "";

      try {
        const stream = translator.translateStreaming(debouncedText);
        for await (const chunk of stream) {
          fullTranslation += chunk;
          setTranslatedText(fullTranslation); 
        }
      } catch (error) {
        console.error("Error durante el streaming de traducción:", error);
        setTranslatedText("Error: Intenta de nuevo.");
      } finally {
        setIsTranslating(false);
      }
    };

    translateStreaming();

  }, [debouncedText, modelStatus, actualSourceLanguage, targetLanguage]); 

  if (modelStatus === 'unsupported') {
    return <NoSportedMssages />;
  }
  
  if (!hasUserStarted) {
      return <PermissionModal onAccept={() => setHasUserStarted(true)} />;
  }

  const isBlockingModal = modelStatus === 'loading' || modelStatus === 'downloading' || modelStatus === 'initializing';
  

  const displaySourceLanguage = originalLanguage === 'auto' ? actualSourceLanguage : originalLanguage;

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 md:pt-16 p-4" style={{ backgroundColor: '#0a0a0a', color: '#e5e7eb' }}>
        
        {isBlockingModal && (
            <LoadingModal 
                status={modelStatus} 
                progress={downloadProgress} 
                targetLang={targetLanguage} 
            />
        )}

        <div className="w-full max-w-4xl rounded-2xl shadow-2xl border p-6 md:p-8" style={{ backgroundColor: '#18181b', borderColor: '#27272a' }}>
            
            {/* Header de la Aplicación */}
            <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: '#27272a' }}>
                <h1 className="text-3xl font-extrabold" style={{ color: '#60a5fa' }}>
                    Traductor AI Local
                </h1>
                <p className={`text-xs font-medium px-3 py-1 rounded-full ${modelStatus === 'ready' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {modelStatus === 'ready' ? 'Listo' : safeUpper(modelStatus)}
                </p>
            </div>
            
            {/* 4. Selectores de Idioma */}
            <SelectedLeanguaje 
                setOL={setOriginalLanguage} 
                setTL={setTargetLanguage} 
                originalLanguage={originalLanguage} 
                targetLanguage={targetLanguage} 
                actualDetectedLanguage={safeUpper(displaySourceLanguage)} 
            />
            
            {/* 5. Cajas de Traducción */}
            <TranslationBoxes 
                originalLanguage={originalLanguage}
                targetLanguage={targetLanguage}
                originalText={originalText}
                setOriginalText={setOriginalText}
                translatedText={translatedText}
                isTranslating={isTranslating}
                safeUpper={safeUpper}
            />

            {/* Disclaimer Experimental */}
            <div className="mt-8 p-4 border-t text-center" style={{ borderColor: '#27272a' }}>
                <p className="text-xs max-w-2xl mx-auto leading-relaxed" style={{ color: '#9ca3af' }}>
                    ⚠️ <strong style={{ color: '#d1d5db' }}>Nota:</strong> Este proyecto utiliza tecnologías experimentales para la traducción local en tiempo real. 
                    Por ende, puede presentar varios problemas o inestabilidad. Es un proyecto experimental y 
                    <span style={{ color: '#f87171' }}> no está recomendado para uso real o profesional.</span>
                </p>
            </div>

            {/* Mensaje de Error (si existe) */}
            {modelStatus === 'error' && (
                <p className="mt-4 text-sm p-3 rounded-lg" style={{ color: '#fca5a5', backgroundColor: '#450a0a' }}>
                    ⚠️ Error al cargar el modelo. Intenta cambiar de idioma o recargar la página.
                </p>
            )}

        </div>
    </div>
  );
}

export default App;