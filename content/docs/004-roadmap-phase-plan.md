# 004 — Roadmap & Phase 0 proof-of-concepts

> Status: DRAFT · Target: wcmmo, wcmmo-plugins, wcmmo-content · FIRE mode: confirm
> Design: [GDD v2 — Phase plan](../gdd/wcmmo-gdd-v2.md#phase-plan)

## Big picture

- **Story:** As the dev team, we want to prove every risky mechanic works on Purpur 26.2 **before** writing content on top of it, then ship a small playable vertical slice.
- **Done means:** every PoC below has a result (PASS / FALLBACK / FAIL) recorded here, and the GDD decisions it unblocks are `DECIDED`.

## Phases

| Phase | Goal | Specs | Exit criteria |
|---|---|---|---|
| 0 — PoC | prove risky tech | this spec | all PoCs have a result; D-00, D-05, D-19, D-25, D-37 decided |
| 1 — Vertical slice | tutorial + 1 region, Berserker Bloodline stages 1–3, 2 Rune slots, 4 weapons (Sword, Hammer, Bow, Staff) with Mastery to 25, stat gating, 1 solo dungeon | 005–012, 014, 016, 021–023 | 5 testers finish chapter 1 solo; MSPT ≤ 40 with 20 bots/players |
| 2 — Core MMO | all launch Bloodlines to stage 5, all weapons, enhancement to V, Mid/High zones, stationary farming, world boss, party dungeon | 013–017, 021–023 | world boss with 50 players at MSPT ≤ 45 |
| 3 — Lifezone | instances, housing, professions, furniture | 018–020 | 20/20 Lifezone with pastes and no TPS dip below 19 |
| 4 — Social | economy, guild & node war, pets & mounts | not specced | — |

## Timeline

| Target | Date | Note |
|---|---|---|
| Vertical slice (Phase 1) | 2–3 weeks from 2026-09-28 (owner) | ~75 % of work on one person: Phase 0 PoCs must fit inside this window. Re-check scope at the end of week 1 (TM3 in `gdd/owner-questions.md`) |

## Prerequisites (before any PoC)

| # | Item | Repo | Owner |
|---|---|---|---|
| P1 | Buy/confirm plugins, fill the table in `gdd/owner-questions.md` (D-00) | — | Tatoo |
| P2 | Decide repo layout (D-38). If 3 repos: track MMO content configs in `wcmmo` (update `.gitignore`); no `wcmmo-content` | wcmmo | Tatoo + team |
| P3 | Create `wcmmo-plugins` repo (Kotlin, Gradle, Paper API 26.2), install FIRE (D-25) | wcmmo-plugins | Tatoo |
| P4 | LuckPerms + MySQL on dev box (groups per `docs/README.md`) | wcmmo | dev |

## Proof-of-concepts

| PoC | Question | Pass condition | Fallback | Spec | Decision |
|---|---|---|---|---|---|
| PoC-1 | Can we show souls-like first-person attack animations? | a Sword 3-hit combo animates in first person, synced within 100 ms at 50 ms ping | animated item model + particles + sounds | 010 | D-05 |
| PoC-2 | Frontguard / I-frame / Super Armour as damage/CC rules | interaction matrix in 009 passes with 2 players + 1 MythicMob | reduced set: I-frame + Super Armour only | 009 | D-06b, D-25 |
| PoC-3 | `Shift + Right Click` bar swap without input clashes (D-03 decided) | swap works while holding bow, crossbow, food, block, and looking at a chest; none of those actions trigger | `Shift+F` | 007 | D-03 |
| PoC-7 | Bloodline hooks drive MythicMobs effects on players | Berserker stages 1–5 pass spec 021 tests | stage effects coded in Kotlin | 021 | D-37 |
| PoC-8 | Mastery cooldown math via PlaceholderAPI in MythicMobs | cooldown = base × (1 − min(0.20, mastery × 0.004)) measured in game | cooldown applied by Kotlin plugin | 023 | D-36 |
| PoC-4 | Identify random gear | an unidentified MMOItems drop becomes a rolled item via an Identify scroll/NPC | fixed crafted/quest items | 012 | D-10 |
| PoC-5 | Lifezone schematic with Nexo furniture | save a 32×32 house with 20 Nexo furniture pieces, paste to another plot async, furniture still works | furniture re-spawned from a saved list instead of schematic entities | 018 | D-19, D-20 |
| PoC-6 | Stamina replaces hunger | hunger never drops; stamina shown per D-01; dash consumes stamina | action-bar display | 005 | D-01 |

Each PoC is one FIRE intent in its target repo, mode `validate`, with a `/spark profiler` link in the test report.

## Performance

PoC-2, PoC-5 must report MSPT with 20 concurrent actions (bots or testers).

## Test plan (dev box)

Per PoC — see linked spec.

## Rollback

PoCs run on `develop` only, on branches `poc/NNN-slug`. Nothing ships to `main` until Phase 1.

## Acceptance criteria

- [ ] PoC results table filled below.
- [ ] GDD decisions updated with outcomes.

## PoC results

| PoC | Date | Result | FIRE run | Notes |
|---|---|---|---|---|
| | | | | |

## Open questions

- D-00, D-25, D-27 (see GDD v2) block P1–P3.
