# 010 — First-person combat animation (PoC)

> Status: DRAFT · Target: wcmmo-content (Nexo/ModelEngine assets), wcmmo-plugins · FIRE mode: validate
> Design: [GDD v2 §4](../gdd/wcmmo-gdd-v2.md#4-combat--mechanics) · Decisions: D-05

## Big picture

- **Player story:** As a player, attacks feel weighty like a souls-like game in first person.
- **Done means:** one approach is chosen after testing all three candidates on a Sword 3-hit combo.

## Starting point: bought example pack (2026-09-28)

Owner bought **Draconic Dual Sword FPV** as the first test (kept outside git: `~/Downloads/draconic_dual_sword_FPV`, paid asset).

| Part | File | What it does |
|---|---|---|
| Item | `MythicMobs/items/draconic_sword.yml` | STICK + custom model 107; skills on `~onSwing` (attacks 1–2), `~onUse` (attacks 3–5), `~onHold` / `~onUnHeld` (swap models), cancels `~onPressF` |
| Skills | `MythicMobs/skills/draconic_swordSkills.yml` | combo state machine with caster variables; each hit = `damage{amount=2}` in a 70° cone, range 3 |
| FPV model | `ModelEngine/blueprints/FPS/fpv_draconic_sword.bbmodel` | anims: hold, unheld, idle, walk, attack_1…attack_5, reset. Attached to the player with `pv=true` (first-person view model) + `modelplayerskin` |
| TPV model | `ModelEngine/blueprints/FPS/tpv_draconic_sword.bbmodel` | anims: draconic_hold, draconic_unheld, idle, walk (**no attack anims**) |
| Item art | `MythicMobs/Assets/models|textures/item/weapons/draconic_sword.*` | item model (format 1.21.11) + texture |

**What this proves:** approach **A** (ModelEngine view model on the player) is real. ModelEngine can show a first-person model, so it isn't limited to third person as the v1 GDD assumed.

### Findings to handle before this becomes our weapon system

| # | Finding | Impact | Plan |
|---|---|---|---|
| F1 | `~onSwing`, `~onUse`, `~onHold`, `~onUnHeld`, `~onPressF` and `Generation:` are **MythicCrucible** item features | FPV weapons need Crucible *or* our own trigger layer (D-44) | PoC as-is with Crucible; decide D-44 after |
| F2 | Damage is a fixed `2` | ignores MMOItems stats, enhancement AP, AP/DP soft cap (014), combat states (009) | route damage through MythicLib/our plugin in the port |
| F3 | Right click (`~onUse`) drives attacks 3–5 | **`Shift + Right Click` bar swap (D-03) may also fire an attack** | PoC-3 must test with this sword |
| F4 | F key is cancelled and the **off-hand is used** (dual swords) | the `Shift+F` fallback for D-03 is **blocked** for dual weapons | need a third fallback (e.g. hotbar-scroll while sneaking) or a per-weapon rule |
| F5 | Mining Fatigue is applied while held (hides vanilla swing) | Mining lifeskill is slower while holding a weapon | fine: lifeskills use tools |
| F6 | TPV model has no attack animations | other players may not see the attack | test what a second player sees |
| F7 | Dual wield via `takeitem a=2` / `give a=1` / `equip OFFHAND` | item dupe/loss risk if inventory is full or on lag | replace with our plugin in the port |
| F8 | References model `tpv_solar_sword` that is not in the pack | leftover from another pack, harmless remove call | clean up in the port |
| F9 | Item uses `Model: 107` (integer custom model data), item JSON format 1.21.11 | must still work on 26.2 and inside the **Nexo** merged pack (D-40) | import assets into Nexo pack, verify on 26.2 |
| F10 | Paid asset with a licence hash in the files | must not land in a public repo | `wcmmo` is **private** (confirmed 2026-09-28), so paid assets may live there. Never copy them into a public repo |

## Candidates

| # | Approach | Pros | Cons / risk |
|---|---|---|---|
| A | ModelEngine model on/around the player | rich animations, third person looks great | ModelEngine animates entities; first-person view of own model is limited/jittery |
| B | Resource-pack animated item models (Nexo) swapped per attack frame | true first-person, cheap | frame swaps via packets; timing at high ping |
| C | Display entities (item/block displays) attached to camera | flexible | client interpolation, desync risk |

Animation speed is fixed. Faster casting comes from Weapon Mastery (spec 023), never from sped-up animations.

## Test plan (dev box)

| # | Step | Expected |
|---|---|---|
| 0 | Install Draconic pack (MythicMobs + Crucible + ModelEngine) on dev, hold the sword | first-person dual swords, hold anim plays |
| 0b | Left-click ×2, right-click ×3 | attacks 1–2 then 3–5 animate, cone damage lands |
| 0c | Second player watches | record what they see (F6) |
| 0d | `Shift + Right Click` while holding it | does the bar swap also fire attack 3? (F3) |
| 1 | Build Sword 3-hit combo in A, B, C | all three playable (only if A fails) |
| 2 | Test at 0 ms and 150 ms simulated ping | record desync |
| 3 | 20 players attacking at once | MSPT recorded (spark) |

## Result

| Approach | Visual (1–5) | Sync @150 ms | MSPT cost | Verdict |
|---|---|---|---|---|
| A (Draconic pack) | | | | first to test |
| B | | | | |
| C | | | | |

## Rollback

PoC only; nothing merged to `main`.

## Acceptance criteria

- [ ] Result table filled; D-05 decided in GDD.
