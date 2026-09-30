# 027 — Death & respawn

> Status: DRAFT · Target: wcmmo (Skript, MMOCore death XP, MMOItems durability, world gamerules) · FIRE mode: validate
> Design: GDD v2 · Decisions: D-57

## Big picture

- **Player story:** When I die, there's no vanilla "You Died" screen and no button to press. The camera stays on the spot where I fell, a short message and countdown appear, and I'm brought back at the nearest Waystone or city. Dying costs a little, never my gear or long-term progress.
- **Done means:** no death screen; automatic respawn after a countdown; the penalties below applied; revive-on-the-spot with 100 Remnant; dungeon checkpoints and party revive.

## Penalties (decided 2026-09-30)

| What | Rule | Why |
|---|---|---|
| XP | lose **1 % of the XP needed for the current level**; never lose a level | BDO-style: stings, doesn't wipe hours |
| New players | **below Lv 15: no penalty at all** | learn without fear |
| Items | **nothing drops** in PvE (`keepInventory`) | enhanced gear is too costly to lose |
| Durability | equipped weapon + armour lose **5 % of max durability**; repair at the Blacksmith (gold sink); at 0 an item's stats stop working until repaired | BDO-style; MMOItems durability (VERIFY in PoC) |
| Remnant gauge | **halved** | losing the stored ultimate hurts |
| Food / potion buffs | cleared | usual MMO rule |
| Bloodline, Mastery, Runes | **never lost** | long-term progress |

## Respawn flow (open world)

```txt
fatal hit (Fury Death Defying / Ward Last Stand get their chance first)
  → death: gamerule doImmediateRespawn skips the vanilla screen
  → the player is held at the death spot as a spectator (can't fly away)
  → title "You have fallen" + countdown (5 s), chat button [Revive here]
  → countdown ends → survival mode, teleport to the nearest Waystone (or city), full HP
```

| Rule | Detail |
|---|---|
| Countdown | **5 s** (config) |
| Where | nearest **Waystone** in the same world; if none, the region's city |
| Revive here | chat button during the countdown: costs **100 Remnant**, 10-minute cooldown, open world only (not in dungeons, not in arenas). No shop item for it (not pay-to-win) |
| Invulnerable after respawn | 3 s |
| Waystones | fixed points per zone, registered in the kit config (`{-wcmmo::waystone::*}`); players unlock them by walking close |

## Dungeons

| Rule | Detail |
|---|---|
| Solo | respawn at the dungeon's last checkpoint after the countdown |
| Party | a party member can **revive** a fallen member: stand next to them and hold Shift for 3 s. If nobody does, the countdown sends them to the last checkpoint |
| Penalties | same as open world |

## PvP (open world, Lv 25+, later)

Decided with the guild / node war design (D-06c). Arena deaths have no penalty.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | world gamerules | `doImmediateRespawn true`, `keepInventory true` (PvE worlds) |
| wcmmo | `plugins/Skript/scripts/wcmmo_60_death.sk` | hold, countdown, revive button, respawn at the nearest Waystone, penalties, party revive |
| wcmmo | MMOCore config | death XP loss 1 % (or done by the script if MMOCore can't do "1 % of the level requirement") |
| wcmmo | MMOItems | durability on weapons and armour |
| wcmmo | Citizens NPC | `wcmmo_npc_blacksmith` repairs gear |

## Data & IDs

| ID | Kind |
|---|---|
| `wcmmo_waystone_<name>` | respawn point (location in the kit config) |
| `wcmmo_npc_blacksmith` | NPC: repair |
| `%wcmmo_respawn_seconds%` | placeholder for the HUD countdown |

## Balance (proposed)

| Setting | Value |
|---|---|
| XP loss | 1 % of the current level's requirement (none below Lv 15) |
| Durability loss | 5 % of max per death |
| Countdown | 5 s |
| Revive here | 100 Remnant, CD 10 min, open world only |
| Post-respawn protection | 3 s |
| Party revive | hold Shift 3 s next to the fallen member |

## Commands & permissions

| Command | Permission | Behaviour |
|---|---|---|
| `/wcmmo waystone add <name>` | `wcmmo.admin.waystone` | register a Waystone at your position |
| `/wcmmo waystone list` | `wcmmo.admin.waystone` | list them |

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Die to a mob | no vanilla death screen; spectator at the spot; title + 5 s countdown |
| 2 | Wait | respawn at the nearest Waystone with full HP, 3 s protection |
| 3 | Die at Lv 10 / Lv 20 | no loss / 1 % of the level requirement lost, level never goes down |
| 4 | Check gear | durability −5 %; at 0 the item's stats stop working; Blacksmith repairs it |
| 5 | Remnant 80 before death | 40 after |
| 6 | Die with 100 Remnant, click [Revive here] | revive on the spot, Remnant 0, button unavailable for 10 min |
| 7 | Die in a dungeon, party member holds Shift 3 s next to you | revived in place |
| 8 | Die in a solo dungeon | respawn at its last checkpoint |
| 9 | Fury 5A Death Defying ready, take a lethal hit | Death Defying triggers instead of dying |

## Rollback

Disable the script and set `doImmediateRespawn false`: vanilla death screen returns.

## Acceptance criteria

- [x] D-57 decided.
- [ ] Tests 1–9 pass.
