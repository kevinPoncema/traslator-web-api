import React from 'react';

function PermissionModal({ onAccept }) {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4" style={{ backgroundColor: '#171717' }}>
            <div className="bg-[#202124] p-8 rounded-xl shadow-2xl max-w-sm w-full text-center border border-green-500/30" style={{ backgroundColor: '#202124', color: '#ffffff' }}>
                <h3 className="text-2xl font-bold mb-3 text-green-400">
                    Traducción Local AI 🧠
                </h3>
                <p className="text-gray-200 mb-6" style={{ color: '#e2e8f0' }}>
                    Esta aplicación necesita instalar el paquete base de traducción de Chrome (unos pocos MB) en tu dispositivo. Esto permite la traducción en tiempo real, sin internet y protegiendo tu privacidad.
                </p>
                <p className="text-sm text-yellow-300 mb-6">
                    Se requiere tu permiso explícito para iniciar la descarga.
                </p>
                <button 
                    onClick={onAccept} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md shadow-green-500/30"
                >
                    Aceptar e Instalar Paquete
                </button>
            </div>
        </div>
    );
}

export default PermissionModal;