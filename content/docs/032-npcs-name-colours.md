# 032 — NPCs, guards & name colours

> Status: DRAFT · Target: wcmmo (Citizens, LuxDialogues, holograms, MythicMobs guards / factions / spawners, Skript) · FIRE mode: confirm
> Design: GDD v2 · Decisions: D-64

## Big picture

- **Player story:** One look at a name tells me what something is: green and gold I can talk to, blue fights on my side, red and purple are enemies. City guards protect the city from monsters on their own, go back to their posts when the fight is over, and come back if they fall.
- **Done means:** every NPC / mob uses the colour below; guards behave as described; guards can't be exploited to farm.

## Name colours (decided 2026-10-01)

| Colour | Who | Players can hit it? | Built with |
|---|---|---|---|
| 🟢 **Green** `&a` | ordinary NPCs: villagers, side-quest NPCs, general shops | no, talk only | Citizens + LuxDialogues |
| 🟡 **Gold** `&6` | important NPCs: main-quest NPCs and services (Enhancer, Blacksmith, Orb Merchant, Bloodline Keeper). Marker above the head: **`!`** quest available, **`?`** quest to hand in | no | Citizens + LuxDialogues + hologram |
| 🔵 **Blue** `&b` | guards: gate guards, patrols (wall archers later) | **no**, but **monsters can** | MythicMobs |
| 🔴 **Red** `&c` | monsters / enemies, shown as `[Lv 12] Forest Wolf` | yes | MythicMobs |
| 🟣 **Purple** `&5` | bosses, elites, world bosses | yes | MythicMobs |

Green / gold = talk · blue = on your side · red / purple = enemy. Names are English proper names (spec 030); the `Lv` tag and dialogue go through Triton.

## Guards (blue)

| Behaviour | Default |
|---|---|
| Spot a monster in **line of sight** within range → attack it until it dies | 16 blocks |
| Never chase too far from the post: beyond the leash → return to the post | 24 blocks |
| After the kill: **gate guard** returns to its post and idles; **patrol** resumes its route | — |
| Death → **respawn near the post** and keep guarding | 30 s |
| Never attack players; **player damage to guards is cancelled**; monsters can damage guards | — |
| Strength: handles Low-zone monsters around the city easily; can lose to raids / events | per zone |

### Anti-farming

| Rule | Why |
|---|---|
| A monster killed with **no player damage** gives **no XP and no drops** | no AFK farming next to guards |
| If players also hit it, only the **players' own damage** counts for kill credit (spec 028); guard damage never counts | guards can't carry a kill for someone |

### Guard types

| Type | Behaviour |
|---|---|
| Gate guard | stands at a fixed post |
| Patrol | walks a route of waypoints around the city |
| Wall archer (later) | fixed post on a wall, ranged |

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | Citizens | green / gold NPCs, protected, coloured names |
| wcmmo | holograms (CMI) | `!` / `?` markers above gold NPCs |
| wcmmo | MythicMobs mobs | guards in faction `guards`; monsters in faction `monsters`; guards target the `monsters` faction, monsters target players **and** `guards` (VERIFY faction / AI target options on the installed version) |
| wcmmo | MythicMobs spawners | one per guard post: respawn 30 s, leash 24 blocks |
| wcmmo | MythicMobs AI | patrol waypoints (VERIFY the patrol goal) |
| wcmmo | Skript (kit) | cancel player damage on anything tagged `wcmmo_guard`; no XP / drops without player damage |

## Data & IDs

| ID | Kind |
|---|---|
| `wcmmo_mob_guard_gate`, `wcmmo_mob_guard_patrol` | guard mobs (blue) |
| `wcmmo_guard` | scoreboard tag on every guard |
| `guards`, `monsters` | MythicMobs factions |
| `wcmmo_spawner_guard_<post>` | MythicMobs spawner per post |

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Look at each NPC / mob type | colours match the table; gold NPCs show `!` / `?` |
| 2 | Hit a guard | no damage |
| 3 | Lead a monster to the gate | guards within 16 blocks attack until it dies, then return to post |
| 4 | Lead a monster 30 blocks away while a guard chases | guard gives up at 24 blocks and returns |
| 5 | Patrol spots a monster | fights, then resumes the route |
| 6 | Let monsters kill a guard | it respawns near its post after 30 s |
| 7 | Guards kill a monster alone | no XP, no drops |
| 8 | Player and guard both hit a monster | player gets credit from their own damage only |

## Acceptance criteria

- [x] D-64 decided.
- [ ] Tests 1–8 pass.
