# 007 — Controls, skill slots & bar swap (classless)

> Status: DRAFT · Target: wcmmo (Skript `wcmmo_30_skillbar.sk`, MMOCore skills, MythicHUD) · FIRE mode: validate
> Design: [GDD v2 §3](../gdd/wcmmo-gdd-v2.md#3-weapon-freedom--compartmentalised-progression) · Decisions: D-03 (revised), D-04c, D-50, D-51, D-53

> Filename kept for history: the spec was "classes & skill bars" before GDD v2 removed classes.

## Big picture

- **Player story:** As a player, I arrange the skills I **own** in two sets of 5 and one ultimate slot, switch sets with **F** mid-combat, cast with quick **3-click combos**, attack with my weapon's normal input, guard by holding Shift, and unleash the ultimate I slotted with **Q** when my Remnant gauge is full.
- **Skills belong to the player, not to the weapon (owner, 2026-10-02):** once a player has a skill (learned, bought as an orb and consumed, quest…), it can go in **any** slot. The weapon in hand only decides whether a skill can be **used right now**; some skills need no weapon at all.
- **Done means:** the control scheme below works with every slice weapon, with no input clashes.

## Controls (decided 2026-09-30)

| Input | Action | Notes |
|---|---|---|
| Left click | basic attack: Sword, Hammer, Greatsword, Spear, Staff, Tome | Staff/Tome basic = short magic bolt |
| **Right click** | basic attack: **Bow, Crossbow**: shoots **instantly**, no charging (D-53) | vanilla bow draw is cancelled and replaced |
| Shift (hold) | **Guard** (Frontguard, spec 009) | doesn't use a skill slot |
| **F** | **swap skill bar 1 ↔ 2** (D-03 revised: was Shift + Right Click) | right click is taken by bows |
| **Q** | **ultimate** of the held weapon, needs 100 Remnant (D-51, spec 025) | Q no longer drops items in the world; drop items from the inventory screen |
| F in the inventory, hovering an item | next page of the item's details (D-54, spec 026) | a different event from F in the world: no clash |
| **3-click combo** | cast slot 1–5 of the active set (D-60 revised 2026-10-02). Melee / Staff / Tome: `R-L-R`, `R-R-R`, `R-L-L`, `R-R-L`, `L-R-L`. Bow / Crossbow (mirrored): `L-R-L`, `L-L-L`, `L-R-R`, `L-L-R`, `R-L-R` | like MMOCore key combos, done by the kit; MMOCore casting is `NONE`. A combo may start with either click; clicks inside a combo don't attack / shoot |
| **1–9** | plain hotbar: weapons, potions, food in any slot | switching to another weapon: no basic attacks for 5 s (skills still work) |

## Rules

1. **10 slots = set 1 (slots 1–5) + set 2 (slots 6–10), plus 1 ultimate slot.** One loadout per player, used with every weapon.
2. **Set switch on F** (world only): cancel the vanilla hand swap, toggle the set, 0.5 s anti-spam, HUD shows `%wcmmo_skillbar%`. Cooldowns keep running across switches.
3. **Owning skills:** permission `wcmmo.skill.<id>` (or the kit's grant list). **Ultimates** are owned when that weapon's Mastery is at the cap (spec 023).
4. **Using a skill:** if it needs a weapon type and another one is held → "needs a <Weapon>", no cooldown or cost used. Skills with weapon `any` always work.
5. **Ultimate slot:** the player puts one owned ultimate there; **Q** casts it at 100 Remnant **if the held weapon matches**, otherwise "needs a <Weapon>".
6. **Combos:** 3 clicks, each within 1 s of the last. A combo that starts with the weapon's basic click (e.g. `L-R-L` for melee) needs its 2nd click within 0.35 s, so normal attacks followed by a skill aren't misread.
7. **Weapon swap cooldown: 5 s** (owner's starting value). Switching to another weapon is always allowed, but the new weapon **can't make basic attacks** (hits, shots, bolts) for 5 s; **skills still work**. The action bar counts down ("attacks ready in 3.2 s") and shows "Weapon ready" at the end. Potions / food and going back to the same weapon slot don't start it.
8. **Loadout screen `/skills`** (PoC: one 6-row window): row 1 = slots 1–5 + ultimate slot, row 2 = slots 6–10, row 3 = page buttons, rows 4–6 = owned skills (27 per page). Click a skill, then a slot; right click a slot to empty it; a skill sits in one slot at a time. Final screen (list in the inventory area) = UltimateUI.
9. **Skill set display:** while a weapon is held, the HUD shows the **five slots of the active set**, each with its skill and **cooldown** (ready / seconds left / wrong weapon / empty), plus the ultimate and Remnant. F switches which set is shown; the other set's cooldowns keep running. PoC: a text boss bar (`wcmmo_32_skill_hud.sk`); final: skill icons in MythicHUD (spec 029).
10. Loadout changes only out of combat (5 s since the last hit). *(not enforced in the PoC yet)*
11. **Basic attack speed:** AGI raises basic attack / shot speed, **+0.5 % per point, capped at +30 %** (D-50). Skill cooldowns are not affected by AGI (Mastery owns them, spec 023).
12. **Bow / Crossbow basic shot:** right click fires an arrow at once with the weapon's damage; shot interval 0.75 s (Bow) / 1.0 s (Crossbow, heavier bolt), lowered by AGI down to the cap (Bow 0.55 s). **Natural arrow (owner, 2026-10-02):** launched with a velocity and normal gravity, no range limit, no aim assist; it disappears when it hits or shortly after it lands.
13. ⚠️ FPV weapons: the Draconic pack uses F (off-hand) today. When FPV weapons are ported (D-44), F belongs to the bar swap.

## Data & IDs

| ID | Kind |
|---|---|
| general skills (10) and weapon skills (5 + ultimate per weapon) | spec 008, `docs/README.md` → Skills |
| `%wcmmo_skillbar%` | placeholder: 1 or 2 |

## Balance (proposed)

| Setting | Value |
|---|---|
| Active slots | 10 = set 1 (5) + set 2 (5), + 1 ultimate slot on Q |
| Combo timeout / link window | 1 s between clicks / 0.35 s for combos starting with the basic click |
| Weapon swap cooldown | **5 s** without basic attacks (starting value) |
| Global cooldown between casts | 0.5 s |
| Swap cooldown | 0.5 s |
| Out-of-combat timer for loadout edits | 5 s |
| AGI basic attack speed | +0.5 %/point, cap +30 % |
| Bow / Crossbow shot interval | 0.75 s / 1.0 s → min 0.55 s / 0.75 s |
| Bow / Crossbow basic shot | a natural arrow: launch velocity 0.8 blocks / tick, normal gravity, **no range limit**; leaves from the right-hand side |
| Basic shot arrow | disappears at once when it hits something, 0.5 s after landing, or after 5 s; never stuck in a body, never picked up |

## Commands & permissions

| Command | Permission | Groups | Behaviour |
|---|---|---|---|
| `/skills` | none | default | open the loadout screen (kit, `wcmmo_31_skills_gui.sk`) |
| `/wcmmoskill give\|take <player> <skill\|all>` | `wcmmo.admin.skillbar` | admin | grant / remove skills |
| `/wcmmomasteryset <player> <weapon> <level>` | `wcmmo.admin.skillbar` | admin | tests: set a Mastery level |
| `/wcmmo skillbar reset <player>` | `wcmmo.admin.skillbar` | admin | reset bars |

## Performance

Event-driven only (click, arm-swing, swap-hand, drop, held-item events); no repeating tasks.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Slot 10 skills, cast from bar 1, press F | HUD shows bar 2; bar-1 cooldowns continue; no item moves to the off-hand |
| 2 | Hold a bow, right click | arrow fires instantly, no draw animation needed |
| 2b | Shoot a mob, then the ground | mob: damage, no arrow left in it; ground: arrow disappears after 0.5 s and can't be picked up |
| 3 | Hold a bow, spam right click | shots limited to the interval; faster with more AGI, never below the cap |
| 4 | Hold a bow, press F | bars swap, nothing shot |
| 5 | Press Q with < 100 Remnant / with 100 | "Remnant not full" / ultimate fires, gauge back to 0 |
| 6 | Press Q in the world | the held item is **not** dropped |
| 7 | Open inventory, hover an MMOItems weapon, press F | tooltip shows page 2 (spec 026) |
| 8 | Slot Hammer *Ground Smash*, hold a Sword, cast | "Requires Hammer", no cooldown used |

## Rollback

Disable the script; MMOCore default casting and vanilla F / Q come back.

## Acceptance criteria

- [ ] PoC-3 PASS for tests 1–6 (F / Q / instant bow without clashes).

## Open questions

- Which MMOCore casting mode lets keys 1–5 cast while the weapon stays in hand (PoC-3). HUD: spec 029.
