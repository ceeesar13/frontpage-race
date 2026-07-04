# frontpage-race — Pixels en frontpage (3 retos en 1)

Entrega de César Rivas para el reto **frontpage.sh/million** (4 jul 2026).
Node.js puro (ES modules, sin dependencias). Pagos USDC en Tempo mainnet vía [mppx](https://www.npmjs.com/package/mppx) (MPP firma el 402 automáticamente).

## Retos

### 🪙 Reto 1 — One Dollar Challenge (`reto1.mjs`)
Ícono 2-colores generado desde ASCII art → lista `{x,y,rgb}` → **una sola compra ≤ $1.00**.
- Pintado en **(150,100)–(162,112)**, 96 px (~$0.48), label `niawi ◆ hecho con <$1` → https://bycesar.dev
- El script aborta si el quote supera $1.00 antes de comprar.
- `node reto1.mjs` (solo quote) · `node reto1.mjs --buy`

### 🎯 Reto 2 — One Pixel Challenge (`reto2.mjs`)
**Pixel (402,402)** — la coordenada ES el concepto: HTTP **402 Payment Required**, el status code que hace posible todo este canvas (MPP). Color naranja Bitcoin `#f7931a`.
- El **label se actualiza solo** con el precio BTC en vivo (Coinbase spot): `BTC $xx,xxx ◆ live via HTTP 402`.
- Modo `watch`: solo re-compra cuando BTC cruza un umbral de $250 (cada rebuy duplica el precio → elegancia > gasto).
- `node reto2.mjs status | claim | update | watch`

### ⭕❌ Reto 3 — Tic Tac Toe on-chain (`reto3.mjs`)
Gato **humano vs bot minimax** donde el canvas es el tablero (3×3, paso 3 px).
- El estado se **lee del canvas** en cada turno (9× `GET /api/million/pixel`), no de memoria local.
- Cada jugada = 1 compra de 1 pixel (X `#dc2626`, O `#2563eb`, vacío = virgen → cero doubling).
- Detección automática de ganador/empate, render ASCII por turno, manejo de `lostCount` (re-quote).
- `--new` busca solo un bloque virgen para cada partida nueva (repintar duplica precios).
- Partida 1 jugada en **(340,300)** — terminó en empate 🤝 (el minimax no perdona).
- `node reto3.mjs --dry --auto` (test) · `node reto3.mjs --new` (partida en vivo)

## Estructura
- `lib.mjs` — cliente del API: `quote` (gratis) + `buy` (mppx maneja el 402 firmando USDC).
- Verificación: cada pixel entregado se re-lee con `GET /api/million/pixel` → `owned:true`.
