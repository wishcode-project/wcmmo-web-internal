# 018 — Lifezone instances & housing

> Status: DRAFT · Target: wcmmo-plugins (`lifezone` module), wcmmo (worlds, DB), wcmmo-infra (maybe Velocity) · FIRE mode: validate
> Design: [GDD v2 §8](../gdd/wcmmo-gdd-v2.md#8-lifezone--housing-heartopia-style) · Decisions: D-19, D-20, D-20b, D-20c, D-21, D-21b
>
> **Timing (D-19, 2026-09-29):** Lifezone will be our own plugin, not Skript. It is designed and built only after the combat/MMO core is mostly finished; until then this spec stays DRAFT.

## Big picture

- **Player story:** As a player, I enter a cozy Lifezone with up to 19 others; my house appears on a free plot wherever I go.
- **Done means:** Lifezone worlds cap at 20; each player's house is stored as a schematic in the DB and pasted async with FAWE on a free plot.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo-plugins | `lifezone` module | instance registry, capacity, plot allocation, save/paste |
| wcmmo | Multiverse / world templates | `wcmmo_lifezone_<n>` worlds from one template |
| wcmmo | `.env` | DB connection (house blobs) |
| wcmmo-infra | Velocity (only if D-19 = servers) | proxy + shared DB |

## Rules

1. Capacity: 20 players = 20 plots per Lifezone. Entry is atomic: **reserve a plot, then teleport**; if none, deny with "World Full" (no bypass for parties or teleports; staff `wcmmo.lifezone.bypass` only for moderation, does not take a plot).
2. On arrival: load player's house schematic from DB → FAWE async paste onto reserved plot → teleport when paste completes (show "Preparing your house…").
3. On leave/quit: save plot to schematic (D-20b) → clear plot async → free plot.
4. Autosave every 10 min while inside.
5. Build is allowed only inside own plot (WorldGuard per-plot region created at reservation).

## Data & IDs

| ID | Kind |
|---|---|
| `wcmmo_lifezone_<n>` | world |
| `wcmmo_lifezone_<n>__plot_<01-20>` | region |
| `wcmmo_v1_lifezone_house` | DB table: `player_uuid`, `schematic` (blob), `version`, `updated_at` |
| `wcmmo.lifezone.bypass` | permission (staff) |

## Balance (proposed)

| Setting | Value |
|---|---|
| Plot size | 32 × 32 × 32 (D-20) |
| Plot spacing | 16 blocks |
| Max schematic size | 2 MB |
| Paste budget | FAWE queue, ≤ 1 paste starting per 2 s per world |

## Commands & permissions

| Command | Permission | Behaviour |
|---|---|---|
| `/lifezone` | `wcmmo.lifezone.use` (default) | join a Lifezone with a free plot |
| `/lifezone list` | default | zones with `n/20` |
| `/wcmmo lifezone restore <player> <version>` | `wcmmo.admin.lifezone` | restore previous house version |

## Performance

Async paste only; measure MSPT during 10 simultaneous arrivals (goal: TPS ≥ 19).

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | 20 players join zone 1; 21st tries | "World Full" |
| 2 | Party member teleports to friend in full zone | denied |
| 3 | Player builds, leaves, joins zone 2 | same house on a different plot |
| 4 | House with 20 Nexo furniture moved | all furniture works (PoC-5) |
| 5 | Kill server mid-save | previous version still loads |

## Rollback

Houses are player data: keep the last 3 versions per player; DB backup before deploy.

## Acceptance criteria

- [ ] PoC-5 PASS; D-19…D-21b decided.
