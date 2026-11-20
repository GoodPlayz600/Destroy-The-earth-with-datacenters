# Acceptance review

These requirements are quoted from [README §24](../README.md#24-acceptance-test-matrix).
Reviewed items have functional browser or simulation evidence. Partial items have implementation or targeted review evidence and still need a broader test.

The [automated review](https://github.com/GoodPlayz600/Destroy-The-earth-with-datacenters/actions) and [milestone results](../completed.md) record the test scope.

## 24.1 First-play and physical chores

- [x] **1 · Reviewed.** “Starting money is exactly zero and starting usable tool is the plastic butter knife.”
- [x] **2 · Reviewed.** “All visible jungle trees are genuinely three-dimensional meshes.”
- [x] **3 · Reviewed.** “A knife swing missing a trunk causes no tree damage.”
- [ ] **4 · Partial review.** “Hitting a tree at valid range reduces persistent health and produces visual/audible feedback.”
- [x] **5 · Reviewed.** “At least the smallest tree can be felled within the target beginner time.”
- [ ] **6 · Partial review.** “Tree fall direction and collision are believable and do not always use an identical scripted spin.”
- [x] **7 · Reviewed.** “Felled tree leaves a persistent stump and one or more actual physical trunk items.”
- [x] **8 · Reviewed.** “Grab-and-drag uses physical motion/constraints, not instantaneous item-to-wallet conversion.”
- [ ] **9 · Partial review.** “Releasing a log leaves it where it is and allows resuming later.”
- [x] **10 · Reviewed.** “Dropping the tree in the fire intake pays once and consumes the correct wood instance.”
- [x] **11 · Reviewed.** “Currency is deposited only after the sell/burn job succeeds.”
- [x] **12 · Reviewed.** “Purchasing a starter upgrade debits the wallet and measurably alters gameplay.”
- [x] **13 · Reviewed.** “Saving/reloading preserves removed tree, fallen log positions, money, and upgrades.”
- [x] **14 · Reviewed.** “Moving out of range deactivates the tree's interaction target.”
- [ ] **15 · Partial review.** “Massive late-game trees cannot be effortlessly felled by an unupgraded starter knife.”

## 24.2 Refining and markets

- [x] **16 · Reviewed.** “A log accepted into the sawbench cannot simultaneously be sold as raw timber.”
- [x] **17 · Reviewed.** “Plank processing consumes a valid log and produces visible 3D boards.”
- [x] **18 · Reviewed.** “The same material yields different net economic outcomes through fire/woodshop routes.”
- [x] **19 · Reviewed.** “Quality and moisture affect available products and customer payouts.”
- [x] **20 · Reviewed.** “Machines stop when output capacity is full.”
- [x] **21 · Reviewed.** “Machines pause when power or required inputs are unavailable.”
- [x] **22 · Reviewed.** “Product delivery causes one ledger entry and debits appropriate inventory.”
- [x] **23 · Reviewed.** “Selling or refunding cannot duplicate items through rapid repeated interaction.”
- [ ] **24 · Partial review.** “All first 10 product families have recipe data, meshes and valid buyers.”
- [x] **25 · Reviewed.** “Contracts have a real timer, input requirements and completion/failure behavior.”

## 24.3 Vehicles, transport and automation

- [x] **26 · Reviewed.** “The physical log can be transferred onto a cart or truck bed.”
- [ ] **27 · Partial review.** “Heavy loads slow or affect a vehicle according to tuned handling rules.”
- [ ] **28 · Partial review.** “Wrong cargo or excess mass is rejected with a clear explanation.”
- [ ] **29 · Partial review.** “Winches/ropes operate at finite range with real attachment points.”
- [x] **30 · Reviewed.** “Roads, rail and conveyor routes are visible 3D geometry.”
- [ ] **31 · Partial review.** “Forklift or crane arms visibly move while loading.”
- [x] **32 · Reviewed.** “A hired hauler can pick up and move eligible logs to a chosen station.”
- [x] **33 · Reviewed.** “A machine assigned to a job cannot accept the same job twice concurrently.”
- [x] **34 · Reviewed.** “Offscreen automation consumes actual resources and produces bounded outputs.”
- [ ] **35 · Partial review.** “A stalled truck can be recovered without corrupting cargo or save state.”
- [x] **36 · Reviewed.** “Route screens show cause of blocked transfers.”

## 24.4 Industry and environment

- [x] **37 · Reviewed.** “Removing trees advances clearing but does not instantly count all cleared cells as desert.”
- [ ] **38 · Partial review.** “Exposed terrain physically changes across at least seven visible biome stages.”
- [ ] **39 · Partial review.** “Soil moisture/water/heat changes are inspectable and consistent with active infrastructure.”
- [x] **40 · Reviewed.** “Building a water pump consumes power and only affects its configured region/network.”
- [ ] **41 · Partial review.** “Quarrying/soil stripping changes landscape or substrate state in affected cells.”
- [ ] **42 · Partial review.** “Grazing or overfarming can suppress regrowth under the game rules.”
- [x] **43 · Reviewed.** “Data centers earn contracted compute revenue only when appropriately powered/cooled.”
- [x] **44 · Reviewed.** “Data centers are not needed for all desertification paths or required by the win trigger.”
- [x] **45 · Reviewed.** “A full desert region stays dry through configured stabilization checks.”
- [ ] **46 · Partial review.** “Environmental simulations yield consistent results regardless of render distance.”
- [x] **47 · Reviewed.** “Save/load does not change exact biome conversion counts.”
- [x] **48 · Reviewed.** “Rain and regrowth cannot cause impossible negative moisture or vegetation values.”
- [ ] **49 · Partial review.** “A machine/bulldozer can navigate to or affect the final cells marked by the scanner.”
- [x] **50 · Reviewed.** “Buildings or roads cannot remove difficult cells from the victory denominator.”

## 24.5 Upgrade catalog and endgame

- [x] **51 · Reviewed.** “All **288** upgrade IDs are unique and validated at application boot.”
- [ ] **52 · Needs work.** “All purchasable upgrades have a meaningful implementation, not a label-only placeholder.”
- [x] **53 · Reviewed.** “Upgrades cannot be purchased without meeting money and prerequisite rules.”
- [x] **54 · Reviewed.** “Upgrade price is deducted only once and bought nodes persist after reload.”
- [ ] **55 · Partial review.** “No tree, building or biome cell is permanently inaccessible in a generated valid world.”
- [x] **56 · Reviewed.** “Game shows exact desert cell count and accurately displays the remaining percentage.”
- [x] **57 · Reviewed.** “The game does **not** grant victory at 99.99%, 99.995%, or any non-total desert count.”
- [x] **58 · Reviewed.** “One stable valid cell count per every eligible cell triggers precisely one victory event.”
- [x] **59 · Reviewed.** “A saved completed campaign reloads in the completed state without playing the finale repeatedly.”
- [x] **60 · Reviewed.** “Optional New Game+ creates a newly finishable finite world with separate save integrity.”

## 24.6 Usability, browser and performance

- [x] **61 · Reviewed.** “App works in a current Chromium browser and at least one other modern browser.”
- [ ] **62 · Partial review.** “Canvas resize does not break input targeting or render resolution.”
- [ ] **63 · Partial review.** “Pointer lock failure is handled with a clear user action.”
- [ ] **64 · Partial review.** “UI remains readable at 1920×1080 and common laptop resolutions.”
- [x] **65 · Reviewed.** “No uncaught console errors during ordinary game flow.”
- [x] **66 · Reviewed.** “Settings and audio preferences survive reload.”
- [x] **67 · Reviewed.** “Pausing the simulation does not allow worker jobs to silently complete.”
- [x] **68 · Reviewed.** “No screenshot billboards masquerade as scenery, vehicles, trees or factories.”
- [x] **69 · Reviewed.** “Save/export/import works, with version checks and visible recovery on invalid files.”
- [ ] **70 · Partial review.** “Quality presets preserve object geometry and functional collider behavior.”
