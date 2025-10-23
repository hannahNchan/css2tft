export function generateAdafruitCode(text: string): string {
  const lines = text.split("\n").map(l => l.replace(/"/g, '\\"'));
  return `#include <Adafruit_GFX.h>
#include <Adafruit_SSD1351.h>
#include <SPI.h>

#define SCLK 13
#define MOSI 11
#define CS   10
#define RST   9
#define DC    8

Adafruit_SSD1351 display = Adafruit_SSD1351(128, 128, &SPI, CS, DC, RST);

void setup() {
  display.begin();
  display.fillScreen(0x0000);
  display.setTextColor(0xFFFF);
  display.setTextSize(1);
  display.setCursor(0, 0);
${lines.map(l => `  display.println(F("${l}"));`).join("\n")}
}

void loop() {
}
`;
}
