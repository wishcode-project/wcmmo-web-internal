# 009 — Combat states: Frontguard, parry, Super Armour

> Status: DRAFT (input revised 2026-10-03 for D-68) · Target: wcmmo (Skript `wcmmo_10_combat.sk`, `wcmmo_00_config.sk`; MythicMobs skill flags) · FIRE mode: validate
> Design: [GDD v2 §4](../gdd/wcmmo-gdd-v2.md#4-combat--mechanics) · Decisions: **D-68** (F = guard / parry), D-06b, D-06c, D-06d, D-25, D-47, D-49
> Open before READY: T9 (F hold detection, below)

## Big picture

- **Player story:** As a player, I **hold F** to block from the front (Frontguard), **tap F just in time** to parry (perfect guard: the attacker is staggered), and power through CC with Super Armour. Heavy Hammer / Greatsword skills break guard and Super Armour (D-06d). **I-frame is deferred (D-49):** not built in Phase 0.
- **Bloodlines** plug in: Fury *Unstoppable* → Super Armour, *Death Defying* → 3 s Super Armour at 1 HP; Ward is built on Frontguard and perfect guards (Counterweight, Retribution, spec 021).
- **What changed (D-68, owner 2026-10-03):** the guard input moves from **Shift (hold)** to **F**; Shift is a plain sneak again. The parry is the existing perfect guard, not a new system. The packs' Defend / shield-raise animations become the guard and parry visuals.
- **Done means:** every damage / CC event between players and MythicMobs is resolved by the matrix below, with the F input, for players and mobs.

## Systems & config

Skript-first (D-25 / D-47, owner 2026-09-29): the PoC kit is the implementation; a Kotlin `combat` module may replace it after the D-25 review.

| Repo | File | What |
|---|---|---|
| wcmmo | `plugins/Skript/scripts/wcmmo_10_combat.sk` | **the only place that changes or cancels damage**; per-entity timed states; guard input |
| wcmmo | `plugins/Skript/scripts/wcmmo_00_config.sk` | `cfg::guard::*` values (Balance) |
| wcmmo | MythicMobs skills | ask for states through `wcmmostate`; mobs use tag `wcmmo_frontguard` |
| wcmmo | weapon skills (spec 036 / 037 format) | guard / parry animation on the held weapon's combat model |

## Guard input (D-68)

| Input | What the kit does |
|---|---|
| **F pressed** (swap-hand event, world only, weapon in hand, not sneaking) | cancel the vanilla hand swap; guard **up**; remember the press time (parry window) |
| **F held** | guard stays up (detection: T9) |
| **F released** | guard down |
| **F tapped** | guard up for the minimum guard time, then down; a hit inside the parry window = perfect guard |
| Shift + F | weapon twirl (spec 007), **no** guard |
| Shift alone | plain sneak, no guard |

**T9: F has no release event.** The client sends the swap-hand packet on press, and on key repeat while held (OS repeat: first repeat after ~0.25–0.5 s, then ~30 / s). Plan:

1. Guard stays up while swap-hand events keep arriving; it drops when no event came for `releaseTicks`.
2. The gap before the first key repeat is covered by `minGuardTicks` (a tap always gives that much guard).
3. PoC test on Windows and macOS clients with default key repeat. **Fallback if repeat is unreliable:** F press = guard for `minGuardTicks`, each further press extends it, or F toggles guard on / off. The parry stays on the press either way.

## Rules

| Attacker ↓ / Defender → | Normal | Frontguard (front 120° cone) | Super Armour | I-frame |
|---|---|---|---|---|
| Normal hit | damage | chip damage (D-06b) + stamina drain | damage, no CC | deferred (D-49) |
| CC hit | damage + CC | blocked | damage, no CC | deferred |
| Armour-break hit | damage + CC | guard broken + damage | damage + CC | deferred |

- **Perfect guard = parry:** a front hit that lands within `perfectTicks` of the F press → no damage, attacker **staggered** `stagger::ticks`, "PERFECT GUARD" feedback, Ward Bloodline hooks (spec 021). An armour-break hit can't be parried (it breaks the guard).
- **Parry spam:** a new parry window opens only if the last F press was at least `parryRearmTicks` ago; spamming F still guards but can't parry.
- Guard breaks when Stamina reaches 0 → 1 s stagger; guard can't go up again until stamina recovers (`guardbroken`).
- States never stack duration; the longer one wins.
- Mobs: Frontguard while they have tag `wcmmo_frontguard` (Guard Elites, spec 033).

## Data & IDs

State keys: `wcmmo:frontguard`, `wcmmo:superarmour`, `wcmmo:armourbreak` (skill metadata); kit states `guardbroken`, `staggered`, `stunphase`. `wcmmo:iframe` reserved (D-49). Effect skill `wcmmo_fx_perfect_guard` (exists).

## Balance (proposed)

| Thing | Value |
|---|---|
| Frontguard chip damage | 20 % (D-06b) |
| Front cone | 120° (`frontDot` 0.5) |
| Frontguard stamina drain per blocked hit | 10 |
| Stamina drain while guarding | 5 / s |
| Hammer / Greatsword normal hit vs guard | stamina drain ×2 (D-06d) |
| Guard-break skill per weapon | 1, long cooldown (D-06d) |
| Guard-break stagger | 20 ticks |
| **Parry window** (`perfectTicks`) | 6 ticks = 0.3 s after the F press (unchanged) |
| Parry stagger on the attacker | 20 ticks |
| **Parry re-arm** (`parryRearmTicks`) | 20 ticks = 1 s (new) |
| **Minimum guard per press** (`minGuardTicks`) | 12 ticks = 0.6 s (new, covers the key-repeat gap) |
| **Release after the last F event** (`releaseTicks`) | 4 ticks = 0.2 s (new, T9) |
| ~~I-frames~~ | deferred (D-49) |

## Commands & permissions

| Command | Permission | Behaviour |
|---|---|---|
| `/wcmmodebug` | `wcmmo.admin.combat` | prints the damage pipeline (exists, PoC-2) |

## Performance

Resolver runs only inside damage events; F handling is event-driven (swap-hand). The guard release check joins the kit's existing 5-tick loop (no new task). State stored per entity, cleared on death / quit. Budget: < 0.5 ms / tick at 200 players (spark).

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Hold a weapon, hold F, mob hits from the front / behind | chip / full damage; blue glow while guarding; no item moves to the off-hand |
| 2 | Release F | guard drops within 0.2 s |
| 3 | Tap F just before a mob hit | PERFECT GUARD, no damage, mob staggered 1 s |
| 4 | Tap F twice within 1 s, hit lands after the 2nd | guard, no parry (re-arm) |
| 5 | Guard until stamina hits 0 | guard broken, 1 s stagger, F does nothing until stamina is back |
| 6 | Hammer armour-break skill vs a guarding player | guard broken + damage |
| 7 | Mob with Super Armour hit by a stun | damage, no stun |
| 8 | Shift (sneak) while a mob hits | full damage, no guard |
| 9 | Shift + F | twirl, no guard |
| 10 | F in the inventory over an item | tooltip page 2 (spec 026), no guard |
| 11 | T9: hold F 3 s on Windows and macOS | guard stays up the whole time, no flicker |

## Rollback

Restore `wcmmo_10_combat.sk` from `develop` before this change (guard on sneak, PoC-2). No player data.

## Acceptance criteria

- [x] PoC-2 functional pass (2026-10-02, `run-wcmmo-003`) with the old input (Shift).
- [ ] Rerun with F input (test plan above), T9 answered, MSPT report.

## Open questions

- T9 · F hold detection (above). D-06c: arenas only now; later open-world PvP outside safe zones between players Lv 25+.

## Implementation log

| Date | Repo | FIRE run | PR | Notes |
|---|---|---|---|---|
| 2026-10-02 | wcmmo | `run-wcmmo-002` | branch `feat/mmo-core-setup` | MythicLib chance mitigation off (`roll: '0'` for block / dodge / parry). In-game: no Blocked / Dodged / Parried. |
| 2026-10-02 | wcmmo | `run-wcmmo-003` | branch `feat/009-combat-poc` | PoC-2 functional pass (1 player): Frontguard chip 20 % from the front only, stamina drain, guard break (stamina / heavy attack), perfect guard, Super Armour. Placeholder feedback: action bar texts + glow (blue Frontguard, orange Super Armour, yellow stun). `/wcmmodebug` prints the pipeline. PvP rows and MSPT report still open. |
| 2026-10-03 | wcmmo-specs | — | — | Input moved to F (D-68): hold = Frontguard, tap = parry, re-arm, min guard, release timer. Kit not changed yet. |
