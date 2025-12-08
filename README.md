🧠 Chrome AI Local Translator

Un traductor web moderno, en tiempo real y centrado en la privacidad, construido con React y potenciado por las APIs de IA integradas (Built-in AI) experimentales de Google Chrome.

Este proyecto es una Prueba de Concepto (PoC) que explora el futuro de la "IA en el dispositivo" (On-device AI). A diferencia de los traductores tradicionales que envían datos a la nube, esta aplicación descarga modelos de lenguaje optimizados directamente en el navegador del usuario. Esto permite traducciones instantáneas, funcionamiento sin conexión a internet y privacidad absoluta, ya que el texto nunca sale de tu ordenador. Además, integra capacidades de voz nativas para ofrecer una experiencia completa de dictado y lectura.

⚠️ Advertencia Importante: Tecnología Experimental

Este proyecto utiliza APIs que aún NO son estándar.

Las APIs utilizadas (window.ai, Translator, LanguageDetector) forman parte de la iniciativa Chrome Built-in AI y se encuentran en fase de "Early Preview".

Requisito Obligatorio: Este proyecto NO funcionará en un navegador estándar sin configuración. Requiere una versión reciente de Google Chrome (Canary o Dev) con flags específicas activadas (chrome://flags -> Translation API, Language Detection API, etc.).

Estabilidad: Es posible encontrar comportamientos inusuales, tiempos de carga elevados al descargar modelos por primera vez o errores en la traducción de ciertos pares de idiomas.

Propósito: Este código está diseñado con fines educativos y de experimentación, no se recomienda para entornos de producción.

📂 Estructura del Código

El proyecto sigue una arquitectura modular en React para separar la lógica de negocio (gestión de IA) de la interfaz de usuario.

src/
├── components/
│   ├── LoadingModal.js       # UI: Muestra el progreso de descarga de los modelos de IA.
│   ├── NoSportedMssages.js   # UI: Pantalla de error si el navegador no soporta las APIs.
│   ├── PermissionModal.js    # UI: Solicita consentimiento para descargar archivos grandes (modelos).
│   ├── SelectedLeanguaje.js  # UI: Selectores inteligentes para origen/destino.
│   └── TranslationBoxes.js   # UI: Áreas de texto, botones de micrófono y síntesis de voz.
├── App.js                    # Logic: Controlador principal (Detección, Streaming, Estado).
└── main.jsx                  # Entry: Punto de entrada de la aplicación React.


🌐 APIs Web Utilizadas

Este proyecto combina APIs nativas estándar con las nuevas capacidades de IA de Chrome:

1. Translator API (Chrome Built-in AI)

Contexto: Permite realizar traducciones de texto localmente utilizando modelos neuronales descargados en el dispositivo.

Uso en el proyecto: Se utiliza en modo streaming (translateStreaming), lo que permite que el texto traducido aparezca progresivamente mientras el modelo lo genera, similar a escribir en tiempo real.

2. Language Detection API (Chrome Built-in AI)

Contexto: Una API capaz de clasificar el idioma de un texto basándose en su contenido.

Uso en el proyecto: Al escribir en el cuadro de texto, esta API analiza la entrada para determinar automáticamente el idioma de origen si el usuario ha seleccionado el modo "Auto-detectar".

3. Web Speech API (Speech Recognition)

Contexto: Estándar web para convertir audio en tiempo real a texto.

Uso en el proyecto: Permite al usuario dictar el texto a traducir utilizando su micrófono en lugar de escribirlo.

4. Web Speech API (Speech Synthesis)

Contexto: Estándar web para la síntesis de voz (Text-to-Speech).

Uso en el proyecto: Permite "leer" en voz alta el resultado de la traducción en el idioma de destino con una pronunciación nativa.

<p align="center">
Hecho con ❤️ y curiosidad por la IA Local.
</p>