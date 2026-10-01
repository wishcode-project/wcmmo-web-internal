# WC-MMO — Plugin guide

> Updated: 2026-09-28 · Owner: Tatoo · Summary table also in [README.md → Plugin registry](README.md#plugin-registry)
>
> One section per plugin: what it is for **in WC-MMO**, docs, what it needs, setup to-do, what to watch out for.
> When you install, update or drop a plugin, update this file and the registry row in the same commit.

**Versions:** everything is bought, so we run the **latest build** of each plugin and update freely. Record the exact version in the table when a plugin is installed on the dev server.

**Status:** `installed` = on the dev server · `owned` = bought, not installed · `to buy` · `free` · `parked` = owned but its system is not designed yet · `not using`
**26.2:** ✅ store page says it supports 26.2 · ❓ not confirmed · ⚠️ store page shows an older max version

Only link official pages (the store page, the wiki, GitHub). Never use leak sites for docs or jars.

## 1. Overview

| Plugin | Category | Status | Version | 26.2 | Used for | Specs |
|---|---|---|---|---|---|---|
| Purpur | server | installed | 26.2 build 2633 | ✅ | server software | 001 |
| CMI + CMILib | essentials | installed | 9.8.10.2 + CMILib 1.6.0.1 | ✅ | homes, warps, kits, chat, tab, economy | 002 |
| Vault | bridge | installed, prepared | 2.1.1 (java21) | ✅ | economy/permission API | 002 |
| WorldGuard | world | installed | 7.0.19 | ✅ | regions, zone flags, plots | 002, 014, 018 |
| FastAsyncWorldEdit | world | installed | 2.15.4 | ✅ | building, house paste | 002, 018 |
| Multiverse-Core | world | installed | 5.8.1 | ✅ | worlds, Lifezone worlds | 002, 003, 018 |
| Citizens | NPC | installed | 2.0.44 build 4256 | ✅ | NPCs | 002, 013, 016, 020 |
| spark | tools | installed | built into Purpur | ✅ | lag profiling | 001 |
| MMOCore | RPG core | **owned**, installed | 1.13.1-SNAPSHOT (2026-09-12) | ✅ | stats, Mana/Stamina, Mastery, lifeskills | 005, 006, 019, 023 |
| MMOItems | RPG core | **owned**, installed | 6.10.1-SNAPSHOT (2026-09-16) | ✅ | gear, Identify, enhancement, runes | 008, 011–013, 022 |
| MythicLib | RPG core | **owned**, installed | 1.7.1-SNAPSHOT (2026-09-12) | ✅ | required library | — |
| MMOProfiles | RPG core | **owned**, later | ? | ❓ | multiple characters per account: planned, not at start (D-43) | — |
| MMOInventory | RPG core | **owned** (D-09), installed | 2.0-SNAPSHOT (2026-08-23) | ✅ | accessory + rune slots | 011, 022 |
| MythicMobs | mobs | **owned**, installed | Premium 5.13.0 | ✅ | mobs, bosses, Bloodline effects, totems | 015, 017, 021 |
| ModelEngine | models | **owned**, installed | R4.1.1 | ✅ | mob models, animation test | 010 |
| MythicDungeons | instances | **to buy** (D-14: not owned) | ? | ❓ | story bosses, dungeons | 016, 017 |
| **MythicCrucible** | items | **owned**, installed | 5.13.0 | ✅ | **needed for the FPV weapon test**: the Draconic pack uses Crucible item triggers (D-44). Not a pack owner (D-40) | 010 |
| Nexo | items/pack | **owned**, installed | 1.29-dev (b3ebc6e48) | ✅ | furniture, custom blocks, **merged resource pack owner** (D-40, T7) | 018, 020 |
| **MythicHUD** | HUD | **owned**, installed | 1.3.5 | ✅ | always-on HUD: HP / Mana / Stamina / skill bars / cooldowns (D-39) | 005, 007 |
| **UltimateUI** | UI | **owned**, installed | 1.4.0 | ✅ | shops, quest list, menus, any custom UI MythicHUD can't do (D-39) | — |
| **CosmeticsCore** | cosmetics | **owned**, installed | 1.3.13 needed | ❌ 1.3.12 has no 26.2 support (NMS null); 1.3.13 loads but this copy fails the licence check: re-download 1.3.13 from the store | hats, backs, wings, balloons (D-41) | — |
| **ItemSkins** | cosmetics | **owned** | 2.1.0 | ❓ | weapon/item texture skins (D-41) | — |
| **LuxDialogues** | quests | **owned** | 4.1.3 | ✅ | Wynncraft-style NPC dialogue (D-15) | 016 |
| **LuxCollect** | quests | **owned** | ? | ⚠️ page lists up to 1.21.11 | collectables hunt (D-42) | — |
| Quest engine | quests | **undecided** (D-15) | — | — | story quest objectives/stages | 016 |
| **BattlePass** | engagement | **owned** | 5.0.12 | ✅ (title says 1.17–26.2) | seasons, daily/weekly quests (D-42) | — |
| **Guilds** | social | **parked** (GDD §11) | 3.5.7.2 | ❓ | guilds (design coming soon) | — |
| **Order** | economy | **parked** (GDD §10) | 2.6.9 | ❓ | player buy orders (design coming soon) | — |
| **BotSentry** | security | **owned** | 9.9.1-THANATOS | ❓ | anti-bot / anti-VPN | — |
| Triton | language | owned, installed | 4.1.0 | ✅ (needs ProtocolLib 5.5.0 dev build; 5.4.0 broke it) | Thai/English per player (D-27) | — |
| PlaceholderAPI | bridge | **prepared** (free), installed | 2.12.3 | ✅ | Mastery maths, HUD values, Skript placeholders | 023 |
| LuckPerms | permissions | **owned** (free), installed | 5.5.85 | ✅ | permission groups | README |
| PacketEvents | library | free, installed | 2.14.0 | ✅ | required by ItemSkins | — |
| **ProtocolLib** | library | **prepared** (free), installed | 5.5.0-SNAPSHOT (dev build) | ✅ | packet library that many plugins depend on | — |
| DiscordSRV | social | **owned** (free), later | ? | ❓ | Discord chat bridge | — |
| **Skript** | scripting | **owned** (free), installed | 2.16.2 | ✅ | quick custom logic: prototypes, tutorial/quest glue, admin tools (D-47) | 024 |
| **SkBee** | Skript addon | **owned** (free), installed | 3.26.0 | ✅ | NBT, boss bars, scoreboards, structures, more syntax for Skript | — |
| **skript-reflect** | Skript addon | **owned** (free), installed | 2.6.3 | ✅ | call Java/Paper/plugin APIs from Skript | — |
| **skript-placeholders** | Skript addon | **owned** (free), installed | 1.7.2 (fork) | ✅ | read and register PlaceholderAPI placeholders from Skript | — |
| wcmmo-core | ours | **deferred** (D-25): Skript first, per-system review after Phase 0 | — | — | candidates: combat states, bar swap, Bloodlines, AP/DP, Lifezone… | many |

## 2. Overlaps: decide one owner per job

Several plugins do the same job. Two plugins owning one job means double config, conflicts and a bigger resource pack.

| # | Job | Candidates | Recommendation | Your call |
|---|---|---|---|---|
| **D-39 ✅** | HUD (bars on screen) | MythicHUD / UltimateUI | **MythicHUD** for the always-on HUD (HP, Mana, Stamina, skill bars, cooldowns), reading MMOCore values through PlaceholderAPI. **UltimateUI** only for special screens/menus it does better. Neither shows the same element as the other | **DECIDED:** MythicHUD = always-on HUD; UltimateUI = shops, quest list, every other custom UI |
| **D-40 ✅** | Custom items, furniture, blocks, resource pack | MMOItems / Nexo / MythicCrucible | **MMOItems** = all RPG gear (stats, Identify, enhancement). Then pick **one** of Nexo or Crucible for furniture, blocks and the resource pack. Crucible fits the Mythic family (MythicMobs, MythicHUD, ModelEngine) and already has furniture. Nexo is already in the design for furniture. If you own Crucible and not Nexo yet, **Crucible can replace Nexo** and save a purchase. Nexo documents Crucible compatibility if you keep both | **DECIDED:** Nexo owns furniture, blocks, merged pack; MMOItems all gear; Crucible optional |
| **D-41** | Cosmetics | CosmeticsCore / ItemSkins / Nexo or Crucible models | **CosmeticsCore** for wearables (hats, backs, wings, balloons). **ItemSkins** for weapon skins, *if* it keeps MMOItems stats/NBT intact (test). Both are good for a VIP/store (M11) | |
| **D-15** | Story quests | quest engine + LuxDialogues | LuxDialogues handles the **talking**. It still needs a **quest engine** for objectives, stages and rewards: BetonQuest (free) or another, chosen by how well it triggers LuxDialogues | |
| **D-42** | Side content | BattlePass / LuxCollect | BattlePass = seasonal daily/weekly quests (not the story). LuxCollect = collectables hunt in the world (it is a server plugin, not client-side). Both are extra; add after the vertical slice | |
| T7 ✅ | Final resource pack | Nexo or Crucible, ModelEngine, MythicHUD, UltimateUI, CosmeticsCore, ItemSkins, Triton | **One merger:** the D-40 winner builds the final pack and pulls in the others' assets. Every other plugin's pack upload is turned off | **DECIDED:** Nexo |

## 3. Plugins in detail

### 3.1 Already installed (dev server)

| Plugin | Docs | Notes |
|---|---|---|
| CMI + CMILib | [zrips.net/cmi](https://www.zrips.net/cmi/) | DB password file untracked. Decide CMI ranks vs LuckPerms (recommend LuckPerms for permissions, CMI for essentials) |
| Vault | [SpigotMC](https://www.spigotmc.org/resources/vault.34315/) | economy provider = CMI until the economy design says otherwise |
| WorldGuard | [worldguard.enginehub.org](https://worldguard.enginehub.org/) | zone regions (014), totem spots (015), Lifezone plots (018) |
| FastAsyncWorldEdit | [FAWE docs](https://intellectualsites.github.io/fastasyncworldedit-documentation/) | async house paste (018). Dev-only thread values in `wcmmo/docs/DEPLOY.md` |
| Multiverse-Core | [mvplugins.org](https://mvplugins.org/) | Lifezone worlds from one template |
| Citizens | [wiki.citizensnpcs.co](https://wiki.citizensnpcs.co/) | NPCs for quests, enhancer, furniture shop. Check LuxDialogues hooks into Citizens NPCs |
| spark | [spark.lucko.me/docs](https://spark.lucko.me/docs) | attach reports to FIRE test reports |

### 3.2 RPG core (Phoenix / MMO family)

| | MMOCore | MMOItems | MythicLib | MMOInventory |
|---|---|---|---|---|
| Docs | [wiki](https://gitlab.com/phoenix-dvpmt/mmocore/-/wikis/home) | [wiki](https://gitlab.com/phoenix-dvpmt/mmoitems/-/wikis/home) | [wiki](https://gitlab.com/phoenix-dvpmt/mythiclib/-/wikis/home) | [wiki](https://gitlab.com/phoenix-dvpmt/mmoinventory/-/wikis/home) |
| Used for | stats (gate), Mana/Stamina, Weapon Mastery + lifeskill professions | gear, Identify, elements, upgrades, runes | shared stats/skills library | 4 accessory + 4 rune slots |
| Needs | MythicLib | MythicLib | — | MythicLib, MMOItems |
| Setup to-do | classless: one default profile; 5 attributes; `mastery_*` professions | weapon/accessory/rune types from registry | install first | slot GUI per spec 011/022 |
| Watch out | MMOCore's own class system must stay unused (GDD v2 classless) | ItemSkins / Crucible must not strip MMOItems data | versions must match MMOCore/MMOItems | — |

### 3.3 Mythic family

| | MythicMobs | ModelEngine | MythicDungeons | MythicCrucible | MythicHUD |
|---|---|---|---|---|---|
| Status | **owned** | **owned** | **to buy** (not owned) | **owned** | **owned** |
| Docs | [wiki.mythiccraft.io](https://wiki.mythiccraft.io/) | [wiki.mythiccraft.io](https://wiki.mythiccraft.io/) (check) | store page (check) | [wiki](https://wiki.mythiccraft.io/mythiccrucible) · [furniture](https://git.mythiccraft.io/mythiccraft/mythiccrucible/-/wikis/Furniture) | [GitLab](https://git.mythiccraft.io/mythiccraft/mythichud) · [wiki](https://wiki.mythiccraft.io/) |
| Used for | mobs, bosses, totem waves, Bloodline effect skills | mob models, FPV animation test (010) | instanced story bosses, dungeons | items with Mythic skills; furniture/blocks/pack if it wins D-40 | always-on HUD (D-39) |
| Needs | — | — | MythicMobs | MythicMobs | MythicMobs (optional integrations) |
| Watch out | Bloodline effects triggered by our plugin (D-37) | makes its own pack assets → T7 | — | overlaps Nexo + MMOItems → D-40 | still in active development: syntax may change. Needs PlaceholderAPI for MMOCore values |

### 3.4 Items, visuals, cosmetics

| | Nexo | CosmeticsCore | ItemSkins |
|---|---|---|---|
| Status | **owned** (D-40) | **owned** | **owned** 2.1.0 |
| Docs | [docs.nexomc.com](https://docs.nexomc.com/) · [Crucible compat](https://docs.nexomc.com/compatibility/crucible) | [cosmeticscore.devs.beer](https://cosmeticscore.devs.beer/) · [BuiltByBit](https://builtbybit.com/resources/cosmeticscore.25197/) | [SpigotMC](https://www.spigotmc.org/resources/itemskins-switch-your-items-texture.97459/) · [BuiltByBit](https://builtbybit.com/resources/itemskins-switch-items-texture.21834/) |
| Used for | furniture (020), custom blocks, resource pack | hats, backs, wings, balloons (VIP/store) | swap weapon/item textures (VIP/store) |
| Needs | — | optional MySQL | **PacketEvents**; resource pack custom model data |
| Watch out | Lifezone PoC: furniture must survive schematic save/paste (018) | store page lists up to 26.1.2 → confirm 26.2 | test it keeps MMOItems stats/enhancement data |

### 3.5 Quests, dialogue, engagement

| | LuxDialogues | LuxCollect | BattlePass | Quest engine |
|---|---|---|---|---|
| Status | **owned** | **owned** | **owned** 5.0.12 | undecided (D-15) |
| Docs | [BuiltByBit](https://builtbybit.com/resources/luxdialogues-interactive-dialogues.60954/) | [BuiltByBit](https://builtbybit.com/resources/luxcollect-collectable-plugin.88399/) | wiki linked from the store page (check) | [BetonQuest](https://betonquest.org/) (candidate) |
| Used for | NPC conversations with choices (story, 016) | collectables to find in the world | seasonal daily/weekly quests + free/premium pass | story objectives, stages, rewards |
| Watch out | has a learning curve; check it works with Citizens + the quest engine | store page lists up to 1.21.11 → confirm 26.2. Not client-side | not for the main story; premium pass = store design (M11) | must trigger LuxDialogues and read MMOCore/MythicMobs |

### 3.6 Social & economy: parked until designed

| | Guilds | Order |
|---|---|---|
| Version | 3.5.7.2 | 2.6.9 |
| Docs | [wiki.glaremasters.me/guilds](https://wiki.glaremasters.me/guilds) | [BuiltByBit](https://builtbybit.com/resources/order-shulker-support-admin-gui.56558/) · [SpigotMC](https://www.spigotmc.org/resources/order-shulker-support-admin-gui.129671/) |
| Waiting for | GDD §11 Guild & node war | GDD §10 Economy & trade |
| Note | node war may need custom code on top | buy orders fit a player-driven economy; decide with the economy design |

### 3.7 Language, security, bridges

| | Triton | BotSentry | PlaceholderAPI | LuckPerms | PacketEvents | ProtocolLib |
|---|---|---|---|---|---|---|
| Status | owned | **owned** 9.9.1-THANATOS | **prepared** | free | free | **prepared** (free) |
| Docs | [triton.rexcantor64.com](https://triton.rexcantor64.com/) · [GitHub](https://github.com/tritonmc/Triton) | [BuiltByBit](https://builtbybit.com/resources/botsentry-most-powerful-antibot.8682/) | [wiki.placeholderapi.com](https://wiki.placeholderapi.com/) | [luckperms.net/wiki](https://luckperms.net/wiki) | [docs.packetevents.com](https://docs.packetevents.com/) (check) | [GitHub](https://github.com/dmulloy2/ProtocolLib) · [SpigotMC](https://www.spigotmc.org/resources/protocollib.1997/) |
| Used for | Thai/English per player | anti-bot, anti-VPN, bad-packet protection | placeholders for HUD and Mastery maths | groups in README | library for ItemSkins | packet library required by several plugins |
| Watch out | check it translates MMOItems/Nexo lore and MythicHUD text | best on a proxy; fine on one server for now. Test that it doesn't slow down legit joins | — | replaces CMI ranks for permissions | keep one version shared by all plugins that need it | on a brand-new MC version it often needs a **dev build**; check 26.2 support first. Some plugins want ProtocolLib, others PacketEvents: keep both if needed, one version each |

### 3.8 Skript (custom scripting)

| | Skript | SkBee | skript-reflect | skript-placeholders |
|---|---|---|---|---|
| Status | **owned** (free) | **owned** | **owned** | **owned** |
| Docs | [docs.skriptlang.org](https://docs.skriptlang.org/) · [GitHub](https://github.com/SkriptLang/Skript) | [wiki](https://github.com/ShaneBeee/SkBee/wiki) | [GitHub](https://github.com/SkriptLang/skript-reflect) (docs linked there) | [GitHub](https://github.com/APickledWalrus/skript-placeholders) |
| Used for | fast custom logic without compiling | extra syntax: NBT, boss bars, scoreboards, structures | reach any Java / Paper / plugin API from a script | use `%mmocore_…%` etc. in scripts, or publish script values as placeholders |
| Needs | — | Skript | Skript | Skript, PlaceholderAPI |
| Watch out | slower than Kotlin: measure hot paths (every hit, every tick) with `/spark` | — | powerful but fragile: breaks when plugin APIs change; prefer Kotlin for anything big once we have our own plugin | — |

**Skript first (D-25 revised, D-47, 2026-09-29):** we do **not** start `wcmmo-plugins` yet. Every system is built with the bought plugins + Skript for now, including the ones in the right-hand column. After Phase 0 the team reviews each system and decides: move it into our own Kotlin plugin, or keep it on vendor plugins / Skript because that is easier to implement and maintain. The right-hand column is the list of **candidates** for that review, not a rule.

| Skript is the long-term home for | Candidates to move to Kotlin later (review with `/spark` data) |
|---|---|
| Prototypes to test an idea in minutes | Combat states, damage rules, AP/DP soft cap (run on every hit) |
| Tutorial / trailer glue: Awakening trigger checks, region events, cutscene steps (spec 024 first version) | Bloodline data, extraction, stages (player data, spec 021) |
| Quest & dialogue glue between LuxDialogues, MythicMobs, rewards | Skill bar swap (input handling, spec 007) |
| Admin / staff tools, small commands, event announcements | Lifezone instances + house save/paste (spec 018): **already agreed to be our own plugin** (D-19), after the combat/MMO core |
| One-off events and seasonal content | Anything a spec marks `validate` for performance |

**Script rules**
- Scripts live in `wcmmo/plugins/Skript/scripts/`, tracked in git, named `wcmmo_<area>_<name>.sk` (e.g. `wcmmo_awakening_triggers.sk`).
- **Never track** `plugins/Skript/variables.csv*`: it holds player data. Add it to `wcmmo/.gitignore` when Skript is installed.
- Every script's header says which spec it belongs to. A script that grows past ~300 lines or runs every tick goes on the list for the D-25 review.
- Player data kept in Skript variables (Bloodline, stage, Mastery…) uses the registered IDs (`wcmmo_bloodline_fury`…) so it can be migrated if the system later moves to our own plugin.
- Script variables that other plugins need are exposed with skript-placeholders as `%wcmmo_<name>%`, never read straight from `variables.csv`.

## 4. Install order on the dev server

1. Libraries/bridges: ProtocolLib, PacketEvents, PlaceholderAPI, Vault, LuckPerms.
2. RPG core: MythicLib → MMOCore → MMOItems → MMOInventory.
3. Mythic: MythicMobs → ModelEngine → MythicCrucible (for the FPV test) → MythicHUD → MythicDungeons (if bought).
4. Nexo (pack owner, D-40). Set up the pack merge (T7) **before** adding cosmetics. MythicCrucible: skip unless needed.
5. Quests: quest engine → LuxDialogues.
6. Triton, UltimateUI, BotSentry.
6b. Skript → SkBee → skript-reflect → skript-placeholders (after PlaceholderAPI). Add `plugins/Skript/variables.csv*` to `.gitignore` first.
7. Later: CosmeticsCore, ItemSkins, BattlePass, LuxCollect. Parked: Guilds, Order.

After each step: boot, check `/plugins` is all green, stop, commit the generated configs (where they are tracked depends on D-38).

## 5. Still needed from you

- Version + licence holder for each `?` above (run `/version <plugin>` on the dev server).
- D-00 answered 2026-09-28: all owned except **MythicDungeons** (team to discuss, D-14). MMOInventory owned. MMOProfiles later.
- Quest engine to pair with LuxDialogues: team decides after plugin setup (D-15).
- Decisions D-39, D-40, D-41, D-42, D-15 in the table in section 2.
- Confirm 26.2 support for LuxCollect and CosmeticsCore before relying on them.
