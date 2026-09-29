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
6. **Minecraft server context:** Purpur 26.2, Java 25, Paper-API plugins. Target 100–200 concurrent players, performance budget **MSPT ≤ 40**. Prefer config/plugin solutions; custom code goes in the team's own Kotlin plugin.
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
| `wcmmo-plugins` | source of our own Kotlin plugin(s) + starter build per plugin | to create |

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
- **Example: Berserker** (the only one designed so far):

| Stage | Unlock | Name | Effect |
|---|---|---|---|
| 1 | on bind | Adrenaline | +20 % attack speed while HP < 30 % |
| 2 | Lv 20 | Pain is Power | taking damage restores Stamina |
| 3 | Lv 40 | Unstoppable | charge skills gain Super Armour |
| 4 | Lv 60 | Blood Rage | active: sacrifice HP to reset cooldowns |
| 5 | Awakened | Death Defying | a fatal blow leaves 1 HP + 3 s I-frame |

- **Runes (2–4 slots)**: free to swap; small passives; turn the same Bloodline into Tank or DPS. No duplicate rune IDs. Total cooldown reduction from all sources capped at 30 % (proposed).
- Implementation (proposed): our Kotlin plugin owns Bloodline data + triggers; MythicMobs skills are the effects.
- **How the first Bloodline is chosen: The Awakening** (DECIDED, team design). *"You do not choose the Bloodline. The Bloodline chooses you."* The tutorial secretly scores three affinities from what the player does: **BODY** (brawl, break the cracked wall), **MIND** (ranged scroll kills, hidden lever), **FREEDOM** (sneak past sleeping mobs, parkour over the roof), each +2. Clear lead → that Bloodline; close scores → a **Bloodline Encounter** where the tied Bloodlines argue and the player walks to one. Reveal → **Accept** or **Reject once** (then a manual pick of the 3 base Bloodlines). Leaving the tutorial locks it; later changes need the Extraction Item.
- **3 base Bloodlines** = BODY / MIND / FREEDOM. Berserker is proposed as BODY; MIND and FREEDOM are not designed yet.

