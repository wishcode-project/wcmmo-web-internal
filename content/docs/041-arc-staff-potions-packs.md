# 041 — Arc Staff and Potions packs

> Status: IN-PROGRESS · Target: wcmmo (MythicMobs, ModelEngine, Nexo) · FIRE mode: confirm
> Design: GDD v2 §3 · Decisions: D-72 (staff stances), D-70 (tiers), D-75 / D-78 (skills on keys 1–5), D-44 (OPEN)
> Answers: M24 (another Staff pack + a Tome: Llama Studio **Arc Staff**; consumables: **Potions v1.1**, owner 2026-10-13)

## Big picture

- **Player story:** more staff looks and skills (an Arc Staff, a Grimoire) and potion items with drink effects.
- **Owner, 2026-10-13:** the packs are installed **as shipped** first; then the Arc Staff joins our worn weapons and **staves get a grimoire for the left slot (D-79)**. Potions: still as shipped (Open questions).
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

## Arc Staff and grimoire in our system (D-79, owner 2026-10-13)

"Arc Staff = main hand; a staff with a book in the left hand, like a sword has a second sword or a shield; the book adds stats and gives the warp." **Corrected the same day:** the first staff (Wooden Staff, spec 040) is the **two-handed** one and stays so; the grimoire pairs with a **one-handed** staff: "staff 1, book 1" = the Arc Staff.

| Left slot → | empty | grimoire | anything else |
|---|---|---|---|
| **One-handed staff** (Arc Staff) in the right slot | stance `staff` | stance `staffbook` (Teleport usable) | blocked: no fighting, warning |
| **Two-handed staff** (Wooden Staff) | stance `staff2h` | blocked | blocked |

