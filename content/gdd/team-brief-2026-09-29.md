# WC-MMO — Team brief (2026-09-29)

**Date:** 2026-09-29  ·  **From:** Tatoo (owner, head dev)  ·  **Source of truth:** `wcmmo-specs` repo: `gdd/wcmmo-gdd-v2.md` (design), `docs/` (specs), `gdd/owner-questions.md` (open questions)

Purpose: everyone on the team sees the same picture: what the game is, what is already decided, how we work, and which questions we still need to answer.

## 0. What's new since 2026-09-28

- **The Awakening** (team design): the tutorial secretly scores BODY / MIND / FREEDOM from how you play and the Bloodline chooses you. Tie → Bloodline Encounter; one-time Reject → manual pick. New spec 024.
- **3 base Bloodlines** = BODY / MIND / FREEDOM. Berserker proposed as BODY; MIND and FREEDOM still to design.
- **HUD / UI split decided:** MythicHUD = always-on HUD; UltimateUI = shops, quest list, every other custom UI.
- **Skript vs Kotlin decided:** Skript (+ SkBee, skript-reflect, skript-placeholders) for prototypes, tutorial/quest glue, staff tools. Kotlin for combat, player data, bar swap, Lifezone.
- **Libraries prepared:** ProtocolLib, PacketEvents, PlaceholderAPI, Vault.
- **For your AI assistant:** `CONTEXT.md` in the repo explains the whole project in one file.

## 1. The game in one page

A **classless action MMORPG** on Minecraft (Purpur 26.2) for **100–200 players** on one server. Inspired by Black Desert Online (combat, zones, lifeskills), MU Online (stat-gated gear, enhancement) and Wynncraft (stat allocation, identified gear). Bloodlines work like One Piece Devil Fruits.

| System | What it does |
|---|---|
| The Awakening (tutorial) | No class menu: the tutorial watches how you fight and solve a puzzle (BODY / MIND / FREEDOM) and the matching Bloodline chooses you. Accept, or Reject once and pick manually. |
| Bloodline (1 slot) | 3 base Bloodlines (BODY / MIND / FREEDOM). Core identity. Evolves in 5 stages (Lv 1 / 20 / 40 / 60 / Awakened) and changes mechanics, not just stats. Changing it needs a rare extraction item. Example: Berserker. |
| Runes (2–4 slots) | Small passive bonuses (HP, stamina regen, cooldown). Swap freely. Turn the same Bloodline into a tank or a DPS. |
| Stats: STR AGI INT DEX DEF | The gateway: decide which weapons and armour you can equip. Stats do not add damage. |
| Enhancement | +1 to +15, then I to V. The main source of raw power (AP / DP). |
| Weapon Mastery | Grows by using a weapon. Unlocks that weapon's unique skills and lowers its cooldowns. |
| Skills | 10 active skills in 2 bars of 5, swapped with Shift + Right Click. Unique weapon skills only cast with that weapon in hand. |
| Combat | Frontguard (front block), I-frame (dodge invincibility), Super Armour (no stagger). Souls-like first-person animation. |
| Vitality | HP, Mana, Stamina. Stamina replaces hunger. Food is a heal/buff, not survival. |
| Gear | 4 armour + Necklace, Earring, Ring, Belt. Identify system for random stats. Elements. |
| Zones & farming | AP/DP soft cap per zone. Loop farming, plus totem 'stationary' farming with waves of mobs. |
| Bosses & dungeons | Solo and party instanced dungeons. World boss loot by damage contribution, not last hit. |
| Story | Chapters by region, city to city. 100 % of the main story is soloable, story bosses are instanced. |
| Lifezone & housing | Separate housing worlds: 20 players / 20 plots each. Your house is saved and pasted on a free plot wherever you go. |
| Lifeskills | Mining, Gathering, Fishing, Cooking, Alchemy. Safe low–mid resources in Lifezone, rare ones in monster zones. |
| Coming soon | Economy & trade, Guild & node war, Pets & mounts (not designed yet). |

## 2. Team & repos

| Person | Role |
|---|---|
| Tatoo | Owner, head dev: custom plugins, server, resources, map, story (~75 % of the work) |
| OmAm | Story with Tatoo, some resources, timeline / PM: keeps everyone on the same picture |
| Team (2–5) | Map and resources. Roles not assigned yet (see 6.1) |

| Repo | What it holds | Status |
|---|---|---|
| wcmmo | The real server: configs, scripts. Branch develop = dev box, main = production | exists |
| wcmmo-specs | Design doc, specs, registries, open questions | exists |
| wcmmo-plugins | Source of our own plugins (Kotlin) + starter build per plugin | to create |

Owner wants only these 3 repos. The team still needs to confirm (6.1).

## 3. How we work

