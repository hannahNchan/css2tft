import React, { useEffect, useRef, useState } from "react";
import {
  Cursor,
  StyledChar,
  initCanvas,
  drawTextMatrix,
  drawCursor,
  handleKeyPress,
  moveCursorWithArrow,
  applyStyleToSelection,
  OLED_HEIGHT,
  OLED_WIDTH,
  CHAR_HEIGHT,
  CHAR_WIDTH,
  MAX_COLS,
} from "../../lib/canvasTFT";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const defaultStyle = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  align: "left" as "left" | "center" | "right",
};

export default function CssEditor({ value, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(5);
  const [cursor, setCursor] = useState<Cursor>({ x: 0, y: 0 });
  const [lines, setLines] = useState<StyledChar[][]>([[]]);
  const [showCursor, setShowCursor] = useState(true);
  const [textStyle, setTextStyle] = useState(defaultStyle);
  const [selection, setSelection] = useState<{ start: Cursor | null; end: Cursor | null }>({ start: null, end: null });
  const isMouseDown = useRef(false);

  const [supportedStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    align: true,
  });

  const unsupported = Object.keys(supportedStyles)
    .filter((key) => !supportedStyles[key as keyof typeof supportedStyles]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((prev) => !prev), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = initCanvas(canvas, scale);
    if (!ctx) return;
    drawTextMatrix(ctx, lines, scale, textStyle, selection);
    if (showCursor) drawCursor(ctx, cursor, scale);
  }, [lines, scale, cursor, showCursor, textStyle, selection]);

  const onKey = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      const newCursor = moveCursorWithArrow(cursor, e.key, lines);
      setCursor(newCursor);
      setSelection({ start: null, end: null });
      return;
    }

    const { lines: newLines, cursor: newCursor } = handleKeyPress(lines, cursor, e.key, textStyle);
    setLines(newLines);
    setCursor(newCursor);
    onChange(newLines.map((l) => l.map((c) => c.char).join("")).join("\n"));
  };

  function renderStyleButton(name: keyof typeof supportedStyles, icon: string) {
    const enabled = supportedStyles[name];
    const isActive = selection.start && selection.end ? false : textStyle[name];

    return (
      <button
        key={name}
        disabled={!enabled}
        className={`px-2 py-1 rounded ${isActive ? "bg-blue-600" : "bg-gray-700"} ${
          !enabled ? "opacity-40 cursor-not-allowed" : ""
        }`}
        onClick={() => {
          if (!enabled) return;
          if (selection.start && selection.end) {
            const updated = applyStyleToSelection(lines, selection, name);
            setLines(updated);
            setSelection({ start: null, end: null });
            onChange(updated.map((l) => l.map((c) => c.char).join("")).join("\n"));
          } else {
            setTextStyle({ ...textStyle, [name]: !textStyle[name] });
          }
        }}
      >
        <i className={`fas fa-${icon}`} />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {unsupported.length > 0 && (
        <div className="bg-yellow-900/40 text-yellow-300 text-sm px-4 py-2 rounded border border-yellow-700">
          ⚠️ Algunas opciones de formato como <strong>negrita</strong>, <em>cursiva</em>, <u>subrayado</u> y <s>tachado</s> no son compatibles con pantallas OLED basadas en <code>Adafruit_GFX</code>. Solo se mostrarán visualmente en el simulador.
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm text-slate-300 font-medium">Escala del canvas (zoom)</label>
        <select
          value={scale}
          onChange={(e) => setScale(parseInt(e.target.value))}
          className="w-32 bg-gray-800 text-white border border-slate-600 rounded p-1 text-sm"
        >
          {[1, 2, 3, 4, 5].map((s) => (
            <option key={s} value={s}>{s}x</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2 items-center text-white text-lg">
        {renderStyleButton("bold", "bold")}
        {renderStyleButton("italic", "italic")}
        {renderStyleButton("underline", "underline")}
        {renderStyleButton("strike", "strikethrough")}
        {["left", "center", "right"].map((align) => (
          <button
            key={align}
            className={`px-2 py-1 rounded ${textStyle.align === align ? "bg-blue-600" : "bg-gray-700"}`}
            onClick={() => {
              if (selection.start && selection.end) {
                const updated = applyStyleToSelection(lines, selection, "align", align as any);
                setLines(updated);
                setSelection({ start: null, end: null });
                onChange(updated.map((l) => l.map((c) => c.char).join("")).join("\n"));
              } else {
                setTextStyle({ ...textStyle, align: align as any });
              }
            }}
          >
            <i className={`fas fa-align-${align}`} />
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm text-slate-300">Texto (OLED 128×128 px escalado {scale}x)</h2>
        <canvas
          ref={canvasRef}
          tabIndex={0}
          onKeyDown={onKey}
          onMouseDown={(e) => {
            const rect = canvasRef.current!.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / (CHAR_WIDTH * scale));
            const y = Math.floor((e.clientY - rect.top) / (CHAR_HEIGHT * scale));
            setCursor({ x, y });
            setSelection({ start: { x, y }, end: { x, y } });
            isMouseDown.current = true;
          }}
          onMouseMove={(e) => {
            if (!isMouseDown.current) return;
            const rect = canvasRef.current!.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / (CHAR_WIDTH * scale));
            const y = Math.floor((e.clientY - rect.top) / (CHAR_HEIGHT * scale));
            setSelection((sel) => sel.start ? { start: sel.start, end: { x, y } } : sel);
          }}
          onMouseUp={() => {
            isMouseDown.current = false;
          }}
          className="outline-none border border-slate-700 bg-black"
          style={{
            width: `${OLED_WIDTH * scale}px`,
            height: `${OLED_HEIGHT * scale}px`,
          }}
        />
        <p className="text-xs text-slate-500">
          Cursor parpadeante activo. Selecciona texto con el mouse y aplica estilo.
        </p>
      </div>
    </div>
  );
}
