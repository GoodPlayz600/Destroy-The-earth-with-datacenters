# Tasks

Milestone requirements are quoted from README §23. Acceptance tests are listed in README §24.

| Milestone | Status |
| --- | --- |
| M0 — Website boot and 3D walking | Built, no browser test |
| M1 — Butter knife, chopping, falling, dragging, fire sale | Built, no browser test |
| M2 — First profitable refining branch | Built, no browser test |
| M3 — Game economy and progression foundation | Needs work |
| M4 — Vehicles and a real logging operation | Needs work |
| M5 — Industrial processing and factory network | Needs work |
| M6 — World conversion and map progress | Needs review |
| M7 — Heavy industry and multiple victory strategies | Needs work |
| M8 — Massive late-game depth | Needs work |
| M9 — Actual 100% ending and final polish | Needs review |

## M0 — Website boot and 3D walking

**Built, no browser test**

- [ ] “Vite/TypeScript app boots with an actual 3D `<canvas>` and FPS pointer lock.”
- [ ] “Player moves on 3D heightmapped/procedural jungle terrain with collisions.”
- [ ] “Daylight/shadow, fog, sky, basic ambience, pause/settings, graphics presets.”
- [ ] “At least three procedurally modeled tree shapes in the initial region.”
- [ ] “No PNG/image billboard world props.”
- [ ] “Player sees plastic butter knife as a three-dimensional tool.”

**Exit test:** Open the site, move among trees, look around, swing the visibly modeled knife, and remain above terrain.

## M1 — Butter knife, chopping, falling, dragging, fire sale

**Built, no browser test**

- [ ] “Small trees take real valid-hit damage, visibly accumulate cut marks and fall.”
- [ ] “Fallen trunk becomes a physical 3D object and stump remains.”
- [ ] “Hold E to physically drag, push, release or roll a log.”
- [ ] “Real 3D fire pit accepts actual delivered logs, burns and pays cash.”
- [ ] “Cash is spent on at least four functional starter upgrades.”
- [ ] “No duplication when selling the same log twice.”
- [ ] “Inventory, wallet, objective, save/load preserve chopped tree and money.”

**Exit test:** From $0, cut and drag one tree, earn first sale, buy an upgrade, cut the next tree faster, reload page, and observe consistent saved progress.

## M2 — First profitable refining branch

**Built, no browser test**

- [ ] “Add real sawbench, pocket saw, segments, and plank model output.”
- [ ] “Add raw timber buyer and board buyer with actual receipts.”
- [ ] “Add drying rack and hand-built crate or pallet recipe.”
- [ ] “Build a small logging route with rope, sled and wheelbarrow.”
- [ ] “Market UI compares fire, raw, and processed value.”
- [ ] “Purchase and equip early physical-tool upgrades.”

**Exit test:** The same tree's materials can be sold through distinct mutually exclusive routes; processing takes time but gives superior potential payout.

## M3 — Game economy and progression foundation

**Needs work**

- [ ] “Data registry for all upgrade nodes, prerequisites, branching and costs.”
- [ ] “Implement at least the 48 early-game upgrades with actual gameplay effects.”
- [ ] “Player journal, first quest series, milestones, unlock notifications.”
- [ ] “Recipes, inventory, buy/sell ledger, market contract lifecycle.”
- [ ] “Local IndexedDB autosave + manual export/import.”
- [ ] “Basic options and input remapping.”

**Exit test:** New upgrade purchases change measured movement/cutting/milling/sale behavior and persist across reloads.

## M4 — Vehicles and a real logging operation

**Needs work**

- [ ] “Ride/driving support, cargo mass/bed loading, unloading and fuel.”
- [ ] “3D hand cart, small ATV, pickup, skid steer and first logging truck.”
- [ ] “Winch, hitch, trailers, grapple, forklift interaction.”
- [ ] “3D road/path placement and connected-route display.”
- [ ] “Zone ownership, work areas, worker helpers and log delivery task.”

**Exit test:** Player cuts several trees, loads them onto an actual vehicle, drives to the mill, unloads and processes them.

## M5 — Industrial processing and factory network

**Needs work**

- [ ] “Sawmills, kilns, joinery, pallet plant, chipper and paper chain.”
- [ ] “Machine buffers, recipe times, electricity and product quality.”
- [ ] “Belts, rollers, warehouses, route sorting, product buyers.”
- [ ] “Workers and work orders; basic time-saving automation.”
- [ ] “First 10 full product families and at least 100 genuinely implemented upgrade effects.”

**Exit test:** Logs can move from physical logging zone to mill to finished goods to sales with transparent throughput and no free inventory spawns.

## M6 — World conversion and map progress

**Needs review**

- [ ] “Finite 4,096 m map architecture, region streaming and save state.”
- [ ] “Full biome data cells with clearing, plains, degradation, barren and desert.”
- [ ] “Regrowth, rain, water/soil/heat influences and stable desert test.”
- [ ] “3D biome visualization transitions, dust and drying effects.”
- [ ] “Exact global and zone conversion counts.”
- [ ] “Fire, grazing, soil removal and early pump routes to desert.”

**Exit test:** Clearing a tree creates plains, not automatic desert; subsequent land/water/heat changes turn that area into desert, the terrain appearance changes, and the result persists.

## M7 — Heavy industry and multiple victory strategies

**Needs work**

- [ ] “Heavy harvester, bulldozer, excavator, truck freight and automated forestry.”
- [ ] “Quarries, cement, asphalt, overfarming/grazing, thermal power, drainage.”
- [ ] “Electricity/water networks, heat overlays, industrial waste effects.”
- [ ] “Advanced mining and material processing.”
- [ ] “Data centers with compute contracts and true power/cooling demands.”
- [ ] “Multiple automated zone strategies that can desertify without any data center.”

**Exit test:** Two separately configured campaigns can reach high desertification via different industries; no data-center-specific mandatory gate.

## M8 — Massive late-game depth

**Needs work**

- [ ] “Full **288 upgrade catalog** purchasable when prerequisites met, all with implemented effects.”
- [ ] “Rail, drone jobs, machine repair, specialized markets and long contracts.”
- [ ] “Regional logistics and large facilities with actual geometry.”
- [ ] “Endgame terrain tools, diagnostic scanners and mega-dryer.”
- [ ] “Dynamic events, challenges, achievements and optional offline progress.”
- [ ] “Optimization to handle large industrial bases and many converted cells.”

**Exit test:** No upgrade is a dead button or false promise. Simulate full-map economic operation with frame-time and save-size monitoring.

## M9 — Actual 100% ending and final polish

**Needs review**

- [ ] “Determine campaign eligibility from fixed world cell data.”
- [ ] “Convert, validate and stabilize every cell.”
- [ ] “Report exact remaining cells and blockers near completion.”
- [ ] “Trigger endgame when and only when authoritative desert count is total.”
- [ ] “Victory flyover, stats, postgame continuation and optional New Game+.”
- [ ] “Full automated test suite + manual browser QA + audio/visual polish.”
- [ ] “Mobile touch controls, performance presets and responsive presentation.”

**Exit test:** An end-to-end run using accelerated *test-only* settings completes the map; the ordinary campaign remains balanced, has no inaccessible green cells, and the win check is correct.

---
