# The Awakening: Tutorial & Bloodline Selection

> Source: team design (trailer / tutorial), added 2026-09-29 · Part of [GDD v2](wcmmo-gdd-v2.md) §2 · Contract: [spec 024](../docs/024-awakening-tutorial.md)
>
> **Update 2026-09-30 (D-48):** the affinities are now **Pulse / Ward / Fury** (Heart · compassion / Bone · endurance / Muscle · determination) with value trials. The BODY / MIND / FREEDOM triggers below are the original team draft; the current triggers are in spec 024 and the Bloodlines in [bloodlines.md](bloodlines.md).
>
> Sections 2–2.3 are the team's design text (formatting cleaned only). **Review notes** at the end are open points to settle before spec 024 can be READY.

## 2. The Awakening (Tutorial & Bloodline Selection)

Instead of a traditional UI dropdown to select a starting class, players undergo the **"Bloodline Trial"**. The narrative philosophy is: *"You do not choose the Bloodline. The Bloodline chooses you."*

However, this is governed by strict, behind-the-scenes tracking of player actions, so the evaluation during the tutorial is logical and bug-free.

### 2.1 The Hidden Affinity System (tracking logic)

The server uses internal variables (scoreboards or PlaceholderAPI) to track three affinities: **`BODY`** (melee/tank), **`MIND`** (magic/tactics) and **`FREEDOM`** (agility/ranger). Points are awarded by specific **event triggers** during the tutorial instance.

**Trial of Action (combat style tracking)**

| Player action | Trigger | Points |
|---|---|---|
| Takes > 50 % total HP damage but survives by brawling | damage taken | +2 `BODY` |
| Uses the provided ranged items/scrolls to kill enemies from afar | projectile / magic kill | +2 `MIND` |
| Sneaks (Shift) past a sleeping mob zone without waking them | region exit + stealth | +2 `FREEDOM` |

**Trial of Understanding (puzzle / obstacle tracking)**: a blocked gate.

| Player action | Trigger | Points |
|---|---|---|
| Breaks the cracked wall | block break / attack | +2 `BODY` |
| Finds and flips the hidden lever | interact | +2 `MIND` |
| Uses parkour to bypass via the roof | region enter | +2 `FREEDOM` |

### 2.2 The Judgment & tie-breaker logic

At the end of the Sanctum/Shrine tutorial, the system calculates the final scores.

- **Clear winner:** if the highest affinity leads the second-highest by **3 points or more**, the system automatically selects that Bloodline.
- **The Encounter (tie-breaker):** if the difference between the highest and second-highest is **2 points or less**, a "Bloodline Encounter" is triggered.
  - *Event:* two distinct visual entities (representing the tied Bloodlines) manifest in the room and argue their case (e.g. *"He belongs to the path of strength"* vs *"No, he understands the unseen"*).
  - *Resolution:* the player walks up to one of the entities and interacts with it to break the tie.

### 2.3 Player agency (the right to reject)

To balance narrative immersion with gameplay satisfaction, so players don't get stuck with a playstyle they dislike, there is a one-time rejection.

1. **The Reveal:** the chosen entity manifests and says *"This is who we see within you."*
2. **The Choice:** a clickable chat prompt or NPC dialogue menu:
   - `[Accept]` → locks in the Bloodline permanently.
   - `[Reject]` → *"I forge my own path."* (usable only once).
3. **The Fallback:** if rejected, a standard selection GUI opens and the player manually picks one of the **3 base Bloodlines**.
4. **Post-tutorial rule:** once the tutorial is exited, the choice is permanent. Any later change needs a highly valuable **Extraction Item**, which drives the mid/end-game economy.

---

## Review notes (Claude, 2026-09-29): to settle before spec 024 is READY

| # | Point | Why it matters | Proposal | Decision |
|---|---|---|---|---|
| R1 | **Every trigger gives +2**, so score gaps are always even (0, 2, 4, 6…). "≥ 3" really means "≥ 4", and "≤ 2" means "0 or 2" | Works, but the thresholds read as if odd gaps were possible | Keep the rule, write it as: *gap ≥ 4 → clear winner; gap ≤ 2 → Encounter* | D-46 |
| R2 | **Three-way tie** (e.g. 2/2/2) and **all zero** (0/0/0) are possible | The Encounter shows only 2 entities | 3-way tie → **3 entities** appear; all zero → 3 entities + a line like *"We cannot see you yet…"* | D-46 |
| R3 | Can one trial award **several** affinities? (e.g. a player brawls *and* sneaks) | Changes how often clear winners happen | Trial of Understanding: **first** solution only (gate opens, other paths lock). Trial of Action: every trigger can fire once | D-46 |
| R4 | "> 50 % HP damage but survives by brawling" is vague | Needs an exact event rule to be bug-free | Cumulative damage taken ≥ 50 % of max HP during the trial **and** ≥ 1 kill with a melee hit **and** player didn't die | spec 024 |
| R5 | "Kill from afar": what distance? | Same | Kill with the provided scroll/bow while ≥ 6 blocks from the target | spec 024 |
| R6 | "Sneak past without waking them" | Same | Enter and exit the sleeping-zone region while sneaking the whole time, and no mob in that region targeted the player | spec 024 |
| R7 | Puzzle blocks and mobs must **reset per player** | Two players in one world would break each other's trial | Tutorial runs in a **per-player instance**. MythicDungeons isn't owned, so: buy it (TM5) or build a small instance module in `wcmmo-core` (shared with Lifezone code) | D-45 |
| R8 | The 3 base Bloodlines map 1:1 to the affinities | Tells us what M1 has to design | `BODY` → Berserker (the existing design), `MIND` → caster Bloodline (name TBD), `FREEDOM` → ranger/agility Bloodline (name TBD) | D-31 |
| R9 | After a **Reject**, can the player pick the same Bloodline in the GUI? | Edge case | Yes, all 3 are listed. The GUI is built with UltimateUI (D-39) | spec 024 |
| R10 | Disconnect or crash mid-tutorial | Player could lose progress or exploit a restart | Affinity scores + trial state saved per player; on rejoin, restart the current trial (not the whole tutorial). Reject flag is saved immediately | spec 024 |
| R11 | Encounter/Reveal lines use "He" | Players are any gender | Keep all lines neutral ("They belong…", "you"), translated via Triton | spec 024 |
| R12 | Tracking tool: scoreboards vs PlaceholderAPI | Scoreboards are easy to edit by accident and clutter `/scoreboard` | Our plugin stores scores (DB) and **exposes** them as placeholders `%wcmmo_affinity_body%` etc. for MythicMobs, LuxDialogues and MythicHUD | spec 024 |
| R13 | Tuning data | We'll want to know how players are judged | Log each result (scores, clear/encounter, accepted/rejected, final Bloodline) to a DB table | spec 024 |
| R14 | Name clash: tutorial "The Awakening" vs Bloodline stage 5 "Awakened" | Players and docs may mix them up | Rename one (e.g. stage 5 → "Ascended"), or keep both on purpose as a story link | owner |
