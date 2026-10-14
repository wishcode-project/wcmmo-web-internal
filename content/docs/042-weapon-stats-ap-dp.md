# 042 — Weapon stats from worn equipment: AP, DP, crit, status screen

> Status: DONE · Target: wcmmo (MMOItems, MythicLib, MythicMobs skills, Skript kit, MythicHUD) · FIRE mode: confirm
> Design: GDD v2 §3 / §4 · Decisions: **D-44** (decided here), D-69 / D-79 (off-hand), D-77 (worn weapons), D-80 (damage numbers), D-13b (AP / DP)
> Answers: M18 (dual swords / sword & shield = their own weapon types for Mastery), M23 (off-hand: half its AP, the rest in full) — owner, 2026-10-15

## Big picture

- **Player story:** the weapons, shield, grimoire, necklace and rings I wear all add up to my stats. My skills hit harder with a better weapon, can crit, and the enemy's defence lowers them. I can see my totals on the HUD and in a status screen, and where each number comes from.
- **Owner, 2026-10-15:** "weapons are MMOItems with stats; when worn in /equip compute damage as AP / DP with crit, and show an overall status: necklace, weapons, plus skill bonuses."
- **Done means:** a worn MMOItems weapon changes the damage of every skill and basic attack; `/wcmmostats` and the HUD panel show the totals.

## D-44 decided

| Before | Now |
|---|---|
| Weapons are MythicMobs (Crucible) items, no stats; every skill has a fixed damage number | Weapons are **MMOItems** items (`WCMMO_<TYPE>`), same models / look. The kit keeps owning every input (D-68): items never cast skills themselves |

## Stats from what is worn

| Slot | Counted by | Rule |
|---|---|---|
| Helmet, chestplate, leggings, boots, wings, necklace, rings | MMOItems + MMOInventory (accessory / armour slots) | in full |
| **Weapon right** | **the kit** (MMOItems only counts weapons held in the hand) | in full |
| **Weapon left** (2nd sword, shield, grimoire) | the kit | **AP at 50 %**, every other stat in full (M23) |

The kit reads the worn weapons' MMOItems stats and puts them on the player as MythicLib stat modifiers (key `wcmmo_worn_<slot>_<stat>`), refreshed when the worn slots change. Stats read: attack damage, crit chance / power (weapon and skill), skill / physical / magic / weapon / projectile damage %, defence, max HP / mana / stamina, cooldown reduction, attack speed.

## AP, DP, crit

| | Meaning | Source |
|---|---|---|
| **AP** | attack power | MythicLib `ATTACK_DAMAGE` total (weapons + accessories; enhancement later, spec 013) |
| **DP** | defence | MythicLib `DEFENSE` total (armour, shield, accessories) |
| Crit | chance and power, weapon and skill | MythicLib `CRITICAL_STRIKE_*` / `SKILL_CRITICAL_STRIKE_*` |

- **Every skill and basic attack deals a % of AP**: `damage{a=<caster.var.wcmmo_ap>*ratio}` (the kit writes AP to the player's MythicMobs variable `wcmmo_ap`). **MythicLib's `mmodamage` is broken on MythicMobs 5.13** (`NoSuchMethodError`, test server 2026-10-15), so the kit's combat pipeline adds skill / basic-attack %, physical / magic % and the **crit roll** (`wcmmo_hitMultiplier`; crit plays `wcmmo_fx_crit`; the number is not bold, MythicLib doesn't know it was a crit). The packs' own 10 % random crits are removed.
- Ratios replace today's fixed numbers 1:1 against a **wooden-tier AP of 10**: a skill that dealt 2 now deals 20 % of AP (= 2 with a wooden weapon, more with better ones). The tables in specs 036–041 read as "% of AP × 10".
- **DP:** MythicLib's defence formula (`MythicLib/config.yml`, `defense-application`) for now; the zone soft cap (spec 014) multiplies on top later.
- Stats, Runes, Mastery and Bloodlines never add AP / DP (spec 013 compartment rule) — enforced by item design, not code.

## Weapon types and Mastery (M18)

