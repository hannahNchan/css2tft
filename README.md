
# 🎨 CSS2TFT - From CSS to OLED Screens

Convierte tus estilos `TailwindCSS` en visualizaciones pixel-perfect para pantallas OLED/TFT 📟 usando React + Vite + Arduino.

![CSS2TFT Banner](https://raw.githubusercontent.com/hannahNchan/css2tft/main/banner.png)

--

## 🛠️ Tech Stack

- ⚛️ React 18 + TypeScript
- ⚡ Vite (ultra rápido)
- 🎨 TailwindCSS (estilos utilitarios)
- 💾 Exportador para renderizado en pantallas Arduino (SSD1351, ST7789, etc.)

--

## 📂 Estructura del Proyecto

```
📦css2tft
┣ 📂public
┣ 📂src
┃ ┣ 📂assets         # Imágenes, fuentes, íconos
┃ ┣ 📂components     # Componentes visuales reutilizables
┃ ┣ 📂hooks          # Custom hooks
┃ ┣ 📂lib            # Lógica de conversión y utilidades
┃ ┣ 📂pages          # Vistas principales
┃ ┣ 📂styles         # Tailwind setup
┃ ┃ ┗ 📜 index.css   # @tailwind base, components, utilities
┃ ┣ 📜 App.tsx       # Entry point visual
┃ ┗ 📜 main.tsx      # ReactDOM render + mounting
┣ 📜 vite.config.ts  # Configuración de Vite
┗ 📜 README.md       # Este archivo
```

--

## 🚀 Instalación

Requisitos previos: `Node.js`, `npm` y que ames el diseño bonito.

```bash
git clone https://github.com/hannahNchan/css2tft.git
cd css2tft
npm install
npm run dev
```

Abre en: [http://localhost:5173](http://localhost:5173)

--

## 💡 ¿Qué hace esto?

Toma estilos visuales escritos en Tailwind o CSS y los interpreta en instrucciones visuales que pueden ser convertidas a:

- Instrucciones tipo `drawText()` y `drawRect()` para Arduino (pantallas SPI/I2C)
- Vistas previas tipo canvas
- Exportación `.json` para microcontroladores

🧠 Ideal para:

- Interfaces gráficas en Arduino
- Prototipos de pantallas TFT/OLED
- Diseño UI para hardware embebido

--

## 🧩 Cómo contribuir

1. Haz un fork 🍴
2. Crea una rama nueva `git checkout -b feat/nueva-cosa`
3. Haz commit `git commit -m "feat: agregó vista pixel preview"`
4. Push `git push origin feat/nueva-cosa`
5. Abre un Pull Request 🧃

--

## 📸 Capturas de pantalla

_Pendientes en el próximo push..._

--

## 📜 Licencia

MIT — libre pa' usar, remixear y soñar.

Made with 💖 by [@hannahNchan](https://github.com/hannahNchan)
