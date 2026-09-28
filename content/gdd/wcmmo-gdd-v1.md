# WC-MMO — Game Design Document v1

> **SUPERSEDED by [v2](wcmmo-gdd-v2.md) on 2026-09-28** (classes → classless Bloodlines/Runes/Mastery). Kept for history; do not cite in new specs.

> Version: 1.0-draft · Date: 2026-09-25 · Server: Purpur 26.2 · Owner: dev team
>
> This is the **design** (what the game should feel like and why). It is meant to be re-read and redesigned.
> The **contracts** that code/content are built from live in `../docs/NNN-*.md` and cite this file by section and decision ID.
> When a decision below changes, update this file first, then the specs that cite it.

## How to use this document

- Sections 1–10 are the Phase 1–3 design. Sections 11–13 are placeholders ("coming soon").
- Every open choice is a **decision** `D-xx` in a table: options, my recommendation, and a **Your call** column.
  Fill in "Your call", change Status to `DECIDED`, and I will update the affected specs.
- ⚠️ marks a **technical risk** that must be proven in a Proof of Concept (PoC) before content is built on top of it.
- Numbers marked *proposed* are starting points for tuning, not final balance.

## 0. Vision

| | |
|---|---|
| Genre | Action MMORPG on Minecraft, inspired by **MU Online** (classes, stat-gated gear, enhancement), **Black Desert Online** (combat mechanics, AP/DP zones, story by region, stationary farming, lifeskills) and **Wynncraft** (stat allocation, identified gear) |
| Pillars | 1. Skill-based combat (Frontguard / I-frame / Super Armour) · 2. Gear chase (stats, identify, enhancement) · 3. Solo-friendly story, social endgame · 4. Cozy Lifezone housing as a second loop |
| Target | ~200 concurrent players on one production server (see spec 001) |
| Not in v1 | Awakening/advancement classes, player trading economy design, guilds & node war, pets & mounts (sections 11–13) |

### Core loops

```txt
Combat loop:   quest/story → zone farming (AP/DP gated) → drops (identify) → enhance → next zone / dungeon / world boss
Lifeskill loop: Lifezone gathering (low-mid) → craft/cook/alchemy → consumables (buffs) → combat loop
                MMO-world rare resources (high) ─┘            └→ furniture (Nexo) → housing
```

### Plugin stack for the game (proposed)

| Need | Plugin | Status |
|---|---|---|
| Classes, attributes, resources (mana/stamina), professions, skill trees | MMOCore | planned (bought?) — D-00 |
| Items, stats, elements, upgrades, identify | MMOItems + MythicLib | planned |
| Mobs, bosses, skills, spawners | MythicMobs | planned |
| Mob models | ModelEngine | planned |
| Custom items/blocks/furniture, resource pack | Nexo | planned |
| Accessory slots | MMOInventory | **new** — D-09 |
| Instances (story bosses, dungeons) | MythicDungeons | **new** — D-14 |
| Quests & dialogue | BetonQuest | **new** — D-15 |
| Permissions | LuckPerms | planned |
| Custom combat rules (Frontguard, I-frame, Super Armour, AP/DP, bar swap, Lifezone) | **`wcmmo-plugins` (Kotlin)** | **new repo** — D-25 |
| Multi-server Lifezones | Velocity proxy | **maybe** — D-19 |

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-00 | Are Nexo, MythicMobs, ModelEngine, MMOCore, MMOItems bought and final? | yes / partly | Confirm before Phase 0; everything below assumes yes | | OPEN |
| D-25 | Build custom mechanics in our own Kotlin plugin? | Skript / Kotlin plugin / only configs | **Kotlin plugin** (`wcmmo-plugins`). Frontguard, I-frame, Super Armour and AP/DP soft cap are not native to any plugin above; Skript is too slow/fragile for combat at 200 players | | OPEN |
| D-27 | Player-facing language | Thai / English / both | Both, with English IDs and Thai+English display text; decide before item/quest content | | OPEN |

---

## 1. Core vitality & survival

**Design**
- **HP** and **Mana** are the standard combat resources.
- **Stamina** replaces the vanilla hunger bar. It limits physical actions (dash, sprint-dash chains) and is the cost of certain physical skills.
- **Food** is not needed to survive. Food items act like potions: healing and buffs.

| Resource | Used by | Regen | Proposed base |
|---|---|---|---|
| HP | everyone | out-of-combat regen + consumables | *proposed* 100 + DEF/level scaling |
| Mana | Wizard mainly, some Archer skills | constant regen, INT boosts | *proposed* 100, 2/s |
| Stamina | dash, physical skills (Warrior/Archer) | fast regen when not spending | *proposed* 100, 10/s after 1 s idle |

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-01 | How is Stamina shown? | vanilla food bar re-used / action bar / boss bar | Food bar re-used as the stamina gauge (hunger frozen) if MMOCore supports it cleanly; otherwise action bar. ⚠️ verify in PoC | | OPEN |
| D-02 | How does food heal? | instant / heal over time | Heal-over-time + **cooldown groups** (e.g. all "meals" share one cooldown) so food supports, not replaces, skill | | OPEN |
| D-03a | Does sprinting cost stamina? | yes / no | No — only dash & skills, keeps travel painless | | OPEN |

