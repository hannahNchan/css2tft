import { useState } from 'react';

interface CssEditorProps {
  css: string;
  onChange: (value: string) => void;
}

export default function CssEditor({ css, onChange }: CssEditorProps) {
  return (
    <div className="w-1/2 h-full p-4 text-green-400 text-sm font-mono">
      <h2 className="mb-2">Editor CSS</h2>
      <textarea
        className="w-full h-full bg-black text-green-400 outline-none resize-none"
        value={css}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
