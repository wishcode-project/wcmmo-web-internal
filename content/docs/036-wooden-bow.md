# 036 — Wooden Bow (tier 0 sample weapon)

> Status: IN-PROGRESS (prototype) · Target: wcmmo · FIRE mode: confirm
> Design: GDD v2 §4 (weapons) · Related: 007 (controls), 010 (Llama Studio packs = weapon base), 008 (skills) · Decisions: D-44 (OPEN), D-53
> ⚠️ **2026-10-03, D-68 (owner):** controls change: bow shoots with **L**, Rapid / Power Shot become Bow weapon skills cast by combos, F = guard. The item layer moves to the kit (D-44). Model format stays.

## Big picture

- **Player story:** As a new player, I get a plain wooden bow that already moves and feels like the bought Green Bow: animated model, arrows with trails, hit effects, a few skills.
- **Who is affected:** testers on the dev box (admin give only).
- **Done means:** the owner can hold the bow, shoot, use the two skills and judge whether this is the way to make our weapons from the Llama Studio packs (spec 010, owner 2026-10-02).

**Owner, 2026-10-02:** prototype accepted ("เยี่ยม"), kept as the reference for making weapons from the packs.

This is a **sample**: the first weapon made from a pack instead of installed from one. It is a MythicMobs + Crucible item like the packs (D-44 still OPEN), so it has no MMOItems stats and the kit (Mastery, skill combos, Remnant) does not see it.

## How it is made from the Green Bow pack

| Part | Source in the pack | Ours |
|---|---|---|
| Models | `ls_sw_bow`, `_incombat`, `_arrow`, `_big_shot_arrow`, `_big_shot_effect`, `_hit` | `wcmmo_bow_wood`, `_incombat`, `_arrow`, `_big_arrow`, `_big_effect`, `_hit` in `ModelEngine/blueprints/wcmmo/bow_wood/`. Same geometry and animations; textures recoloured |
| Recolour | green + white | bow: wood ramp `#3b2414` → `#e2bd84`, green accents → leather `#2e1c10` → `#8a6038`; effects: straw ramp `#5a3b1e` → `#fff4dc`. Recolour maps each pixel's brightness onto the ramp, so shading stays |
| Icon | `ls_sw_bow_item` | Nexo `wcmmo_bow_wood`, COAL model data **6941**, texture `wcmmo/bow_wood/wcmmo_bow_wood_item.png` |
| Item | `gb_bow` | MythicMobs item `wcmmo_item_bow_wood` |
| Mobs | `gb_bow*` holders and projectiles | `wcmmo_mob_bow_wood_*` (no stowed holder, see below) |
| Skills | `gb_bow_*` | `wcmmo_bow_wood_*` in `MythicMobs/skills/wcmmo_bow_wood.yml` |
| Particles | `#28ff5d` | `#c8955a` |

Dropped from the Green Bow: Tornado Shot, Suppressive Fire, Double Jump, Emote (tier 0 = fewer tools).

## Stowed on the back (owner, 2026-10-02)

The pack's stowed bow floats: its idle pose sits **~4 px behind the back**, low (down to the legs), bobs up and down, and it is a display entity teleported to the player every tick that turns with the **head**. Ours is strapped on:

| | Pack (`ls_sw_bow` idle) | Ours (`wcmmo_bow_wood` idle / spawn, end of `_incombat` `combat_idle_to_idle`) |
|---|---|---|
| Bone `bow` position | `-2, 11, 8` | `-1.5, 9, 4.75` |
| Bone `bow` rotation | `90, 0, 60` + wobble | `90, 0, 30`, static |
| Gap to the back | ~4 px | ~0.2 px (bow at scale 1.2 spans shoulders → hip, under the head) |
| Carried by | `ITEM_DISPLAY` holder teleported every tick, head yaw | ModelEngine model **on the player** (`model{mid=wcmmo_bow_wood;h=false;i=false;pv=true}`), body yaw |
| Moving | holder lags a tick behind, bobs on jumps | `pv=true` = ModelEngine `useBaseAsPivot` (as the Draconic tpv model): the player is the pivot, the bow moves client-side with the body. The back pose is **baked into the model as its rest pose, no animations** (`wcmmo/scripts/wood_weapons.py`, spec 037): ModelEngine switches idle / walk / jump by itself and blends through the rest pose, which was the bow upright at foot level (first bug: bow at the feet; second: twitching while walking / turning) |

