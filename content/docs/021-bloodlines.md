# 021 — Bloodlines (Fury, Ward, Pulse: stages, paths, extraction)

> Status: DRAFT · Target: wcmmo (Skript scripts, MythicMobs effect skills, MMOItems items, MythicHUD) · FIRE mode: validate
> Design: [bloodlines.md](../gdd/bloodlines.md) · [GDD v2 §2](../gdd/wcmmo-gdd-v2.md#2-classless-system-bloodlines--runes) · Decisions: D-31, D-32, D-33, D-34, D-37, D-48

## Big picture

- **Player story:** As a player, I carry one Bloodline that defines how I play. It evolves at levels 20/40/60 and when Awakened, and at stages 2, 3 and 5 I choose one of two paths, so two players with the same Bloodline can play very differently. I can only change Bloodline with a rare extractor.
- **Base Bloodlines (D-31, D-48):** **Fury** (risk, Muscle), **Ward** (timing, Bone), **Pulse** (flow, Heart). Full design and numbers: [bloodlines.md](../gdd/bloodlines.md) §4–6.
- **Done means:** all three work through stage 5 with both paths; binding, stages, paths and extraction are stored per player; effects fire through MythicMobs skills; everything is fully playable solo.

## Systems & config

Skript-first (D-25, D-47). Heavy parts may move to our own plugin after the Phase 0 review.

| Repo | File | What |
|---|---|---|
| wcmmo | `plugins/Skript/scripts/wcmmo_bloodline_core.sk` | bind / unbind / stage / path data, triggers, placeholders |
| wcmmo | `plugins/Skript/scripts/wcmmo_bloodline_fury.sk`, `_ward.sk`, `_pulse.sk` | per-Bloodline mechanics |
| wcmmo | `plugins/Skript/scripts/wcmmo_bloodline_config.sk` | **every number** from bloodlines.md in one place |
| wcmmo | `plugins/MythicMobs/Skills/bloodlines/<id>.yml` | visual / sound effect skills per stage |
| wcmmo | MMOCore skills | the three stage-4 active skills (slottable, spec 007) |
| wcmmo | MMOItems | extractors, stage unlock materials |
| wcmmo | MythicHUD | Bloodline HUD elements (Fury low-HP glow, Ward Bulwark pips, Pulse rhythm beats) |
| wcmmo | UltimateUI + Citizens | Bloodline Keeper screen (paths, respec) |

(`wcmmo` holds content configs if the 3-repo layout is confirmed, D-38.)

## Rules

1. Exactly **1** Bloodline slot. First bind happens in **The Awakening** (spec 024): hidden affinity picks Fury / Ward / Pulse; one-time Reject → manual pick of the 3 base Bloodlines. After the tutorial, only an extractor changes it.
2. **Stages (D-34):** stage = highest stage whose level **and** unlock materials are met. Stage 1 on bind; 2 = Lv 20; 3 = Lv 40; 4 = Lv 60; 5 = Lv 60 + awakening quest.
3. **Paths:** stages 2, 3 and 5 each have path **A** or **B**, chosen when the stage unlocks. Stages 1 and 4 are fixed. Respec a path at the Bloodline Keeper for a fee (price: economy design).
4. **Extraction (D-33):**
   - `wcmmo_item_bloodline_extractor` (in-game: boss drop or very expensive NPC purchase): progress and paths **kept** per Bloodline.
   - `wcmmo_item_bloodline_extractor_store` (store/cash): progress of the removed Bloodline **resets** to stage 1.
   Early game: only the in-game variant.
5. **Solo first:** every effect works alone; ally effects are bonuses ≤ 50 % of the self value with a solo version (bloodlines.md §3.1).
6. **New Bloodlines** (story unlocks) follow bloodlines.md §7 and must pass the benchmark before release. The Awakening only offers the base three.

### Triggers provided by the core script

| Trigger | Fired when | Used by |
|---|---|---|
| `on_bind`, `on_unbind` | Bloodline changes | all |
| `on_hp_below:<pct>` / `on_hp_above:<pct>` | HP crosses a threshold | Fury |
| `on_damaged`, `on_kill` | player takes damage / kills | Fury |
| `on_fatal` | damage would kill; effect may cancel it | Fury 5A |
| `on_block`, `on_perfect_guard` | Frontguard blocks a hit / blocks within 0.3 s of raising guard (spec 009) | Ward |
| `on_skill_cast:<id>` | any skill cast (id + tags such as `charge`, `heavy`) | Fury 3A, Pulse rhythm |
| `active` | the stage-4 active skill is cast | all |

## Data & IDs

| ID | Kind |
|---|---|
| `wcmmo_bloodline_fury` | Bloodline: risk / Muscle |
| `wcmmo_bloodline_ward` | Bloodline: timing / Bone |
| `wcmmo_bloodline_pulse` | Bloodline: flow / Heart |
| `wcmmo_skill_blood_rage` | Fury stage-4 active |
| `wcmmo_skill_bone_bastion` | Ward stage-4 active |
| `wcmmo_skill_heartbeat_surge` | Pulse stage-4 active |
| `wcmmo_item_bloodline_extractor` | consumable, in-game, keeps progress |
| `wcmmo_item_bloodline_extractor_store` | consumable, store, resets progress |
| `wcmmo_item_bloodline_seal_<stage>` | stage unlock materials (names TBD, bloodlines.md B1) |
| `wcmmo_npc_bloodline_keeper` | NPC: path choice and respec |
| `%wcmmo_bloodline%`, `%wcmmo_bloodline_stage%`, `%wcmmo_bl_path_2%`, `%wcmmo_bl_path_3%`, `%wcmmo_bl_path_5%` | placeholders (read-only) |
| `%wcmmo_ward_bulwark%`, `%wcmmo_pulse_rhythm%`, `%wcmmo_pulse_bond%` | placeholders for the HUD |
| `wcmmo_v1_bloodline_player` | target DB: `player_uuid`, `active_bloodline`, `updated_at` |
| `wcmmo_v1_bloodline_progress` | target DB: `player_uuid`, `bloodline_id`, `stage`, `path_2`, `path_3`, `path_5`, `awakened` |

## Balance

All stage/path numbers: [bloodlines.md](../gdd/bloodlines.md) §4 (Fury), §5 (Ward), §6 (Pulse). They are copied into `wcmmo_bloodline_config.sk`, never hard-coded in the mechanic scripts.

Benchmark (bloodlines.md §7): same gear/weapon/runes → A: 20-mob clear (Fury leads), B: 3-min solo boss (Pulse leads), C: 90-s survival (Ward leads). Each leads only its own test; combined score within ±15 %.

## Commands & permissions

| Command | Permission | Behaviour |
|---|---|---|
| `/bloodline` | `wcmmo.bloodline.use` (default) | show Bloodline, stage, paths, next unlock |
| `/wcmmo bloodline set <player> <id> [stage] [paths]` | `wcmmo.admin.bloodline` | support / testing, e.g. `fury 5 A B A` |
| `/wcmmo bloodline bench <id>` | `wcmmo.admin.bloodline` | start the benchmark arena for a Bloodline |

## Performance

Pulse rhythm and Ward guard checks run on every cast / hit; HP thresholds only in damage/heal events, never per tick. Budget < 0.2 ms/tick at 200 players, measured with `/spark` in PoC-7.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Fury, drop below 30 % HP | attack speed +20 %, removed above 30 % |
| 2 | Fury 2A take a hit / 2B kill a mob | stamina restored / 5 % HP healed |
| 3 | Fury 3A charge skill while being stunned | no stun · 3B: 5 hits below 50 % HP → +10 % damage |
| 4 | Fury Blood Rage at 60 % HP | HP −25 % of current, all cooldowns reset · refused below 10 % HP |
| 5 | Fury 5A lethal hit twice within 300 s | first: 1 HP + 3 s I-frame · second: death · 5B below 15 % HP: +30 % damage, lifesteal |
| 6 | Ward block 5 hits | 5 Bulwark pips, −15 % damage taken; decays 1 per 4 s without blocking |
| 7 | Ward 2A perfect guard / 2B normal block | attacker staggered + 15 stamina + 2 stacks / 15 % reflected |
| 8 | Ward 3A / 3B at 5 stacks | 3 s CC immune, −30 % damage / next skill +50 % + Super Armour |
| 9 | Ward Bone Bastion solo vs 3 mobs | 30 % max HP absorbed, attackers slowed and take 20 % back |
| 10 | Ward 5A take a 50 % max-HP hit / 5B three perfect guards | damage halved, Bulwark 5 / automatic counter-strike |
| 11 | Pulse cast skills A, B, C | Pulse: heal 4 % + damage in 5 blocks · A, A, B resets rhythm |
| 12 | Pulse 2A overheal / 2B three Pulses | shield up to 10 % max HP / +15 % damage |
| 13 | Pulse 3A hit an enemy / 3B any Pulse | 12 % lifesteal on that enemy / second Pulse at 50 % after 1 s |
| 14 | Pulse Heartbeat Surge | 6 s: every skill Pulses |
| 15 | Pulse 5A with a debuff / 5B five different skills | debuff removed, shield cap 20 % / next skill free of cooldown |
| 16 | Respec path at the Bloodline Keeper | fee taken, path switched, stats update |
| 17 | In-game extractor, bind another, extract, re-bind the first | stage and paths restored · store extractor: back to stage 1 |
| 18 | Benchmark A/B/C for all three | each leads its own test, combined within ±15 % |

## Rollback

Bloodline data is player data: DB backup before any prod change; never rename Bloodline IDs once players have them.

## Acceptance criteria

- [x] D-31, D-48 decided (2026-09-30): Fury / Ward / Pulse.
- [ ] D-37 decided; PoC-7 PASS (hooks + `/spark` numbers).
- [ ] Tests 1–18 pass on the dev box.

## Open questions

- Stage unlock materials per Bloodline (bloodlines.md B1); path respec price (B2).
- The stage-4 active takes one of the 10 skill slots (recommended).
