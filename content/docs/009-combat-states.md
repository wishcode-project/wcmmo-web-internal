# 009 — Combat states: Frontguard, I-frame, Super Armour

> Status: DRAFT · Target: wcmmo-plugins (`wcmmo-core` module `combat`), wcmmo-content (skill flags) · FIRE mode: validate
> Design: [GDD v2 §4](../gdd/wcmmo-gdd-v2.md#4-combat--mechanics) · Decisions: D-06b, D-06c, D-06d, D-25

## Big picture

- **Player story:** As a player, I block from the front (Frontguard) and power through CC (Super Armour). **I-frame (dodging through attacks) is deferred (D-49, 2026-09-30):** not built in Phase 0, may return later; heavy Hammer/Greatsword skills break guard and Super Armour (D-06d). Bloodlines can grant states (Fury *Unstoppable* → Super Armour, *Death Defying* → 3 s Super Armour at 1 HP; Ward is built on Frontguard and perfect guards, spec 021).
- **Done means:** every damage/CC event between players and MythicMobs is resolved by the matrix below, for both players and mobs.

## Systems & config

| Repo | Module / file | What |
|---|---|---|
| wcmmo-plugins | `combat/CombatStateService` | per-entity state flags with expiry (ticks) |
| wcmmo-plugins | `combat/DamageResolver` | listens to MythicLib/Paper damage events, applies matrix |
| wcmmo-content | skills | set state: `iframe:<ticks>`, `frontguard`, `superarmour:<ticks>`, `armourbreak` |
| wcmmo-content | MythicMobs | mobs can have Super Armour / Frontguard too |

## Rules

| Attacker ↓ / Defender → | Normal | Frontguard (front 120° cone) | Super Armour | I-frame |
|---|---|---|---|---|
| Normal hit | damage | chip damage (D-06b) + stamina drain | damage, no CC | ignored |
| CC hit | damage + CC | blocked | damage, no CC | ignored |
| Armour-break hit | damage + CC | guard broken + damage | damage + CC | ignored |

- Guard breaks when Stamina reaches 0 → 1 s stagger.
- States never stack duration; the longer one wins.

## Data & IDs

State keys: `wcmmo:iframe`, `wcmmo:frontguard`, `wcmmo:superarmour`, `wcmmo:armourbreak` (skill metadata).

## Balance (proposed)

| Thing | Value |
|---|---|
| ~~Dash I-frame~~ | deferred (D-49) |
| ~~Sword short I-frame~~ | deferred (D-49) |
| Frontguard chip damage | 20 % (D-06b) |
| Guard-break skill per weapon | 1, long cooldown (D-06d) |
| Hammer / Greatsword normal hit vs guard | stamina drain ×2 (D-06d) |
| Frontguard stamina drain per blocked hit | 10 |
| Guard-break stagger | 20 ticks |

## Commands & permissions

| Command | Permission | Behaviour |
|---|---|---|
| `/wcmmo combat debug` | `wcmmo.admin.combat` | action-bar shows own states + last resolution |

## Performance

Resolver runs only inside damage events; state stored in a per-entity map cleared on death/quit. Budget: < 0.5 ms/tick at 200 players (spark).

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Test mob hits player during dash | no damage |
| 2 | Player in Frontguard hit from front / behind | chip / full |
| 3 | Mob with Super Armour hit by stun | damage, no stun |
| 4 | Same mob hit by a Hammer armour-break stun | damage + stun |

## Rollback

Disable module via config flag `combat.enabled: false`.

## Acceptance criteria

- [ ] PoC-2 PASS; D-06b, D-25 decided.

## Open questions

- none. D-06c: arenas only now; later open-world PvP outside safe zones between players Lv 25+.
