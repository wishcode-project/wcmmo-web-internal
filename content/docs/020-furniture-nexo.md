# 020 — Furniture (Nexo) & lifeskill NPCs

> Status: DRAFT · Target: wcmmo (Nexo, Citizens, BetonQuest) · FIRE mode: confirm
> Design: [GDD v2 §8](../gdd/wcmmo-gdd-v2.md#8-lifezone--housing-heartopia-style) · Decisions: D-23

## Big picture

- **Player story:** As a player, I buy cute themed furniture from city NPCs or earn it through lifeskill side quests, and decorate my Lifezone house.
- **Done means:** a starter furniture set exists, can be bought/crafted, placed only in own plot, and survives house migration (018).

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | `Nexo/items/furniture/*.yml` + pack assets | furniture definitions |
| wcmmo | Citizens shop / BetonQuest | furniture NPC + side quests |

## Data & IDs

| ID | Set | Source |
|---|---|---|
| `wcmmo_furn_starter_bed` | starter | NPC shop |
| `wcmmo_furn_starter_table` | starter | NPC shop |
| `wcmmo_furn_starter_chair` | starter | NPC shop |
| `wcmmo_furn_starter_lamp` | starter | crafting |
| `wcmmo_npc_furniture_merchant` | NPC | city hub |

## Balance

Prices set in the economy spec (§11). Until then: placeholder prices, not for launch.

## Commands & permissions

Placement only inside own plot region (018).

## Performance

Limit furniture per plot: *proposed* 150 entities (Nexo furniture uses entities).

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Buy starter set from NPC | 4 items received |
| 2 | Place outside own plot | denied |
| 3 | Place 151st furniture | denied |

## Rollback

Removing a furniture ID leaves broken entities — never delete furniture IDs after launch; hide from shops instead.

## Acceptance criteria

- [ ] D-23 decided; PoC-5 PASS.
