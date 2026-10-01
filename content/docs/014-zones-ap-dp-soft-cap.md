# 014 — Zones & AP/DP soft cap

> Status: DRAFT · Target: wcmmo (WorldGuard regions), wcmmo-plugins (`zones` module), wcmmo (MythicMobs) · FIRE mode: validate
> Design: [GDD v2 §6](../gdd/wcmmo-gdd-v2.md#6-farming-zones-monster-tiers-bosses--dungeons) · Decisions: D-13, D-13b

## Big picture

- **Player story:** As a player below a zone's AP I barely scratch mobs; at the recommended AP I farm well; far above it I gain less and cannot trivialise low zones.
- **Done means:** each farming zone is a WorldGuard region with recommended AP/DP; the plugin scales damage in/out per the curves below.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | `plugins/WorldGuard/worlds/wcmmo/regions.yml` | zone regions (flag `wcmmo-zone`) |
| wcmmo-plugins | `zones` module config `zones.yml` | region → tier, AP, DP |
| wcmmo-plugins | `zones/SoftCapService` | computes player AP/DP (D-13b) and multipliers |
| wcmmo | MythicMobs | mobs spawn only in their tier's regions |

## Rules

Player AP = weapon base + enhancement bonus (+ accessories). DP = armour + enhancement + accessories. Stats, Runes, Mastery and Bloodlines never add AP/DP (GDD v2 compartments).

| AP ratio (player / zone) | Outgoing damage multiplier |
|---|---|
| < 0.7 | 0.15 |
| 0.7 – 1.0 | linear 0.15 → 1.0 |
| > 1.0 | 1.0 + (ratio − 1.0) × 0.5 |

| DP ratio | Incoming damage multiplier |
|---|---|
| < 0.7 | 2.0 |
| 0.7 – 1.0 | linear 2.0 → 1.0 |
| > 1.0 | max(0.5, 1.0 − (ratio − 1.0) × 0.5) |

## Data & IDs

| Region | Tier | AP | DP |
|---|---|---|---|
| `wcmmo__zone_low_01` | Low | 50 | 60 |

(More zones added by map specs.)

## Commands & permissions

| Command | Permission | Behaviour |
|---|---|---|
| `/apdp` | `wcmmo.player.apdp` (default) | show own AP/DP and current zone recommendation |

## Performance

AP/DP cached per player, recalculated on equipment change only.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | AP 30 in Low zone | 15 % damage |
| 2 | AP 50 | 100 % |
| 3 | AP 150 | 200 % (not 300 %) |

## Rollback

Disable with `zones.enabled: false`.

## Acceptance criteria

- [ ] D-13, D-13b decided; zones registered.
