# WC-MMO — Game Design Document v2 (final)

> Version: 2.0 · Date: 2026-09-28 · Server: Purpur 26.2 · Supersedes: [v1](wcmmo-gdd-v1.md)
>
> This is the **design**: what the game should feel like and why. Build from the contracts in `../docs/NNN-*.md`,
> not from this file. Those contracts cite this file by section and decision ID.
> When a decision changes, update this file first, then the specs that cite it.

## What changed from v1

| Area | v1 | v2 |
|---|---|---|
| Character identity | 3 classes (Warrior, Wizard, Archer) | **Classless**: 1 **Bloodline** + 2–4 **Runes** |
| Weapons | locked per class | **Weapon freedom**: any weapon, gated by stats |
| Stats | damage scaling + gear gates | **Gateway only**: stats decide what you can equip |
| Raw power | stats + gear | **Enhancement** is the main source of AP/DP |
| Cooldown/cast speed | AGI | **Weapon Mastery** (MMOCore profession per weapon) |
| Unique weapon skills | per class | unlocked by **Mastery**, only castable with that weapon in hand |
| Bar swap | proposed `Shift+F` | **F** (revised 2026-09-30; was Shift + Right Click) |
| Story instances | proposed | **MythicDungeons** (decided) |
| Furniture | shop | **NPC shop or crafted** (decided) |

## How to use this document

- Sections 1–9 are the game. Sections 10–12 are coming soon.
- Every choice is a decision `D-xx`. Where your v2 text answers one, it is `DECIDED`. The rest stay `OPEN` with my recommendation.
  Fill in **Your call** and I will update the specs that cite it.
- ⚠️ marks a **technical risk** that has to be proven in a proof-of-concept (PoC) first.
- Numbers marked *proposed* are starting points for tuning.

## 0. Vision

| | |
|---|---|
| Genre | Classless action MMORPG on Minecraft. Inspired by **Black Desert Online** (combat states, AP/DP zones, regional story, stationary farming, lifeskills), **MU Online** (stat-gated gear, enhancement), **Wynncraft** (stat allocation, identified gear) and **One Piece Devil Fruits** (Bloodlines) |
| Pillars | 1. Build freedom: Bloodline × Runes × any weapon · 2. Skill-based combat (Frontguard / I-frame / Super Armour) · 3. Compartmentalised progression, no stat bloat · 4. Soloable story, social endgame · 5. Cozy Lifezone housing |
| Target | ~200 concurrent players on one production server (spec 001) |

### Progression compartments (the core rule of v2)

| System | Purpose | Gives | Never gives |
|---|---|---|---|
| Level & stats (STR, AGI, INT, DEX, DEF) | **Gateway** | the right to equip gear | raw damage (see D-30) |
| Enhancement (+1…+15, I…V) | **Raw power** | AP / DP | skills |
| Weapon Mastery | **Combat fluidity** | unique weapon skills, lower cooldowns and cast times | AP / DP |
| Skill slots (10 active) | **Tactical limit** | choice of what to bring | — |
| Bloodline | **Identity** | playstyle mechanics that evolve by stage | flat stat piles |
| Runes | **Fine-tuning** | small passive bonuses (HP, stamina regen, CDR…) | new mechanics |

### Core loops

```txt
Combat:    story/quests → zone farming (AP/DP gated) → drops (identify) → enhance (AP/DP) → next zone / dungeon / world boss
           using a weapon → Mastery → unique skills + faster casting
           levelling → stat points → heavier gear, Bloodline stages
Lifeskill: Lifezone gathering (low–mid) → cooking/alchemy → consumables (buffs) → combat
           open-world rare resources (high) ─┘          └→ crafted furniture (Nexo) → housing
```

### Plugin stack for the game

