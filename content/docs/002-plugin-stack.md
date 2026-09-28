# 002 — Base plugin stack

> Status: DONE · Target: wcmmo · FIRE mode: validate

Backfilled from `wcmmo` commits `f18c219` and `8bcbc6f`.

## Big picture

- **Player story:** As staff/builders, we need essentials, regions, world management, NPCs and fast building before any MMO content exists.
- **Who is affected:** builders and staff now; all players later.
- **Done means:** the plugins below load cleanly on Purpur 26.2 and their configs are tracked in `wcmmo`.

## Systems & config

| Plugin | Tracked config | Notes |
|---|---|---|
| CMI + CMILib | `plugins/CMI/**`, `plugins/CMILib/config.yml` | `Settings/DataBaseInfo.yml` untracked (DB password). Only `Locale_EN` translations tracked. |
| Vault | `plugins/Vault/config.yml` | economy provider = CMI |
| WorldGuard | `plugins/WorldGuard/config.yml`, `worlds/wcmmo*/` | stale `worlds/world*` and `worlds/dev` untracked |
| FastAsyncWorldEdit | `plugins/FastAsyncWorldEdit/{config,worldedit-config}.yml` | schematics live in `wcmmo-world` |
| Multiverse-Core | `plugins/Multiverse-Core/{config,worlds,anchors}.yml` | see 003 |
| Citizens | `plugins/Citizens/{config,saves,shops}.yml`, `templates/` | `lib/` untracked |
| spark | none (`plugins/spark/` ignored) | profiler |

### FAWE tuning for the dev box (8G heap)

| Key (`plugins/FastAsyncWorldEdit/config.yml`) | Stock | Dev | Prod |
|---|---|---|---|
| `max-memory-percent` | 95 | 85 | 85 |
| `slower-memory-percent` | 80 | 70 | 70 |
| `tick-limiter.enabled` | false | true | true |
| `queue.parallel-threads` | 12 | 6 | **VPS cores − 2** (open question in 001) |
| `queue.target-size` | 96 | 64 | 64 |
| `queue.extra-time-ms` | 0 | -10 | -10 |
| `queue.preload-chunk-count` | 512 | 256 | 256 |
| `queue.thread-target-size-percent` | 16 | 33 | 33 |
| `history.delete-on-logout` | true | false | false |

## Data & IDs

Plugins registered in `docs/README.md` → Plugin registry. No gameplay IDs.

## Balance

n/a. (`plugins/CMI/Saves/Worth.yml` is stock and will be replaced by an economy spec.)

## Commands & permissions

Stock commands only. Permission nodes are handled by the LuckPerms spec (not written yet).

## Performance

- FAWE values above trade edit speed for tick stability; verify with `/spark profiler` during a 1M-block `//set`.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Boot, then console `plugins` | all 8 plugins green |
| 2 | `//pos1`, `//pos2` over 100×100×100, `//set stone` while `spark tps` runs | TPS does not drop below 18 |
| 3 | Relog, `//undo` | undo still works (history kept) |

## Rollback

- `git revert` the plugin's config commit; remove the jar. No world data touched unless a WorldGuard region was created.

## Acceptance criteria

- [x] All plugins load without errors.
- [x] Secret-holding and regenerated files are gitignored.
- [ ] Plugin versions recorded in the registry (fill from the dev box).

## Open questions

- Keep CMI as the economy/perms provider long-term, or move perms to LuckPerms (planned per `.env.example`)? → needs an ADR.

## Implementation log

| Date | Repo | FIRE run | PR | Notes |
|---|---|---|---|---|
| 2026-09-23 | wcmmo | — (pre-FIRE) | — | `f18c219`, `8bcbc6f` |
