# WC-MMO specs — conventions and registries

Every spec follows `../CLAUDE.md`. This file holds the things specs share: registries of IDs,
plugins, permissions, commands, worlds and regions. **Register an ID here in the same commit
as the spec that introduces it.** Specs link back here instead of redefining anything.

## Spec index

| # | Spec | Status | Target | Mode |
|---|---|---|---|---|
| 000 | [Template](000-template.md) | — | — | — |
| 001 | [Server baseline](001-server-baseline.md) | DONE | wcmmo | validate |
| 002 | [Base plugin stack](002-plugin-stack.md) | DONE | wcmmo | validate |
| 003 | [Void overworld](003-void-overworld.md) | DONE | wcmmo | confirm |
| 004 | [Roadmap & Phase 0 PoCs](004-roadmap-phase-plan.md) | DRAFT | all | confirm |
| 005 | [Vitality: HP, Mana, Stamina, food](005-vitality-resources.md) | DRAFT | content, plugins | validate |
| 006 | [Stats as the gear gateway](006-attributes-stat-gating.md) | DRAFT | content | validate |
| 007 | [Skill slots & bar swap (classless)](007-classes-skill-bars.md) | DRAFT | content, plugins | validate |
| 008 | [Weapon types & unique weapon skills](008-weapon-types-exclusive-skills.md) | DRAFT | content | confirm |
| 009 | [Combat states: Frontguard, I-frame, Super Armour](009-combat-states.md) | DRAFT | plugins, content | validate |
| 010 | [First-person animation PoC](010-fpv-animation-poc.md) | DRAFT | content, plugins | validate |
| 011 | [Equipment & accessory slots](011-equipment-accessories.md) | DRAFT | content, wcmmo | confirm |
| 012 | [Item generation, Identify & elements](012-item-generation-identify-elements.md) | DRAFT | content | validate |
| 013 | [Enhancement](013-enhancement.md) | DRAFT | content, plugins | validate |
| 014 | [Zones & AP/DP soft cap](014-zones-ap-dp-soft-cap.md) | DRAFT | wcmmo, plugins, content | validate |
| 015 | [Monster tiers & farming](015-monster-tiers-farming.md) | DRAFT | content, plugins, wcmmo | confirm |
| 016 | [Quest & story framework](016-quest-story-framework.md) | DRAFT | content | confirm |
| 017 | [World bosses & dungeons](017-bosses-dungeons.md) | DRAFT | content, plugins | validate |
| 018 | [Lifezone instances & housing](018-lifezone-housing.md) | DRAFT | plugins, wcmmo, infra | validate |
| 019 | [Lifeskills & resource tiers](019-lifeskills-resources.md) | DRAFT | content | confirm |
| 020 | [Furniture (Nexo) & lifeskill NPCs](020-furniture-nexo.md) | DRAFT | content | confirm |
| 021 | [Bloodlines](021-bloodlines.md) | DRAFT | plugins, content | validate |
| 022 | [Passive Runes](022-runes.md) | DRAFT | content | validate |
| 023 | [Weapon Mastery](023-weapon-mastery.md) | DRAFT | content, wcmmo | validate |
| 024 | [The Awakening: tutorial & Bloodline Trial](024-awakening-tutorial.md) | DRAFT | plugins, content, wcmmo | validate |
| 025 | [Remnant gauge & ultimates](025-remnant-ultimates.md) | DRAFT | wcmmo | validate |
| 026 | [Item detail pages (F in the inventory)](026-item-inspect-pages.md) | DRAFT | wcmmo | confirm |
| 027 | [Death & respawn](027-death-respawn.md) | DRAFT | wcmmo | validate |
| 028 | [Levelling, party XP & loot](028-levelling-party-loot.md) | DRAFT | wcmmo | validate |
| 029 | [HUD layout](029-hud.md) | DRAFT | wcmmo | confirm |
| 030 | [Languages & translation](030-languages.md) | DRAFT | wcmmo | confirm |
| 031 | [Chat channels](031-chat-channels.md) | DRAFT | wcmmo | confirm |
| 032 | [NPCs, guards & name colours](032-npcs-name-colours.md) | DRAFT | wcmmo | confirm |
| 033 | [Monster ranks & combat rules](033-monster-ranks-combat.md) | DRAFT | wcmmo | confirm |
| 034 | [Wings](034-wings.md) | DRAFT | wcmmo | validate |
| 035 | [Training dummy (DPS meter)](035-training-dummy.md) | DRAFT | wcmmo | confirm |

