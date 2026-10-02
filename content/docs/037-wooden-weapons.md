# 037 — Wooden Spear, Twin Swords, Sword & Shield (tier 0 sample weapons)

> Status: IN-PROGRESS (prototype) · Target: wcmmo · FIRE mode: confirm
> Design: GDD v2 §4 (weapons) · Related: 036 (Wooden Bow = the recipe), 007 (controls), 010 (Llama Studio packs = weapon base), 008 (skills) · Decisions: D-04, D-44 (OPEN), D-68 (OPEN)
> ⚠️ **2026-10-03, D-68 (owner):** controls change: L = Slash, the R / Shift + L moves become weapon skills of their type cast by combos, F = guard / parry (Defend animations reused), Shift + F = twirl (pack emotes). The item layer moves to the kit (D-44). Model format stays.

## Big picture

- **Player story:** As a new player, I can pick up a plain wooden spear, twin swords or sword & shield that already move and feel like the bought packs: animated models, slash effects, hit effects, a few skills. Carried on the back, they stay strapped on while I walk, sprint and jump.
- **Who is affected:** testers on the dev box (admin give only).
- **Done means:** the owner holds each weapon, uses its three moves, and the stowed weapon stays locked on the back like the Wooden Bow.

**Owner, 2026-10-02:** "make the other 3 weapons wooden too", right after approving the Wooden Bow with the back lock (spec 036).

Same status as the bow: MythicMobs + Crucible items (D-44 still OPEN), no MMOItems stats, the kit (Mastery, combos, Remnant) does not see them.

## The three weapons

| Ours | From pack (spec 010) | Weapon type (D-04) | Nexo icon (COAL) |
|---|---|---|---|
| **Wooden Spear** `wcmmo_item_spear_wood` | Basic Polearm (`basic_polearm`, `bp_*`) | Spear | `wcmmo_spear_wood`, **6942** |
| **Wooden Twin Swords** `wcmmo_item_swords_wood` | Two Sword Style (`two_sword`, `tss_*`) | Sword? (open question) | `wcmmo_swords_wood`, **6943** |
| **Wooden Sword & Shield** `wcmmo_item_sword_shield_wood` | Castle Knight (`castle_knight_weapon`, `ck_*`) | Sword? (open question) | `wcmmo_sword_shield_wood`, **6944** |

## How they are made (script)

`wcmmo/scripts/wood_weapons.py` does the spec 036 recipe for all three, so it can be re-run when a pack updates:

| Step | What |
|---|---|
| Copy | pack blueprints → `ModelEngine/blueprints/wcmmo/<id>/`, renamed `wcmmo_<id>*` |
| Recolour | each embedded texture, pixel brightness → colour ramp (shading stays). Weapon parts: wood `#3b2414` → `#e2bd84` (second twin sword: dark wood `#22140a` → `#9a6c42`); accents (red wrap, cyan gems) → leather `#2e1c10` → `#8a6038`; slash / hit effects: straw `#5a3b1e` → `#fff4dc` by absolute brightness (they glow) |
| Unique names | every texture renamed `wcmmo_<model>_<part>` (ModelEngine warns on duplicates) |
| Split | the pack has **one** model for back + combat. We make a **back model** `wcmmo_<id>` (weapon bones only, the back pose **baked in as the rest pose, no animations**) and a **combat model** `wcmmo_<id>_combat` (full pack model) |
| Back pose | static (pack bobs), moved onto the back: gap to the body **0.2 px** like the bow. Also the end of `combat_to_idle`, so the swap back is seamless |
| Bake | the pose is written into the bones (origin, rotation, uniform scale into the geometry) and every animation is dropped. Reason (owner, 2026-10-02: weapon twitched towards attack mode while walking / turning): a model on a player switches idle / walk / jump states by itself and the switch blends through the bones' rest pose, which in the packs is the in-hand pose. Baked: nothing to blend. Checked: baked rest pose = old animated pose (max diff 0.00001 px) |
| Icon | the pack's Nexo item model with recoloured textures → `Nexo/pack/.../wcmmo/<id>/` |

