# M8 — Massive late-game depth

- The benchmark loads a completed 65,536-cell campaign and advances it another 180 ticks. In this workspace the median continued tick dropped from 11.53 ms to 0.70 ms and p95 dropped from 19.47 ms to 2.73 ms. Both runs completed the same 374-tick campaign and wrote an 11.58 MiB save.
- Dormant, irreversibly stable cells preserve their saved state and rejoin the simulation when active industry reaches them. Facilities, vehicles, cargo and active dispatches are indexed during rendering.
- The browser review records five seconds of animation after restoring a prepared save with 360 additional depots, 80 trucks and 320 cargo logs. Its frame timings describe the review runner.

- Measure sustained frame rates and balance on player hardware through ordinary campaign progression.
