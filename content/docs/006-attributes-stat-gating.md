# 006 — Stats as the gear gateway (STR/AGI/INT/DEX/DEF)

> Status: DRAFT · Target: wcmmo (MMOCore attributes, MMOItems requirements) · FIRE mode: validate
> Design: [GDD v2 §3](../gdd/wcmmo-gdd-v2.md#3-weapon-freedom--compartmentalised-progression) · Decisions: D-07, D-07b, D-08, D-08b, D-30

## Big picture

- **Player story:** As a player, I level up, spend stat points, and that decides which weapons and armour I can equip. A heavy Greatsword needs a lot of STR.
- **Compartment rule:** stats are the **gateway**. They do not add damage (AP comes from enhancement, spec 013/014). Only the small utility bonuses of D-30 are allowed.
- **Done means:** points are gained per level, spent in a GUI, and any gear whose requirements are not met refuses to work.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | MMOCore `attributes.yml` | 5 attributes; per-point buffs limited to the D-30 utility table |
| wcmmo | MMOCore `config.yml` | attribute points per level, respec item |
| wcmmo | MMOItems item templates | attribute requirements (+ level floor if D-08b) |

## Data & IDs

| ID | Kind |
|---|---|
| `str`, `agi`, `int`, `dex`, `def` | MMOCore attributes |
| `wcmmo_item_respec_scroll` | consumable (D-07b) |

## Balance (proposed)

| Setting | Value |
|---|---|
| Level cap (Phase 1) | 60 (Bloodline stage 4 = Lv. 60, spec 021) |
| Points per level | 2 (118 total at 60) |
| Gate | stat requirements + soft level floor per tier (D-08b) |

Utility bonuses per point (only if D-30 = "small utility"):

| Attribute | Per point | Never |
|---|---|---|
| STR | +0.5 carry/knockback resistance (future) | damage |
| AGI | +1 max Stamina · **+0.5 % basic attack / shot speed, cap +30 %** (D-50) | skill cooldowns (Mastery owns them) |
| INT | +2 max Mana | damage |
| DEX | +0.2 % projectile velocity | damage |
| DEF | +3 max HP | flat damage reduction (DP owns that) |

Requirement ladder by weapon weight (example):

| Weapon | Low tier | Mid tier | High tier |
|---|---|---|---|
| Greatsword / Hammer | STR 15 | STR 40 | STR 70, DEF 20 |
| Sword / Spear | STR 10, AGI 10 | STR 25, AGI 25 | STR 40, AGI 40 |
| Bow / Crossbow | DEX 15 | DEX 40 | DEX 70, AGI 20 |
| Staff / Tome | INT 15 | INT 40 | INT 70, DEF 10 |
| Armour (heavy) | DEF 10 | DEF 35 | DEF 60, STR 20 |

## Commands & permissions

| Command | Permission | Groups |
|---|---|---|
| `/attributes` (MMOCore) | MMOCore default | default |

## Performance

n/a (MMOCore-native).

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | `/mmocore admin level set <p> 20` | 38 unspent points |
| 2 | Equip Mid Greatsword with STR 39 | refused with requirement message |
| 3 | Add 1 STR | equips |
| 4 | Compare damage with STR 40 vs STR 80, same weapon | identical (stats give no damage) |
| 5 | Use respec scroll | all points refunded |

## Rollback

Changing points-per-level changes player data: DB backup before deploying to prod.

## Acceptance criteria

- [x] D-07, D-07b, D-08b, D-30 decided (2026-09-29). Respec item sources: NPC shop or quest reward.
- [ ] Test 4 proves stats add no damage.

## Open questions

- MMOItems requirement key names for the installed version.