| Thing | Id | Notes |
|---|---|---|
| Arc Staff | MythicMobs `wcmmo_item_staff_arc` (COAL 6953), lore `Main hand · one-handed` | the pack's colours = tier 3 (D-70); the Wooden Staff stays tier 1 |
| Arc Grimoire | `wcmmo_item_grimoire_arc` (COAL 6955), lore `Off-hand only` | stats: with D-44 |
| On the body | ModelEngine `wcmmo_staff_arc` (back, the spear's back pose like spec 040), `wcmmo_book_arc` (0.6 ×, lower back left) | `scripts/staff_arc.py`; first frame of the pack's animated texture |
| In the hands (combat mode) | Nexo `wcmmo_staff_arc_held` (IRON_SPEAR 6954; hotbar shows the cross: item model `wcmmo:staff_arc_held`), `wcmmo_book_arc_held` (PAPER 6860) in the **left hand** | combat grips (spec 039): the held item and the off-hand item are put aside and given back |
| Kit | `wcmmo_38_stance.sk`: `cfg::part::staff` / `::book`, per-weapon settings `cfg::weapon::<item>::prefix / basic / grip / gripModel` (win over the stance's), `cfg::book::<item>::prefix / grip`; `wcmmo_39_kit_input.sk`: `wcmmo_offGripSync` | `staff2h` keeps the Wooden Staff (`cfg::part::twohand`) |

### Controls (combat mode)

| Input | Does | Numbers |
|---|---|---|
| L with the Arc Staff | **Energy Orb**: projectile, 20 blocks | 2 damage, every 0.5 s |
| L with the Wooden Staff | Zoltraak beam (spec 040) | 2.5, every 0.7 s |
| skill (any staff, one- or two-handed) | **Thunder Impact**: 1 s charge, then a ball that bursts on hit | 6 damage + 2 s slow in 2.5 blocks, cd 8 s, 25 mana |
| skill (any staff, one- or two-handed) | Zoltraak Barrage, Double Jump (spec 040) | |
| skill (**one-handed staff + grimoire**) | **Teleport** (purple): 10 blocks along the crosshair, **through walls** (owner, 2026-10-13: the pack's Teleport crossed objects and that is kept, now on purpose); lands on the nearest spot with room to stand | cd 6 s, 15 mana |
| skill (**one-handed staff + grimoire**) | **Blink** (green, new): up to 10 blocks along the crosshair, **stops in front of the first block** (ray trace from the eyes and the feet) | cd 4 s, 10 mana |
| R tap / hold | parry / Frontguard | |

Effects use the pack's models and mobs (`ls_w_arc_staff_*`, `ars_*`); damage numbers are ours (`wcmmo_staff_arc.yml`). Skills belong to the player (D-75): Thunder Impact works with either staff.

### Test plan (worn)

1. `/mm items give <you> wcmmo_item_staff_arc`, wear it right: staff on the back. Tap Shift: staff in the hand, hotbar shows the cross; L = Energy Orb.
2. `/mm items give <you> wcmmo_item_grimoire_arc`, wear it left: book on the lower back. Tap Shift: book in the left hand (an off-hand item comes back after); tap again: both back on the body.
3. Wooden Staff + grimoire, or a sword / shield on the left next to the Arc Staff: warning, no fighting.
4. `/skills`: Thunder Impact (any staff), Teleport and Blink (staff + grimoire); cast with keys 1–5. Teleport crosses a wall, Blink stops in front of it; neither lands inside a block.

## Open questions

- **Potions in our system** (not started): which effects map to ours (HP / Mana / Stamina, spec 005); blue and green are empty in the pack, so blue = Mana and green = Stamina would fit; the EXP potion gives vanilla XP, not ours (spec 028); MMOItems version when D-44 is decided.
- Grimoire stats (D-44). One-handed staff / dual staves / staff + shield (D-72) are not built.
- The Thunder Impact charge effects follow the caster by teleporting a holder every tick (the pack's way): on the owner's server such holders froze before (spec 039 step 1); watch it in the test.

## Implementation log

| Date | Repo | FIRE run | PR / branch | Notes |
|---|---|---|---|---|
| 2026-10-13 | wcmmo | — | `feat/041-arc-staff-potions` | Packs installed as shipped (`efa2b23`); loaded on the test server without new errors |
| 2026-10-13 | wcmmo | — | `feat/041-arc-staff-potions` | Arc Staff worn + grimoire in the left slot (D-79, `7b3cd0c`). Checked on the test server with a mob caster: Energy Orb hits (20 → 18.08), Thunder Impact bursts (20 → 14.1), Teleport moves the caster, Barrage still fine. Stance / off-hand grip code loads; not yet tried by a player |
| 2026-10-13 | wcmmo | — | `feat/041-arc-staff-potions` | Owner's correction (`4f8ad35`): the Wooden Staff stays two-handed (`staff2h`), only the one-handed Arc Staff takes the grimoire |
| 2026-10-13 | wcmmo | — | `feat/041-arc-staff-potions` | Thunder Impact and Teleport show the pack's own skill pictures in `/skills` and the hotbar (`cfg::skill::<id>::nexoIcon`, Nexo `wcmmo_icon_arc_*` on PAPER). Energy Orb is the Arc Staff's basic attack (L), so it has no skill slot to show its picture in |
| 2026-10-13 | wcmmo | — | `feat/041-arc-staff-potions` | Teleport went through walls (owner): the pack's projectile moves 3 blocks a tick. The kit now does the move with a ray trace (`wcmmo_blink`, `cfg::skill::<id>::blink`), `2c22698`. Ray check on the test server: wall 5.5 away = 5.5, open = 10; the move itself not yet tried by a player |
| 2026-10-13 | wcmmo | — | `feat/041-arc-staff-potions` | Owner: purple Teleport keeps crossing walls; new green skill **Blink** has the block-safe move. Blink = the pack's Teleport effect + skill picture hue-shifted to green (`wcmmo_blink_fx`, `wcmmo_icon_blink`). Loaded on the test server, green effect spawns; the moves not yet tried by a player |