| Need | Plugin | Status |
|---|---|---|
| Stats/attributes, resources (mana/stamina), professions incl. Weapon Mastery | MMOCore | planned (D-00) |
| Items, stats, elements, upgrades, identify | MMOItems + MythicLib | planned |
| Mobs, bosses, spawners, Bloodline effect scripts | MythicMobs | planned |
| Math from player data in MythicMobs (Mastery CDR) | PlaceholderAPI | **new** |
| Mob models, FPV animation | ModelEngine | planned |
| Custom items/blocks/furniture, resource pack | Nexo | planned |
| Accessory and Rune slots | MMOInventory | proposed (D-09) |
| Instances (story bosses, dungeons) | MythicDungeons | **decided** (D-14) |
| Quest dialogue UI | BetonQuest | proposed (D-15) |
| Permissions | LuckPerms | planned |
| Quick custom logic, prototypes, tutorial/quest glue | Skript + SkBee, skript-reflect, skript-placeholders | owned |
| Combat states, AP/DP soft cap, bar swap, Bloodline ownership/extraction, Lifezone | **Skript + vendor plugins first**; our own `wcmmo-plugins` (Kotlin) only where a system proves it needs it | deferred (D-25, D-47) |

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-00 | Are Nexo, MythicMobs, ModelEngine, MMOCore, MMOItems bought and final? | yes / partly | Confirm before Phase 0 | All owned (+ MythicLib, MMOProfiles, LuckPerms, DiscordSRV). **MythicDungeons not owned**; MMOInventory unconfirmed | DECIDED |
| D-43 | Multiple characters per account (MMOProfiles, owned) | yes / no | Not needed for the vertical slice. If yes later: each profile has its own Bloodline, stats and Mastery; Lifezone house shared or per profile must be decided | Planned, **not at start** | DECIDED (later) |
| D-25 | Build custom mechanics in our own Kotlin plugin? | Skript / Kotlin / configs only | **Kotlin plugin.** Frontguard, I-frame, Super Armour, the AP/DP soft cap, bar swap and Bloodline ownership are not native to any plugin above | **Revised 2026-09-29: not yet.** Finish the bought-plugin setup, build mechanics with vendor plugins + Skript first. After Phase 0, decide per system what moves into our own plugin (`wcmmo-plugins`, written by Tatoo) and what stays vendor/Skript, based on ease of implementation, maintenance and `/spark` results. `wcmmo-plugins` is not created until then | DECIDED |
| D-47 | Skript vs Kotlin: who does what | Skript for everything / Kotlin for everything / split | **Split:** Skript (owned) for prototypes, tutorial/trailer glue, quest glue, admin tools, one-off events. Kotlin for hot paths and player data (combat, AP/DP, Bloodline data, bar swap, Lifezone). Scripts tracked in git, `variables.csv` never. See `docs/plugins.md` §3.8 | Split as proposed: Skript for prototypes/glue/tools, Kotlin for hot paths + player data. **Revised 2026-09-29 (D-25):** until the per-system review, Skript also covers the hot-path and player-data systems; the Kotlin column in `docs/plugins.md` §3.8 is now the list of *candidates* to port | DECIDED |
| D-27 | Player-facing language | Thai / English / both | Both: English IDs, Thai + English display text | **Thai + English** via Triton; language from the client setting, `/lang` to switch; **proper names stay English** (Bloodlines, skills, runes, weapons, places), descriptions / lore / dialogue / UI translated. Spec 030 | DECIDED |
| D-38 | Repo layout | 5 repos (server, plugins, content, world, infra) / 3 repos | Owner prefers **3**: `wcmmo` (real server incl. MMO content configs), `wcmmo-specs`, `wcmmo-plugins` | **3 repos.** All plugin jars and every plugin / content config (MMO, Mythic, Nexo, Skript) live in the private `wcmmo`; no `wcmmo-content`. Phase 0 kit moved into `wcmmo` | DECIDED |
| D-39 | HUD / UI tool | MythicHUD (owned) / UltimateUI (owned) | **MythicHUD** for the always-on HUD (HP, Mana, Stamina, skill bars) via MMOCore + PlaceholderAPI; **UltimateUI** only for special screens. ⚠️ Many plugins ship pack assets: pick **one pack owner** that merges the rest (T7) | MythicHUD = always-on HUD (HP, Mana, Stamina, skill bars, cooldowns). **UltimateUI = every other custom UI**: shops, quest list, menus and screens MythicHUD can't do | DECIDED |
| D-40 | Items / furniture / pack owner | MMOItems + Nexo / MMOItems + MythicCrucible (owned) | MMOItems for all RPG gear; **one** of Nexo or Crucible for furniture, blocks and the merged resource pack | **Nexo** owns furniture, custom blocks and the merged resource pack. MMOItems owns all gear. Crucible optional (Mythic-skill utility items only, if ever needed) | DECIDED |
| D-41 | Cosmetics | CosmeticsCore / ItemSkins (both owned) | CosmeticsCore for wearables, ItemSkins for weapon skins if it keeps MMOItems data | CosmeticsCore = wearables; ItemSkins = weapon skins (test it keeps MMOItems data) | DECIDED |
| D-42 | Side content | BattlePass / LuxCollect (both owned) | Add after the vertical slice; BattlePass never carries the main story | After the vertical slice | DECIDED |

---

## 1. Core vitality & survival

- **Primary resources:** Health Points (HP) and Mana, for standard combat and spellcasting.
- **Stamina system:** replaces the vanilla hunger bar. It limits physical actions like continuous dashing and is the casting cost of certain physical skills.
- **Food & consumables:** food is not used for survival (no hunger management). It acts like potions: healing and status buffs.

| Resource | Used by | Regen | Proposed base |
|---|---|---|---|
| HP | everyone | out-of-combat regen + consumables | *proposed* 100 + level/DEF gear |
| Mana | spellcasting skills | constant regen | *proposed* 100, 2/s |
| Stamina | dash, physical skills | fast regen when not spending | *proposed* 100, 10/s after 1 s idle |

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-01 | How is Stamina shown? | food bar re-used / action bar / boss bar | Food bar re-used as the gauge (hunger frozen) if MMOCore supports it; otherwise action bar. ⚠️ PoC | Stamina shown as a **MythicHUD** bar next to HP/Mana; vanilla hunger locked full and hidden | DECIDED |
| D-02 | How does food heal? | instant / over time | Heal-over-time + cooldown groups (all meals share one cooldown) | **Both:** food = heal over time + buffs; potions = instant heal. Separate cooldown groups for food and potions | DECIDED |
| D-03a | Does sprinting cost stamina? | yes / no | No: only dash & skills | **Yes, a little:** sprinting drains a small amount of stamina; dash and some skills cost more | DECIDED |

---

## 2. Classless system, Bloodlines & Runes

The rigid class system is removed. Players build their character freely and mix weapons. Their **Bloodline** and **Runes** shape the build.

### Main Bloodline (1 slot)

- The core identity/playstyle of the character, conceptually like a Devil Fruit.
- **Hard-bound:** cannot be swapped freely. Removing or changing it needs a special **extraction item**.
- **Bloodline evolution (stages):** Bloodlines grow with the player and change *mechanics*, not just raw stats. Handled with MythicMobs conditional triggers.

**The three base Bloodlines (D-31, D-48 decided 2026-09-30).** Full design, paths, numbers and build guide: [bloodlines.md](bloodlines.md).

