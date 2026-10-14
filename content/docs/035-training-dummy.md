# 035 — Training dummy (DPS meter)

> Status: DRAFT · Target: wcmmo (MythicMobs `wcmmo_mob_dummy`, Skript `wcmmo_80_dummy.sk`) · FIRE mode: confirm
> Design: GDD v2 · Related: 009 (combat states), 021 (Bloodlines), 023 (Mastery), 025 (Remnant), 032 (guards / anti-farming) · Decisions: D-67

## Big picture

- **Player story:** In town I can beat on a training dummy to test a build: it never dies, never fights back, shows every status I put on it above its head, and tells me my DPS when I stop.
- **Admin story:** I place and remove dummies like Citizens NPCs, see a list of every dummy with who placed it, and teleport to any of them.
- **Done means:** the dummy, the meter and the admin commands below work, and dummies give nothing that can be farmed.

## The dummy

| Part | Rule |
|---|---|
| Model | **Skeleton** with a **Steve player head** and a **wooden sword** in the main hand (no bow), **arms raised forward like a zombie** |
| Name | `&e[Dummy] &f<name>` (default name "Training Dummy") |
| Behaviour | no AI: never moves, turns, attacks or retaliates; no knockback; no sunburn; silent |
| Health | **never runs out**: damage is applied for real (so on-hit effects, statuses and Bloodline hooks work), then health is topped up to full the next tick |
| Hit by | players only; guards and monsters ignore it (no faction targets) |

### Bought model: yungwilder Target Dummy (2026-10-02)

Installed in `wcmmo` as-is for reference: MythicMobs pack `plugins/MythicMobs/packs/yungwilder_targetdummy/` (mob `target_dummy`, item `TargetDummy`: `/mm items get TargetDummy`, right-click a block to place, shears to pick up), ModelEngine blueprint `yungwilder_targetdummy/target_dummy.bbmodel`, Nexo item `yungwilder_target_dummy` (PAPER model data 1) and damage-number font U+E000–E00F in `Nexo/pack/assets/minecraft/font/default.json`. Its own DPS meter needs PlaceholderAPI **Math** (`/papi ecloud download Math`) and **String** (jar in `PlaceholderAPI/expansions/`, unicode map in `PlaceholderAPI/config.yml`).

It is a separate mob from `wcmmo_mob_dummy` above. Open question for the owner: use this model for our dummy instead of the skeleton (the rules above stay ours).

### Status line above the head

A text display above the name, refreshed every 5 ticks:

```
[Dummy] Training Dummy
DPS 152.4 · Last 38.0 · Max 96.5 · Total 1840
Slowness II · Staggered · Guard Broken · Poison
```

Statuses shown: vanilla potion effects (with level), our combat states (spec 009: `staggered`, `guardbroken`, `superarmour`, `armourbreak`), and Bloodline marks if any (spec 021). Empty line when none.

### DPS meter

| Rule | Detail |
|---|---|
| Session start | first hit by a player |
| Session end | **5 s** without a hit from that player |
| Per player | every player has their own session; the head line shows the **latest attacker's** numbers |
| Live (head line) | DPS = damage in session ÷ seconds since session start; last hit; max hit; **session total** |
| Summary (chat, to that player) | duration, total damage, DPS, hits, max hit, crit % (if the crit flag is readable; VERIFY) |
| Command | `/dummy stats` → your last summary again |

### Rewards (anti-farming)

| Gives | Doesn't give |
|---|---|
| **Remnant gauge** (spec 025), so players can test ultimates | character XP, **Mastery XP**, profession XP, drops, Bloodline progress |

## Admin commands (like Citizens)

| Command | Behaviour |
|---|---|
| `/dummy spawn [name]` | places a dummy at your position, facing you; prints its ID (`#3`) |
| `/dummy list` | every dummy: ID, name, world, x y z, placed by, placed at, alive / missing; click a row to teleport |
| `/dummy tp <id>` | teleport to the dummy (or its saved spot if missing) |
| `/dummy remove [id]` | remove by ID; without an ID removes the nearest dummy within 5 blocks |
| `/dummy info <id>` | full record and history (who placed / removed / respawned it, when, how) |
| `/dummy respawn [id]` | re-place missing dummies at their saved spot (all, or one) |
| `/dummy stats` | (players) your last DPS summary |

Permissions: `wcmmo.admin.dummy` (all admin commands), `wcmmo.dummy.stats` (default).

### Records ("database")

| Store | What |
|---|---|
| Skript persistent variables `{wcmmo::dummy::<id>::*}` | `loc`, `name`, `uuid` (current entity), `by` (player name + UUID), `at` (date), `how` (command / auto-respawn), `removed` (by, at) |
| `{wcmmo::dummy::nextId}` | next ID; IDs are never reused |
| log file `plugins/Skript/logs/wcmmo-dummy.log` | one line per spawn / remove / respawn / auto-repair |

On server start (and every 5 min) every non-removed dummy is checked: if its entity is gone, it is placed again at its saved spot (`how = auto-respawn`, logged). Moving a dummy = remove + spawn.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | MythicMobs `Mobs/wcmmo_dummy.yml` | `wcmmo_mob_dummy`: skeleton, Steve head, wooden sword, NoAI, tag `wcmmo_dummy` |
| wcmmo | Skript `wcmmo_80_dummy.sk` | heal-back, meter, head line, commands, records, auto-repair |
| wcmmo | Skript `wcmmo_40_mastery.sk`, `wcmmo_61_xp_loot.sk` | skip entities tagged `wcmmo_dummy` |

## Data & IDs

| ID | Kind |
|---|---|
| `wcmmo_mob_dummy` | MythicMobs mob |
| `wcmmo_dummy` | scoreboard tag |
| `wcmmo.admin.dummy`, `wcmmo.dummy.stats` | permissions |
| `/dummy` | command |

