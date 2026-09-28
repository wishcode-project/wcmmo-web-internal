# 001 — Server baseline

> Status: DONE · Target: wcmmo · FIRE mode: validate

Backfilled from `wcmmo` commits `666733f`…`8bcbc6f` so later specs have a baseline to diff against.

## Big picture

- **Player story:** As a player, I want a stable 20 TPS server that can hold ~200 players.
- **Who is affected:** everyone; dev and prod machines.
- **Done means:** both start scripts boot Purpur 26.2 on Java 25 with ZGC, and `develop` → `main` promotion never overwrites env-specific files.

## Systems & config

| Repo | File | Key / setting | Value | Dev ≠ prod? |
|---|---|---|---|---|
| wcmmo | `scripts/start-dev.bat` | heap / GC / debug | 8G, ZGC, JDWP on `*:5005` | yes |
| wcmmo | `scripts/start-prod.sh` | heap / GC | `WCMMO_RAM` (default 16G), ZGC, AlwaysPreTouch, THP, CompactObjectHeaders | yes |
| wcmmo | both scripts | jar lookup | `WCMMO_JAR` (prod) → `server.jar` → newest `purpur-*.jar` | no |
| wcmmo | both scripts | Java gate | refuse to start below Java 25 | no |
| wcmmo | `.gitattributes` (main only) | `server.properties`, `.env` | `merge=ours` | — |
| wcmmo | `config/paper-global.yml` | `chunk-loading-basic.player-max-chunk-send-rate` | dev `-1.0` / prod `75.0` | **yes** |
| wcmmo | `config/paper-global.yml` | `chunk-loading-basic.player-max-chunk-load-rate` | dev `-1.0` / prod `100.0` | **yes** |
| wcmmo | `server.properties` | untracked; template `server.properties.example` | per machine | yes |

Dev-only values are listed in `wcmmo/docs/DEPLOY.md` → "Dev-only values".

## Data & IDs

n/a — no gameplay IDs.

## Balance

n/a.

## Commands & permissions

n/a.

## Performance

- Target: MSPT ≤ 40 at 200 players (prod), measured with `/spark health` and `/spark profiler --timeout 120` at peak.
- Remote debug port 5005 is dev-only and must never be exposed; SSH tunnel if needed.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Run `start.bat` with Java 21 on PATH | refuses with "needs Java 25 or newer" |
| 2 | Run `start.bat` with Java 25 and a `purpur-*.jar` present | boots, banner shows jar, 8G, port 5005 |
| 3 | Console `spark health` | TPS 20, MSPT reported |
| 4 | On a scratch clone: merge `develop` into `main` after changing `server.properties.example` and a local `server.properties` | local `server.properties` unchanged (requires `git config merge.ours.driver true`) |

## Rollback

- Config: `git revert` on `develop`, then promote. No world data touched.

## Acceptance criteria

- [x] Both scripts boot the server.
- [x] Dev-only values documented in DEPLOY.md.
- [x] `server.properties` untracked, example committed.

## Open questions

- Production VPS: **32 GB RAM** confirmed (2026-09-28). Proposed heap `WCMMO_RAM=20G` in prod `.env` (~60–65 % of RAM, rest for ZGC, OS page cache and MySQL if on the same box). CPU model/core count still open. Needed to size FAWE `queue.parallel-threads` (see 002).

## Implementation log

| Date | Repo | FIRE run | PR | Notes |
|---|---|---|---|---|
| 2026-09-23 | wcmmo | — (pre-FIRE) | — | commits `666733f`, `bc463c5`, `077004d`, `8bcbc6f` |
