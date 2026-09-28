# 003 — Void overworld

> Status: DONE · Target: wcmmo · FIRE mode: confirm

Backfilled from `wcmmo` commit `f18c219`.

## Big picture

- **Player story:** As a builder, I want an empty overworld so the whole map is hand-built / pasted from schematics.
- **Who is affected:** builders now; all players once the hub exists.
- **Done means:** level `wcmmo` generates a void flat overworld without any generator plugin.

## Systems & config

| Repo | File | Key | Value | Dev ≠ prod? |
|---|---|---|---|---|
| wcmmo | `server.properties` (untracked, per machine) | `level-name` | `wcmmo` | no — must match on both |
| wcmmo | `server.properties` | `level-type` / `generator-settings` | vanilla flat, void preset | no |
| wcmmo | `plugins/Multiverse-Core/worlds.yml` | `minecraft:overworld.spawn-location` | `8, -63, 8` | no |
| wcmmo | `plugins/WorldGuard/worlds/wcmmo*/` | per-dimension config | stock | no |

VoidGen was removed (vanilla preset replaces it). Old `world`/`world_nether`/`world_the_end` folders are gone.

## Data & IDs

Worlds registered in `docs/README.md` → Worlds.

## Balance

n/a.

## Commands & permissions

n/a.

## Performance

Void world: near-zero chunk gen cost. Mob spawning is still on (`spawning.monster.spawn: true`) — revisit when the hub spec lands.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Delete local `wcmmo/` level folder (after backup), boot | new void overworld generated, no VoidGen errors |
| 2 | Join | spawn at `8, -63, 8` on a platform or falling into void (expected until hub is pasted) |

## Rollback

- World data: restore the level folder from restic / local copy. Config: `git revert`.

## Acceptance criteria

- [x] No generator plugin installed.
- [x] Level name `wcmmo` documented in `server.properties.example` note / DEPLOY.

## Open questions

- `server.properties.example` still says `level-name=world` — update it to `wcmmo` (small autopilot fix, good first FIRE run).

## Implementation log

| Date | Repo | FIRE run | PR | Notes |
|---|---|---|---|---|
| 2026-09-23 | wcmmo | — (pre-FIRE) | — | `f18c219` |
