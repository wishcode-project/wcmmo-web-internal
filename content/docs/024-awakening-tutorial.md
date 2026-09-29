# 024 — The Awakening: tutorial & Bloodline Trial

> Status: DRAFT · Target: wcmmo-plugins (`awakening` module), wcmmo-content (MythicMobs, LuxDialogues, UltimateUI, Nexo), wcmmo (WorldGuard, tutorial world) · FIRE mode: validate
> Design: [Awakening tutorial](../gdd/awakening-tutorial.md) · [GDD v2 §2](../gdd/wcmmo-gdd-v2.md#2-classless-system-bloodlines--runes) · Decisions: D-31, D-32, D-33, D-45, D-46

## Big picture

- **Player story:** As a new player, I play a short trial in a shrine. I'm never asked "pick a class". The Bloodline that matches how I played reveals itself, and I can accept it or reject it once and choose myself.
- **Done means:** a new player goes from first join → trial → judgment → reveal → accept/reject → Bloodline bound (spec 021) → leaves the tutorial into Chapter 1 (spec 016), with every score and choice saved and logged.

## Flow

```txt
first join → tutorial instance (per player)
  → Trial of Action      (combat: BODY / MIND / FREEDOM triggers)
  → Trial of Understanding (gate puzzle: first solution only)
  → Sanctum / Shrine: Judgment
       gap ≥ 4  → winner Bloodline
       gap ≤ 2  → Bloodline Encounter (2 or 3 entities) → player interacts with one
  → Reveal: "This is who we see within you."
       [Accept] → bind Bloodline (spec 021), lock
       [Reject] (once) → "I forge my own path." → selection GUI (3 base Bloodlines) → bind, lock
  → exit tutorial → Chapter 1 (spec 016). Bloodline now only changeable with the Extraction Item.
```

## Systems & config

| Repo | File / module | What |
|---|---|---|
| wcmmo-plugins | `awakening` module | instance lifecycle, affinity scoring, trial state, judgment, reveal/reject, logging, placeholders |
| wcmmo-plugins | instance support (D-45) | per-player copy of the tutorial world/region (shared with Lifezone code), or MythicDungeons if bought |
| wcmmo | `wcmmo_tutorial` template world + WorldGuard regions below | built by the map team |
| wcmmo-content | MythicMobs | trial mobs (brawlers, ranged targets, sleeping mobs), Encounter/Reveal entities (ModelEngine models) |
| wcmmo-content | LuxDialogues | Encounter arguments, Reveal, Accept/Reject dialogue |
| wcmmo-content | UltimateUI | manual Bloodline selection GUI after Reject (D-39) |
| wcmmo-content | MMOItems | tutorial kit: 1 melee weapon + ranged scrolls/bow |

## Scoring rules

| Trial | Trigger (exact rule) | Affinity | Points | Max times |
|---|---|---|---|---|
| Action | cumulative damage taken ≥ 50 % of max HP during the trial **and** ≥ 1 kill by melee hit **and** player did not die | BODY | +2 | 1 |
| Action | ≥ 1 kill with the provided scroll/bow from ≥ 6 blocks away | MIND | +2 | 1 |
| Action | entered **and** exited `wcmmo_tutorial__sleeping_zone` sneaking the whole time, and no mob in that region targeted the player | FREEDOM | +2 | 1 |
| Understanding | cracked wall broken (block break / attack on the wall block) | BODY | +2 | first solution only |
| Understanding | hidden lever flipped | MIND | +2 | first solution only |
| Understanding | entered `wcmmo_tutorial__roof_bypass` region | FREEDOM | +2 | first solution only |

After the first Understanding solution, the gate opens and the other two paths are disabled (D-46).

### Judgment

Let `a ≥ b ≥ c` be the sorted scores.

| Case | Condition | Result |
|---|---|---|
| Clear winner | `a − b ≥ 4` | winner's Bloodline is revealed |
| Two-way Encounter | `a − b ≤ 2` and `b > c` | 2 entities: the top two |
| Three-way Encounter | `a − b ≤ 2` and `b == c` (includes 2/2/2 and 0/0/0) | 3 entities; for 0/0/0 add the line *"We cannot see you yet…"* |

(All steps are +2, so a gap of exactly 3 can't happen: "≥ 3" in the design = "≥ 4" here.)

## Data & IDs

| ID | Kind |
|---|---|
| `wcmmo_tutorial` | template world |
| `wcmmo_tutorial__trial_action`, `wcmmo_tutorial__sleeping_zone`, `wcmmo_tutorial__trial_gate`, `wcmmo_tutorial__roof_bypass`, `wcmmo_tutorial__sanctum` | regions |
| `%wcmmo_affinity_body%`, `%wcmmo_affinity_mind%`, `%wcmmo_affinity_freedom%` | placeholders (read-only) |
| `wcmmo_mob_tutorial_brawler`, `wcmmo_mob_tutorial_target`, `wcmmo_mob_tutorial_sleeper` | trial mobs |
| `wcmmo_mob_spirit_body`, `wcmmo_mob_spirit_mind`, `wcmmo_mob_spirit_freedom` | Encounter / Reveal entities |
| `wcmmo_item_tutorial_blade`, `wcmmo_item_tutorial_scroll` | tutorial kit |
| `wcmmo_v1_awakening_state` | DB: `player_uuid`, `stage`, `body`, `mind`, `freedom`, `gate_solution`, `reject_used`, `updated_at` |
| `wcmmo_v1_awakening_log` | DB: `player_uuid`, `scores`, `judgment` (clear / encounter2 / encounter3), `revealed`, `accepted`, `final_bloodline`, `created_at` |
| `wcmmo.awakening.skip` | permission (staff/testing) |

Affinity → Bloodline (D-31): `BODY` → `wcmmo_bloodline_berserker` (proposed) · `MIND` → TBD · `FREEDOM` → TBD.

## Balance (proposed)

| Setting | Value |
|---|---|
| Target tutorial length | 8–12 min |
| Trial mobs damage | tuned so a brawling player can reach 50 % damage taken without dying |
| Reject uses | 1 (saved the moment it's clicked) |

## Commands & permissions

| Command | Permission | Behaviour |
|---|---|---|
| `/wcmmo awakening reset <player>` | `wcmmo.admin.awakening` | wipe state, send back to trial start |
| `/wcmmo awakening skip <player> <bloodline>` | `wcmmo.awakening.skip` | testers/staff skip straight to bind |
| `/wcmmo awakening debug` | `wcmmo.admin.awakening` | action-bar shows live affinity scores |

## Rules for text

- All lines gender-neutral ("they", "you") and translated with Triton (D-27).

## Performance

One small instance per new player; unload 30 s after the player leaves. Target: 20 concurrent tutorials with MSPT ≤ 40.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 1 | Brawl (take > 50 % HP, melee kill), break the wall | BODY 4 → clear winner, Berserker revealed |
| 2 | Ranged kill + lever | MIND 4 → clear MIND reveal |
| 3 | Brawl + lever | BODY 2 / MIND 2 → 2-entity Encounter |
| 4 | Do nothing scoreable (only walk the path) | 0/0/0 → 3 entities + "cannot see you yet" |
| 5 | Break wall, then also try lever | lever disabled, only BODY counted |
| 6 | Reveal → Reject → GUI → pick same Bloodline | allowed, bound, Reject no longer offered |
| 7 | Disconnect mid Trial of Understanding, rejoin | back at the start of that trial, earlier scores kept |
| 8 | Exit tutorial, try `/bloodline` change without extractor | refused |
| 9 | Check `wcmmo_v1_awakening_log` | one row per finished tutorial |

## Rollback

Disable the module → new players get the manual selection GUI directly. Awakening data is player data: DB backup before prod changes.

## Acceptance criteria

- [ ] D-31 (MIND/FREEDOM Bloodlines designed), D-45, D-46 decided.
- [ ] All 9 tests pass on the dev box.
- [ ] Map team has built the tutorial world with the regions above.

## Open questions

- D-45: instance tech (MythicDungeons vs own module).
- Tutorial named "The Awakening" while Bloodline stage 5 is "Awakened": rename one to avoid confusion?
