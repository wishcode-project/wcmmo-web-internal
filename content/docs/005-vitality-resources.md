# 005 — Vitality: HP, Mana, Stamina, food as consumables

> Status: DRAFT · Target: wcmmo (MMOCore, MMOItems), wcmmo-plugins · FIRE mode: validate
> Design: [GDD v2 §1](../gdd/wcmmo-gdd-v2.md#1-core-vitality--survival) · Decisions: D-01, D-02, D-03a, D-30

## Big picture

- **Player story:** As a player, I manage HP, Mana and Stamina in combat; I never starve; food is a buff/heal tool.
- **Done means:** vanilla hunger never changes; stamina gates dash and physical skills; food heals over time with cooldown groups.

## Systems & config

| Repo | Plugin / file | What |
|---|---|---|
| wcmmo | MMOCore `config.yml` (classless: one default profile) | base/max/regen for mana & stamina |
| wcmmo | MMOItems consumables | food items with heal-over-time + cooldown group |
| wcmmo-plugins | `wcmmo-core` module `vitality` | freeze hunger (food level locked at 20 or drives stamina display per D-01); dash action |
| wcmmo | `purpur.yml` | none expected — verify no hunger-related override needed |

## Data & IDs

| ID | Kind | Notes |
|---|---|---|
| `mana` | MMOCore resource | built-in |
| `stamina` | MMOCore resource | built-in |
| `wcmmo_skill_dash` | skill | stamina cost; pure movement (no I-frame, D-49) |
| `wcmmo_cdgroup_meal`, `wcmmo_cdgroup_potion` | cooldown groups | consumables share cooldown per group |

## Balance (proposed)

| Resource | Base | Per level | Regen | Notes |
|---|---|---|---|---|
| HP | 100 | +5, +DEF utility (006, D-30) | 1 %/s out of combat (5 s) | |
| Mana | 100 | +2, +INT utility (D-30) | 2/s | |
| Stamina | 100 | +0, +AGI utility (D-30); Fury stage 2A restores on hit (021) | 10/s after 1 s without spending | |

| Action | Stamina cost |
|---|---|
| Dash (`wcmmo_skill_dash`) | 25 |
| Sprint | small drain, *proposed* 3/s (D-03a) |
| Frontguard hold | 5/s + per-block drain (009) |

| Consumable | Effect | Duration | Cooldown group | Cooldown |
|---|---|---|---|---|
| Bread (starter meal) | +40 HP over time | 8 s | meal | 20 s |
| Minor HP potion | +25 % HP instant | — | potion | 15 s |

Food = heal over time + buffs; potions = instant heal. Food and potions use separate cooldown groups (D-02).

## Commands & permissions

n/a.

## Performance

Regen ticks handled by MMOCore; the vitality module must not schedule per-player tasks faster than every 5 ticks.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Sprint and jump for 5 min | hunger stays full and hidden; stamina drains slowly on the MythicHUD bar (D-01, D-03a) |
| 2 | Dash 5× in a row | 4 succeed, 5th blocked "Not enough stamina" |
| 3 | Eat bread twice | second blocked by meal cooldown; potion still usable |

## Rollback

Revert content + plugin module; no player data change beyond MMOCore resource values.

## Acceptance criteria

- [x] D-01, D-02, D-03a decided (2026-09-29).
- [ ] PoC-6 (004) PASS.

## Open questions

- none (D-01: MythicHUD bar; hunger locked full and hidden).

## Implementation log

| Date | Repo | FIRE run | PR | Notes |
|---|---|---|---|---|
| 2026-10-02 | wcmmo | `run-wcmmo-002` | branch `feat/mmo-core-setup` | MMOCore class `wcmmo`: HP 100 +5 / level, Mana 100 +2 (regen 2/s), Stamina 100 (regen 10/s); MythicLib health scale on (10 hearts). **Not done yet:** HP regen 1 %/s out of combat, stamina regen delay (kit). |
