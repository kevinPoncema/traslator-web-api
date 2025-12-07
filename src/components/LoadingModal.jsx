import React from 'react';

function LoadingModal({ status, progress, targetLang }) {
    if (status !== 'downloading' && status !== 'loading' && status !== 'initializing') {
        return null;
    }

    const isDownloading = status === 'downloading';
    const message = isDownloading 
        ? `Descargando modelo de traducción...` 
        : 'Verificando y cargando traductor...';

    const progressValue = isDownloading ? progress : 0;
    const langCode = safeUpper(targetLang);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-slate-800 p-6 rounded-xl shadow-2xl w-80 text-white border border-blue-500/30">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                    {isDownloading ? '📦 Instalando Paquete AI' : '⚙️ Preparando Traductor'}
                </h3>
                <p className="text-sm text-slate-300 mb-4">
                    {message}
                </p>
                
                <p className="text-xs text-slate-400 mb-1">
                    Idioma Destino: {langCode}
                </p>

                {/* Barra de Progreso */}
                <progress 
                    value={progressValue} 
                    max="100" 
                    className="w-full h-2 rounded-lg overflow-hidden [&::-webkit-progress-bar]:bg-slate-700 [&::-webkit-progress-value]:bg-blue-500"
                />
                <p className="text-xs text-right mt-1 font-semibold text-blue-400">
                    {progressValue}%
                </p>
            </div>
        </div>
    );
}

const safeUpper = (lang) => (lang && typeof lang === 'string' ? lang.toUpperCase() : '...');

export default LoadingModal;