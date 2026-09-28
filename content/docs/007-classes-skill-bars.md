# 007 — Skill slots & bar swap (classless)

> Status: DRAFT · Target: wcmmo-content (MMOCore skills), wcmmo-plugins (`skillbar` module) · FIRE mode: validate
> Design: [GDD v2 §3](../gdd/wcmmo-gdd-v2.md#3-weapon-freedom--compartmentalised-progression) · Decisions: D-03, D-04c

> Filename kept for history: the spec was "classes & skill bars" before GDD v2 removed classes.

## Big picture

- **Player story:** As a player, I equip 10 active skills in two bars of 5 and swap bars with `Shift + Right Click` mid-combat for combos.
- **No classes:** any player can slot any general skill. Unique weapon skills (spec 008/023) can be slotted once unlocked, but only cast with that weapon in hand.
- **Done means:** 10 slots, instant swap, cooldowns keep running across swaps, the weapon-specific casting cap is enforced.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo-content | MMOCore skill-casting config | casting bound to bar slots |
| wcmmo-plugins | `wcmmo-core` module `skillbar` | 2×5 bar state, swap on `Shift + Right Click`, HUD, weapon-type cast check |

## Rules

1. Swap = sneaking + right click (main hand or air). Handled on `PlayerInteractEvent` while sneaking.
2. ⚠️ The swap must not also: draw a bow/crossbow, eat/drink, place a block, or open a container. PoC-3 must prove each (spec 004). If any clash can't be solved, fallback is `Shift+F` (D-03).
3. Casting a slotted **unique weapon skill** while holding a different weapon type → fail with "Requires <Weapon>", no cooldown or cost used.
4. Loadout changes only out of combat (5 s since last hit).

## Data & IDs

| ID | Kind |
|---|---|
| `wcmmo_skill_dash` | general skill (005) |
| general / unique skills | see `docs/README.md` → Skills |

## Balance (proposed)

| Setting | Value |
|---|---|
| Active slots | 10 = bar 1 (5) + bar 2 (5) |
| Swap cooldown | 0.5 s |
| Out-of-combat timer for loadout edits | 5 s |

## Commands & permissions

| Command | Permission | Groups | Behaviour |
|---|---|---|---|
| `/skills` | MMOCore default | default | open skill GUI to slot skills |
| `/wcmmo skillbar reset <player>` | `wcmmo.admin.skillbar` | admin | reset bars |

## Performance

Event-driven only; no repeating tasks.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Slot 10 skills, cast from bar 1, `Shift+RMB` | HUD shows bar 2; bar-1 cooldowns continue |
| 2 | Hold bow, `Shift+RMB` | bars swap, bow is **not** drawn |
| 3 | Hold food, `Shift+RMB` | bars swap, food not eaten |
| 4 | Look at a chest, `Shift+RMB` | bars swap, chest not opened |
| 5 | Slot Hammer *Ground Smash*, hold Sword, cast | "Requires Hammer", no cooldown used |

## Rollback

Disable module; MMOCore default casting remains.

## Acceptance criteria

- [ ] PoC-3 PASS for tests 2–4, or D-03 changed to the fallback.

## Open questions

- D-04c: source of general skills.
