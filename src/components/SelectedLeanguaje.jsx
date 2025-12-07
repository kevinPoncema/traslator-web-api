import React from "react";
const lenguajeList = {
  // Idiomas Europeos Occidentales y Centrales
  "Español": "es",
  "Inglés": "en",
  "Francés": "fr",
  "Alemán": "de",
  "Italiano": "it",
  "Portugués": "pt",
  
  // Idiomas Europeos Orientales y del Este
  "Ruso": "ru",
  "Polaco": "pl",
  "Turco": "tr", // Se considera a menudo en el contexto europeo/eurasiático
  
  // Idiomas Asiáticos Clave
  "Japonés": "ja",
  "Coreano": "ko",
  "Chino (Simplificado)": "zh-CN",
};
function SelectedLeanguaje({ setOL, setTL, originalLanguage, targetLanguage, actualDetectedLanguage }) {

    // Usamos 'originalLanguage' (el valor real del estado de App) para reflejar la selección
    return (
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-4">
            <div>
                <label className="block mb-2 font-semibold text-white">Idioma Original:</label>
                <select
                    className="border border-gray-700 bg-gray-800 rounded p-2 text-white"
                    // El valor vinculado al select es el estado real (puede ser "auto" o "es", etc.)
                    value={originalLanguage}
                    onChange={(e) => setOL(e.target.value)}
                >
                    {/* La opción de auto-detectar siempre mantiene el valor "auto" */}
                    <option value="auto">
                        🔍 Detectar idioma {originalLanguage !== 'auto' && `(${actualDetectedLanguage})`}
                    </option>
                    {Object.entries(lenguajeList).map(([nombre, codigo]) => (
                        <option key={codigo} value={codigo}>{nombre}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block mb-2 font-semibold text-white">Idioma de Destino:</label>
                <select
                    className="border border-gray-700 bg-gray-800 rounded p-2 text-white"
                    value={targetLanguage}
                    onChange={(e) => setTL(e.target.value)}
                >
                    {Object.entries(lenguajeList).map(([nombre, codigo]) => (
                        <option key={codigo} value={codigo}>{nombre}</option>
                    ))}
                </select>
            </div>
        </div>
    );  
}
export default SelectedLeanguaje;