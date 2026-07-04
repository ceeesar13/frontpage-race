# frontpage-race — 3 retos en frontpage.sh/million

Los tres retos del Dev Racing resueltos con **Node.js puro (ESM, sin dependencias)** + `mppx`,
que firma el pago **MPP / HTTP 402 gasless** por cada compra. El canvas es la fuente de verdad.

> Filosofía: cumplir es pintar pixeles. **Ganar es que el sistema esté vivo y sea autónomo** —
> el lema de frontpage: *"your agent does the hard part."*

## 🪙 Reto 1 — One Dollar Challenge (`reto1.mjs`)
Ícono de 2 colores legible de lejos, generado desde un **bitmap ASCII** → array `{x,y,rgb}`.
96 px en zona virgen, **una sola compra de $0.48 ≤ $1.00**. El quote se verifica ≤$1 *antes* del buy.

## 🎯 Reto 2 — One Pixel Challenge (`reto2.mjs`) — el diferencial
Un pixel en **(402, 402)**: la coordenada **ES** el concepto — `402 = HTTP "Payment Required"`,
el status code del protocolo (MPP) que hace posible comprar cada pixel del canvas.
El **label se actualiza solo** con datos vivos (precio BTC + contador `#N` + hora UTC):

```
BTC $63,306 ◆ self-update #1 ◆ 21:41Z ◆ via HTTP 402
```

`node reto2.mjs watch` = agente autónomo que re-pinta **solo cuando el dato cruza un umbral**,
con **cap de gasto** (recomprar el propio pixel duplica el precio → diseñado para no quemar presupuesto).

## ⭕❌ Reto 3 — Tic Tac Toe on-chain (`reto3.mjs`)
El canvas **es** el tablero (3×3 espaciado). Cada jugada = 1 compra de 1 pixel
(`X` un color, `O` otro, vacío = virgen → cero doubling).
- **Estado leído del canvas** cada turno (`GET /api/million/pixel` × 9), no de memoria local.
- Oponente **minimax imbatible** + detección automática de ganador con **línea resaltada**.
- `--new` auto-ubica cada partida en zona 100% virgen (tablero limpio, sin doubling).

```bash
node reto3.mjs          # humano (X) vs bot minimax (O)
node reto3.mjs --new    # partida nueva en tablero virgen auto-encontrado
node reto3.mjs --auto   # bot vs bot (demo)
```

## Arquitectura
- `lib.mjs` — `quote()` (gratis) y `buy()` (vía `mppx`, firma el 402 gasless).
- Verificación on-chain re-leyendo cada pixel (`owned: true`) antes de reportar.