Design intent lives in [`../gdd/wcmmo-gdd-v2.md`](../gdd/wcmmo-gdd-v2.md) (v1 is superseded); decisions `D-xx` are tracked there.
Coming soon (GDD v2 §10–12, not specced): economy & trade, guild & node war, pets & mounts.

## ADR index

| # | Decision | Status |
|---|---|---|
| 0001 | [Purpur on Java 25 with Generational ZGC](adr/0001-purpur-java25-zgc.md) | Accepted |
| 0002 | [Specs repo + FIRE per implementation repo](adr/0002-spec-first-workflow.md) | Accepted |

## Environments

| Env | Branch | Machine | Heap | Script |
|---|---|---|---|---|
| dev | `develop` | local Windows box | 8G | `wcmmo/scripts/start-dev.bat` (debug port 5005) |
| prod | `main` | Linux VPS, 32 GB RAM | 20G proposed (script default 16G) | `wcmmo/scripts/start-prod.sh` |

Production only changes through a PR `develop` → `main`. Release checklist: `wcmmo/docs/DEPLOY.md`.

## Plugin registry

Versions are the ones running on the dev box (checked by a boot on Purpur 26.2 build 2633, 2026-10-01). Update the row in the same commit as a version bump.
Full per-plugin guide (docs, dependencies, setup, overlaps): [plugins.md](plugins.md).

| Plugin | Version | Licence | Config owner | Purpose | Spec |
|---|---|---|---|---|---|
| Purpur (server) | 26.2 build 2633 | free | wcmmo | server software | 001 |
| CMI + CMILib | 9.8.10.2 + 1.6.0.1 | paid | wcmmo | essentials: homes, warps, kits, chat, tab, RTP, economy provider | 002 |
| Vault | 2.1.1 | free | wcmmo | economy/permission API bridge | 002 |
| WorldGuard | 7.0.19 | free | wcmmo | regions and flags | 002 |
| FastAsyncWorldEdit | 2.15.4 | free | wcmmo | building, schematics | 002 |
| Multiverse-Core | 5.8.1 | free | wcmmo | world management | 002 |
| Citizens | 2.0.44 b4256 | paid | wcmmo | NPCs | 002 |
| spark | built into Purpur | free | wcmmo (data ignored) | profiler, `/spark health` | 002 |
| LuckPerms | 5.5.85 | free | wcmmo | permissions (DB in `.env`) | — |
| Nexo | 1.29-dev | paid | wcmmo | custom items, blocks, furniture, resource pack | — |
| MythicMobs + MythicLib | 5.13.0 + 1.7.1-SNAPSHOT | paid | wcmmo | custom mobs, skills | — |
| MMOCore / MMOItems / MMOProfiles | 1.13.1 / 6.10.1 (SNAPSHOTs) / not installed | paid | wcmmo | classes, levels, RPG items, profiles | — |
| ModelEngine | R4.1.1 | paid | wcmmo | custom mob models | — |
| DiscordSRV | — owned | free | wcmmo | chat bridge (token in `.env`) | — |
| MMOInventory | 2.0-SNAPSHOT | paid | wcmmo | accessory + Rune slots | 011, 022 |
| PlaceholderAPI | 2.12.3 | free | wcmmo | placeholders for Mastery math in MythicMobs | 023 |
| Triton | 4.1.0 | paid | wcmmo | per-player translations (D-27) | — |
| UltimateUI | 1.4.0 | paid | wcmmo | shops, quest list, custom UI (D-39) | — |
| MythicHUD | 1.3.5 | paid | wcmmo | always-on HUD (D-39) | 005, 007 |
| MythicCrucible | 5.13.0 | paid | wcmmo | FPV weapon item triggers for the test (D-44); not the pack owner | 010 |
| CosmeticsCore | 1.3.13 ⚠️ licence log | paid | wcmmo | wearable cosmetics (D-41) | — |
| ItemSkins | 2.1.0 owned | paid | wcmmo | weapon skins (D-41), needs PacketEvents | — |
| LuxDialogues | 4.1.3 | paid | wcmmo | NPC dialogue (D-15) | 016 |
| LuxCollect | — owned | paid | wcmmo | collectables (D-42) | — |
| BattlePass | 5.0.12 owned | paid | wcmmo | seasonal quests (D-42) | — |
| Guilds | 3.5.7.2 owned, parked | paid | wcmmo | guilds (GDD §11) | — |
| Order | 2.6.9 owned, parked | paid | wcmmo | buy orders (GDD §10) | — |
| BotSentry | 9.9.1-THANATOS owned | paid | wcmmo | anti-bot / anti-VPN | — |
| PacketEvents | 2.14.0 | free | wcmmo | library (ItemSkins) | — |
| ProtocolLib | 5.5.0-SNAPSHOT | free | wcmmo | packet library (dependency for several plugins) | — |
| Skript + SkBee + skript-reflect + skript-placeholders | 2.16.2 + 3.26.0 + 2.6.3 + 1.7.2 | free | wcmmo | custom scripting: prototypes, tutorial/quest glue, admin tools, and for now the custom mechanics too (D-25, D-47) | 024 |
| BetonQuest | — proposed (D-15) | free | wcmmo | quests, dialogue | 016 |
| MythicDungeons | — **to buy** (D-14, not owned) | paid | wcmmo | instanced bosses/dungeons | 016, 017 |
| wcmmo-core (ours) | — **deferred** (D-25): per-system review after Phase 0 | own | wcmmo-plugins | vitality, skillbar, combat, bloodline, enhance, zones, totem, loot, lifezone modules | 005, 007, 009, 013–015, 017, 018, 021 |
| Velocity | — maybe (D-19) | free | wcmmo | proxy for multi-server Lifezones | 018 |

