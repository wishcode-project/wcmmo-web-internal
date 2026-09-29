# 021 — Bloodlines (main identity, stages, extraction)

> Status: DRAFT · Target: wcmmo-plugins (`bloodline` module), wcmmo-content (MythicMobs effect skills, MMOItems extraction item) · FIRE mode: validate
> Design: [GDD v2 §2](../gdd/wcmmo-gdd-v2.md#2-classless-system-bloodlines--runes) · Decisions: D-31, D-32, D-33, D-34, D-37

## Big picture

- **Player story:** As a player, I carry one Bloodline that defines how I play. It evolves at levels 20/40/60 and when Awakened, changing mechanics rather than piling on stats. I can only change it with a rare extraction item.
- **Done means:** Berserker works through stage 5; binding, stage progression and extraction are stored per player; effects fire through MythicMobs skills.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo-plugins | `bloodline` module | bind / unbind / stage data, emits trigger events |
| wcmmo-plugins | `bloodline` → MythicMobs bridge | on trigger, cast the stage's MythicMobs skill on the player |
| wcmmo-content | `MythicMobs/Skills/bloodlines/<id>.yml` | effect skills per stage |
| wcmmo-content | MMOItems | extraction item, awakening item/quest reward |

## Rules

1. Exactly **1** Bloodline slot. First bind happens in **The Awakening** tutorial (spec 024, D-32): chosen by hidden affinity, one-time Reject → manual pick of the 3 base Bloodlines. After the tutorial, only the extractor can change it.
2. Stage = highest stage whose requirement is met (D-34). Stages never go down with level (levels don't go down).
3. **Extraction (D-33):** two variants.
   - `wcmmo_item_bloodline_extractor` (in-game: boss drop or very expensive NPC purchase): progress **kept** per Bloodline, so re-binding later restores its stage.
   - `wcmmo_item_bloodline_extractor_store` (store/cash): progress of the removed Bloodline **resets** to stage 1.
   Early game: only the in-game variant.
4. **Stage unlock (D-34):** reaching the level is not enough; each stage also needs unlock materials from dungeons or lifeskills.
4. Triggers the plugin provides to MythicMobs effects:

| Trigger | Fired when |
|---|---|
| `on_bind`, `on_unbind` | Bloodline changes |
| `on_hp_below:<pct>` / `on_hp_above:<pct>` | HP crosses a threshold |
| `on_damaged` | player takes damage |
| `on_skill_cast:<tag>` | a skill with a tag (e.g. `charge`) is cast |
| `on_fatal` | damage would kill; effect may cancel it |
| `active` | Bloodline active skill cast from a slot |

## Data & IDs

| ID | Kind |
|---|---|
| `wcmmo_bloodline_berserker` | Bloodline (vertical slice) |
| 3 more launch Bloodlines | D-31, IDs registered when designed |
| `wcmmo_item_bloodline_extractor` | consumable, in-game, keeps progress |
| `wcmmo_item_bloodline_extractor_store` | consumable, store, resets progress |
| `wcmmo_item_bloodline_seal_<stage>` | stage unlock materials (names TBD) |
| `wcmmo_skill_blood_rage` | Berserker stage-4 active skill (slottable) |
| `wcmmo_v1_bloodline_player` | DB: `player_uuid`, `active_bloodline`, `updated_at` |
| `wcmmo_v1_bloodline_progress` | DB: `player_uuid`, `bloodline_id`, `stage`, `awakened` |

## Balance: Berserker (from GDD v2)

| Stage | Unlock | Name | Trigger | Effect (*proposed* numbers) |
|---|---|---|---|---|
| 1 | bind | Adrenaline | `on_hp_below:30` | +20 % attack speed while HP < 30 % |
| 2 | Lv. 20 | Pain is Power | `on_damaged` | restore Stamina = 10 % of damage taken (max 15 / hit) |
| 3 | Lv. 40 | Unstoppable | `on_skill_cast:charge` | Super Armour for the skill's duration |
| 4 | Lv. 60 | Blood Rage | `active` | pay 25 % current HP → reset all cooldowns; 90 s cooldown |
| 5 | Awakened (D-34) | Death Defying | `on_fatal` | survive at 1 HP + 3 s I-frame; 300 s internal cooldown |

## Commands & permissions

| Command | Permission | Behaviour |
|---|---|---|
| `/bloodline` | `wcmmo.bloodline.use` (default) | show Bloodline, stage, next unlock |
| `/wcmmo bloodline set <player> <id> [stage]` | `wcmmo.admin.bloodline` | support/testing |

## Performance

HP-threshold checks run only in damage/heal events, not every tick. Budget < 0.2 ms/tick at 200 players.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Bind Berserker at Lv. 1, drop below 30 % HP | attack speed +20 %, removed above 30 % |
| 2 | Level to 20, take a hit | stamina restored |
| 3 | Lv. 40, cast a `charge` skill, get stunned mid-charge | no stun |
| 4 | Lv. 60, cast Blood Rage | HP −25 %, cooldowns reset |
| 5 | Awakened, take lethal hit twice within 300 s | first: survive at 1 HP + I-frame; second: die |
| 6 | Use extractor, bind another, use extractor, re-bind Berserker | Berserker back at its old stage |

## Rollback

Bloodline data is player data: DB backup before any prod change; never rename Bloodline IDs.

## Acceptance criteria

- [ ] D-31–D-34, D-37 decided; PoC for D-37 PASS.

## Open questions

- Is the Bloodline active skill (stage 4) taking one of the 10 skill slots? Recommend yes.
