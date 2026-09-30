# 031 — Chat channels

> Status: DRAFT · Target: wcmmo (Skript `wcmmo_70_chat.sk`, CMI chat filter / mute, Triton, UltimateUI, DiscordSRV) · FIRE mode: confirm
> Design: GDD v2 · Reference: owner screenshot of a channel-tab chat (from another game) · Decisions: D-63

## Big picture

- **Player story:** I choose which channel I talk in (Global, Local, Party, Guild, Private, Shout) and which channels I see, with one click. Each channel has its own tag and colour, so busy chat stays readable.
- **Done means:** the channels, shortcuts and the clickable channel bar below work; system / NPC messages don't flood chat.

## What the server can and can't do

The tab row under the chat input in the reference comes from a **client mod** of that game. Vanilla Minecraft can't draw tabs in the chat box (neither plugins nor resource packs can). The server gives the same result with a **clickable channel bar** printed in chat by `/chat`. A client-side mod with real tabs can be an optional extra later.

## Channels (decided 2026-10-01)

| Channel | Who sees it | Shortcut | Tag / colour | Notes |
|---|---|---|---|---|
| **Global** | everyone on the server | `/g <message>` | `[G]` green | bridged to Discord (DiscordSRV) |
| **Local** | players within **100 blocks** | `/l <message>` | `[L]` white | **default talk channel** on join |
| **Party** | MMOCore party members | `/p <message>` | `[P]` aqua | |
| **Guild** | guild members | `/gc <message>` | `[Gu]` gold | uses the Guilds plugin, enabled with the guild design (GDD §11) |
| **Private** | the two players | `/msg <player> <message>` · `/r <message>` | `[→]` / `[←]` light purple | |
| **Shout** | everyone, highlighted | `/shout <message>` | `[!]` yellow, bold name | 60 s cooldown per player; shown even when Global is hidden (LFG, trading) |
| *All* (view) | every channel | click `[All]` | — | system / NPC messages always show |

## Rules

1. **Talk channel:** `/ch <channel>` or click a channel in the bar; typing plain chat goes to it. Default: Local.
2. **View filter:** click a channel in the bar to see only that channel (plus system / NPC messages); `[All]` shows everything. Remembered per player.
3. **Channel bar:** `/chat` prints one clickable line `[All] [Global] [Local] [Guild] [Party] [Private] [Shout]`; the active talk channel is underlined, the active view is highlighted. Also available in an UltimateUI chat-settings menu.
4. **NPC / system spam:** NPC messages go only to the player concerned; the same message repeated within 3 s is merged into one line with a counter ("×12").
5. **Moderation:** CMI chat filter, mute and anti-spam stay on for every channel.
6. **Languages (spec 030):** channel names, tags, the channel bar and system messages go through Triton (Thai / English). Player-typed messages are **not** translated.
7. **Secure chat:** re-sending player messages to chosen recipients works best with chat signing disabled on the server (`enforce-secure-profile=false` or a plugin that handles it). ⚠️ Verify on 26.2.

## Systems & config

| Repo | File | What |
|---|---|---|
| wcmmo | `plugins/Skript/scripts/wcmmo_70_chat.sk` | channel routing, shortcuts, `/ch`, `/chat` bar, view filter, shout cooldown, NPC message merging |
| wcmmo | CMI | chat filter, mute, anti-spam; CMI's own chat formatting off where it would double the tags |
| wcmmo | DiscordSRV | Global ↔ Discord |
| wcmmo | UltimateUI | chat settings menu |
| wcmmo | Triton | `wcmmo.chat.*` keys |

## Data & IDs

| ID | Kind |
|---|---|
| `{wcmmo::chat::talk::<uuid>}` | talk channel (persistent) |
| `{wcmmo::chat::view::<uuid>}` | view filter (persistent) |
| `wcmmo.chat.shout` | permission (default) |
| `wcmmo.chat.spy` | permission (mods: see Private / Party / Guild for moderation) |

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Join, type | message goes to Local (within 100 blocks only) |
| 2 | `/g hi` | everyone sees `[G]`; it appears on Discord |
| 3 | `/p hi` in a party | only party members see `[P]` |
| 4 | `/msg Bob hi`, Bob `/r yo` | only the two see it |
| 5 | `/shout LFG dungeon` twice in 60 s | second one refused; others see it even with Global hidden |
| 6 | `/chat`, click `[Party]` | only party + system messages shown; `[All]` restores |
| 7 | An NPC says the same line 12 times fast | one line "×12" |
| 8 | Thai client | channel names / bar / system messages in Thai |

## Acceptance criteria

- [x] D-63 decided.
- [ ] Tests 1–8 pass.
