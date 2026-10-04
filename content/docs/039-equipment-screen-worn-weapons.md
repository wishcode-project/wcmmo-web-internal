# 039 — Equipment screen, worn weapons, combat mode

> Status: DRAFT (PoC-gated) · Target: wcmmo (MMOInventory `inventory/`, Skript kit, MythicMobs, ModelEngine) · FIRE mode: confirm
> Design: GDD v2 §3 / §4 · Decisions: **D-77** (this), D-69 / D-72 (stances, spec 038), D-75 (skill hotbar), D-68 / D-74 (controls, guard), D-66 (wings slot), D-44 (OPEN)
> Open before READY: M26 (how the screen opens), the PoC below

## Big picture

- **Player story:** As a player, I open my equipment screen (MU style), put my armour, wings, necklace, two rings and **my weapons** in their slots. My hotbar stays free for skills and potions. When I **tap Shift** my weapons come to my hands and I fight; tapping again puts them on my back.
- **Owner, 2026-10-04:** decided, but only if the PoC works. If it doesn't, GDD D-77 records why it was dropped.
- **Done means:** the PoC steps below pass in game.

## Equipment screen (MMOInventory, type `custom`)

Top = equipment (chest window, 6 rows), bottom = the normal inventory, like the MU reference.

| Slot | Takes | Notes |
|---|---|---|
| Helmet, Chestplate, Leggings, Boots | armour | MMOInventory armour slot types |
| Wings | `WCMMO_WINGS` | D-66 |
| Necklace | `WCMMO_NECKLACE` (accessory) | 1 |
| Ring 1, Ring 2 | `WCMMO_RING` (accessory) | 2 |
| **Weapon right** | any weapon | two-handed weapons and bows only here |
| **Weapon left** | one-handed weapon or shield | **no bow**, no two-handed weapon; a two-handed weapon in the right slot keeps it empty |

Restrictions use MMOInventory slot `restrictions` (`mmoitemstype{type=…}`) plus a kit check for the two-handed rule (spec 038 logic, reading these two slots instead of the hands).

**Opening it (M26):** the server is **not told** when a player opens their own inventory with E (it is told when it closes), so "E opens the equipment screen" can't be done without a client mod. Candidates: a button item in the E screen (MMOInventory `inventory_button`), `/equip`, a free key combo. Owner decides later.

## Combat mode (tap Shift)

| | Out of combat | Combat mode |
|---|---|---|
| Weapon look | stance back model on the player (spec 037 / 038 format) | combat model in the hands |
| Clicks | normal (eat, place, use items) | the kit: L = basic attack, combos, F guard / parry, skills 1–5 (D-75) |
| Hand item | used normally | **not moved**, just not used (left / right click go to the weapon) |
| Enter / leave | tap Shift (or hit: left click enters) | tap Shift again; 5 s idle optional (decide in the PoC) |

Nothing is ever moved between slots or into the hand, so no item can be lost.

## Prerequisite: no combat holder

The kit has to cast the weapon moves (the weapon is not in the hand, so item triggers can't). When it did (spec 007, `14d421a`), the combat **holder** (an `ITEM_DISPLAY` mob teleported to the player every tick) stopped following, although its owner was right and it was alive (`/wcmmoholders`, 2026-10-04); rolled back. So step 1 removes the holder: the **combat model goes on the player with `pv=true`** like the back model, states and part swaps target the player's model (`state{mid=…}`, `changepart{mid=…}`).

## PoC steps (each tested in game before the next)

| # | Step | Pass when |
|---|---|---|
| 1 | Dual swords: combat model on the player (`pv=true`), no holder; still item-driven | attacks look like now, the swords follow and don't lag on jumps |
| 2 | Kit-driven left click for that stance | basic attack works, swords follow |
| 3 | Equipment screen with the slots above (open with `/equip` for the test) | items go in / out, restrictions hold, nothing duplicates or disappears |
| 4 | Stance from the two weapon slots (spec 038 rules) | wood + iron swords worn = dual stance on the back |
| 5 | Tap Shift = combat mode, hand item untouched | weapons to the hands, clicks fight, Shift again = back |
| 6 | Skill hotbar (D-75) on top | keys 1–5 cast in combat mode |

## PoC progress

| Step | Result (owner) | Notes |
|---|---|---|
| 1 | **Pass** 2026-10-04: follows, no twitch | Every weapon's combat model is on the player (`pv=true`); holders gone (they froze on the owner's server even with item-driven controls; cause unknown). The combat models' `idle` is renamed (`back_idle`, bow `held_idle`) so ModelEngine switches no state by itself. **Known issue (accepted for now):** the swords **flicker briefly when drawn**: the stance's own blades are transparent and the held item's part is swapped in 1 / 4 / 10 ticks after the model appears. Possible fix later: separate stance models per look (no swap), or keep the combat model on the player all the time and only hide / show it |
| 2 | built, to test | the kit sends the swords' left click (`wcmmo_39_kit_input.sk`), right click still from the item |

## Data & IDs (proposed)

| ID | Kind |
|---|---|
| `wcmmo_equipment` | MMOInventory inventory id |
| `WCMMO_NECKLACE`, `WCMMO_RING`, `WCMMO_SHIELD` | MMOItems types |
| `/equip` | test command (M26 decides the real way in) |

## Balance

n/a — weapon damage from worn weapons is D-44 work (MMOItems counts weapon stats in the hand only; the kit may compute it).

## Performance

Same as spec 037 / 038 (models on the player, event-driven kit). Removing the holder removes its per-tick teleport.

## Rollback

Disable the custom inventory, remove the kit's combat-mode code; spec 038 stances keep working from the hands.

## Open questions

- M26 · how the screen opens. Combat mode: leave by Shift only, or also after 5 s idle (PoC step 5).

## Implementation log

| Date | Repo | Run | Branch | Notes |
|---|---|---|---|---|
| 2026-10-04 | wcmmo-specs | — | — | Draft from the owner's idea (D-77) |
| 2026-10-04 | wcmmo | — (PoC) | `feat/039-worn-weapons` | Step 1 pass (`1e209ac`), draw flicker noted; step 2 built |
