# ADR 0001 — Purpur on Java 25 with Generational ZGC

- Status: Accepted
- Date: 2026-09-23

## Context
MMO server targeting ~200 players with heavy plugins (MythicMobs, MMOCore, Nexo). GC pauses and tick spikes are the main risk.

## Decision
Purpur 26.2 (Paper fork, extra gameplay toggles) on Java 25 with Generational ZGC, fixed heap (`-Xms` = `-Xmx`), AlwaysPreTouch, transparent huge pages on Linux.

## Consequences
- Sub-millisecond GC pauses; needs RAM headroom (heap ≈ 60–70 % of physical RAM).
- Plugins touching NMS/packets may lag behind 26.2 — check compatibility before every promotion (DEPLOY.md step 2).
- Java < 25 is refused by the start scripts.
