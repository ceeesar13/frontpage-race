// Helper compartido: quote (gratis) + buy (via mppx, firma el 402).
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const pexec = promisify(execFile);

const BASE = "https://www.frontpage.sh";
export const EMAIL = "cesarrivass74@gmail.com";
export const NETWORK = "mainnet";

export async function getPixel(x, y) {
  const r = await fetch(`${BASE}/api/million/pixel?x=${x}&y=${y}`);
  return r.json();
}

export async function getGrid() {
  const r = await fetch(`${BASE}/api/million/grid`);
  return r.json();
}

// pixels: [{x,y,rgb}], url + label a nivel de batch
export async function quote(pixels, url, label) {
  const r = await fetch(`${BASE}/api/million/quote`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ pixels, url, label }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`quote ${r.status}: ${JSON.stringify(j)}`);
  return j; // { quoteId, totalUsd, previewUrl, ... }
}

// buy: mppx maneja el 402 (firma USDC y reintenta). Devuelve JSON del server.
export async function buy(quoteId) {
  const body = JSON.stringify({ quoteId, email: EMAIL });
  const { stdout } = await pexec("npx", [
    "mppx", `${BASE}/api/million/buy`,
    "-J", body,
    "--network", NETWORK,
    "--silent",
  ], { maxBuffer: 1 << 24 });
  return stdout.trim();
}