| Back pose shift (z, px) | Pack gap → ours |
|---|---|
| Spear `polearm` bone | −3.8 (3.8 → 0.2 px) |
| Twin Swords `purple_sword`, `black_sword` | −2.2 (2.2 → 0.2 px) |
| Sword & Shield `sword`, `shield` | −2.7 (2.7 → 0.2 px) |

## On the back = locked to the body (same as 036)

| State | What carries the weapon |
|---|---|
| In hand, not fighting | back model **on the player**: `model{mid=wcmmo_<id>;h=false;i=false;pv=true}`. `pv=true` = ModelEngine `useBaseAsPivot` (same as the Draconic tpv model): the player is the pivot, so the model moves client-side with the body, no lag or bobbing when jumping |
| Attacking | back model removed, combat holder `wcmmo_mob_<id>_combat` (pack style `ITEM_DISPLAY` teleported every tick) plays the attacks |
| 5 s (spear 6 s) after the last attack | `combat_to_idle`, holder removed, back model on the player again |
| Hotbar switch / drop | everything removed |

## Controls (spec 007: left click = basic attack, F not cancelled)

| Weapon | L | R | Shift + L | Dropped from the pack |
|---|---|---|---|---|
| Spear | **Slash** 3-hit combo | **Shove**: thrust, throw back | **Hard Swing**: 4.5 s spin, slowed, hits around | — (pack has these 3) |
| Twin Swords | **Slash** 3-hit combo | **Dash**: dash forward, knock up (pack: F) | **Swing**: spin, knock back around | Defend (R), StarBurst Stream (Shift+R), Emote (Shift+F) |
| Sword & Shield | **Slash** 3-hit combo | **Defend**: shield up 0.5 s, blocks and deflects the next hit | **Rush**: charge 1.6 s, pushes back, big swing | Domain Declaration (Shift+R), Battle Declaration (F), Emote (Shift+F) |

F stays the skill bar swap (spec 007), so nothing on F. Shift + L clashes with Guard (Shift hold, spec 009) the same way the bow's Shift + R does: checked in the test plan.

## Balance (test values)

| Move | Ours | Pack | |
|---|---|---|---|
| Slash (all three) | 2 / crit 3 per hit, every 0.5 s (spear hit 3: 3 / 4.5) | 3 / 4.5 (spear hit 3: 4 / 6) | basic attack, same as the bow shot |
| Spear Shove | 4 / 6, cooldown 6 s | 6 / 9, 3 s | |
| Spear Hard Swing | 11 × 1 / 1.5, cooldown 10 s, no Resistance | 11 × 2 / 3, 8 s, Resistance I | |
| Twin Dash | 5 / 7.5, cooldown 6 s | 8 / 12, 3 s | |
| Twin Swing | 5 / 7.5, cooldown 8 s | 8 / 12, 3 s | |
| Shield Defend | blocks 1 hit for 0.5 s, cooldown 2 s | same, 1 s | |
| Shield Rush | 6 × 0.5 + 5 / 7.5, cooldown 10 s, Resistance I | 6 × 1 + 8 / 12, 5 s, Resistance II | |

Crit chance 10 % everywhere (pack).

## Combat style: still open (D-68) ⏰ reminder

**Owner, 2026-10-03:** deciding which combat to use. This format (animated weapons) feels more fun than plain hits + casting skills back and forth. Options in GDD D-68 / owner question M19:

| | A: plain hits + combo skills | B: animated weapons (this spec) | C: both |
|---|---|---|---|
| Basic attack | vanilla swing / MMOItems | ModelEngine 3-hit combo, slash + hit effects | B |
| Weapon moves | none (skills only) | R, Shift + L per weapon | B |
| Player skills (D-60) | 3-click combos | — | A |
| Stats / Mastery | MMOItems | none yet (Crucible item) | needs D-44 port |
| Server / client cost | lowest | see Performance below | B + A |

Decide after the load test below.

## Performance ⏰ reminder (owner, 2026-10-03: "won't this lag the server?")

Not measured yet. Estimate from our files and `ModelEngine/config.yml`:

