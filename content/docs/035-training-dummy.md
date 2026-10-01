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

## Implementation log

| Date | Repo | FIRE run | PR | Notes |
|---|---|---|---|---|
| 2026-10-02 | wcmmo | `run-wcmmo-003` | branch `feat/009-combat-poc` | Dummy works in game: spawn / list / tp / remove / info / respawn, never dies, head line DPS · Last · Max · Total, chat summary, hit line on the action bar. Finding: never set MythicMobs `MaxCombatDistance: 0` (it cancels every attack). |
