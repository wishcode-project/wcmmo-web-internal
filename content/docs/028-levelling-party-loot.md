# 028 — Levelling, party XP & loot

> Status: DRAFT · Target: wcmmo (MMOCore exp curve + parties, MythicMobs XP/drops, Skript) · FIRE mode: validate
> Design: GDD v2 · Decisions: D-07, D-18, D-58, D-59

## Big picture

- **Player story:** I reach the level cap (60) in about 90–100 hours of normal play, mostly from fighting and the main story. Playing in a party is safer and more fun but never *required*: it earns about the same XP per hour as playing solo. Loot never becomes a fight with other players.
- **Done means:** the XP curve and sources below are live; party XP sharing and loot rules work; the vertical slice takes a new player from Lv 1 to 15.

## Levelling (D-58)

### Time targets (normal play: main quests + some farming)

| Levels | Zones | Time | Total |
|---|---|---|---|
| 1 → 15 | Chapter 0–1 (**vertical slice**) | ~3–4 h | ~4 h |
| 15 → 20 | Low | ~4 h | ~8 h |
| 20 → 40 | Mid | ~25 h | ~33 h |
| 40 → 60 | High | ~60 h | **~90–100 h** |

### XP curve

XP needed for the next level: **`50 × L² + 100 × L`** (L = current level). Put into MMOCore's exp curve, then tune against the time targets.

| Level | XP to next |
|---|---|
| 1 → 2 | 150 |
| 10 → 11 | 6,000 |
| 20 → 21 | 22,000 |
| 40 → 41 | 84,000 |
| 59 → 60 | ~180,000 |

### XP sources

| Source | Share (approx.) |
|---|---|
| killing monsters | ~60 % |
| main + side quests | ~30 % (the story can carry levels on its own) |
| dungeons / world bosses | ~10 % (+ loot) |

Lifeskill and Weapon Mastery XP are separate professions and never count toward character level.

### Low-level monsters

| Monster is… | XP |
|---|---|
| 5+ levels below you | 50 % |
| 10+ levels below you | 10 % |

Works together with the AP/DP soft cap (spec 014) against farming low zones.

## Party XP (D-59)

MMOCore parties, size 2–5 (D-18).

| Rule | Detail |
|---|---|
| Who shares | party members within **30 blocks** of the kill and within **10 levels** of each other (no power-levelling) |
| XP per member | `base XP × (1 + 0.10 × (members − 1)) ÷ members` |
| Mixed-Bloodline bonus | **+5 % per distinct Bloodline beyond the first** in the sharing group (all 3 base Bloodlines = +10 %), MU-style party mix bonus |

| Party | XP per member per kill | Kill speed | XP per hour |
|---|---|---|---|
| solo | 100 % | 1× | 100 % |
| 2 | 55 % | ~1.8× | ~100 % |
| 5 | 28 % | ~3.5× | ~100 % |

Party play is **not** more rewarding than solo (solo first), just safer and more social.

## Loot (D-59)

| Situation | Rule |
|---|---|
| Open-world monster | the player who dealt the **most damage** owns the drops for **30 s** (only they can pick them up), then **anyone** can pick them up for **90 s**, then they despawn |
| Open-world monster, owner is in a party | ownership rotates **round-robin** among the owner's party members who are nearby |
| Dungeon boss | **personal rewards**: every member gets their own roll; nothing to fight over |
| World boss | hit it or be nearby when it dies → random roll; MVP top 1–3 damage get bigger rewards (D-17) |

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | MMOCore exp curve file | the formula above (VERIFY: formula support or a per-level list) |
| wcmmo | MythicMobs mobs | `Level` per mob, base XP per mob |
| wcmmo | `plugins/Skript/scripts/wcmmo_61_xp_loot.sk` | award XP on kill (level gap, party split, Bloodline bonus), damage tracking per mob, drop ownership (Paper item owner) and despawn timers |
| wcmmo | MMOCore party | `/party`, party HUD in MythicHUD |

## Data & IDs

| ID | Kind |
|---|---|
| `{-wcmmo::dmg::<mob uuid>::<player uuid>}` | damage dealt per player per mob (memory, cleared on death) |
| `%wcmmo_party_bonus%` | placeholder: current mixed-Bloodline bonus |

## Performance

Damage tracking is one variable write per hit; cleared when the mob dies or despawns. Drop ownership uses Paper's item owner, no per-tick checks.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Level 1 → 2 | needs 150 XP |
| 2 | Kill a mob 6 / 11 levels below you | 50 % / 10 % XP |
| 3 | Party of 2 kill a mob | each gets 55 % of base XP |
| 4 | Party of 3 with Fury, Ward, Pulse | +10 % on top |
| 5 | Party member 12 levels apart | gets no shared XP |
| 6 | Two solo players hit the same mob, A deals more | drops pickable only by A for 30 s, then by anyone, gone after 90 s more |
| 7 | Owner is in a party of 3 | drops of successive kills go to members in turn |
| 8 | Dungeon boss kill in a party | each member gets their own reward |
| 9 | Play the vertical slice fresh | reach about Lv 15 at the end of Chapter 1 |

## Rollback

Disable the script: MMOCore / MythicMobs default XP and vanilla drops.

## Acceptance criteria

- [x] D-58, D-59 decided.
- [ ] Tests 1–9 pass; time targets checked with 3 testers.
