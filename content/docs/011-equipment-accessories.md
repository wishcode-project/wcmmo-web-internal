# 011 — Equipment & accessory slots

> Status: DRAFT · Target: wcmmo (MMOItems, MMOInventory), wcmmo (plugin install) · FIRE mode: confirm
> Design: [GDD v2 §5](../gdd/wcmmo-gdd-v2.md#5-equipment-system) · Decisions: D-09

## Big picture

- **Player story:** As a player, I wear 4 armour pieces and 4 accessories (Necklace, Earring, Ring, Belt); all their stats apply.
- **Done means:** an accessory GUI with exactly 4 slots, each accepting only its type; stats apply while equipped.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | plugin registry + jar | add MMOInventory (D-09) |
| wcmmo | MMOInventory slot config | 4 accessory slots, type-restricted (Rune slots live in the same GUI, spec 022) |
| wcmmo | MMOItems `item-types.yml` | accessory types |

## Data & IDs

| Type ID | Slot | Count |
|---|---|---|
| vanilla armour | helmet/chest/legs/boots | 4 |
| `WCMMO_NECKLACE` | necklace | 1 |
| `WCMMO_EARRING` | earring | 1 |
| `WCMMO_RING` | ring | 1 |
| `WCMMO_BELT` | belt | 1 |

## Balance

Accessory stat budgets defined in 012 per tier.

## Commands & permissions

| Command | Permission | Groups |
|---|---|---|
| `/accessories` (alias of MMOInventory GUI) | MMOInventory default | default |

## Performance

n/a.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Open accessory GUI | 4 labelled slots |
| 2 | Put a Ring in Necklace slot | refused |
| 3 | Equip Ring with +10 STR | `/attributes` shows +10 |

## Rollback

Removing MMOInventory keeps items in its storage — export/return items before uninstall.

## Acceptance criteria

- [ ] D-09 decided; plugin registered.
