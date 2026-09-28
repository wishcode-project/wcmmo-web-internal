# ADR 0002 — Specs repo + FIRE per implementation repo

- Status: Accepted
- Date: 2026-09-25

## Context
Changes to configs and content need to be reviewable, traceable and reproducible. Same need solved in the IR-WEB project with a specs repo and specsmd.

## Decision
- `wcmmo-specs` holds rules (`CLAUDE.md`), registries (`docs/README.md`) and one numbered spec per feature. No specsmd installed here.
- Each implementation repo (`wcmmo`, later `wcmmo-plugins`, `wcmmo-content`, `wcmmo-infra`) installs **specsmd FIRE**. Every FIRE intent cites a spec number; each run logs plan / test report / walkthrough under `.specs-fire/runs/`.
- specsmd "simple" flow (requirements → design → tasks) is not used: it duplicates what the spec repo already provides.

## Consequences
- Two-step flow for every change (spec, then run) — autopilot mode keeps tiny fixes cheap.
- Full audit trail: spec (why/what) → FIRE run (how/tested) → PR (diff).
