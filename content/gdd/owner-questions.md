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
| Weapon base (2026-10-02) | build our weapons on the four **Llama Studio** packs (Basic Polearm, Two Sword Style, Green Bow, Castle Knight). **Draconic is not part of the base** (stays installed as a reference only) | spec 010 |
| Weapon format (2026-10-03) | every weapon made from a pack follows the Wooden Bow / wooden weapons format: wooden recolour by script, **on the back = model ON the player with `pv=true` and the back pose baked in (no animations)**, attacks on a combat holder, back after 5 s, controls from spec 007 | specs 036, 037 |

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
| T9 | **F hold** (Frontguard): Minecraft sends F (swap hands) as a press only, no release. Test whether holding F repeats the event so the kit can keep the guard up; fallback: F press = guard for a short time / toggle, tap timing = parry | D-68 | PoC-3 rerun |
| ~~T10~~ | ~~Part swap PoC~~ **Passed 2026-10-03** (owner: "เบื้องต้นโอเคหมด"): three vendors' swords mix on the dual / shield / single stances | D-69, D-71 | done |
| ~~T7~~ | ~~Which plugin owns the final resource pack?~~ **Answered: Nexo** (D-40, 2026-09-28) | D-40 | — |

## Pending: missing design (owner will answer later)

| # | Question | Decision |
|---|---|---|
| ~~M1~~ | ~~The other base Bloodlines~~ **Answered 2026-09-30:** Fury / Ward / Pulse ([bloodlines.md](bloodlines.md)) | D-31, D-48 |
| M2 | Exact extractor prices and the stage unlock materials per stage (rules decided: D-33, D-34) | D-33, D-34 |
| ~~M14~~ | ~~Name clash~~ **Answered 2026-10-01:** keep both, tied to lore | D-62 |
| ~~M3~~ | ~~Weapon skills~~ **Answered 2026-09-30:** 10 general + 5 skills and 1 ultimate per slice weapon (spec 008). Greatsword / Spear / Crossbow / Tome skill lists still to design (Phase 2) | D-52 |
| ~~M4~~ | ~~Rune list~~ **Answered 2026-09-30:** 17 runes, spec 022 | D-56 |
| M16 | Final Mastery cap: 50 or 100 (test build uses 30) | D-36 |
| M17 | Skill lists for Greatsword, Spear, Crossbow, Tome (5 + ultimate each) | D-52 |
| M18 | Wooden Twin Swords and Sword & Shield (spec 037): both count as **Sword** (same Mastery), or new weapon types? | D-04, D-44 |
| ~~M19~~ | ~~Combat style~~ **Answered 2026-10-03: C** (D-68): animated weapons + player skills, new controls in D-68 | D-68, D-44 |
| M20 | Ultimate on Shift + Q is now a personal skill: still owned at a weapon's Mastery cap (D-60), or learned another way? Any weapon, or only the weapon it came from? | D-68, D-60 |
| M21 | Q buffs: which ones, and how are they learned (skill list missing)? | D-68 |
| M22 | Weapon skills: is each pack move a skill of that weapon type only (Spear: Shove, Hard Swing…), and do the D-52 / spec 008 skill lists merge with them? | D-68, D-52 |
| M23 | Off-hand weapon stats (D-69): full, half, or none? Does the off-hand sword add its own damage to dual-sword hits? | D-69 |
| M24 | Packs to buy next: Greatsword, Hammer, Crossbow, Staff, Tome (Staff: **Zoltraak**, 2026-10-04, spec 040); Spear / Bow need guard + twirl animations; a single-sword set would help (D-69) | D-04, D-70 |
| M25 | Staff stances (D-72): one-handed staff, dual staves, staff + shield, two-handed staff. Which animations (buy / make with the team), and does a one-handed staff cast the same bolts as the two-handed one? **2026-10-04:** the two-handed staff borrows the spear's poses for now (spec 040) | D-72, D-04 |
| M26 | How does the equipment screen open (D-77)? **Not with E**: Minecraft doesn't tell the server when a player opens their own inventory (only when it closes). Options: a button item in the E screen (MMOInventory has it), `/equip`, a free key combo, or a client mod. Owner: decide later | D-77 |
| M5 | World map: cities, regions, Low/Mid/High zones | — |
| M6 | Chapter 1 story outline | D-15b |
| ~~M7~~ | ~~Death penalty~~ **Answered 2026-10-01:** spec 027 | D-57 |
| ~~M8~~ | ~~Levelling speed~~ **Answered 2026-10-01:** spec 028 | D-58 |
| ~~M9~~ | ~~Party XP and loot~~ **Answered 2026-10-01:** spec 028 | D-59 |
| ~~M10~~ | ~~HUD layout~~ **Answered 2026-10-01:** spec 029 | D-61 |
| M11 | VIP / store: what can be sold without pay-to-win | new |
| ~~M12~~ | ~~Languages~~ **Answered 2026-10-01:** Thai + English, English proper names, spec 030 | D-27 |

## Pending: tests that need more people

| # | Test | Needs | Spec |
|---|---|---|---|
| PT1 | PoC-2 player-vs-player rows of the combat matrix (guard vs guard, heavy vs guard, Super Armour vs CC) | 2 players | 009, 004 |
| PT2 | PoC-2 MSPT report: 20 players / bots hitting at once, `/spark profiler` link | 20 testers or bots | 004 |

Owner (2026-10-02): do these when testers are available; they don't block PoC-3.

## Pending: team meeting

| # | Topic | Decision |
|---|---|---|
| ~~TM1~~ | ~~Confirm 3-repo layout~~ **Answered 2026-10-01: 3 repos, content in `wcmmo`** | D-38 |
| TM2 | Who does map / resources / models (2–5 people) | — |
| TM3 | Is 2–3 weeks for the vertical slice realistic with ~75 % on one person? | 004 |
| TM4 | VPS: CPU model / core count, provider, budget | 001 |
