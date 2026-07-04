// Reto 1 — One Dollar Challenge: UNA sola compra, totalUsd <= $1.00.
// Diseño = ASCII art. Cada char mapea a un color (o "." = no pintar).
// ~200 px virgenes a $0.005 = $1.00 tope. Mantener <= 200 px pintados.
import { quote, buy } from "./lib.mjs";

// ---- CONFIG (cambiar solo esto) ----
const ORIGIN = { x: 150, y: 100 };   // esquina sup-izq (zona virgen verificada)
const URL = "https://bycesar.dev";   // link clickeable del pixel
const LABEL = "niawi ◆ hecho con <$1";
const PALETTE = { "#": "#0ea5e9", "o": "#f59e0b" }; // 2 colores legibles de lejos
const DO_BUY = process.argv.includes("--buy");

// Diseño 13x13 (editar libremente). "." = virgen (no se paga).
const ART = `
....#####....
...#######...
..####o####..
..###ooo###..
..##ooooo##..
..#ooooooo#..
..#ooooooo#..
..#ooooooo#..
..##ooooo##..
..####o####..
...#######...
....#####....
.............
`.trim().split("\n");

function toPixels(art) {
  const px = [];
  art.forEach((row, dy) => [...row].forEach((ch, dx) => {
    const rgb = PALETTE[ch];
    if (rgb) px.push({ x: ORIGIN.x + dx, y: ORIGIN.y + dy, rgb });
  }));
  return px;
}

const pixels = toPixels(ART);
console.log(`pixeles a pintar: ${pixels.length} (max seguro 200)`);
if (pixels.length > 200) { console.error("⚠ >200 px, excede $1"); process.exit(1); }

const q = await quote(pixels, URL, LABEL);
console.log(`quoteId: ${q.quoteId}`);
console.log(`totalUsd: $${q.totalUsd}`);
console.log(`previewUrl: ${q.previewUrl}`);
if (Number(q.totalUsd) > 1.0) { console.error("⛔ totalUsd > $1.00 — NO comprar"); process.exit(1); }

if (DO_BUY) {
  console.log("Comprando (mppx firma el 402)...");
  console.log(await buy(q.quoteId));
} else {
  console.log("\n✔ Quote OK y <= $1. Revisa previewUrl. Para comprar: node reto1.mjs --buy");
}
