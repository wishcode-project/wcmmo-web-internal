# 040 — Wooden Staff (two-handed) from the Zoltraak pack

> Status: IN-PROGRESS · Target: wcmmo (ModelEngine, MythicMobs, Nexo, Skript kit) · FIRE mode: confirm
> Design: GDD v2 §3 · Decisions: D-72 (staff stances: this is the **two-handed staff** first), D-69 (two-handed rule), D-70 (tiers), D-75 / D-78 (skills on keys 1–5, right click guard), D-77 (worn weapons, spec 039)
> Answers: M24 (a Staff pack: Llama Studio **Zoltraak**, owner 2026-10-04), M25 partly (2H staff poses borrowed from the spear)

## Big picture

- **Player story:** I wear a Wooden Staff in the right weapon slot (left empty). It hangs on my back; tap Shift and I hold it like the pack's staff, left click fires a Zoltraak beam, keys 1–5 cast Zoltraak Barrage and Double Jump.
- **Owner, 2026-10-04:** two-handed staff first; tier 1 **wood** look like the other packs (the pack's purple = a later tier); on the back our ModelEngine model; **2026-10-05: in the hands it is held like the pack's own staff (the item), not a ModelEngine model**; Barrage and Double Jump are **skills on keys 1–5** (F stays free); the pack itself is installed **as it is, apart from ours**.
- **Done means:** the test plan below passes in game.

## What is installed

| Thing | Files | Notes |
|---|---|---|
| **The pack as it is** | `MythicMobs/{items,skills,mobs}/zoltraak_*.yml`, `ModelEngine/blueprints/zoltraak/`, `Nexo/items/zoltraak.yml`, Nexo `zoltraak_model` / `zoltraak_textures` | Untouched; item `zoltraak_staff` (held, the pack's own controls) |
| Wooden Staff item | MythicMobs `wcmmo_item_staff_wood` (COAL, Model 6951), Nexo `wcmmo_staff_wood` | Lore `Main hand · two-handed` (equipment screen restriction, spec 039) |
| Models | `ModelEngine/blueprints/wcmmo/staff_wood/`: `wcmmo_staff_wood` (back), `_beam` | Built by `scripts/staff_wood.py` |
| Staff in the hand | Nexo `wcmmo_staff_wood_held` (IRON_SPEAR like the pack, CMD 6952) | The kit's combat grip for `staff2h` (spec 039): put in the held slot in combat mode, the held item put aside; spear charge / pierce and attack damage removed, the stab swing kept |
| Skills | `MythicMobs/skills/wcmmo_staff_wood.yml`, mob `wcmmo_mob_staff_wood_beam` | |
| Kit | stance `staff2h` (`wcmmo_38_stance.sk`), skills in `wcmmo_00_config.sk` | two-handed: left slot must be empty |

## Models

- **Back:** `scripts/staff_wood.py` puts the staff mesh on the Wooden Spear's (spec 037) baked back pose (diagonal, `pv=true`, no animations).
- **Hands (combat mode):** no ModelEngine model. The pack's staff is an item held in the hand with its own look (IRON_SPEAR: stab swing on left click), so the kit's combat grip shows the wood staff item there (owner, 2026-10-05). First tried: the spear's two-handed poses with the staff mesh (dropped).
- Texture: wood ramp; the purple crystal / inlays become pale wood. The beam keeps the pack's purple.

## Controls (combat mode, spec 039)

| Input | Does | Numbers (tier 1) |
|---|---|---|
| L | **Zoltraak**: beam forward (31 blocks), slows what it hits; casting in the air hangs 0.5 s then slow fall | 2.5 damage, every 0.7 s |
| skill | **Zoltraak Barrage**: 5 beams on the nearest enemy within 20 blocks in front (nobody there: the spot 12 blocks ahead, so the cooldown is never wasted) | 1.5 × 4 hits around the target (r 2), cd 8 s, 20 mana |
| skill | **Double Jump**: jump up (on the ground: a high jump; in the air: a second jump), no fall damage | cd 4 s, 15 stamina |
| R tap / hold | parry / Frontguard (D-74, D-78) | |

## Test plan

1. `/mm items give <you> wcmmo_item_staff_wood`, put it in **Weapon right** in `/equip`: the staff shows on the back. Something in **Weapon left** → "two-handed" warning, no fighting.
2. Tap Shift: the staff leaves the back and is in the hand like the pack's staff (the held item comes back after); tap again: back on the back. Right click hold does not charge like a spear.
3. L: beam, hits and slows a dummy; in the air: hang, then slow fall.
4. Put Zoltraak Barrage and Double Jump in `/skills`, cast with keys 1–5 in combat mode; Barrage with no enemy hits the spot ahead.
5. The pack's own `zoltraak_staff` still works as the pack made it (held).

## Implementation log

| Date | Repo | FIRE run | PR / branch | Notes |
|---|---|---|---|---|
| 2026-10-04 | wcmmo | — | `feat/040-staff-zoltraak` | Pack installed as is; Wooden Staff models, skills, stance `staff2h` |
| 2026-10-05 | wcmmo | — | `feat/040-staff-zoltraak` | Kick fixed (`0887db2`: the pack's `lunge{v=0} @forward{f=0}` = NaN velocity; air hover by velocity, not stun); staff held as the pack's item in combat mode (`05d24e1`) |
