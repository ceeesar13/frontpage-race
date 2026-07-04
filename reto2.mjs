// Reto 2 — One Pixel Challenge. UN pixel con label de DATO VIVO.
// Concepto: coord (402,402) = HTTP 402 "Payment Required", el protocolo (MPP)
// que hace posible comprar cada pixel. El label se actualiza solo con BTC live.
// Cada rebuy DUPLICA el precio -> por defecto solo re-compra si cruza umbral.
import { quote, buy, getPixel } from "./lib.mjs";

// ---- CONFIG ----
const COORD = { x: 402, y: 402 };      // 402 = Payment Required
const RGB = "#f7931a";                  // naranja bitcoin
const URL = "https://ceeesar13.github.io/frontpage-race/";
const THRESHOLD_USD = 250;              // solo rebuy si BTC se movió > $250 (cuida presupuesto)

// contador persistente de auto-updates (prueba de "se actualiza solo")
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const CNT = "/home/dev/frontpage-race/reto2.count";
const nextCount = () => { const n = (existsSync(CNT) ? Number(readFileSync(CNT, "utf8")) : 0) + 1; writeFileSync(CNT, String(n)); return n; };

// Dato vivo: precio BTC (coinbase, sin API key). Label lleva precio + #update + hora UTC
// => cada refresh autónomo es VISIBLEMENTE distinto aunque BTC apenas se mueva.
async function fetchDatum(bump = false) {
  const r = await fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot");
  const j = await r.json();
  const price = Math.round(Number(j.data.amount));
  const n = bump ? nextCount() : (existsSync(CNT) ? Number(readFileSync(CNT, "utf8")) : 0);
  const hhmm = new Date().toISOString().slice(11, 16);
  return { price, label: `BTC $${price.toLocaleString("en-US")} ◆ self-update #${n} ◆ ${hhmm}Z ◆ via HTTP 402` };
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

if (mode === "claim") {
  const { price, label } = await fetchDatum(true); // primer buy, cuenta como update #1
  console.log(`CLAIM (402,402) con dato vivo: BTC $${price}`);
  await paint(label);
} else if (mode === "update") {
  // fuerza UNA actualización autónoma (prueba "self-updating") — incrementa #N
  const { price, label } = await fetchDatum(true);
  console.log(`SELF-UPDATE en vivo -> BTC $${price}`);
  await paint(label);
} else if (mode === "watch") {
  // agente autónomo: re-pinta solo cuando BTC cruza umbral. Cap duro de gasto.
  const MAX_UPDATES = Number(process.argv[3] || 4); // protege presupuesto (rebuy DUPLICA)
  const { price } = await fetchDatum(false);
  let last = price, done = 0;
  console.log(`WATCH autónomo. base BTC=$${last}, umbral=$${THRESHOLD_USD}, cap=${MAX_UPDATES} updates.`);
  const tick = async () => {
    const d = await fetchDatum(false);
    const delta = Math.abs(d.price - last);
    console.log(`  [${new Date().toISOString().slice(11,19)}] BTC=$${d.price} (Δ$${delta})`);
    if (delta >= THRESHOLD_USD && done < MAX_UPDATES) {
      const { label } = await fetchDatum(true);
      console.log("  → cruzó umbral, auto-update"); await paint(label);
      last = d.price; if (++done >= MAX_UPDATES) { console.log("cap alcanzado, freno"); process.exit(0); }
    }
  };
  setInterval(tick, 30000);
} else {
  const { price, label } = await fetchDatum(false);
  // status: no gasta, solo muestra estado del pixel + dato actual
  const p = await getPixel(COORD.x, COORD.y);
  console.log(`Pixel (402,402): owned=${p.owned} label=${JSON.stringify(p.label)}`);
  console.log(`Dato vivo ahora: ${label}`);
  console.log(`\nComandos: node reto2.mjs claim | update | watch | status`);
}