The pose was checked against the player box (body z −2…2, head z −4…4) in a side / back render. Known limit: the model doesn't lean when sneaking (same as Draconic). The holder mob `wcmmo_mob_bow_wood_holder` is gone. **Owner, 2026-10-02:** locked on the back while walking / jumping = approved ("เยี่ยม"); the other three wooden weapons use the same lock (spec 037).

## Controls (follow spec 007, not the pack)

| Input | Action | Pack had |
|---|---|---|
| **Right click** | Shot: one arrow, instant | Rapid Shoot (pack shoots on left click) |
| **Left click** | Rapid Shot: back-step, then 3 quick arrows | Shoot |
| **Shift + Right click** | Power Shot: 1 s draw (slowed), back-step, heavy arrow | Big Shoot |
| **F** | not used: stays the skill bar swap (spec 007) | cancelled for the pack's own skills |

## Balance (test values)

| Thing | Value | Green Bow | Reason |
|---|---|---|---|
| Shot damage / crit (10 %) | 2 / 3 | 2 / 3 | same base, it is the basic attack |
| Shot interval | 0.75 s | 0.5 s | spec 007 bow interval |
| Rapid Shot | 3 arrows × 1.5 / crit 2.5, cooldown 6 s | 5 × 2, 3 s | tier 0 |
| Power Shot | 8 / crit 12, cooldown 8 s | 16 / 24, 2 s | tier 0 |
| Arrow speed / range | 50 / 50 blocks | same | |

## Commands & permissions

| Command | Who |
|---|---|
| `/mm items get wcmmo_item_bow_wood` | admin |

## Test plan (dev box)

1. `/meg reload`, `/mm reload` (or restart), then `/mm items get wcmmo_item_bow_wood` → wooden icon in hand, wooden bow on the back.
2. Right click → bow comes to the hands, wooden arrow with a straw trail, hit effect on the dummy (`/dummy spawn`), 2 damage (3 on crit).
3. Spam right click → max one shot per 0.75 s.
4. Left click → back-step + 3 arrows; again within 6 s → action bar shows the cooldown.
5. Shift + right click → slowed 1 s, straw rings, back-step, heavy arrow 8 damage; cooldown 8 s.
6. Stop fighting for 5 s → bow goes back to the back. Switch hotbar slot → nothing left on the player.
6b. Stowed: walk, sprint, jump, turn only the camera, turn the body → the bow stays flat on the back, no gap, no lag, does not swing with the head.
7. Press F while holding it → skill bar swaps (not swallowed).

## Rollback

Delete `ModelEngine/blueprints/wcmmo/bow_wood/`, `MythicMobs/{items,mobs,skills}/wcmmo_bow_wood.yml`, `Nexo/items/wcmmo_bow_wood.yml`, `Nexo/pack/assets/minecraft/{models,textures}/wcmmo/bow_wood/`. No world or player data.

## Open questions

- Is this look and feel the way to make our weapons? If yes: port it to an MMOItems `WCMMO_BOW` with the kit's controls (D-44) before more weapons are made.

## Implementation log

| Date | Repo | Run | Branch | Notes |
|---|---|---|---|---|
| 2026-10-02 | wcmmo | — (no FIRE run, prototype) | `feat/036-wooden-bow` @ `8f76642`, back lock `78a3931` | Models recoloured, item + 3 skills. Server load check on a throwaway copy: no errors. Owner happy with the prototype; in-game test plan not run yet. Next: MMOItems port (D-44) |
