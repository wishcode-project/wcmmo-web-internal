# 038 — Weapon parts: main / off-hand stances, tiers, skins

> Status: DRAFT · Target: wcmmo (ModelEngine blueprints, MythicMobs skills, Skript kit, MMOItems, `scripts/wood_weapons.py`) · FIRE mode: confirm
> Design: GDD v2 §3 / §4 · Decisions: **D-69** (main + off-hand), **D-70** (3 tiers), **D-71** (skins), D-68 (controls), D-44 (OPEN), D-04
> Open before READY: T10 (PoC below), M23 (off-hand stats), M24 (packs to buy)

## Big picture

- **Player story:** As a player, I carry any one-handed sword in my main hand and another sword or a shield in my off-hand; the game plays the dual-sword or sword-and-shield moves with **the two items I actually hold**, and each keeps its own tier look or skin.
- **Owner, 2026-10-03:** main hand + off-hand like MU, **not** crafting two items into one (splitting it again and skins getting lost or stuck would be a mess). 3 tiers Wood → Iron → the packs' colours. Skins: yes, since it is possible.
- **Done means:** the PoC (test plan) shows two different swords and a shield on the stances with correct grips; then tiers and skins use the same path.

## How it works: animation belongs to the stance, look belongs to the item

| Piece | What | Example |
|---|---|---|
| **Stance model** | one ModelEngine model per stance with the animations (combat, back pose, guard, twirl) and **named blade bones** | `wcmmo_stance_dual` (Two Sword Style animations): bones `main_blade`, `off_blade` · `wcmmo_stance_shield` (Castle Knight): `main_blade`, `off_shield` · `wcmmo_stance_spear` (Basic Polearm): `main_blade` |
| **Part model** | one model per item look, a single bone with the same grip pivot | `wcmmo_part_sword_wood`, `wcmmo_part_sword_iron`, `wcmmo_part_shield_wood` |
| **Swap** | when the stance model is attached (hold, combat start, back to the back), the kit swaps each blade bone to the held item's part | `changepart{mid=wcmmo_stance_dual;pid=off_blade;nmid=wcmmo_part_sword_iron;npid=blade} @self` |

ModelEngine 4.1.1 has `changepart` (`mid`, `pid`, `nmid`, `npid`): the bone keeps the stance's animation, only its geometry comes from the other model. Checked in the installed jar, **not yet in game** (T10). Backup path: an ITEM bone + `linkitembone{pid=…;slot=HAND|OFF_HAND}` shows the held item's own item model on the bone (simpler skins, but vanilla item-model limits).

## Stances (D-69)

| Main hand | Off-hand | Stance | Animations from |
|---|---|---|---|
| one-handed sword | one-handed sword | **dual swords** | Two Sword Style |
| one-handed sword | shield | **sword & shield** | Castle Knight |
| one-handed sword | empty | **single sword** | Castle Knight with `off_shield` hidden (`partvisibility`), to try in the PoC; a bought single-sword set later (M24) |
| two-handed (Spear, Staff, Bow, Greatsword, Hammer, Crossbow, Tome: TBD per type) | must be empty | the type's own | its pack |
| two-handed | not empty | — | basic attacks blocked, action bar "Two-handed: empty your off-hand" |

Rules:

1. **Off-hand from the inventory only:** the player drags the item into the vanilla off-hand slot. F never moves items (it is the guard, D-68), so no dupe risk (spec 010 F7).
2. The kit re-reads both hands on held-item change, inventory close and off-hand slot change, re-picks the stance and re-swaps the parts. Nothing runs per tick.
3. **Loadouts (spec 007)** follow the stance's weapon type: dual swords and sword & shield are **Sword** until M18 says otherwise.
4. **Grip rule for part models:** every one-handed sword part has its grip at the bone pivot, blade along +Y, same as the stance's original blade; blade length may differ. Shields: strap at the pivot. The script checks this (bounding box vs pivot).
5. **Stats:** both items are MMOItems items; the off-hand's share of stats is M23. Two-handed types use MMOItems' two-handed flag.

## Tiers (D-70)

| Tier | Look | Made by |
|---|---|---|
| 1 Wood | wood / leather / straw (specs 036 / 037) | `wood_weapons.py`, ramps `WOOD`, `LEATHER`, `STRAW` |
| 2 Iron | iron / dark leather / steel-white effects | same script, new ramps (iron `#3a3f45` → `#d9dde2`, accents leather, effects `#8e98a3` → `#f4f8fb`) |
| 3 Pack colours | the bought packs as shipped | copy without recolour |

Each tier = part models (per weapon type) + icons; the stance models are shared by all tiers.

## Skins (D-71)

- The tier look is the item's **default skin**. A skin is another part model + icon for the same weapon type, swapped the same way.
- Applied with **MMOItems skins** (drag a skin item onto the weapon). The kit reads the item's skin id and picks `wcmmo_part_<type>_<skin>`; no skin → the tier part.
- Removing / changing a skin is MMOItems' own flow, the item is never merged or split, so nothing gets lost or stuck.
- Cost: art only per skin (1 part model + 1 icon per weapon type). Code is one path for tiers and skins, event-driven.

## Data & IDs (proposed, to register when READY)

| ID | Kind |
|---|---|
| `wcmmo_stance_dual`, `_shield`, `_single`, `_spear`, `_bow`… | ModelEngine stance models |
| `wcmmo_part_<type>_<tier or skin>` (e.g. `wcmmo_part_sword_wood`, `wcmmo_part_shield_iron`) | ModelEngine part models |
| MMOItems types `WCMMO_SWORD`, `WCMMO_SHIELD`, … | D-44 port |

## Balance

n/a — looks only; tier stats belong to the gear spec, off-hand stats to M23.

## Performance

`changepart` runs once per stance attach / hand change, no repeating task. Same back-model / combat-model cost as spec 037 → Performance.

## Test plan: PoC (T10)

| # | Step | Expected |
|---|---|---|
| 1 | Build `wcmmo_stance_dual` from the Two Sword Style model with bones `main_blade` / `off_blade`, parts `wcmmo_part_sword_wood` + `_iron` | models load, no warnings |
| 2 | Wood sword main, iron sword off-hand; attack, guard, twirl | dual-sword animations, wood blade right / iron blade left, grips in the hands all through |
| 3 | Same with two wood swords | same moves, both wood |
| 4 | Wood sword + wood shield | sword & shield stance, Castle Knight animations |
| 5 | Wood sword alone | single sword (shield hidden): judge if it looks right |
| 6 | Spear + anything in the off-hand | "Two-handed: empty your off-hand", no basic attack |
| 7 | Swap the off-hand item in the inventory while holding | stance and parts change on close, nothing left over |
| 8 | Back pose (spec 037 format) with mixed swords | both blades on the back with their own looks |

## Rollback

Delete the stance / part models and the kit's stance code; the spec 037 weapons keep working as single items.

## Open questions

- T10 PoC (above) · M23 off-hand stats · M24 packs to buy · M18 weapon type of dual / shield.

## Implementation log

| Date | Repo | Run | Branch | Notes |
|---|---|---|---|---|
| 2026-10-03 | wcmmo-specs | — | — | Draft from the owner's design (D-69, D-70, D-71). `changepart` / `linkitembone` checked in ModelEngine 4.1.1, not tested in game |
