# 034 — Wings

> Status: DRAFT · Target: wcmmo (MMOItems `WCMMO_WINGS`, MMOInventory wings slot, CosmeticsCore or ModelEngine wing model, ItemSkins, WorldGuard safe regions, Skript `wcmmo_75_wings.sk`) · FIRE mode: validate (stats)
> Design: GDD v2 §5 · Inspired by MU Online wings (look and feel only) · Decisions: D-66

## Big picture

- **Player story:** Wings are my proudest piece of gear. They sit on my back like a living cloak: folded and gently beating in town, spread wide when I walk out into the wilds, and I drift down slowly when I jump. Better wings give me a small, honest power boost.
- **Done means:** a wings slot exists next to the armour and accessory slots; three wing tiers with modest stats; the model changes with safe / unsafe areas; no real flight.

## Rules (decided 2026-10-01)

| Rule | Detail |
|---|---|
| Slot | one **wings** slot in the MMOInventory equipment GUI, next to helmet / chest / legs / boots and accessories (011) |
| Item | MMOItems type `WCMMO_WINGS`; stats apply only while in the wings slot |
| Who can wear | **everyone**; stats are the same for all Bloodlines |
| Look | per Bloodline: **Fury** ember-red wings · **Ward** bone / stone wings · **Pulse** wings of light (no Bloodline yet: plain feathered). The model follows the wearer's current Bloodline |
| Real flight | **none** (no fly mode, no Elytra gliding) |
| Store | wing **skins** only (ItemSkins), no stats: no pay-to-win (M11) |

### Tiers (proposed, tune in the slice)

| Tier | Damage | Damage taken | Max HP | Required level | Source (proposed) |
|---|---|---|---|---|---|
| **Wings I** | +3 % | −3 % | — | 20 | main quest reward (around Lv 20) |
| **Wings II** | +6 % | −5 % | +40 | 40 | crafted from boss materials |
| **Wings III** | +10 % | −8 % | +80 | 55 | rare drop / craft from big bosses |

Wings stats stack with gear but do **not** add AP / DP (D-13b: AP / DP come only from gear + enhancement). Damage taken reduction counts towards any shared damage-reduction cap. Enhancing wings: not in the slice.

### Motion

| Area | Wings | Player |
|---|---|---|
| **Safe zone** (WorldGuard region `wcmmo__safe_<name>`, cities / villages) | folded, slow gentle flap | walks normally |
| **Outside** | spread, stronger flap ("hover" pose: the model lifts slightly), light particles under the feet | walks normally; **while airborne: Slow Falling** (drifts down after a jump or a drop) |

Minecraft can't keep a player floating above the ground without fly mode (fly mode desyncs and trips anti-cheat), so the "floating" feel comes from the hover animation, particles and the slow descent. No Jump Boost (keeps combat and parkour fair). Slow Falling is removed the moment the player lands, enters a safe zone or takes off the wings.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | MMOItems `WCMMO_WINGS` type + items | `wcmmo_item_wings_1`, `_2`, `_3` with the tier stats |
| wcmmo | MMOInventory | wings slot (type-restricted to `WCMMO_WINGS`) |
| wcmmo | CosmeticsCore **or** ModelEngine | wing model on the player's back with `folded`, `spread` animations; one model per look (PoC decides which plugin, see test 1) |
| wcmmo | Nexo pack | wing models / textures |
| wcmmo | ItemSkins | store wing skins (look only) |
| wcmmo | WorldGuard | `wcmmo__safe_<name>` regions |
| wcmmo | Skript `wcmmo_75_wings.sk` | every 10 ticks: wearing wings? safe zone? → set the animation, particles, Slow Falling while airborne |

## Data & IDs

| ID | Kind |
|---|---|
| `WCMMO_WINGS` | MMOItems type |
| `wcmmo_item_wings_1`, `_2`, `_3` | wings items |
| `wcmmo_cos_wings_feather`, `_fury`, `_ward`, `_pulse` | wing models / cosmetics |
| `wcmmo__safe_<name>` | WorldGuard safe-zone regions (e.g. `wcmmo__safe_city`) |

## Performance

One wing model per player with wings (up to 200 attached models in a busy city). The Skript check runs every 10 ticks per online player (region lookup + one effect). Measure with 20 bots wearing wings in the city: `/spark profiler` must show the wings script and the model plugin under 1 ms per tick together.

## Rollback

Remove `wcmmo_75_wings.sk` and the wings slot; wings items stay in inventories as plain items (no stats). No world data touched.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | PoC: CosmeticsCore back model vs ModelEngine on a player, both with 2 animations | pick the one that stays attached while running, sneaking, in first person and at 20 players |
| 2 | Put Wings I in the wings slot | stats show on `/stats`; damage +3 % on the dummy (spec 035) |
| 3 | Wings in a chest slot / hand | no stats |
| 4 | Stand in `wcmmo__safe_city` | folded, slow flap |
| 5 | Walk out of the city | spread, particles; jump → slow descent |
| 6 | Land / walk back in | Slow Falling gone at once |
| 7 | Change Bloodline Fury → Ward | wing look changes |
| 8 | Wear a store wing skin | look changes, stats unchanged |

## Acceptance criteria

- [x] D-66 decided.
- [ ] Tests 1–8 pass.

## Implementation log

| Date | Repo | FIRE run | PR | Notes |
|---|---|---|---|---|
| 2026-10-02 | wcmmo | `run-wcmmo-002` | branch `feat/mmo-core-setup` | Wings items load (`damage-reduction`, not `defense-percent`); MMOInventory test slot `WINGS` with `mmoitemstype{type=WCMMO_WINGS}` + `mmoitemslevel{}`; opens with `/mmoinv open` for now. Region check goes through the WorldGuard API. Model PoC and safe-zone regions still to do. |
