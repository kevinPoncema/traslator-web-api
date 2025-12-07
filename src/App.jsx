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

function App() {
  // 1. Estados de Idioma y Texto
  const [originalLanguage, setOriginalLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("es"); // Cambiado a 'es' para mejor UX inicial
  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [actualSourceLanguage, setActualSourceLanguage] = useState("en"); // Idioma inicial por defecto para el modelo
  const [debouncedText, setDebouncedText] = useState("");

  // 2. Estados de Carga y Feedback
  const [modelStatus, setModelStatus] = useState(isTranslatorSupported ? 'initializing' : 'unsupported');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [hasUserStarted, setHasUserStarted] = useState(false); 

  // 3. Referencias
  const translatorRef = useRef(null);
  const detectorRef = useRef(null);
  
  // --- Lógica de Carga y Detección (Efectos) ---

  // EFECTO 1: Cargar Traductor (Se dispara por cambios en idioma manual o actualSourceLanguage)
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
        setModelStatus('error');
      }
    };
    
    const langToLoad = originalLanguage === "auto" ? actualSourceLanguage : originalLanguage;

    if (translatorRef.current?.sourceLanguage !== langToLoad || translatorRef.current?.targetLanguage !== targetLanguage) {
         loadTranslator(langToLoad);
    }
    
  }, [hasUserStarted, originalLanguage, targetLanguage, actualSourceLanguage]); 


  // EFECTO 2: Detección de Idioma con Debouncing para 'auto'
  useEffect(() => {
    if (originalLanguage !== "auto" || !detectorRef.current) {
        return;
    }
    
    const handler = setTimeout(async () => {
        if (originalText.trim().length > 2) {
            const results = await detectorRef.current.detect(originalText);
            const topResult = results[0]; 
            
            if (topResult && topResult.detectedLanguage !== "und" && topResult.confidence > 0.5) {
                if (topResult.detectedLanguage !== actualSourceLanguage) {
                    setActualSourceLanguage(topResult.detectedLanguage); 
                }
            } else {
                if (actualSourceLanguage !== 'en') { // Usamos 'en' como fallback predeterminado si es 'auto'
                    setActualSourceLanguage('en');
                }
            }
        } else if (actualSourceLanguage !== 'en') {
             // Limpiar si el texto se vacía
             setActualSourceLanguage('en');
        }
    }, DEBOUNCE_DELAY);

    return () => {
        clearTimeout(handler);
    };

  }, [originalText, originalLanguage, actualSourceLanguage]); 


  // EFECTO: Debounce para el texto original
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(originalText);
    }, 350);
    return () => clearTimeout(handler);
  }, [originalText]);

  // EFECTO 3: Traducir por Streaming
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

  // --- Renderizado Condicional de la UI/UX ---
  
  // 1. Incompatibilidad total
  if (modelStatus === 'unsupported') {
    return <NoSportedMssages />;
  }
  
  // 2. Solicitud de Permiso Inicial
  if (!hasUserStarted) {
      return <PermissionModal onAccept={() => setHasUserStarted(true)} />;
  }

  // 3. Modal de Carga/Descarga (flota sobre la UI)
  const isBlockingModal = modelStatus === 'loading' || modelStatus === 'downloading' || modelStatus === 'initializing';
  
  // Determinar idioma para la visualización del origen
  const displaySourceLanguage = originalLanguage === 'auto' ? actualSourceLanguage : originalLanguage;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center pt-8 md:pt-16 p-4">
        
        {isBlockingModal && (
            <LoadingModal 
                status={modelStatus} 
                progress={downloadProgress} 
                targetLang={targetLanguage} 
            />
        )}

        <div className="w-full max-w-4xl bg-slate-800/80 rounded-2xl shadow-2xl border border-white/10 p-6 md:p-8">
            
            {/* Header de la Aplicación */}
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h1 className="text-3xl font-extrabold text-blue-400">
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

            {/* Mensaje de Error (si existe) */}
            {modelStatus === 'error' && (
                <p className="mt-4 text-sm text-red-400 p-3 bg-red-900/20 rounded-lg">
                    ⚠️ Error al cargar el modelo. Intenta cambiar de idioma o recargar la página.
                </p>
            )}

        </div>
    </div>
  );
}

export default App;