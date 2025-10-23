export interface Cursor {
  x: number;
  y: number;
}

export interface CharStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  align: "left" | "center" | "right";
}

export interface StyledChar {
  char: string;
  style: CharStyle;
}

export const OLED_WIDTH = 128;
export const OLED_HEIGHT = 128;
export const CHAR_WIDTH = 6;
export const CHAR_HEIGHT = 8;
export const MAX_COLS = Math.floor(OLED_WIDTH / CHAR_WIDTH);
export const MAX_ROWS = Math.floor(OLED_HEIGHT / CHAR_HEIGHT);

export function initCanvas(canvas: HTMLCanvasElement, scale: number): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  canvas.width = OLED_WIDTH * scale;
  canvas.height = OLED_HEIGHT * scale;
  return ctx;
}

export function drawTextMatrix(
  ctx: CanvasRenderingContext2D,
  lines: StyledChar[][],
  scale: number,
  style: any,
  selection: { start: Cursor | null; end: Cursor | null }
) {
  ctx.clearRect(0, 0, OLED_WIDTH * scale, OLED_HEIGHT * scale);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, OLED_WIDTH * scale, OLED_HEIGHT * scale);
  ctx.textBaseline = "top";

  const offsetY = 2;

  lines.forEach((line, row) => {
    const drawY = row * CHAR_HEIGHT * scale + offsetY;

    let textWidth = line.length * CHAR_WIDTH * scale;
    let offsetX = 0;

    if (line[0] && line[0].style.align === "center") {
      offsetX = (OLED_WIDTH * scale - textWidth) / 2;
    } else if (line[0] && line[0].style.align === "right") {
      offsetX = OLED_WIDTH * scale - textWidth;
    }

    let drawX = offsetX;

    for (let col = 0; col < line.length; col++) {
      const sc = line[col];
      const isSelected = isCharSelected({ x: col, y: row }, selection);

      if (isSelected) {
        ctx.fillStyle = "rgba(0,255,0,0.2)";
        ctx.fillRect(drawX, drawY, CHAR_WIDTH * scale, CHAR_HEIGHT * scale);
      }

      const fontParts = [];
      if (sc.style.bold) fontParts.push("bold");
      if (sc.style.italic) fontParts.push("italic");
      fontParts.push(`${CHAR_HEIGHT * scale}px monospace`);
      ctx.font = fontParts.join(" ");
      ctx.fillStyle = "#00ff00";

      ctx.fillText(sc.char, drawX, drawY);

      if (sc.style.underline) {
        ctx.fillRect(drawX, drawY + CHAR_HEIGHT * scale - 2, CHAR_WIDTH * scale, 1);
      }

      if (sc.style.strike) {
        ctx.fillRect(drawX, drawY + (CHAR_HEIGHT * scale) / 2, CHAR_WIDTH * scale, 1);
      }

      drawX += CHAR_WIDTH * scale;
    }
  });
}

function isCharSelected(pos: Cursor, selection: { start: Cursor | null; end: Cursor | null }) {
  if (!selection.start || !selection.end) return false;
  const start = toIndex(selection.start);
  const end = toIndex(selection.end);
  const current = toIndex(pos);
  return current >= Math.min(start, end) && current <= Math.max(start, end);
}

function toIndex(pos: Cursor) {
  return pos.y * MAX_COLS + pos.x;
}

export function drawCursor(ctx: CanvasRenderingContext2D, cursor: Cursor, scale: number) {
  const x = cursor.x * CHAR_WIDTH * scale;
  const y = cursor.y * CHAR_HEIGHT * scale;
  ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
  ctx.fillRect(x, y, CHAR_WIDTH * scale, CHAR_HEIGHT * scale);
}

export function handleKeyPress(
  lines: StyledChar[][],
  cursor: Cursor,
  key: string,
  currentStyle: CharStyle
): { lines: StyledChar[][]; cursor: Cursor } {
  const newLines = lines.map((line) => [...line]);
  let { x, y } = cursor;

  // Asegurar que la línea actual exista
  while (newLines.length <= y) {
    newLines.push([]);
  }

  if (key === "Enter") {
    const rest = newLines[y].slice(x);
    newLines[y] = newLines[y].slice(0, x);
    newLines.splice(y + 1, 0, rest);
    x = 0;
    y++;
  } else if (key === "Backspace") {
    if (x > 0) {
      newLines[y].splice(x - 1, 1);
      x--;
    } else if (y > 0) {
      const prevLen = newLines[y - 1].length;
      newLines[y - 1].push(...newLines[y]);
      newLines.splice(y, 1);
      x = prevLen;
      y--;
    }
  } else if (key.length === 1 && /^[\x20-\x7E]$/.test(key)) {
    newLines[y].splice(x, 0, { char: key, style: { ...currentStyle } });
    x++;
  }

  return { lines: newLines, cursor: { x, y } };
}

export function moveCursorWithArrow(
  cursor: Cursor,
  key: string,
  lines: StyledChar[][]
): Cursor {
  let { x, y } = cursor;
  if (key === "ArrowLeft") {
    if (x > 0) x--;
    else if (y > 0) {
      y--;
      x = lines[y].length;
    }
  } else if (key === "ArrowRight") {
    if (x < lines[y].length) x++;
    else if (y < lines.length - 1) {
      y++;
      x = 0;
    }
  } else if (key === "ArrowUp" && y > 0) {
    y--;
    x = Math.min(x, lines[y].length);
  } else if (key === "ArrowDown" && y < lines.length - 1) {
    y++;
    x = Math.min(x, lines[y].length);
  }
  return { x, y };
}

export function applyStyleToSelection(
  lines: StyledChar[][],
  selection: { start: Cursor | null; end: Cursor | null },
  styleKey: keyof CharStyle,
  newValue?: boolean | "left" | "center" | "right"
): StyledChar[][] {
  if (!selection.start || !selection.end) return lines;

  const updated = lines.map((line) => line.map((char) => ({ ...char })));
  const startIndex = toIndex(selection.start);
  const endIndex = toIndex(selection.end);

  const min = Math.min(startIndex, endIndex);
  const max = Math.max(startIndex, endIndex);

  for (let y = 0; y < updated.length; y++) {
    for (let x = 0; x < updated[y].length; x++) {
      const index = y * MAX_COLS + x;
      if (index >= min && index <= max) {
        const char = updated[y][x];

        if (
          styleKey === "bold" ||
          styleKey === "italic" ||
          styleKey === "underline" ||
          styleKey === "strike"
        ) {
          char.style[styleKey] = !char.style[styleKey];
        } else if (styleKey === "align" && typeof newValue === "string") {
          char.style.align = newValue;
        }
      }
    }
  }

  return updated;
}
