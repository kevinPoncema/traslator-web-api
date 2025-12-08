import React from 'react';

// Se asume que safeUpper está definido globalmente o importado donde se use
const safeUpper = (lang) => (lang && typeof lang === 'string' ? lang.toUpperCase() : '...');

function LoadingModal({ status, targetLang }) {
    if (status !== 'downloading' && status !== 'loading' && status !== 'initializing') {
        return null;
    }

    const isDownloading = status === 'downloading';
    const langCode = safeUpper(targetLang);

    // Determinar el título y el icono basados en el estado
    let title = '';
    let icon = '';
    let description = '';

    switch (status) {
        case 'downloading':
            title = '📦 Instalando Paquete AI';
            icon = '⬇️';
            description = `Descargando el modelo de idioma para la traducción a ${langCode}. Esto solo ocurre una vez.`;
            break;
        case 'loading':
        case 'initializing':
        default:
            title = '⚙️ Preparando Traductor';
            icon = '⏳';
            description = 'Verificando servicios locales de traducción...';
            break;
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}>
            
            {/* Contenedor del Modal: Fondo oscuro fuerte, texto claro */}
            <div className="p-8 rounded-xl shadow-2xl w-80 max-w-sm border" style={{ backgroundColor: '#18181b', color: '#e5e7eb', borderColor: '#3b82f6' }}>
                
                {/* Título y Icono */}
                <h3 className="text-xl font-extrabold mb-4 flex items-center gap-3" style={{ color: '#f3f4f6' }}>
                    {icon} {title}
                </h3>
                
                {/* Cuerpo del Mensaje */}
                <p className="text-base mb-5" style={{ color: '#d1d5db' }}>
                    {description}
                </p>
                
                <div className="flex items-center justify-start">
                    <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse mr-3"></div>
                    <p className="text-sm font-medium text-blue-400">
                        {isDownloading ? `Instalando modelo ${langCode}...` : 'Cargando...'}
                    </p>
                </div>

            </div>
        </div>
    );
}

export default LoadingModal;