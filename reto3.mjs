// Reto 3 — Tic Tac Toe en el canvas. Humano (X) vs Bot minimax (O).
// Estado se LEE del canvas (9 GET/turno). Cada jugada = 1 buy de 1 pixel.
// X = colorX, O = colorO, vacio = virgen (no se paga).
import { getPixel, quote, buy } from "./lib.mjs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

// ---- CONFIG ----
const STEP = 3;                    // espaciado para verse de lejos
// Origen: --origin x,y | --new (busca zona virgen solo) | default = tablero de la partida 1
let ORIGIN = { x: 340, y: 300 };
const originArg = process.argv.find((a) => a.startsWith("--origin="));
if (originArg) {
  const [x, y] = originArg.slice(9).split(",").map(Number);
  ORIGIN = { x, y };
} else if (process.argv.includes("--new")) {
  ORIGIN = await findVirginOrigin();
}

// Busca un bloque libre donde el tablero 3x3 (con margen de 1px alrededor) sea 100% virgen.
async function findVirginOrigin() {
  const { getGrid } = await import("./lib.mjs");
  const grid = await getGrid();
  const owned = new Set((grid.pixels || grid).map((p) => `${p.x},${p.y}`));
  const span = STEP * 2;           // ancho del tablero
  for (let oy = 300; oy < 900; oy += 7) {
    for (let ox = 300; ox < 900; ox += 7) {
      let clean = true;
      for (let dx = -1; dx <= span + 1 && clean; dx++)
        for (let dy = -1; dy <= span + 1 && clean; dy++)
          if (owned.has(`${ox + dx},${oy + dy}`)) clean = false;
      if (clean) { console.log(`✔ zona virgen encontrada: (${ox},${oy})`); return { x: ox, y: oy }; }
    }
  }
  throw new Error("no se encontró bloque virgen en el área de búsqueda");
}
const COLOR = { X: "#dc2626", O: "#2563eb" }; // rojo / azul
const URL = "https://bycesar.dev";
const LABEL = "reto3 ◆ gato on-chain";
const AUTO = process.argv.includes("--auto"); // bot vs bot (demo)
const DRY = process.argv.includes("--dry");   // sin comprar (test logica)

const cellCoord = (i) => ({ x: ORIGIN.x + (i % 3) * STEP, y: ORIGIN.y + Math.floor(i / 3) * STEP });

// Lee el tablero desde el canvas -> array de 9: 'X' | 'O' | null
async function readBoard() {
  const b = await Promise.all(Array.from({ length: 9 }, async (_, i) => {
    const { x, y } = cellCoord(i);
    const p = await getPixel(x, y);
    if (!p.owned) return null;
    const rgb = (p.rgb || "").toLowerCase();
    if (rgb === COLOR.X.toLowerCase()) return "X";
    if (rgb === COLOR.O.toLowerCase()) return "O";
    return null; // pixel de otro dueño: casilla "sucia" -> tratar como vacia
  }));
  return b;
}

const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function winningLine(b) {
  for (const ln of LINES) { const [a,c,d]=ln; if (b[a] && b[a]===b[c] && b[a]===b[d]) return ln; }
  return null;
}
function winner(b) {
  const ln = winningLine(b);
  if (ln) return b[ln[0]];
  return b.every(Boolean) ? "draw" : null;
}

function render(b) {
  const win = winningLine(b);
  const cell = (i) => {
    const v = b[i] || String(i + 1);
    return win && win.includes(i) ? `[${v}]` : ` ${v} `; // resalta la línea ganadora
  };
  console.log(`\n${cell(0)}│${cell(1)}│${cell(2)}\n───┼───┼───\n${cell(3)}│${cell(4)}│${cell(5)}\n───┼───┼───\n${cell(6)}│${cell(7)}│${cell(8)}\n`);
}

// Minimax: O maximiza, X minimiza
function minimax(b, turn) {
  const w = winner(b);
  if (w === "O") return { score: 10 };
  if (w === "X") return { score: -10 };
  if (w === "draw") return { score: 0 };
  let best = turn === "O" ? { score: -Infinity } : { score: Infinity };
  for (let i = 0; i < 9; i++) if (!b[i]) {
    b[i] = turn;
    const s = minimax(b, turn === "O" ? "X" : "O").score;
    b[i] = null;
    if (turn === "O" ? s > best.score : s < best.score) best = { score: s, move: i };
  }
  return best;
}

// Pinta una casilla: quote 1px -> buy. Maneja lostCount (re-cotiza).
async function play(i, mark) {
  const { x, y } = cellCoord(i);
  const px = [{ x, y, rgb: COLOR[mark] }];
  for (let attempt = 0; attempt < 3; attempt++) {
    const q = await quote(px, URL, LABEL);
    console.log(`  quote ${mark}@(${x},${y}) $${q.totalUsd} id=${q.quoteId}`);
    if (DRY) return true;
    const res = await buy(q.quoteId);
    if (/lostCount"?:\s*[1-9]/.test(res)) { console.log("  lostCount>0, re-cotizo..."); continue; }
    console.log(`  ✔ comprado: ${res.slice(0, 120)}`);
    return true;
  }
  return false;
}

async function main() {
  const rl = AUTO ? null : readline.createInterface({ input, output });
  console.log(`GATO on-chain @ (${ORIGIN.x},${ORIGIN.y}) paso ${STEP} · X=humano O=bot · ${DRY ? "DRY" : "LIVE"}`);
  let turn = "X";
  while (true) {
    const b = await readBoard(); // ESTADO DESDE EL CANVAS
    render(b);
    const w = winner(b);
    if (w) { console.log(w === "draw" ? "🤝 Empate" : `🏆 Gana ${w}`); break; }

    let move;
    if (turn === "X" && !AUTO) {
      const ans = await rl.question("Tu jugada (1-9): ");
      move = Number(ans) - 1;
      if (!(move >= 0 && move < 9) || b[move]) { console.log("inválida"); continue; }
    } else {
      // bot minimax (O). En AUTO tambien juega X con minimax.
      move = minimax([...b], turn).move;
      console.log(`bot ${turn} juega ${move + 1}`);
    }
    if (!(await play(move, turn))) { console.log("⛔ no se pudo comprar la casilla"); break; }
    turn = turn === "X" ? "O" : "X";
  }
  rl?.close();
}
main();
