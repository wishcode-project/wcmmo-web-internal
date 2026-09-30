# 007 — Controls, skill slots & bar swap (classless)

> Status: DRAFT · Target: wcmmo (Skript `wcmmo_30_skillbar.sk`, MMOCore skills, MythicHUD) · FIRE mode: validate
> Design: [GDD v2 §3](../gdd/wcmmo-gdd-v2.md#3-weapon-freedom--compartmentalised-progression) · Decisions: D-03 (revised), D-04c, D-50, D-51, D-53

> Filename kept for history: the spec was "classes & skill bars" before GDD v2 removed classes.

## Big picture

- **Player story:** As a player, I slot 10 active skills in two bars of 5, swap bars with **F** mid-combat, attack with my weapon's normal input, guard by holding Shift, and unleash my weapon's ultimate with **Q** when my Remnant gauge is full.
- **No classes:** any player can slot any general skill. Weapon skills (spec 008) can be slotted once unlocked by Mastery (spec 023), but only cast with that weapon in hand.
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
| Skill keys | cast the slot of the active bar | MMOCore casting mode |

## Rules

1. **10 slots = bar 1 (5) + bar 2 (5).** The ultimate is on Q and doesn't take a slot.
2. **Bar swap on F** (world only): cancel the vanilla hand swap, toggle bar, 0.5 s anti-spam, HUD shows `%wcmmo_skillbar%`. Cooldowns keep running across swaps.
3. Casting a slotted **weapon skill** while holding a different weapon type → fails with "Requires <Weapon>", no cooldown or cost used.
4. Loadout changes only out of combat (5 s since the last hit).
5. **Basic attack speed:** AGI raises basic attack / shot speed, **+0.5 % per point, capped at +30 %** (D-50). Skill cooldowns are not affected by AGI (Mastery owns them, spec 023).
6. **Bow / Crossbow basic shot:** right click fires an arrow at once with the weapon's damage; shot interval 0.75 s (Bow) / 1.0 s (Crossbow, heavier bolt), lowered by AGI down to the cap (Bow 0.55 s).
7. ⚠️ FPV weapons: the Draconic pack uses F (off-hand) today. When FPV weapons are ported (D-44), F belongs to the bar swap.

## Data & IDs

| ID | Kind |
|---|---|
| general skills (10) and weapon skills (5 + ultimate per weapon) | spec 008, `docs/README.md` → Skills |
| `%wcmmo_skillbar%` | placeholder: 1 or 2 |

## Balance (proposed)

| Setting | Value |
|---|---|
| Active slots | 10 = bar 1 (5) + bar 2 (5), + ultimate on Q |
| Swap cooldown | 0.5 s |
| Out-of-combat timer for loadout edits | 5 s |
| AGI basic attack speed | +0.5 %/point, cap +30 % |
| Bow / Crossbow shot interval | 0.75 s / 1.0 s → min 0.55 s / 0.75 s |

## Commands & permissions

| Command | Permission | Groups | Behaviour |
|---|---|---|---|
| `/skills` | MMOCore default | default | open skill GUI to slot skills |
| `/wcmmo skillbar reset <player>` | `wcmmo.admin.skillbar` | admin | reset bars |

## Performance

Event-driven only (click, swap-hand, drop events); no repeating tasks.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Slot 10 skills, cast from bar 1, press F | HUD shows bar 2; bar-1 cooldowns continue; no item moves to the off-hand |
| 2 | Hold a bow, right click | arrow fires instantly, no draw animation needed |
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

- Which MMOCore casting mode binds the active bar's 5 slots to the skill keys (next step after PoC-3).