### 4.3 Weapons, stats, mastery, skills
- **Stats gate gear** (e.g. heavy Greatsword needs high STR). Proposed: level cap 60, 2 points/level.
- **Proposed weapon types (8):** Sword, Greatsword, Hammer, Spear (melee) · Bow, Crossbow (ranged) · Staff, Tome (magic). Vertical slice: Sword, Hammer, Bow, Staff.
- **Weapon Mastery**: one MMOCore profession per weapon; XP from hitting mobs; unique skills unlock at Mastery 10 / 25 / 40; cooldown reduction up to 20 % via PlaceholderAPI math in MythicMobs (proposed).
- **10 active skills** in **two bars of 5**, swapped with **Shift + Right Click** (DECIDED).
- **Weapon-specific casting cap:** a unique weapon skill (e.g. Hammer's *Ground Smash*) fails if you hold a different weapon type.

### 4.4 Combat
- BDO-style states: **Frontguard** (frontal block), **I-frame** (invincible during dodges), **Super Armour** (immune to stagger/CC, still takes damage). Heavy weapons (proposed: Hammer, Greatsword) break guard and Super Armour.
- **Souls-like first-person (FPV) animation** with ModelEngine.
- Status: testing with a bought pack, **Draconic Dual Sword FPV** (MythicMobs skills + MythicCrucible item triggers + ModelEngine first-person model `pv=true`). Known findings: needs Crucible item triggers; damage is fixed (not tied to stats yet); right-click is an attack (may clash with Shift+RMB bar swap); F key/off-hand used by dual swords; third-person model has no attack animations; dual-wield give/take could dupe items; assets must be merged into the Nexo pack.

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
- Chapter- and region-based main story, city to city (BDO). **100 % soloable**; story bosses instanced.
- Dialogue: **LuxDialogues** (Wynncraft-style). The quest engine to pair with it is not chosen yet.
- Proposed chapter 1: tutorial → try Bloodlines → choose Bloodline → first region → instanced boss.

### 4.9 Lifezone & housing (Heartopia style)
- Separate **Lifezone** worlds for housing + lifeskills, **hard cap 20 players = 20 plots**; "World Full" blocks entry.
- A house (blocks + Nexo furniture) is saved as a **schematic** and **pasted asynchronously with FAWE** onto a free plot in whichever Lifezone the player enters.
- DECIDED: runs inside the main server with our own plugin; proxy (Velocity) only later if needed.

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
| 0: PoC | Prove risky tech: FPV animation, combat states, Shift+RMB swap, Bloodline hooks, Mastery cooldown math, Identify, Lifezone save/paste with Nexo furniture, stamina display |
| 1: Vertical slice | Tutorial + 1 region, Berserker stages 1–3, 2 Rune slots, 4 weapons with Mastery to 25, stat gating, 1 solo dungeon |
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
| Profiling | spark |
| Discord bridge | DiscordSRV (later) |
| Instances | **MythicDungeons: NOT owned** (team to discuss) |
| Our own code | `wcmmo-core` (Kotlin): combat states, bar swap, Bloodlines, AP/DP soft cap, enhancement ladder, totems, loot, Lifezone |

Watch-outs: LuxCollect and CosmeticsCore store pages don't confirm 26.2 yet; ItemSkins must not strip MMOItems data; every plugin's resource-pack assets merge into Nexo.

---

## 8. Decisions

**DECIDED:** D-00 (paid plugins owned, except MythicDungeons) · D-03 (Shift+RMB bar swap) · D-04b (free weapon switching) · D-08 (stats gate gear) · D-09 (MMOInventory) · D-10 (Identify + fallback) · D-12b (armour uses weapon ladder) · D-13 (AP/DP soft cap) · D-13b (AP/DP from gear + enhancement) · D-14 (MythicDungeons, but not bought yet) · D-16b (totems via MythicMobs spawners) · D-17 (world boss loot by contribution) · D-19 (Lifezone in-server, own plugin) · D-22 (5 lifeskills) · D-23 (furniture: NPC shop or crafted) · D-25 (Tatoo writes the Kotlin plugin) · D-32 (The Awakening tutorial picks the first Bloodline) · D-39 (MythicHUD = HUD, UltimateUI = shops/quest list/other UI) · D-40 (MMOItems = gear, Nexo = furniture/blocks/pack) · D-43 (multiple profiles later) · D-27 partly (Triton; languages open) · D-05 testing (Draconic FPV pack).

**OPEN (ideas welcome):**

| Area | Decisions |
|---|---|
| Vitality | D-01 stamina display · D-02 food healing · D-03a sprint cost |
| Bloodlines & Runes | D-31 MIND/FREEDOM Bloodlines (BODY = Berserker?) · D-45 tutorial instance tech · D-46 trial scoring edge cases · D-33 extraction item · D-34 stage requirements · D-35 rune slot unlocks · D-35b rune rules · D-37 implementation |
| Weapons & stats | D-04 weapon list · D-04c general skill source · D-07 points/level & cap · D-07b respec · D-08b level floor · D-30 tiny stat bonuses? · D-36 Mastery details · D-36b weapon swap exploit · D-44 FPV weapon trigger layer |
| Combat | D-06b Frontguard chip · D-06c PvP scope · D-06d guard breakers |
| Gear | D-11 elements · D-12 enhancement fail rules · D-12c materials · D-12d accessory enhancement |
| World | D-15 quest engine · D-15b chapters · D-16 totem cost · D-17b world boss times · D-18 party size · D-26 PvP resources |
| Lifezone | D-20 plot size · D-20b save timing · D-20c paste timing · D-21 full-zone parties · D-21b visiting |
| Project | D-27 languages · D-38 repo layout · D-41 cosmetics · D-42 side content |

---

## 9. Conventions

| Thing | Pattern | Example |
|---|---|---|
| Item | `wcmmo_item_<name>` | `wcmmo_item_identify_scroll` |
| Mob / boss | `wcmmo_mob_<name>` | `wcmmo_mob_boss_world_01` |
| Skill | `wcmmo_skill_<name>` | `wcmmo_skill_ground_smash` |
| Bloodline / Rune | `wcmmo_bloodline_<name>` / `wcmmo_rune_<name>` | `wcmmo_bloodline_berserker`, `wcmmo_rune_haste` |
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
| TM1 | Confirm 3 repos (wcmmo, wcmmo-specs, wcmmo-plugins) |
| TM2 | Who does map, resources, models |
| TM3 | Is 2–3 weeks realistic? What to cut? |
| TM4 | VPS provider, CPU/cores, budget |
| TM5 | Buy MythicDungeons or build instances ourselves |
| TM6 | Quest engine to pair with LuxDialogues (after plugin setup, with the first trailer in mind) |
| M1–M4 | MIND + FREEDOM Bloodlines · extractor · weapon list + 3 unique skills each · rune list |
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
