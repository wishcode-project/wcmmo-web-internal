# wcmmo-web-internal: WC-MMO site + team codex

One app, two faces, styled after wynncraft.com (parchment panels, dark wood, pixel headings):

- **Public player site** at `/`: home, features, roadmap with progress bars, devlog. Teasers only.
- **Team codex** at `/team` (login required): every spec, decision, PoC, open question and plugin, with charts and a dependency graph.

## Team login and what keeps the specs private

The team codex is not just hidden behind a password screen. Its JavaScript (which embeds the private specs) is built into `dist/assets/team/`, and the server refuses those files without a valid session:

| Piece | Job |
|---|---|
| `api/login.ts`, `api/session.ts`, `api/logout.ts` | Vercel functions. Check `TEAM_USER` / `TEAM_PASSWORD`, set a signed `HttpOnly` cookie for 7 days |
| `middleware.ts` | Vercel middleware. Returns 401 for `/assets/team/*` without that cookie |
| `vite.config.ts` | Puts all private code into `assets/team/`; runs the same login API in `npm run dev` / `npm run preview` |
| `scripts/check-bundle.mjs` | Runs after every build and **fails it** if a public file imports team code or contains spec text |
| `content/public-stats.json` | The only spec-derived data the public site sees: counts, no text |

Rules that keep it that way:
- Never import anything from `src/team/` or `content/*.md` in `src/site/`, `src/shared/` or `src/auth/`.
- Public copy lives in `src/site/config.ts` and `src/site/devlog/*.md`. Keep it teaser-level: no balance numbers, plugin names, open decisions or story spoilers.

Credentials come from environment variables, never from the code:

| Variable | Where | Value |
|---|---|---|
| `TEAM_USER` | Vercel → Settings → Environment Variables, and `.env.local` for dev | e.g. `admin` |
| `TEAM_PASSWORD` | same | a real password in production |
| `TEAM_SESSION_SECRET` | optional | long random string; defaults to the password |

`.env.local` is gitignored; copy `.env.example` to start. If the variables are missing on Vercel, login answers "not configured" and nobody gets in.

## Languages (EN / TH)

Every page has an EN | TH switch in the header. The choice is remembered per browser; `?lang=th` or `?lang=en` in a link forces a language, so you can share a Thai link directly. First-time visitors whose browser is set to Thai get Thai.

| Text | Where the two languages live |
|---|---|
| Public site copy, features, roadmap stages | `src/site/config.ts` (`en` / `th` side by side) |
| Devlog posts | `src/site/devlog/<slug>.md` + `<slug>.th.md` (no Thai file → English is shown with a note) |
| Team codex UI | `src/team/strings.ts` |
| Spec content | stays English: it is the `wcmmo-specs` source. Status words (DRAFT, OPEN, D-xx) stay English too |

TypeScript makes the `th` side match the `en` side, so a new string without a Thai version fails `npm run build`.

Font: **Bai Jamjuree** (Google Fonts, same family as store.amorycraft.com) for headings and text; it has Thai glyphs.

## Writing a devlog post

Add `src/site/devlog/YYYY-MM-DD-slug.md`:

```md
---
title: Devlog #2 — Something cool
date: 2026-10-05
tag: Combat
summary: One sentence for the card.
---

Markdown body. Links to site pages like [the roadmap](/roadmap) work.
```

Add the Thai version as `YYYY-MM-DD-slug.th.md` with the same front matter keys.

## Writing a lore chapter

The public **Lore** page (`/lore`) shows the story chapter by chapter. Add `src/site/lore/NN-slug.md`:

```md
---
chapter: 2
title: Chapter title
summary: One sentence for the chapter card.
cover: ch1-1
---

Markdown body.

![Caption under the picture](story:ch1-3)

![Two pictures](story:ch1-6) ![on one line become a grid](story:ch1-7)
```

Add the Thai version as `NN-slug.th.md`. Chapters are sorted by `chapter`; `0` shows as "Chapter 0 · Prologue".

**Story pictures** (`story:<id>`, and `cover:`) are cut from the concept boards in `wcmmo-specs/gdd/boards/`: `python3 scripts/crop-boards.py` writes them to `src/shared/story/<id>.webp` (needs Pillow). Every file in that folder is **public**, so only cut panels without spoilers or placeholder names; the box for each panel is in the script. The full boards stay team-only: they sync to `content/boards/` and appear on the lore bible page in the team Library, served from the login-protected `assets/team/`.

**Lore chapters are public: no spoilers.** The full story canon is `gdd/lore-bible.md` in `wcmmo-specs` (team only). Write the public chapter from what a player sees, never copy from the bible. `scripts/check-bundle.mjs` fails the build if the bible's `TEAM ONLY` marker ever reaches a public file.

The server address and Discord link are `serverIp` / `discordUrl` in `src/site/config.ts` (`null` shows "Opening soon" / hides the button).