Plugin jars (paid included) are committed only in the private `wcmmo` repo under `plugins/*.jar` (owner, 2026-10-01), so every clone runs the same set. Never in a public repo.

## ID namespaces

| Kind | Pattern | Example | Registered in |
|---|---|---|---|
| Item | `wcmmo_item_<name>` | `wcmmo_item_iron_longsword` | [Items](#items) |
| Mob / boss | `wcmmo_mob_<name>` | `wcmmo_mob_forest_wolf` | [Mobs](#mobs-bosses--dungeons) |
| Dungeon | `wcmmo_dungeon_<solo/party>_<nn>` | `wcmmo_dungeon_solo_01` | [Mobs](#mobs-bosses--dungeons) |
| Weapon / item type | `WCMMO_<TYPE>` | `WCMMO_SWORD` | [Types](#weapon--item-types) |
| DB table | `wcmmo_v1_<area>_<name>` | `wcmmo_v1_lifezone_house` | [Database tables](#database-tables) |
| Skill | `wcmmo_skill_<name>` | `wcmmo_skill_dash` | [Skills](#skills) |
| Bloodline | `wcmmo_bloodline_<name>` | `wcmmo_bloodline_fury` | [Bloodlines & Runes](#bloodlines--runes) |
| Rune | `wcmmo_rune_<name>` | `wcmmo_rune_vitality` | [Bloodlines & Runes](#bloodlines--runes) |
| Furniture / block | `wcmmo_furn_<name>` / `wcmmo_block_<name>` | `wcmmo_furn_tavern_table` | Items |
| NPC | `wcmmo_npc_<name>` | `wcmmo_npc_blacksmith` | [NPCs](#npcs) |
| Permission (ours) | `wcmmo.<area>.<action>` | `wcmmo.warp.market` | [Permissions](#permissions) |
| Region | `<world>__<area>` | `wcmmo__spawn` | [Regions](#regions) |

MMOItems forces uppercase IDs: use `WCMMO_<TYPE>_<NAME>` there and keep the lowercase form here.

### Attributes & resources

| ID | Kind | Plugin | Spec |
|---|---|---|---|
| `str`, `dex`, `int`, `def`, `agi` | attribute | MMOCore | 006 |
| `mana`, `stamina` | resource | MMOCore | 005 |
| `wcmmo_cdgroup_meal`, `wcmmo_cdgroup_potion` | cooldown group | MMOItems | 005 |

### Bloodlines & Runes

No classes (GDD v2). Identity = 1 Bloodline + 2–4 Runes.

| ID | Kind | Spec | Notes |
|---|---|---|---|
| `wcmmo_bloodline_fury` | Bloodline | 021 | risk · Muscle ([bloodlines.md](../gdd/bloodlines.md) §4) |
| `wcmmo_bloodline_ward` | Bloodline | 021 | timing · Bone (§5) |
| `wcmmo_bloodline_pulse` | Bloodline | 021 | flow · Heart (§6) |
| `pulse`, `ward`, `fury` | tutorial affinities, placeholders `%wcmmo_affinity_<name>%` | 024 | |
| `wcmmo_rune_vitality`, `_stoneskin`, `_steadfast`, `_warding`, `_edge`, `_arcana`, `_fletch`, `_precision`, `_ruin`, `_haste`, `_tempo`, `_slayer`, `_leech`, `_breath`, `_clarity`, `_echo`, `_swiftness` | Rune (tiers I–III) | 022 | 17 runes (D-56) |

### Weapon & item types

| Type ID | Family / slot | Spec |
|---|---|---|
| `WCMMO_SWORD`, `WCMMO_GREATSWORD`, `WCMMO_HAMMER`, `WCMMO_SPEAR` | melee weapon | 008 |
| `WCMMO_BOW`, `WCMMO_CROSSBOW` | ranged weapon | 008 |
| `WCMMO_STAFF`, `WCMMO_TOME` | magic weapon | 008 |
| `WCMMO_NECKLACE`, `WCMMO_EARRING`, `WCMMO_RING`, `WCMMO_BELT` | accessory | 011 |
| `WCMMO_RUNE` | rune | 022 |
| `WCMMO_WINGS` | wings slot | 034 |

Rarity tiers (MMOItems): `common`, `uncommon`, `rare`, `epic`, `legendary` (012).

### Skills

| ID | Kind | Weapon / source | Spec |
|---|---|---|---|
| `wcmmo_skill_dash`, `_backstep`, `_sidestep`, `_kick`, `_shoulder_charge`, `_leap`, `_second_wind`, `_battle_cry`, `_iron_skin`, `_focus` | general (10) | any weapon | 008 |
| `wcmmo_skill_blade_flurry`, `_piercing_thrust`, `_rising_slash`, `_riposte`, `_thousand_cuts` | weapon | Sword (Mastery 0/5/10/15/20) | 008, 023 |
| `wcmmo_skill_ground_smash`, `_wide_swing`, `_quake`, `_unmovable`, `_titan_fall` | weapon | Hammer | 008, 023 |
| `wcmmo_skill_rapid_volley`, `_tumble_shot`, `_arrow_rain`, `_snare_arrow`, `_piercing_gale` | weapon | Bow | 008, 023 |
| `wcmmo_skill_fireball`, `_frost_nova`, `_chain_lightning`, `_blink`, `_meteor` | weapon | Staff | 008, 023 |
| `wcmmo_ult_blade_storm`, `wcmmo_ult_earthbreaker`, `wcmmo_ult_heavens_barrage`, `wcmmo_ult_cataclysm` | ultimate (Q, 100 Remnant) | Sword / Hammer / Bow / Staff (Mastery 25) | 008, 025 |
| `wcmmo_skill_gale_lance`, `_earthsplitter` | orb (melee family) | Sword / Greatsword / Hammer / Spear | 008 |
| `wcmmo_skill_whirl_cut` | orb (Sword only) | Sword | 008 |
| `wcmmo_skill_wraith_swarm`, `_hellburst`, `_ring_of_embers` | orb (magic family) | Staff / Tome | 008 |
| `wcmmo_skill_fanfire` | orb (ranged family) | Bow / Crossbow | 008 |
| `wcmmo_skill_blood_rage`, `wcmmo_skill_bone_bastion`, `wcmmo_skill_heartbeat_surge` | Bloodline active | Fury / Ward / Pulse stage 4 | 021 |

Combat state keys (skill metadata): `wcmmo:iframe`, `wcmmo:frontguard`, `wcmmo:superarmour`, `wcmmo:armourbreak` (009).

### Items

| ID | Plugin | Spec | Notes |
|---|---|---|---|
| `wcmmo_item_respec_scroll` | MMOItems | 006 | |
| `wcmmo_item_orb_<skill>` | MMOItems | 008 | Skill Orb: teaches an orb skill (NPC shop or monster drop) |
| `wcmmo_item_bloodline_extractor` | MMOItems | 021 | removes Bloodline, progress kept |
| `wcmmo_item_bloodline_extractor_store` | MMOItems | 021 | store version, resets progress to stage 1 |
| `wcmmo_item_bloodline_seal_<stage>` | MMOItems | 021 | stage unlock materials (names TBD) |
| `wcmmo_item_tutorial_blade`, `wcmmo_item_tutorial_scroll` | MMOItems | 024 | tutorial kit |
| `wcmmo_item_identify_scroll` | MMOItems | 012 | |
| `wcmmo_item_stone_weapon`, `_armour`, `_accessory` | MMOItems | 013 | enhancement materials |
| `wcmmo_item_totem_low`, `_mid`, `_high` | MMOItems | 015 | stationary farming cost |
| `wcmmo_item_wings_1`, `_2`, `_3` | MMOItems | 034 | Wings I–III |
| `wcmmo_cos_wings_feather`, `_fury`, `_ward`, `_pulse` | CosmeticsCore or ModelEngine | 034 | wing looks (feather = no Bloodline) |
| `wcmmo_furn_starter_bed`, `_table`, `_chair`, `_lamp` | Nexo | 020 | |

### Mobs, bosses & dungeons

| ID | Plugin | Spec | Notes |
|---|---|---|---|
| `wcmmo_mob_<zone>_<name>` | MythicMobs | 015 | pattern; concrete mobs per zone spec |
| `wcmmo_mob_boss_world_01` | MythicMobs | 017 | |
| `wcmmo_mob_guard_gate`, `wcmmo_mob_guard_patrol` | MythicMobs (faction `guards`, tag `wcmmo_guard`) | 032 | blue guards |
| tags `wcmmo_boss`, `wcmmo_frontguard`; state `stunphase` | Skript / MythicMobs | 033 | boss CC immunity, Guard Elites, boss stun phase |
| `wcmmo_mob_dummy` | MythicMobs (tag `wcmmo_dummy`) | 035 | training dummy, admin-placed |
| `wcmmo_mob_tutorial_raider`, `_wave`, `_brute` | MythicMobs | 024 | trial mobs |
| `wcmmo_mob_spirit_pulse`, `_ward`, `_fury` | MythicMobs + ModelEngine | 024 | Encounter / Reveal entities |
| `wcmmo_dungeon_solo_01`, `wcmmo_dungeon_party_01` | MythicDungeons | 017 | |

### Professions

| ID | Plugin | Spec |
|---|---|---|
| `mining`, `gathering`, `fishing`, `cooking`, `alchemy` | MMOCore (lifeskills) | 019 |
| `mastery_sword`, `_greatsword`, `_hammer`, `_spear`, `_bow`, `_crossbow`, `_staff`, `_tome` | MMOCore (Weapon Mastery) | 023 |

### NPCs

| ID | Citizens id | Location | Spec |
|---|---|---|---|
| `wcmmo_npc_enhancer` | — | city hub | 013 |
| `wcmmo_npc_bloodline_keeper` | — | first city | 021 |
| `wcmmo_npc_orb_merchant` | — | first city | 008 |
| `wcmmo_npc_blacksmith` | — | first city | 027 |
| `wcmmo_npc_tutorial_wounded`, `wcmmo_npc_tutorial_trapped` | — | tutorial | 024 |
| `wcmmo_npc_furniture_merchant` | — | city hub | 020 |

### Quests

| Package pattern | Spec |
|---|---|
| `wcmmo/ch<NN>/<quest>` (main), `wcmmo/side/<region>/<quest>` (side) | 016 |

## Permission groups

Target LuckPerms layout (not live yet — CMI ranks are placeholders until LuckPerms lands).

| Group | Inherits | Who |
|---|---|---|
| `default` | — | every player |
| `vip` | `default` | supporters |
| `builder` | `default` | build team (FAWE, creative worlds) |
| `helper` | `default` | chat moderation |
| `mod` | `helper` | moderation |
| `admin` | `mod`, `builder` | server owners |

### Permissions

| Node | Group(s) | Spec | Notes |
|---|---|---|---|
| `wcmmo.player.apdp` | default | 014 | `/apdp` |
| `wcmmo.lifezone.use` | default | 018 | `/lifezone` |
| `wcmmo.lifezone.bypass` | mod | 018 | enter full zone without a plot |
| `wcmmo.admin.skillbar` | admin | 007 | |
| `wcmmo.admin.combat` | admin | 009 | |
| `wcmmo.admin.enhance` | admin | 013 | |
| `wcmmo.admin.totem` | admin | 015 | |
| `wcmmo.admin.quest` | mod | 016 | |
| `wcmmo.admin.boss` | admin | 017 | |
| `wcmmo.bloodline.use` | default | 021 | `/bloodline` |
| `wcmmo.admin.bloodline` | admin | 021 | |
| `wcmmo.admin.remnant` | admin | 025 | |
| `wcmmo.admin.waystone` | admin | 027 | |
| `wcmmo.chat.shout` | default | 031 | |
| `wcmmo.chat.spy` | mod | 031 | moderation view of private channels |
| `wcmmo.admin.awakening` | admin | 024 | reset / debug |
| `wcmmo.awakening.skip` | admin, testers | 024 | skip tutorial |
| `wcmmo.admin.lifezone` | admin | 018 | |
| `wcmmo.admin.dummy` | admin | 035 | place / remove / list dummies |
| `wcmmo.dummy.stats` | default | 035 | `/dummy stats` |

## Commands

Our own commands and any CMI alias we add. Stock plugin commands are not listed.

| Command | Permission | Plugin / alias file | Spec |
|---|---|---|---|
| `/apdp` | `wcmmo.player.apdp` | wcmmo-core | 014 |
| `/lifezone [list]` | `wcmmo.lifezone.use` | wcmmo-core | 018 |
| `/bloodline` | `wcmmo.bloodline.use` | wcmmo-core | 021 |
| `/runes` | MMOInventory default | MMOInventory | 022 |
| `/mastery` | MMOCore default | CMI alias → MMOCore professions | 023 |
| `/dummy spawn\|list\|tp\|remove\|info\|respawn\|stats` | `wcmmo.admin.dummy` (`stats`: `wcmmo.dummy.stats`) | Skript `wcmmo_80_dummy.sk` | 035 |
| `/wcmmo <module> …` | `wcmmo.admin.<module>` | wcmmo-core | 007, 009, 013, 015, 017, 018 |

## Worlds

| Level / dimension | Generator | Purpose | Spec |
|---|---|---|---|
| `wcmmo` → `minecraft:overworld` | vanilla flat, void preset | main hub / build world | 003 |
| `wcmmo` → `minecraft:the_nether` | vanilla | unused so far | 003 |
| `wcmmo` → `minecraft:the_end` | vanilla | unused so far | 003 |
| `wcmmo_lifezone_<n>` | template copy | Lifezone instance, 20 plots | 018 |
| `wcmmo_tutorial` | template copy per player | The Awakening tutorial instance | 024 |

Minecraft 26.x keeps every dimension inside the level folder (`wcmmo/dimensions/<namespace>/<key>/`).

## Regions

| Region | World | Flags (non-default) | Spec |
|---|---|---|---|
| `wcmmo__zone_<tier>_<nn>` | wcmmo | `wcmmo-zone` (tier, AP, DP) | 014 |
| `wcmmo__totem_<zone>_<n>` | wcmmo | totem spot | 015 |
| `wcmmo__safe_<name>` | wcmmo | safe zone (city / village): `pvp deny`, wings folded | 034 |
| `wcmmo_lifezone_<n>__plot_<01-20>` | lifezone | owner-only build | 018 |
| `wcmmo_tutorial__trial_action`, `__hold_ring`, `__trial_gate`, `__fear_path`, `__sanctum` | tutorial | trial triggers | 024 |

## Database tables

Pattern `wcmmo_v1_<area>_<name>` (singular, snake_case). Owner module in brackets.

| Table | Owner | Spec |
|---|---|---|
| `wcmmo_v1_lifezone_house` | wcmmo-core `lifezone` | 018 |
| `wcmmo_v1_bloodline_player`, `wcmmo_v1_bloodline_progress` | wcmmo-core `bloodline` | 021 |
| `wcmmo_v1_awakening_state`, `wcmmo_v1_awakening_log` | wcmmo-core `awakening` | 024 |

## Shared conventions

- **Config diffs in specs** use YAML with the full key path as a comment:
  ```yaml
  # config/paper-world-defaults.yml
  entities:
    spawning:
      monster-spawn-max-light-level: 0   # was: -1
  ```
- **Test plans** use console/RCON commands that can be pasted as-is, and state the expected output.
- **Perf evidence**: attach the `/spark profiler` or `/spark health` link to the FIRE test report, not the spec.
- **Colours / text**: MiniMessage format (`<gold>`, `<gradient:…>`) for all player-facing text unless a plugin only supports `&` codes.
