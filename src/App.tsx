import React from 'react';
import { useState } from 'react';

export default function App() {
  const [inputCss, setInputCss] = useState('');
  const [outputCode, setOutputCode] = useState('');

  const convertCssToTft = () => {
    const simulatedOutput = `// Código generado basado en:\n${inputCss}`;
    setOutputCode(simulatedOutput);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Convertidor CSS a Código para TFT</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Área de entrada */}
        <div className="flex flex-col space-y-4">
          <label htmlFor="css-input" className="text-lg font-semibold">Estilos CSS:</label>
          <textarea
            id="css-input"
            className="h-80 p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none shadow-sm"
            placeholder="Escribe aquí tus estilos CSS"
            value={inputCss}
            onChange={(e) => setInputCss(e.target.value)}
          />
          <button
            onClick={convertCssToTft}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-colors"
          >
            Generar código y convertirlo
          </button>
        </div>

        {/* Área de salida */}
        <div className="flex flex-col space-y-4">
          <label htmlFor="output-code" className="text-lg font-semibold">Código generado:</label>
          <pre
            id="output-code"
            className="h-80 p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto whitespace-pre-wrap text-sm shadow-inner"
          >
            {outputCode || '// Aquí aparecerá el código TFT generado.'}
          </pre>
        </div>
      </div>
    </main>
  );
}
