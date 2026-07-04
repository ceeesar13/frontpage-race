// Reto 2 — One Pixel Challenge. UN pixel con label de DATO VIVO.
// Concepto: coord (402,402) = HTTP 402 "Payment Required", el protocolo (MPP)
// que hace posible comprar cada pixel. El label se actualiza solo con BTC live.
// Cada rebuy DUPLICA el precio -> por defecto solo re-compra si cruza umbral.
import { quote, buy, getPixel } from "./lib.mjs";

// ---- CONFIG ----
const COORD = { x: 402, y: 402 };      // 402 = Payment Required
const RGB = "#f7931a";                  // naranja bitcoin
const URL = "https://bycesar.dev";
const THRESHOLD_USD = 250;              // solo rebuy si BTC se movió > $250 (cuida presupuesto)

// Dato vivo: precio BTC (coinbase, sin API key)
async function fetchDatum() {
  const r = await fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot");
  const j = await r.json();
  const price = Math.round(Number(j.data.amount));
  return { price, label: `BTC $${price.toLocaleString("en-US")} ◆ live via HTTP 402` };
}

async function paint(label) {
  const q = await quote([{ ...COORD, rgb: RGB }], URL, label);
  console.log(`  quote $${q.totalUsd} · id=${q.quoteId} · "${label}"`);
  console.log(`  preview: ${q.previewUrl}`);
  const res = await buy(q.quoteId);
  console.log(`  ✔ ${res.slice(0, 160)}`);
  return q;
}

const mode = process.argv[2] || "status";
const { price, label } = await fetchDatum();

if (mode === "claim") {
  // primera compra: reclama el pixel con el label vivo actual
  console.log(`CLAIM (402,402) con dato vivo: BTC $${price}`);
  await paint(label);
} else if (mode === "update") {
  // demo en vivo: fuerza una actualización del label (prueba "self-updating")
  console.log(`UPDATE en vivo del label -> BTC $${price}`);
  await paint(label);
} else if (mode === "watch") {
  // vigila: solo re-compra cuando BTC cruza el umbral (no quema presupuesto)
  let last = price;
  console.log(`WATCH activo. base BTC=$${last}, umbral=$${THRESHOLD_USD}. Ctrl-C para salir.`);
  setInterval(async () => {
    const d = await fetchDatum();
    const delta = Math.abs(d.price - last);
    console.log(`  BTC=$${d.price} (Δ$${delta})`);
    if (delta >= THRESHOLD_USD) { console.log("  → cruzó umbral, actualizo label"); await paint(d.label); last = d.price; }
  }, 30000);
} else {
  // status: no gasta, solo muestra estado del pixel + dato actual
  const p = await getPixel(COORD.x, COORD.y);
  console.log(`Pixel (402,402): owned=${p.owned} label=${JSON.stringify(p.label)}`);
  console.log(`Dato vivo ahora: ${label}`);
  console.log(`\nComandos: node reto2.mjs claim | update | watch | status`);
}
