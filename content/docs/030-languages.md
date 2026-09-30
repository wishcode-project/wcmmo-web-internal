# 030 — Languages & translation (Triton)

> Status: DRAFT · Target: wcmmo (Triton, Nexo pack fonts, all plugin texts) · FIRE mode: confirm
> Design: GDD v2 · Decisions: D-27

## Big picture

- **Player story:** The game speaks my language: Thai if my Minecraft is in Thai, English otherwise, and I can switch with `/lang`. Names of Bloodlines, skills, runes, weapons and places are the same for everyone, so Thai and English players talk about the same things.
- **Done means:** every player-facing text goes through Triton in Thai and English; Thai renders correctly everywhere, including custom HUD / menu fonts.

## Rules (decided 2026-10-01)

| Rule | Detail |
|---|---|
| Languages at launch | **Thai + English** |
| Default | from the client's language setting: Thai client → Thai, anything else → English |
| Switch | `/lang` (Triton) |
| **Proper names stay English** in both languages | Bloodlines (Fury, Ward, Pulse), skills (Whirl Cut…), runes (Vitality…), weapons, items' base names, places, NPC names, Remnant |
| Translated | descriptions, item lore, quest text, NPC dialogue, menus, HUD labels, system messages, tutorials |
| Not translated | player chat |
| Public website | already EN / TH; uses the same names |

## Translation keys

| Part | Pattern | Example |
|---|---|---|
| key | `wcmmo.<area>.<name>` | `wcmmo.death.fallen` |
| areas | `ui`, `hud`, `skill`, `rune`, `bloodline`, `item`, `quest`, `npc`, `death`, `system` | |
| in plugin configs | Triton's language tag around the key (`[lang]wcmmo.death.fallen[/lang]`) | MMOItems lore, MythicMobs names, LuxDialogues lines, UltimateUI / MythicHUD text, Skript messages |

Source language for writing: **Thai for story and dialogue** (the story team writes in Thai), **English for system / UI text**; the other language is translated from it. Every key needs both before a release.

## Fonts

Custom pixel fonts for the HUD and menus usually have **no Thai glyphs**. Either:
- **A (recommended):** add a Thai glyph set to our HUD font in the Nexo pack, or
- **B:** keep Thai text in the vanilla font (which has Thai) and use the pixel font only for numbers and English labels.

Check Thai vowels / tone marks stack correctly (สระบน-ล่าง, วรรณยุกต์) at GUI scale 2–4.

## Workflow

1. A spec or content change adds keys with both texts (or marks one `TODO-TH` / `TODO-EN`).
2. The story team writes / reviews Thai; English is reviewed by someone fluent. AI drafts are fine but always reviewed by a person.
3. Keys live in Triton's storage (local files or MySQL). Use Triton's own editor tools if the team prefers them (check what the installed version offers).
4. Before release: no key missing in either language.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Thai client joins | everything in Thai; names (Fury, Whirl Cut) in English |
| 2 | English client joins | everything in English |
| 3 | `/lang` switch | texts change without relog |
| 4 | Item lore, mob names, NPC dialogue, HUD labels, death title | all translated |
| 5 | Thai text in the HUD / menus | vowels and tone marks render correctly |

## Acceptance criteria

- [x] D-27 decided.
- [ ] Tests 1–5 pass; no missing keys in the vertical slice.
