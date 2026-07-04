# frontpage-race — 3 retos en frontpage.sh/million

Entrega de **César Rivas (niawi)** para el **Dev Racing × frontpage.sh/million** (4 jul 2026, 60 min).
Los tres retos resueltos con **Node.js puro (ESM, sin dependencias)** + `mppx`, que firma el pago
**MPP / HTTP 402 gasless** en **USDC sobre Tempo mainnet** por cada compra. El canvas es la fuente de verdad.

**Dashboard en vivo:** https://ceeesar13.github.io/frontpage-race/
**Wallet:** `0xb121Af2B7f927b8E25c2D45CD4AaB6cCCe90459f`

> Filosofía: cumplir es pintar pixeles. **Ganar es que el sistema esté vivo y sea autónomo** —
> el lema de frontpage: *"your agent does the hard part."*

---

## Entregas (todo verificado on-chain, `owned:true`)

| # | Reto | Coords | Detalle | buyId | Costo |
|---|------|--------|---------|-------|-------|
| 1 | One Dollar | `(150,100)` 13×13, 96 px | ícono niawi 2 colores, **una compra ≤ $1** | `01KWQGXBF181EKFDDXFYC6BSQ9` | **$0.48** |
| 2 | One Pixel | `(402,402)` | label **auto-actualizable** con BTC en vivo | `01KWQGXPK5HP0GF9BMW60PB9A7` (+2 self-updates) | $0.005 +… |
| 3 | Tic Tac Toe | `(340,300)` empate · `(349,300)` victoria | canvas=tablero, minimax, ganador auto | 9 + 7 buys | ~$0.08 |
| ★ | Identidad | `(135,120)` NIAWI · `(135,128)` CESAR | firma en el canvas, hover → bycesar.dev | `01KWQJM3…` / `01KWQJQR…` | $0.83 |

Gasto total ≈ **$1.42** de $1.95 fondeados.

---

## 🪙 Reto 1 — One Dollar Challenge (`reto1.mjs`)
Ícono de 2 colores (`#0ea5e9` borde, `#f59e0b` núcleo) generado desde un **bitmap ASCII** → array `{x,y,rgb}`.
96 px en zona virgen `(150,100)`, **una sola compra de $0.48 ≤ $1.00**. El quote se verifica ≤$1 *antes* del buy.
Label `niawi ◆ hecho con <$1` → https://bycesar.dev

## 🎯 Reto 2 — One Pixel Challenge (`reto2.mjs`) — el diferencial
Un pixel en **(402, 402)**: la coordenada **ES** el concepto — `402 = HTTP "Payment Required"`,
el status del protocolo (MPP) que hace posible comprar cada pixel del canvas.
El **label se actualiza solo** con datos vivos (precio BTC vía Coinbase + contador `#N` + hora UTC):

```
BTC $63,229 ◆ self-update #2 ◆ 21:51Z ◆ via HTTP 402
```

```bash
node reto2.mjs status      # ver estado (no gasta)
node reto2.mjs update      # forzar 1 auto-update (incrementa #N)
node reto2.mjs watch [N]    # agente autónomo: re-pinta solo si BTC cruza umbral, cap de N updates
```
Recomprar el propio pixel **duplica** el precio → el `watch` sólo actúa al cruzar umbral (anti-doubling).

## ⭕❌ Reto 3 — Tic Tac Toe on-chain (`reto3.mjs`)
El canvas **es** el tablero (3×3 espaciado, paso 3). Cada jugada = 1 compra de 1 pixel
(`X`=`#dc2626`, `O`=`#2563eb`, vacío = virgen → cero doubling).
- **Estado leído del canvas** cada turno (`GET /api/million/pixel` × 9), no de memoria local.
- Oponente **minimax imbatible** + detección automática de ganador con **línea resaltada**.
- `--new` auto-ubica cada partida en zona 100% virgen (tablero limpio).

```bash
node reto3.mjs             # humano (X) vs bot minimax (O)
node reto3.mjs --new       # partida nueva en tablero virgen auto-encontrado
node reto3.mjs --auto      # bot vs bot (→ empate perfecto)
node reto3.mjs --new --showcase   # X juega para perder → el bot GANA con línea de 3
```
Partidas jugadas en vivo: empate perfecto en `(340,300)` y victoria del bot (línea 2-4-6) en `(349,300)`.

## ★ Identidad (`identidad.mjs`)
Wordmark en pixel-art 5×7 para dejar la firma en el canvas compartido:
```bash
node identidad.mjs --buy                                   # "NIAWI" en zona virgen
COLOR="#f8fafc" LABEL="César Rivas · niawi · bycesar.dev" \
  node identidad.mjs --word=CESAR --origin=135,128 --buy    # "CESAR" en posición fija
```
Resultado: **NIAWI** (`#38bdf8`, `135,120`) + **CESAR** (`#f8fafc`, `135,128`), hover → bycesar.dev.

---

## Arquitectura
- `lib.mjs` — `quote()` (gratis, `fetch`) y `buy()` (vía `mppx`, firma el 402 gasless).
- Verificación on-chain re-leyendo cada pixel (`owned:true`) antes de reportar.
- Sin dependencias npm; sólo `node` + `npx mppx`.

## Setup / gotcha del entorno (importante para reproducir)
`mppx` guarda la llave en el **keyring del SO (libsecret/GNOME)**. En un **VPS headless** no hay
secret-service, así que `mppx account create` fallaba con `secret-tool exited with code 1`.
Solución: instalar `gnome-keyring` y levantar un **D-Bus + keyring persistentes** (socket fijo);
con eso `mppx` guarda y firma sin problema. Ese entorno se exporta en `keyring.env` (git-ignored).

```bash
source keyring.env    # ⚠ obligatorio en cada sesión: sin esto mppx da ACCOUNT_NOT_FOUND
```

> `keyring.env` y `wallet-backup.txt` (private key) están en `.gitignore` — **nunca** se suben.

## Contrato usado — `https://www.frontpage.sh`
- `GET /api/million/grid` — board (comprados + precio); lo que no aparece está virgen a $0.005.
- `GET /api/million/pixel?x=&y=` — inspecciona un pixel (`owned`, `rgb`, `label`, `url`).
- `POST /api/million/quote` — quote gratis (`quoteId`, `totalUsd`, `previewUrl`, expira 10 min).
- `POST /api/million/buy` (vía `mppx`) — paga el 402 y asienta la compra.
