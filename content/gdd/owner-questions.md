# Owner questions: answered & pending

> Tracker for questions to Tatoo (owner / head dev). When an answer arrives, move it to **Answered**,
> update the decision in [wcmmo-gdd-v2.md](wcmmo-gdd-v2.md), then the specs that cite it.

## Team

| Person | Role | Owns |
|---|---|---|
| **Tatoo** | owner, head dev (~75 % of the work) | code (`wcmmo-plugins`), server, resources, map, story |
| **OmAm** | story, resources, timeline / PM | story with Tatoo, some resources, keeps everyone on the same picture |
| team (2–5) | map, resources | roles not assigned yet |

## Answered: 2026-09-28

| Topic | Answer | Recorded in |
|---|---|---|
| Custom plugin (D-25) | ~~Tatoo writes it~~ **Revised 2026-09-29:** finish the bought-plugin setup, use vendor plugins + Skript first. After Phase 0, decide per system: own Kotlin plugin (`wcmmo-plugins`, by Tatoo) or keep vendor/Skript for easier implementation and maintenance | GDD v2 §0, spec 004 |
| Repos (D-38) | Owner wants 3: `wcmmo`, `wcmmo-specs`, `wcmmo-plugins`. **Team still to confirm** | GDD v2 §0 |
| Plugins owned (D-00) | MMOCore, MMOItems, MythicLib, MMOProfiles, MythicMobs, ModelEngine, Nexo, LuckPerms, DiscordSRV + the list in `../docs/plugins.md`. **Not owned: MythicDungeons** | GDD v2 §0 |
| Language tool (D-27) | Triton (bought). Which languages: still open | GDD v2 §0 |
| UI tool (D-39) | MythicHUD = always-on HUD; **UltimateUI = shops, quest list, every other custom UI** | GDD v2 §0 |
| Lifezone (D-19) | In-server, own plugin, maybe MMOCore data; proxy later. **2026-09-29:** it must be a real plugin (not Skript); discuss after the combat/MMO core is mostly finished | GDD v2 §8, spec 018 |
| Production VPS | 32 GB RAM, CPU good for 100–200 players; details later | spec 001 |
| Timeline | vertical slice target **2–3 weeks** | spec 004 |
| MMOInventory (D-09) | owned | GDD v2 §5 |
| MMOProfiles (D-43) | planned, not at start | GDD v2 §0 |
| Plugin versions | all bought → always the latest build; record the version at install | `../docs/plugins.md` |
| Decision session (2026-09-29) | 29 decisions settled: vitality, stats, combat, weapons, Bloodline/Rune rules, gear, world, extras. D-36 test values only | GDD v2 decision log |
| Skript vs Kotlin (D-47) | Skript for prototypes, tutorial/quest glue, tools; Kotlin for hot paths + player data. Until the D-25 review, Skript covers the hot paths too | `../docs/plugins.md` §3.8 |
| First Bloodline (D-32) | **The Awakening** tutorial (team design): hidden Pulse/Ward/Fury affinity, Encounter, one-time Reject | `awakening-tutorial.md`, spec 024 |
| Base Bloodlines (D-31, D-48) | **Fury (Muscle) / Ward (Bone) / Pulse (Heart)**, A/B paths at stages 2/3/5, solo first, future Bloodlines as specialists | `bloodlines.md`, spec 021 |
| FPV test (D-05) | start with the bought **Draconic Dual Sword FPV** pack (`~/Downloads/draconic_dual_sword_FPV`) | spec 010 |

## Pending: plugins (D-00)

Full list with docs and overlaps: [`../docs/plugins.md`](../docs/plugins.md). Owned on 2026-09-28: MythicHUD, UltimateUI, MythicCrucible, CosmeticsCore, ItemSkins 2.1.0, BattlePass 5.0.12, BotSentry 9.9.1, Guilds 3.5.7.2 (parked), Order 2.6.9 (parked), LuxCollect, LuxDialogues, Triton. Still missing below:

