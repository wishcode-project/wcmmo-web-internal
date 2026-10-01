# 019 — Lifeskills & resource tiers

> Status: DRAFT · Target: wcmmo (MMOCore professions, Nexo blocks, MMOItems materials) · FIRE mode: confirm
> Design: [GDD v2 §9](../gdd/wcmmo-gdd-v2.md#9-lifeskills--economy) · Decisions: D-22, D-26

## Big picture

- **Player story:** As a crafter, I level Mining, Gathering, Fishing, Cooking, Alchemy; I gather safely in the Lifezone and venture into monster zones for rare materials.
- **Done means:** 5 professions with XP sources; Lifezone nodes give Low–Mid materials; High materials exist only in MMO zones.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | MMOCore `professions/*.yml` | 5 professions, XP curves |
| wcmmo | MMOCore block regen / Nexo custom blocks | resource nodes |
| wcmmo | MMOItems materials + recipes | cooking → food (005), alchemy → potions |

## Data & IDs

| Profession ID | Output |
|---|---|
| `mining` | ores |
| `gathering` | herbs, wood |
| `fishing` | fish |
| `cooking` | food buffs (005) |
| `alchemy` | potions, elixirs |

| Material tier | Where |
|---|---|
| Low, Mid | Lifezone (safe) |
| High | MMO world monster zones only (PvE, D-26) |

## Balance (proposed)

| Setting | Value |
|---|---|
| Profession level cap | 50 |
| Node respawn (Lifezone) | 60 s, per-player |
| Node respawn (MMO world) | 5 min, shared |

## Commands & permissions

`/professions` (MMOCore default).

## Performance

Per-player node respawn uses client-side block state if supported; else shared nodes. Verify in implementation.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Mine Low ore in Lifezone | mining XP + material |
| 2 | Cook a meal | food with buff per 005 |
| 3 | Look for High ore in Lifezone | none exist |

## Rollback

Profession XP is player data — do not rename profession IDs.

## Acceptance criteria

- [ ] D-22, D-26 decided.
