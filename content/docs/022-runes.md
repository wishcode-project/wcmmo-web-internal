# 022 — Passive Runes (2–4 slots)

> Status: DRAFT · Target: wcmmo-content (MMOItems runes, MMOInventory slots) · FIRE mode: validate
> Design: [GDD v2 §2](../gdd/wcmmo-gdd-v2.md#2-classless-system-bloodlines--runes) · Decisions: D-09, D-35, D-35b

## Big picture

- **Player story:** As a player, I slot 2 to 4 passive Runes and swap them freely to push my Bloodline toward Tank or DPS.
- **Done means:** Rune slots unlock per D-35; runes apply passive stats while slotted; no duplicate IDs.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo-content | MMOItems `WCMMO_RUNE` type | rune items with passive stats |
| wcmmo-content | MMOInventory | 4 rune slots, slots 3–4 locked until D-35 condition |

## Rules

1. Slots: 2 at start, 3rd at Lv. 30, 4th at Lv. 50 (D-35, by level only).
2. Same rune ID cannot be slotted twice (different tiers of the same rune count as the same ID).
3. Swap freely out of combat (5 s).
4. Runes give **small passive** bonuses only; no new mechanics (mechanics belong to Bloodlines).

## Data & IDs

| Rune ID (examples) | Effect per tier I / II / III (*proposed*) | Role |
|---|---|---|
| `wcmmo_rune_vitality` | +5 / 8 / 12 % max HP | tank |
| `wcmmo_rune_second_wind` | +10 / 15 / 25 % stamina regen | all |
| `wcmmo_rune_haste` | 3 / 5 / 8 % cooldown reduction | DPS |
| `wcmmo_rune_bulwark` | −5 / 8 / 12 % Frontguard stamina drain | tank |
| `wcmmo_rune_focus` | +10 / 15 / 25 % mana regen | caster |
| `wcmmo_rune_bloodthirst` | 1 / 2 / 3 % lifesteal | DPS |

Total CDR cap from all sources (Runes + Mastery): **30 %**.

## Balance

Rune sources: zone drops (I–II), Alchemy crafting (II–III), dungeon rewards (III).

## Commands & permissions

`/runes` → opens MMOInventory rune page (default).

## Performance

n/a (stat application on equip).

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Lv. 1 player opens `/runes` | 2 open slots, 2 locked |
| 2 | Slot Vitality I and Vitality II | second refused (duplicate) |
| 3 | Haste III + Mastery 50 | total CDR 28 %; adding a 3 % source still stops at 30 % |

## Rollback

Runes are items: removing a rune type leaves dead items. Hide from drops instead of deleting.

## Acceptance criteria

- [ ] D-09, D-35, D-35b decided.
