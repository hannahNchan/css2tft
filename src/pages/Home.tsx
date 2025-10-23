import React from "react";
import { useState } from "react";
import CssEditor from "@components/UI/CssEditor";
import { generateAdafruitCode } from "../lib/arduinoGen";

export default function Home() {
  const [text, setText] = useState("");
  const [code, setCode] = useState("// Aquí aparecerá el código TFT generado.");

  const handleGenerate = () => setCode(generateAdafruitCode(text));

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Convertidor CSS a Código para TFT
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <CssEditor value={text} onChange={setText} />
          <button
            type="button"
            onClick={handleGenerate}
            className="self-start px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 font-medium"
          >
            Generar código y convertirlo
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-300">Código generado:</label>
          <pre className="w-full min-h-[320px] bg-[#0d1117] text-indigo-200 p-4 rounded border border-slate-800 overflow-auto whitespace-pre-wrap font-mono text-xs shadow-inner">
            {code}
          </pre>
        </div>
      </div>
    </div>
  );
}