import { extractCssRules } from './cssParser';
import { hexToRgb } from './rgbUtils';

export function generateAdafruitCode(css: string): string {
  const rules = extractCssRules(css);
  const card = rules['.card'] ?? {};
  const bgColor = card['background-color'] ?? '#FFFFFF';
  const width = parseInt(card['width'] || '10');
  const height = parseInt(card['height'] || '10');
  const [r, g, b] = hexToRgb(bgColor);

  return `#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1351.h>\n\n#define sclk 13\n#define mosi 11\n#define cs 10\n#define rst 9\n#define dc 8\n\nAdafruit_SSD1351 display = Adafruit_SSD1351(128, 128, &SPI, cs, dc, rst);\n\nvoid setup() {\n display.begin();\n display.fillScreen(display.color565(0, 0, 0));\n display.fillRect(20, 50, ${width}, ${height}, display.color565(${r}, ${g}, ${b}));\n display.setTextColor(0xFFFF);\n display.setCursor(30, 55);\n display.setTextSize(2);\n display.print("A");\n}\n\nvoid loop() {}\n`;
}
