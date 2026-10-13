# 003 — Void overworld

> Status: DONE · Target: wcmmo · FIRE mode: confirm

Backfilled from `wcmmo` commit `f18c219`.

## Big picture

- **Player story:** As a builder, I want an empty overworld so the whole map is hand-built / pasted from schematics.
- **Who is affected:** builders now; all players once the hub exists.
- **Done means:** level `wcmmo` generates a void flat overworld without any generator plugin.
- **Owner, 2026-10-13 — the default world is now the hub map `spawn`** (a 1.12.2 void map, converted by the 26.2 server; spawn point 0, 65, 0). It is **tracked in `wcmmo`** (`spawn/level.dat` + the overworld's chunks) so every clone starts on the same world: the one exception to "never track world data". `spawn/players/` and `scoreboard.dat` stay untracked. Map game rules kept: no natural mob spawns, time fixed at noon. The old level `wcmmo` stays on the dev box, not loaded.

## Systems & config

| Repo | File | Key | Value | Dev ≠ prod? |
|---|---|---|---|---|
| wcmmo | `server.properties` (untracked, per machine) | `level-name` | `spawn` (was `wcmmo` until 2026-10-13) | no — must match on both |
| wcmmo | `server.properties` | `level-type` / `generator-settings` | `minecraft:flat` / `{"biome":"minecraft:the_void","layers":[{"block":"minecraft:air","height":1}]}` | no |
| wcmmo | `plugins/Multiverse-Core/worlds.yml` | `minecraft:overworld.spawn-location` | `0.5, 65, 0.5` (was `8, -63, 8`) | no |
| wcmmo | `plugins/WorldGuard/worlds/spawn*/` (and the old `wcmmo*/`) | per-dimension config | stock | no |
| wcmmo | `spawn/` | the hub map (tracked) | converted 1.12.2 map; original kept untracked as `spawn_1.12_backup/` on the dev box | no |

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

- ~~`server.properties.example` still says `level-name=world`~~ **Fixed 2026-10-01** (`run-wcmmo-001`): the example now has `level-name=wcmmo`, `level-type=minecraft\:flat` and the void `generator-settings` `{"biome":"minecraft:the_void","layers":[{"block":"minecraft:air","height":1}]}`.

## Implementation log

| Date | Repo | FIRE run | PR | Notes |
|---|---|---|---|---|
| 2026-09-23 | wcmmo | — (pre-FIRE) | — | `f18c219` |
| 2026-10-01 | wcmmo | `run-wcmmo-001` (autopilot) | branch `fix/003-void-world-example` | `846f3d3`: example matches the spec; `.yamllint` ignores vendor UltimateUI editor files. The Mac dev box world was made from the old example (normal terrain): regenerate it |
| 2026-10-13 | wcmmo | — | branch `feat/040-staff-zoltraak` | `81fc179`: hub map `spawn` is the default world and tracked (owner); `766046d` / `b8278ec` earlier steps |
