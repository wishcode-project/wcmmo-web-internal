# 033 — Monster ranks & combat rules

> Status: DRAFT · Target: wcmmo (MythicMobs mobs / skills, Skript kit `wcmmo_10_combat.sk`, MythicHUD boss bar) · FIRE mode: confirm
> Design: GDD v2 §6 · Related: 009 (combat states), 015 (zone tiers & farming), 017 (bosses & dungeons), 028 (XP & loot), 032 (name colours) · Decisions: D-65

## Big picture

- **Player story:** Normal monsters are easy to read and fun to control with stuns and knockbacks. Elites make me use guard, positioning or a heavy skill. Bosses can't be stunned or pushed around, until they fall into a stun phase: that's my window to unload everything.
- **Done means:** every mob has a rank; each rank follows the combat rules below; bosses are CC-immune outside their stun phases.

Zone tiers (Low / Mid / High, spec 015) set a mob's **level band**. Rank (this spec) sets **how it fights**. Both are needed for every mob.

## Ranks (decided 2026-10-01)

| Rank | Name colour (032) | Frontguard | Super Armour | Can be stunned / knocked back / slowed? | Proposed HP × | Proposed damage × |
|---|---|---|---|---|---|---|
| **Normal** | 🔴 `&c` | never | never | yes, always | 1 | 1 |
| **Elite** | 🟣 `&5` | **some** Elites (guard type) | **some** Elites (armour type) | yes, except while its Super Armour is up | 4 | 1.5 |
| **Boss** (dungeon / story) | 🟣 `&5` | never | not needed | **no, never**, except during a **stun phase** | 20 (solo tuning) | 2 |
| **World Boss** | 🟣 `&5` | never | not needed | same as Boss | per spec 017 | per spec 017 |

Multipliers are applied on top of the mob's level stats (below) and tuned in the vertical slice. A **Rare** rank (random rare spawns) is not in the slice; add later if wanted.

### Elite types

An Elite uses **one** of the two, never both:

| Type | Behaviour | How the player beats it |
|---|---|---|
| **Guard Elite** (e.g. Shieldbearer) | blocks hits from the front (Frontguard, spec 009) | go around to the side / back, or break the guard with a guard-break skill; Hammer / Greatsword heavy skills (D-06d) |
| **Armour Elite** (e.g. Brute) | Super Armour during its attacks: takes damage but no knockback / CC | dodge or guard its attack, punish in the gap after it; Hammer / Greatsword heavy skills ignore its Super Armour (D-06d) |

### Bosses: CC-immune + stun phase (option A)

- Outside a stun phase a boss **takes damage normally** but ignores knockback, stun, slow, blindness and nausea from players.
- **Stun phase (A, vertical slice):** triggered by the boss's own script, per boss:
  - HP thresholds (default **70 %** and **40 %**), and / or
  - after a big telegraphed move **misses** (boss-specific).
- During a stun phase:

| Value | Default |
|---|---|
| Duration | 5 s |
| Damage taken | **+30 %** |
| CC | works normally (knockback, stun, slow) |
| Boss actions | none (kneels / staggers: model animation) |
| Feedback | boss bar text "STUNNED" (Triton key `wcmmo.boss.stunned`), particles, sound |
| Remnant | normal gain (a good moment for the Q ultimate) |

- **Later (B):** a **Break gauge** on some bosses: players fill it with heavy skills and perfect guards; full → stun phase. Needs a boss-bar gauge on the HUD. Not in the slice.

## Telegraphs

| Rank | Telegraph (ground marker / wind-up / sound) |
|---|---|
| Normal | area attacks only |
| Elite | every heavy or area attack |
| Boss / World Boss | every heavy or area attack, plus the move that can trigger a stun phase |

## Level stats (proposed, tune in the slice)

| Stat | Formula at mob level L | L 1 | L 10 | L 20 |
|---|---|---|---|---|
| HP | `20 + 8·L` | 28 | 100 | 180 |
| Damage | `3 + 0.6·L` | 3.6 | 9 | 15 |

MythicMobs: `Health` / `Damage` with level modifiers (`LevelModifiers`, VERIFY option names on the installed version); rank multipliers on the mob's own base values.

## Aggro, leash & respawn (proposed)

| Rank | Aggro (sight) | Leash from spawn | Respawn |
|---|---|---|---|
| Normal | 12 blocks | 32 blocks, heals fully on reset | per zone table (spec 015) |
| Elite | 16 blocks | 32 blocks | 5 min |
| Boss | arena / dungeon room | arena | dungeon rules (017) |
| World Boss | arena | arena | schedule (017) |

## Drops (by rank)

Loot ownership stays as spec 028 (top damager 30 s, then free). Guard-only kills give nothing (032).

| Rank | Drops |
|---|---|
| Normal | silver, common materials, low chance of a Skill Orb |
| Elite | more silver, uncommon materials, higher Skill Orb chance, low chance of a rune |
| Boss | guaranteed boss table (017) |

Exact drop rates are written per zone in the zone / mob specs.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | MythicMobs mobs | rank in the mob name (`&c` / `&5`), stats, Elite Frontguard tag `wcmmo_frontguard` or Super Armour via `wcmmostate`, boss tag `wcmmo_boss` |
| wcmmo | MythicMobs skills | boss stun phase: `wcmmostate <caster.uuid> stunphase 100` at HP thresholds (`~onDamaged` + health condition, VERIFY) |
| wcmmo | Skript `wcmmo_10_combat.sk` | boss CC immunity (cancel knockback / slow / blindness / nausea unless `stunphase`); +30 % damage during `stunphase` |
| wcmmo | MythicHUD | boss bar shows "STUNNED" during a stun phase |

## Data & IDs

| ID | Kind |
|---|---|
| `wcmmo_boss` | scoreboard tag on every Boss / World Boss |
| `wcmmo_frontguard` | scoreboard tag on Guard Elites (spec 009) |
| `stunphase` | combat state (Skript state store, spec 009) |
| `wcmmo.boss.stunned` | Triton key |

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Stun / knock back a Normal | works |
| 2 | Hit a Guard Elite from the front, then the side | front: chip damage only; side: full damage |
| 3 | Knock back an Armour Elite during its attack, then after | during: no knockback; after: knockback works |
| 4 | Hammer heavy skill on either Elite | breaks guard / ignores Super Armour |
| 5 | Knock back / slow a Boss above 70 % HP | damage only, no CC |
| 6 | Bring the Boss to 70 % | stun phase 5 s: "STUNNED", +30 % damage, CC works |
| 7 | Same at 40 % | second stun phase |

## Acceptance criteria

- [x] D-65 decided.
- [ ] Tests 1–7 pass.

## Implementation log

| Date | Repo | FIRE run | PR | Notes |
|---|---|---|---|---|
| 2026-10-02 | wcmmo | `run-wcmmo-003` | branch `feat/009-combat-poc` | Test mobs: `wcmmo_test_grunt` (Normal), Shieldbearer (Guard Elite, blue glow), Brute (Armour Elite, orange glow, telegraphed guard-breaking smash), `wcmmo_test_boss` (stun phases; not confirmed in game yet). |
