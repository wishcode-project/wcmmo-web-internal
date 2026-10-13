# 041 — Arc Staff and Potions packs

> Status: IN-PROGRESS · Target: wcmmo (MythicMobs, ModelEngine, Nexo) · FIRE mode: confirm
> Design: GDD v2 §3 · Decisions: D-72 (staff stances), D-70 (tiers), D-75 / D-78 (skills on keys 1–5), D-44 (OPEN)
> Answers: M24 (another Staff pack + a Tome: Llama Studio **Arc Staff**; consumables: **Potions v1.1**, owner 2026-10-13)

## Big picture

- **Player story:** more staff looks and skills (an Arc Staff, a Grimoire) and potion items with drink effects.
- **Owner, 2026-10-13:** the packs are installed **as shipped** first. How they join our system (worn weapon / skills on keys 1–5 / our potions) is decided next (Open questions).
- **Done means (this step):** the packs load without errors and their own items work as the packs made them.

## What is installed (as shipped)

| Pack | Files | Items |
|---|---|---|
| **Arc Staff** (`ls_w_arc_staff`) | `MythicMobs/{items,skills,mobs}/ls_w_arc_staff_*.yml`, `ModelEngine/blueprints/ls_w_arc_staff/` (6 models), Nexo `ls_w_arc_staff.yml` + model / texture folders | `LS_W_ARC_STAFF` (L Energy Orb, R Thunder Impact), `LS_W_ARC_GRIMOIRE` (Shift + L Teleport), skill icons `LS_W_ARC_STAFF_ENERGY_ORB`, `_THUNDER_IMPACT`, `LS_W_ARC_GRIMOIRE_TELEPORT` (SHEARS, CMD 6948–6952) |
| **Potions v1.1** (`lsi_potions`) | `MythicMobs/items/lsm_potions_crucible.yml`, `skills/lsi_potion_skills_crucible.yml`, `mobs/lsi_potions_mobs.yml`, `ModelEngine/blueprints/lsi_potion/` (6 VFX), Nexo `lsi_potions.yml` + folders | `red` / `yellow` / `purple` / `blue` / `green` / `exp` `_potion_small` and `_large` (PAPER, CMD 6841–6852) |

- **Crucible version** of the potions, like the other packs (the pack says: use only one of the Crucible / MMOItems skill files). The MMOItems / MythicLib files are not installed (D-44 open).
- The Arc Staff's blueprint folder is `ls_w_arc_staff` (the pack's folder name has a space).
- ModelEngine `Lower-Scale-Limit` is already `0.0` (the pack asks for it).
- No id clashes: skill names `ars_*`, `ls_po_*`; CMD numbers are free on SHEARS and PAPER.

### What the pack items do (pack numbers)

| Item | Effect |
|---|---|
| Arc Staff L | Energy Orb: projectile, 3 damage, every 0.5 s |
| Arc Staff R | Thunder Impact: 1 s charge, projectile, 15 damage + slow in 2.5 blocks, cd 3 s |
| Arc Grimoire Shift + L | Teleport |
| Red potion S / L | heal 20 % / 40 % HP, cd 3 s |
| Purple S / L | Resistance + Fire Resistance 8 s / 16 s |
| Yellow S / L | Regeneration 1.5 s + Health Boost 10 s / 20 s |
| **Blue, Green** | **no effect in the pack** (drink animation and VFX only; the pack leaves the effect to us) |
| EXP S / L | +100 / +200 vanilla XP points |

## Test plan

1. `/mm items get LS_W_ARC_STAFF` (and the Grimoire): held, L / R / Shift + L work as the pack made them.
2. `/mm items get red_potion_small` …: right click drinks, effect + VFX, one is used up.

## Open questions

- **Arc Staff in our system:** a second worn two-handed staff (wood tier look like spec 040, or the pack's purple as a higher tier)? Energy Orb / Thunder Impact / Teleport as **skills on keys 1–5** for the staff stance? The Grimoire as an off-hand item (D-72 staff + off-hand) or only its Teleport as a skill?
- **Potions in our system:** which effects map to ours (HP / Mana / Stamina, spec 005); blue and green are empty in the pack, so blue = Mana and green = Stamina would fit; the EXP potion gives vanilla XP, not ours (spec 028); hotbar slots 6–9 use; MMOItems version when D-44 is decided.

## Implementation log

| Date | Repo | FIRE run | PR / branch | Notes |
|---|---|---|---|---|
| 2026-10-13 | wcmmo | — | `feat/041-arc-staff-potions` | Packs installed as shipped (`efa2b23`); loaded on the test server without new errors |