---

## 2. Classes & skills

**Design**
- Phase 1: **Warrior, Wizard, Archer** (MU Online style). No awakening/advancement yet.
- Each class has **20 skills**; a player equips **10**.
- The 10 equipped skills sit in **two bars of 5**. A key combo swaps bar 1 ↔ bar 2 for combos while managing cooldowns.
- **Weapon rule:** base skills work with any weapon the class can use. **Exclusive skills** need a specific weapon type (e.g. Warrior *Ground Smash* only with an Axe).

### Weapon types (from the suggestion — pending D-04)

| Class | Weapon | Identity |
|---|---|---|
| Warrior | Greatsword | slow, AOE, grants Super Armour on heavy swings |
| Warrior | Spear | longest melee reach, Frontguard stance |
| Warrior | Axe | high armour penetration, **breaks Super Armour** |
| Warrior | Sword | balanced, fast animation, short I-frames |
| Wizard | Staff | long cast, high Mana, massive AOE |
| Wizard | Tome | fast cast, crowd control, buffs/debuffs (support role) |
| Archer | Bow | longest range, heavy charged shots |
| Archer | Crossbow | shorter range, burst fire, mobility with stamina dashes |

### Skill budget per class (proposed split of 20)

| Group | Count | Notes |
|---|---|---|
| Base skills (any class weapon) | 8 | available to every build |
| Exclusive skills | 3 per weapon type (Warrior 4×3=12, Wizard/Archer 2×6=12) | forces a weapon choice |

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-03 | Bar swap input & implementation | Skript `Shift+Right Click` / MMOCore skill-casting mode / Kotlin plugin | ⚠️ `Shift+Right Click` clashes with **drawing a bow/crossbow** and using items. Recommend **`Shift+F`** (swap-hand key; off-hand is unused) handled by the Kotlin plugin, on top of MMOCore's casting mode | | OPEN |
| D-04 | Accept the weapon list above? | accept / edit | Accept for design; build **1 weapon per class** first in the vertical slice (Sword, Staff, Bow) | | OPEN |
| D-04b | Can players switch weapon type freely? | free / respec cost | Free — exclusives just stop working; encourages experimenting | | OPEN |
| D-04c | How do skills unlock? | level / skill tree / quest | Level unlocks + skill points (MMOCore skill tree) | | OPEN |

---

## 3. Combat mechanics

**Design**
- **Frontguard** — frontal block while a stance/skill is active.
- **I-frame** — short invincibility during dodges/certain skills.
- **Super Armour** — immune to CC/stagger (still takes damage).
- **Souls-like first-person (FPV) animations** using custom models + ModelEngine.
- **AGI** speeds up cooldowns / cast time, **not** animation speed (suggestion accepted pending D-06).

### Interaction matrix

| Attacker ↓ / Defender state → | Normal | Frontguard (hit from front) | Super Armour | I-frame |
|---|---|---|---|---|
| Normal hit | damage | blocked (0 or chip) | damage, no CC | miss |
| CC skill (knockdown, stun) | damage + CC | blocked | damage, **no CC** | miss |
| Armour-break (Axe) | damage | damage (guard broken) | damage **+ CC** (SA broken) | miss |
| Grab (future) | CC | CC (bypasses guard) | no CC | miss |

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-05 | FPV animation approach | ModelEngine on player / resource-pack animated item models / display entities | ⚠️ **Highest-risk item.** ModelEngine animates *entities* seen in third person; true first-person animation on a vanilla client is limited. PoC all three; fall back to animated item models + particles + sounds | | OPEN |
| D-06 | AGI effect | animation speed / cooldown & cast speed | Cooldown reduction + cast speed (MythicLib cooldown stat) | | OPEN |
| D-06b | Frontguard on hit | 0 damage / chip damage / stamina drain | Chip damage 20 % + stamina drain; guard breaks at 0 stamina | | OPEN |
| D-06c | PvP in v1? | none / arenas / open world | Arenas only in v1; open-world PvP after guild design (§12) | | OPEN |

---

## 4. Stats & equipment

**Design**
- Wynncraft-style stat allocation: **STR, DEX, INT, DEF, AGI**.
- High-tier gear is gated by **stat requirements** (MU style), not only level.
- **Armour:** Helmet, Chestplate, Leggings, Boots.
- **Accessories (BDO):** 1 Necklace, 1 Earring, 1 Ring, 1 Belt.
- **Item options:** "Identify" random rolls (Wynncraft). Fallback: fixed options from crafting / NPC quests (BDO).
- **Elements** on weapons and armour.

