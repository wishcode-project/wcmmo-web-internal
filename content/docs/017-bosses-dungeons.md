# 017 — World bosses, solo & party dungeons

> Status: DRAFT · Target: wcmmo-content (MythicMobs, MythicDungeons), wcmmo-plugins (`loot` module) · FIRE mode: validate
> Design: [GDD v2 §6](../gdd/wcmmo-gdd-v2.md#6-farming-zones-monster-tiers-bosses--dungeons) · Decisions: D-17, D-17b, D-18

## Big picture

- **Player story:** Scheduled world bosses reward everyone who helped; solo dungeons test mechanics; party dungeons need Tank/DPS/Support.
- **Done means:** one world boss, one solo dungeon, one party dungeon, contribution-based loot.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo-content | MythicMobs bosses | phases, mechanics requiring Frontguard, perfect guards and positioning (I-frame deferred, D-49) |
| wcmmo-content | MythicDungeons | solo + party dungeon templates |
| wcmmo-plugins | `loot` module | damage-contribution tracking and distribution (D-17) |
| wcmmo | CMI Schedules or plugin scheduler | world boss times (D-17b) |

## Data & IDs

| ID | Kind |
|---|---|
| `wcmmo_mob_boss_world_01` | world boss |
| `wcmmo_dungeon_solo_01` | solo dungeon |
| `wcmmo_dungeon_party_01` | party dungeon |

## Balance (proposed)

| Rule | Value |
|---|---|
| World boss loot eligibility | hit the boss at least once **or** within 32 blocks when it dies → random loot roll (D-17) |
| MVP bonus | top 1 / 2 / 3 damage → bigger reward tiers; everyone else a base tier |
| Schedule | 2× daily at fixed Thai peak times + admin summon (`/wcmmo boss spawn`) (D-17b) |
| Party dungeon size | 2–5 players (D-18); roles come from Bloodline + Runes + weapon |
| Solo dungeon | solo only |
| Solo dungeon lockout | none; entry ticket item |
| Party dungeon lockout | 1 reward/day |

## Commands & permissions

| Command | Permission |
|---|---|
| `/wcmmo boss spawn <id>` | `wcmmo.admin.boss` |

## Performance

World boss arena: separate region, entity cap, particles reduced (`purpur.yml`/client settings). Target MSPT ≤ 45 with 50 players.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | 3 players hit boss (60/39/1 %) | all 3 eligible; 0.5 % player not |
| 2 | Party of 4 clears party dungeon | loot once per day |

## Rollback

Disable schedule; instances unaffected.

## Acceptance criteria

- [ ] D-17, D-17b, D-18 decided.
