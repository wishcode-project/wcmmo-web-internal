# 008 — Weapon types, weapon skills, ultimates & general skills

> Status: DRAFT · Target: wcmmo (MMOItems types, MMOCore skills → MythicMobs skills, Skript) · FIRE mode: confirm
> Design: [GDD v2 §3](../gdd/wcmmo-gdd-v2.md#3-weapon-freedom--compartmentalised-progression) · Decisions: D-04, D-04b, D-04c, D-06d, D-36, D-50, D-51, D-52, D-53

## Big picture

- **Player story:** As any player, I pick up any weapon I have the stats for. Each weapon has **5 skills + 1 ultimate**, unlocked through Mastery (spec 023). I also carry **general skills** that work with any weapon.
- **Done means:** weapon types exist and are stat-gated (006); weapon skills only cast with that weapon in hand (007); ultimates spend the Remnant gauge (025); every weapon is fully playable solo.

## Design rules

1. **Every weapon is solo-complete:** damage, a way in or out, and a survival tool.
2. **Guard break (D-06d):** every weapon has exactly **1** skill that breaks Frontguard (★). Hammer and Greatsword: **every heavy skill** breaks Frontguard **and** Super Armour; their basic hits drain guard stamina ×2.
3. **Bloodline fit:** every weapon has ≥ 3 distinct skills (Pulse rhythm); charge / heavy skills are tagged for Fury *Unstoppable*.
4. **Damage** is written as % of weapon damage, so enhancement (AP) scales it (compartments, GDD v2 §3).
5. **Unlocks by Mastery** (test build, D-36): skill 1 at 0, then 5, 10, 15, 20; **ultimate at 25**. Final values follow the final Mastery cap.
6. **Ultimates** (D-51): on **Q**, cost **100 Remnant**, Super Armour while casting, no other cooldown. Spec 025.

## Weapon types

**Bold** = vertical slice.

| Type ID | Family | Basic attack | Identity | Resource |
|---|---|---|---|---|
| **`WCMMO_SWORD`** | melee | left click | fast, combos, counters | Stamina |
| `WCMMO_GREATSWORD` | melee | left click | wide arcs, Super Armour on swings, breaks guard | Stamina |
| **`WCMMO_HAMMER`** | melee | left click | heavy, breaks guard + Super Armour | Stamina |
| `WCMMO_SPEAR` | melee | left click | longest reach, guard-counter stance (pairs with Ward) | Stamina |
| **`WCMMO_BOW`** | ranged | **right click, instant** (D-53) | long range, kiting | Stamina |
| `WCMMO_CROSSBOW` | ranged | **right click, instant** | burst bolts, shooting on the move | Stamina |
| **`WCMMO_STAFF`** | magic | left click (magic bolt) | big area spells | Mana |
| `WCMMO_TOME` | magic | left click (magic bolt) | fast casts, control, buffs / debuffs (pairs with Pulse) | Mana |

Greatsword, Spear, Crossbow and Tome get their full skill lists in Phase 2.

## General skills (any weapon, D-52)

Lighter than weapon skills: movement, defence, utility. Dash and Backstep come from The Awakening; the rest from level-ups and city NPCs along the main quest (D-04c).

| # | ID | Name | Effect | Cost · cooldown |
|---|---|---|---|---|
| 1 | `wcmmo_skill_dash` | Dash | dash forward 4 blocks (no I-frame, D-49) | 25 st · 3 s |
| 2 | `wcmmo_skill_backstep` | Backstep | hop back 4 blocks | 15 st · 4 s |
| 3 | `wcmmo_skill_sidestep` | Sidestep | hop sideways in the direction you're moving | 15 st · 4 s |
| 4 | `wcmmo_skill_kick` | Kick | front kick 60 %, knockback 3 blocks, interrupts | 15 st · 8 s |
| 5 | `wcmmo_skill_shoulder_charge` | Shoulder Charge *(charge)* | charge 5 blocks with Super Armour, knocks down small enemies | 25 st · 12 s |
| 6 | `wcmmo_skill_leap` | Leap | high forward jump over obstacles | 20 st · 12 s |
| 7 | `wcmmo_skill_second_wind` | Second Wind | restore 30 stamina over 3 s | — · 30 s |
| 8 | `wcmmo_skill_battle_cry` | Battle Cry | +10 % damage for 8 s | 15 st · 40 s |
| 9 | `wcmmo_skill_iron_skin` | Iron Skin | −20 % damage taken for 5 s, can't sprint | 20 st · 30 s |
| 10 | `wcmmo_skill_focus` | Focus | cleanse 1 debuff + heal 5 % max HP | 10 mana · 35 s |

## Weapon skills (vertical slice)

★ = guard break · *(heavy)* / *(charge)* = tags for Fury *Unstoppable* and armour break.

### Sword: fast, combos, counters (stamina)

| Mastery | ID | Name | Effect | Numbers |
|---|---|---|---|---|
| 0 | `wcmmo_skill_blade_flurry` | Blade Flurry | 3 quick slashes in front | 3 × 60 % · CD 6 s · 15 st |
| 5 | `wcmmo_skill_piercing_thrust` | Piercing Thrust ★ *(charge)* | lunge 4 blocks, pierces guard | 200 % · CD 10 s · 20 st |
| 10 | `wcmmo_skill_rising_slash` | Rising Slash | upward slash, knocks enemies up | 170 % · CD 9 s · 15 st |
| 15 | `wcmmo_skill_riposte` | Riposte | 1 s stance: a frontal hit triggers an automatic counter + stagger | 250 % · CD 12 s · 15 st |
| 20 | `wcmmo_skill_thousand_cuts` | Thousand Cuts | 1.5 s flurry with Super Armour | 8 × 45 % · CD 22 s · 35 st |
| **25** | `wcmmo_ult_blade_storm` | **Blade Storm** (ultimate) | spinning storm of blades, radius 4, 3 s, Super Armour | 12 × 60 % · 100 Remnant |

### Hammer: heavy, breaks everything (stamina)

| Mastery | ID | Name | Effect | Numbers |
|---|---|---|---|---|
| 0 | `wcmmo_skill_ground_smash` | Ground Smash *(heavy)* | slam, radius 3, small knock-up | 220 % · CD 8 s · 20 st |
| 5 | `wcmmo_skill_wide_swing` | Wide Swing *(heavy)* | 180° sweep, knockback | 170 % · CD 7 s · 15 st |
| 10 | `wcmmo_skill_quake` | Quake *(heavy)* | shockwave line 6 blocks, slow 40 % 3 s | 180 % · CD 12 s · 25 st |
| 15 | `wcmmo_skill_unmovable` | Unmovable | 3 s Super Armour + −20 % damage taken | — · CD 20 s · 20 st |
| 20 | `wcmmo_skill_titan_fall` | Titan Fall *(heavy, charge)* | leap up to 6 blocks, crash radius 4, stun 1 s, Super Armour in the air | 400 % · CD 25 s · 35 st |
| **25** | `wcmmo_ult_earthbreaker` | **Earthbreaker** (ultimate) *(heavy)* | giant slam, radius 7, knock-up + stun 1.5 s | 700 % · 100 Remnant |

### Bow: instant shots, kiting (stamina)

| Mastery | ID | Name | Effect | Numbers |
|---|---|---|---|---|
| 0 | `wcmmo_skill_rapid_volley` | Rapid Volley | 3 fast arrows | 3 × 55 % · CD 6 s · 15 st |
| 5 | `wcmmo_skill_tumble_shot` | Tumble Shot | backflip 4 blocks while shooting | 150 % · CD 9 s · 20 st |
| 10 | `wcmmo_skill_arrow_rain` | Arrow Rain | rain of arrows on the aimed spot, radius 4, 3 s | 6 × 40 % · CD 14 s · 25 st |
| 15 | `wcmmo_skill_snare_arrow` | Snare Arrow | roots the target 1.5 s | 120 % · CD 12 s · 15 st |
| 20 | `wcmmo_skill_piercing_gale` | Piercing Gale ★ | wind arrow line 20 blocks, pushes enemies back | 300 % · CD 20 s · 30 st |
| **25** | `wcmmo_ult_heavens_barrage` | **Heaven's Barrage** (ultimate) | storm of arrows, radius 6, 4 s | 12 × 60 % · 100 Remnant |

### Staff: big area magic (mana)

| Mastery | ID | Name | Effect | Numbers |
|---|---|---|---|---|
| 0 | `wcmmo_skill_fireball` | Fireball | fireball + burn 3 s | 200 % + 20 %/s · CD 5 s · 20 mana |
| 5 | `wcmmo_skill_frost_nova` | Frost Nova | ice ring around you, radius 4, roots 1.5 s (solo escape tool) | 150 % · CD 14 s · 35 mana |
| 10 | `wcmmo_skill_chain_lightning` | Chain Lightning | bounces between 4 targets | 4 × 120 % · CD 10 s · 30 mana |
| 15 | `wcmmo_skill_blink` | Blink | teleport 6 blocks forward | — · CD 10 s · 25 mana |
| 20 | `wcmmo_skill_meteor` | Meteor ★ | 1.5 s cast (Super Armour), meteor radius 4 + burn | 450 % · CD 25 s · 60 mana |
| **25** | `wcmmo_ult_cataclysm` | **Cataclysm** (ultimate) | meteors across radius 8 for 4 s + burn | 10 × 90 % · 100 Remnant |

## Balance

- Target: similar damage per 30 s across weapons; Sword steady, Hammer bursts + breaks, Bow safest, Staff widest but mana-limited. Checked with the same 3-test benchmark as Bloodlines (gdd/bloodlines.md §7) per weapon.
- Example 10-slot loadout: Sword 5 + Dash + Backstep + Kick + Battle Cry + Bloodline active; ultimate on Q.
- All numbers go into the kit config (`wcmmo_00_config.sk`) or the MythicMobs skill files, never hard-coded twice.

## Commands & permissions

n/a (MMOCore skill GUI `/skills`).

## Performance

Max 1 projectile entity per cast; area hits via MythicMobs targeters, not per-tick scans. Arrow Rain / Heaven's Barrage / Cataclysm cap their projectile count.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Any player with STR 15 equips a Low Hammer | works (no class check) |
| 2 | Hammer Mastery 5 → Wide Swing unlocks | appears in `/skills` |
| 3 | Cast Ground Smash holding a Sword | "Requires Hammer" |
| 4 | Staff skill without Mana | "Not enough Mana" |
| 5 | Each weapon's ★ skill on a guarding Shieldbearer | guard broken |
| 6 | Hammer heavy skills on the Brute with Super Armour | CC lands (armour break) |
| 7 | Bow right click spam | instant shots at the interval, AGI shortens it to the cap |
| 8 | Each ultimate at 100 Remnant | fires, Super Armour while casting, gauge to 0 |
| 9 | Solo benchmark per weapon | within ±15 % of each other |

## Rollback

Revert content. Weapon type and skill IDs must never change once players have them.

## Acceptance criteria

- [x] D-04, D-06d, D-52 decided.
- [ ] Skills built as MMOCore skills → MythicMobs skills; tests 1–9 pass.
