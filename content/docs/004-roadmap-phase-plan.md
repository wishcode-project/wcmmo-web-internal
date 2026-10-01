# 004 — Roadmap & Phase 0 proof-of-concepts

> Status: DRAFT · Target: wcmmo · FIRE mode: confirm
> Design: [GDD v2 — Phase plan](../gdd/wcmmo-gdd-v2.md#phase-plan)

## Big picture

- **Story:** As the dev team, we want to prove every risky mechanic works on Purpur 26.2 **before** writing content on top of it, then ship a small playable vertical slice.
- **Done means:** every PoC below has a result (PASS / FALLBACK / FAIL) recorded here, and the GDD decisions it unblocks are `DECIDED`.

## Phases

| Phase | Goal | Specs | Exit criteria |
|---|---|---|---|
| 0 — PoC | prove risky tech with vendor plugins + Skript (7 PoCs; PoC-5 moved to Phase 3) | this spec | all 7 PoCs have a result; D-05, D-37, D-44 decided; per-system review done (own plugin vs vendor/Skript, D-25) |
| 1 — Vertical slice | tutorial + 1 region, all 3 base Bloodlines (Fury, Ward, Pulse) stages 1–3, 2 Rune slots, 4 weapons (Sword, Hammer, Bow, Staff) with Mastery to 25, stat gating, 1 solo dungeon | 005–012, 014, 016, 021–025, 027–035 | 5 testers finish chapter 1 solo; MSPT ≤ 40 with 20 bots/players |
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
| P2 | ✅ **Done 2026-10-01:** D-38 = 3 repos; MMO / Mythic / Nexo configs tracked in `wcmmo` (`.gitignore` updated), no `wcmmo-content`; kit moved into `wcmmo` | wcmmo | Tatoo + team |
| P3 | Install Skript + SkBee, skript-reflect, skript-placeholders on the dev box (`docs/plugins.md` §3.8, install step 6b); add `plugins/Skript/variables.csv*` to `wcmmo/.gitignore` first | wcmmo | Tatoo |
| P4 | LuckPerms + MySQL on dev box (groups per `docs/README.md`) | wcmmo | dev |
| ~~P5~~ | ~~Create `wcmmo-plugins` repo (Kotlin, Gradle, Paper API 26.2)~~ **Deferred (D-25, 2026-09-29)** until the per-system review after Phase 0 | wcmmo-plugins | Tatoo |

**Build approach (D-25 revised 2026-09-29):** every PoC is built with the bought plugins + Skript. Each PoC's test report keeps its `/spark` result: the per-system review after Phase 0 uses them to decide what (if anything) moves into our own plugin.

## Proof-of-concepts

| PoC | Question | Pass condition | Fallback | Spec | Decision |
|---|---|---|---|---|---|
| PoC-1 | Can we show souls-like first-person attack animations? | a Sword 3-hit combo animates in first person, synced within 100 ms at 50 ms ping | animated item model + particles + sounds | 010 | D-05 |
| PoC-2 | Frontguard / Super Armour as damage/CC rules (I-frame deferred, D-49) | interaction matrix in 009 passes with 2 players + 1 MythicMob | reduced set: Super Armour only | 009 | D-06b |
| PoC-3 | Controls without input clashes: **F** bar swap, **Q** ultimate, instant bow on right click (D-03 revised, D-51, D-53) | swap works while holding bow, crossbow, food, block, an FPV weapon whose right click attacks (Draconic pack), and looking at a chest; none of those actions trigger | `Shift+F` for single weapons; sneak + hotbar scroll for dual weapons (they use F / off-hand) | 007 | D-03 |
| PoC-7 | Bloodline hooks drive MythicMobs effects on players | Fury, Ward and Pulse stage 1 + one path each pass their spec 021 tests, with `/spark` numbers | stage effects done fully in Skript (no MythicMobs skills) | 021 | D-37 |
| PoC-8 | Mastery cooldown math via PlaceholderAPI in MythicMobs | the spec 023 formula (test build: cap 30, CDR cap 20 %) matches in game within 1 tick | cooldown applied by a Skript skill wrapper | 023 | D-36 |
| PoC-4 | Identify random gear | an unidentified MMOItems drop becomes a rolled item via an Identify scroll/NPC | fixed crafted/quest items | 012 | D-10 |
| PoC-6 | Stamina replaces hunger | hunger stays full and hidden; stamina shown on the MythicHUD bar (D-01); sprint drains a little, dash more (D-03a) | action-bar display | 005 | D-01 |

Each PoC is one FIRE intent in its target repo, mode `validate`, with a `/spark profiler` link in the test report.

## Later tests (not part of Phase 0)

| Test | Question | Pass condition | Fallback | Spec | Moved because |
|---|---|---|---|---|---|
| PoC-5 → Phase 3 | Lifezone schematic with Nexo furniture | save a 32×32 house with 20 Nexo furniture pieces, paste to another plot async, furniture still works | furniture re-spawned from a saved list instead of schematic entities | 018 | Lifezone is our own plugin, built after the combat/MMO core (D-19, 2026-09-29). Run it when Phase 3 starts |

## Performance

**PoC-2 status 2026-10-02 (`run-wcmmo-003`): functional PASS with 1 player + MythicMobs** (mob Frontguard front 0.76 vs back 3.94 dealt; player block 0.5 instead of 2.5; heavy attack breaks the guard; Super Armour; dummy DPS meter). Boss stun phases (70 % / 40 %, yellow glow, 5 s) confirmed 2026-10-02. **Still open:** the player-vs-player rows of the 009 matrix (needs 2 players) and the MSPT report below.

PoC-2 must report MSPT with 20 concurrent actions (bots or testers). PoC-2 and PoC-7 run Skript on every hit: their `/spark` numbers are the main input for the D-25 per-system review.

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

- D-00 is decided (all owned except MythicDungeons). D-38 (repo layout) still blocks P2.
- After Phase 0: per-system review (D-25), which systems move into `wcmmo-plugins` and which stay vendor/Skript.
