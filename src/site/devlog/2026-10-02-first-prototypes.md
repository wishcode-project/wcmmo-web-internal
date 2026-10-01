---
title: Devlog #8 — The first prototypes pass
date: 2026-10-02
tag: Progress
summary: Guarding, guard breaks and skill sets now run on our test server, and testing changed how skills are cast.
---

Until this week everything on this site was a plan. Now two pieces of it run on our test server. Before building the full game we test the risky parts as small prototypes, seven in all, and the first two have passed.

## Combat: guards that mean something

The first prototype was the heart of combat, and all of it works:

- **Guard.** Hold Shift and attacks from the front are blocked. Your back is still open.
- **Guard break.** Certain skills smash a guard open and leave the target exposed.
- **Perfect guard.** Guard at the last moment and the attacker pays for it.
- **Super Armour.** Heavy moves can't be interrupted while they play out.
- **Boss stun phases.** Bosses shrug off stuns until you break them down, then give you a window.

One part is still open: we have tested this alone and against monsters. Next we test it player against player, and with twenty players at once to check the server stays smooth.

## Skills: now they belong to you

The second prototype was the skill bar, and testing it changed the design. This replaces what we wrote in Devlog #3.

**Skills belong to the player, not to the weapon.** Any skill you own can go in any of your **ten slots** (two sets of five), with one more slot for an ultimate. The weapon in your hand only decides whether a skill can be used right now.

**Skills are cast with three quick clicks.** The number keys were fighting with the normal hotbar, so we gave them back. Keys **1–9** are a plain hotbar again, for weapons, potions and food.

| Slot | Melee and magic | Bow and crossbow |
|---|---|---|
| 1 | R-L-R | L-R-L |
| 2 | R-R-R | L-L-L |
| 3 | R-L-L | L-R-R |
| 4 | R-R-L | L-L-R |
| 5 | L-R-L | R-L-R |

**F** switches between your two sets and **Q** fires the ultimate. You can switch weapons mid-fight: the new weapon can't make basic attacks for five seconds, but its skills work straight away. The timing of the clicks still needs tuning.

The [guide](/guide/skills) is updated to match.

## A dummy to hit

There's now a **training dummy** that shows the damage you deal per second, so we can compare builds with numbers instead of guesses. It will stay in the game for players.

## Wings

Every character gets a **wings slot**. Wings stay folded in town, spread in the wilds, and slow your fall. They don't fly. Their look follows your Bloodline, and better wings are earned by playing. The store will only ever sell wing skins.

## What's next

- The three Bloodlines (Fury, Ward, Pulse), tested on the dummy
- The on-screen HUD, to replace the placeholder text
- Filling in the full skill lists

*Two of seven prototypes done. Numbers and timings will change as we test.*
