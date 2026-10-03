# 007 — Controls & skill loadouts (classless)

> Status: DRAFT (rewritten 2026-10-03 for D-68) · Target: wcmmo (Skript `wcmmo_30_skillbar.sk`, `wcmmo_31_skills_gui.sk`, `wcmmo_32_skill_hud.sk`, `wcmmo_35_remnant.sk`, `wcmmo_36_basic_attacks.sk`, `wcmmo_10_combat.sk`) · FIRE mode: validate
> Design: [GDD v2 §3](../gdd/wcmmo-gdd-v2.md#3-weapon-freedom--compartmentalised-progression) · Decisions: **D-68** (combat style C), **D-73** (loadout per stance), D-69 / D-72 (stances, spec 038), D-74 (guard), D-60 (revised), D-53 (revised), D-04c, D-44 (OPEN), D-50, D-51 · D-03 superseded
> Open before READY: M20 (how the ultimate is owned), M21 (Q buff list), M22 (skill list per stance), T9 (F hold, see spec 009)
> **2026-10-04, D-75 / D-76 (owner) — read this first, it overrides the tables below where they differ:**
> - Hotbar **slots 1–5 = skill icons, always** (never items: nothing can be lost). Slots 6–9 free. **Keys 1–5 cast** the active set while a weapon is held; holding something else, the key goes back to the last weapon.
> - **One loadout of 10 skills** for every weapon (set 1 = 1–5, set 2 = 6–10). **Shift + right click** switches the set. Skills that need another stance show greyed out. D-73 (per-stance loadouts) is superseded.
> - ~~Tap Shift = draw / sheathe~~ (D-76) **tried and dropped the same day**: attacking draws the weapon, 5 s after the last hit it goes back on the back; keys 1–5 cast whenever a weapon is held.
> - 3-click combos stay as a bonus (cast the active set). Q buff, Shift + Q ultimate, F guard / parry, Shift + F twirl unchanged.
> - Built in `wcmmo_33_hotbar.sk` (2026-10-04). Known limit: scrolling onto slots 1–5 counts as a key press.

> Filename kept for history: the spec was "classes & skill bars" before GDD v2 removed classes, then "skill bars" before D-68 removed the bar swap.

## Big picture

- **Player story:** As a player, every weapon hits with **left click**. For each weapon type I set up **5 combo skills** in `/skills`, and they come with me whenever I hold that type. I guard and parry with **F**, show off with **Shift + F**, and my own **buff (Q)** and **ultimate (Shift + Q)** work with any weapon.
- **Why (owner, 2026-10-03):** animated weapons (specs 036 / 037) make hitting feel good; the player's skills sit on top of them (GDD D-68, option C).
- **Who is affected:** every player holding a weapon.
- **Done means:** the controls below work with every weapon type, with no input clashes, and `/skills` sets a loadout per weapon type.

## Controls (D-68, 2026-10-03)

| Input | Action | Notes |
|---|---|---|
| **Left click** | **basic attack of the held weapon: every weapon, bows and crossbows too** | fixed, not a slot. Melee: the weapon's hit / 3-hit combo animation; Staff / Tome: short magic bolt; Bow / Crossbow: instant natural arrow (rule 9) |
| **3-click combo** | cast slot 1–5 of the **current stance's** loadout (D-73; the stance comes from main + off-hand, spec 038) | `R-L-R`, `R-R-R`, `R-L-L`, `R-R-L`, `L-R-L`; same table for every weapon (bows no longer mirrored) |
| Right click alone | nothing (starts a combo) | vanilla bow draw / shield / eat with a weapon in hand is cancelled |
| **F (hold)** | **Block** in the sword & shield stance, **Frontguard** in every other stance (D-74, spec 009) | moved from Shift. Pressing F also opens the **parry** window (perfect guard, spec 009) |
| **F (tap in time)** | **parry** = perfect guard: hit within 0.3 s of the press → attacker staggered | same input as the guard, no extra key |
| **Shift + F** | **weapon twirl**: a show-off animation of the held weapon | rule 7. Does **not** start the guard |
| **Q** | **buff**: the player's own buff skill (M21) | personal skill, works with any weapon |
| **Shift + Q** | **ultimate**: the player's own ultimate, needs 100 Remnant (D-51, spec 025) | personal skill (M20). Q never drops items in the world; drop from the inventory screen |
| Shift (alone) | plain sneak | no longer the guard |
| F in the inventory, hovering an item | next page of the item's details (D-54, spec 026) | a different event from F in the world: no clash |
| **1–9** | plain hotbar: weapons, potions, food in any slot | switching to another weapon: no basic attacks for 5 s (skills still work) |

## Rules

1. **The kit owns every input.** Clicks, F, Shift + F, Q and Shift + Q are read by the kit only. A weapon item never casts skills from its own click triggers: it only shows its model (back model on hold, combat model while attacking, spec 036 / 037 format). The kit calls the weapon's MythicMobs skills (basic attack animation, weapon skills, twirl). Needs D-44: MMOItems weapon (stats, type, Mastery) + the kit's trigger layer. Until then the Crucible wooden weapons keep their own controls as test items.
2. **Loadout per stance (D-73):** each stance has **5 combo slots**: single sword, dual swords, sword & shield (spec 038), spear, bow, the staff stances (D-72) and the other types as they arrive. Holding a weapon uses its current stance's 5 slots. No set swap.
3. **What fits a slot:** owned skills that have an **animation in that stance** (the packs' moves live in one stance's model, e.g. Dash = dual swords, Rush = sword & shield, Shove = spear), plus skills that need no weapon animation (weapon `any`, spec 008). The full list per stance is M22. The same skill may sit in several stances' loadouts; its cooldown is shared.
4. **Personal skills:** one **buff slot (Q)** and one **ultimate slot (Shift + Q)**, the same with every weapon. Buffs: list missing (M21). Ultimate: owned as today (Mastery cap of a weapon, spec 023) until M20 says otherwise; until then it also needs the weapon it came from.
5. **Owning skills:** permission `wcmmo.skill.<id>` (or the kit's grant list).
6. **Combos:** 3 clicks, each within 1 s of the last. `L-R-L` starts with the basic click, so it needs its 2nd click within 0.35 s, else the first L is a plain attack. Clicks inside a combo don't attack.
7. **Weapon twirl (Shift + F, owner 2026-10-03):** plays the held weapon's twirl animation (the packs' emotes). Show-off first. Later: unlocked by that weapon type's Mastery (level TBD), and may carry a small buff; while testing a buff can be attached. **Own cooldown, separate from Q.** The `/skills` screen has the twirl slot from the start; at launch it is locked until the Mastery unlock.
8. **Weapon swap cooldown: 5 s.** Switching to another weapon is always allowed, but the new weapon **can't make basic attacks** for 5 s; **skills still work**. The action bar counts down ("attacks ready in 3.2 s") and shows "Weapon ready" at the end. Potions / food and going back to the same weapon slot don't start it.
9. **Bow / Crossbow basic shot (D-53 revised):** **left click** fires an arrow at once with the weapon's damage; shot interval 0.75 s (Bow) / 1.0 s (Crossbow), lowered by AGI down to the cap (Bow 0.55 s). Natural arrow: launched with a velocity and normal gravity, no range limit, no aim assist; it disappears when it hits or shortly after it lands.
10. **Loadout screen `/skills`:** page 1 = the stances (stances the player has no skill for are greyed) + **Personal** (buff slot, ultimate slot, twirl slot). Click a stance → its 5 combo slots (each shows its combo, e.g. `R-L-R`) + the owned skills that fit (rule 3), 27 per page. Click a skill, then a slot; right click a slot to empty it. Loadout changes only out of combat (5 s since the last hit). Final screen = UltimateUI.
11. **HUD:** while a weapon is held: the **held type's 5 slots** with their combo and cooldown (ready / seconds left / empty), plus buff (Q), ultimate (Shift + Q) and Remnant. PoC: text boss bar (`wcmmo_32_skill_hud.sk`); final: MythicHUD icons (spec 029).
12. **Basic attack speed:** AGI raises basic attack / shot speed, **+0.5 % per point, capped at +30 %** (D-50). Skill cooldowns are not affected by AGI (Mastery owns them, spec 023).

## Changes to the PoC-3 kit (what to build)

| File | Today (PoC-3, `run-wcmmo-004`) | After this spec |
|---|---|---|
| `wcmmo_30_skillbar.sk` | 10 slots in 2 sets, F swaps sets, combo table mirrored for bows (`combo::L::*` / `combo::R::*`), right click = bow shot | 5 slots per weapon type, one combo table, F handed to the guard (009), Shift + F twirl, right click only starts combos |
| `wcmmo_31_skills_gui.sk` | one window: slots 1–10 + ultimate | weapon-type page → type page; Personal page (buff, ultimate, twirl) |
| `wcmmo_32_skill_hud.sk` | shows the active set (1 or 2) | shows the held type's 5 slots + Q / Shift + Q |
| `wcmmo_35_remnant.sk` | Q casts the ultimate | Q = buff, Shift + Q = ultimate |
| `wcmmo_36_basic_attacks.sk` | bow shot on right click | bow shot on left click |
| `wcmmo_10_combat.sk` | guard on sneak | guard on F (spec 009) |
| data | `{wcmmo::loadout::<player>::<1..10>}` | `{wcmmo::loadout::<player>::<type>::<1..5>}`, `{…::buff}`, `{…::ult}`, `{…::twirl}`. Migration: old slots 1–5 → the type of each skill; the rest dropped (test data only) |

## Data & IDs

| ID | Kind |
|---|---|
| general skills, weapon skills (+ the packs' moves as weapon skills) | spec 008, `docs/README.md` → Skills (M22) |
| buff skills | M21, not registered yet |
| `%wcmmo_skillbar%` | **removed** (no sets). New: `%wcmmo_loadout_type%` = held weapon type |

## Balance (proposed)

| Setting | Value |
|---|---|
| Combo slots | **5 per weapon type** (8 types), + buff (Q) + ultimate (Shift + Q) + twirl (Shift + F) |
| Combo timeout / link window | 1 s between clicks / 0.35 s for `L-R-L` |
| Weapon swap cooldown | **5 s** without basic attacks |
| Global cooldown between casts | 0.5 s |
| Out-of-combat timer for loadout edits | 5 s |
| Twirl cooldown | 3 s (own timer, not Q's) |
| AGI basic attack speed | +0.5 %/point, cap +30 % |
| Bow / Crossbow shot interval | 0.75 s / 1.0 s → min 0.55 s / 0.75 s |
| Bow / Crossbow basic shot | natural arrow: launch velocity 0.8 blocks / tick, normal gravity, **no range limit**; leaves from the right-hand side |
| Basic shot arrow | disappears at once when it hits something, 0.5 s after landing, or after 5 s; never stuck in a body, never picked up |

## Commands & permissions

| Command | Permission | Groups | Behaviour |
|---|---|---|---|
| `/skills` | none | default | open the loadout screen |
| `/wcmmoskill give\|take <player> <skill\|all>` | `wcmmo.admin.skillbar` | admin | grant / remove skills |
| `/wcmmomasteryset <player> <weapon> <level>` | `wcmmo.admin.skillbar` | admin | tests: set a Mastery level |
| `/wcmmoskillreset <player>` | `wcmmo.admin.skillbar` | admin | reset every loadout of the player |

## Performance

Event-driven only (click, arm-swing, swap-hand, drop, sneak, held-item events); no new repeating tasks. The HUD keeps its 5-tick refresh.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Hold a Sword, left click | basic attack, no skill |
| 2 | Hold a Bow, left click | arrow fires instantly; right click alone: nothing, no bow draw |
| 3 | Bow, spam left click | shots limited to the interval; faster with more AGI, never below the cap |
| 4 | `/skills` → Sword → put a skill in `R-L-R`; hold a Sword, do `R-L-R` | skill casts; clicks in the combo don't attack |
| 5 | Same skill in Spear `R-R-R`; cast it with a Sword, switch to a Spear | Spear shows it on cooldown (shared) |
| 6 | Hold a Hammer (empty loadout), do `R-L-R` | "no skill on this combo" |
| 7 | Hold F / tap F just before a mob hit | Frontguard / perfect guard (spec 009) |
| 8 | Shift + F | twirl animation, no guard, 3 s cooldown |
| 9 | Q / Shift + Q with < 100 / 100 Remnant | buff casts / ultimate: "Remnant not full" or fires; item **not** dropped |
| 10 | Open inventory, hover an MMOItems weapon, press F | tooltip page 2 (spec 026), no guard |
| 11 | Switch weapon, left click at once | "attacks ready in …", combos still cast |

## Rollback

Restore the PoC-3 kit files from `develop` before this change (`run-wcmmo-004` version: 2 sets, F swap, Shift guard). Loadout data is test-only.

## Acceptance criteria

- [x] PoC-3 PASS (2026-10-02, `run-wcmmo-004`) for the old scheme (2 sets / F swap / Q ultimate / bow right click). **Superseded by D-68.**
- [ ] PoC-3 rerun with the D-68 controls (test plan above), T9 answered.

## How to test (dev box, 2026-10-04 build)

1. `/mm reload` → `/sk reload all` (models unchanged).
2. `/wcmmoskill give all <you>` → you own every skill and the test buff.
3. `/skills` → pick a stance (e.g. Dual Swords) → click Dash Strike, then the `R-L-R` slot; Personal → put War Cry in the buff slot.
4. Hold the matching weapons (spec 038 items) and run the test plan above.

Stance skills registered: Dual Swords `Dash Strike`, `Spin Slash` · Sword & Shield `Shield Rush` · Single Sword `Charge` · Spear `Shove`, `Hard Swing` · Bow `Rapid Shot`, `Power Shot` · buff `War Cry` (test, M21).

## Open questions

- M20 · ultimate ownership; M21 · Q buff list; M22 · which skills fit a weapon type (`gdd/owner-questions.md`). T9 · F hold detection (spec 009).

## Implementation log

| Date | Repo | FIRE run | PR | Notes |
|---|---|---|---|---|
| 2026-10-02 | wcmmo | `run-wcmmo-004` | branch `feat/007-skillbar-poc` → `develop` | PoC-3 pass (old scheme). Kit files: `wcmmo_30_skillbar.sk` (loadout, combos, weapon swap), `wcmmo_31_skills_gui.sk` (`/skills`), `wcmmo_32_skill_hud.sk` (set display, text), `wcmmo_35_remnant.sk` (ultimate slot). Not built: out-of-combat loadout rule, icons (029), UltimateUI screen. |
| 2026-10-03 | wcmmo-specs | — | — | Rewritten for D-68 (combat style C). Kit not changed yet. |
| 2026-10-03 | wcmmo-specs | — | — | D-73: loadouts per stance; D-74: F hold = Block with a shield |
| 2026-10-04 | wcmmo | — (no FIRE run) | `feat/007-stance-controls` @ `14d421a` | Kit rewritten for D-68 / D-73: stance loadouts, L basic for all, Q buff / Shift + Q ult, `/skills` per stance + Personal, HUD per stance. Loads clean; in game pending |
| 2026-10-04 | wcmmo | — (no FIRE run) | `feat/007-stance-controls` | D-75 / D-76: skill hotbar (slots 1–5 locked icons, keys cast, 2 sets, Shift + right click), tap Shift draw / sheathe, `/skills` one page (10 + buff + ultimate). Loads clean; in game pending |
| 2026-10-04 | wcmmo | — | `feat/007-stance-controls` | D-76 dropped (owner): tap-Shift draw removed, attacks draw as before; skill hotbar kept |
| 2026-10-04 | wcmmo | — | `feat/007-stance-controls` @ `657546c` | **Rolled back** to `adc58e6` (owner): since the kit took over the clicks (`14d421a`) the combat holder stopped following the player. `/wcmmoholders` showed the holder alive with the right owner, but not teleporting. Cause unknown; the D-68 / D-75 controls are still the design, the build must be redone once the holder issue is understood |
| 2026-10-04 | wcmmo | — | `feat/007-stance-controls` @ `657546c` | Owner confirmed after the rollback: everything works as before (holder follows again) |
