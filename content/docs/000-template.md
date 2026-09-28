# NNN — <Feature name>

> Status: DRAFT · Target: wcmmo · FIRE mode: confirm

<!-- Copy this file to docs/NNN-<kebab-slug>.md. Delete sections that genuinely do not apply
     and write "n/a — <why>" instead of leaving them empty. Delete these comments. -->

## Big picture

- **Player story:** As a <player / VIP / staff / builder>, I want <thing> so that <reason>.
- **Who is affected:** <groups, worlds, regions>
- **Done means:** <one or two sentences a tester can check>

## Systems & config

| Repo | File | Key path | Old | New | Dev ≠ prod? |
|---|---|---|---|---|---|
| wcmmo | `config/paper-world-defaults.yml` | `entities.spawning.…` | `-1` | `0` | no |

```yaml
# <file>
<only the changed subtree, with "# was: <old>" comments>
```

## Data & IDs

All IDs below must already be in `docs/README.md` registries.

| ID | Kind | Plugin | Notes |
|---|---|---|---|
| `wcmmo_…` | item / mob / skill / region / permission | | |

## Balance

| Thing | Stat | Value | Reason |
|---|---|---|---|
| | | | |

## Commands & permissions

| Command | Permission | Groups | Behaviour |
|---|---|---|---|
| | | | |

## Performance

- Expected cost: <none / entities per chunk / scheduler period / …>
- How measured: `/spark profiler --timeout 60` during <scenario>; accept if MSPT stays ≤ 40.

## Test plan (dev box)

Preconditions: <server running on develop, player with group X, restic snapshot if data changes>

| # | Step (console / RCON / in-game) | Expected |
|---|---|---|
| 1 | `lp user <tester> parent set default` | ok |
| 2 | | |

## Rollback

- Config: revert the PR / `git revert <sha>` on `develop`, then promote.
- Data: <none touched | restore restic snapshot `<tag>`>

## Acceptance criteria

- [ ] Implementable from this file alone.
- [ ] Every ID is registered in `docs/README.md`.
- [ ] Every number is in a table.
- [ ] Test plan passes on the dev box; FIRE run id recorded below.
- [ ] Dev-only values (if any) added to `wcmmo/docs/DEPLOY.md`.

## Open questions

- none

## Implementation log

| Date | Repo | FIRE run | PR | Notes |
|---|---|---|---|---|
| | | | | |
