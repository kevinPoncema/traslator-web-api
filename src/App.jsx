import React, { useState, useEffect, useRef } from 'react';
import NoSportedMssages from './components/NoSportedMssages';
import SelectedLeanguaje from './components/SelectedLeanguaje'; 

// Tiempo de retraso antes de iniciar la detección de idioma (en milisegundos)
const DEBOUNCE_DELAY = 500; 

// Comprobación de la disponibilidad de la API de Chrome
const isTranslatorSupported = 'Translator' in window;

const safeUpper = (lang) => (lang && typeof lang === 'string' ? lang.toUpperCase() : '...');

function App() {
  // 1. Estados de Idioma y Texto
  const [originalLanguage, setOriginalLanguage] = useState("auto"); // Idioma seleccionado por el usuario (puede ser "auto")
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  
  // Estado para el idioma real que usa el modelo (se actualiza internamente)
  const [actualSourceLanguage, setActualSourceLanguage] = useState("es");
  
  // 2. Estados de Carga y Feedback
  const [modelStatus, setModelStatus] = useState(isTranslatorSupported ? 'initializing' : 'unsupported');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [hasUserStarted, setHasUserStarted] = useState(false); 

  // 3. Referencias
  const translatorRef = useRef(null);
  const detectorRef = useRef(null);
  
  const startLoading = () => {
    setHasUserStarted(true);
  };

  // --- EFECTO 1: Cargar Traductor (Se dispara por cambios en originalLanguage o targetLanguage) ---
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
        
        // El idioma a cargar SIEMPRE es el actualSourceLanguage o el seleccionado manualmente.
        const langToLoad = originalLanguage === "auto" ? sourceLang : originalLanguage;
        
        await Translator.availability({
          sourceLanguage: langToLoad,
          targetLanguage: targetLanguage,
        });
        
        const tempTranslator = await Translator.create({
          sourceLanguage: langToLoad,
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
    
    // Si el usuario cambia manualmente el idioma, actualizamos el idioma de origen AHORA MISMO.
    // Si es "auto", usamos el idioma que ya detectamos/cargamos (o un fallback inicial).
    const langToLoad = originalLanguage === "auto" ? actualSourceLanguage : originalLanguage;

    // Solo cargamos si el idioma actualSourceLanguage es diferente al idioma que usa el traductor
    // o si el targetLanguage ha cambiado.
    if (translatorRef.current?.sourceLanguage !== langToLoad || translatorRef.current?.targetLanguage !== targetLanguage) {
         loadTranslator(langToLoad);
    }
    
  }, [hasUserStarted, originalLanguage, targetLanguage, actualSourceLanguage]); 


  // --- EFECTO 2: Detección de Idioma con Debouncing para 'auto' ---
  useEffect(() => {
    // Solo si el modo 'auto' está activo y el detector está listo
    if (originalLanguage !== "auto" || !detectorRef.current) {
        return;
    }
    
    const handler = setTimeout(async () => {
        if (originalText.trim().length > 2) {
            const results = await detectorRef.current.detect(originalText);
            const topResult = results[0]; 
            
            if (topResult && topResult.detectedLanguage !== "und" && topResult.confidence > 0.5) {
                // Si el idioma detectado es diferente al idioma de origen actual, lo actualizamos.
                // Esto disparará el EFECTO 1 para cargar el nuevo modelo.
                if (topResult.detectedLanguage !== actualSourceLanguage) {
                    setActualSourceLanguage(topResult.detectedLanguage); 
                }
            } else {
                // Si la detección es baja o es 'und', volvemos a un idioma por defecto (ej. español)
                if (actualSourceLanguage !== 'es') {
                    setActualSourceLanguage('es');
                }
            }
        }
    }, DEBOUNCE_DELAY);

    return () => {
        clearTimeout(handler);
    };

  }, [originalText, originalLanguage, actualSourceLanguage]); 


  // --- EFECTO 3: Traducir por Streaming ---
  useEffect(() => {
    // El traductor debe estar listo y el idioma de origen debe ser el idioma real
    if (modelStatus !== 'ready' || !originalText.trim() || !actualSourceLanguage) {
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
        const stream = translator.translateStreaming(originalText);
        
        for await (const chunk of stream) {
          fullTranslation += chunk;
          setTranslatedText(fullTranslation); 
        }

      } catch (error) {
        console.error("Error durante el streaming de traducción:", error);
        setTranslatedText("Error: No se pudo completar la traducción.");
      } finally {
        setIsTranslating(false);
      }
    };

    translateStreaming();

  }, [originalText, modelStatus, actualSourceLanguage, targetLanguage]); 

  // --- Renderizado Condicional ---
  
  if (modelStatus === 'unsupported') {
    return <NoSportedMssages />;
  }
  
  if (!hasUserStarted) {
      return (
          <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
              <button 
                  onClick={startLoading} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-xl transition duration-300"
              >
                  Activar Traductor (Click Requerido para Descarga)
              </button>
          </div>
      );
  }

  if (modelStatus === 'loading' || modelStatus === 'downloading' || modelStatus === 'initializing' || modelStatus === 'error') {
    // ... (Lógica de mensajes de carga/error) ...
    let message = '';
    let isError = false;

    switch (modelStatus) {
      case 'initializing':
      case 'loading':
        message = 'Cargando y verificando disponibilidad...';
        break;
      case 'downloading':
        message = `Descargando modelo (${downloadProgress}%)`;
        break;
      case 'error':
        message = 'Error al inicializar el traductor. Revise la consola.';
        isError = true;
        break;
      default:
        message = 'Cargando...';
    }

    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className={`text-center ${isError ? 'text-red-500' : 'text-white'}`}>
          <p className="text-xl font-semibold">{message}</p>
          {modelStatus === 'downloading' && (
            <div className="mt-4">
              <progress value={downloadProgress} max="100" className="w-64 h-2"></progress>
              <p className="text-sm text-white/70 mt-1">{downloadProgress}%</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Renderizado Final: Listo ---
  // El idioma de visualización es el actualSourceLanguage si está en modo auto,
  // de lo contrario, es el idioma seleccionado.
  const displaySourceLanguage = originalLanguage === 'auto' ? actualSourceLanguage : originalLanguage;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 shadow-lg backdrop-blur w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4">Traductor Local</h2>
        
        <SelectedLeanguaje 
            setOL={setOriginalLanguage} 
            setTL={setTargetLanguage} 
            originalLanguage={originalLanguage} // Le pasa la selección "auto"
            targetLanguage={targetLanguage} 
            actualDetectedLanguage={safeUpper(actualSourceLanguage)} // Le pasa el idioma real detectado
        />
        
        {/* Sección de Texto Original */}
        <div className="mb-4">
          <p className="text-sm font-semibold mb-1">
            Texto Original 
            {/* Muestra el idioma real que se está usando */}
            {originalLanguage === "auto" ? ` (Auto-detectado: ${safeUpper(displaySourceLanguage)})` : `(${safeUpper(displaySourceLanguage)})`}:
          </p>
          <textarea 
            className="w-full h-32 p-3 rounded-lg bg-white/10 border border-white/20 text-white resize-none focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Escribe el texto a traducir aquí..."
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
          />
        </div>

        {/* Sección de Traducción por Streaming */}
        <div>
          <p className="text-sm font-semibold mb-1">Traducción ({safeUpper(targetLanguage)}):</p>
          <div className="w-full h-32 p-3 rounded-lg bg-gray-700/50 border border-white/20 text-white overflow-y-auto">
            {translatedText}
            {isTranslating && !translatedText && <span className="text-white/50">Traduciendo...</span>}
            {isTranslating && translatedText && <span className="animate-pulse text-white/80">...</span>}
          </div>
        </div>
        
        <p className="mt-4 text-sm text-white/70">
            Estado: {isTranslating ? 'Traduciendo en tiempo real...' : 'Listo para traducir.'}
        </p>

      </div>
    </div>
  );
}

export default App;