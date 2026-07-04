# Dev Racing × frontpage.sh/million — Entrega (César / niawi)

Wallet mppx: `0xb121Af2B7f927b8E25c2D45CD4AaB6cCCe90459f` (Tempo mainnet)

## Reto 1 — One Dollar Challenge
- Ícono "niawi" de 13×13 (96 px) clusterizado en zona virgen `(150,100)`.
- 2 colores legibles de lejos: borde `#0ea5e9`, núcleo `#f59e0b`.
- Label: `niawi ◆ hecho con <$1` · URL: https://bycesar.dev
- UNA sola compra: **buyId `01KWQGXBF181EKFDDXFYC6BSQ9`**, totalUsd **$0.48 ≤ $1.00**.
- Preview: https://www.frontpage.sh/million/preview?id=nFoW7di86j_E
- Generado por código (bitmap ASCII → array {x,y,rgb}), quote verificado ≤$1 antes del buy.

## Reto 2 — One Pixel Challenge
- Pixel `(402,402)` — **402 = HTTP "Payment Required"**, el status del protocolo MPP que hace posible comprar cada pixel. La coordenada ES el concepto.
- Label con **dato vivo**: `BTC $63,315 ◆ live via HTTP 402` (precio BTC en tiempo real vía Coinbase, sin API key).
- Color `#f7931a` (naranja bitcoin) · URL: https://bycesar.dev
- buyId `01KWQGXPK5HP0GF9BMW60PB9A7`.
- Bot `node reto2.mjs watch` re-compra el pixel solo cuando BTC cruza umbral (no quema presupuesto); `update` fuerza refresh en vivo para el demo.

## Reto 3 — Tic Tac Toe en el canvas
- Tablero 3×3 espaciado (paso 3) desde `(340,300)` → se ve de lejos. Cada casilla pintada UNA vez (cero doubling).
- X=`#dc2626`, O=`#2563eb`, vacío=virgen.
- **Estado leído del canvas** cada turno (GET /api/million/pixel de las 9 coords).
- Minimax (bot imbatible) + detección automática de ganador (8 líneas) + empate.
- Partida bot-vs-bot jugada en vivo on-chain → 🤝 empate (juego perfecto). Humano-vs-bot: `node reto3.mjs`.
- 9 buys de $0.005 c/u.

## Stack
Node.js ESM. `lib.mjs` (quote/buy vía mppx que firma el 402 gasless), `reto1.mjs`, `reto2.mjs`, `reto3.mjs`.

## Repositorio (público, sin secretos)
https://github.com/ceeesar13/frontpage-race

---

# PARA PEGAR EN EL CANAL

**César Rivas — intenté los 3 retos** 🏁

🪙 **Reto 1 (One Dollar):** ícono niawi 2 colores, 96 px en (150,100)–(162,112), UNA compra de $0.48 ≤ $1. Label `niawi ◆ hecho con <$1` → bycesar.dev. buyId `01KWQGXBF181EKFDDXFYC6BSQ9`.

🎯 **Reto 2 (One Pixel):** pixel **(402,402)** — la coordenada ES el concepto: HTTP **402 Payment Required**, el status code que hace posible este canvas. Naranja Bitcoin, y el **label se actualiza solo** con el precio BTC en vivo. buyId `01KWQGXPK5HP0GF9BMW60PB9A7`.

⭕❌ **Reto 3 (Tic Tac Toe):** gato on-chain con **bot minimax**, estado leído del canvas cada turno, 1 compra por jugada, ganador automático. Partida 1 en (340,300) → empate 🤝. Demo: partida nueva en tablero virgen auto-ubicado.

Código: https://github.com/ceeesar13/frontpage-race

---

# FORMULARIO WEB

- **Nombre del proyecto:** Gato on-chain + pixel 402 vivo (3 retos, Node puro)
- **Qué construiste:** Los 3 retos con Node.js sin dependencias y mppx firmando el 402. (1) Ícono niawi de 96 px comprado en UNA transacción de $0.48. (2) Un pixel en (402,402) — HTTP 402 Payment Required, el protocolo detrás del canvas — cuyo label se auto-actualiza con el precio de BTC en vivo, con umbral anti-doubling. (3) Tic-tac-toe interactivo humano vs minimax donde el canvas es el tablero: estado leído del API cada turno, cada jugada es una compra de 1 pixel, casillas vacías quedan vírgenes (cero doubling) y cada partida nueva se auto-ubica en zona virgen (`--new`).
- **Repositorio:** https://github.com/ceeesar13/frontpage-race
- **Demo URL:** https://frontpage.sh/million

---

# DEMO EN VIVO — comandos

```bash
cd /home/dev/frontpage-race
source keyring.env          # ⚠ OBLIGATORIO: sin esto mppx da ACCOUNT_NOT_FOUND

# Reto 2: actualización del label en vivo (1 compra ~$0.01)
node reto2.mjs update

# Reto 3: partida nueva en tablero virgen (tú = X, bot minimax = O)
node reto3.mjs --new
```

Saldo verificado 16:47: **$1.397 USDC** (partida nueva ≈ $0.045 + update ≈ $0.01 → sobra).

---

# ★ IDENTIDAD EN EL CANVAS

Además de los 3 retos, dejamos la firma en pixel-art (`identidad.mjs`, fuente 5×7):

- **NIAWI** — `#38bdf8`, `(135,120)`–`(163,126)`, 84 px · buyId `01KWQJM3T8V970678W6T3S11PJ`
- **CESAR** — `#f8fafc`, `(135,128)`–`(163,134)`, 82 px · buyId `01KWQJQR54Q4XN120PKFNZTE8D`
  · label **"César Rivas · niawi · bycesar.dev"** → al hacer hover aparece el nombre + link.

Preview: https://www.frontpage.sh/million/preview?id=9g_xGJtjBz3v

# RESUMEN DE COMPRAS (on-chain)

| Ítem | buyId | Costo |
|---|---|---|
| Reto 1 (96 px) | `01KWQGXBF181EKFDDXFYC6BSQ9` | $0.48 |
| Reto 2 claim (402,402) | `01KWQGXPK5HP0GF9BMW60PB9A7` | $0.005 |
| Reto 2 self-update #1 | `01KWQH90Y01AB16W52ZG32PTPY` | $0.01 |
| Reto 2 self-update #2 | `01KWQHTP0MEX1A9PD4JVJPRVH3` | $0.02 |
| Reto 3 partida empate (340,300) | 9× $0.005 | $0.045 |
| Reto 3 partida victoria (349,300) | 7× $0.005 | $0.035 |
| Identidad NIAWI | `01KWQJM3T8V970678W6T3S11PJ` | $0.42 |
| Identidad CESAR | `01KWQJQR54Q4XN120PKFNZTE8D` | $0.41 |

Gasto total ≈ **$1.42** de $1.95 fondeados · saldo final ≈ **$0.53 USDC**.
