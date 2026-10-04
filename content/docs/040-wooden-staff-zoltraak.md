# 040 — Wooden Staff (two-handed) from the Zoltraak pack

> Status: IN-PROGRESS · Target: wcmmo (ModelEngine, MythicMobs, Nexo, Skript kit) · FIRE mode: confirm
> Design: GDD v2 §3 · Decisions: D-72 (staff stances: this is the **two-handed staff** first), D-69 (two-handed rule), D-70 (tiers), D-75 / D-78 (skills on keys 1–5, right click guard), D-77 (worn weapons, spec 039)
> Answers: M24 (a Staff pack: Llama Studio **Zoltraak**, owner 2026-10-04), M25 partly (2H staff poses borrowed from the spear)

## Big picture

- **Player story:** I wear a Wooden Staff in the right weapon slot (left empty). It hangs on my back; tap Shift and I hold it in both hands, left click fires a Zoltraak beam, keys 1–5 cast Zoltraak Barrage and Double Jump.
- **Owner, 2026-10-04:** two-handed staff first; tier 1 **wood** look like the other packs (the pack's purple = a later tier); ModelEngine models like the other weapons; Barrage and Double Jump are **skills on keys 1–5** (F stays free); the pack itself is installed **as it is, apart from ours**.
- **Done means:** the test plan below passes in game.

## What is installed

| Thing | Files | Notes |
|---|---|---|
| **The pack as it is** | `MythicMobs/{items,skills,mobs}/zoltraak_*.yml`, `ModelEngine/blueprints/zoltraak/`, `Nexo/items/zoltraak.yml`, Nexo `zoltraak_model` / `zoltraak_textures` | Untouched; item `zoltraak_staff` (held, the pack's own controls) |
| Wooden Staff item | MythicMobs `wcmmo_item_staff_wood` (COAL, Model 6951), Nexo `wcmmo_staff_wood` | Lore `Main hand · two-handed` (equipment screen restriction, spec 039) |
| Models | `ModelEngine/blueprints/wcmmo/staff_wood/`: `wcmmo_staff_wood` (back), `_combat` (hands), `_beam` | Built by `scripts/staff_wood.py` |
| Skills | `MythicMobs/skills/wcmmo_staff_wood.yml`, mob `wcmmo_mob_staff_wood_beam` | |
| Kit | stance `staff2h` (`wcmmo_38_stance.sk`), skills in `wcmmo_00_config.sk` | two-handed: left slot must be empty |

## Models

The pack's staff is only a Nexo item: **no player animations**. `scripts/staff_wood.py` takes the Wooden Spear's (spec 037) back and combat models and puts the staff mesh on the spear bone, so the staff uses the spear's two-handed poses:

- back: the spear's baked back pose (diagonal, `pv=true`, no animations)
- combat: `combat_idle`, `combat_to_idle`, **`cast`** (the spear's thrust at 0.4× length, for the beam), **`barrage`** (the thrust)
- texture: wood ramp; the purple crystal / inlays become pale wood. The beam keeps the pack's purple.

Real staff animations are still wanted (M25); swapping them in later only changes the model files.

## Controls (combat mode, spec 039)

| Input | Does | Numbers (tier 1) |
|---|---|---|
| L | **Zoltraak**: beam forward (31 blocks), slows what it hits; casting in the air hangs 0.5 s then slow fall | 2.5 damage, every 0.7 s |
| skill | **Zoltraak Barrage**: 5 beams on the nearest enemy within 20 blocks in front (nobody there: the spot 12 blocks ahead, so the cooldown is never wasted) | 1.5 × 4 hits around the target (r 2), cd 8 s, 20 mana |
| skill | **Double Jump**: jump up (on the ground: a high jump; in the air: a second jump), no fall damage | cd 4 s, 15 stamina |
| R tap / hold | parry / Frontguard (D-74, D-78) | |

## Test plan

1. `/mm items give <you> wcmmo_item_staff_wood`, put it in **Weapon right** in `/equip`: the staff shows on the back. Something in **Weapon left** → "two-handed" warning, no fighting.
2. Tap Shift: the staff comes to both hands; tap again: back on the back.
3. L: beam, hits and slows a dummy; in the air: hang, then slow fall.
4. Put Zoltraak Barrage and Double Jump in `/skills`, cast with keys 1–5 in combat mode; Barrage with no enemy hits the spot ahead.
5. The pack's own `zoltraak_staff` still works as the pack made it (held).

## Implementation log

| Date | Repo | FIRE run | PR / branch | Notes |
|---|---|---|---|---|
| 2026-10-04 | wcmmo | — | `feat/040-staff-zoltraak` | Pack installed as is; Wooden Staff models, skills, stance `staff2h` |
