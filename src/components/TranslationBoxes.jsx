import React from 'react';

function TranslationBoxes({ originalLanguage, targetLanguage, originalText, setOriginalText, translatedText, isTranslating, safeUpper }) {
    const displaySourceLanguage = originalLanguage === 'auto' ? originalLanguage : safeUpper(originalLanguage);

    const handleCopy = async () => {
        if (!translatedText) return;
        try {
            await navigator.clipboard.writeText(translatedText);
            alert("Texto copiado correctamente");
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleSpeak = () => {
        if (!translatedText) return;
        window.speechSynthesis.cancel(); // Detener cualquier audio previo
        const utterance = new SpeechSynthesisUtterance(translatedText);
        utterance.lang = targetLanguage;
        window.speechSynthesis.speak(utterance);
    };

    const microphoneHandler = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            alert("El reconocimiento de voz no es soportado en tu navegador");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = originalLanguage === "auto" ? "en-US" : originalLanguage;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onstart = () => {
            console.log("Escuchando...");
        };

        recognition.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            setOriginalText(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Error en el reconocimiento de voz:", event.error);
            alert("Error: " + event.error);
        };

        recognition.onend = () => {
            console.log("Reconocimiento finalizado");
        };

        recognition.start();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            
            <div className="p-4 rounded-xl shadow-lg border border-gray-800 flex flex-col min-h-[250px] md:min-h-[350px]" style={{ backgroundColor: '#18181b', color: '#d1d5db' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#6b7280' }}>
                    {originalLanguage === "auto" ? "Texto Original (Auto-detectando)" : `Texto Original (${displaySourceLanguage})`}
                </p>
                <textarea 
                    // CAMBIO CLAVE: text-white y font-light para visibilidad y estilo GT
                    className="w-full h-full p-2 bg-transparent resize-none focus:outline-none placeholder-gray-600 text-2xl font-light tracking-wide flex-grow"
                    style={{ color: '#d1d5db', backgroundColor: '#18181b', borderColor: '#27272a', borderWidth: '1px', borderRadius: '0.5rem' }}
                    placeholder="Escribe, habla o toma fotos"
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                />

                <div className='flex justify-between items-center mt-2 pt-2 border-t border-gray-700'>
                    <span onClick={microphoneHandler} className='text-gray-500 hover:text-gray-300 transition duration-150 cursor-pointer text-xl'>
                        🎤
                    </span>
                    <span className='text-gray-500 text-xs'>
                        {originalText.length} caracteres
                    </span>
                </div>
            </div>

            <div className="p-4 rounded-xl shadow-lg border border-gray-800 flex flex-col min-h-[250px] md:min-h-[350px]" style={{ backgroundColor: '#1e293b', color: '#d1d5db' }}>
                
                <div className="flex-grow">
                    <p className="text-xs font-semibold mb-2" style={{ color: '#64748b' }}>
                        Traducción ({safeUpper(targetLanguage)})
                    </p>
                    <div className="w-full h-full overflow-y-auto text-2xl font-light tracking-wide pt-2" style={{ color: '#d1d5db' }}>
                        {translatedText}
                        {isTranslating && !translatedText && <span style={{ color: '#64748b' }} className="animate-pulse">Traduciendo...</span>}
                        {isTranslating && translatedText && <span className="animate-pulse" style={{ color: '#64748b' }}>...</span>}
                        {!originalText.trim() && !translatedText && <span style={{ color: '#64748b' }}>Traducción</span>}
                    </div>
                </div>

                <div className="flex justify-end text-sm mt-2 space-x-4 border-t border-gray-700 pt-2">
                    <button onClick={handleSpeak} className="hover:text-gray-300 transition duration-150" title="Escuchar">🔊</button>
                    <button onClick={handleCopy} className="hover:text-gray-300 transition duration-150" title="Copiar">📋</button>
                </div>
            </div>
        </div>
    );
}

export default TranslationBoxes;