## Performance

A handful of dummies (target ≤ 10, all in cities). The head line updates every 5 ticks per dummy and only while someone hit it in the last 10 s; otherwise it stays static. No AI, no pathfinding.

## Rollback

`/dummy remove` each dummy (or kill entities tagged `wcmmo_dummy`), remove `wcmmo_80_dummy.sk`, delete `{wcmmo::dummy::*}`. No world or player data touched.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | `/dummy spawn` | skeleton with Steve head and wooden sword, ID shown |
| 2 | Hit it for 30 s | never dies, never moves or hits back; head line updates |
| 3 | Stop for 5 s | chat summary with DPS, total, hits, max |
| 4 | Snare Arrow / perfect guard / poison on it | statuses appear on the head line, disappear when they end |
| 5 | Two players hit it | separate summaries |
| 6 | Check Mastery / XP / Remnant after 1 min | Mastery and XP unchanged; Remnant rose |
| 7 | `/dummy list`, click a row | teleports to it |
| 8 | `/dummy remove 1`, then `/dummy info 1` | gone; history shows who removed it |
| 9 | Kill the entity with `/kill`, restart | dummy back at its spot, logged as auto-respawn |

## Acceptance criteria

- [x] D-67 decided.
- [ ] Tests 1–9 pass.

## Two kinds of dummy (owner, 2026-10-14)

| | **Still** (`wcmmo_mob_dummy`) | **Mobile** (`wcmmo_mob_dummy_mobile`) |
|---|---|---|
| For | pure damage / DPS tests | testing knockback, stun, moves that push or pull |
| Look | skeleton with a head, raised arms | the bought **yungwilder Target Dummy model** and its hurt animations (ModelEngine `target_dummy`, kept when the pack was removed, D-80) |
| Moves? | never (no AI) | knocked back and stunned like a monster; **5 s after the last hit it runs back to its spot** (pathfinder, speed x2); teleports home if it makes no progress for 3 s, is more than 48 blocks away or in another world |
| Placed with | `/dummy spawn [name]` | its item `wcmmo_item_dummy_mobile` (right click a block; `/dummy item` gives one) or `/dummy spawn mobile` |
| Removed with | `/dummy remove [id]` | **shears + Shift right click** on it (the item comes back), or `/dummy remove` |

Both: never die (healed back), only players can hit them, same records (field `type`: `still` / `mobile`), DPS meter, head label (on the mobile one it follows the dummy, 2.15 above its feet: `cfg::dummy::mobileLabelLift`), auto-repair. Settings: `cfg::dummy::homeDelayTicks` 100, `homeSpeed` 2, `homeStuckTicks` 60, `homeMaxRun` 48.

## Sparring dummy (owner, 2026-10-15)

`/dummy spawn attacker` places `wcmmo_mob_dummy_attacker`: a still dummy (skeleton, iron sword and helmet, no AI, label "I hit back") that **hits back**. It is used for guard, perfect guard and low-HP tests (Bloodlines, spec 021).

| Setting (`cfg::dummy::*`) | Value |
|---|---|
| Attack every | 40 ticks (the `every 40 ticks` loop in `wcmmo_80_dummy.sk`) |
| `attackWindup` | 12 ticks of warning (sound + red particles, `wcmmo_dummy_attack_windup`), then the hit |
| `attackRange` | 3.5 blocks, nearest survival / adventure player; the hit lands only if the player is still within 4 blocks |
| `attackPct` | 10 % of the player's max HP per hit (it can kill) |

The hit is a real attack from the dummy (`Player.damage(amount, dummy)`), so guard, perfect guard and the Bloodline hooks see it like a monster's. A perfect guard staggers it, and it skips its attacks while staggered. Otherwise it behaves like the other dummies: never dies, only players can hit it, same records (`type` `attacker`).

## Implementation log

| Date | Repo | FIRE run | PR | Notes |
|---|---|---|---|---|
| 2026-10-02 | wcmmo | `run-wcmmo-003` | branch `feat/009-combat-poc` | Dummy works in game: spawn / list / tp / remove / info / respawn, never dies, head line DPS · Last · Max · Total, chat summary, hit line on the action bar. Finding: never set MythicMobs `MaxCombatDistance: 0` (it cancels every attack). |
| 2026-10-14 | wcmmo | — | `fix/009-damage-numbers` | D-80: the bought yungwilder TargetDummy pack is removed (our `/dummy` replaces it; `/wcmmoremovevendordummy` still clears old ones); no per-hit action bar, MythicLib shows each hit (`d3693fd`) |
| 2026-10-14 | wcmmo | — | `feat/035-mobile-dummy` | Mobile dummy (`a03c529`). Test server: placed (silverfish + model, label riding on it), item ok; knocked 8 blocks, stayed 4 s, ran home by 8 s, exactly on its spot by 11 s; from 20 blocks away back home within 10 s. Placing / picking up by hand needs a player to try |
| 2026-10-14 | wcmmo | — | `feat/035-mobile-dummy` | Owner: the mobile dummy's name stayed behind and floated too high. The label now follows it 2.15 above its feet (`532acf0`). Test server: label at +2.15, followed a knock-back (8.77 = 8.77) and the run home from 20 blocks |
| 2026-10-15 | wcmmo | — | `develop` | Owner tested in game: mobile dummy (place / knock-back / run home / label / pick up) pass. Merged (`44d7ddf`) |
| 2026-10-15 | wcmmo | — | `feat/021-poc7-bloodlines` | Sparring dummy (`7adbf04`). Loads with no errors; attacking a player needs a player to try |
| 2026-10-15 | wcmmo | — | `develop` (`6e81924`) | Sparring dummy used by the owner for PoC-7 tests; merged |
