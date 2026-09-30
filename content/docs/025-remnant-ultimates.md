# 025 — Remnant gauge & ultimates

> Status: DRAFT · Target: wcmmo (Skript, MythicMobs ultimate skills, MythicHUD) · FIRE mode: validate
> Design: [GDD v2 §3](../gdd/wcmmo-gdd-v2.md#3-weapon-freedom--compartmentalised-progression) · [lore bible](../gdd/lore-bible.md) · Decisions: D-51

## Big picture

- **Player story:** As I fight, a gauge called **Remnant** fills. At 100 I press **Q** and unleash my weapon's ultimate. (Like Black Desert's Black Spirit rage, but it powers an ultimate skill, similar to a Wynncraft signature spell.)
- **Lore (team only, see lore bible §2):** the Remnant is the power of the player's **past self's soul fragments** leaking out in battle. Players use it long before they learn what it is. Public text only ever calls it "Remnant".
- **Done means:** the gauge fills and shows on the HUD; Q fires the held weapon's ultimate at 100; every slice weapon has one.

## Rules

1. One gauge per player, **0–100**, shared across weapons.
2. Fill:

| Source | Gain | Limit |
|---|---|---|
| basic attack hits a mob | +1 | max 2 per second |
| a skill hits at least one target | +3 | once per cast |
| taking damage | +1 per 2 % max HP lost | — |
| hitting players (arenas) | half gain | — |

3. The gauge does **not** decay.
4. **Q** (drop key) in the world: if the held weapon's ultimate is unlocked (Mastery 25, test build) and the gauge is 100 → cast it, gauge to 0. Otherwise: "Remnant not full" / "Ultimate locked" on the action bar. Q never drops the held item in the world (drop items from the inventory screen instead).
5. Ultimates grant **Super Armour** while casting and have no cooldown other than the gauge.
6. Bloodline fit: Pulse counts an ultimate as a distinct skill; Fury counts it as heavy; Ward's Marrow Break can empower it.
7. Ultimates per weapon: spec 008 (Blade Storm, Earthbreaker, Heaven's Barrage, Cataclysm).

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | `plugins/Skript/scripts/wcmmo_35_remnant.sk` | gauge fill, Q handler, unlock check, placeholder |
| wcmmo | `plugins/MythicMobs/Skills/wcmmo/wcmmo_ultimates.yml` | the ultimate skills (effects + damage) |
| wcmmo | MythicHUD | Remnant bar (`%wcmmo_remnant%`), glow at 100 |

## Data & IDs

| ID | Kind |
|---|---|
| `wcmmo_ult_blade_storm`, `wcmmo_ult_earthbreaker`, `wcmmo_ult_heavens_barrage`, `wcmmo_ult_cataclysm` | ultimate skills (spec 008) |
| `%wcmmo_remnant%` | placeholder 0–100 |
| `{-wcmmo::remnant::<uuid>}` | gauge (memory; reset on restart is acceptable) |

## Balance (proposed)

| Setting | Value |
|---|---|
| Gauge max | 100 |
| Basic hit / skill hit / 2 % HP lost | +1 / +3 / +1 |
| Rough time to fill in a Low zone | ~60–90 s of active fighting |
| Ultimate damage | 700–720 % total over its duration (spec 008) |

## Commands & permissions

| Command | Permission | Behaviour |
|---|---|---|
| `/wcmmo remnant set <player> <0-100>` | `wcmmo.admin.remnant` | testing |

## Performance

Event-driven (damage, drop). No per-tick loop.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Hit the Dummy with basic attacks for 10 s | gauge +≤ 20 |
| 2 | Cast a skill that hits 5 mobs | +3 once |
| 3 | Take a hit for 10 % max HP | +5 |
| 4 | Q at 60 | "Remnant not full", item not dropped |
| 5 | Q at 100 with Mastery < 25 | "Ultimate locked" |
| 6 | Q at 100, Mastery 25, holding a Hammer | Earthbreaker fires, gauge 0, Super Armour while casting |
| 7 | Switch to a Bow, fill, Q | Heaven's Barrage fires |

## Rollback

Disable the script; Q drops items again.

## Acceptance criteria

- [x] D-51 decided (name Remnant, key Q).
- [ ] Tests 1–7 pass.
