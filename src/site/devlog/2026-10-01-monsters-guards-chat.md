---
title: Devlog #7 — Monsters, guards, chat and languages
date: 2026-10-01
tag: World
summary: How monsters fight, what a name colour tells you, who guards the city, and how you talk to everyone else.
---

The last few pieces of this week's design session: the world around you.

## Monster ranks

Every monster has a **rank** that decides how it fights, on top of its level.

| Rank | How it fights | How you beat it |
|---|---|---|
| **Normal** | easy to read, and you can always stun, knock back or slow it | control it with your skills |
| **Elite** | tougher and hits harder. Some block from the front, others can't be staggered while they attack | go around a shield, break its guard, or dodge the big swing and punish the gap |
| **Boss** | can't be stunned or pushed around | wait for its **stun phase** |

Bosses ignore knockback and stuns, but they have **stun phases**: at certain points in the fight, or after a big attack misses, the boss staggers and is open for a short window. That's your moment. Heavy weapons like the Hammer are made for these windows.

## Name colours

One look at a name tells you what you're dealing with:

| Colour | Means |
|---|---|
| 🟢 Green | ordinary NPCs: villagers, shops. Talk to them |
| 🟡 Gold | important NPCs: the main quest and services like the Blacksmith. A `!` means a quest is waiting |
| 🔵 Blue | **guards**. They're on your side |
| 🔴 Red | monsters, shown with their level |
| 🟣 Purple | elites and bosses |

**City guards** fight monsters that come near on their own, then return to their post. They never attack players. And a monster killed only by guards gives no XP and no loot, so nobody can farm next to the gate.

## Chat channels

Chat has channels: **Global, Local, Party, Guild, Private and Shout**, each with its own tag and colour. Type `/chat` for a clickable channel bar to choose where you talk and what you see. Local is the default; Shout is for finding a group or trading, with a cooldown so it stays readable. NPC and system messages go only to the player they're for, so they don't flood everyone's chat.

## Thai and English

The game will launch in **Thai and English**. It picks the language from your Minecraft settings, and you can switch any time with `/lang`. Menus, quests, dialogue, item descriptions and the HUD are translated. Proper names (Bloodlines, skills, runes, places) stay the same in both languages, so everyone calls things by the same name. Player chat isn't translated.

*That's the design session done. Next: proving the tech in game.*