| Bloodline | Body part | Core axis | Solo strength | Party bonus |
|---|---|---|---|---|
| **Fury** | Muscle | risk: lower HP = stronger | fastest clears | damage |
| **Ward** | Bone | timing: guard, store, release | best survival | tank |
| **Pulse** | Heart | flow: chain different skills for heal + damage pulses | most consistent in long fights | support |

- Stage 1 and stage 4 (active) are fixed; **stages 2, 3 and 5 offer path A or B** → 8 builds per Bloodline (PoE2-style). Respec paths at the Bloodline Keeper.
- **Solo first:** every Bloodline can recover, deal damage and survive alone; ally effects are bonuses only.
- **More Bloodlines arrive with the story** (no fixed count). The base three are generalists; new ones are specialists with a new core axis and the same power budget (bloodlines.md §7).
- Fury keeps the original Berserker stages (Adrenaline, Pain is Power, Unstoppable, Blood Rage, Death Defying) as its A-path spine.

### Passive Runes (2–4 slots)

- Freely equipped and swapped.
- Fine-tune builds (e.g. +Max HP, +Stamina regen, cooldown reduction), so two players with the same Bloodline can play different roles (Tank vs DPS).

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-31 | Bloodlines at launch | 1 / 3 / 5 | **4**, one per play pattern: Berserker (melee risk/reward), plus e.g. a guardian (tank), an arcane (caster) and a hunter (ranged/mobility). Names/themes are yours | **3 base Bloodlines: Fury (Muscle), Ward (Bone), Pulse (Heart)**, full design in [bloodlines.md](bloodlines.md). More Bloodlines come with the story, balanced as specialists | DECIDED |
| D-32 | How a new player gets their first Bloodline | choose at start / tutorial quest / random drop | Choose 1 of the launch Bloodlines at the end of the tutorial chapter (after trying each briefly) | **The Awakening / Bloodline Trial** (team design): hidden pulse / ward / fury affinity tracked in the tutorial picks the Bloodline; tie → Encounter; one-time Reject → manual pick of the 3 base Bloodlines. See [awakening-tutorial.md](awakening-tutorial.md) | DECIDED |
| D-33 | Extraction item | source, cost, what happens to stage progress | Rare item (boss drop or high-cost NPC trade). **Stage progress is kept per Bloodline**, so switching back does not reset it | **Two extractor variants:** in-game (boss drop or very expensive NPC purchase) **keeps** stage progress; store/cash version **resets** to stage 1. Early game: in-game version first | DECIDED |
| D-34 | Stage requirements | level only / level + quest | Stages 2–4 = player level (20/40/60). Stage 5 Awakened = level 60 + an awakening quest/solo dungeon | Every stage needs the **level** (20/40/60, Awakened) **and** unlock materials, from dungeons or lifeskills | DECIDED |
| D-35 | Rune slots 2 → 4 | level / quest / enhancement | 2 at start, 3rd at Lv. 30, 4th from a mid-game quest | By level only: 2 slots at start, 3rd at Lv 30, 4th at Lv 50 | DECIDED |
| D-35b | Rune rules | duplicates, rarity, source | No duplicate rune IDs equipped. Tiers I–III, dropped + crafted (Alchemy). Swap freely out of combat | No duplicate rune IDs; tiers I–III; drop + Alchemy craft; swap out of combat | DECIDED |
| D-37 | Bloodline implementation | MythicMobs triggers only / Kotlin + MythicMobs | ⚠️ Kotlin owns binding, stage and extraction (player data). MythicMobs skills are the *effects*, triggered by our plugin's events (on-damaged, low-HP, fatal-blow). PoC with Fury, Ward and Pulse stage 1 + one path each (Skript-first now, D-25) | | OPEN |
| D-45 | Tutorial instance tech | MythicDungeons (not owned) / own instance module in wcmmo-core | Own small per-player instance module (reused by Lifezone code), unless the team buys MythicDungeons (TM5) | | OPEN |
| D-46 | Trial scoring edge cases | — | Gap ≥ 4 = clear winner, ≤ 2 = Encounter (all steps are +2); 3-way tie or 0/0/0 → 3 entities; puzzle counts only the first solution, each combat trigger once. See review notes R1–R3 | As review notes R1–R3: gap ≥ 4 = clear winner, ≤ 2 = Encounter; 3-way tie or 0/0/0 → 3 spirits; gate counts first solution only; each combat trigger once | DECIDED |
| D-48 | Bloodline names & trial themes | Concept art: **Heart / Bone / Muscle** + value trials (compassion / endurance / determination) · Spec 024: hidden BODY / MIND / FREEDOM from playstyle triggers | Keep one system: e.g. art names + playstyle triggers inside. See lore bible L10 | **Value trials** from the art (compassion / endurance / determination) → **Pulse / Ward / Fury**; Heart / Bone / Muscle stay as the lore body parts; display names are one easy English word | DECIDED |

---

### The Awakening (tutorial & first Bloodline)

Full team design + review notes: [awakening-tutorial.md](awakening-tutorial.md) · contract: spec 024.

- *"You do not choose the Bloodline. The Bloodline chooses you."* No class dropdown.
- The tutorial secretly scores 3 affinities from what the player does: **Pulse** (save the wounded, free the trapped villager), **Ward** (hold the ring, walk the fear path), **Fury** (kill the brute, break the wall). Each trigger = +2.
- Clear lead → that Bloodline is chosen. Close scores → **Bloodline Encounter**: the tied Bloodlines appear, argue, the player walks to one.
- **Reveal → Accept / Reject.** Reject is allowed **once** and opens a manual pick of the 3 base Bloodlines.
- Leaving the tutorial locks it in; later changes need the Extraction Item (D-33).

