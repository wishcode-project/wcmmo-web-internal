# 015 — Monster tiers, loop farming & stationary farming

> Status: DRAFT · Target: wcmmo (MythicMobs), wcmmo-plugins (`totem` module), wcmmo (regions) · FIRE mode: confirm
> Design: [GDD v2 §6](../gdd/wcmmo-gdd-v2.md#6-farming-zones-monster-tiers-bosses--dungeons) · Decisions: D-16, D-16b

## Big picture

- **Player story:** As a mobile player I run rotations in open zones; as any player I can light a Totem and hold a spot against waves for 10 minutes.
- **Done means:** tiered mob packs respawn along rotations; Totem spots spawn waves for the activator/party only.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | MythicMobs mobs + spawners | tiered mobs, pack spawners in zone regions |
| wcmmo | MythicMobs skills | wave spawning towards the totem |
| wcmmo-plugins | `totem` module | spot ownership, timer, cost check, cleanup |
| wcmmo | WorldGuard | `wcmmo__totem_<zone>_<n>` regions |

## Data & IDs

| ID | Kind |
|---|---|
| `wcmmo_mob_<zone>_<name>` | per zone (registered with zone map spec) |
| `wcmmo_item_totem_low`, `_mid`, `_high` | activation cost (D-16) |
| `wcmmo__totem_low01_1` | example spot region |

## Balance (proposed)

| Tier | Mob level | Pack size | Respawn | Totem duration | Wave interval | Max alive |
|---|---|---|---|---|---|---|
| Low | 1–20 | 3–5 | 30 s | 10 min | 20 s | 15 |
| Mid | 20–40 | 4–6 | 40 s | 10 min | 20 s | 20 |
| High | 40–60 | 4–6 | 45 s | 10 min | 25 s | 20 |

## Commands & permissions

| Command | Permission | Behaviour |
|---|---|---|
| `/wcmmo totem stop <spot>` | `wcmmo.admin.totem` | force end |

## Performance

Hard cap alive mobs per spot (table); totem spots ≥ 48 blocks apart; mobs despawn when totem ends. Test 10 active totems → MSPT recorded.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Use totem item at a spot | waves for 10 min, only for owner/party |
| 2 | Second player uses same spot | "Spot in use (mm:ss left)" |
| 3 | Owner logs out | totem ends, mobs cleared within 5 s |

## Rollback

Disable module; MythicMobs spawners unaffected.

## Acceptance criteria

- [ ] D-16, D-16b decided.