| Stance | Skills fit (`WCMMO_` type) | Mastery profession |
|---|---|---|
| single sword | `WCMMO_SWORD` | `mastery_sword` |
| **dual swords** | `WCMMO_SWORD` | **`mastery_dual_sword`** (new) |
| **sword & shield** | `WCMMO_SWORD` | **`mastery_sword_shield`** (new) |
| spear / bow / staves | as before | as before |

Mastery XP and the Mastery cooldown reduction follow the **worn stance**, not the held item (today worn weapons earn no Mastery at all).

## Status display

- **HUD (spec 029):** Volya's stats panel (toggle in `/mmohud`) shows AP, crit, DP and more from MMOCore placeholders.
- **`/wcmmostats`:** a screen with every total (AP, DP, crit chance / power, skill crit, attack speed, HP / Mana / Stamina, skill damage %, cooldown reduction) and, per item worn, what it adds.

## Phases

| # | Work | Status |
|---|---|---|
| 1 | MMOItems items for every worn weapon (same ids in lower case, same models); the kit reads MMOItems ids too | built |
| 2 | Worn weapon stats → player modifiers (right 100 %, left AP 50 %) | built |
| 3 | Skills and basic attacks: fixed numbers → % of AP (+ kit crit / bonuses) | built |
| 4 | Mastery per worn stance, new professions (M18) | built |
| 5 | `/wcmmostats` screen; HUD panel | `/wcmmostats` built; HUD panel = Volya's (toggle in `/mmohud`) |

## First item stats (test values, tier per D-70)

| Item (`/mi give <TYPE> <ID>`) | Type | AP | Other |
|---|---|---|---|
| `WCMMO_ITEM_SWORD_WOOD` | WCMMO_SWORD | 10 | |
| `WCMMO_ITEM_SWORD_IRON` | WCMMO_SWORD | 14 | crit 3 % |
| `WCMMO_ITEM_SWORD_DRACONIC` | WCMMO_SWORD | 18 | crit 6 %, crit damage +10 % |
| `WCMMO_ITEM_SHIELD_WOOD` / `_IRON` | WCMMO_SHIELD (new) | 2 / 3 | DP 4 / 7 |
| `WCMMO_ITEM_SPEAR_WOOD` | WCMMO_SPEAR | 12 | two-handed |
| `WCMMO_ITEM_BOW_WOOD` | WCMMO_BOW | 11 | two-handed |
| `WCMMO_ITEM_STAFF_WOOD` | WCMMO_STAFF | 12 | Mana +20, two-handed |
| `WCMMO_ITEM_STAFF_ARC` | WCMMO_STAFF | 14 | skill crit 5 %, Mana +20 |
| `WCMMO_ITEM_GRIMOIRE_ARC` | WCMMO_TOME | 4 (2 in the left slot) | skill damage +5 %, Mana +30 |

Old Crucible weapons (`/mm items give … wcmmo_item_…`) still work and count as **AP 10** (`cfg::stats::legacyAp`) until they are replaced.

## Open questions

- ~~Does MMOItems also count a weapon worn in an accessory slot?~~ No double count (owner checked in game, 2026-10-15).
- Item stat values per tier (wood / iron / pack colours, D-70): first numbers in phase 1, real balance with the item lists.

## Implementation log

| Date | Repo | FIRE run | PR / branch | Notes |
|---|---|---|---|---|
| 2026-10-15 | wcmmo-specs | — | — | Spec written from the owner's answers (D-44, M18, M23) |
| 2026-10-15 | wcmmo | — | `feat/042-weapon-stats` | Phases 1–5 built (`7da2556`). Test server: the 9 MMOItems items load (id, stats, models ok); a converted skill scales with AP (spear / dual slash: AP 10 → 1.9, AP 20 → 3.9 on a husk); `mmodamage` found broken. Player-side (stat modifiers, crit, /stats, Mastery) needs a player to try |
| 2026-10-15 | wcmmo | — | `feat/042-weapon-stats` | Owner: `/stats` / `/status` clash with CMI: the screen is **`/wcmmostats`** |
| 2026-10-15 | wcmmo | — | `develop` (`eb7673d`) | Owner tested in game (AP, crit, off-hand half, Mastery, `/wcmmostats`): pass. Merged into develop |
