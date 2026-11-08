# 🎓 SuperMate 7: Aplicación de Matemáticas para Niños de 7 Años

Aplicación web educativa interactiva desarrollada especialmente para niños de 7 años (1° y 2° Básico). Diseñada para acompañar y reforzar el aprendizaje de forma autónoma con **lectura por voz suave**, **comandos de voz con micrófono**, **cronómetro/temporizador** y **retroalimentación positiva**.

Inspirada en los contenidos oficiales de la evaluación escolar de matemática del **10 de Noviembre**:
- **Dictado de números hasta el 30**
- **Patrones / Secuencias**
- **Unidades y decenas**
- **Conteo de números**
- **Orden de números mayor a menor y viceversa**
- **Resolución de problemas**

---

## 🚀 Características Principales

- 🎙️ **Comandos de Voz por Micrófono**: Los niños pueden responder diciendo los números en voz alta (ej. *"veinticuatro"*, *"quince"*, *"sumar"*, *"restar"*) o usar comandos como *"repetir"*, *"siguiente"*, *"ayuda"*.
- 👩‍🏫 **Voz de Lectura Suave y Pausada**: Prioriza voces femeninas en español con un ritmo tranquilo (0.8x) y respetuoso para facilitar la comprensión lectora autónoma.
- ⏱️ **Cronómetro y Temporizador**:
  - *Modo Cronómetro*: Para medir la concentración sin presión.
  - *Modo Temporizador de Desafío*: Cuentas regresivas de 30s, 1m, 2m con avisos suaves.
- 🧱 **Bloques Multibase de Decenas y Unidades**:
  - Barritas azules de 10 unidades y cubitos amarillos de 1 unidad.
  - Tabla de valor posicional `[ D | U ]` y constructor interactivo de números.
- 🍎 **Conteo Táctil Interactivo**: Al tocar cada elemento se numera y tacha en pantalla para que el niño no pierda la cuenta ni cuente dos veces.
- 📊 **Orden y Comparación**: Ordenar de menor a mayor y de mayor a menor en podios, además de comparación con la mnemotecnia del cocodrilo glotón (`>`, `<`).
- 💡 **Resolución de Problemas Cotidianos**: Historias amigables con fichas visuales para comprender si se debe sumar o restar antes de dar el resultado.
- 🏅 **Simulacro de Evaluación Oficial (10/11)**: Prueba de 6 preguntas que genera un **Diploma al Mérito Matemático** personalizable e imprimible.
- ⭐ **Álbum de 12 Stickers Coleccionables**: Recompensas que motivan el aprendizaje continuo.
- 👨‍👩‍👧 **Guía para Familias**: Consejos pedagógicos para apoyar el estudio en el hogar.

---

## 🛠️ Tecnologías Utilizadas

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Web Speech API**: Síntesis de voz (Text-to-Speech) y Reconocimiento de voz (Speech-to-Text)
- **Web Audio API**: Efectos de sonido suaves generados en tiempo real (sin archivos externos pesados)
- **Lucide Icons**
- **Canvas Confetti**

---

## 📦 Instalación y Ejecución Local

1. Clona el repositorio:
```bash
git clone https://github.com/TU_USUARIO/supermate-7.git
cd supermate-7
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en:
```
http://localhost:3000
```

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