1. **Design** in `gdd/wcmmo-gdd-v2.md`. Every open choice is a decision `D-xx` with options and a recommendation.
2. **Spec** in `docs/NNN-name.md`: exact files, IDs, numbers, test plan, rollback. A spec cannot be READY while a decision it needs is still open.
3. **Build** in the target repo with specsmd FIRE: one branch per spec off `develop`, every run is logged.
4. **Test** on the dev box following the spec's test plan.
5. **Ship**: pull request `develop` -> `main` only. Nobody commits to `main`.

Rules for everyone: no secrets, paid plugin jars or player data in git; every new ID (item, mob, skill, region, permission) is registered in `docs/README.md` first; balance numbers go in tables.

## 4. Decided so far

| What | Decision |
|---|---|
| Character system | Classless: Bloodline + Runes + Weapon Mastery (replaces the old 3-class design) |
| Skill bar swap | Shift + Right Click (to be proven in a test, fallback Shift+F) |
| Weapons | Free choice, only stats gate what you can equip |
| Raw power | AP/DP from gear + enhancement; soft cap per zone; armour uses the weapon ladder |
| Gear stats | Identify system (fallback: crafted / quest gear) |
| Instances | MythicDungeons for story bosses and dungeons |
| World boss loot | By damage contribution |
| Stationary farming | MythicMobs spawners (totems) |
| Lifeskills | Mining, Gathering, Fishing, Cooking, Alchemy |
| Furniture | Nexo, sold by NPCs or crafted |
| Lifezone | Inside the main server with our own plugin; proxy later if needed |
| First Bloodline | Chosen by The Awakening tutorial; one-time Reject; 3 base Bloodlines = BODY / MIND / FREEDOM |
| HUD / UI | MythicHUD = always-on HUD; UltimateUI = shops, quest list, other custom UI |
| Custom code | Kotlin plugin by Tatoo (wcmmo-plugins) for combat, player data, bar swap, Lifezone. Skript for prototypes, tutorial/quest glue, staff tools |
| Translations | Triton (owned) |
| Paid plugins | All owned: MMOCore, MMOItems, MythicLib, MMOInventory, MMOProfiles (later), MythicMobs, ModelEngine, Nexo, MythicCrucible, MythicHUD, UltimateUI, Triton + more. **Not owned: MythicDungeons** |
| Items & resource pack | MMOItems = all gear. Nexo = furniture, custom blocks and the one merged resource pack |
| First-person combat test | Start with the bought Draconic Dual Sword FPV pack (ModelEngine first-person model) |
| Plugin versions | Always the latest build (all bought); record the version at install |
| Production server | VPS with 32 GB RAM for 100–200 players (CPU to be chosen) |

## 5. Plan & timeline

| Phase | Goal |
|---|---|
| 0: Tests (PoC) | Prove the risky tech first: first-person animation, combat states, Shift+RMB swap, Bloodline hooks, Mastery cooldown maths, Identify, Lifezone house save/paste with Nexo furniture |
| 1: Vertical slice | The Awakening tutorial + 1 region, Berserker stages 1–3, 2 Rune slots, 4 weapons (Sword, Hammer, Bow, Staff) with Mastery, stat gating, 1 solo dungeon |
| 2: Core MMO | All launch Bloodlines to stage 5, all weapons, enhancement to V, Mid/High zones, totems, world boss, party dungeon |
| 3: Lifezone | Housing instances, lifeskills, furniture |
| 4: Social | Economy, guilds & node war, pets & mounts |

**Target:** vertical slice in **2–3 weeks** from 2026-09-28. This is tight because ~75 % is on one person and Phase 0 tests must fit inside it. We re-check scope at the end of week 1.

## 6. Still open: what we need to answer

### 6.1 Team meeting

| # | Question |
|---|---|
| TM1 | Confirm the 3-repo layout (wcmmo, wcmmo-specs, wcmmo-plugins) |
| TM2 | Who does map, resources, models? Assign the 2–5 team members |
| TM3 | Is 2–3 weeks for the vertical slice realistic? What do we cut if not? |
| TM4 | VPS: provider, CPU / core count, monthly budget |
| TM5 | Buy MythicDungeons, or build our own instance module? Needed for story bosses, dungeons **and the per-player Awakening tutorial** |
| TM6 | Which quest engine pairs with LuxDialogues (after plugin setup, with the first trailer in mind) |

### 6.2 Plugins: what we have and where each fits