| Plugin | Bought? | Licence holder | Version / build | Supports 26.2? | Needs (dependencies) |
|---|---|---|---|---|---|
| Nexo | | | | | |
| MythicMobs | | | | | |
| ModelEngine | | | | | |
| MMOCore | | | | | MythicLib |
| MMOItems | | | | | MythicLib |
| MythicLib | free with MMO* | | | | |
| MMOInventory (D-09) | | | | | MythicLib |
| MythicDungeons (D-14) | | | | | MythicMobs |
| Triton | yes | | | | |
| UltimateUI | yes | | | | |
| PlaceholderAPI | free | | | | |
| LuckPerms | free | | | | |
| BetonQuest (D-15) | free | | | | |

## Pending: technical risks (owner will answer later)

| # | Question | Decision | Test |
|---|---|---|---|
| T1 | First-person animation: test the Draconic pack first (ModelEngine view model). See findings F1–F10 in spec 010 | D-05 | PoC-1 |
| T8 | FPV weapons long-term: keep Crucible items, or port to MMOItems + our plugin so one weapon has both stats and animation? | D-44 | PoC-1 |
| T2 | `Shift + Right Click` may clash with FPV weapons whose right click attacks, and `Shift+F` is blocked for dual weapons. Pick a third fallback if the test fails | D-03 | PoC-3 |
| T3 | Bloodline effects: our plugin owns data + triggers, MythicMobs skills are effects. Agree? | D-37 | PoC-7 |
| T4 | Mastery cooldown via PlaceholderAPI in MythicMobs, fallback: cooldown applied by our plugin. Agree? | D-36 | PoC-8 |
| T5 | Identify via MMOItems unidentified items, fallback crafted/quest gear. Who tests it? | D-10 | PoC-4 |
| T6 | Nexo furniture inside house schematics: if FAWE loses furniture data, fallback is re-spawning furniture from a saved list. OK? | D-19 | PoC-5 |
| ~~T7~~ | ~~Which plugin owns the final resource pack?~~ **Answered: Nexo** (D-40, 2026-09-28) | D-40 | — |

## Pending: missing design (owner will answer later)

| # | Question | Decision |
|---|---|---|
| ~~M1~~ | ~~The other base Bloodlines~~ **Answered 2026-09-30:** Fury / Ward / Pulse ([bloodlines.md](bloodlines.md)) | D-31, D-48 |
| M2 | Exact extractor prices and the stage unlock materials per stage (rules decided: D-33, D-34) | D-33, D-34 |
| M14 | Name clash: tutorial "The Awakening" vs stage 5 "Awakened"; rename one? | R14 |
| M3 | 3 unique skills per weapon (names + effects); list of 8 weapons is decided | D-04 |
| M4 | Rune list (which runes exist); slot unlocks and rules are decided | D-35b |
| M16 | Final Mastery cap: 50 or 100 (test build uses 30) | D-36 |
| M5 | World map: cities, regions, Low/Mid/High zones | — |
| M6 | Chapter 1 story outline | D-15b |
| M7 | Death penalty (XP loss? item loss? respawn point?) | new |
| M8 | Levelling speed (XP curve); cap 60 is decided | D-07 |
| M9 | Party XP and loot sharing; size 2–5 is decided | D-18 |
| M10 | HUD layout: where HP / Mana / Stamina / skill bars / cooldowns show (MythicHUD) | D-01 |
| M11 | VIP / store: what can be sold without pay-to-win | new |
| M12 | Which languages Triton must serve (Thai + English?) | D-27 |

## Pending: team meeting

| # | Topic | Decision |
|---|---|---|
| TM1 | Confirm 3-repo layout | D-38 |
| TM2 | Who does map / resources / models (2–5 people) | — |
| TM3 | Is 2–3 weeks for the vertical slice realistic with ~75 % on one person? | 004 |
| TM4 | VPS: CPU model / core count, provider, budget | 001 |
