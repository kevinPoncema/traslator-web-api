import React from 'react';

function TranslationBoxes({ originalLanguage, targetLanguage, originalText, setOriginalText, translatedText, isTranslating, safeUpper }) {
    
    const displaySourceLanguage = originalLanguage === 'auto' ? originalLanguage : safeUpper(originalLanguage);

    return (
        // ESTRUCTURA: Grid de 1 columna por defecto, 2 a partir de 'md'
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            
            {/* Box 1: Texto Original (Fondo oscuro similar al de la imagen) */}
            <div className="p-4 bg-[#202124] rounded-xl shadow-lg border border-[#3c4043] flex flex-col min-h-[250px] md:min-h-[350px]">
                <p className="text-xs font-semibold mb-2 text-slate-400">
                    {originalLanguage === "auto" ? "Texto Original (Auto-detectando)" : `Texto Original (${displaySourceLanguage})`}
                </p>
                <textarea 
                    // CLASES CLAVE PARA LA VISIBILIDAD:
                    // bg-transparent: para que use el fondo oscuro del padre.
                    // text-white: para que el texto escrito sea blanco/claro.
                    className="w-full h-full p-2 bg-transparent text-white resize-none focus:outline-none placeholder-slate-500 text-2xl font-light tracking-wide flex-grow" 
                    placeholder="Escribe, habla o toma fotos"
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                />

                {/* Área de iconos (simulando el micrófono/cámara) */}
                <div className='flex justify-between items-center mt-2 pt-2 border-t border-[#3c4043]'>
                    <span className='text-slate-400 hover:text-white transition duration-150 cursor-pointer text-xl'>
                        🎤
                    </span>
                    <span className='text-slate-400 text-xs'>
                        {originalText.length} caracteres
                    </span>
                </div>
            </div>

            {/* Box 2: Traducción (Fondo azul/oscuro para contraste, similar a la imagen) */}
            <div className="p-4 bg-[#174EA6] rounded-xl shadow-lg border border-blue-500/30 flex flex-col min-h-[250px] md:min-h-[350px]">
                
                {/* Contenido de la Traducción */}
                <div className="flex-grow">
                    <p className="text-xs font-semibold mb-2 text-blue-100">
                        Traducción ({safeUpper(targetLanguage)})
                    </p>
                    <div className="w-full h-full text-white overflow-y-auto text-2xl font-light tracking-wide pt-2">
                        {translatedText}
                        {isTranslating && !translatedText && <span className="text-white/50 animate-pulse">Traduciendo...</span>}
                        {isTranslating && translatedText && <span className="animate-pulse text-white/80">...</span>}
                        {!originalText.trim() && !translatedText && <span className="text-blue-300/80">Traducción</span>}
                    </div>
                </div>

                {/* Opciones inferiores de traducción */}
                <div className="flex justify-end text-sm text-blue-200 mt-2 space-x-4 border-t border-blue-400/30 pt-2">
                    <button className="hover:text-white transition duration-150" title="Guardar">⭐</button>
                    <button className="hover:text-white transition duration-150" title="Compartir">🔗</button>
                    <button className="hover:text-white transition duration-150" title="Copiar">📋</button>
                </div>
            </div>
        </div>
    );
}

export default TranslationBoxes;