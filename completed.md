# Completed

Build and verification evidence is listed by milestone. The coverage below is current as of November 20, 2026.

## [M0 — Website boot and 3D walking](progress/M0/completed.md)

- Vite and TypeScript production build passed.
- Chromium and Firefox ran the live 3D menu, terrain movement, held tool, starting harvest, pause and resized UI. Menu and field screenshots reviewed.
- Browser checks covered pointer lock, a remapped movement key, jumping, resizing and touch movement. Geometry presets, ambient sound, day/night and rain are implemented.

## [M1 — Butter knife, chopping, falling, dragging, fire sale](progress/M1/completed.md)

- Fresh Chromium and Firefox runs verified the knife at $0, a missed swing, valid trunk damage, falling timber, drag on the ground, delayed single payment, purchase and reload.
- Simulation review verified the starter damage threshold, cash and persistent removal. Stamina, sapling damage, grip and pit capacity have functional starter purchases.

## [M2 — First profitable refining branch](progress/M2/completed.md)

- Sawbench accepts a physical log and produces two modeled boards. The market, rack and crate workshop carry timed, quality-aware material. Rope, sled and hand cart options are available.
- Chromium and Firefox verified the physical sawbench-to-market route. Simulation checks prove material conservation, drying time, crate output and greater processed sale value.

## [M3 — Game economy and progression foundation](progress/M3/completed.md)

- All 288 catalog IDs and prerequisite references load. All 288 upgrades in the 24 branches have purchase prerequisites and gameplay effects, including tool work, hauling, woodworking, mill production, material finishing and compute.
- Wallet, receipts, thirteen state-driven journal objectives, short, standing and regional contracts, IndexedDB autosave and file import/export work. Upgrade and tool wear persistence is tested.

## [M4 — Vehicles and a real logging operation](progress/M4/completed.md)

- Sleds, carts, trikes, trailers, pickups, a forklift, a skid steer, trucks and bulldozers have 3D meshes and cargo checks. Suitable vehicles have hitches and powered winches. Anchored cable drums reel physical logs and two drums can share a load after research. Motorized vehicles use fuel; work crews reserve and deliver actual logs.
- Chromium and Firefox passed physical pickup loading, driving, unloading to the sawbench and producing boards. Simulation tests verify worker reservations, blocked delivery and hitch persistence.

## [M5 — Industrial processing and factory network](progress/M5/completed.md)

- Sixty-three recipes cover timber, boards, kiln drying, crates, pallets, cabinetry, modular furniture, engineered beams, pulp/paper, charcoal, pellets, plywood, treated lumber, floor panels, pasture and crops, stone, cement, compute, export packaging, chip drying and fuel processing.
- Output limits, input quality, stored electricity, biomass fuel and combined generation are simulation-tested. Sawmill research changes yield, chip recovery, output grade and concurrent batches. Powered gates sort material lots, warehouses track inventory, and forklifts and pallet jacks move processed cargo. The paper chain consumes water and supports offcut recovery. Biomass generators consume real stored fuel and route ash to a second product chain. Freight tests preserve shipments across a reload.

## [M6 — World conversion and map progress](progress/M6/completed.md)

- The fixed 4,096 m world has 65,536 authoritative cells, seven stages, streamed terrain, rain, regrowth suppression, stabilization and survey overlays for water and heat.
- Simulation tests covered all seven biome stages, district strategies, and restored counts. Browser tests operated a real excavator and verified its cargo and elevation changes.

## [M7 — Heavy industry and multiple victory strategies](progress/M7/completed.md)

- Tested independent drainage, quarrying and thermal district campaigns. Data centers reserve live compute orders, draw linked electricity and bounded cooling, and pay on fulfillment. Manual wells, water carts, high-flow pipelines, reservoirs, drainage ditches and industrial pump schedules also work.
- A dozer can strip soil, and log crews and heavy cutters operate in the field. Pasture, grazing, row crops, fertilizer and irrigation interact with soil fertility and water. Late agricultural research adds a district conversion plan. The quarry chain includes persistent surface rocks, ore hauling, grading, concrete delivery, asphalt and a continental extraction plan. Power and heat research adds recovery, emissions settings, urban heat, dust systems and a fifth district strategy.

## [M8 — Massive late-game depth](progress/M8/completed.md)

- Survey overlays, aerial previews, climate readings, remaining-cell filters and queued cleanup jobs, district contracts, achievements and capped opt-in offline progress are implemented. Rail, road and drone freight reserve stock, charge dispatch fees and persist in-flight cargo. Owned autonomous trucks use fuel and return to their garage after delivery.
- All 288 upgrade IDs are purchasable in dependency order. Automated review verifies the registry, every connected effect or unlock, and the absence of circular prerequisites.

## [M9 — Actual 100% ending and final polish](progress/M9/completed.md)

- A 65,535-cell test stayed at 99.99% and the last cell triggered exactly one victory. A separate campaign test built the projects for all 64 districts, simulated all 65,536 cells, paid each completion bond once and reloaded a completed save.
- Chromium and Firefox passed the final-cell flyover, lifetime statistics, New Game+, archive restore and suppression of a replayed ending.

## Verification totals

- 45 automated simulation and validation tests passed.
- The full No Compute benchmark finished all 65,536 cells in 374 simulation ticks. On the review runner the median tick was 14.06 ms, the 95th percentile was 17.22 ms, and the JSON save was 11.58 MiB.
- The largest benchmark represents a simulation stress case. Browser playthroughs check the opening naturally and use prepared saves for later milestones.

## Browser evidence

- [Chromium and Firefox opening review](https://github.com/GoodPlayz600/Destroy-The-earth-with-datacenters/actions/runs/44776791913).
- [Firefox refining, pointer lock and finale review](https://github.com/GoodPlayz600/Destroy-The-earth-with-datacenters/actions/runs/44779594461/job/136438422591).
- [Chromium and Firefox reviewing refining and finale](https://github.com/GoodPlayz600/Destroy-The-earth-with-datacenters/actions/runs/44780546998).
- [Chromium and Firefox reviewing pickup delivery](https://github.com/GoodPlayz600/Destroy-The-earth-with-datacenters/actions/runs/44781691730).
- [Cross-browser suite covering remapping, jump, excavation, mobile input and New Game+](https://github.com/GoodPlayz600/Destroy-The-earth-with-datacenters/actions/runs/44788467199).
- [Latest GitHub Actions runs](https://github.com/GoodPlayz600/Destroy-The-earth-with-datacenters/actions).