Stack: Vite 6 + React 19 + TypeScript + Tailwind CSS v4, Recharts for charts, React Flow for the graph, react-markdown for rendering the specs.

## How the data gets in

Apart from the three small login functions there is no backend. The site parses the markdown from [`wcmmo-specs`](https://github.com/wishcode-project/wcmmo-specs) **at build time**:

```
wcmmo-specs/{docs,gdd,CONTEXT.md}  --npm run sync-->  content/  --vite build-->  dist/
```

- `scripts/sync-specs.mjs` copies the markdown into `content/` and writes `content/meta.json` (git log, last-changed date per file).
- `src/lib/data.ts` turns that markdown into data: the spec status line, `D-xx` decision tables, the spec 004 phase/PoC tables, `owner-questions.md`, and the `plugins.md` overview.
- The sync runs before `dev` and `build`. When `../wcmmo-specs` isn't there (e.g. on Vercel), it keeps the committed `content/`.

So the parsers keep working, keep the formats the specs already use:

| Source | Format the site relies on |
|---|---|
| `docs/NNN-*.md` | `# NNN — Title`, then `> Status: … · Target: … · FIRE mode: …`; `## Acceptance criteria` checkboxes; `## Open questions` bullets; `## Implementation log` table |
| `gdd/wcmmo-gdd-v2.md` | decision tables with header `ID \| Decision \| Options \| Recommendation \| Your call \| Status`; `## Decision log` table |
| `docs/004-roadmap-phase-plan.md` | `## Phases`, `## Proof-of-concepts`, `## PoC results`, `## Prerequisites` tables; "2–3 weeks from YYYY-MM-DD" in the timeline |
| `gdd/owner-questions.md` | `## Pending: …` tables whose first column is `#`; `~~T7~~` marks an answered question |
| `docs/plugins.md` | `## 1. Overview` table |

To record a PoC result, fill the `PoC results` table in spec 004 (`Result` = PASS / FALLBACK / FAIL). The dashboard picks it up on the next sync.

## Develop

```bash
npm install
npm run dev        # syncs ../wcmmo-specs, then starts Vite on http://localhost:5173
npm run build      # sync + typecheck + production build into dist/ + privacy check
npm run preview    # serve dist/ on http://localhost:4173 with the login and asset guard, like Vercel
```

Point the sync at another checkout with `SPECS_DIR=/path/to/wcmmo-specs npm run sync`.

## Update the live site

**Automatic.** Every push to `wcmmo-specs` `main` runs the GitHub Action `wcmmo-specs/.github/workflows/sync-website.yml`: it runs this repo's `scripts/sync-specs.mjs`, commits `content/` as `github-actions[bot]` ("chore: sync specs @ <sha>") and pushes, and Vercel deploys that commit. Live about 1–2 minutes after the specs push.

Setup, once: a fine-grained GitHub token with access to **only** `wishcode-project/wcmmo-web-internal`, permission **Contents: Read and write**, saved as the Actions secret `WEB_REPO_TOKEN` in `wcmmo-specs` (Settings → Secrets and variables → Actions). Without it the Action skips with a warning. You can also run it by hand from the Actions tab ("Run workflow").

Because the bot commits `content/`, **`git pull` before you push** changes to this repo, and don't commit `content/` by hand any more (a local `npm run dev` rewrites it; `git checkout content` throws that away). Manual fallback if the Action is broken:

```bash
npm run sync && git add content && git commit -m "chore: sync specs @ <sha>" && git push
```

## Deploy on Vercel

1. Import `wishcode-project/wcmmo-web-internal` in Vercel. `vercel.json` already sets the framework (Vite), `npm run build`, the `dist` output folder and the SPA rewrite.
2. Add `TEAM_USER` and `TEAM_PASSWORD` (and optionally `TEAM_SESSION_SECRET`) under Settings → Environment Variables, then redeploy.
3. Keep **Vercel Deployment Protection off** for production, or players can't see the public site. The team area is protected by the login above.
4. Keep this GitHub repo **private**: `content/` holds the spec markdown.

## Pages

| Route | What |
|---|---|
| `/` | public home: hero, progress strip, feature teasers, roadmap preview, devlog |
| `/features`, `/roadmap`, `/devlog`, `/devlog/:slug` | public pages |
| `/team` | login, then the codex below (all routes live under `/team`) |
| `/team` (logged in) | headline numbers, spec pipeline, decisions by area, blockers per spec, phases, PoCs, repo activity |
| `/team/specs`, `/team/specs/:id` | filterable spec cards; each spec rendered with its decisions, PoCs and linked specs |
| `/team/graph` | phases → specs → decisions → PoCs, click to trace |
| `/team/decisions` | every `D-xx` with recommendation, owner's call, citing specs; decision log |
| `/team/roadmap` | slice window, phases, PoC cards, prerequisites |
| `/team/questions` | team, pending owner questions, plugin checklist, answered |
| `/team/plugins` | plugin stack by status |
| `/team/read/*` | GDD, briefs, registries and ADRs rendered |