### Stat effects (proposed)

| Stat | Main class | Effect |
|---|---|---|
| STR | Warrior | physical damage, carry weight (future) |
| DEX | Archer | projectile damage, crit chance |
| INT | Wizard | magic damage, max Mana, Mana regen |
| DEF | all | max HP, damage reduction, Frontguard strength |
| AGI | all | cooldown reduction, cast speed, max Stamina |

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-07 | Stat points per level & max level | e.g. 2/level, cap 100 | *proposed* level cap 60 for Phase 1, 2 points/level (118 points) | | OPEN |
| D-07b | Respec | free / item / NPC gold cost | Paid respec item (sink for economy §11) | | OPEN |
| D-08 | Gating rule | stats only / stats + level floor | Stats + **level floor** (prevents low-level twinks with borrowed gear) | | OPEN |
| D-09 | Accessory slots plugin | MMOInventory / custom GUI | MMOInventory (integrates with MMOItems) | | OPEN |
| D-10 | Identify system | MMOItems unidentified + RNG generation / fixed crafted items | ⚠️ PoC MMOItems unidentified items + item generator; fallback to BDO-style fixed items | | OPEN |
| D-11 | Elements list | MythicLib built-in / custom | Use MythicLib built-in elements (fire, ice, wind, earth, thunder, water — verify list in PoC) | | OPEN |

---

## 5. Enhancement & zone progression

**Design**
- **Weapons (and armour?):** +1 … +15, then Roman **I … V** (maybe to X).
- **Accessories:** start directly at **I … V** (maybe X).
- **Farming zones** gated by **AP** (attack power) and **DP** (defense power), BDO-style, with a **soft cap**.

### Enhancement ladder (proposed)

| Stage | Success | On fail |
|---|---|---|
| +1 … +7 | 100 % | — |
| +8 … +15 | 90 % → 25 % | stay, gain pity stack |
| I … V | 40 % → 5 % | drop 1 stage (not below I), gain pity stack |
| Accessory I … V | 60 % → 5 % | lose a copy (BDO style) **or** drop 1 stage — D-12 |

### AP/DP soft cap (suggestion — pending D-13)

| Player AP vs zone recommended AP | Damage dealt |
|---|---|
| < 70 % | 10–20 % (inefficient) |
| 70–100 % | scales up to 100 % |
| 100 % → overcap | 100 %, then **excess AP counts half** |

DP works the same way on damage taken.

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-12 | Enhancement max & fail rules | V / X; destroy / downgrade / pity | Max **V** in Phase 1, pity stacks, **no item destruction** | | OPEN |
| D-12b | Does armour enhance like weapons? | same / separate ladder | Same ladder as weapons | | OPEN |
| D-12c | Enhancement materials | black-stone-like / zone drops | One generic stone per tier (Weapon/Armour/Accessory), from zone drops | | OPEN |
| D-13 | AP/DP soft cap | hard cap / soft cap | Soft cap as above, implemented in the Kotlin plugin (reads zone from WorldGuard region) | | OPEN |
| D-13b | How AP/DP are computed | sum of gear / gear + stats | Gear + enhancement only (stats already scale damage separately) | | OPEN |

---

## 6. Quests & story

**Design**
- Story in **chapters by region**, moving city to city (BDO).
- **100 % of main story is soloable.**
- Story bosses in **private instances** (no kill stealing), **dialogue choices** for RPG feel.

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-14 | Instance plugin | MythicDungeons / custom worlds | MythicDungeons (story bosses + dungeons §8) | | OPEN |
| D-15 | Quest plugin | BetonQuest / MMOCore quests / other | BetonQuest (conversations, conditions, MMOCore/MythicMobs integrations) | | OPEN |
| D-15b | How many regions/chapters in Phase 1 | 1 / 2 / 3 | 1 region (starter city + 1 zone) for the vertical slice; 3 for Phase 2 | | OPEN |

---

## 7. Farming & monster tiers

**Design**
- Tiers **Low / Mid / High**, each with an AP/DP recommendation.
- **Loop farming:** open-world rotations for mobile classes.
- **Stationary farming:** BDO-style (Dehkia lantern / Gyfin) — player activates a Totem/Lantern and waves come to them for a set time.

| Tier | Recommended AP / DP (*proposed*) | Level band |
|---|---|---|
| Low | 50 / 60 | 1–20 |
| Mid | 120 / 150 | 20–40 |
| High | 200 / 260 | 40–60 |

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-16 | Totem activation | free / item cost / cooldown | Consumable **item cost**, 10 min, one active totem per spot, solo or party | | OPEN |
| D-16b | Totem implementation | MythicMobs spawners + Skript / MythicMobs + Kotlin | MythicMobs wave skills + Kotlin plugin for spot ownership/timer | | OPEN |

