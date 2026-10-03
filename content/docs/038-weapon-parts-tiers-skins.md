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
| one-handed sword | empty (or anything that is not a sword / shield) | **single sword** | Castle Knight sword moves, own model without the shield. **2-hit combo** (the pack's 3rd hit is a shield bash), no Defend. On the back the blade hangs **diagonally, leaning like the dual stance's off blade** (owner, 2026-10-03); sword & shield keeps the upright sword behind the shield. A bought single-sword set later (M24) |
| two-handed (Spear, Staff, Bow, Greatsword, Hammer, Crossbow, Tome: TBD per type) | must be empty | the type's own | its pack |
| two-handed | **anything** | **blocked** | no attacks or moves until the off-hand is emptied; every refused click shows a title "✖ Two-handed weapon: empty your off-hand" + a low note sound. While a two-handed weapon is held, **nothing can be put in the off-hand slot** (inventory click and swap-to-off-hand key are cancelled) (owner, 2026-10-03) |
| shield | anything | — | a shield only works in the **off-hand**; in the main hand it is a bare fist |
| anything | two-handed weapon (spear, bow…) | — | **never allowed** (owner, 2026-10-03): the off-hand slot refuses it ("✖ Two-handed weapons can't go in the off-hand" + note sound); if one gets there anyway, its moves are blocked |

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

## PoC build (T10, 2026-10-03, branch `feat/038-weapon-parts`)

| Piece | Built as |
|---|---|
| Stance models | `wcmmo_stance_dual` + `_combat` (Two Sword Style; bones `main_blade` = the black sword, +x = main hand; `off_blade` = the purple sword), `wcmmo_stance_shield` + `_combat` (Castle Knight; `main_blade`, `off_shield`), `wcmmo_stance_single` + `_combat` (Castle Knight without the shield bone; back pose = the dual main blade's pose, computed by the script). Wood look by default |
| Part models | `ModelEngine/blueprints/wcmmo/parts/wcmmo_part_<key>`: swords have two bones, `xy` (Two Sword Style grip: flat of the blade faces z) and `yz` (Castle Knight grip: flat faces x); shields have `shield` |
| Parts made | `sword_wood` (Two Sword Style purple sword shape, wood) · `sword_iron` (Castle Knight sword shape, iron) · **`sword_draconic`** (Draconic pack sword, its own colours, **another vendor**: lies forward in its file and is ~6 px longer) · `shield_wood`, `shield_iron` (Castle Knight shield) |
| Script | `scripts/wood_weapons.py`: `STANCES`, `PARTS`; `rotate_element` turns a sword between grip conventions exactly (box, cube rotation, texture faces) so one sword fits every stance |
| Items (COAL, Nexo icon) | `wcmmo_item_sword_wood` 6945 · `_sword_iron` 6946 · `_shield_wood` 6947 · `_shield_iron` 6948 · `_sword_draconic` 6949 |
| Kit | `Skript/scripts/wcmmo_38_stance.sk`: every 10 ticks reads main + off-hand (`wcmmo_mythicType` in the bridge), acts only when a hand changed: `wcmmo_stance_clear` → `wcmmo_stance_main_<key>` / `_off_<key>` (set `<caster.var.wcmmo_main>` / `wcmmo_off`) → `wcmmo_stance_set_dual\|shield\|single` |
| Skills | `MythicMobs/skills/wcmmo_stance.yml` (stance, parts, click forwarders `wcmmo_wpn_swing` / `wcmmo_wpn_use`), `wcmmo_stance_dual.yml`, `wcmmo_stance_shield.yml` (the spec 037 moves + `changepart` after every model attach), holders in `mobs/wcmmo_stance.yml` |
| Two-handed block | the kit sets aura `wcmmo_twohand_blocked` (`wcmmo_stance_set_blocked`); `wcmmo_item_spear_wood`, `_bow_wood`, `_swords_wood`, `_sword_shield_wood` check it on every click |
| Controls in the PoC | still the spec 037 ones (L slash, R dash / defend, Shift + L swing / rush); D-68 controls come with the kit rewrite |

Grip findings: all three vendors put the bone pivot at the middle of the handle, so no offsets were needed, only a quarter turn (Two Sword Style ↔ Castle Knight) or laying the blade upright (Draconic).

## Test plan: PoC (T10)

Reload: `/meg reload` → `/nexo reload all` → `/mm reload` → `/sk reload all`. Items: `/mm items get wcmmo_item_sword_wood` (also `_sword_iron`, `_sword_draconic`, `_shield_wood`, `_shield_iron`). Put the off-hand item in the off-hand slot from the inventory. The stance follows within half a second.

| # | Step | Expected |
|---|---|---|
| 1 | Wood sword main, nothing off-hand | single sword **diagonal** on the back; L = **2-hit** combo, no shield anywhere; R does nothing |
| 2 | Wood sword main + iron sword off-hand | dual stance: wood blade on one side of the back, iron on the other; L / R / Shift + L = dual-sword moves, **wood in the right hand, iron in the left**, grips inside the hands the whole time |
| 3 | Swap them (iron main, wood off) | looks swap hands |
| 4 | Wood sword + Draconic sword, then Draconic + iron | the longer Draconic blade sits in the hand at the handle; judge size / style clash between vendors |
| 5 | Any sword + wood shield, then + iron shield | sword & shield stance: that sword in the right hand, that shield on the left arm; R = Defend |
| 6 | Change the off-hand item in the inventory while holding the sword | stance / looks change within 0.5 s, nothing left over, no doubled models |
| 7 | Stop fighting 5 s, walk, jump | blades go back on the back **with their own looks**, locked to the body (spec 037 format) |
| 8 | Switch to another hotbar slot, relog, die | everything removed; comes back when the sword is held again |
| 8b | Spear or bow in the main hand + **any item** in the off-hand | every click: title "✖ Two-handed weapon: empty your off-hand" + note sound, no attack / shot; remove the off-hand item → works again within 0.5 s |
| 8e | Try to put a spear or bow in the off-hand slot (click or swap-to-off-hand key), whatever is in the main hand | refused: "✖ Two-handed weapons can't go in the off-hand" + note sound |
| 8d | Holding a spear / bow, open the inventory, try to put an item in the off-hand slot (click, or the swap-to-off-hand key over a slot) | cancelled, same warning |
| 8c | Shield in the main hand | plain fist, no model |
| 9 | Wrong hand? | if the main-hand sword shows in the left hand, the packs' right hand is +x: swap `rename` in `STANCES` |

Report per row: works / looks wrong (which hand, which move, screenshot).

## PoC round 1 (owner, 2026-10-03): works, fixes

| Finding | Cause | Fix |
|---|---|---|
| Mixing works, vendors fit together ("แจ๋ว") | — | T10 core confirmed: `changepart` on player models and holders |
| Sword taken from the Two Sword Style black sword: texture looked wrong | that sword has an outline shell made of inside-out cubes; turning it for the other grip made them solid | `rotate_element` keeps inside-out cubes; the wood sword now uses the purple sword shape (no shell) |
| Draconic sword: a second sword always stuck in the hand | its icon model is shown in the hand in third person (the Llama icons hide themselves) | every part icon: hand / head display scale 0 |
| Single sword hit 3 times | 3rd hit of the Castle Knight combo is a shield bash | single stance: 2-hit combo, own skills `wcmmo_stance_single_*` |
| Single sword upright on the back | reused the sword & shield pose | own back model, diagonal like the dual main blade |
| Shield + two-handed weapon | not handled | blocked until the off-hand is emptied |

## PoC round 2 (owner, 2026-10-03)

| Finding | Cause | Fix |
|---|---|---|
| Draconic no longer doubled in the hand | — | confirmed |
| Single sword should lean the other way | pose taken from the dual main blade | pose from the dual **off** blade |
| Single stance: attacking showed the default sword, not the held one | the part swap on the combat holder was conditioned on "holder not spawned yet", and the condition was checked after the 1-tick delay (already spawned) | swap runs on every draw (1 and 3 ticks after), all three stances |
| Two-handed weapons still worked with other items in the off-hand; no warning shown | only swords / shields were blocked; action bar text didn't show | any off-hand item blocks; title + note sound on every refused click; off-hand slot closed while a two-handed weapon is held |

## Rollback

Delete the stance / part models and the kit's stance code; the spec 037 weapons keep working as single items.

## Open questions

- T10 PoC (above) · M23 off-hand stats · M24 packs to buy · M18 weapon type of dual / shield.

## Implementation log

| Date | Repo | Run | Branch | Notes |
|---|---|---|---|---|
| 2026-10-03 | wcmmo-specs | — | — | Draft from the owner's design (D-69, D-70, D-71). `changepart` / `linkitembone` checked in ModelEngine 4.1.1, not tested in game |
| 2026-10-03 | wcmmo | — (PoC, no FIRE run) | `feat/038-weapon-parts` | PoC build above. Checked: part geometry = source (0 diff), rotations round-trip, models / skills / Skript load with no errors on a throwaway server, icons 6945–6949 in the pack. **Not tested in game** (changepart on a player model, hand sides, UV of turned faces) |
| 2026-10-03 | wcmmo | — (PoC) | `feat/038-weapon-parts` | Round 1 fixes (table above). Loads clean on the throwaway server; round 2 in game pending |
| 2026-10-03 | wcmmo | — (PoC) | `feat/038-weapon-parts` | Round 2 fixes (table above). Loads clean; round 3 in game pending |
| 2026-10-03 | wcmmo | — (PoC) | `feat/038-weapon-parts` | Spear / bow (all two-handed) can't go in the off-hand; blocked if they get there. Loads clean |
| 2026-10-03 | wcmmo | — (PoC) | `feat/038-weapon-parts` | Dual swords: main-hand sword showed in the off hand (my guess −x = right was wrong for Two Sword Style); bones swapped. Single back pose unchanged |