| Phase | What runs | Cost |
|---|---|---|
| Weapon on the back (most of the time) | back model on the player, 2–4 bones, `pv=true`, no animations, no timer skill; the client moves it | ~0 after it is attached |
| Fighting (5–6 s after the last hit) | 1 combat holder per player (13–19 bones) playing attack animations + `teleport @owner ~onTimer:1` (MythicMobs, main thread) | **main cost**: 200 players fighting at once ≈ 4,000 teleports / s, cheap each, should fit MSPT ≤ 40 (estimate) |
| Each hit | hit-effect mob (7–8 bones) for 9 ticks, `limit=1` target | short entity spawn / remove churn |
| ModelEngine animation + packets | own threads (`Engine-Threads: 4`, `Culling-Threads: 4`), `Cull-Type: CULLED` | not on the main thread |
| Network / client | every viewer gets every nearby fighter's bone updates each tick: 50 players fighting in one spot ≈ 49 × ~15 bones per viewer | **biggest risk**: low-end PCs / slow connections drop FPS, server TPS fine |

Load test (before D-68 is decided):

1. Several players (or one player and many dummies, `/dummy spawn`) attack non-stop with the wooden weapons.
2. `/spark profiler --timeout 60` during the fight, plus `/spark health`.
3. Read the share of the tick taken by MythicMobs (timer skills) and ModelEngine; watch client FPS on a weak PC.

If it is too heavy, in this order:

| # | Fix | Effect |
|---|---|---|
| 1 | Combat model also ON the player with `pv=true`, attacks via `state` @self | removes the per-tick teleport (main-thread cost ~0 while fighting), also stops the slight lag when jumping mid-attack. Needs testing: attacks that follow the head yaw |
| 2 | Fewer hit-effect mobs (nearest target only, particles for far viewers) | less entity churn + packets |
| 3 | ModelEngine culling / view range tuning | less network for crowded spots |

## Commands & permissions

| Command | Who |
|---|---|
| `/mm items get wcmmo_item_spear_wood` · `wcmmo_item_swords_wood` · `wcmmo_item_sword_shield_wood` | admin |

## Test plan (dev box)

Reload order: `/meg reload` → `/nexo reload all` → `/mm reload`.

1. Get each item → wooden icon in hand, wooden weapon on the back (spear diagonal, two swords crossed, shield with the sword behind it).
2. Walk, sprint, jump, sprint-jump, turn only the camera → the weapon stays flat on the back, no gap, no bobbing, turns with the body.
3. L three times → 3-hit combo on the dummy (`/dummy spawn`), straw slash / hit effects, 2 damage (3 on crit).
4. R / Shift + L → the move from the table; again during cooldown → action bar countdown.
5. Stop for 5 s (spear 6 s) → weapon swings back onto the back, no jump between holder and back model.
6. Switch hotbar slot or drop → nothing left on the player.
7. Press F → skill bar swaps (not swallowed). Hold Shift + L → check Guard and the skill don't fight.
8. Sword & Shield: R, let the dummy / a mob hit you → hit blocked, shield effect.

## Rollback

Delete `ModelEngine/blueprints/wcmmo/{spear,swords,sword_shield}_wood/`, `MythicMobs/{items,mobs,skills}/wcmmo_{spear,swords,sword_shield}_wood.yml`, `Nexo/items/wcmmo_{spear,swords,sword_shield}_wood.yml`, `Nexo/pack/assets/minecraft/{models,textures}/wcmmo/{spear,swords,sword_shield}_wood/`, `scripts/wood_weapons.py`. No world or player data.

## Open questions

- Which D-04 weapon type are Twin Swords and Sword & Shield: both **Sword** (same Mastery), or new types? Matters for the MMOItems port (D-44).
- Same as 036: port to MMOItems with the kit's controls before more weapons are made?

## Implementation log

| Date | Repo | Run | Branch | Notes |
|---|---|---|---|---|
| 2026-10-02 | wcmmo | — (no FIRE run, prototype) | `feat/037-wooden-weapons` @ `7b0a514` | Script + 3 weapons. Poses checked in a side / back render against the player box. Server load check on a throwaway copy. In-game test plan not run yet |
