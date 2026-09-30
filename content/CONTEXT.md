# WC-MMO — Project context for AI assistants

> **Snapshot:** 2026-09-29 · **Maintainer:** Tatoo (owner, head dev) · **Source of truth:** the private `wcmmo-specs` repo
>
> Paste or upload this whole file into your AI assistant (Claude, ChatGPT, …) before asking it about WC-MMO.
> It is self-contained: the AI does not need repo access to understand the project.
> If this file and the repo disagree, **the repo wins** (`gdd/wcmmo-gdd-v2.md`, `docs/`).

---

## 0. Instructions for the AI reading this

You are helping a small team (2–7 people) build **WC-MMO**, a classless action MMORPG on a Minecraft server.

1. **Respect decisions.** Items marked **DECIDED** are settled. Do not re-argue them unless the user asks. Items marked **OPEN** are where your ideas are welcome.
2. **Propose, don't invent facts.** When you suggest something new, label it as a proposal with options + a recommendation, in the same style as a decision `D-xx`. Never state a plugin feature as fact unless you are sure; say "verify in docs" otherwise.
3. **Respect the progression compartments (section 3).** Stats never add damage; enhancement is the only raw-power source; Mastery gives speed/unlocks, not AP/DP; Runes are small passives; Bloodlines change mechanics.
4. **Use the project's IDs and naming** (section 9) in any config, YAML, item, skill or permission you write.
5. **Spec-first workflow.** Design → decision in the GDD → spec `docs/NNN-*.md` → build → test → ship (section 2). If asked to "just build it", still say which spec it belongs to.
6. **Minecraft server context:** Purpur 26.2, Java 25, Paper-API plugins. Target 100–200 concurrent players, performance budget **MSPT ≤ 40**. Prefer config/plugin solutions. Custom code: **Skript** (with SkBee, skript-reflect, skript-placeholders) on top of the bought plugins, **for everything for now** (DECIDED, D-25 revised 2026-09-29). There is no Kotlin plugin yet: after Phase 0 the team decides per system whether to move it into their own plugin or keep it on vendor plugins/Skript. Don't suggest creating `wcmmo-plugins` before that review; do mention when a script looks heavy enough (every hit/tick) to be a candidate.
7. **Never** put secrets, paid plugin jars, or player data (UUIDs, IPs) in answers meant for git. Never link leak sites for plugins.
8. Reply in the language the user writes in (team is Thai; docs are English).

---

## 1. Project snapshot

| | |
|---|---|
| Game | Classless action MMORPG on Minecraft. Inspired by **Black Desert Online** (combat states, AP/DP zones, regional story, stationary farming, lifeskills), **MU Online** (stat-gated gear, enhancement), **Wynncraft** (stat allocation, identified gear, dialogue), **One Piece Devil Fruits** (Bloodlines) |
| Server | Purpur **26.2**, Java 25, Generational ZGC |
| Scale | 100–200 concurrent players on one production server (VPS, 32 GB RAM, heap ~20 GB proposed) |
| Environments | `develop` branch = dev box (Windows, 8 GB heap) · `main` branch = production (Linux VPS) |
| Team | **Tatoo**: owner, head dev, ~75 % of the work (plugins, server, resources, map, story). **OmAm**: story, resources, timeline/PM. **2–5 others**: map and resources (roles not assigned yet) |
| Timeline | **Vertical slice target: 2–3 weeks** from 2026-09-28 (tight; scope re-check after week 1) |
| Current phase | Phase 0: set up plugins and prove risky tech (proof-of-concepts) |

---

## 2. Repos and workflow

| Repo | Holds | Status |
|---|---|---|
| `wcmmo` (private) | the real server: configs, scripts. Paid assets may live here (private) | exists |
| `wcmmo-specs` (private) | design doc (GDD), specs, registries, plugin guide, open questions | exists |
| `wcmmo-plugins` | source of our own Kotlin plugin(s) + starter build per plugin | **deferred** until the per-system review after Phase 0 (D-25) |

