# WC-MMO — Bloodlines: design & build guide

> Version 1 · 2026-09-30 · Owner: Tatoo · Decisions: D-31, D-48 (decided 2026-09-30) · Contract: [spec 021](../docs/021-bloodlines.md) · Tutorial: [spec 024](../docs/024-awakening-tutorial.md)
>
> Tone: **Black Desert**, dark and grounded fantasy. Only the first city's *look* is Thai-inspired; Bloodlines are not.
> All numbers are **starting values** for tuning. They live in one config file so balance changes never need code changes.

## 1. What a Bloodline is

- One Bloodline slot per character. It changes **how** you play, not just how hard you hit (like PoE2's bloodlines / ascendancies).
- First Bloodline: chosen by The Awakening tutorial (spec 024). Later changes: the extractor item (spec 021).
- **New Bloodlines keep arriving with the story.** There is no fixed number. The 3 base Bloodlines are the reference every new one is balanced against (§7).
- Lore: the base three are **Muscle, Bone and Heart**: parts of one body. The player's past self tried to unite every Bloodline into one "complete body" (lore bible §2). New Bloodlines continue the theme (Eye, Breath, Blood, Nerve…).

## 2. The three base Bloodlines

| | **Fury** | **Ward** | **Pulse** |
|---|---|---|---|
| Body part (lore) | Muscle | Bone | Heart |
| Core axis | **Risk:** your HP is a resource; lower HP = stronger | **Timing:** guard at the right moment, store power, release it | **Flow:** chain *different* skills to keep a rhythm that heals and hurts |
| Rewards players who | push forward, never back off | stay calm and read enemies | keep a steady rotation |
| Weakness | fragile; one mistake can end the fight | low early damage; must let enemies attack first | no big spike; spamming one skill breaks the rhythm |
| Solo strength | fastest clears | best survival | most consistent in long fights |
| Party bonus (never required) | damage | tank | support |
| Tutorial trial theme | determination (push through) | endurance (hold your ground) | compassion (help others) |
| Visual identity | red-black blood mist, cracks glowing on the skin | pale bone plating, stone dust on each block | light waves on the heartbeat, glowing threads on Bond |
| Display name | **Bloodline of Fury** | **Bloodline of Ward** | **Bloodline of Pulse** |

**Naming rule for every Bloodline:** one easy English word that says what it does. New ones follow it (e.g. *Eye*, *Gale*).

## 3. Rules every Bloodline follows

### 3.1 Solo first
1. Every Bloodline gives the player, **on their own**: a way to recover, a way to raise damage, and a way to survive a mistake.
2. Anything that affects allies is a **bonus**: at most **50 %** of the self value, and it must have a **solo version** when there is no ally (e.g. taunt → slow).
3. Works with **every weapon** (melee, ranged, magic). Role comes from Bloodline + weapon + runes together.

### 3.2 Build paths (PoE2-style choices)
- **Stage 1** (passive) and **Stage 4** (active skill) are fixed: they are the Bloodline's identity.
- **Stages 2, 3 and 5** each offer **two paths: A or B**. Choose one when the stage unlocks.
- 2 × 2 × 2 = **8 builds per Bloodline**, before weapons and runes.
- Change a path later at the **Bloodline Keeper** NPC for a fee (gold sink, price set with the economy design).
- Path A leans on survival or utility, path B leans on damage. Mixing is allowed and expected.

### 3.3 Stages (D-34)
| Stage | Requirement |
|---|---|
| 1 | bound in the tutorial (or with an extractor) |
| 2 | Lv 20 + stage-2 unlock materials |
| 3 | Lv 40 + stage-3 materials |
| 4 | Lv 60 + stage-4 materials |
| 5 (Awakened) | Lv 60 + awakening quest + stage-5 materials |

Materials come from dungeons or lifeskills (names TBD, `wcmmo_item_bloodline_seal_<stage>`).

## 4. Fury: the harder you're hit, the harder you hit

**HUD:** screen edge glows red below 30 % HP · cooldown icon for the stage-5 path.

| Stage | Path | Name | Effect | Numbers |
|---|---|---|---|---|
| 1 | fixed | **Adrenaline** | Attack speed up while HP is low | +20 % attack speed while HP < 30 % |
| 2 | A | **Pain is Power** | Taking damage restores stamina | 10 % of damage taken, max 15 per hit |
| 2 | B | **Bloodthirst** | Kills heal you | heal 5 % max HP per kill, 0.5 s internal CD |
| 3 | A | **Unstoppable** | Charge / heavy skills gain Super Armour while active | skills tagged `charge` or `heavy` |
| 3 | B | **Frenzy** | Hits stack damage while below half HP | +2 % damage per hit, max 10 %, HP < 50 %, stacks drop 3 s after the last hit |
| 4 | fixed (active) | **Blood Rage** | Pay HP to reset all skill cooldowns | pay 25 % current HP · cooldown 90 s · can't be used below 10 % HP |
| 5 | A | **Death Defying** | A fatal hit leaves you at 1 HP, then you fight on with Super Armour, reduced damage and a fast heal | 3 s: Super Armour + −50 % damage taken + heal 20 % max HP over the 3 s · internal CD 300 s |
| 5 | B | **Last Rampage** | Deep in danger you become a monster | HP < 15 %: +30 % damage, 10 % lifesteal |

**Solo kit:** recovery (2A stamina / 2B kill heals) · damage (Adrenaline, Frenzy, Blood Rage) · survival (Unstoppable, Death Defying).

## 5. Ward: guard, store, release

**HUD:** 5 shield pips (Bulwark stacks) · perfect-guard flash.

| Stage | Path | Name | Effect | Numbers |
|---|---|---|---|---|
| 1 | fixed | **Unbroken** | Each Frontguard block gives a Bulwark stack; each stack reduces damage taken | +1 stack per block, max 5 · −3 % damage taken per stack · lose 1 stack every 4 s without a block |
| 2 | A | **Counterweight** | A **perfect guard** staggers the attacker and restores stamina | perfect guard = guard started ≤ 0.3 s before the hit · attacker staggered 1 s · +15 stamina · +2 stacks |
| 2 | B | **Thornhide** | Blocks reflect damage | reflect 15 % of the blocked hit's original damage |
| 3 | A | **Iron Stance** | At 5 stacks, become immovable | 3 s CC immunity + −30 % damage taken · consumes all stacks · 10 s CD |
| 3 | B | **Marrow Break** | At 5 stacks, the next skill spends them for a heavy blow | +50 % damage + Super Armour for that skill |
| 4 | fixed (active) | **Bone Bastion** | Bone armour absorbs damage. Solo: enemies hitting it take reflected damage and slow down. In a party it also draws enemy attention | absorbs 30 % max HP for 4 s · reflect 20 % · slow 30 % · cooldown 45 s |
| 5 | A | **Last Stand** | A single huge hit is halved and fills Bulwark | hit > 40 % max HP → damage × 0.5, stacks → 5 · internal CD 60 s |
| 5 | B | **Retribution** | Perfect guards charge an automatic counter | every 3rd perfect guard → instant counter-strike at 150 % weapon damage |

**Solo kit:** recovery (Counterweight stamina, Bulwark mitigation) · damage (Thornhide, Marrow Break, Retribution) · survival (the best of the three).

## 6. Pulse: keep the rhythm

**Rhythm rule:** each skill cast that is **different from the previous one** adds 1 Rhythm. Repeating the same skill resets Rhythm to 0. At 3 Rhythm a **Pulse** fires and Rhythm goes back to 0.

**HUD:** 3 rhythm beats · Bond thread icon on the linked target.

| Stage | Path | Name | Effect | Numbers |
|---|---|---|---|---|
| 1 | fixed | **Rhythm** | Every 3 different skills in a row release a Pulse around you: heals you, hurts enemies. Allies nearby get half the heal (bonus) | heal 4 % max HP · 30 % weapon damage in 5 blocks · ally heal 2 % |
| 2 | A | **Shared Breath** | All your healing (Pulse, food, potions) also restores stamina and mana; overhealing becomes a shield | restore 10 % of the heal amount · shield max 10 % max HP (vanilla absorption) |
| 2 | B | **Crescendo** | Each Pulse raises your damage | +5 % damage for 5 s, stacks to 3 |
| 3 | A | **Bond** | Hitting an enemy links you to it: damage you deal to it heals you. Sneak-hit an ally to link to them instead (bonus: you take part of their damage) | lifesteal 12 % on the linked enemy · ally link: take 20 % of their damage · one link at a time, 8 s after the last hit |
| 3 | B | **Echo** | Every Pulse repeats once | second Pulse at 50 % power, 1 s later |
| 4 | fixed (active) | **Heartbeat Surge** | For a short time every skill releases a Pulse | 6 s · cooldown 60 s |
| 5 | A | **Resonance** | Pulses cleanse and protect; the linked target is pulsed again | Pulse removes 1 debuff · shield max 20 % · linked target gets a second Pulse (enemy: damage, ally: heal) |
| 5 | B | **Symphony** | A long unbroken chain frees your next skill | 5 different skills in a row → next skill has no cooldown (internal CD 20 s) |

**Solo kit:** recovery (the best of the three: Pulse, Bond lifesteal, shields) · damage (Pulse damage, Crescendo, Echo) · survival (shield, cleanse).
**Not a healer class:** Bond links to **enemies** by default; linking to an ally is optional.

## 7. Keeping future Bloodlines worth choosing

| # | Rule | Why |
|---|---|---|
| 1 | The base three are **generalists**: good at everything, best at nothing extreme | leaves room for specialists |
| 2 | New Bloodlines are **specialists**: clearly best at one thing, weaker elsewhere (e.g. *Eye*: best long-range precision, worst survival) | a reason to pick them without making the base three useless |
| 3 | A new Bloodline must bring a **new core axis** (like risk, timing, flow). "Fury but +10 %" is not allowed | variety, not power creep |
| 4 | **Same power budget** for every Bloodline, checked by the benchmark below | nobody is strictly better |
| 5 | All numbers live in **one config file** | re-tune without code changes or player data changes |
| 6 | New Bloodlines are unlocked **through the story** and start at stage 1 | they are earned, not a shortcut |
| 7 | The in-game extractor **keeps progress** | players can try a new Bloodline and come back without losing anything |

### Benchmark (every Bloodline, same gear, same weapon, same runes)

| Test | Measures | Expected leader |
|---|---|---|
| A: clear a 20-mob pack | time | Fury |
| B: 3-minute solo boss | time + HP lost | Pulse |
| C: 90-second survival wave | survived? HP left | Ward |

**Pass:** each Bloodline leads **exactly one** test (its own niche), and the combined score is within **±15 %** of the others. Run it on every build path pair (A/B) that changes damage or survival a lot, and again for every new Bloodline.

### New-Bloodline checklist
- [ ] New core axis, described in one sentence
- [ ] Solo kit complete (recover / damage / survive)
- [ ] Ally effects ≤ 50 % of self values, with a solo version
- [ ] Stage 1 + stage 4 fixed, stages 2/3/5 with A/B paths
- [ ] Benchmark within ±15 %, leads its own niche test only
- [ ] One-word name, body-part theme in lore, visual identity
- [ ] Tutorial: not selectable in The Awakening (base three only); unlocked through the story

## 8. How we build it (Skript-first, D-25 / D-47)

| Piece | Tool | Notes |
|---|---|---|
| Who has which Bloodline, stage, paths | Skript variables (MySQL-backed option) · target tables `wcmmo_v1_bloodline_player` / `_progress` | `variables.csv` never in git |
| Values for HUD, MythicMobs, conditions | **skript-placeholders**: `%wcmmo_bloodline%`, `%wcmmo_bloodline_stage%`, `%wcmmo_bl_path_2%` / `_3` / `_5`, `%wcmmo_ward_bulwark%`, `%wcmmo_pulse_rhythm%` | MythicHUD reads them |
| Damage taken / dealt, fatal hits | Skript `on damage` (cancel + set HP to 1 for Death Defying; scale damage for Bulwark, Last Stand) | |
| Guard and perfect guard | combat-state script from spec 009 (guard flag + time the guard started + attacker in front cone) | shared by Ward |
| Skill-cast events (Pulse rhythm, Blood Rage reset) | **skript-reflect** listening to the MythicLib / MMOCore cast event | ⚠️ confirm the event class and how to reset cooldowns in PoC-7 |
| Attack speed / damage buffs | MythicLib stat modifiers via skript-reflect, or MythicMobs auras | ⚠️ choose in PoC-7 |
| Stamina / mana | MMOCore resources (API or admin command) | |
| Shields | vanilla absorption (gold hearts) | shown by MythicHUD too |
| Effects, sounds, particles | MythicMobs skills, cast on the player through skript-reflect | |
| Models (bone plating, heart waves) | ModelEngine | optional, later |
| Stage-4 active skills | MMOCore skill that runs a MythicMobs skill: sits in the 10-slot bar with normal cooldowns (spec 007) | |
| Path choice and respec | Skript + UltimateUI screen at the Bloodline Keeper NPC | |
| All numbers | one config (`plugins/Skript/scripts/wcmmo_bloodline_config.sk`, or a YAML read by the script) | |

**Performance:** Pulse rhythm and Ward's guard checks run on every hit / cast. PoC-7 must report `/spark` numbers; heavy parts are the first candidates for our own plugin after the Phase 0 review (D-25).

**PvP (arenas, later):** shields, heals and reflect at **50 %** in PvP.

## 9. Open items

| # | Item |
|---|---|
| B1 | Stage unlock material names and sources per Bloodline |
| B2 | Path respec price (economy design) |
| B3 | Tune every number with the benchmark after PoC-7 |
| B4 | First story-unlocked Bloodline (which body part, which chapter) |