## 3. Weapon freedom & compartmentalised progression

To prevent stat bloat, progression is strictly split. Each system has one job:

1. **Levelling & stats (STR, AGI, INT, DEX, DEF) = the gateway.** Stats decide what gear a player can equip. A player cannot equip a heavy Greatsword without meeting its strict STR requirement.
2. **Equipment enhancement = raw power.** Weapon and armour enhancement (+1 to +15, then I–V) is the main source of damage (AP) and defence (DP).
3. **Weapon Expertise (Mastery) = combat fluidity.** Using a weapon raises its Mastery (MMOCore professions). High Mastery unlocks unique weapon skills and, through PlaceholderAPI math in MythicMobs, lowers skill cooldowns or cast times.
4. **Skill slots & casting logic = tactical limit.**
   - Players equip only **10 active skills**, split into two 5-slot bars swapped with **F** (D-03 revised). The weapon's **ultimate** is on **Q** and uses the Remnant gauge (D-51).
   - **Weapon-specific casting cap:** a slotted unique weapon skill (e.g. Hammer's *Ground Smash*) fails to cast if the player is holding a different weapon type (e.g. a Sword).

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-03 | Bar swap input | `Shift+RMB` / `Shift+F` | **`Shift + Right Click`** (your call). ⚠️ PoC must prove it doesn't clash with bows, food, blocks **or FPV weapons whose right click is an attack** (Draconic pack). `Shift+F` fallback is blocked for dual weapons (they use F/off-hand); a third fallback is needed (e.g. sneak + hotbar scroll) | **Revised 2026-09-30: F** swaps the bars (bows now use right click to shoot, D-53). Was Shift + Right Click | DECIDED |
| D-04 | Weapon type list | — | *proposed* 8: Sword, Greatsword, Hammer, Spear (melee) · Bow, Crossbow (ranged) · Staff, Tome (magic). Vertical slice: Sword, Hammer, Bow, Staff | 8 weapon types; vertical slice uses Sword, Hammer, Bow, Staff | DECIDED |
| D-04b | Switching weapons | free / restricted | Free: weapon freedom. Only stat requirements gate | free | DECIDED |
| D-04c | Where general (non-weapon) skills come from | skill tree / Bloodline / trainers | General skills (dash, block, etc.) from level-based trainer NPCs. Unique weapon skills from Mastery (D-36) | Basic skills (dash, guard, backstep) learned in the tutorial; more general skills from level-ups and city NPCs along the main quest | DECIDED |
| D-08 | Gear gating | stats only / stats + level floor | Stats are the gate (your call). Level floor stays OPEN as D-08b | stats | DECIDED |
| D-08b | Also require a minimum level? | yes / no | Yes, a soft floor (e.g. tier level) against twinking with borrowed stats gear | Yes, a soft level floor per gear tier | DECIDED |
| D-07 | Stat points per level & level cap | — | Level cap ≥ 60 (Bloodline stage 4 is Lv. 60). *proposed* cap 60 in Phase 1, 2 points/level | Level cap 60, 2 points per level | DECIDED |
| D-07b | Respec | free / item / gold | Paid respec item (economy sink) | Paid respec item (gold sink). Sources: NPC shop or quest reward | DECIDED |
| D-30 | Do stats give any combat bonus besides gating? | none / small utility | **Small utility only** (e.g. DEF → max HP, AGI → max Stamina, INT → max Mana). No damage from stats, so AP stays the only damage source | Small utility only (DEF→HP, INT→Mana, AGI→Stamina) **+ revised 2026-09-30 (D-50): AGI also raises basic attack speed**, capped. Never damage per hit, never skill cooldowns | DECIDED |
| D-36 | Mastery details | XP source, cap, unlocks, CDR | XP from hits on mobs (not players). Cap 50 per weapon. Unique skills at 10/25/40. CDR = Mastery × 0.4 %, **cap 20 %** | **Test values:** cap 30, unique skills at 5 / 15 / 25. XP from mobs only; CDR cap 20 %. **Final cap (50 or 100) to discuss later** | PARTLY |
| D-50 | AGI and basic attack speed | none / uncapped / capped | +0.5 % basic attack / shot speed per AGI point, **cap +30 %**; skill cooldowns stay Mastery-only | as recommended | DECIDED |
| D-51 | Ultimate system | none / cooldown ultimates / gauge ultimates | **Remnant** gauge 0–100 (basic hit +1, skill hit +3, +1 per 2 % HP lost, no decay); at 100 press **Q** for the held weapon's ultimate (Super Armour while casting). Lore: the past self's soul fragments leaking out. Spec 025 | as recommended | DECIDED |
| D-52 | Skill counts | 3 per weapon / 5 + ultimate | **10 general skills** (any weapon) + **5 skills + 1 ultimate per weapon**, unlocked by Mastery 0/5/10/15/20, ultimate 25 (test build). Spec 008 | as recommended | DECIDED |
| D-53 | Bow / Crossbow input | charged / instant | **Right click shoots instantly**, no charging (Wynncraft-style); shot interval lowered by AGI to a cap. **Revised 2026-10-01:** basic shots are a natural arrow (velocity 0.8 blocks / tick + gravity, no range limit, no aim assist) that disappears on hit / landing | as recommended + owner's tuning | DECIDED |
| D-54 | Long item tooltips | one long list / pages | **Pages:** hover an item in the inventory and press F for the next page (stats / upgrades / lore). Skript PoC first, packet-level in our own plugin later. Spec 026 | as recommended | DECIDED |
| D-55 | Extra skills beyond the weapon kits | none / MU-style orb skills | **Orb skills** (MU-inspired, own names and numbers): learned from **Skill Orbs bought from an NPC or dropped by monsters**; **family** orb skills (melee / ranged / magic) plus weapon-only orb skills (e.g. Sword *Whirl Cut*); each weapon keeps its own 5 skills + ultimate. Ward's Bone Bastion gains *Unbroken Vow* (max HP, party bonus). Spec 008 | as recommended | DECIDED |
| D-56 | Rune list | — | **17 runes** in 4 groups: defence (Vitality, Stoneskin, Steadfast, Warding), offence (Edge, Arcana, Fletch, Precision, Ruin, Haste, Tempo, Slayer), sustain (Leech, Breath, Clarity), utility (Echo, Swiftness); tiers I–III; shared caps: CDR 30 % (with Mastery), basic speed 30 % (with AGI), crit 60 %. Slice uses 8. Spec 022 | as recommended | DECIDED |
| D-57 | Death penalty & respawn | — | XP −1 % of the level requirement (none below Lv 15), no item drop, durability −5 %, Remnant halved, buffs cleared; **no vanilla death screen**: countdown then automatic respawn at the nearest Waystone / city; revive on the spot for 100 Remnant; party revive in dungeons. Spec 027 | as recommended + auto-respawn | DECIDED |
| D-58 | Levelling speed | — | Cap 60 in ~90–100 h; slice 1 → 15 in 3–4 h; curve `50·L² + 100·L`; XP 60 % mobs / 30 % quests / 10 % dungeons; low-level mobs 50 % / 10 %. Spec 028 | as recommended | DECIDED |
| D-59 | Party XP & loot | — | Party XP per member = base × (1 + 0.1·(n−1)) / n within 30 blocks and 10 levels, +5 % per extra distinct Bloodline; world drops owned by the top damager 30 s, then free 90 s, then despawn (round-robin inside the owner's party); dungeon bosses give personal rewards. Spec 028 | as recommended + top-damager ownership | DECIDED |
| D-60 | Skill casting keys | click combos / scroll / number keys | **Keys 1–5 cast the active bar's skills while holding a weapon**; 6–9 select items | **Revised 2026-10-02 (owner):** keys 1–9 are a plain hotbar; skills are cast with **3-click combos** (like MMOCore key combos, done by the kit), F switches set 1 ↔ 2. Skills belong to the player: any owned skill in any of the 10 slots + 1 ultimate slot (player's choice, owned at the Mastery cap); the weapon only decides whether a skill can be used. Weapon swap cooldown 5 s. Loadout screen `/skills`. Spec 007 | DECIDED |
| D-61 | HUD layout | — | Bottom-centre block (wooden style, reference in `boards/hud-reference.png`): HP panel left, Mana panel right, **level number in a centre hex whose fill is stamina** (green / yellow / red, running icon while sprinting), segmented **XP bar** below, **skill bar + ultimate above**, vanilla hotbar framed at the bottom; party top-left, boss bar top-centre, quests + buffs top-right. Spec 029 | owner's layout | DECIDED |
| D-62 | "The Awakening" (tutorial) vs Bloodline stage 5 "Awakened" | rename one / keep both | **Keep both on purpose:** Chapter 0 is the first awakening (no memory); stage 5 is awakening **again**, reclaiming part of the past self's power (lore bible §2) | keep both, tie to lore | DECIDED |
| D-63 | Chat | vanilla / channels | **Channels:** Global, Local (100 blocks, default), Party, Guild, Private, Shout (60 s CD, highlighted) + an All view; shortcuts `/g /l /p /gc /msg /r /shout`; a clickable channel bar from `/chat` (real tabs under the input need a client mod); NPC spam merged; Triton for labels / system text, player text not translated. Spec 031 | as recommended | DECIDED |
| D-64 | NPC name colours & guards | — | **Green** ordinary NPCs · **Gold** important / service / main-quest NPCs (`!` / `?`) · **Blue** guards (players can't hit them, monsters can; attack monsters in sight 16 blocks, leash 24, return to post or patrol, respawn 30 s) · **Red** monsters · **Purple** bosses / elites. Guard-only kills give no XP / drops. Spec 032 | owner's design | DECIDED |
| D-65 | Monster ranks & combat rules | — | **Normal** (red): no guard / Super Armour, CC works · **Elite** (purple): some have Frontguard **or** Super Armour · **Boss / World Boss** (purple): never stunned / knocked back / slowed except in a **stun phase** (A: scripted at HP 70 % / 40 % or after a missed big move, 5 s, +30 % damage taken, CC works); **B** Break gauge on some bosses later. Telegraphs: Normal area attacks, Elite / Boss all heavy moves. Spec 033 | owner's design, A first | DECIDED |
| D-66 | Wings | — | **Wings slot** (MMOInventory) beside armour + accessories; MMOItems `WCMMO_WINGS`, tiers I / II / III (+3/6/10 % damage, −3/5/8 % damage taken, +0/40/80 HP, Lv 20/40/55); same stats for everyone, **look per Bloodline**; folded in safe zones, spread + hover pose + Slow Falling while airborne outside; no real flight; store sells skins only. Spec 034 | as recommended | DECIDED |
| D-67 | Training dummy | — | Admin-placed skeleton dummy (Steve head, wooden sword): never dies, never fights back, statuses above the head, per-player DPS sessions (5 s idle ends), gives Remnant only (no XP / Mastery / drops); `/dummy spawn/list/tp/remove/info/respawn` with records + log, auto-repair. Spec 035 | as recommended | DECIDED |
| D-36b | Weapon swap exploit | — | Mastery CDR applies only to that weapon's skills. General skills use the held weapon's Mastery | Mastery CDR = that weapon's skills + general skills based on the weapon held | DECIDED |

---

## 4. Combat & mechanics

- **BDO mechanics:** **Frontguard** (frontal block), **I-frame** (invincibility frames) and **Super Armour** (immune to crowd control/stagger). **I-frame is deferred (D-49):** Phase 0 builds Frontguard and Super Armour only.
- **FPV animation:** souls-like first-person combat animations using MC models and ModelEngine.

| Attacker ↓ / Defender state → | Normal | Frontguard (hit from front) | Super Armour | I-frame |
|---|---|---|---|---|
| Normal hit | damage | blocked (chip) | damage, no CC | miss |
| CC skill | damage + CC | blocked | damage, **no CC** | miss |
| Guard/armour-break skill | damage | guard broken + damage | damage **+ CC** | miss |

Bloodlines plug into this: Fury *Unstoppable* and *Death Defying* grant Super Armour; Ward builds on Frontguard and perfect guards.

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-05 | FPV animation approach | ModelEngine view model / animated item models / display entities | **ModelEngine view model** (`pv=true`), proven possible by the bought Draconic Dual Sword FPV pack (spec 010). Test it first; other approaches only if it fails | start with Draconic pack | OPEN (testing) |
| D-44 | Weapon trigger layer for FPV weapons | MythicCrucible items (as the pack does) / MMOItems + our plugin | PoC with Crucible as shipped. Long-term: **MMOItems weapon + our plugin** handles hold/unheld/click triggers and calls the same MythicMobs skills, so one item has both MMOItems stats and FPV animation | | OPEN |
| D-06b | Frontguard on hit | 0 / chip / stamina drain | Chip 20 % + stamina drain; guard breaks at 0 stamina | Chip 20 % + stamina drain per blocked hit; guard breaks at 0 stamina (1 s stagger) | DECIDED |
| D-06c | PvP in v2 | none / arenas / open world | Arenas only until guild design (§11) | **Now:** arenas only. **Later (after guild design):** open-world PvP outside safe zones, only between players **Lv 25+** | DECIDED |
| D-06d | Which weapons break guard / Super Armour | — | Hammer and Greatsword heavy skills break both | **Hybrid:** every weapon has 1 guard-break skill (breaks Frontguard only, long cooldown). **Hammer + Greatsword**: all heavy skills break Frontguard **and** Super Armour, and their normal hits drain guard stamina ×2 | DECIDED |
| D-49 | I-frame in Phase 0? | keep (simple no-damage window) / defer / drop | Keep the simple version (an `onDamaged` aura that cancels damage for a few ticks) | **Defer:** not in Phase 0. Dash is pure movement, Fury's Death Defying uses Super Armour instead; may return later | DECIDED |

---

## 5. Equipment system

- **Armour:** Helmet, Chestplate, Leggings, Boots (4 slots).
- **Accessories (BDO style):** 1 Necklace, 1 Earring, 1 Ring, 1 Belt.
- **Item system:** "Identify" for random gear options (Wynncraft style). Fallback: crafting / NPC quest rewards. Gear can carry elemental attributes.

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-09 | Accessory (and Rune) slots plugin | MMOInventory / custom GUI | MMOInventory: one GUI for 4 accessories + 2–4 Runes | MMOInventory (owned) | DECIDED |
| D-10 | Identify system | identify / fixed | Identify, with crafting/quest fallback (your call). ⚠️ PoC MMOItems unidentified items | identify | DECIDED |
| D-11 | Element list | MythicLib built-in / custom | MythicLib built-in elements (verify list in PoC) | MythicLib built-in elements **for now**. Reminder: maybe custom lore elements later | DECIDED |
| D-12 | Enhancement max & fail rules | V / X; destroy / downgrade / pity | Max V, pity stacks, **no item destruction** | Max V, pity stacks, items never destroyed | DECIDED |
| D-12b | Armour uses the same ladder as weapons | yes / no | yes (your text: "Weapon and Armour enhancements") | yes | DECIDED |
| D-12c | Enhancement materials | — | One stone per category (weapon / armour / accessory) from zone drops | One stone per category (weapon / armour / accessory), zone drops | DECIDED |
| D-12d | Are accessories still enhanced (I–V)? | yes / no | v1 had it, v2 does not mention it. Recommend **yes, I–V**, as the late-game AP/DP source | Yes, accessories enhance I–V | DECIDED |

---

## 6. Farming zones, monster tiers, bosses & dungeons

- **AP/DP soft caps:** monster zones are gated by Attack Power and Defense Power.
  - *Low AP:* players deal severely reduced damage (e.g. 10–20 %).
  - *Over-capped AP:* excess damage is diminished, to protect the low-level zone economy.
- **Farming styles:**
  - **Loop farming (rotation):** traditional open-world zones for mobile clearing.
  - **Stationary farming (Dehkia's Lantern style):** interactable totems spawn continuous waves of High-tier mobs for a set time, run by MythicMobs spawners.
- **Bosses & dungeons:** solo/party instanced dungeons and World Bosses. World Boss loot is given by **damage contribution (threat table)**, not last hit.

| Tier | Recommended AP / DP (*proposed*) | Level band |
|---|---|---|
| Low | 50 / 60 | 1–20 |
| Mid | 120 / 150 | 20–40 |
| High | 200 / 260 | 40–60 |

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-13 | AP/DP rule | hard / soft cap | Soft cap (your call) | soft | DECIDED |
| D-13b | AP/DP source | gear / gear + stats | Gear + enhancement (your call: "enhancement = raw power") | gear+enh | DECIDED |
| D-16 | Totem activation | free / item cost / cooldown | Consumable item, 10 min, one per spot | Consumable totem item, 10 min, one totem per spot, solo or party | DECIDED |
| D-16b | Totem implementation | MythicMobs spawners (+ plugin) | MythicMobs spawners (your call) + Kotlin for spot ownership/timer | spawners | DECIDED |
| D-17 | World boss loot | last hit / contribution | Damage contribution / threat table (your call) | Contribution, not last hit: anyone who hit the boss or is nearby when it dies gets a random loot roll; **MVP top 1–3 damage** get bigger rewards, the rest tiered below | DECIDED |
| D-17b | World boss schedule | fixed / random | Fixed times, 2×/day | 2 fixed times per day + admins can summon extra | DECIDED |
| D-18 | Party size | 3 / 4 / 5 | 4. Roles now come from Bloodline + Runes + weapon, not class | Party dungeons: 2–5 players. Solo dungeons: solo only | DECIDED |

---

## 7. Quests & story

> **Story canon (spoilers, team only):** [lore-bible.md](lore-bible.md): Chapter 0 (tutorial = the past) and Chapter 1, the reveal ladder, the `???` stone, map landmark rules. First trailer plan: [trailer.md](trailer.md).

- **Progression:** chapter- and region-based story (BDO style).
- **Solo experience:** 100 % of main story quests are soloable, using instanced bosses (**MythicDungeons**) and immersive UI dialogue.

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-14 | Instance plugin | MythicDungeons (to buy) / own instances in wcmmo-core | MythicDungeons (your call). **Not owned yet**: buy before the first solo dungeon/story boss. Building instances ourselves is possible but costs weeks | MythicDungeons, to buy | DECIDED |
| D-15 | Quest stack | quest engine + LuxDialogues (owned) | LuxDialogues for dialogue + a quest engine (BetonQuest candidate) for objectives and rewards | | OPEN |
| D-15b | Chapters in Phase 1 | 1 / 2 / 3 | 1 (tutorial + Bloodline choice + first region) | 1 chapter in Phase 1 | DECIDED |

---

## 8. Lifezone & housing (Heartopia style)

- **Instanced shared worlds:** housing and lifeskills live in separate "Lifezone" instances.
- **Instance capacity:** hard cap of **20 players (20 housing plots)**. When full, a "World Full" prompt blocks entry.
- **Dynamic plot allocation (technical logic):**
  - Houses and furniture are saved as **schematic data**.
  - On entering a new Lifezone, the system pastes the schematic onto an empty plot **asynchronously with FastAsyncWorldEdit (FAWE)**, so the server doesn't lag.
- **Furniture:** made with **Nexo** custom blocks, sold by NPCs or crafted.

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-19 | Lifezone topology | worlds on main server / servers behind Velocity | ⚠️ Start as worlds on the main server; keep data ready for a Velocity split | In-server, own plugin (use MMOCore data where it helps); proxy later. **2026-09-29:** Lifezone is the one system already agreed to become our **own plugin** (exception to the Skript-first rule, D-25). Design and build are discussed after the combat/MMO core is mostly finished | DECIDED |
| D-20 | Plot size | 24 / 32 / 48 | *proposed* 32×32×32 | | OPEN |
| D-20b | When the house is saved | on leave / every edit | On leave + every 10 min | | OPEN |
| D-20c | When the plot is pasted | on owner arrival | Paste on arrival, clear on leave | | OPEN |
| D-21 | Party entering a full zone | strict / offer another | Strict block + "open a new Lifezone for our party" | | OPEN |
| D-21b | Visiting houses | no / friends / public | Only while the owner is in the same Lifezone | | OPEN |
| D-23 | Furniture source | shop / shop + craft | NPC shop or crafted (your call) | both | DECIDED |
| ⚠️ | Nexo furniture inside schematics | — | Must be proven: furniture is entities + data; FAWE must copy them intact | | PoC |

---

## 9. Lifeskills & economy

- **Core professions:** Mining, Gathering, Fishing, Cooking, Alchemy (MMOCore).
- **Resource tier separation:**
  - **Lifezone (low–mid tier):** 100 % safe zones for casual farming.
  - **MMO open world (high tier):** rare resources are hidden in dangerous monster zones, so crafters venture out or hire combat escorts.

| ID | Decision | Options | Recommendation | Your call | Status |
|---|---|---|---|---|---|
| D-22 | Lifeskill list | 5 | Mining, Gathering, Fishing, Cooking, Alchemy (your call). Weapon Mastery also uses MMOCore professions, but those are combat professions, not lifeskills | 5 | DECIDED |
| D-26 | High-tier resources in PvP? | PvE / PvP | PvE only until guild/node war design | PvE only for now; later follows the D-06c PvP rule | DECIDED |

---

## 10. Economy & trade: coming soon

Placeholder. To decide: currency provider (CMI / MMOCore / Vault), player market (auction house vs player shops), gold sinks (enhancement, respec, extraction item, identify, furniture), bound items.

## 11. Guild & node war: coming soon

Placeholder. To decide: guild plugin vs custom, node ownership, war schedule, PvP rules.

## 12. Pets & mounts: coming soon

Placeholder. To decide: ModelEngine mounts, pet buffs vs cosmetic, loot pickup.

---

## Phase plan

| Phase | Goal | Specs |
|---|---|---|
| **0: PoC** | Prove risky tech: FPV animation (D-05), combat states, F bar swap + Q ultimate + instant bow (D-03, D-51, D-53), Bloodline hooks (D-37), identify (D-10), Mastery CDR via PlaceholderAPI (D-36), Lifezone schematic + Nexo furniture | 004 |
| **1: Vertical slice** | Tutorial + 1 region, **all 3 base Bloodlines (Fury, Ward, Pulse) stages 1–3**, 2 Runes, 4 weapons (Sword, Hammer, Bow, Staff) with Mastery to 25, stats gating, basic gear, 1 solo dungeon | 005–012, 014, 016, 021–024 |
| **2: Core MMO** | All launch Bloodlines to stage 5, all weapons, enhancement to V, Mid/High zones, stationary farming, world boss, party dungeon | 013–017, 021–023 |
| **3: Lifezone** | Instances, housing migration, lifeskills, furniture | 018–020 |
| **4: Social** | Economy, guilds & node war, pets & mounts | §10–12 (not specced) |

## Decision log

| Date | ID | Decision | By |
|---|---|---|---|
| 2026-09-28 | D-03 | Bar swap on `Shift + Right Click` | owner (GDD v2) |
| 2026-09-28 | D-04b, D-08 | Classless weapon freedom, gated by stats | owner (GDD v2) |
| 2026-09-28 | D-10, D-12b, D-13, D-13b | Identify with fallback; armour uses the weapon ladder; AP/DP soft cap from gear + enhancement | owner (GDD v2) |
| 2026-09-28 | D-14, D-16b, D-17, D-22, D-23 | MythicDungeons; totem spawners; contribution loot; 5 lifeskills; furniture shop + craft | owner (GDD v2) |
| 2026-09-28 | — | Classes removed; Bloodlines + Runes + Weapon Mastery added | owner (GDD v2) |
| 2026-09-28 | D-25 | Custom plugin work by Tatoo in `wcmmo-plugins` | owner |
| 2026-09-28 | D-19 | Lifezones in-server via own plugin, proxy-ready | owner |
| 2026-09-28 | D-27 (tool) | Translations via Triton | owner |
| 2026-09-28 | D-00 | Core paid plugins owned; MythicDungeons still to buy | owner |
| 2026-09-28 | D-40 | Nexo = furniture, blocks, resource pack; MMOItems = gear; Crucible optional | owner |
| 2026-09-28 | D-09, D-43 | MMOInventory owned; MMOProfiles later, not at start | owner |
| 2026-09-28 | D-05 | FPV testing starts with the bought Draconic Dual Sword FPV pack | owner |
| 2026-09-28 | D-39 | MythicHUD = always-on HUD; UltimateUI = shops, quest list, other custom UI | owner |
| 2026-09-29 | D-01, D-02, D-03a, D-04, D-04c, D-06b, D-06c, D-06d, D-07, D-07b, D-08b, D-11, D-12, D-12c, D-12d, D-15b, D-16, D-17b, D-18, D-26, D-30, D-33, D-34, D-35, D-35b, D-36b, D-41, D-42, D-46 | Decision session: 29 decided, D-36 partly (test values), D-17 loot refined | owner |
| 2026-10-02 | D-60, D-52 | Click combos instead of keys 1–5; free loadout of owned skills (10 slots + ultimate slot); weapon swap cooldown 5 s; ultimate owned at the Mastery cap | owner |
| 2026-10-02 | D-53 | Bow basic shot: natural arrow, no range limit (6-block limit and aim assist tried and dropped) | owner |
| 2026-10-01 | D-38 | 3 repos; content configs and plugin jars tracked in `wcmmo` | owner |
| 2026-10-01 | D-66, D-67 | Wings slot with modest stats and Bloodline looks; training dummy with DPS meter and admin records | owner |
| 2026-10-01 | D-65 | Monster ranks; bosses CC-immune except stun phases (A now, Break gauge B later) | owner |
| 2026-10-01 | D-64 | Five name colours; guard NPCs defend the city | owner |
| 2026-10-01 | D-63 | Chat channels with a clickable channel bar | owner |
| 2026-10-01 | D-27, D-62 | Thai + English with English proper names; Awakening / Awakened kept as a story link | owner |
| 2026-10-01 | D-60, D-61 | Keys 1–5 cast skills; HUD layout (level hex with stamina fill, XP bar, skill bar above) | owner |
| 2026-10-01 | D-57, D-58, D-59 | Death (auto-respawn, light penalties), levelling targets, party XP and loot ownership | owner |
| 2026-09-30 | D-56 | 17 runes with shared caps; renamed Breath / Clarity / Leech / Steadfast to avoid clashes | owner |
| 2026-09-30 | D-55 | Orb skills (family + weapon-only) from NPC or monster orbs; Unbroken Vow on Ward | owner |
| 2026-09-30 | D-03, D-30, D-50–D-54 | Controls: F bar swap, Q ultimate (Remnant gauge), instant bow; AGI basic attack speed capped; 10 general skills + 5 skills and 1 ultimate per weapon; item detail pages | owner |
| 2026-09-30 | D-49 | I-frame deferred out of Phase 0 | owner |
| 2026-09-30 | D-31, D-48 | 3 base Bloodlines Fury / Ward / Pulse with A/B paths; value trials in the tutorial; future Bloodlines as specialists | owner |
| 2026-09-29 | D-47 | Skript for prototypes, tutorial/quest glue, tools; Kotlin for hot paths and player data | owner |
| 2026-09-29 | D-32, D-31 (part) | The Awakening tutorial picks the first Bloodline; 3 base Bloodlines = BODY / MIND / FREEDOM | team design |
| 2026-09-29 | D-19 | Lifezone will be our own plugin; talk about it after the combat/MMO core is mostly finished | owner |
| 2026-09-29 | D-25, D-47 (revised) | Skript + vendor plugins first; `wcmmo-plugins` deferred until a per-system review after Phase 0 (own plugin vs vendor/Skript) | owner |