| Job | Plugin(s) | Status |
|---|---|---|
| Stats, Mana/Stamina, Mastery, lifeskills | MMOCore + MythicLib | owned |
| Weapons, armour, Identify, enhancement, runes | MMOItems | owned |
| Accessory + rune slots | MMOInventory | owned |
| Mobs, bosses, Bloodline effects, totems | MythicMobs | owned |
| Models, first-person animation | ModelEngine | owned |
| FPV weapon item triggers (test) | MythicCrucible | owned |
| Furniture, blocks, merged resource pack | Nexo | owned |
| Always-on HUD (HP, Mana, Stamina, skill bars) | MythicHUD | owned |
| Shops, quest list, other custom UI | UltimateUI | owned |
| Scripting (prototypes, glue, tools) | Skript + SkBee, skript-reflect, skript-placeholders | owned |
| Libraries | ProtocolLib, PacketEvents, PlaceholderAPI, Vault | prepared |
| Dialogue / quests | LuxDialogues + quest engine (TBD) | LuxDialogues owned |
| Cosmetics / store | CosmeticsCore, ItemSkins | owned |
| Side content | BattlePass, LuxCollect | owned, after slice |
| Guilds / buy orders | Guilds, Order | owned, parked |
| Language / anti-bot / perms | Triton, BotSentry, LuckPerms | owned |
| Instances (story bosses, dungeons) | MythicDungeons | **not owned: TM5** |

Full per-plugin guide with docs links: `docs/plugins.md`. Watch-outs: LuxCollect and CosmeticsCore store pages don't confirm 26.2 yet; ItemSkins must keep MMOItems stats intact.

### 6.3 Technical risks (Tatoo to answer)

| # | Question |
|---|---|
| T1 | First-person animation: test the Draconic pack first. Findings F1–F10 in spec 010 (needs Crucible, fixed damage, other players may not see attacks, dual-wield dupe risk) |
| T2 | Shift + Right Click may also fire an attack on FPV weapons, and Shift+F is blocked for dual weapons. Pick a third fallback if the test fails |
| T3 | Bloodlines: our plugin owns the data and triggers, MythicMobs skills are the effects. Agree? |
| T4 | Mastery cooldowns through PlaceholderAPI in MythicMobs; fallback in our plugin. Agree? |
| T5 | Identify via MMOItems unidentified items: who tests it? |
| T6 | Nexo furniture inside saved houses: if it breaks, re-spawn furniture from a saved list. OK? |
| T8 | FPV weapons long-term: keep Crucible items, or MMOItems weapon + our plugin so one sword has stats AND animation? |

### 6.4 Game design (Tatoo + OmAm)

| # | Question |
|---|---|
| M1 | The MIND and FREEDOM Bloodlines: names, playstyles, 5 stages each. Is Berserker the BODY one? |
| M2 | Extraction item source/cost; what Bloodline stage 5 needs |
| M13 | Awakening edge cases: 3-way tie and 0/0/0 (show 3 spirits?), only the first puzzle solution counts |
| M14 | Name clash: tutorial "The Awakening" vs Bloodline stage 5 "Awakened". Rename one? |
| M3 | Final weapon list (8 proposed) and 3 unique skills per weapon; where general skills come from |
| M4 | Rune list; how Rune slots 3–4 unlock; where Runes come from |
| M5 | World map: cities, regions, Low / Mid / High zones |
| M6 | Chapter 1 story outline (tutorial -> Bloodline choice -> first boss) |
| M7 | Death penalty: XP loss? item loss? where do you respawn? |
| M8 | Level cap and levelling speed |
| M9 | Party system: size, XP and loot sharing |
| M10 | HUD layout: where HP / Mana / Stamina / skill bars / cooldowns show (MythicHUD) |
| M11 | VIP / store: what can be sold without pay-to-win |
| M12 | Languages for Triton: Thai + English? |

### 6.5 Numbers to tune later (after the tests)

Stat points per level and respec · whether stats give tiny bonuses · Frontguard chip damage · which weapons break guard · PvP scope · Mastery XP and unlocks · enhancement fail rules and materials · accessory enhancement yes/no · totem cost · world boss times · Lifezone plot size and save timing · stamina display · food healing · element list · quest dialogue plugin. All are listed with a recommendation in `gdd/wcmmo-gdd-v2.md`.

## 7. Next steps

- **Team:** meeting on 6.1; assign roles; everyone reads `gdd/wcmmo-gdd-v2.md`. Give `CONTEXT.md` to your AI assistant so it knows the project.
- **Tatoo:** install FIRE in wcmmo, install plugins in the order of `docs/plugins.md` (libraries first), run the Draconic FPV test (spec 010), prototype The Awakening triggers in Skript for the trailer (spec 024), create wcmmo-plugins, answer 6.3.
- **Map team:** build the tutorial shrine (Trial of Action, sleeping-mob zone, gate with cracked wall / hidden lever / roof route, Sanctum) with the regions listed in spec 024.
- **Tatoo + OmAm:** answer 6.4, starting with M1 (Bloodlines) and M6 (Chapter 1 story).
- **OmAm (suggested):** track answers and dates in `gdd/owner-questions.md` so the picture stays the same for everyone.
