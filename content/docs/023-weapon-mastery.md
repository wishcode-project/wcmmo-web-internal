# 023 — Weapon Mastery (Expertise)

> Status: DRAFT · Target: wcmmo (MMOCore professions, MythicMobs skills), wcmmo (PlaceholderAPI) · FIRE mode: validate
> Design: [GDD v2 §3](../gdd/wcmmo-gdd-v2.md#3-weapon-freedom--compartmentalised-progression) · Decisions: D-36, D-36b

## Big picture

- **Player story:** As a player, the more I fight with a Hammer, the better I get with it: I unlock Hammer skills and my Hammer skills come back faster.
- **Compartment rule:** Mastery = **fluidity** (unlocks, cooldown, cast time). It never adds AP/DP.
- **Done means:** one MMOCore profession per weapon type gains XP from use; weapon skills unlock at 0/5/10/15/20 and the ultimate at 25 (test build); skill cooldowns read Mastery through PlaceholderAPI.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | MMOCore `professions/mastery_<weapon>.yml` | one profession per weapon type, XP curve |
| wcmmo | MMOCore XP sources | XP on damaging mobs with that weapon type |
| wcmmo | MythicMobs skills | cooldown/cast time formula using `%mmocore_profession_mastery_<weapon>%` |
| wcmmo | plugin registry | add PlaceholderAPI |

## Rules

1. XP only from hitting **mobs** with that weapon type held (not players, not training dummies after level 10).
2. Cooldown formula: `cd = base_cd × (1 − min(0.20, mastery × 0.004))`. Same shape for cast time.
3. The CDR only affects that weapon's unique skills. General skills use the **held** weapon's Mastery (D-36b).
4. Total CDR from all sources (Mastery + Runes) capped at 30 % (spec 022).

## Data & IDs

| Profession ID | Weapon type |
|---|---|
| `mastery_sword` | `WCMMO_SWORD` |
| `mastery_greatsword` | `WCMMO_GREATSWORD` |
| `mastery_hammer` | `WCMMO_HAMMER` |
| `mastery_spear` | `WCMMO_SPEAR` |
| `mastery_bow` | `WCMMO_BOW` |
| `mastery_crossbow` | `WCMMO_CROSSBOW` |
| `mastery_staff` | `WCMMO_STAFF` |
| `mastery_tome` | `WCMMO_TOME` |

## Balance (proposed)

| Setting | Value |
|---|---|
| Mastery cap | **test build: 30** · final: 50 or 100 (to discuss, D-36) |
| Weapon skill unlocks | **test build: 0 / 5 / 10 / 15 / 20, ultimate 25** (5 skills + 1 ultimate, D-52) · final values follow the final cap |
| CDR per level / cap | cap 20 %; per-level rate follows the final cap (0.4 % at cap 50) |
| Time to Mastery 25 (target) | ~6 h of active fighting in level-appropriate zones |

## Commands & permissions

`/mastery` → alias of MMOCore professions page filtered to `mastery_*` (default).

## Performance

Placeholder lookups happen on cast only; no per-tick evaluation.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Hit mobs with a Hammer | `mastery_hammer` XP rises; `mastery_sword` does not |
| 2 | Set `mastery_hammer` to 25 | *Ground Smash* cooldown = base × 0.90 |
| 3 | Hit another player | no Mastery XP |
| 4 | Mastery 50 + Haste III rune | total CDR 28 % (20 + 8), under 30 % cap |

## Rollback

Profession XP is player data: never rename `mastery_*` IDs.

## Acceptance criteria

- [ ] D-36, D-36b decided; PlaceholderAPI registered; PoC of the formula PASS.
