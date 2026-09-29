# 016 — Quest & story framework

> Status: DRAFT · Target: wcmmo-content (BetonQuest, Citizens, MythicDungeons) · FIRE mode: confirm
> Design: [GDD v2 §7](../gdd/wcmmo-gdd-v2.md#7-quests--story) · Decisions: D-14, D-15, D-15b, D-27, D-32

## Big picture

- **Player story:** As a player, I follow a chapter-by-chapter story through cities; I can finish every main quest alone; story bosses happen in my own instance.
- **Done means:** Chapter 1 (starter city + Low zone) is playable start to finish solo, with dialogue choices and one instanced boss.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | plugin registry | add BetonQuest (D-15), MythicDungeons (D-14) |
| wcmmo-content | `BetonQuest/QuestPackages/wcmmo/ch01/` | conversations, objectives, rewards |
| wcmmo-content | MythicDungeons `ch01_boss` | instance for story boss |
| wcmmo-content | Citizens NPCs | quest givers |

## Conventions

| Thing | Pattern |
|---|---|
| Quest package | `wcmmo/ch<NN>/<quest>` e.g. `wcmmo/ch01/q01_arrival` |
| Main story tag | `wcmmo_main_ch01_done` |
| Side quest | `wcmmo/side/<region>/<quest>` |
| NPC | `wcmmo_npc_<name>` |

## Chapter 1 outline (placeholder — story team writes)

| # | Quest | Type | Reward |
|---|---|---|---|
| 0 | The Awakening (tutorial) | Bloodline Trial: hidden affinity scoring, Encounter, Reveal, Accept/Reject (**spec 024**) | Bloodline bound (spec 021) + tutorial kit |
| 1 | Arrival | leave the shrine, reach the first city | starter weapon of choice |
| 2 | First blood | kill 10 Low mobs | XP, gear |
| 3 | The lost scout | explore + dialogue choice | XP |
| 4 | Boss: <name> | instanced solo boss | chapter reward |

## Commands & permissions

BetonQuest defaults; staff `wcmmo.admin.quest` for resets.

## Performance

Instances unload 60 s after empty; max concurrent story instances *proposed* 30.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | New player completes chapter 1 alone | all objectives completable solo |
| 2 | Two players reach boss together | each gets own instance (or party instance if grouped) |

## Rollback

Quest progress is player data (BetonQuest DB) — never rename package paths after launch.

## Acceptance criteria

- [ ] D-14, D-15, D-15b, D-27 decided.
