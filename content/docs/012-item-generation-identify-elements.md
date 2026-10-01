# 012 — Item generation, Identify & elements

> Status: DRAFT · Target: wcmmo (MMOItems, MythicLib, MythicMobs drops) · FIRE mode: validate
> Design: [GDD v2 §5](../gdd/wcmmo-gdd-v2.md#5-equipment-system) · Decisions: D-10, D-11

## Big picture

- **Player story:** As a player, I loot an *Unidentified* weapon, identify it, and discover its random stats and element.
- **Done means:** zone mobs drop unidentified gear; identifying rolls stats within tier ranges; elements add damage/resistance.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | MMOItems templates + modifiers | per-tier stat ranges, element modifiers |
| wcmmo | MMOItems unidentified option | drops are unidentified |
| wcmmo | MythicMobs drop tables | zone-tier drops |
| wcmmo | NPC (Citizens/BetonQuest) | Identify NPC or `wcmmo_item_identify_scroll` |

Fallback (if PoC-4 fails): fixed items from crafting / quest rewards, no random rolls.

## Data & IDs

| ID | Kind |
|---|---|
| `wcmmo_item_identify_scroll` | consumable |
| rarity tiers `common`, `uncommon`, `rare`, `epic`, `legendary` | MMOItems tiers |
| elements (MythicLib built-in, D-11) | fire, ice, wind, earth, thunder, water — verify |

## Balance (proposed)

| Rarity | Drop weight | Stat lines | Stat roll range | Element chance |
|---|---|---|---|---|
| common | 60 | 1 | 70–100 % of base | 0 % |
| uncommon | 25 | 2 | 75–105 % | 10 % |
| rare | 10 | 3 | 80–110 % | 30 % |
| epic | 4 | 4 | 85–115 % | 60 % |
| legendary | 1 | 5 | 90–120 % | 100 % |

| Identify cost | Low | Mid | High |
|---|---|---|---|
| Scroll / NPC gold | 1 / 50 | 1 / 200 | 1 / 800 |

## Commands & permissions

n/a (NPC/consumable).

## Performance

Item generation happens on identify, not on drop.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Kill Low-zone test mob 50× | ~60/25/10/4/1 rarity spread (±) |
| 2 | Identify a rare | 3 stat lines within range |
| 3 | Fire weapon vs ice-resistant mob | damage modified per element table |

## Rollback

Revert templates. Already-identified items keep their stats.

## Acceptance criteria

- [ ] PoC-4 result; D-10, D-11 decided.

## Open questions

- Whether identify can be re-rolled (gold sink for §11 economy).
