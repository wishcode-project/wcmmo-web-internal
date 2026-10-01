# 013 — Enhancement (+1…+15, I…V)

> Status: DRAFT · Target: wcmmo (MMOItems upgrade templates), wcmmo-plugins (Roman stages, pity) · FIRE mode: validate
> Design: [GDD v2 §3, §5](../gdd/wcmmo-gdd-v2.md#5-equipment-system) · Decisions: D-12, D-12b, D-12c, D-12d

## Big picture

- **Player story:** As a player, I enhance my weapon and armour from +1 to +15, then I → V; accessories go I → V directly (if D-12d stays yes).
- **Compartment rule:** enhancement is the **main source of raw power** (AP/DP). Stats and Mastery never add AP/DP.
- **Done means:** an enhancement NPC/GUI applies the ladder below with pity; item name and AP/DP update.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | MMOItems upgrade templates | stat gain per stage |
| wcmmo-plugins | `enhance` module | ladder, success %, pity stacks, Roman display (`+15` → `I`) |
| wcmmo | Citizens/BetonQuest NPC | enhancement master |

## Data & IDs

| ID | Kind |
|---|---|
| `wcmmo_item_stone_weapon`, `wcmmo_item_stone_armour`, `wcmmo_item_stone_accessory` | materials (D-12c) |
| `wcmmo_npc_enhancer` | NPC |

## Balance (proposed)

| Stage | Weapon/armour success | Fail result | Pity +% per fail |
|---|---|---|---|
| +1…+7 | 100 % | — | — |
| +8 | 90 % | stay | +2 |
| +9…+12 | 80 → 50 % | stay | +2 |
| +13…+15 | 40 → 25 % | stay | +3 |
| I | 40 % | stay | +3 |
| II | 25 % | drop to I | +4 |
| III | 15 % | drop 1 | +5 |
| IV | 8 % | drop 1 | +6 |
| V | 5 % | drop 1 | +8 |

| Accessory | Success | Fail |
|---|---|---|
| base → I | 60 % | D-12 (lose copy or drop stage) |
| I → V | 40 / 25 / 12 / 5 % | same |

Items are **never destroyed** (D-12 recommendation). Max stage Phase 2 = V.

## Commands & permissions

| Command | Permission | Behaviour |
|---|---|---|
| `/wcmmo enhance setpity <player> <n>` | `wcmmo.admin.enhance` | support tool |

## Performance

n/a.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Enhance +1…+7 | always success |
| 2 | Simulate 10 000 attempts at II (`/wcmmo enhance sim`) | success rate within ±1 % incl. pity |
| 3 | Fail at III | item drops to II, pity increases |
| 4 | Reach +15 then succeed | name shows `I` |

## Rollback

Enhancement state is on items — do not change stage encoding after launch.

## Acceptance criteria

- [ ] D-12, D-12b, D-12c decided.

## Open questions

- Should failstacks be per player (BDO) or per item? Recommend per player.