The owner wants only these 3 repos; the team still has to confirm (D-38).

**Workflow**
1. **Design** in `gdd/wcmmo-gdd-v2.md`. Every choice is a decision `D-xx` (options, recommendation, owner's call, status).
2. **Spec** in `docs/NNN-<slug>.md`: exact files/config keys, IDs, balance tables, test plan, rollback. A spec cannot be READY while a decision it cites is OPEN.
3. **Build** in the target repo with **specsmd FIRE** (an AI dev-flow tool: intent → work items → logged runs). One branch per spec off `develop`.
4. **Test** on the dev box following the spec's test plan (spark profiler for performance).
5. **Ship** via pull request `develop` → `main` only. Nobody commits to `main` of `wcmmo`.

**Hard rules:** no secrets / paid jars / player data in git; register every new ID before use; balance numbers go in tables; every spec has a rollback.

---

## 3. Core design rule: progression compartments

| System | Job | Gives | Never gives |
|---|---|---|---|
| Level & stats (STR, AGI, INT, DEX, DEF) | **Gateway** | the right to equip gear | raw damage |
| Enhancement (+1…+15, then I…V) | **Raw power** | AP (attack power) / DP (defense power) | skills |
| Weapon Mastery | **Fluidity** | unique weapon skills, lower cooldowns / cast time | AP / DP |
| Skill slots (10 active) | **Tactical limit** | choice of loadout | — |
| Bloodline (1) | **Identity** | playstyle mechanics that evolve by stage | flat stat piles |
| Runes (2–4) | **Fine-tuning** | small passives (HP, stamina regen, CDR…) | new mechanics |

---

## 4. Game systems (GDD v2)

### 4.1 Vitality
- **HP** and **Mana** (spellcasting). **Stamina replaces the hunger bar**: limits dashing, pays for physical skills.
- **Food is not survival**: it works like potions (heals, buffs).
- Proposed bases: HP 100, Mana 100 (2/s), Stamina 100 (10/s after 1 s idle). Dash costs 25 stamina.

### 4.2 Classless: Bloodlines & Runes
- **No classes.** Any player can use any weapon they have the stats for.
- **Bloodline (1 slot)**: core identity, hard-bound; changing it needs a rare **extraction item** (progress kept per Bloodline, proposed). Evolves in **5 stages** that change *mechanics*.
- **3 base Bloodlines (DECIDED, D-31/D-48), tone like Black Desert.** Full design: `gdd/bloodlines.md`.

| Bloodline | Body part | Core axis | Solo strength | Party bonus | Stage 4 active |
|---|---|---|---|---|---|
| **Fury** | Muscle | risk: lower HP = stronger | fastest clears | damage | Blood Rage (pay HP, reset cooldowns) |
| **Ward** | Bone | timing: block to stack Bulwark, perfect guards, release | best survival | tank | Bone Bastion (absorb shield, reflect) |
| **Pulse** | Heart | flow: chain *different* skills; every 3 → a Pulse that heals you and hurts enemies | most consistent in long fights | support | Heartbeat Surge (every skill Pulses for 6 s) |

- Stage 1 and 4 fixed; **stages 2, 3 and 5 offer path A or B** (8 builds per Bloodline, PoE2-style), respec at the Bloodline Keeper for gold.
- **Solo first:** each can recover, deal damage and survive alone; ally effects are bonuses (≤ 50 % of self value) with a solo version.
- **More Bloodlines come with the story** (no fixed number). The base three are generalists; new ones are specialists with a *new core axis* and the same power budget, checked by a 3-test benchmark (clear / solo boss / survival, each Bloodline leads only its own, combined within ±15 %).
- Names: one easy English word per Bloodline. Lore: base three are parts of one body; the past self wanted a "complete body".

- **Runes (2–4 slots)**: free to swap; small passives; turn the same Bloodline into Tank or DPS. No duplicate rune IDs. Total cooldown reduction from all sources capped at 30 % (proposed).
- Implementation (for now): Skript holds Bloodline data + triggers (using the registered IDs), MythicMobs skills are the effects. Whether this later moves to our own plugin is part of the per-system review (D-25).
- **How the first Bloodline is chosen: The Awakening** (DECIDED, team design). *"You do not choose the Bloodline. The Bloodline chooses you."* The tutorial secretly scores three affinities from what the player does: **Pulse** (protect the wounded, free the trapped villager), **Ward** (hold the ring, walk the fear path), **Fury** (kill the brute, break the cracked wall), each +2. Clear lead → that Bloodline; close scores → a **Bloodline Encounter** where the tied Bloodlines argue and the player walks to one. Reveal → **Accept** or **Reject once** (then a manual pick of the 3 base Bloodlines). Leaving the tutorial locks it; later changes need the Extraction Item.

### 4.3 Weapons, stats, mastery, skills
- **Stats gate gear** (e.g. heavy Greatsword needs high STR). Level cap 60, 2 points/level. AGI also raises **basic** attack / shot speed, +0.5 %/point, **cap +30 %** (D-50).
- **Weapon types (8):** Sword, Greatsword, Hammer, Spear (melee) · Bow, Crossbow (ranged) · Staff, Tome (magic). Vertical slice: Sword, Hammer, Bow, Staff.
- **Skills (D-52, spec 008):** **10 general skills** usable with any weapon (Dash, Backstep, Sidestep, Kick, Shoulder Charge, Leap, Second Wind, Battle Cry, Iron Skin, Focus) + **5 skills and 1 ultimate per weapon**. Every weapon has exactly one guard-break skill; Hammer / Greatsword heavy skills break guard and Super Armour.
- **Weapon Mastery**: one MMOCore profession per weapon; XP from hitting mobs; weapon skills unlock at Mastery 0/5/10/15/20, the ultimate at 25 (test build, cap 30); cooldown reduction up to 20 %.
- **Remnant gauge & ultimates (D-51, spec 025):** fighting fills Remnant (0–100: basic hit +1, skill hit +3, +1 per 2 % HP lost); at 100 press **Q** for the held weapon's ultimate (Super Armour while casting). Lore (team only): it's the past self's soul fragments leaking out.
- **Controls:**

| Input | Action |
|---|---|
| Left click | basic attack (melee weapons, Staff / Tome magic bolt) |
| Right click | Bow / Crossbow: **instant shot, no charging** (D-53) |
| Shift (hold) | Guard (Frontguard) |
| F | swap skill bar 1 ↔ 2 (D-03 revised) |
| Q | ultimate (100 Remnant) |
| F in the inventory on an item | next page of item details: stats / upgrades / lore (D-54, spec 026) |

- **10 active skill slots** in **two bars of 5**; the ultimate doesn't use a slot.
- **Weapon-specific casting cap:** a weapon skill (e.g. Hammer's *Ground Smash*) fails if you hold a different weapon type.

### 4.4 Combat
- BDO-style states: **Frontguard** (frontal block), **I-frame** (invincible during dodges; **deferred, D-49**: not built in Phase 0), **Super Armour** (immune to stagger/CC, still takes damage). Heavy weapons (proposed: Hammer, Greatsword) break guard and Super Armour.
- **Souls-like first-person (FPV) animation** with ModelEngine.
- Status: testing with a bought pack, **Draconic Dual Sword FPV** (MythicMobs skills + MythicCrucible item triggers + ModelEngine first-person model `pv=true`). Known findings: needs Crucible item triggers; damage is fixed (not tied to stats yet); right-click is an attack; F key/off-hand used by dual swords (clashes with the F bar swap, fix when porting, D-44); third-person model has no attack animations; dual-wield give/take could dupe items; assets must be merged into the Nexo pack.

### 4.5 Equipment
- 4 armour slots + **accessories (BDO style)**: 1 Necklace, 1 Earring, 1 Ring, 1 Belt (via MMOInventory).
- **Identify** system: unidentified drops roll random stats (Wynncraft). Fallback: crafted / quest gear. Elements on gear.
- Proposed rarities: common, uncommon, rare, epic, legendary.

### 4.6 Enhancement
- Weapons **and armour**: +1…+15, then **I…V** (maybe to X). Accessories: I…V (still OPEN whether they stay enhanced).
- Proposed: 100 % success to +7, falling to 5 % at V; pity stacks; **items never destroyed**.

### 4.7 Zones, farming, bosses
- **AP/DP soft cap** per zone (DECIDED): low AP → 10–20 % damage; overcapped AP counts half beyond the zone's recommendation.
- Proposed tiers: Low (AP 50 / DP 60, Lv 1–20), Mid (120/150, Lv 20–40), High (200/260, Lv 40–60).
- **Loop farming** (open-world rotations) and **stationary farming** (activate a totem → waves of high-tier mobs for a set time, MythicMobs spawners).
- **Solo and party instanced dungeons**; **world bosses** with loot by **damage contribution**, not last hit.

### 4.8 Story & quests
- **Story canon (TEAM ONLY, spoilers, never put on the public site):** the tutorial (Chapter 0) *looks* like a realm of floating ruins between worlds but is secretly **the past** of the same place. At its end the realm collapses, the Selection Stone shatters and the player sinks into water; in Chapter 1 they wash up on a forest stream bank in the same spot, centuries later, are rescued by villagers, and reach the first city (name TBD, Thai-inspired city of waterways and faith), with no memory and a stone fragment named `???` carved with their Bloodline mark. The hidden truth: the player's past self tried to unite every Bloodline in one body, failed, and was defeated; body and soul split and memory was lost. A friendly spirit companion is really a fragment of the player's old mind and becomes the Chapter 1 boss ("I am you"); winning means **accepting** it. Chapter 1 asks "who am I?", Chapter 2 asks "who will I choose to be?". Full canon and reveal order: `gdd/lore-bible.md`; trailer plan: `gdd/trailer.md`.
- Chapter- and region-based main story, city to city (BDO). **100 % soloable**; story bosses instanced.
- Dialogue: **LuxDialogues** (Wynncraft-style). The quest engine to pair with it is not chosen yet.
- Proposed chapter 1: tutorial → try Bloodlines → choose Bloodline → first region → instanced boss.

### 4.9 Lifezone & housing (Heartopia style)
- Separate **Lifezone** worlds for housing + lifeskills, **hard cap 20 players = 20 plots**; "World Full" blocks entry.
- A house (blocks + Nexo furniture) is saved as a **schematic** and **pasted asynchronously with FAWE** onto a free plot in whichever Lifezone the player enters.
- DECIDED: runs inside the main server with our own plugin; proxy (Velocity) only later if needed. Lifezone is the one system already agreed to be a real plugin (not Skript); it is discussed and built after the combat/MMO core is mostly finished.

### 4.10 Lifeskills
- **Mining, Gathering, Fishing, Cooking, Alchemy** (MMOCore professions).
- Lifezone = safe low–mid resources. Monster zones = rare high-tier resources (crafters go out or hire escorts).
- Furniture: Nexo, sold by NPCs or crafted.

### 4.11 Not designed yet (coming soon)
Economy & trade · Guild & node war · Pets & mounts · death penalty · party system · VIP/store rules.

---

## 5. Roadmap

| Phase | Goal |
|---|---|
| 0: PoC | Prove risky tech: FPV animation, combat states, F bar swap / Q ultimate / instant bow, Bloodline hooks, Mastery cooldown math, Identify, Lifezone save/paste with Nexo furniture, stamina display |
| 1: Vertical slice | Tutorial + 1 region, all 3 base Bloodlines stages 1–3, 2 Rune slots, 4 weapons with Mastery to 25, stat gating, 1 solo dungeon |
| 2: Core MMO | All launch Bloodlines to stage 5, all weapons, enhancement to V, Mid/High zones, totems, world boss, party dungeon |
| 3: Lifezone | Housing instances, lifeskills, furniture |
| 4: Social | Economy, guilds & node war, pets & mounts |

---

## 6. Specs (in `wcmmo-specs/docs/`)

| # | Spec | Status |
|---|---|---|
| 001–003 | Server baseline, base plugin stack, void overworld | DONE |
| 004 | Roadmap & Phase 0 PoCs (PoC-1…8) | DRAFT |
| 005 | Vitality: HP, Mana, Stamina, food | DRAFT |
| 006 | Stats as the gear gateway | DRAFT |
| 007 | Skill slots & bar swap (classless) | DRAFT |
| 008 | Weapon types & unique weapon skills | DRAFT |
| 009 | Combat states: Frontguard, I-frame, Super Armour | DRAFT |
| 010 | First-person animation PoC (Draconic pack findings) | DRAFT |
| 011 | Equipment & accessory slots | DRAFT |
| 012 | Item generation, Identify & elements | DRAFT |
| 013 | Enhancement | DRAFT |
| 014 | Zones & AP/DP soft cap | DRAFT |
| 015 | Monster tiers & farming (totems) | DRAFT |
| 016 | Quest & story framework | DRAFT |
| 017 | World bosses & dungeons | DRAFT |
| 018 | Lifezone instances & housing | DRAFT |
| 019 | Lifeskills & resource tiers | DRAFT |
| 020 | Furniture (Nexo) & lifeskill NPCs | DRAFT |
| 021 | Bloodlines | DRAFT |
| 022 | Passive Runes | DRAFT |
| 023 | Weapon Mastery | DRAFT |
| 024 | The Awakening: tutorial & Bloodline Trial | DRAFT |

Other files: `docs/README.md` (registries of all IDs), `docs/plugins.md` (plugin guide), `gdd/owner-questions.md` (pending questions), `docs/adr/` (architecture decisions).

---

## 7. Plugins (all bought unless noted; always latest build)

| Job | Plugin |
|---|---|
| Server | Purpur 26.2 |
| Essentials (homes, warps, chat, economy for now) | CMI + CMILib, Vault |
| Permissions | LuckPerms |
| World, regions, building | WorldGuard, FastAsyncWorldEdit, Multiverse-Core |
| NPCs | Citizens |
| Stats, Mana/Stamina, Mastery, lifeskills | MMOCore (+ MythicLib) |
| Gear, Identify, enhancement, runes | **MMOItems** (owns all gear) |
| Accessory + rune slots | MMOInventory |
| Multiple characters | MMOProfiles (planned later, not at start) |
| Mobs, bosses, Bloodline effects, totems | MythicMobs |
| Models, FPV animation | ModelEngine |
| FPV weapon item triggers (test) | MythicCrucible |
| Furniture, custom blocks, **the one merged resource pack** | **Nexo** |
| Always-on HUD (HP, Mana, Stamina, skill bars, cooldowns) | MythicHUD |
| Shops, quest list, menus, any other custom UI | UltimateUI |
| Dialogue | LuxDialogues (+ quest engine TBD) |
| Translations (Thai/English) | Triton |
| Cosmetics / store | CosmeticsCore, ItemSkins (needs PacketEvents) |
| Side content (after slice) | BattlePass, LuxCollect |
| Parked until designed | Guilds, Order (buy orders) |
| Security | BotSentry |
| Math/placeholders | PlaceholderAPI |
| Libraries | ProtocolLib, PacketEvents, Vault |
| Profiling | spark |
| Discord bridge | DiscordSRV (later) |
| Custom logic (all of it, for now) | Skript + SkBee, skript-reflect, skript-placeholders: prototypes, tutorial/quest glue, admin tools, and the custom mechanics below until the review |
| Instances | **MythicDungeons: NOT owned** (team to discuss) |
| Our own code | **Deferred (D-25).** Candidates for a later Kotlin plugin (`wcmmo-core`): combat states, bar swap, Bloodlines, AP/DP soft cap, enhancement ladder, totems, loot. Decided per system after Phase 0. **Lifezone: already agreed to be our own plugin** (D-19), after the combat/MMO core |

Watch-outs: LuxCollect and CosmeticsCore store pages don't confirm 26.2 yet; ItemSkins must not strip MMOItems data; every plugin's resource-pack assets merge into Nexo.

---

## 8. Decisions

**DECIDED (58 of 71):**

| Area | Decided |
|---|---|
| Project & plugins | D-00 paid plugins owned (not MythicDungeons) · D-09 MMOInventory · D-14 MythicDungeons (not bought) · D-25 Skript + vendor plugins first, own Kotlin plugin per system after Phase 0 · D-39 MythicHUD = HUD, UltimateUI = other UI · D-40 MMOItems = gear, Nexo = furniture/blocks/pack · D-41 CosmeticsCore wearables, ItemSkins weapon skins · D-42 BattlePass/LuxCollect after the slice · D-43 profiles later · D-47 Skript vs Kotlin |
| Vitality | D-01 stamina on a MythicHUD bar, hunger hidden · D-02 food = heal over time + buffs, potions = instant · D-03a sprint drains a little stamina |
| Stats | D-07 cap 60, 2 points/level · D-07b paid respec item (NPC shop or quest) · D-08 stats gate gear · D-08b soft level floor · D-30 small utility bonuses only |
| Combat | D-49 I-frame deferred (dash = movement) · D-03 F bar swap (revised) · D-50 AGI basic attack speed, cap 30 % · D-51 Remnant gauge + Q ultimates · D-52 10 general + 5 skills & 1 ultimate per weapon · D-53 instant bow · D-54 item detail pages · D-06b Frontguard chip 20 % + stamina drain · D-06c arenas now; later open-world PvP outside safe zones for Lv 25+ · D-06d every weapon 1 guard-break skill; Hammer/Greatsword break guard + Super Armour, ×2 guard drain |
| Weapons | D-04 8 weapons, slice uses 4 · D-04b free switching · D-04c basic skills in tutorial, more from level-ups + city NPCs · D-36b Mastery CDR for that weapon's skills + general skills by held weapon |
| Bloodlines & Runes | D-31/D-48 base Bloodlines Fury / Ward / Pulse, value trials · D-32 The Awakening picks the first Bloodline · D-33 in-game extractor keeps progress, store extractor resets · D-34 each stage = level + unlock materials · D-35 rune slots 2 → Lv30 → Lv50 · D-35b no duplicate runes, tiers I–III · D-46 Awakening scoring edge cases |
| Gear | D-10 Identify + fallback · D-11 MythicLib elements for now · D-12 max V, pity, never destroyed · D-12b armour same ladder · D-12c one stone per category · D-12d accessories I–V · D-13/D-13b AP/DP soft cap from gear + enhancement |
| World | D-15b 1 chapter in Phase 1 · D-16 totem item, 10 min · D-16b totems via MythicMobs spawners · D-17 world boss loot: hit or nearby → random roll, MVP top 1–3 more · D-17b 2×/day + admin summon · D-18 party dungeons 2–5, solo dungeons solo · D-19 Lifezone own plugin, after the core · D-22 5 lifeskills · D-23 furniture shop or craft · D-26 PvE only for now |

**PARTLY / TESTING:** D-27 (Triton; languages open) · D-36 (test build: Mastery cap 30, unlocks 5/15/25; final cap 50 or 100 open) · D-05 (FPV: testing the Draconic pack).

**OPEN (ideas welcome):**

| Area | Decisions |
|---|---|
| Bloodlines | D-37 implementation (Skript-first now) · D-45 tutorial instance tech |
| Combat / weapons | D-44 FPV weapon trigger layer (Crucible vs MMOItems + script) |
| World | D-15 quest engine to pair with LuxDialogues |
| Lifezone (later) | D-20 plot size · D-20b save timing · D-20c paste timing · D-21 full-zone parties · D-21b visiting |
| Project | D-38 repo layout |

---

## 9. Conventions

| Thing | Pattern | Example |
|---|---|---|
| Item | `wcmmo_item_<name>` | `wcmmo_item_identify_scroll` |
| Mob / boss | `wcmmo_mob_<name>` | `wcmmo_mob_boss_world_01` |
| Skill | `wcmmo_skill_<name>` | `wcmmo_skill_ground_smash` |
| Bloodline / Rune | `wcmmo_bloodline_<name>` / `wcmmo_rune_<name>` | `wcmmo_bloodline_fury`, `wcmmo_rune_haste` |
| Weapon / item type (MMOItems) | `WCMMO_<TYPE>` | `WCMMO_HAMMER`, `WCMMO_RING`, `WCMMO_RUNE` |
| Mastery profession | `mastery_<weapon>` | `mastery_hammer` |
| Furniture / block (Nexo) | `wcmmo_furn_<name>` / `wcmmo_block_<name>` | `wcmmo_furn_starter_bed` |
| NPC | `wcmmo_npc_<name>` | `wcmmo_npc_enhancer` |
| Permission (ours) | `wcmmo.<area>.<action>` | `wcmmo.lifezone.use` |
| WorldGuard region | `<world>__<area>` | `wcmmo__zone_low_01` |
| DB table | `wcmmo_v1_<area>_<name>` | `wcmmo_v1_bloodline_progress` |
| Quest package | `wcmmo/ch<NN>/<quest>` | `wcmmo/ch01/q01_arrival` |
| Permission groups | `default`, `vip`, `builder`, `helper`, `mod`, `admin` | |
| Player text | MiniMessage (`<gold>`), translated with Triton | |
| FIRE mode | `autopilot` (tiny), `confirm` (normal), `validate` (balance, perms, player data, perf) | |

---

## 10. Open questions for the team

| # | Question |
|---|---|
| TM1 | Confirm 3 repos (wcmmo, wcmmo-specs, and later wcmmo-plugins if the D-25 review needs it) |
| TM2 | Who does map, resources, models |
| TM3 | Is 2–3 weeks realistic? What to cut? |
| TM4 | VPS provider, CPU/cores, budget |
| TM5 | Buy MythicDungeons or build instances ourselves |
| TM6 | Quest engine to pair with LuxDialogues (after plugin setup, with the first trailer in mind) |
| M1–M4 | extractor prices + stage materials · weapon list + 3 unique skills each · rune list |
| M5–M6 | World map (cities, regions, zones) · Chapter 1 story |
| M7–M12 | Death penalty · level cap/speed · party system · HUD layout · VIP/store rules · Triton languages |
| T2–T8 | Tech: bar-swap fallback · Bloodline hook design · Mastery math · Identify test owner · Nexo furniture in schematics · FPV weapons long-term (Crucible vs MMOItems + plugin) |

---

## 11. Glossary

| Term | Meaning |
|---|---|
| AP / DP | Attack Power / Defense Power, from gear + enhancement; compared against a zone's recommended values |
| Soft cap | Damage scales down below a zone's AP, and extra AP above it counts half |
| Frontguard | Blocking hits from the front while guarding |
| I-frame | Short invincibility (dodges, some skills) |
| Super Armour | Can't be staggered/CC'd, still takes damage |
| Bloodline | The one core identity of a character, evolving in 5 stages |
| Rune | Small swappable passive bonus, 2–4 slots |
| Mastery | Per-weapon skill level: unlocks and cooldown reduction |
| Identify | Unidentified gear rolls random stats when identified |
| Lifezone | 20-player housing/lifeskill world instance |
| Totem | Stationary farming: activate it, waves of mobs come to you for a set time |
| FPV / TPV | First-person view / third-person view models |
| GDD | Game Design Document (`gdd/wcmmo-gdd-v2.md`) |
| Spec | Implementation contract `docs/NNN-*.md` |
| FIRE | specsmd flow used to build and log work in each repo |
| PoC | Proof-of-concept test before building content |
| MSPT / TPS | Milliseconds per server tick (≤ 40 target) / ticks per second (20 = perfect) |
| Vertical slice | Small but complete playable part of the game, used to prove the whole loop |
