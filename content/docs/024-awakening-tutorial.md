# 024 — The Awakening: tutorial & Bloodline Trial

> Status: DRAFT · Target: wcmmo-plugins (`awakening` module), wcmmo (MythicMobs, LuxDialogues, UltimateUI, Nexo), wcmmo (WorldGuard, tutorial world) · FIRE mode: validate
> Design: [Awakening tutorial](../gdd/awakening-tutorial.md) · [bloodlines.md](../gdd/bloodlines.md) · [GDD v2 §2](../gdd/wcmmo-gdd-v2.md#2-classless-system-bloodlines--runes) · Decisions: D-31, D-32, D-33, D-45, D-46, D-48

## Big picture

- **Player story:** As a new player, I play a short trial in a shrine. I'm never asked "pick a class". The Bloodline that matches how I played reveals itself, and I can accept it or reject it once and choose myself.
- **Done means:** a new player goes from first join → trial → judgment → reveal → accept/reject → Bloodline bound (spec 021) → leaves the tutorial into Chapter 1 (spec 016), with every score and choice saved and logged.

## Flow

```txt
first join → tutorial instance (per player)
  → Trial of Action      (combat: PULSE / WARD / FURY triggers)
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
| wcmmo | `plugins/Skript/scripts/wcmmo_awakening_*.sk` (optional first version) | trigger checks and cutscene steps can be prototyped in Skript for the trailer, then moved to Kotlin (D-47) |
| wcmmo-plugins | instance support (D-45) | per-player copy of the tutorial world/region (shared with Lifezone code), or MythicDungeons if bought |
| wcmmo | `wcmmo_tutorial` template world + WorldGuard regions below | built by the map team |
| wcmmo | MythicMobs | trial mobs (attackers of the wounded NPC, hold-ring wave, the brute), Encounter/Reveal spirits for Fury / Ward / Pulse (ModelEngine models) |
| wcmmo | LuxDialogues | Encounter arguments, Reveal, Accept/Reject dialogue |
| wcmmo | UltimateUI | manual Bloodline selection GUI after Reject (D-39) |
| wcmmo | MMOItems | tutorial kit: 1 melee weapon + ranged scrolls/bow |

## Scoring rules

Affinities (D-48, decided 2026-09-30): **`pulse`** (Heart · compassion), **`ward`** (Bone · endurance), **`fury`** (Muscle · determination). Each maps 1:1 to a base Bloodline (spec 021).

| Trial | Trigger (exact rule) | Affinity | Points | Max times |
|---|---|---|---|---|
| Action | the wounded NPC `wcmmo_npc_tutorial_wounded` survives the attack wave **and** the player dealt the killing blow to ≥ 1 attacker that was targeting the NPC | pulse | +2 | 1 |
| Action | the player stayed inside `wcmmo_tutorial__hold_ring` for the whole wave (never left it) **and** blocked ≥ 3 hits with Frontguard | ward | +2 | 1 |
| Action | the player killed `wcmmo_mob_tutorial_brute` (the big enemy) | fury | +2 | 1 |
| Understanding | freed the trapped villager first (hidden lever that opens their cage, which also opens the gate) | pulse | +2 | first solution only |
| Understanding | walked the dark / fire path `wcmmo_tutorial__fear_path` from entry to exit without stepping back out of it | ward | +2 | first solution only |
| Understanding | broke the cracked wall | fury | +2 | first solution only |

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
| `wcmmo_tutorial__trial_action`, `wcmmo_tutorial__hold_ring`, `wcmmo_tutorial__trial_gate`, `wcmmo_tutorial__fear_path`, `wcmmo_tutorial__sanctum` | regions |
| `%wcmmo_affinity_pulse%`, `%wcmmo_affinity_ward%`, `%wcmmo_affinity_fury%` | placeholders (read-only) |
| `wcmmo_mob_tutorial_raider`, `wcmmo_mob_tutorial_wave`, `wcmmo_mob_tutorial_brute` | trial mobs |
| `wcmmo_mob_spirit_pulse`, `wcmmo_mob_spirit_ward`, `wcmmo_mob_spirit_fury` | Encounter / Reveal entities |
| `wcmmo_npc_tutorial_wounded`, `wcmmo_npc_tutorial_trapped` | trial NPCs |
| `wcmmo_item_tutorial_blade`, `wcmmo_item_tutorial_scroll` | tutorial kit |
| `wcmmo_v1_awakening_state` | DB: `player_uuid`, `stage`, `pulse`, `ward`, `fury`, `gate_solution`, `reject_used`, `updated_at` |
| `wcmmo_v1_awakening_log` | DB: `player_uuid`, `scores`, `judgment` (clear / encounter2 / encounter3), `revealed`, `accepted`, `final_bloodline`, `created_at` |
| `wcmmo.awakening.skip` | permission (staff/testing) |

Affinity → Bloodline (D-31, D-48): `pulse` → `wcmmo_bloodline_pulse` · `ward` → `wcmmo_bloodline_ward` · `fury` → `wcmmo_bloodline_fury`.

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
| 1 | Kill the brute, break the wall | fury 4 → clear winner, Fury revealed |
| 2 | Save the wounded NPC, free the trapped villager | pulse 4 → clear Pulse reveal |
| 3 | Kill the brute + free the villager | fury 2 / pulse 2 → 2-spirit Encounter |
| 4 | Do nothing scoreable (only walk the path) | 0/0/0 → 3 entities + "cannot see you yet" |
| 5 | Break wall, then also try the lever / fear path | both disabled, only fury counted |
| 6 | Reveal → Reject → GUI → pick same Bloodline | allowed, bound, Reject no longer offered |
| 7 | Disconnect mid Trial of Understanding, rejoin | back at the start of that trial, earlier scores kept |
| 8 | Exit tutorial, try `/bloodline` change without extractor | refused |
| 9 | Check `wcmmo_v1_awakening_log` | one row per finished tutorial |

## Rollback

Disable the module → new players get the manual selection GUI directly. Awakening data is player data: DB backup before prod changes.

## Acceptance criteria

- [ ] D-45 decided. (D-31, D-48 decided 2026-09-30; D-46 decided 2026-09-29.)
- [ ] All 9 tests pass on the dev box.
- [ ] Map team has built the tutorial world with the regions above.

## Open questions

- Story (lore bible §4): the tutorial *looks* like a realm of floating ruins between worlds but is secretly **the past**. After Accept/Reject the realm collapses, the **Selection Stone shatters**, the player sinks into water and hears voices; Chapter 1 starts on a forest stream bank. Add this end sequence to the flow. Reject leaves a "trace" on the player (lore L6/L10).
- Trials follow D-48 (decided 2026-09-30): value themes (compassion / endurance / determination) → Pulse / Ward / Fury. The story team wants 3–4 trials (this spec has 2, L2): a third trial can reuse the same three affinities.

- D-45: instance tech (MythicDungeons vs own module).
- ~~Name clash with stage 5 "Awakened"~~: kept on purpose (D-62).
