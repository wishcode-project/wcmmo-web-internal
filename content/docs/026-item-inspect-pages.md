# 026 — Item detail pages (F in the inventory)

> Status: DRAFT · Target: wcmmo (Skript PoC) → own plugin later (packet-level) · FIRE mode: confirm
> Design: GDD v2 §5 (equipment) · Decisions: D-54

## Big picture

- **Player story:** As a player, I hover an item in my inventory and press **F** to flip its tooltip to the next page, so long item details don't become one huge list.
- **Done means:** MMOItems gear shows page 1 by default; F cycles pages; nothing about the real item changes.

## Pages

| Page | Content |
|---|---|
| 1 · Stats | name, rarity, tier, AP/DP, main stats, requirements (stats + level floor) |
| 2 · Upgrades | enhancement level (+15 / I–V), element, identify rolls, rune / socket info |
| 3 · Lore | the item's story text, set bonus, source |

A small footer line on every page: `F ▸ next page (1/3)`.

## Rules

1. Only in inventory screens (player inventory, chests, UltimateUI menus that show items). F pressed there is a different event from F in the world (bar swap, spec 007), so they don't clash.
2. Only MMOItems gear with more than one page; other items keep the vanilla tooltip.
3. The real item must never change (no dupes, no lost NBT, MMOItems updates keep working).

## How to build it

| Option | How | Pros | Cons |
|---|---|---|---|
| A · Skript PoC | on inventory click with the swap-offhand click type: cancel it, rewrite the hovered item's lore to page N (SkBee), remember N in the item's custom NBT | fast to try | changes the real item; MMOItems may rewrite the lore when it updates the item (e.g. enhancement) |
| **B · Packet-level (recommended long-term)** | rewrite only what the client sees (ProtocolLib / PacketEvents) when sending the item; the real item is untouched | clean, safe with MMOItems and ItemSkins | needs code: a good first candidate for our own plugin after the Phase 0 review (D-25) |

Plan: try A on the dev box to validate the page layout and feel; build B before launch.

## Data & IDs

| ID | Kind |
|---|---|
| `wcmmo_page` | custom NBT int on the item (option A only) |

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Hover a weapon in the inventory, press F three times | pages 1 → 2 → 3 → 1 |
| 2 | Press F with the cursor on an empty slot or a vanilla item | vanilla behaviour |
| 3 | Enhance the weapon, then check page 2 | shows the new level (MMOItems update not broken) |
| 4 | Press F in the world | bar swap only (spec 007) |
| 5 | Drop / trade the item | no page state leaks into stacking or duplication |

## Rollback

Disable the script / plugin: items show the normal MMOItems tooltip.

## Acceptance criteria

- [x] D-54 decided.
- [ ] Option A tested for layout; option B scheduled after the Phase 0 review.
