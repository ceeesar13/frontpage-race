// Identidad — wordmark "NIAWI" en pixel-art 5x7, una sola compra en zona virgen.
import { quote, buy, getGrid } from "./lib.mjs";

const COLOR = process.env.COLOR || "#38bdf8"; // sky — legible de lejos
const URL = "https://bycesar.dev";
const LABEL = process.env.LABEL || "niawi ◆ 3 retos en 60 min ◆ bycesar.dev";
const DO_BUY = process.argv.includes("--buy");
const WORD = (process.argv.find((a) => a.startsWith("--word="))?.slice(7) || "NIAWI").toUpperCase();
const originArg = process.argv.find((a) => a.startsWith("--origin="));
const FORCED = originArg ? (([x, y]) => ({ x, y }))(originArg.slice(9).split(",").map(Number)) : null;

// fuente 5x7
const F = {
  N: ["#...#","##..#","#.#.#","#.#.#","#..##","#...#","#...#"],
  I: ["#####","..#..","..#..","..#..","..#..","..#..","#####"],
  A: [".###.","#...#","#...#","#####","#...#","#...#","#...#"],
  W: ["#...#","#...#","#...#","#.#.#","#.#.#","##.##","#...#"],
  C: [".####","#....","#....","#....","#....","#....",".####"],
  E: ["#####","#....","#....","####.","#....","#....","#####"],
  S: [".####","#....","#....",".###.","....#","....#","####."],
  R: ["####.","#...#","#...#","####.","#.#..","#..#.","#...#"],
};
// ensambla las 7 filas con 1px de separación entre letras
const ART = Array.from({ length: 7 }, (_, r) =>
  WORD.split("").map((ch) => F[ch][r]).join(".")
);
const W = ART[0].length, H = ART.length;

// busca origen con bloque virgen W x H (con 1px de margen)
async function findVirgin() {
  const g = await getGrid();
  const owned = new Set(g.pixels.map((p) => `${p.x},${p.y}`));
  for (let oy = 120; oy < 880; oy += 5)
    for (let ox = 120; ox < 960 - W; ox += 5) {
      let clean = true;
      for (let dy = -1; dy <= H && clean; dy++)
        for (let dx = -1; dx <= W && clean; dx++)
          if (owned.has(`${ox + dx},${oy + dy}`)) clean = false;
      if (clean) return { x: ox, y: oy };
    }
  throw new Error("sin bloque virgen del tamaño pedido");
}

// si se fuerza origen, valida que esté virgen; si no, busca uno
async function resolveOrigin() {
  if (!FORCED) return findVirgin();
  const g = await getGrid();
  const owned = new Set(g.pixels.map((p) => `${p.x},${p.y}`));
  for (let dy = 0; dy < H; dy++)
    for (let dx = 0; dx < W; dx++)
      if (owned.has(`${FORCED.x + dx},${FORCED.y + dy}`)) {
        console.error(`⚠ (${FORCED.x + dx},${FORCED.y + dy}) ocupado, busco otra zona`);
        return findVirgin();
      }
  return FORCED;
}

const O = await resolveOrigin();
const pixels = [];
ART.forEach((row, dy) => [...row].forEach((ch, dx) => {
  if (ch === "#") pixels.push({ x: O.x + dx, y: O.y + dy, rgb: COLOR });
}));
console.log(`"${WORD}" ${W}x${H} en (${O.x},${O.y}) · ${pixels.length} px`);

const q = await quote(pixels, URL, LABEL);
console.log(`quoteId: ${q.quoteId} · totalUsd: $${q.totalUsd}`);
console.log(`preview: ${q.previewUrl}`);
if (Number(q.totalUsd) > 1.3) { console.error("⛔ excede presupuesto"); process.exit(1); }

if (DO_BUY) { console.log("comprando..."); console.log(await buy(q.quoteId)); }
else console.log("\n✔ quote OK. Para pintar: node identidad.mjs --buy");
