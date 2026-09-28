# 008 — Weapon types & unique weapon skills

> Status: DRAFT · Target: wcmmo-content (MMOItems types, MMOCore/MythicLib skills) · FIRE mode: confirm
> Design: [GDD v2 §3](../gdd/wcmmo-gdd-v2.md#3-weapon-freedom--compartmentalised-progression) · Decisions: D-04, D-04b, D-06d, D-36

## Big picture

- **Player story:** As any player, I can pick up any weapon I have the stats for. Each weapon type has its own unique skills, unlocked through Mastery (spec 023).
- **Done means:** weapon types exist, stat-gated (006); each has unique skills that only cast with that weapon in hand (007).

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo-content | MMOItems `item-types.yml` | weapon types below |
| wcmmo-content | skill definitions | weapon-type condition + Mastery unlock level |

## Data & IDs

Weapon types (D-04 *proposed*; **bold** = vertical slice):

| Type ID | Family | Identity | Resource |
|---|---|---|---|
| **`WCMMO_SWORD`** | melee | balanced, fast, short I-frames | Stamina |
| `WCMMO_GREATSWORD` | melee | slow AOE, Super Armour on heavy swings, breaks guard | Stamina |
| **`WCMMO_HAMMER`** | melee | heavy, breaks guard + Super Armour | Stamina |
| `WCMMO_SPEAR` | melee | longest reach, Frontguard stance | Stamina |
| **`WCMMO_BOW`** | ranged | longest range, charged shots | Stamina |
| `WCMMO_CROSSBOW` | ranged | burst, mobility | Stamina |
| **`WCMMO_STAFF`** | magic | long cast, big AOE | Mana |
| `WCMMO_TOME` | magic | fast cast, CC, buffs | Mana |

Unique skills (3 per weapon, unlocked at Mastery 10/25/40, spec 023). Vertical slice, names are placeholders:

| Weapon | Mastery 10 | Mastery 25 | Mastery 40 |
|---|---|---|---|
| Sword | `wcmmo_skill_blade_flurry` | `wcmmo_skill_riposte` | `wcmmo_skill_thousand_cuts` |
| Hammer | `wcmmo_skill_ground_smash` | `wcmmo_skill_quake` | `wcmmo_skill_titan_fall` |
| Bow | `wcmmo_skill_power_shot` | `wcmmo_skill_arrow_rain` | `wcmmo_skill_piercing_gale` |
| Staff | `wcmmo_skill_fireball` | `wcmmo_skill_frost_nova` | `wcmmo_skill_meteor` |

General skills (any weapon, D-04c): `wcmmo_skill_dash`, `wcmmo_skill_guard` (Frontguard stance), `wcmmo_skill_backstep`.

## Balance

Skill numbers (damage %, cooldown, cost) go in a follow-up spec per weapon after PoC-2.

## Commands & permissions

n/a.

## Performance

Max 1 projectile entity per cast; AOE via MythicLib targeters, not per-tick scans.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Any player with STR 15 equips Low Hammer | works (no class check) |
| 2 | Hammer Mastery 10 → *Ground Smash* unlocks | skill appears in `/skills` |
| 3 | Cast *Ground Smash* holding a Sword | "Requires Hammer" |
| 4 | Staff skill without Mana | "Not enough Mana" |

## Rollback

Revert content. Weapon type IDs must never change once items exist.

## Acceptance criteria

- [ ] D-04, D-06d decided; IDs registered.
