# 022 — Passive Runes (2–4 slots, 17 runes)

> Status: DRAFT · Target: wcmmo (MMOItems `WCMMO_RUNE` items, MMOInventory slots, Skript hooks for 3 runes) · FIRE mode: validate
> Design: [GDD v2 §2](../gdd/wcmmo-gdd-v2.md#2-classless-system-bloodlines--runes) · Decisions: D-09, D-35, D-35b, D-56

## Big picture

- **Player story:** As a player, I slot 2 to 4 passive Runes and swap them freely, so the same Bloodline can play as a tank, a striker or a caster.
- **Done means:** slots unlock by level; the 17 runes below apply their stats while slotted; no duplicate IDs; shared caps hold.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | MMOItems type `WCMMO_RUNE`, one item per rune and tier | stats from MMOItems / MythicLib |
| wcmmo | MMOInventory | 4 rune slots, slots 3–4 locked until their level |
| wcmmo | Skript (kit) | reads **Steadfast**, **Echo** and **Tempo** (see below); enforces the shared caps |

## Rules

1. Slots: 2 at start, 3rd at Lv 30, 4th at Lv 50 (D-35, level only).
2. The same rune can't be slotted twice (different tiers of one rune count as the same rune).
3. Swap freely out of combat (5 s).
4. Runes give **small passive stats only**; mechanics belong to Bloodlines.
5. **Shared caps** (runes can never push past the rules of other systems):

| Stat | Cap | Shared with |
|---|---|---|
| Cooldown reduction | **30 %** total | Haste rune + Weapon Mastery (spec 023) |
| Basic attack / shot speed | **30 %** total | Tempo rune + AGI (D-50) |
| Critical chance | **60 %** total | Precision rune + gear |

6. Names: one easy English word. Renamed from earlier drafts to avoid clashes: Second Wind → **Breath** (general skill), Focus → **Clarity** (general skill), Bloodthirst → **Leech** (Fury 2B), Bulwark → **Steadfast** (Ward stacks).

## Data & IDs (D-56)

ID pattern `wcmmo_rune_<name>`; tier stored on the item (I / II / III).

| Group | Rune | ID | Effect (tier I / II / III) | Built with |
|---|---|---|---|---|
| Defence | **Vitality** | `wcmmo_rune_vitality` | max HP +5 / 8 / 12 % | MMOItems stat |
| Defence | **Stoneskin** | `wcmmo_rune_stoneskin` | damage taken −2 / 3 / 5 % | MMOItems stat |
| Defence | **Steadfast** | `wcmmo_rune_steadfast` | Frontguard stamina drain −5 / 8 / 12 % | **Skript** (combat script reads it) |
| Defence | **Warding** | `wcmmo_rune_warding` | elemental defence +5 / 8 / 12 % | MMOItems stat |
| Offence | **Edge** | `wcmmo_rune_edge` | physical damage +3 / 5 / 8 % | MMOItems stat |
| Offence | **Arcana** | `wcmmo_rune_arcana` | magic damage +3 / 5 / 8 % | MMOItems stat |
| Offence | **Fletch** | `wcmmo_rune_fletch` | projectile (Bow / Crossbow) damage +3 / 5 / 8 % | MMOItems stat |
| Offence | **Precision** | `wcmmo_rune_precision` | critical chance +3 / 5 / 8 % | MMOItems stat |
| Offence | **Ruin** | `wcmmo_rune_ruin` | critical damage +10 / 15 / 25 % | MMOItems stat |
| Offence | **Haste** | `wcmmo_rune_haste` | cooldown reduction 3 / 5 / 8 % | MMOItems stat (capped with Mastery) |
| Offence | **Tempo** | `wcmmo_rune_tempo` | basic attack / shot speed +3 / 5 / 8 % | **Skript** (added to the AGI bonus, shared cap) |
| Offence | **Slayer** | `wcmmo_rune_slayer` | damage to bosses / elites +3 / 5 / 8 % | MMOItems stat (PvE / boss damage) |
| Sustain | **Leech** | `wcmmo_rune_leech` | lifesteal 1 / 2 / 3 % | MMOItems stat |
| Sustain | **Breath** | `wcmmo_rune_breath` | stamina regen +10 / 15 / 25 % | MMOItems / MMOCore stat |
| Sustain | **Clarity** | `wcmmo_rune_clarity` | mana regen +10 / 15 / 25 % | MMOItems / MMOCore stat |
| Utility | **Echo** | `wcmmo_rune_echo` | Remnant gain +5 / 10 / 15 % | **Skript** (Remnant script reads it) |
| Utility | **Swiftness** | `wcmmo_rune_swiftness` | movement speed +3 / 5 / 8 % | MMOItems stat |

Exact MMOItems stat keys are checked when the items are built (they differ between versions).

## Vertical slice

Two rune slots; **8 runes, tiers I–II:** Vitality, Stoneskin, Edge, Arcana, Fletch, Haste, Leech, Breath.

## Sources

| Tier | Source |
|---|---|
| I | monster drops in Low zones |
| II | monster drops in Mid zones + Alchemy crafting |
| III | dungeon rewards + high-level Alchemy crafting |

## Example builds (same Bloodline, different roles)

| Build | Runes |
|---|---|
| Ward tank | Vitality + Stoneskin + Steadfast + Breath |
| Ward counter-striker | Edge + Precision + Ruin + Steadfast |
| Pulse caster | Arcana + Haste + Clarity + Echo |
| Fury bow skirmisher | Fletch + Tempo + Leech + Swiftness |

## Commands & permissions

`/runes` → opens the MMOInventory rune page (default).

## Performance

Stats apply on equip. The 3 Skript-read runes are looked up only in the events that already run (block, Remnant gain, attack-speed refresh every 2 s).

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Lv 1 player opens `/runes` | 2 open slots, 2 locked |
| 2 | Slot Vitality I and Vitality II | second refused (duplicate) |
| 3 | Lv 30 / Lv 50 | 3rd / 4th slot opens |
| 4 | Haste III + Mastery at the test cap (20 % CDR) | total 28 %; any extra CDR source still stops at 30 % |
| 5 | Tempo III with 60 AGI | basic speed stays at the 30 % cap |
| 6 | Steadfast III, block a hit | guard stamina loss 12 % lower |
| 7 | Echo III, fight the Dummy | Remnant fills 15 % faster |
| 8 | Each stat rune | the stat shows in `/stats` (or MMOItems stat view) |

## Rollback

Runes are items: never delete a rune type once players own it; hide it from drops instead.

## Acceptance criteria

- [x] D-09, D-35, D-35b, D-56 decided.
- [ ] 17 runes built as MMOItems (tiers I–III), tests 1–8 pass.