---

## 8. Bosses & dungeons

**Design**
- **World Boss:** scheduled, server-wide.
- **Solo dungeons:** instanced, mechanically hard (I-frame / Frontguard mastery).
- **Party dungeons:** instanced, roles Tank / DPS / Support.

Role mapping with 3 classes: **Tank** = Warrior (Spear/Greatsword) · **DPS** = all · **Support** = Wizard (Tome).

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-17 | World boss loot | last hit / contribution | **Damage contribution**: ≥1 % damage → base loot; top 10 → bonus roll | | OPEN |
| D-17b | World boss schedule | fixed times / random window | Fixed times (e.g. 2×/day, Thai peak hours) | | OPEN |
| D-18 | Party size | 3 / 4 / 5 | 4 (1 tank, 1 support, 2 DPS) | | OPEN |

---

## 9. Lifezone & housing (Heartopia style)

**Design**
- Housing + lifeskills live in **Lifezone instances**, separate from the MMO world.
- **Hard cap 20 players = 20 plots** per Lifezone. At 20/20 **nobody** can enter (not even party teleports) → "World Full".
- A house (structure + furniture) is saved as **schematic data in the database**.
- Moving to another Lifezone: find an empty plot, **paste the schematic asynchronously with FAWE**.

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-19 | Lifezone topology | many worlds on the main server / separate servers behind Velocity | ⚠️ Start with **worlds on the main server** (simpler, no proxy); design the data so a Velocity split later is a config change | | OPEN |
| D-20 | Plot size | 24×24 / 32×32 / 48×48 | *proposed* 32×32, height 32 | | OPEN |
| D-20b | When is the house saved | on logout / on leave / every edit | On leaving the Lifezone + every 10 min while inside | | OPEN |
| D-20c | Plot paste when? | on join / when owner enters | Paste on owner's arrival, clear when they leave (plot freed) | | OPEN |
| D-21 | Party entry to a full zone | strict block / offer another zone | Strict block (as designed) **+** "open a new Lifezone for our party" button | | OPEN |
| D-21b | Visiting others' houses | no / friends / public | Visitors only while owner is present in the same Lifezone | | OPEN |
| ⚠️ | Nexo furniture inside schematics | — | Must be proven: Nexo furniture uses entities + data; FAWE must copy entities with their data | | PoC |

---

## 10. Lifeskills, resources & furniture

**Design**
- Professions via **MMOCore**: Mining, Gathering, Fishing, Cooking, Alchemy — each with its own level.
- **Lifezone resources = Low–Mid tier**, 100 % safe.
- **MMO world resources = High tier**, hidden in monster zones (crafters go out or hire escorts).
- **Furniture = Nexo** custom blocks/furniture, sold by city NPCs + lifeskill side quests.

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-22 | Profession list | 5 listed / add Woodcutting, Smithing | Keep 5 for Phase 3; Smithing tied to enhancement later | | OPEN |
| D-23 | Furniture source | NPC shop only / shop + crafting | Shop (basic) + crafting (rare themed sets) | | OPEN |
| D-26 | High-tier resources in PvP? | PvE only / PvP later | PvE only until guild/node war design | | OPEN |

---

## 11. Economy & trade — coming soon

Placeholder. Must decide: currency (CMI / MMOCore / Vault economy), player market (auction house vs player shops), gold sinks (repair, respec, enhancement, furniture), trade restrictions (bound items).

## 12. Guild & node war — coming soon

Placeholder. Must decide: guild plugin vs custom, node ownership, war schedule, PvP rules.

## 13. Pets & mounts — coming soon

Placeholder. Must decide: ModelEngine mounts, pet buffs vs cosmetic, loot pickup pets.

---

## Phase plan

| Phase | Goal | Specs |
|---|---|---|
| **0 — PoC** | Prove the risky tech before building content: FPV animation (D-05), combat states (D-06b), bar swap (D-03), identify (D-10), Lifezone schematic + Nexo furniture (§9) | 010, 007, 009, 012, 018 |
| **1 — Vertical slice** | 1 city, 1 Low zone, 3 classes × 1 weapon × 5 skills, stats, basic gear, 1 story chapter, 1 solo dungeon | 005–012, 014–016 |
| **2 — Core MMO** | All weapons, 20 skills/class, enhancement to V, Mid/High zones, stationary farming, world boss, party dungeon | 013–017 |
| **3 — Lifezone** | Instances, housing migration, professions, furniture | 018–020 |
| **4 — Social** | Economy, guilds & node war, pets & mounts | §11–13 (not specced) |

## Decision log

| Date | ID | Decision | By |
|---|---|---|---|
| | | | |
