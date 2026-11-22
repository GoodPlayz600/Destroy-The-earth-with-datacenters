# PROJECT CLEARCUT: THE LAST JUNGLE — UNITY 6000.6.10f1 COMPLETE BUILD PROMPT

> **ONE-FILE, UNABRIDGED MASTER SPECIFICATION.** This file contains an overriding Unity-specific execution directive followed by the complete, unabridged user-provided specifications for Sections **1–30** and **31–103**. The source documents are reproduced below without deletions, paraphrasing, or omission. Treat **all 103 numbered sections**—including every named upgrade, recipe, world rule, roadmap requirement, acceptance test, and appendix—as required project scope unless the source itself explicitly designates a feature optional.
>
> **TASK:** Convert the already-developed game into a new Unity game, not merely a new prompt, website redesign, engine wrapper, mockup, prototype, or demo. Implement, play, test, optimize, build, publish, and maintain the actual game.

## 0. OVERRIDING UNITY EXECUTION MANDATE — READ BEFORE THE 103 ORIGINAL SECTIONS

You are an autonomous senior Unity game developer, systems engineer, 3D technical artist, Blender modeler, interaction designer, QA engineer, build/release engineer, and long-running coding agent. You are to independently execute this production project to the limits of your available tools and runtime, without asking routine questions or seeking approval at every milestone.

### 0.1 Project, exact Unity version, platforms and priorities

- **Game:** Project Clearcut: The Last Jungle / Destroy the Earth with Data Centers.
- **Existing repository:** https://github.com/GoodPlayz600/Destroy-The-earth-with-datacenters
- **Visual and interaction-quality references:** https://mana.gs/ and relevant playable indie browser games linked there. Investigate actual examples; reproduce the broad level of satisfying, immediate, readable, original stylized gameplay and polish, **not** their protected code, assets, UI layouts, branding, or identifiable designs.
- **REQUIRED ENGINE:** **Unity 6000.6.10f1**. Pin this editor version exactly. Verify the active editor and `ProjectSettings/ProjectVersion.txt` and package/build compatibility. Do not silently use a different Unity release.
- **REQUIRED LANGUAGE/ENGINE PATH:** Real Unity scenes/prefabs and C# gameplay/simulation. The old Three.js/TypeScript game is the migration reference, **not** a web page embedded inside a Unity app.
- **Render pipeline:** Use a Unity 6 URP configuration appropriate for Unity Web builds, with compatible shaders and graphics fallback. Validate technical APIs rather than assuming all desktop features are supported in Web.
- **Target platforms in priority order:** **(1) Web browser first (the primary product), (2) Windows x64, (3) Linux x86-64.** Build all three from the same Unity project. Provide downloadable desktop releases and a playable hosted web URL.
- **Primary experience:** Desktop-browser keyboard/mouse and responsive UI. Respect the source specification's touch/mobile-friendly secondary controls where feasible; do not let touch features prevent the desktop browser from working.

### 0.2 MANDATORY REAL TOOL USE — UNITY MCP AND BLENDER MCP

**Unity MCP is mandatory throughout development.** Discover available Unity MCP operations and verify a live connection to the running Unity **6000.6.10f1** editor before proceeding. Use it whenever supported for scene and GameObject inspection, scene creation, prefab setup, asset import, components, materials, animation, lights, UI, play-mode checks, console/errors, screenshots, package/configuration management, build targets, and verification. Write C# and project files directly where appropriate, then use Unity MCP to import, inspect, run, debug, and validate them in Unity. Never claim the project compiled, opened, rendered, or ran merely because files were written.

**Blender MCP is mandatory throughout 3D asset production.** Discover available Blender MCP operations; check its actual connection and current Blender instance. Use Blender MCP, including Blender Python automation where supported, to create, inspect, revise, UV/material, prepare collision/LOD, and export original, editable 3D models. Preserve `.blend` source projects and generators and use a reproducible, Unity-compatible export/import path. Validate one real end-to-end asset pipeline first: **Blender MCP create/edit → export → Unity MCP import → prefab/material/collider → place in scene → play/visually inspect**. Reuse this loop for trees, tools, foliage, lumber, vehicles, machines, factories, cities, megastructures, and other environmental art. No flat image planes masquerading as world objects.

If either MCP is unavailable, diagnose the correct bridge, editor state, connection, permissions, and configuration; attempt reasonable repairs/reconnections. Do **not** claim an MCP was used unless it actually was. For operations outside an MCP's supported scope, use verifiable Editor scripts or CLI operations and test the result. Ask for external input **only if** genuinely blocked (e.g., inaccessible editor, missing interactive authorization, unrecoverable credentials or licenses). A missing tool does not authorize fabricating screenshots, builds, tests, models, or GitHub changes.

### 0.3 SOURCE-OF-TRUTH ORDER — CRITICAL OVERRIDE RULE

This one document contains the exact original specifications in two unabridged appendices. Apply this precedence, highest first:

1. **This Section 0** overrides the originals **only for engine/tooling, project packaging, migration process, platform priority, version pinning, and delivery/deployment details**. Any original directive to make the game using **Three.js, TypeScript, Rapier, Vite or a web-only engine** must be translated into equivalent **Unity/C#** implementations, rather than followed literally. Use a browser-compatible Unity build, not the existing renderer. Original gameplay and test intent still apply.
2. **Original Sections 66–103** explicitly override older numeric targets for the world, campaign time, upgrade count, winning objectives, regions and new related systems.
3. **Original Sections 31–65** extend Sections 1–30 except where Sections 66–103 explicitly supersede them.
4. **Original Sections 1–30** define the indispensable physical opening, core loops, genres, baseline functionality, visual rules, data contracts, and acceptance criteria; they remain binding unless expressly superseded.
5. The **existing GitHub implementation and its documented test results** are migration inputs and evidence of prior work, **not** evidence the equivalent Unity functionality has already been completed or verified.

**Active final targets from V2:**

- **World:** `24,576 m × 24,576 m` (**603.979776 km²**). Do **not** ship an older 4,096 m or 8,192 m campaign as the full final world.
- **Authoritative grid:** `1,536 × 1,536` cells, each `16 m × 16 m`, totaling exactly **2,359,296 cells**; all required cells remain auditable and reachable/convertible.
- **Regional layout:** **16 provinces, 576 administrative districts**, with dynamic ecological boundaries as specified.
- **Progression:** Target approximately **170 engaged hours** (typical **150–200**, with meaningful variation by skill and playstyle), not an artificial countdown or merely disconnected idle time. These are design targets to measure, not unverified promises.
- **Upgrade catalog:** Exactly **1,696 unique named and functional upgrades spanning 112 branches**, preserving the 288 original upgrades, 768 expansion upgrades, and 640 additional V2 upgrades. Implement each with meaningful costs, dependencies, effects, presentation and tests—do not fulfill this by generating dead store buttons.
- **Endgame:** All **eight simultaneous, independently audited 100% victory objectives** D1–D8, including the full-map stable-desert predicate and the final stabilization/audit rules in the V2 sections. **100% desert alone is no longer sufficient to win.** Percentages are fictional game-rule progress toward thresholds, not literal real-world gas concentrations.
- **Other mandatory late-game systems:** distinct climate/weather/pollution components, hydrology and groundwater, carbon, heat, soil, biodiversity, giant city construction, megafactories, skyscrapers, energy supergrids, data center workloads/cooling, physical logistics, recoverable industrial disasters, eight-medal presentation, new catalogs and expanded V2 acceptance tests.

### 0.4 Existing repository: preserve, study, then port

Clone/open https://github.com/GoodPlayz600/Destroy-The-earth-with-datacenters and audit the actual `main` branch and relevant history. Read `README.md`, original expansion `prompt.md` if present, `tasks.md`, `completed.md`, `continue working.md`, `PLAY.md`, `MULTIPLAYER.md`, `src/`, `tests/`, `progress/`, and the deployment/Actions configuration. Inspect the exact file names actually present; do not assume `prompt.md` exists on a given branch. The two complete requirements documents **embedded below** are the scope authority even if a same-named file is absent or different in the repository.

The existing TypeScript/Three.js implementation contains substantial work including an early 4,096 m world, 65,536 cells, 288 upgrades, factories, terrain conversion, private Photon co-op, and a tested initial endgame. **Do not represent this as a completed Unity port or as proof the newer 604 km² V2 expansion exists.** Preserve the working legacy game and its history until Unity replacement is verified. Use a separate Unity development branch and an organized Unity project directory (e.g. `unity/`) with compatible ignore/LFS rules. Avoid destructive rewrites to the existing published web app until the Unity site has passed release checks. Reuse semantics, balancing logic, data definitions, behavior and tests by porting them into well-structured C#.

Before coding, produce an itemized requirements matrix mapping **every one of the 103 sections**, all **1,696 upgrade IDs**, all D1–D8 medal predicates, and each named original and V2 acceptance test to implementation status, corresponding Unity components/files and actual test evidence. As large content may exceed a context window, read this prompt and the repo **incrementally in full**, making a durable coverage index; do not pretend an abbreviated skim counted as a full audit.

### 0.5 Unity architecture and web-first constraints

Implement modular C# gameplay services, data registries, ScriptableObjects where appropriate, prefabs, scenes, explicit save schemas, deterministic world/industrial simulation, and well-defined events/command interfaces. Keep the **2,359,296-cell authoritative data model compact** (packed arrays/chunk partitions and sparse deltas) and separate from visible GameObjects. **Never instantiate millions of cell GameObjects, trees or colliders at once.** Use deterministic seeded generation, streaming chunks, spatial partitioning, geometry LOD, instancing/batching, pooling, aggregate far-world simulation, bounded physics, and appropriate coordinate/origin handling for 24.576-km dimensions. Maintain the full simulation even for unloaded geography.

The web version is the top performance priority; profile real hosted builds, memory and load behavior under browser constraints, especially large saves, factories, weather, and multiplayer. Support actual current mainstream desktop browsers that Unity's chosen web target supports. Configure hosting MIME, WebAssembly loading, caching/compression and security headers correctly. Create a polished load screen, playable game page, fullscreen, graphics controls, and honest progress/error feedback. WebGL/WebGPU, threads, networking, compression and platform APIs must be used only after confirming compatibility with Unity 6000.6.10f1 and the deployment host. Do not assume Web-specific support for every native plugin. Produce actual native Windows x64 and Linux x86-64 builds, using platform-specific persistent paths and appropriate archives.

Create local-first, versioned and recoverable saves; support web persistence, export/import, and desktop save locations, plus recovery from failed/corrupt snapshots. Investigate **legacy web save import** so existing players can migrate. Never reset or silently overwrite players' saved progress. Multiplayer must preserve private room collaboration up to four players, use a verified Unity/web-compatible networking solution (existing Photon logic is a reference, **not** drop-in TypeScript Unity code), and handle authority, reconnects, synchronization, anti-double-spend rules and checkpoint resumption.

### 0.6 Quality and visual direction

Make a cohesive, charming, premium **stylized 3D industrial/chore sim**—an original game with the immediacy, interaction quality, visual readability and polished feel associated with appealing Mana-style browser games. Use real 3D geometry for physical environment objects, including at range as allowed by the source rules. Blender-made assets must have correct UVs, materials, pivots, LODs, colliders, usable animation rigs and appropriate export settings. Create original animations, convincing chop/tree-fall/drag/cargo/factory/vehicle behavior, good audio, responsive feedback, clear interactions, richly varied environmental transformation, attractive typography and readable HUDs. Do not reproduce somebody else's distinctive game identity.

The first five minutes must actually work: **$0 + plastic butter knife → physically cut a small real-3D tree → falling and colliding 3D log → drag to actual fire-sale pit → sale transaction → working upgrade → saved progress**. This is the first true playable vertical slice and remains available throughout the migration. Then implement all source features, including seven desertification stages and advanced V2 biomes, real physical materials, many alternate industrial strategies, climate, megacities, data centers and D1–D8 endgame. **Never fake gameplay with decorative UI, static scenery, or a global progress-value mutation.**

### 0.7 Non-negotiable production sequence, testing and milestone integrity

1. **Inspect:** Verify repository/source state, Unity 6000.6.10f1, Unity MCP, Blender MCP, installed build modules, project permissions, relevant source assets and available CI/hosting configuration.
2. **Plan and map:** Convert all requirements and tests into version-controlled milestone checklists; identify superseding V2 numbers; preserve original finished work in a reference branch.
3. **Establish pipeline:** Produce an actual running Unity editor scene and true browser build; prove Blender MCP → Unity MCP asset workflow.
4. **Build first playable slice:** Real modeled jungle/knife/tree/physics/hauling/fire/money/upgrade/save with controls, audio, visual feedback and runtime inspection.
5. **Migrate and expand progressively:** Core M0–M9 requirements, existing co-op and additional repository milestones M10–M12 where applicable, legacy expansion E10–E19 and V2 roadmap Section 98, adapted to Unity while preserving the source's exact feature IDs/test IDs. Integrate advanced geography, 1,696 upgrades, 8-medal systems, city/data-center/energy/climate simulation and true 3D content.
6. **Verify each slice:** Compile, EditMode/PlayMode/unit/integration tests, runtime Editor playthrough, Blender and Unity scene inspection, real hosted browser playthrough, desktop smoke tests, saves, co-op, screenshots, and measured profiling. Debug and fix failures before declaring progress.
7. **Release:** Build a public live Unity web game on an appropriate static-compatible host; generate Windows and Linux archive artifacts; automate authorized builds/tests/deployment/release via GitHub Actions; publish and verify available links and releases.

A verified partial milestone is preferable to a fake completed giant game. However **do not redefine a partial slice as final completion or omit the remaining 103-section scope**. Continue as far as the execution environment permits in the current working session, with accurate status and reproducible continuation artifacts.

**Acceptance requirements:** Retain every test in original Sections 24 and 56/60 as applicable and all additional **100 V2 acceptance tests in Section 99**, plus engine porting, Blender-model quality, build, save and multiplayer tests. Use the source's exact test IDs and pass conditions where specified. Confirm that victory **does not trigger** when one authoritative cell fails or a single medal is incomplete, and verify audit/stabilization independently of which render chunks are loaded. Never invent benchmarks, screenshots, test reports or proof of completion.

### 0.8 GitHub delivery, publishing and autonomous operation

Maintain the **existing GitHub repository**, not an unrelated new one. Use a feature branch for the Unity rewrite, small sensible commits, Git LFS for large `.blend`/appropriate binary assets, and a project layout compatible with Unity's required `Assets`, `Packages`, and `ProjectSettings` folders. Commit C# sources, scenes, prefabs, metadata, configuration, source Blender models, reproducible modeling scripts, tests, deploy/build workflows and readme instructions. Do not commit secrets, Unity `Library` caches, temporary files, platform-specific local credentials or avoidable enormous generated player binaries. Upload changes, create/review/merge PRs as authorized and as tests permit, and report any permission/CI blockers without pretending they were overcome. Verify resulting commits, build artifacts, release links and deployed site.

Update the existing source-defined tracking files when appropriate: `tasks.md`, `completed.md`, `continue working.md` or `continue-working.md` as actually present, `KNOWN_ISSUES.md`, `FEATURE_MATRIX.md`, `BALANCE_REPORT.md`, and add Unity-specific `UNITY_ROADMAP.md`, `UNITY_PROGRESS.md`, `UNITY_COMPLETED.md`, `UNITY_CONTINUE.md`, `UNITY_BUILD.md`, `UNITY_ASSETS.md`, `UNITY_KNOWN_ISSUES.md`. Cross-link them rather than inventing inconsistent duplicate status reports. Every status must distinguish `planned`, `working on`, `built but untested`, `test failing`, `tested and passed`, `completed`, and `blocked`. Keep precise current branch/commit/command/test outcomes, especially at context boundaries.

**Make reasonable choices without asking me.** Do not ask about aesthetic preferences, naming alternatives, minor API choices, normal source organization, routine commits, visual revisions, or whether to proceed to the next milestone. Ask only for indispensable missing external authorization or a genuinely blocked and consequential decision. Respect repository permissions and license/credential requirements. Do not represent work as running asynchronously after the session ends; leave a durable next-step record if interrupted.

### 0.9 Full-spec coverage gate: do not lose tasks

**Sections 1–30 and 31–103 reproduced below are the complete source requirements.** Their detail matters more than the summary above: every feature/subfeature, named product, research ID, milestone, 3D treatment requirement, formula, data contract, challenge, climate event, world cell, eight medal rule, optional labeling, and acceptance check must be considered, implemented as specified when mandatory, and traced to code and tests. If the source has mutually inconsistent numbers, apply the later explicit superseding rule in Section 66 onward; preserve the older text as historical specification only for the superseded numeric property. If the source specifies Three.js/TypeScript/browser architecture, port the **functional result** into Unity/C#/Blender/MCP rather than using the earlier language/tool literally.

**Success means a genuinely working, tested, beautiful Unity 6000.6.10f1 game—web first, Windows and Linux too—backed by original Blender MCP assets, actual Unity MCP work, all 103 numbered sections, 1,696 functional upgrades, 2,359,296 auditable cells, and all eight separately audited victory objectives. Start work immediately.**

---

# APPENDIX A — ORIGINAL USER-PROVIDED SPECIFICATION, SECTIONS 1–30 (FULL TEXT)

**Source:** Uploaded `task_1-30.md`. The following text is included unabridged. Architectural directions that contradict Section 0 are migrated to Unity rather than copied literally.

# PROJECT CLEARCUT: The Last Jungle

> **A giant, original 3D browser-based chore / incremental / industrial-destruction simulator.**
>
> **You begin with a plastic butter knife, cut your first tree down one miserable scrape at a time, physically drag the trunk into a fire for a few dollars, and eventually build the machinery, factories, logistics networks, and resource-hungry industries required to turn an entire living jungle into a 100% desert.**
>
> **The game ends only when the entire finite campaign map has become desert.** A pretty-looking percentage is not enough: the simulation must prove that all required cells meet the desert criteria.

**Document type:** Master AI coding prompt + complete game design / technical specification + production roadmap + acceptance criteria  
**Working title:** Project Clearcut: The Last Jungle  
**Genre:** First-person 3D chore simulator, extraction sandbox, physics logistics, incremental tycoon, environmental transformation, idle automation  
**Platform:** Website / desktop browser first; mobile-friendly controls as a secondary target  
**Tone:** Comically excessive, absurdly satisfying, darkly satirical, mechanically deep, original IP  
**Core player fantasy:** Turn tiny, tedious physical jobs into a massive mechanized industry, while every decision leaves a lasting mark on the world.

---

# 1. COPY-PASTE MASTER BUILD PROMPT FOR A CODING AI

## Your assignment

Build **Project Clearcut: The Last Jungle** as a complete, original, fully playable **real-time 3D web game**, not a landing page, static demo, fake mockup, text clicker, or a collection of menus. This README is the authoritative game specification. Use it to implement an actual game with working inputs, tools, world generation, damage/destruction, rigidbody interaction, inventory, selling, money, persistent upgrades, vehicles, machines, factories, industry, terrain conversion, desertification, automation, save/load, and a genuine end condition.

The main loop is intentionally ridiculous and addictive: the player starts with a **plastic butter knife** and must painstakingly cut down a tree. The resulting **real 3D tree trunk falls into the world** and can be pushed, picked up in stages, tied to a rope, rolled, or dragged all the way to a **3D fire pit**. The fire pit consumes the delivered wood and pays quick money. The fire sale is simple, low-paying, and immediate; the player should soon discover that **sawing, drying, refining, crafting, and selling finished products** pays much more. Every new investment makes an old chore easier or opens a new production chain. Eventually the player operates logging equipment, conveyors, mills, furnaces, wood-products factories, excavators, industrial heat sources, mines, power plants, data centers, and automatic resource networks. The player can win through **multiple industrial desertification strategies**, not only data centers.

**Non-negotiable graphics rule:** Everything that occupies the world must be a **real rendered 3D mesh or real 3D model**, never a PNG/JPEG/WebP image pretending to be a world object. Trees, branches, trunks, stumps, rocks, ropes, wheels, trailers, machines, vehicles, industrial buildings, factories, logs, boards, crates, pipes, terrain, fires, saw blades, smoke, and distant scenery must all have genuine three-dimensional representation. Use procedural geometry and/or properly optimized **glTF/GLB models**. Generate initial assets from geometry if external 3D assets are unavailable. Do not substitute billboards, sprites, image planes, flat cardboard cutouts, CSS rectangles posing as scenery, screenshot backgrounds, or 2D icon props in the 3D environment. Realistic or stylized **surface textures** and normal/roughness maps are acceptable on 3D meshes; they are **not** substitutes for geometry. HUD and menus may use ordinary HTML/CSS, but 3D objects in the world may not be images.

**Non-negotiable scope rule:** Make the smallest end-to-end playable version first, then implement the full systems in milestones. Every implemented feature must work. Do not declare victory after creating a rotating cube, placeholder forest, noninteractive buildings, fake buttons, or a start screen. If a system is not yet implemented, show it as explicitly locked or under construction instead of falsely portraying it as functional. Keep expanding the codebase until the requested systems and acceptance tests are complete, subject to the available tools and execution time. Preserve a running build at each milestone.

## Required game experience

1. The player spawns in the middle of an enormous, dense jungle near a crude fire-sale station. Begin with **$0, a plastic butter knife, no vehicle, and no automatic income**.
2. Allow **first-person movement** (WASD, mouse-look, sprint, jump, interact, use tool, drag/pick up, inventory, map, upgrades, construction). Supply visible settings and remappable bindings.
3. Generate many different **3D tree species** with actual trunks, branches, foliage volumes, stumps, sizes, hardness, biomass, and sale value. Initial saplings/small trees must be cuttable with the butter knife in a reasonable amount of time; giant trees should be aspirational obstacles at first.
4. Deliver convincing **physical chopping**: hit feedback, impact particles, audio, progressive cut marks, durability, tree lean/fall, collision, landed logs, cut segments, and persistent removed trees.
5. Let the player **physically move the tree**, not instantly turn it into money. Initially they must grab and drag the fallen trunk to a fire-sale point. Introduce distinct transport options, from ropes and sleds to logging trucks, cranes, conveyor lines, trains, and autonomous haulers.
6. Implement a **real 3D fire pit with a sell volume**. When qualifying wood physically enters the burn zone, it burns away over time and issues quick cash, plus optional ash/charcoal byproducts. The pit has realistic game limits such as capacity and burn speed, which can be upgraded. Show cash popups and an honest receipt.
7. Offer much more profitable **wood-refining alternatives**: cutting logs into pieces, debarking, milling planks and beams, seasoning and kiln-drying, plywood, engineered boards, paper, charcoal, pellets, furniture, crates, construction materials, and premium goods.
8. Add **hundreds of meaningful upgrades** distributed among tools, strength, movement, dragging, loading, vehicles, mills, product quality, factories, selling, logistics, research, power, pollution, water diversion, terrain clearing, automation, data centers, and endgame systems.
9. Transform the world **visibly and persistently**: jungle → cleared land → grassland/plains → degraded grassland → dry scrub → barren ground → desert. Other branches may accelerate desertification using water depletion, industrial heating, soil stripping, overgrazing, mining, urban construction, concrete, power stations, and data-center cooling.
10. Have several legitimate pathways to 100% desert. **Data centers are one optional pathway**, not the sole or mandatory solution.
11. Use a **finite, clearly bounded campaign map** with a live desert conversion percentage based on authoritative cell data. The game should end only when **100.00% of eligible campaign cells satisfy the defined desert test**. Buildings and roads do not create permanent loopholes.
12. Make late game huge: land purchasing/zone unlocking, machine placement, electricity networks, pipes, road networks, drones, conveyor belts, jobs and priorities, resource contracts, stockpiles, environmental heat map, weather, efficiency, breakdowns, achievements, large-scale automation, and expensive endgame projects.
13. Implement a satisfying **victory event** with a final aerial flyover of the completely desertified map, lifetime statistics, awards, and optional New Game+ without erasing the completed save unless explicitly requested.
14. Ensure the result is an actual **responsive website** that builds, loads, runs, saves, and reloads correctly. Test with real browser interactions, not only TypeScript compilation.

## Design priorities, in order

**Playable core first → visually convincing 3D world → physical chores → meaningful economic decisions → escalating industry → systemic map transformation → automation depth → endgame completion → polish/performance.**

Do not borrow copyrighted names, assets, art, code, maps, or trademarks from inspiration games. Create an original game identity, mechanics, art direction, UI, and assets.

---

# 2. THE PLAYER'S PROMISE

**One sentence:** “Cut a jungle down with a butter knife, drag the evidence into a fire, industrialize every scrap, and make the whole map a desert.”

This is a **chore game**, not a trivial clicker. The most important feeling is that the player *actually performs the job*. A tool physically contacts the tree; the tree falls; the log is in the player's way; the player must haul it to a location; a machine accepts it; a product comes out; a truck transports it; a buyer pays for it. Upgrades shorten, multiply, or automate those real steps rather than merely increasing a counter in a menu.

The game needs these overlapping pleasures:

- **Physical satisfaction:** Cutting, cracking, pushing, falling, rolling, stacking, smashing, feeding hoppers, clamping logs, sawing planks, launching cargo, and watching machinery operate.
- **Number-go-up satisfaction:** Visible earnings, cost-per-tree, throughput, production per minute, price bonuses, machine speed, automation percentages, zone ownership, and desert conversion.
- **Scale satisfaction:** Tiny plastic knife → hand saw → chainsaw → logging truck → harvester → entire industrial zone → landscape-scale extraction.
- **Optimization:** Selling raw wood quickly versus spending time refining it into something dramatically more profitable.
- **Spatial problem-solving:** How to move heavy trunks out of a crowded jungle, where to place mills, and how to route products efficiently.
- **World-impact satisfaction:** A jungle clearing stays cleared. Water tables fall. Grass dies. Terrain cracks. Heat shimmer rises above industrial districts.
- **Completion:** One clear map-wide win condition that cannot be cheesed by painting grass yellow or buying a cosmetic upgrade.

## Optional comedic identity

Lean into a straight-faced parody of ruthless efficiency: the first tool is a plastic butter knife, mission briefings treat absurd acts as routine logistics, and increasingly corporate upgrade names contrast with the visible environmental damage. Keep the world colorful and enjoyable without turning it into a realistic environmental-harm tutorial; this is a stylized fictional sandbox.

---

# 3. 3D WORLD AND GRAPHICAL REQUIREMENTS

## 3.1 Actual geometry, not flat scenery

Every object inside the world must be built with three-dimensional depth, lighting, shading, and correct parallax:

| Element | Mandatory real 3D treatment |
|---|---|
| Trees | Cylindrical/tapered curved trunk geometry, branching meshes, canopy volume, different bark and leaf materials |
| Fallen wood | Cylinders or irregular log meshes, cut faces, collisions, mass proportional to size, stackable segments |
| Foliage | Volumetric clusters of leaf geometry; batched/instanced meshes for distance; no PNG alpha cards |
| Grass | Short procedural blade geometry near player; grouped meshes or biome materials farther away |
| Rocks | Low/high-poly rock meshes with collider shapes; mines produce actual ore chunks |
| Soil | Chunked terrain meshes with vertex heights/material blending; cracks and ruts as geometry or material detail |
| Fire | 3D flame geometry and volumetric/particle-based effects, animated heat, embers, believable fuel consumption |
| Smoke/dust | Geometry/3D particle simulation where practical; not a single camera-facing picture |
| Vehicles | Complete modeled bodies, tires, axles, beds, joints, articulated cranes, and loading bays |
| Machines | Visible blades, rollers, belts, gantries, pistons, grills, fans, cooling units, hoppers, and outputs |
| Products | Actual 3D boards, pallets, furniture, cartons, paper rolls, pellets in containers, crates, etc. |
| Buildings | Full exterior meshes, entrances, machinery modules, roofs, vents, foundations, and local lighting |
| UI 3D previews | Render models in a dedicated 3D preview scene rather than showing screenshots of the items |

Avoid the common fake implementation of a textured green plane with a PNG tree pasted on top. A user should be able to walk around a tree and see the trunk and branches correctly from every direction. A felled log must be a real interactable object, not an image replacing its original tree.

**Permitted optimization:** Geometry LOD, mesh instancing, mesh merging, impostor-free low-poly distance geometry, occlusion culling, streamed chunks, collision simplification, and batched rendering. Do not cheat by reverting to flat picture cards at long range.

## 3.2 Recommended art direction

A cohesive **stylized realistic / polished low-poly industrial** look: readable shapes, physically plausible materials, rich jungle greens, warm wood, orange firelight, heavy yellow construction equipment, dark steel production machines, stark concrete campuses, and desaturated sandy deserts. Favor a distinctive intentional style over poorly matched third-party models.

- Morning mist and shafts of sunlight in untouched jungle.
- Dense overlapping canopy that gradually opens as you cut trees.
- Splinter and sawdust effects when cutting.
- Dust plumes and exposed earth during clearcutting.
- Brown, cracked, and dusty ground after water depletion.
- Heat haze around cooling towers, kilns, mines, and power plants.
- Physical-scale sense: small tool in hand, imposing giant trees, enormous late-game extraction machines.
- Continuous day/night cycle, atmospheric weather, ambient soundscapes that change with biome state.

## 3.3 Map scope and simulation consistency

Implement one **finite campaign map**, not an endless procedural world that makes 100% impossible. Recommended full campaign playable footprint: **4,096 m × 4,096 m**, procedurally generated and streamed, with **16 m × 16 m authoritative biome cells**: 256 × 256 = **65,536 cells**. The initial playable region can be smaller (for example 512 m × 512 m), but every remaining campaign region eventually becomes unlockable and convertible. Divide rendering into 64 m chunks; never instantiate every tree and machine throughout the map at once.

Each biome cell stores at minimum:

```ts
type BiomeStage =
  | 'jungle'
  | 'cleared'
  | 'plains'
  | 'degraded'
  | 'dry_scrub'
  | 'barren'
  | 'desert';

type BiomeCell = {
  x: number;
  z: number;
  stage: BiomeStage;
  naturalVegetation: number;   // 0..1
  soilMoisture: number;        // 0..1
  groundwater: number;        // 0..1
  soilFertility: number;       // 0..1
  localHeat: number;          // scaled game units
  pollution: number;          // 0..1
  erosion: number;            // 0..1
  exposedMineralGround: number; // 0..1
  desertified: boolean;       // derived and persistently verified
  lastSimulatedTick: number;
};
```

Trees are generated deterministically from a world seed and persisted as **removed/modified state**, not millions of duplicate scene nodes. Changes to a cell drive terrain color/material, vegetation density, stump count, dust, weather, production bonuses, and desert progress. Exposed terrain under buildings, roads, and machines must still have a cell state and be included in desert progress.

### Exact 100% definition

For the campaign to win, **every eligible cell** must have `desertified === true`. A cell can become desert when all of these game-rule conditions are satisfied, possibly after a stable hold period:

- Natural tree/vegetation coverage below the configured cap (e.g., `<= 0.03`).
- Soil moisture below the configured threshold (e.g., `<= 0.12`).
- Groundwater below its desert threshold **or** soil fertility/degradation/thermal exhaustion sufficiently high to prevent natural regrowth.
- Desert substrate state established rather than merely painted yellow.
- All regeneration / reclaim processes stopped or suppressed for the stabilization interval (e.g., 60 in-game seconds).

Values are balance defaults, not rigid scientific claims. Implement desert conversion as a deterministic, testable rules function with configurable thresholds and edge cases. A building covering a tile does **not** make it exempt. The player can create a desert state beneath roads and structures via soil removal, water starvation, and heat. Display `X / 65,536 cells`, percentage to two decimal places, zone progress, and a late-game scanner listing remaining non-desert cells. Never round 99.995% up to a false 100.00% win; check the actual count.

### Offline and streaming simulation

- Active nearby chunks: full real-time physics and visible animation.
- Near/far machinery: simplified throughput simulation at fixed ticks without visible moving parts.
- Unloaded cells: deterministic vegetation, dryness, heat, water and production model.
- Save/load: reconstruct only visible meshes while keeping authoritative simulation state intact.
- Long idle periods: capped, configurable offline progress with transparent calculation; do not award impossible resources or convert the full map just because the browser was closed.

---

# 4. OPENING SEQUENCE — THE PLASTIC BUTTER KNIFE

## First five minutes

**Spawn:** Dense jungle, small clearing, a crude wooden sign reading “Ash Exchange,” and a stone fire pit with an iron intake ring. Inventory: `Plastic Butter Knife ×1`. Wallet: `$0`. No backpacks, no automated selling, no free vehicle.

**First objective:** `Cut down one small tree.`

1. Walk to a small young tree. Its trunk is visibly cylindrical and attached to a canopy with actual geometry.
2. Swing the floppy plastic butter knife. The tool visibly wobbles; impacts leave shallow scuffs and make satisfying, stupid scraping sounds.
3. Each valid hit applies tiny but real cutting damage. A tiny tree takes approximately **12–20 hits**, or roughly **25–45 seconds** for a new player; larger species take much longer. Initial progression must be tedious and funny, **not unbearable**.
4. The trunk shows growing marks at the impact point. At the final damage threshold the tree creaks, leans away from the cut, falls using a falling-tree animation/physics hybrid, collides with the ground, and leaves a stump.
5. The trunk becomes one or more real 3D rigid bodies. Press/hold **E** to grab a reachable log; use mouse movement / walking to drag it with a physically convincing joint/constraint. A mass/drag indicator appears. Heavy logs may be pushed or rolled rather than lifted.
6. Drag the fallen tree to the 3D fire pit. The flames increase as the log enters; wood disappears via a burn animation after a short visible delay.
7. Earn the first **$12–$20** based on wood mass and species. Show the money as a world-space popup and deposit it into the wallet with a real sale receipt.
8. Buy the first upgrade: **Butter Knife Serration** or **Rubberized Grip**. The next tree feels measurably faster or easier.
9. Unlock a tiny hand saw, rope, or log cart; the player makes an early choice between **cutting speed, hauling convenience, or refining profit**.

Design the first hour so that the player is frequently choosing between faster chores and better monetization. Example: a $15 fire sale is instant; sawing and selling planks from the same log might produce $35–$55, but requires an extra trip and interaction. A later kiln and woodworking bench can multiply value again.

## Knife interaction rules

- Starting item is a **blunt plastic butter knife**, not a metal combat knife or axe.
- Swing must contact the tree mesh/collider within plausible reach; no remote one-click tree disappearance.
- Show cut progress in the crosshair tool tip or small local progress indicator.
- Add simple hit stamina and weapon wobble so upgrades have meaning.
- First knife does not permanently break before the player can afford a replacement; degradation is cosmetic or serviceable initially.
- Blade reinforcement, serrations, grip, handle, leverage, durability, and stamina upgrades eventually transform the original joke tool into an absurdly over-engineered logging instrument.
- Preserve the knife as an equipable trophy even when giant machinery supersedes it.

---

# 5. THE CORE LOOP AND ITS ALTERNATIVES

## 5.1 Fundamental interactive loop

```text
FIND TREE / RESOURCE
        ↓
CUT / BREAK / HARVEST
        ↓
PHYSICALLY MOVE IT OR ASSIGN LOGISTICS
        ↓
CHOOSE A DESTINATION
    ├── Fire pit ────────────────→ Quick cash + ash/charcoal
    ├── Raw wood buyer ──────────→ Simple cash, slightly better market price
    ├── Sawmill ────────────────→ Planks / beams / sawdust
    ├── Refinery / kiln ───────→ Dry wood / treated wood / pellets / carbon
    ├── Workshop ──────────────→ Furniture / pallets / crafts / building kits
    ├── Pulp plant ────────────→ Paper / cardboard / packaging
    ├── Power or heat plant ───→ Electricity + industrial heat/dryness
    └── Stockpile / contracts ─→ Delayed bulk sale or factory input
        ↓
EARN MONEY / RESOURCES / LAND IMPACT
        ↓
BUY TOOLS / TRANSPORT / MACHINES / UPGRADES
        ↓
AUTOMATE AND SCALE
        ↓
DRY OUT AND INDUSTRIALIZE MORE TERRITORY
        ↓
100% DESERT CAMPAIGN VICTORY
```

## 5.2 The three constantly competing goals

| Goal | Player decision | Trade-off |
|---|---|---|
| Fast money | Burn logs or sell raw timber | Low profit per unit; fast upfront cash |
| Maximum money | Refine into high-value products | Extra handling, machines, production time, transport costs |
| Maximum desert conversion | Destroy vegetation, strip soil, drain water, build industry | Some methods earn little cash but convert land extremely quickly |

The game should never reduce every decision to a single optimal route. Prices, contracts, machine throughput, space, processing inputs, water availability, and market demand should make different strategies viable.

---

# 6. THE TREE SYSTEM

## 6.1 Tree variety

Include a deterministic ecosystem with at least these functional tree types, each rendered in 3D with meaningful geometry differences:

| Tree type | Mass / hardness | Economic niche | Challenge |
|---|---|---|---|
| Young jungle sapling | Very light / soft | Starter fire sales | Easy first cut and drag |
| Palm-like tree | Light / fibrous | Fibers, decorative lumber | Long awkward trunk |
| Softwood canopy tree | Medium / soft | Planks, paper | High volume |
| Dense hardwood | Heavy / hard | Premium furniture, beams | Requires better tools |
| Twisted rainforest tree | Medium / irregular | Crafts, veneer | Hard to stack and carry |
| Giant buttress-root tree | Extremely heavy | High-end lumber, large contracts | Requires heavy machines |
| Dead standing tree | Dry / brittle | Fast fire fuel, pellets | Lower product quality |
| Rare patterned timber | Medium / premium | Luxury crafting | Rare, requires careful harvesting |
| Vined tree | Medium / entangled | Fiber byproducts | Tangled movement and cutting |
| Ancient canopy giant | Massive / dense | Prestige contract or monument | Endgame harvesting challenge |

Generate thickness, height, branch distribution, canopy density, log yield, quality, weight, and carbon/fuel value from seed. Trees should block movement, cast shadows, make sounds, and interfere with equipment until removed.

## 6.2 Cutting and destruction feedback

- Start with hit-based progressive cutting; support continuous sawing for power tools.
- Visual cut marks appear at actual impact height; procedural bark chips and fine sawdust burst outward.
- At fall threshold, apply an authored impulse/controlled hinge to prevent absurd chaotic physics while retaining credible collisions.
- Falling trees push or bounce against other 3D trees and structures, with sensible caps to prevent endless physics cascades.
- Once down, trunks may be segmented at chosen cut points. Each resulting log has persistent length, radius, species, grade, mass, and price.
- Stumps are separate 3D objects. Remove them with a shovel, grinder, digger, harvester, or bulldozer to clear the cell fully.
- Roots affect soil fertility and moisture until removed/decayed; uprooting is a separate land-clearing strategy.
- Some machines strip leaves and branches automatically; cheaper methods leave cleanup chores and burnable biomass.
- Use visible damage stages for non-tree destructibles: rocks, soil piles, roots, machines needing maintenance, and abandoned structures.

## 6.3 Destruction methods beyond chopping

Implement distinct methods with different cost, sound, speed, terrain impact, byproducts, and risks:

1. Butter-knife scraping.
2. Pocket saw cutting.
3. Hatchet chopping.
4. Two-handed axe chopping.
5. Manual crosscut sawing.
6. Electric chainsaw cutting.
7. Fuel chainsaw cutting.
8. Heavy industrial felling saw.
9. Tree-shear attachment.
10. Hydraulic log splitter.
11. Brush cutter and vegetation shredder.
12. Stump grinder.
13. Excavator uprooting.
14. Bulldozer clearing and compacting.
15. Front-loader pushing and piling.
16. Whole-tree harvester processing.
17. Forestry mulcher shredding to biomass.
18. Tractor-driven clearing rig.
19. Controlled, stylized vegetation-burning zone (with firebreak and gameplay containment rules).
20. Large land-clearing demolition machines.
21. Rock crusher and quarry blasting as an **abstract fictional upgrade effect**, not real-world explosive construction instructions.
22. Industrial soil scraper.
23. Mining bucket-wheel system.
24. Automated laser pruning/felling as absurd late-game sci-fi machinery.
25. Massive endgame land-conversion megaprojects with visible machinery and bounded per-cell effects.

No machine should instantly clear entire unlocked zones merely because a purchase button was clicked. Large upgrades require construction, power/fuel, inputs, maintenance, and/or simulation time.

---

# 7. DRAGGING, CARRYING, AND LOG TRANSPORT

**Transport is a primary pillar of the game**, not a side menu. At every stage the player should physically see where wood goes and why a new transport invention is worthwhile.

## 7.1 Entry-level methods

| Method | Player interaction | Core limitation | Upgrade payoff |
|---|---|---|---|
| Grab-and-drag | Hold E; constrained physics log follows at limited distance | Friction, stamina, heavy mass | Stronger grip, longer reach |
| Roll the log | Push against trunk or use short lever | Downhill/terrain dependent | Faster on prepared ground |
| Carry chunks | Cut logs into shorter 3D sections, pick up by hand | Carry mass / slow movement | Better backpack and lifting |
| Rope tether | Attach rope endpoints to log and player | Tangling/drag resistance | More pulling force |
| Two-person pull helper | Hire temporary NPC laborer | Wages and slow speed | Extra worker slots |
| Drag sled | Load logs on sliding wooden platform | Weight and friction | More capacity |
| Wheelbarrow | Pick up shorter logs and debris | Manual loading | Higher load capacity |
| Hand cart | Stack logs and pull two-wheel cart | Terrain and traction | Larger bed, better tires |
| Cable winch | Fix cable to stump/vehicle, retract to reel log | Range and line of sight | Remote pulling |
| Gravity chute | Build downhill timber chute | Limited to slopes | Routes to mill automatically |

## 7.2 Midgame methods

- Bicycle/cargo tricycle with tiny timber trailer.
- Powered mini-cart with hitch.
- ATV and log trailer.
- Small tractor with towing chain.
- Pickup truck with bed and tow hook.
- Forklift with physical forks and pickup pallets.
- Skid steer with log grapple.
- Loader with fork/grapple attachment.
- Forestry forwarder with hydraulic crane.
- Logging truck with stakes, realistic bed limits, and loading crane.
- Flatbed truck and roadside yard.
- Dedicated mechanical loader and log stacker.
- Cable yarder for rough hill extraction.
- Timber conveyor belt with transfer points.
- Roller transport line and feed hopper.

## 7.3 Late-game and absurd methods

- Rail logging train with flatcars and timetabled stations.
- Automated trucking dispatch system.
- Autonomous log haulers that navigate roads.
- Loader drones for small logs and high-value parts.
- Heavy-lift drone or helicopter for giant segments (costly and fuel-intensive).
- Cargo monorail.
- Industrial pneumatic tube for small processed products only.
- Overhead crane grid.
- Self-loading conveyor/robotic log sorting hub.
- Modular logistics warehouses.
- Long-range cable route between mountains/clearings.
- Automated port/barge system if the generated campaign seed includes waterways.
- Endgame mass-handler gantries that pick up many actual logs through a batched physics representation.

### Transport implementation rules

Every carrier has modeled capacity: item types, mass, volume, bed size, number of attachment points, load/unload seconds, speed, operating cost, durability, and path requirements. Loading a log into a truck is an actual grapple/fork/manual interaction (or an explicit employed loader automation), not teleporting items into a UI spreadsheet. A simplified inventory abstraction is permitted only inside accepted factory buffers after the item has physically reached the intake zone. The world's logs must remain 3D visible while on the ground, in a cart, or in a vehicle bed.

Road surfaces, bridges, rails, ramps, chutes, and conveyors need real 3D meshes and affect routing. Road building may contribute to ground degradation. Vehicles must be drivable with acceleration, braking, steering, collision, cargo mass penalties, and a sensible reset for stuck machinery.

---

# 8. WOOD PROCESSING, REFINING, AND SELLING

## 8.1 Price model

For each product, calculate sale revenue from actual inputs and operations rather than minting currency from arbitrary animations.

```text
Net Profit = Buyer Payout
             − Resource Purchase Cost (if any)
             − Operating Costs
             − Processing Energy Cost
             − Transport Cost
             − Labor Cost
             − Contract Fees
```

Use fictionalized prices for fun. Initial tuning example:

| Route for one starter tree | Example gross payout | Steps | Strategic identity |
|---|---:|---|---|
| Burn raw trunk at Ash Exchange | $15 | Chop → drag → burn | Immediate beginner cash |
| Sell sorted raw timber | $22 | Chop → drag → sort → buyer | Slightly better raw-material return |
| Saw into planks | $42 | Chop → haul → saw → deliver | First big value-add |
| Dry and grade planks | $60 | Saw → dry → quality → deliver | Capital/time investment |
| Craft crates or pallets | $80 | Saw → assemble → ship | Repeatable factory chain |
| Craft simple furniture | $110 | Mill → dry → workshop → ship | High-value low-throughput |
| Luxury finished goods | $180+ | Premium log → treatment → complex crafting | Advanced late-game contracts |

These are **illustrative balancing targets**, not fixed promises. Product quantities, quality, time, energy, and demand must be modeled. A log cannot be counted as sold if it has also been sent to a factory.

## 8.2 Processing and product chains

```text
WHOLE TREE
 ├─ Trunk / logs
 │   ├─ Fire pit → instant cash + ash + heat
 │   ├─ Raw log sale → cash
 │   ├─ Debarker → clean logs + bark
 │   ├─ Sawmill → rough boards + beams + sawdust
 │   │    ├─ Drying racks → dried lumber
 │   │    │    ├─ Planer → finished lumber
 │   │    │    ├─ Treatment bath → treated boards
 │   │    │    ├─ Joinery → furniture, shelves, flooring
 │   │    │    ├─ Assembly → pallets, crates, shipping boxes
 │   │    │    └─ Engineered wood → plywood / laminates
 │   │    └─ Offcuts → chips / fuel / pulp / pellets
 │   ├─ Chipper → wood chips → pulp / fuel / landscaping product
 │   ├─ Charcoal kiln → charcoal + heat + byproducts
 │   ├─ Pellet mill → biomass pellets → sale / power
 │   └─ Pulp refinery → paper / cardboard / packaging
 ├─ Branches → chips, wood fuel, stakes, craft parts
 ├─ Leaves → compost, biomass, low-grade fuel
 ├─ Bark → mulch, tannin/industrial material, fuel
 └─ Stumps / roots → biomass, soil clearing, land prep
```

### Mandatory craftable product families

1. Raw logs and sorted timber.
2. Firewood bundles.
3. Wood chips and biomass.
4. Charcoal, briquettes, and pellets.
5. Rough planks and dimensioned boards.
6. Structural beams and posts.
7. Kiln-dried lumber.
8. Treated outdoor lumber.
9. Plywood and engineered panels.
10. Veneer sheets and specialty finishes.
11. Pallets, crates, and shipping cases.
12. Shelves, benches, tables, cabinets, chairs, and desk components.
13. Decorative sculptures, novelty items, and souvenir products.
14. Flooring, wall panels, and construction kits.
15. Doors, frames, and window assemblies.
16. Paper rolls and sheets.
17. Cardboard and packaging boxes.
18. Wood-fiber insulation and composite boards.
19. Industrial utility poles and large specialty timbers.
20. Premium custom orders using rare wood grades.

Each has a recipe (input items and amounts), process time, facility requirement, energy usage, byproducts, storage and packaging rules, a buyer market, and quality modifiers. At least the first **10** product families must be fully integrated into the initial mature build; all **20** are the complete scope target.

## 8.3 Trading and contracts

- Ash Exchange: always available at low price, no buyer wait.
- Timber yard: sorted raw lumber, commodity pricing and capacity.
- Construction contractors: beams, boards, treated wood, pallets.
- Furniture buyers: graded lumber and finished furniture.
- Packaging distributors: crates, cardboard, paper.
- Industrial buyers: fuel pellets, charcoal, sawdust, pulp.
- Luxury markets: rare wood crafts, specialty furnishings.
- Bulk export terminal: trucks/railcars, large slow contracts.
- Dynamic orders: timed bonuses and specific grades/quantities.
- Long-term contracts: reliable prices at volume, penalties for under-delivery.
- Auction house: occasional high-value premium orders.
- Price forecast and sales dashboards: demand/supply and historical pricing.

Early selling should be simple; later selling should be a real logistics and market optimization system.

---

# 9. MANY PATHS TO DESERTIFICATION

**The goal is not merely to remove trees**. Cutting trees initially produces open land. To reach the final win condition, the player must remove regenerative vegetation and push the land into stable desert conditions. All these are **fictional game mechanics**, abstracted for strategy rather than real-world environmental engineering guidance.

## 9.1 Alternative conversion pathways

| Path | Activities/buildings | Mechanic | Strength / weakness |
|---|---|---|---|
| **Mass logging** | Chainsaws, harvesters, stump grinders, mulchers | Removes vegetation and tree-root moisture protection | Fast forest removal; insufficient alone for desert |
| **Fire industry** | Wood-burning contracts, biomass burners, charcoal plants | Cash/power plus local thermal/dryness effects | Good early money; localized effect |
| **Water extraction** | Pumps, pipelines, reservoir companies, irrigation redirection | Lowers groundwater and soil moisture in linked zones | Powerful desertification; energy and pipe cost |
| **Industrial agriculture** | Crop fields, overworked soils, fertilizer-intensive production | Consumes soil fertility and groundwater over time | Earns money; seasonal and slow |
| **Industrial grazing** | Huge livestock yards and automated grazers | Strips regrowth and compacts soil | Low-tech option; requires zone management |
| **Strip mining** | Quarries, excavators, ore mines, pit conveyors | Removes vegetation/topsoil, exposes mineral substrate | Very fast tile conversion; expensive terrain work |
| **Cement and construction** | Cement plant, asphalt plant, road grid, concrete batching | Converts terrain/soil cover; raises local thermal loading | Industrial expansion supports everything else |
| **Thermal power** | Coal/oil/biomass/fantasy-grid plants and cooling systems | Heat output accelerates dry terrain | High electricity; fuel/pollution requirements |
| **Data centers** | Server halls, cooling towers, substations, campus expansion | Heat, water consumption, large footprints, infrastructure demand | Extremely scalable; not required |
| **Chemical processing** | Refinery complexes and treatment plants | Abstracted emissions/degradation pressure | Strong advanced effect; high expense and upkeep |
| **Salt/soil depletion** | Fictional salt extraction yards, dryland refineries | Lowers soil productivity and regrowth rate | Precise but expensive to operate |
| **Urban sprawl** | Logistics megahubs, warehouses, freight depots, parking | Soil coverage, runoff, heat accumulation | Passive territorial effect |
| **Renewable megaprojects** | Solar megafields and wind farms | Removes vegetation/needs maintenance roads; can drive pumps | Cleaner power route; must still dry soil separately |
| **Dust storm feedback** | Exposed dry terrain and climate simulation | Downwind cells lose moisture and vegetation gradually | Strong chain reaction only after setup |
| **Endgame terra-dryer** | Fictional gigantic desiccation array | Consumes huge power and cost to dry stubborn cells | Targeted cleanup, must operate over time |

**Important:** No single method automatically yields 100% desert without meeting the full cell rules. Some paths excel at removing canopy, others at eliminating groundwater, soil fertility, or regrowth. Players are rewarded for combining systems, but the design supports specialized builds with alternative solutions and unlocks.

## 9.2 Systemic conversion gameplay

A clearing first becomes grassy/plains land. If left alone and healthy, it can start to regrow; the player must prevent that through industrial actions. Nearby deserts may spread dryness through wind and heat, but not infinitely or instantly. Water networks have measurable areas of effect. Soil stripping leaves visible rock or sand. Heat maps and dryness maps let players identify why a cell is stuck at `barren` rather than `desert`.

A heat-producing data center could dry a region, but only if water consumption, local heat, and soil state make conversion possible. A mining player may remove the topsoil quickly but need pumps or thermal machines to finish. An agriculture player may deplete soil progressively while monetizing crops, then deploy graders to expose sand. An industrial power player may use excess heat from large plants to accelerate regional dryness. All have 3D structures, resource economics, and operating costs.

## 9.3 Late-game cleanup mechanics

Near the win condition, the final 0.1% must be engaging rather than a pixel hunt:

- **Biome scanner** finds remaining jungle, plains, wet soil, recovering cells, and unconverted subcells.
- **Global status board** displays exact remaining cell counts and categories of failure.
- **Map overlays** show moisture, vegetation, groundwater, fertility, heat, restoration, and equipment influence.
- **Dispatch-to-cell** sends a compatible player-owned machine to the problem area.
- **Survey drone** and **climate sensor network** reveal hidden underground water pockets.
- **Terraforming bulldozer** and **soil vacuum** mechanically clear special persistent terrain blockers.
- **Mega-dryer** is a very expensive, energy-hungry final assist, not a free win button.
- **Final hold timer** requires every cell to remain eligible long enough to prevent one-tick exploits.

---

# 10. PROGRESSION PHASES

| Phase | Title | Typical focus | Unlock / milestone |
|---|---|---|---|
| 0 | **Plastic Age** | Butter knife, small saplings, manual dragging, fire sales | First $100, first basic upgrades |
| 1 | **Hand Tool Hustle** | Axe/saw, rope, sled, wheelbarrow, raw timber | First $2,500; choose early specialty |
| 2 | **Backyard Sawmill** | Milling planks, drying, pallets, carts, small market | First $25,000; reliable crafted revenue |
| 3 | **Logging Business** | Chainsaw, truck, skid steer, winch, hires | First $250,000; zone-scale clearing |
| 4 | **Factory District** | Conveyors, kilns, furniture, paper, contracts | First $2,500,000; sustained automation |
| 5 | **Industrial Forestry** | Harvesters, forwarders, rail, heavy earthmoving | First $25,000,000; mass logging |
| 6 | **Industrialization** | Mines, cement, power, pumping, irrigation diversion, warehouses | Region conversion becomes deliberate |
| 7 | **Climate Industry** | Heat, runoff, soil exhaustion, dryland tech, mega-farms | Large connected desert regions |
| 8 | **Mega-Campus Era** | Data centers **or** equivalent mega-industrial paths, drones, grid, factories | Most of map becomes dryland |
| 9 | **Desert Architect** | Survey network, exact remaining-cell cleanup, huge projects | 99%+ desert |
| 10 | **The Last Green Pixel** | Finish all hold timers and biome blockers | **100% desert = victory** |

Progression milestones are **illustrative** and should be balanced around a long but rewarding playthrough. The time to complete a normal campaign should be tunable (example target: 25–60 hours with optional longer completionist goals), with constant unlocks in the first few hours and exponential scale later.

---

# 11. BUILDINGS, MACHINERY, AND INFRASTRUCTURE

## 11.1 Purchase/build model

Buildings must be placed in world space with 3D previews, placement collision, foundation/terrain constraints, a visible construction phase, physical entrances/intakes/outputs, upgrade slots, and actual modeled machine parts. A player should be able to watch a log physically travel through a sawmill, come out as a bundle of planks, then get carried or conveyed to the next station.

**Facilities to implement** (each is a system, not just a decorative model):

- Ash Exchange bonfire and industrial burning plant.
- Tree-cutting and debranching yard.
- Raw timber sorting station.
- Manual sawbench, small sawmill, heavy sawmill, high-volume mill.
- Debarking station, log splitter, wood chipper.
- Drying racks, kiln, treatment and finishing station.
- Joinery workshop, furniture factory, pallet plant, engineered wood factory.
- Paper/pulp mill, cardboard factory, pellet plant, charcoal works.
- Warehouses, sorting belts, forklifts, log bins, truck loading docks.
- Delivery terminal, wholesale yard, rail depot, export freight station.
- Tool workshop, mechanics shop, refueling bay, charging station.
- Worker cabin, dispatch office, surveying station, research lab.
- Pump house, water reservoir, coolant plant, pipelines, water depot.
- Electricity substation, transformers, poles, cables, battery facilities.
- Biomass power station, fossil-themed fictional thermal plant, solar field, wind farm.
- Quarry, rock crusher, mineral sorter, mine office, strip mine.
- Cement plant, asphalt works, road contractor yard, construction depot.
- Industrial crop fields, livestock yards, nutrient-exhaustion facilities.
- Chemical plant and soil degradation machinery, treated as abstract game systems.
- Data center hall, server racks, HVAC units, cooling towers, substations, giant mega-campus.
- Industrial heat emitters, desertification array, mega-dryer, climate monitoring array.
- Logistics control tower, drone depot, autonomous truck garage, railway hub.

## 11.2 Data centers are optional, fully realized, and expensive

Data centers should feel monumental and visually impressive, but **do not make them the only viable way to win**. A data center consumes electricity, cooling water, spare parts, and land; generates recurring contract income from compute customers; produces waste heat; and can contribute to nearby dryness depending on conditions. Add real 3D rows of server cabinets, rooftop vents, cooling equipment, backup generator housings, substations, fiber conduits, fans, and illuminated status lights.

Gameplay mechanisms:

- Build small server room → medium hall → modular campus → multi-building mega-campus.
- Provide enough grid power and cooling capacity to avoid throttling/downtime.
- Contract types: storage, batch compute, virtual servers, fictional AI training jobs, long-term hosting.
- Trade money production against power load, cooling-water usage, and local heat footprint.
- Cooling strategies have different energy and water costs; airflow and thermal maps are game abstractions.
- Server utilization, efficiency, hardware failure, maintenance, and electricity prices matter.
- Reinforce the satire by showing how an empire built from one plastic butter knife now uses electricity to keep thousands of imaginary servers running.

## 11.3 Utility networks

Power, fuel, water, and item flows must be accounted for:

```text
POWER:   generation → storage/substation → cables → consumers
WATER:   source/pump → pipes/reservoir → consumers/drainage
ITEMS:   physical infeed → machine inventory/buffer → output → logistics
HEAT:    source → cell influence/atmosphere → decay/spread → biome update
ROADS:   depot → connected road graph → destination → vehicle routing
RAIL:    station → track graph → station → load/unload timetable
```

Each can be visualized as a map overlay with capacity and bottlenecks. Machines enter a clearly indicated idle/blocked state when inputs, energy, output storage, cooling, or labor are missing. Avoid magical free resources and invisible cross-map teleportation.

---

# 12. WORKERS, NPCS, AND AUTOMATION

Start manually, then automate the least enjoyable repetition while preserving the satisfying feel of physical industry.

## Worker roles

- Tree spotter, lumberjack, stump remover, hauler, truck driver.
- Crane operator, forklift operator, warehouse loader, sorting worker.
- Sawmill operator, kiln technician, carpenter, assembler.
- Mechanic, refueler, electrician, pipeline maintenance worker.
- Contract manager, buyer, research assistant, dispatcher.
- Excavator operator, mining crew, climate engineer, surveyor.

## Automation levels

1. **Manual:** Every job requires player input.
2. **Assist:** Worker holds/carries, loads, sorts, or tends one station.
3. **Task:** Worker is assigned a route or job with priorities.
4. **Production chain:** Multiple buildings exchange items along connected logistics.
5. **Zone automation:** Harvest resources in a designated polygon, transport to named facility, process and sell automatically.
6. **Global dispatch:** Central controller allocates fleets, repairs and production to goals with configurable profit/desert priorities.

Automation should be inspectable and editable. Players must be able to specify: `chop in Zone A`, `leave rare hardwood alone`, `send softwood to pulp`, `send branches to biomass`, `load trucks once 80% full`, `prioritize moisture-drain projects`, and `do not operate machines that lose money`.

Use task queues, finite storage, route finding, and sensible NPC proxies in far chunks. Do not simulate thousands of fully animated workers offscreen. Prevent automation from creating infinite items through asynchronous race conditions.

---

# 13. WORLD SIMULATION: WEATHER, ECOLOGY, AND INDUSTRY

## 13.1 Weather

- Sunny days accelerate exposed-soil drying.
- Rain recharges moisture and can slow conversion; drainage infrastructure mitigates it.
- Dry wind spreads dust and desiccation where terrain is already degraded.
- Storms may temporarily affect vehicle traction, electricity, roads, and production.
- Night changes visibility and lighting; upgrades add floodlights and headlamps.
- Seasons or climate phases can shift long-term moisture trends, with accessibility options to simplify.

## 13.2 Regrowth and ecological memory

Freshly cleared jungle does not instantly become permanent desert. Grasses, shrubs, or saplings may regrow if fertility and moisture remain healthy. Stump removal, soil compaction, loss of groundwater, overheating, and industrial land use suppress restoration. Restoring a depleted cell requires active intervention, so it should not secretly regenerate into green terrain after the campaign win.

## 13.3 Research, business, and operating costs

Research points can be earned by completing work, recording production milestones, fulfilling contracts, and running laboratories. Upgrades have money costs plus prerequisite achievements/technology; avoid turning every unlock into a single currency gate. Machines require maintenance, power, staff or operator automation, and input resources. Offer a readable breakdown of every expense, profitability per facility, and throughput over time.

## 13.4 Optional challenge modifiers

- **Casual:** Faster payouts, forgiving machines, slower regrowth.
- **Standard:** Intended progression.
- **Industrial Expert:** Deeper transport/energy/maintenance logistics.
- **Sandbox:** Unlock tools and set parameters for experimentation; achievements/endgame distinguished from normal campaign.
- **No Data Centers:** Show that alternative victory paths actually work.
- **Manual Logging Challenge:** Maximize physical chores with limited automation.
- **Speedrun:** Standardized seed and timer.

---

# 14. PLAYER CONTROLS AND EXPERIENCE

| Input | Default | Result |
|---|---|---|
| Move | WASD | Walk/drive depending on mode |
| Look | Mouse | FPS camera |
| Jump | Space | Jump |
| Sprint | Left Shift | Move faster; stamina cost |
| Use tool / swing | Left mouse | Hit/chop/saw at valid target |
| Aim / alt tool | Right mouse | Inspection, tool-specific alt action |
| Interact / grab | E (hold for drag) | Grab log, activate machine, pick up item |
| Drop / detach | G | Release held log, rope, or carried item |
| Tool wheel | Q | Equip another actual tool |
| Inventory | Tab | Bag and owned equipment |
| Build mode | B | Place structures and roads |
| Map | M | World map, zones, conversion overlays |
| Upgrades | U | Tech tree and purchasing |
| Journal / objectives | J | Tasks, achievements, tutorial |
| Vehicle enter/exit | F | Drive supported vehicle |
| Pause/settings | Escape | Menu, controls, quality settings |

Mobile controls: touch joystick/look area, large grab/swing/interact actions, collapsible inventory/build HUD, graphics presets, and context-sensitive UI. Aim for solid desktop gameplay first; mobile may run a reduced-scale 3D graphics preset without sacrificing actual geometry.

## HUD layout

- Top left: wallet, earnings per minute, current task, optional company level.
- Top center: total map desertification %, exact remaining cells, current zone.
- Top right: mini-map, time/weather, player health/stamina, event notifications.
- Bottom center: equipped tool with durability, tool upgrades, current target state.
- Bottom right: carrying mass, interaction hint, capacity/drag resistance.
- Context panels: machines show inputs, outputs, efficiency, available power, and money/time estimates.
- Easy-to-open processing and selling screens, but do not use those menus to fake physical items or work.

Accessibility: subtitles, text scaling, reduced camera shake, reduced particle effects, motion blur off by default, low-contrast flashing avoidance, colorblind-friendly map overlays, remappable keybinds, adjustable FOV, and an optional toggle to hold rather than repeatedly click for cutting.

---

# 15. INCREMENTAL ECONOMY AND BALANCE

## 15.1 Upgrade philosophy

An upgrade must provide at least one measurable improvement to **interaction speed, power, capacity, efficiency, range, item quality, routing, automation, conversion speed, selling price, operating cost, or reliability**. Avoid repetitive meaningless `+1%` filler. Include branching choices, prerequisites, meaningful synergies, and specialized builds.

Use multiple price scales so early improvements cost tens of dollars, midgame machinery costs thousands to millions, and landscape-scale systems cost many millions/billions. Costs shown in the catalog below are **prototype estimates** to be tuned against actual income. Ensure no unavoidable softlock (e.g., a starter tree is too expensive to chop or sell without a purchased item).

## 15.2 Money sinks

- Tool purchases, repairs, sharpeners, fuel, batteries, ropes.
- Vehicle purchases, tires, fuel, maintenance, replacement attachments.
- Land deeds, permits inside fiction, roads, rails, terrain foundations.
- Worker wages, machinery uptime and facility operating costs.
- Electricity generation/distribution and fuel supply.
- New factory lines and modular upgrades.
- Buyer contracts, export terminals, freight, storage.
- Research labs, prototypes, surveys, climate projects.
- Endgame projects and optional nonessential cosmetic decorations.

## 15.3 Anti-exploit principles

- A tree/log can only be sold once, even with simultaneous burn and sawmill colliders.
- Output products must consume valid inputs; never duplicate on load/unload/save.
- Pending machine work resumes consistently after save/load.
- Trading refunds are idempotent; failed delivery cannot pay twice.
- Selling prices fluctuate within bounds so no arbitrage loop generates infinite money from buying and instantly reselling.
- Offline production must use actual inputs, power, and available storage.
- Automatic harvesting must respect world/tree state, zone ownership, and machine capacity.
- Desertification percent comes from biome simulation data, not a purchasable flat bonus.

---

# 16. QUESTS, ACHIEVEMENTS, EVENTS, AND LONG-TERM CONTENT

## Quest lines

- **A Seriously Bad Knife:** Scrape down the first tree; drag it into the fire; spend the first $15.
- **No More Splinters:** Obtain rope and haul multiple logs in one trip.
- **Fire Sale:** Earn $1,000 through immediate burns.
- **Actually Use the Wood:** Process raw logs into planks and complete a lumber contract.
- **Assembly Required:** Deliver 100 crates or pallets.
- **Road to Nowhere:** Clear and construct the first hauling route.
- **The Mill Never Sleeps:** Reach continuous positive mill throughput.
- **Machine Supremacy:** Buy the first dedicated tree harvester.
- **First Artificial Drought:** Desertify 100 cells using water/soil/heat systems.
- **The Last Forest:** Clear the final ancient canopy giant.
- **Industrial Capital:** Build 20 operational industrial facilities.
- **Choose Your Poison:** Reach 50% desert using a non-data-center-led strategy.
- **Everything Is Fine:** Hit 90% desert while the world is visibly dusty.
- **The Last Green Pixel:** Identify and convert the final resisting cell.
- **The Last Jungle:** Achieve authoritative 100% desert and hold through stabilization.

## Achievement ideas

“Dinner Knife Lumberjack,” “Logistical Nightmare,” “Drag Racing (With Logs),” “Ashes to Assets,” “Pallet Baron,” “Don't Mind the Dust,” “One More Sawmill,” “Profit From Sawdust,” “The Floor Is Sand,” “I Thought This Was a Forest,” “No Trees Were Spared,” “Industrial Salad,” “I Can Hear the Fans,” “99.99% Isn't 100%,” “All Desert, No Excuses,” “The Big Empty,” “Wood You Believe It,” and “Unreasonably Large Knife.”

## Dynamic events

- Premium lumber contract expires soon.
- Heavy rain slows conversion in one zone.
- Wildly high pallet demand makes refining worth it.
- A stalled forklift blocks a vital sawmill queue.
- Power demand spike throttles a campus.
- Warehouse is full; redirect output or purchase more storage.
- A previously ignored damp patch starts regrowing.
- A dry wind event provides temporary conversion acceleration in exposed zones.
- Tool manufacturer offers a strange prototype knife attachment.
- Market panic creates an enormous paper/cardboard order.

---

# 17. ENDGAME, VICTORY, AND OPTIONAL NEW GAME+

## Authoritative victory requirements

1. Every campaign cell is unlocked, accounted for, and included in conversion denominator.
2. No unresolved green/wet/fertile/recovering cells remain.
3. Every eligible cell passes the configured `isDesertified` test.
4. Every eligible cell remains valid through the stabilization window.
5. The screen shows **100.00% DESERT** and **0 cells remaining**.
6. Trigger victory only once per campaign completion (idempotent) and save the event.

## Victory presentation

Show an optional cinematic flyover from the original starting clearing across former rainforest, sawmill networks, abandoned stump fields, giant factories, quarries, dry rivers, enormous power facilities, roads, and server campuses or alternative industrial megastructures. Everything is dry. Display comparison views recreated from captured deterministic world states, not PNG stand-ins in live gameplay; screenshots are okay as **UI memories**, not as world objects. Present total wood harvested, distance dragged, first knife strikes, money earned, favorite processing route, factories built, electricity consumed, water drained, amount of desert created by method, total playtime, and completion score.

## After the ending

The completed world remains explorable, vehicles and factories still work, and the player may continue maximizing efficiency, buying optional trophies, or choosing **New Game+**. New Game+ can offer a larger/harder new finite map, richer species, randomized contracts, harder groundwater pockets, new equipment skins, and prestige bonuses. It must always retain a finite map and an achievable 100% desert criterion. New Game+ is **optional**, not required to finish the first game.

---

# 18. TECHNICAL STACK AND ARCHITECTURE

## Recommended browser implementation

- **Language:** TypeScript (strict mode).
- **App shell/UI:** React + Vite (or another equally capable typed frontend).
- **3D scene:** Three.js with React Three Fiber (R3F) and Drei utilities where appropriate.
- **Physics:** Rapier via `@react-three/rapier` or a similarly robust WASM rigidbody solver.
- **State:** Well-defined simulation state (e.g., Zustand + deterministic simulation services / ECS-inspired structures); avoid one React rerender per tree per frame.
- **Persistence:** Versioned IndexedDB via Dexie or equivalent, explicit autosave and export/import save files; localStorage only for small preferences.
- **Networking:** Optional later; the game must run offline as a single-player web experience without requiring paid services, auth, or a backend.
- **Audio:** Positional Web Audio using original/licensed sounds; fallbacks for browsers that block autoplay.
- **Assets:** Procedurally generated 3D mesh assets and/or imported glTF/GLB models. Mesh compression (Draco/meshopt) and reusable instancing allowed.
- **Performance:** Object pools, fixed physics ticks, instanced tree batches where possible, procedural chunk generation in a worker where compatible, efficient GPU draw calls, and throttled distance simulation.
- **Testing:** Vitest unit tests, Playwright browser interaction tests, in-engine debug panel for game-state inspection, performance profiling.

## Suggested source tree

```text
project-clearcut/
├── README.md
├── package.json
├── public/
│   ├── models/                 # Actual .glb/.gltf models, if any
│   ├── audio/                  # Licensed/original audio only
│   └── fonts/
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   ├── GameScreen.tsx
│   │   ├── Menus.tsx
│   │   └── Router.tsx
│   ├── game/
│   │   ├── core/               # fixed ticks, event bus, state model, game loop
│   │   ├── player/             # controller, hand tools, grabbing, carrying
│   │   ├── world/              # seed, terrain, chunks, biomes, vegetation
│   │   ├── physics/            # cuts, joints, falling, loading constraints
│   │   ├── resources/          # tree/log/product/resource types
│   │   ├── industry/           # recipes, buildings, production and energy
│   │   ├── logistics/          # routes, vehicles, AI task dispatch
│   │   ├── economy/            # contracts, pricing, ledger, purchases
│   │   ├── progression/        # upgrades, unlocks, achievements, quests
│   │   ├── environment/        # heat, groundwater, weather, conversion
│   │   ├── save/               # versioned schema, backup, migration
│   │   └── victory/            # exact verification and endgame
│   ├── render/
│   │   ├── WorldScene.tsx
│   │   ├── TerrainMesh.tsx
│   │   ├── TreeMeshes.tsx
│   │   ├── ToolMeshes.tsx
│   │   ├── LogMeshes.tsx
│   │   ├── VehicleMeshes.tsx
│   │   ├── BuildingMeshes.tsx
│   │   ├── FireMesh.tsx
│   │   ├── Lighting.tsx
│   │   └── Effects.tsx
│   ├── ui/
│   │   ├── HUD.tsx
│   │   ├── Inventory.tsx
│   │   ├── Shop.tsx
│   │   ├── UpgradeTree.tsx
│   │   ├── BuildMode.tsx
│   │   ├── LogisticsPanel.tsx
│   │   ├── MapPanel.tsx
│   │   └── Settings.tsx
│   ├── data/
│   │   ├── upgrades.ts
│   │   ├── recipes.ts
│   │   ├── machines.ts
│   │   ├── vehicles.ts
│   │   ├── contracts.ts
│   │   └── balance.ts
│   └── tests/
│       ├── cutting.test.ts
│       ├── economy.test.ts
│       ├── processing.test.ts
│       ├── world-conversion.test.ts
│       └── save-load.test.ts
├── e2e/
│   ├── first-tree.spec.ts
│   ├── log-sale.spec.ts
│   ├── sawmill.spec.ts
│   └── campaign-victory.spec.ts
└── scripts/
    └── verify-assets.ts
```

Names may change to fit the actual implementation; maintain separation of rendering, physics, economics, and persistent world simulation.

## Save-state design

```ts
type GameSave = {
  schemaVersion: number;
  saveId: string;
  worldSeed: string;
  simulationTick: number;
  wallet: number;
  lifetimeRevenue: number;
  player: { position: [number, number, number]; inventory: unknown[] };
  toolProgress: Record<string, unknown>;
  purchasedUpgrades: string[];
  changedTrees: Record<string, unknown>;    // only changed/removed tree IDs
  looseItems: unknown[];                    // durable items, bounded/paged
  biomeCells: Uint8Array | number[];        // compressed per-cell state/indexes
  structures: unknown[];
  machineStates: Record<string, unknown>;
  vehicles: unknown[];
  logistics: unknown[];
  contracts: unknown[];
  quests: Record<string, unknown>;
  victory: { completed: boolean; completedAt?: string };
  savedAt: string;
};
```

Provide robust schema migrations, version bumping, save file validation, error recovery, and clear failure UI. The save must preserve fallen logs, acquired tools, income, current machine work, created road segments, converted biome cells, and progress toward victory. Keep a manual save/export option; autosave at a measured cadence and before destructive transitions.

## Performance targets

- **Desktop target:** 60 FPS at 1080p on a modern mainstream GPU with reasonable settings; degrade gracefully to 30 FPS on less powerful devices.
- **First playable boot:** Load initial nearby chunks and basic meshes before distant areas.
- **Drawing strategy:** Avoid thousands of independent unbatched tree draw calls; instance or batch static distant tree geometry and transition to individually interactive meshes nearby.
- **Physics strategy:** Full rigidbodies only for nearby objects and active machinery; freeze/sleep stable logs, use aggregate stockpile representations where appropriate.
- **World streaming:** Scene graph covers an active radius, not all 16 km² simultaneously.
- **Environmental simulation:** Use coarse batched ticks and region dirty-flags, not one React component for every biome cell.
- **Quality presets:** Low / Medium / High / Ultra with draw distance, shadow cascades, foliage density, particles, physics debris, and screen-space effects.
- **Visual integrity:** Lower presets can reduce polygon counts but still cannot turn trees, logs or buildings into 2D PNG cards.

---

# 19. UPGRADES: FULL LARGE-SCALE CATALOG

This catalog is a **launch target with 288 distinct upgrade nodes** across 24 branches, not a vague promise to “add more upgrades.” Entries provide **intended functional effects**. Every purchased node must change game state, visuals, or capabilities as stated. Values/costs are balance starting points and can be adjusted to keep the game fun. Exact unlock prerequisites should be encoded in data rather than handwritten UI conditions. In each branch, upgrades ordinarily unlock in order; cross-branch nodes may add requirements noted in the feature specification.



## 01 · Plastic Butter Knife Research

**Entry stage:** Phase 0 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `01-01` | **Rubberized Handle** | $15 | Reduce butter-knife stamina cost by 15%. |
| `01-02` | **Butter Knife Serration** | $32 | Increase damage against saplings by 35%. |
| `01-03` | **Reinforced Plastic** | $66 | Raise plastic blade durability capacity by 50%. |
| `01-04` | **Double-Sided Scraper** | $135 | Unlock alternating left/right swings that build cut progress 20% faster. |
| `01-05` | **High-Pressure Grip** | $285 | Increase butter-knife damage on medium trunks by 25%. |
| `01-06` | **Shatterproof Resin** | $600 | Prevent knife damage from heavy-trunk impacts. |
| `01-07` | **Flexible Core** | $1,275 | Shorten wind-up and recovery animation by 20%. |
| `01-08` | **Aerodynamic Spreader** | $2,775 | Increase knife swing rate by 25% without extra stamina. |
| `01-09` | **Oscillating Butter Edge** | $6,000 | Add a powered vibration upgrade consuming a rechargeable battery. |
| `01-10` | **Titanium-Plated Plastic** | $12,750 | Unlock damage to dense hardwood while retaining the absurd original knife design. |
| `01-11` | **Industrial Dinnerware** | $26,250 | Butter knife hits cut a 15% wider notch; improved stagger against big trees. |
| `01-12` | **Legendary Last Knife** | $54,000 | Award a prestige knife skin and +100% hand-tool damage; retain normal physical cutting. |


## 02 · Player Strength, Movement & Dexterity

**Entry stage:** Phase 0 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `02-01` | **Work Gloves** | $15 | Increase base gripping force for dragging by 15%. |
| `02-02` | **Longer Stride** | $32 | Increase walking speed by 8%. |
| `02-03` | **Better Boots** | $66 | Reduce muddy-ground movement penalty by 30%. |
| `02-04` | **Cardio Routine** | $135 | Increase maximum stamina by 20%. |
| `02-05` | **Grip Training** | $285 | Increase controllable dragged log mass by 25%. |
| `02-06` | **Shoulder Harness** | $600 | Raise manual carry capacity by 15 kg. |
| `02-07` | **Quick Recovery** | $1,275 | Improve stamina regeneration by 35%. |
| `02-08` | **Lift Technique** | $2,775 | Let player lift small logs from a grounded crouch. |
| `02-09` | **Stump Stepper** | $6,000 | Improve sprint speed over logging debris by 20%. |
| `02-10` | **Manual Labor Expert** | $12,750 | Reduce all nonpowered tool stamina cost by 25%. |
| `02-11` | **Herculean Shift** | $26,250 | Add a second hand-carry slot for small segments. |
| `02-12` | **Industrial Athlete** | $54,000 | Improve running, hauling, and recovery by 20% while carrying tools. |


## 03 · Ropes, Carts & Primitive Logistics

**Entry stage:** Phase 0 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `03-01` | **Twine Bundle** | $15 | Unlock tethering one small log to the player. |
| `03-02` | **Long Rope** | $32 | Extend tether length from starter range by 50%. |
| `03-03` | **Knotted Hitch** | $66 | Reduce chance of a heavy log slipping off the tether. |
| `03-04` | **Wooden Lever** | $135 | Improve log rolling force by 30%. |
| `03-05` | **Crude Sled** | $285 | Unlock manually pulling two small logs on one sled. |
| `03-06` | **Waxed Runners** | $600 | Reduce sled friction by 25%. |
| `03-07` | **Hand Cart** | $1,275 | Unlock a two-wheeled cart with a physical cargo bed. |
| `03-08` | **Padded Cart Rails** | $2,775 | Secure unstable loads and reduce cargo loss. |
| `03-09` | **Rope Winch** | $6,000 | Unlock a placeable manual stationary log winch. |
| `03-10` | **Twin Winches** | $12,750 | Allow one log to be routed around obstacles with two anchors. |
| `03-11` | **Quick-Coupler Kit** | $26,250 | Cut attaching/detaching time for ropes and trailers by 60%. |
| `03-12` | **Starter Yardmaster** | $54,000 | Unlock an automatic loading assistant at one small log yard. |


## 04 · Ash Exchange & Burning

**Entry stage:** Phase 0 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `04-01` | **Bigger Fire Ring** | $15 | Increase the maximum log size accepted by the pit. |
| `04-02` | **Hotter Ember Bed** | $32 | Increase burn throughput by 25%. |
| `04-03` | **Weighing Scale** | $66 | Add exact sale preview before dropping logs into the burn zone. |
| `04-04` | **Ash Collector** | $135 | Extract saleable ash from each burn batch. |
| `04-05` | **Firebox Grate** | $285 | Permit burning two small logs simultaneously. |
| `04-06` | **Wood Moisture Tester** | $600 | Increase payout for correctly sorted dry wood. |
| `04-07` | **Chimney Draft** | $1,275 | Improve burn speed by 35% for processed firewood. |
| `04-08` | **Industrial Stoker** | $2,775 | Automatically feed nearby stocked wood to the pit. |
| `04-09` | **Charcoal Tray** | $6,000 | Convert a selectable portion of logs into higher-value charcoal rather than direct sale. |
| `04-10` | **Multi-Burner Furnace** | $12,750 | Build a second industrial incineration line with separate capacity. |
| `04-11` | **Heat Recovery Loop** | $26,250 | Send industrial fire heat to a nearby kiln or power system. |
| `04-12` | **Ash Futures Desk** | $54,000 | Unlock bulk fire-fuel contracts and volume bonuses. |


## 05 · Saws, Axes & Hand Tool Forestry

**Entry stage:** Phase 1 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `05-01` | **Pocket Saw** | $75 | Unlock faster real-time sawing on small trunks. |
| `05-02` | **Steel Hatchet** | $158 | Unlock a faster chopping alternative with a heavy hit cooldown. |
| `05-03` | **Sharpening Stone** | $330 | Reduce blade wear across manual saws and axes by 20%. |
| `05-04` | **Two-Handed Axe** | $675 | Deal more cutting damage to medium and hard trees. |
| `05-05` | **Crosscut Frame** | $1,425 | Let player cut landed trunks at selected segment markers. |
| `05-06` | **Electric Chainsaw** | $3,000 | Unlock powered continuous cutting; consumes charge. |
| `05-07` | **Swappable Saw Chain** | $6,375 | Improve chain efficiency and reduce jam frequency. |
| `05-08` | **Fuel Chainsaw** | $13,875 | Unlock continuous heavy cutting with fuel tank and sound. |
| `05-09` | **Hardened Teeth** | $30,000 | Improve heavy-tree cutting rate by 35%. |
| `05-10` | **Felling Wedges** | $63,750 | Allow controlled tree-fall direction within safe angular limits. |
| `05-11` | **Industrial Felling Saw** | $131,250 | Unlock big-trunk saw rig requiring power/fuel. |
| `05-12` | **Forestry Mastery** | $270,000 | Reduce tool switching delay and improve cutting aim stability. |


## 06 · Light Vehicles & Trailers

**Entry stage:** Phase 2 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `06-01` | **Cargo Tricycle** | $250 | Unlock a pedal-powered mini trailer for logs. |
| `06-02` | **Compact Utility Cart** | $525 | Unlock a slow battery-powered cargo cart. |
| `06-03` | **Hitch Coupler** | $1,100 | Tow small trailers behind compatible vehicles. |
| `06-04` | **All-Terrain Tires** | $2,250 | Improve traction on roots, mud, and broken soil. |
| `06-05` | **Small ATV** | $4,750 | Unlock agile off-road towing. |
| `06-06` | **Timber Trailer** | $10,000 | Haul multiple long logs in a secured trailer. |
| `06-07` | **Basic Pickup** | $21,250 | Unlock truck transport for mid-sized log loads. |
| `06-08` | **Stake-Side Bed** | $46,250 | Increase pickup cargo capacity and retention. |
| `06-09` | **Off-Road Suspension** | $100,000 | Improve loaded vehicle control on rough paths. |
| `06-10` | **Winch Bumper** | $212,500 | Attach a powered winch to pull stuck logs or trailers. |
| `06-11` | **Hydraulic Lift Bed** | $437,500 | Enable controlled dumping into suitable receiver zones. |
| `06-12` | **Fleet Fuel Efficiency** | $900,000 | Reduce operating fuel usage of all light vehicles by 15%. |


## 07 · Heavy Logging Vehicles

**Entry stage:** Phase 4 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `07-01` | **Skid Steer** | $25,000 | Unlock tracked small loader with log grapple. |
| `07-02` | **Hydraulic Grapple** | $52,500 | Lift and rotate logs with powered jaws. |
| `07-03` | **Forestry Tractor** | $110,000 | Unlock heavy tow force and detachable logging tools. |
| `07-04` | **Front Loader** | $225,000 | Move several small logs or one larger tree in a bucket. |
| `07-05` | **Forwarder** | $475,000 | Unlock dedicated off-road log hauling and onboard crane. |
| `07-06` | **Log Loader Crane** | $1,000,000 | Transfer large logs from ground to truck beds. |
| `07-07` | **Logging Truck** | $2,125,000 | Unlock long-distance bulk timber road hauling. |
| `07-08` | **Articulated Steering** | $4,625,000 | Improve heavy vehicle cornering in narrow clearings. |
| `07-09` | **Tree Harvester** | $10,000,000 | Unlock mechanized cutting, debranching, and segmenting. |
| `07-10` | **Harvester Head Upgrade** | $21,250,000 | Process thicker trunks and more biomass per minute. |
| `07-11` | **Fleet Service Bay** | $43,750,000 | Reduce logging vehicle maintenance downtime by 30%. |
| `07-12` | **Giant Forestry Rig** | $90,000,000 | Unlock an endgame extra-wide harvester with massive fuel/power cost. |


## 08 · Destruction, Clearing & Earthmoving

**Entry stage:** Phase 4 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `08-01` | **Portable Brush Cutter** | $800 | Remove low foliage in a narrow arc. |
| `08-02` | **Stump Grinder** | $1,680 | Convert persistent stumps into collected mulch and clear root occupancy. |
| `08-03` | **Forestry Mulcher** | $3,520 | Shred branches and saplings while clearing an area. |
| `08-04` | **Bulldozer** | $7,200 | Push physical debris and compact soil along its track. |
| `08-05` | **Earth Scoop** | $15,200 | Remove topsoil by the cubic meter into a dump truck. |
| `08-06` | **Heavy Excavator** | $32,000 | Uproot huge stumps and alter terrain height within limits. |
| `08-07` | **Tree Shear** | $68,000 | Instantly sever small trees after a hydraulic jaw-close animation. |
| `08-08` | **Root Ripper** | $148,000 | Reduce root regrowth protection in worked strips. |
| `08-09` | **Land Clearing Crew** | $320,000 | Assign NPC work orders to remove tagged debris and shrubs. |
| `08-10` | **Controlled Burn Permit** | $680,000 | Unlock an abstracted, contained burn-zone machine with suppression boundaries. |
| `08-11` | **Heavy Demolition Platform** | $1,400,000 | Destroy eligible abandoned structures and convert wreckage to salvage. |
| `08-12` | **Landscape Recycler** | $2,880,000 | Automatically collect wood/chips/soil byproducts from large clearing operations. |


## 09 · Sawmills & Cutting Engineering

**Entry stage:** Phase 2 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `09-01` | **Hand Sawbench** | $180 | Process one small log into rough planks manually. |
| `09-02` | **Log Clamp** | $378 | Reduce alignment delay and miscuts at sawbench. |
| `09-03` | **Blade Guide** | $792 | Improve board yield per log by 10%. |
| `09-04` | **Compact Bandsaw Mill** | $1,620 | Unlock powered log-to-board processing. |
| `09-05` | **Offcut Chute** | $3,420 | Automatically collect sawdust and offcuts as inputs. |
| `09-06` | **Powered Log Feeder** | $7,200 | Reduce manual loading work at mills. |
| `09-07` | **Precision Thickness Gauge** | $15,300 | Raise average board grade for correctly sorted timber. |
| `09-08` | **Dual-Blade Mill** | $33,300 | Allow simultaneous board cutting from one log. |
| `09-09` | **Automated Debarker** | $72,000 | Strip bark automatically before sawing. |
| `09-10` | **High-Speed Sawmill** | $153,000 | Unlock large logs and higher continuous throughput. |
| `09-11` | **Yield Optimizer** | $315,000 | Select best cutting pattern for revenue or volume. |
| `09-12` | **Industrial Mill Complex** | $648,000 | Unlock modular multi-line sawmill with dedicated inputs and outputs. |


## 10 · Drying, Wood Quality & Finishing

**Entry stage:** Phase 3 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `10-01` | **Covered Drying Rack** | $400 | Dry small stacks without rain penalties. |
| `10-02` | **Moisture Meter** | $840 | Display log and board moisture quality accurately. |
| `10-03` | **Drying Fan** | $1,760 | Increase rack drying speed using electricity. |
| `10-04` | **Covered Timber Yard** | $3,600 | Reduce weather degradation for stored planks. |
| `10-05` | **Small Kiln** | $7,600 | Unlock energy-using batch drying for sale-grade lumber. |
| `10-06` | **Uniform Airflow Ducts** | $16,000 | Reduce defects during kiln drying. |
| `10-07` | **Wood Planer** | $34,000 | Turn rough boards into finished dimensional lumber. |
| `10-08` | **Surface Sander** | $74,000 | Improve finish grade and furniture output quality. |
| `10-09` | **Pressure Treatment Vat** | $160,000 | Produce treated outdoor wood from graded boards. |
| `10-10` | **Quality Sorting Camera** | $340,000 | Automatically segregate boards by quality tier. |
| `10-11` | **Smart Kiln Controller** | $700,000 | Optimize heat/time to reduce waste and energy cost. |
| `10-12` | **Premium Lumber Certification** | $1,440,000 | Unlock high-tier buyers and branded finish options. |


## 11 · Woodworking, Furniture & Engineered Goods

**Entry stage:** Phase 3 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `11-01` | **Carpenter Workbench** | $650 | Craft first crates and small wooden items. |
| `11-02` | **Nail Gun Station** | $1,365 | Decrease crate and pallet assembly time. |
| `11-03` | **Pallet Assembly Jig** | $2,860 | Unlock repeatable standard pallet recipes. |
| `11-04` | **Wood Glue Press** | $5,850 | Unlock laminated components and reinforced furniture. |
| `11-05` | **Cutting Templates** | $12,350 | Lower offcut loss when producing furniture parts. |
| `11-06` | **Craftsman's Lathe** | $26,000 | Unlock turned legs, handles, and decorative goods. |
| `11-07` | **Cabinet Shop** | $55,250 | Produce cabinets, desks, shelves, and tables. |
| `11-08` | **Finishing Booth** | $120,250 | Apply finishes to unlock higher-quality sale bands. |
| `11-09` | **Plywood Press** | $260,000 | Make engineered sheets from prepared wood input. |
| `11-10` | **Flooring Line** | $552,500 | Manufacture premium panel and floor products. |
| `11-11` | **Modular Furniture Factory** | $1,137,500 | Automate furniture assembly with parts and labor requirements. |
| `11-12` | **Custom Order Studio** | $2,340,000 | Unlock configurable high-value commissions with quality constraints. |


## 12 · Pulp, Paper & Packaging

**Entry stage:** Phase 4 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `12-01` | **Wood Chipper** | $1,200 | Convert offcuts and branches into chips. |
| `12-02` | **Chip Screen** | $2,520 | Sort chips by size for higher pulp yield. |
| `12-03` | **Pulp Vat** | $5,280 | Make basic pulp from chipped wood and water. |
| `12-04` | **Pulp Press** | $10,800 | Form first saleable sheets and reels. |
| `12-05` | **Paper Dryer** | $22,800 | Improve paper throughput and finished quality. |
| `12-06` | **Cardboard Former** | $48,000 | Produce corrugated cardboard from pulp outputs. |
| `12-07` | **Box Die Cutter** | $102,000 | Unlock standardized shipping box recipes. |
| `12-08` | **Packaging Line** | $222,000 | Pack manufactured goods automatically into cartons. |
| `12-09` | **Wastepaper Recovery** | $480,000 | Reprocess scrap paper without free-material duplication. |
| `12-10` | **Roll Finisher** | $1,020,000 | Make premium paper roll grades for wholesale contracts. |
| `12-11` | **Bulk Pulp Plant** | $2,100,000 | Upgrade to continuous high-volume pulp processing. |
| `12-12` | **Export Packaging Campus** | $4,320,000 | Fulfill massive industrial packaging contracts. |


## 13 · Charcoal, Pellets & Energy from Wood

**Entry stage:** Phase 3 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `13-01` | **Charcoal Drum** | $750 | Convert selected wood to charcoal instead of immediate fire sale. |
| `13-02` | **Bark Fuel Sorter** | $1,575 | Separate bark and offcuts into fuel bins. |
| `13-03` | **Drying Trommel** | $3,300 | Lower moisture penalties in biomass processing. |
| `13-04` | **Briquette Press** | $6,750 | Convert chips/sawdust into burnable briquettes. |
| `13-05` | **Pellet Mill** | $14,250 | Produce high-density biomass pellets with a powered machine. |
| `13-06` | **Combustion Efficiency** | $30,000 | Reduce biomass required for each output energy unit. |
| `13-07` | **Heat Exchanger** | $63,750 | Pipe excess heat to kilns or local environmental machines. |
| `13-08` | **Biofuel Contract Board** | $138,750 | Unlock repeatable industrial fuel orders. |
| `13-09` | **Bulk Fuel Silos** | $300,000 | Store and meter large fuel quantities safely. |
| `13-10` | **Combined Heat & Power** | $637,500 | Unlock electricity generation and usable exhaust heat. |
| `13-11` | **Ash Refinement** | $1,312,500 | Convert ash into low-grade industrial feedstock. |
| `13-12` | **Waste-to-Power Complex** | $2,700,000 | Run a high-throughput fuel/power chain with pollution and maintenance costs. |


## 14 · Buyers, Contracts & Business Operations

**Entry stage:** Phase 1 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `14-01` | **Handwritten Receipts** | $50 | Track gross sales and costs from the fire pit. |
| `14-02` | **Price Bulletin** | $105 | Display current raw-log buyer rates by grade. |
| `14-03` | **Local Timber Buyer** | $220 | Unlock a guaranteed nonfire raw-wood sale destination. |
| `14-04` | **Contract Clipboard** | $450 | Unlock short delivery contracts with deadlines. |
| `14-05` | **Bulk Order Discount** | $950 | Reduce freight fees on large deliveries. |
| `14-06` | **Specialty Buyer Network** | $2,000 | Add buyers for premium hardwood and rare designs. |
| `14-07` | **Delivery Brokerage** | $4,250 | Unlock per-mile shipping quotes and contract comparisons. |
| `14-08` | **Quality Certification Office** | $9,250 | Increase payouts for verified high-grade lumber. |
| `14-09` | **Long-Term Supply Deals** | $20,000 | Lock stable prices in exchange for minimum deliveries. |
| `14-10` | **Market Analysis Desk** | $42,500 | Forecast demand changes with uncertainty bands. |
| `14-11` | **Export Sales Office** | $87,500 | Unlock region-scale bulk export contracts. |
| `14-12` | **Industrial Trade Exchange** | $180,000 | Combine multi-product order optimization and priority dispatch. |


## 15 · Storage, Belts & Factory Logistics

**Entry stage:** Phase 3 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `15-01` | **Stacking Rack** | $450 | Store loose logs in a stable, counted pile. |
| `15-02` | **Pallet Jack** | $945 | Move loaded pallets through factory floors. |
| `15-03` | **Powered Roller** | $1,980 | Automatically push short logs along a machine feeder. |
| `15-04` | **Belt Conveyor** | $4,050 | Move compatible items between adjacent machines. |
| `15-05` | **Output Buffer** | $8,550 | Add queue capacity to one machine output. |
| `15-06` | **Sorting Gate** | $18,000 | Route product classes to named conveyor outputs. |
| `15-07` | **Loading Hopper** | $38,250 | Physically intake wood chips and small products in bulk. |
| `15-08` | **Forklift** | $83,250 | Move palletized goods and small log bundles. |
| `15-09` | **Central Warehouse** | $180,000 | Store multi-category products with inventory accounting. |
| `15-10` | **Automated Picking Arm** | $382,500 | Transfer items between storage slots and conveyors. |
| `15-11` | **Robotic Sorting Line** | $787,500 | Direct products based on material, grade, and destination. |
| `15-12` | **Industrial Logistics Hub** | $1,620,000 | Expose connected multi-factory throughput and automatic transfer rules. |


## 16 · Freight, Roads, Trains & Delivery

**Entry stage:** Phase 4 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `16-01` | **Gravel Service Road** | $1,000 | Lay driveable road segments that improve haul speed. |
| `16-02` | **Roadside Loading Pad** | $2,100 | Provide a safe staging point with cargo capacity. |
| `16-03` | **Delivery Van** | $4,400 | Carry processed wood products to buyers. |
| `16-04` | **Regional Freight Truck** | $9,000 | Haul bulk goods with fuel, loading, and travel costs. |
| `16-05` | **Truck Dispatch Radio** | $19,000 | Assign delivery runs from a logistics screen. |
| `16-06` | **Heavy Flatbed** | $40,000 | Transport oversized logs and heavy machines. |
| `16-07` | **Road Paver** | $85,000 | Construct durable roads faster using actual construction materials. |
| `16-08` | **Rail Depot** | $185,000 | Build freight loading interface and track graph access. |
| `16-09` | **Logging Train** | $400,000 | Move large trainloads of logs between stations. |
| `16-10` | **Intermodal Container Loader** | $850,000 | Transfer boxed goods between train and trucks. |
| `16-11` | **Autonomous Hauler Garage** | $1,750,000 | Dispatch owned driverless haul trucks on approved routes. |
| `16-12` | **Regional Shipping Grid** | $3,600,000 | Optimize routing costs and delivery assignments across owned zones. |


## 17 · Workers, AI Tasks & Automation

**Entry stage:** Phase 3 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `17-01` | **Hire a Helper** | $350 | Unlock one paid NPC who drags small logs to a marked location. |
| `17-02` | **Work Order Board** | $735 | Assign repeatable chop, haul, or cleanup jobs. |
| `17-03` | **Worker Toolkit** | $1,540 | Reduce time lost by helpers retrieving basic tools. |
| `17-04` | **Shift Scheduling** | $3,150 | Control wages, breaks, and machine staffing. |
| `17-05` | **Route Markers** | $6,650 | Let workers follow roads/trails between designated work points. |
| `17-06` | **Machine Operator** | $14,000 | Assign an NPC to load, unload, or supervise one facility. |
| `17-07` | **Forestry Crew** | $29,750 | Group lumberjacks and haulers into a zone harvest team. |
| `17-08` | **Maintenance Dispatch** | $64,750 | Route mechanics to malfunctioning equipment automatically. |
| `17-09` | **Factory Foreman** | $140,000 | Prioritize available production recipes with buffer limits. |
| `17-10` | **Fleet Controller** | $297,500 | Assign vehicles and drivers to multi-stop hauling tasks. |
| `17-11` | **Regional Autopilot** | $612,500 | Automatically manage specified extraction-to-factory workflows. |
| `17-12` | **Industrial Operations AI** | $1,260,000 | Optimize contracts, machine utilization, and desert priorities under explicit player policy. |


## 18 · Power, Grid & Energy Management

**Entry stage:** Phase 4 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `18-01` | **Portable Generator** | $550 | Supply small off-grid machines with purchased fuel. |
| `18-02` | **Utility Poles** | $1,155 | Build a physically represented low-voltage cable network. |
| `18-03` | **Battery Bank** | $2,420 | Buffer intermittent energy for workshops and sawmills. |
| `18-04` | **Power Meter** | $4,950 | Report true demand and generation per connected machine. |
| `18-05` | **Biomass Generator** | $10,450 | Convert wood waste into electricity and heat. |
| `18-06` | **Transformer Station** | $22,000 | Expand power-grid reach and capacity. |
| `18-07` | **Solar Array** | $46,750 | Generate daytime electricity from an actual 3D panel field. |
| `18-08` | **Wind Turbine** | $101,750 | Add weather-dependent generation to owned plots. |
| `18-09` | **Thermal Powerhouse** | $220,000 | Unlock high-output heat-producing industrial generation. |
| `18-10` | **Smart Grid Dispatch** | $467,500 | Prioritize loads to prevent unexpected shutdowns. |
| `18-11` | **Industrial Grid Backbone** | $962,500 | Connect distant factory regions with efficient transmission. |
| `18-12` | **Gigawatt Utility Campus** | $1,980,000 | Supply power-hungry late-game facilities with major upkeep. |


## 19 · Water Extraction & Drainage

**Entry stage:** Phase 5 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `19-01` | **Hand Pump** | $1,200 | Extract water at a slow rate from an accessible source. |
| `19-02` | **Water Cart** | $2,520 | Deliver small volumes of water to a powered facility. |
| `19-03` | **Groundwater Scanner** | $5,280 | Reveal approximate aquifer state in nearby cells. |
| `19-04` | **Electric Bore Pump** | $10,800 | Extract larger fictional groundwater volumes with power costs. |
| `19-05` | **Pipeline Segments** | $22,800 | Route pumped water to registered consumer buildings. |
| `19-06` | **Water Tank Farm** | $48,000 | Buffer supply during peak usage and rain. |
| `19-07` | **Drainage Ditches** | $102,000 | Accelerate surface drying in nearby cleared terrain. |
| `19-08` | **Industrial Pump Station** | $222,000 | Coordinate multiple bore pumps and deep extraction contracts. |
| `19-09` | **Aquifer Mapping** | $480,000 | Reveal connected underground water influence zones. |
| `19-10` | **Irrigation Diversion Bureau** | $1,020,000 | Redirect stored water between industry and farmland. |
| `19-11` | **Regional Water Authority** | $2,100,000 | Manage weighted zone water allocation and depletion policies. |
| `19-12` | **Deep Drying Network** | $4,320,000 | Drive large area groundwater reduction with costly connected infrastructure. |


## 20 · Agriculture, Grazing & Land Degradation

**Entry stage:** Phase 5 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `20-01` | **Grassland Seeder** | $1,400 | Turn cleared lots into revenue-producing pasture/plains temporarily. |
| `20-02` | **Fenced Grazing Plot** | $2,940 | Unlock livestock grazing with forage and labor requirements. |
| `20-03` | **Heavy Plow** | $6,160 | Remove root remains and prepare the topsoil for farming. |
| `20-04` | **Fertilizer Depot** | $12,600 | Boost short-term crop yield at an explicit environmental cost. |
| `20-05` | **Crop Harvester** | $26,600 | Automate harvesting of profitable seasonal crops. |
| `20-06` | **Irrigation Network** | $56,000 | Feed large farm plots from a monitored water source. |
| `20-07` | **High-Density Grazing** | $119,000 | Consume ground vegetation faster in defined pastures. |
| `20-08` | **Industrial Crop Rotation Override** | $259,000 | Allow intensified production with greater fertility loss. |
| `20-09` | **Soil Compactor** | $560,000 | Drive machinery over targeted cells to lower regrowth rates. |
| `20-10` | **Mega-Farm Complex** | $1,190,000 | Operate hundreds of farm cells with regional logistics. |
| `20-11` | **Exhausted-Soil Extractor** | $2,450,000 | Remove depleted topsoil and collect industrial substrate. |
| `20-12` | **Dryland Conversion Office** | $5,040,000 | Coordinate grazing, water depletion, and soil stripping into a desert campaign plan. |


## 21 · Quarries, Mines, Cement & Urban Sprawl

**Entry stage:** Phase 6 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `21-01` | **Rockbreaker** | $5,000 | Harvest surface rocks into sellable aggregate. |
| `21-02` | **Quarry License** | $10,500 | Unlock a mine area and mineral processing jobs. |
| `21-03` | **Ore Sorting Screen** | $22,000 | Improve useful ore recovery from mixed rock. |
| `21-04` | **Excavation Truck** | $45,000 | Haul removed soil and ore without player inventory teleportation. |
| `21-05` | **Rock Crusher** | $95,000 | Produce graded crushed stone and sand. |
| `21-06` | **Strip Mine Excavator** | $200,000 | Remove terrain layers systematically in a bounded working zone. |
| `21-07` | **Cement Batch Plant** | $425,000 | Combine mined materials into construction products. |
| `21-08` | **Concrete Mixer Fleet** | $925,000 | Deliver construction materials to 3D foundations. |
| `21-09` | **Asphalt Paving Line** | $2,000,000 | Turn roads and yards into permanent industrial coverage. |
| `21-10` | **Bucket-Wheel Miner** | $4,250,000 | Process huge dig sites with high energy demand. |
| `21-11` | **Industrial City Blocks** | $8,750,000 | Unlock modular warehouses, parking, depots, and economic districts. |
| `21-12` | **Continental Extraction Company** | $18,000,000 | Coordinate quarrying and industrial construction at large zone scale. |


## 22 · Data Centers, Servers & Cooling

**Entry stage:** Phase 7 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `22-01` | **Garage Server Rack** | $20,000 | Unlock a tiny server setup with electricity demand and recurring compute income. |
| `22-02` | **Network Uplink** | $42,000 | Increase maximum contracted server utilization. |
| `22-03` | **Rack Management** | $88,000 | Reduce downtime and improve accessible rack capacity. |
| `22-04` | **Modular Server Hall** | $180,000 | Build a specialized facility with room for multiple real 3D racks. |
| `22-05` | **Air Cooling System** | $380,000 | Maintain operational efficiency with powered fans. |
| `22-06` | **Liquid Cooling Loop** | $800,000 | Trade water use for higher cooling capacity. |
| `22-07` | **Backup Generator Bank** | $1,700,000 | Maintain service through short power interruptions. |
| `22-08` | **Server Service Crew** | $3,700,000 | Reduce failures and repair downtime. |
| `22-09` | **Data Center Campus** | $8,000,000 | Add connected halls, substations and shared cooling. |
| `22-10` | **High-Density Compute Contract** | $17,000,000 | Unlock more profitable high-load compute jobs. |
| `22-11` | **Mega-Cooling Tower** | $35,000,000 | Support multiple server halls while consuming large water volumes. |
| `22-12` | **Hyperscale Desert Cloud** | $72,000,000 | Unlock gigantic multi-building campus with huge revenue, power draw, heat, and water needs. |


## 23 · Industrial Heat, Pollution & Biome Conversion

**Entry stage:** Phase 6 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `23-01` | **Soil Moisture Probe** | $10,000 | Inspect exact current moisture at a targeted biome cell. |
| `23-02` | **Land Degradation Map** | $21,000 | View vegetation, erosion and soil fertility overlays. |
| `23-03` | **Industrial Exhaust Duct** | $44,000 | Direct modeled local waste-heat influence from compatible buildings. |
| `23-04` | **Surface Compaction Roller** | $90,000 | Suppress regrowth in a physically traversed road or zone. |
| `23-05` | **Dust Generator** | $190,000 | Increase local aridity pressure after prerequisite clearing. |
| `23-06` | **Thermal Recovery Plant** | $400,000 | Gather waste heat for drying machines and nearby industry. |
| `23-07` | **Pollution Treatment Trade-Offs** | $850,000 | Choose profit/efficiency versus cleaner operation as simulation parameters. |
| `23-08` | **Regional Heat Exchanger** | $1,850,000 | Move heat capacity between industrial districts via utility network. |
| `23-09` | **Soil-Removal Megarig** | $4,000,000 | Convert terrain substrate at high operating cost in eligible zones. |
| `23-10` | **Artificial Heat Island** | $8,500,000 | Combine asphalt, buildings, and generation into a regional local-heat effect. |
| `23-11` | **Dust Storm Amplifier** | $17,500,000 | Unlock a fictional large-scale feedback mechanic for already exposed dry areas. |
| `23-12` | **Desertification Megaproject** | $36,000,000 | Coordinate multiple lawful in-game subsystems to gradually dry a large owned region. |


## 24 · Research, Surveying & Final-Cell Technology

**Entry stage:** Phase 7 · **Prerequisite:** previous upgrade in this branch unless a facility/tool unlock is required.

| ID | Upgrade | Prototype cost | Gameplay effect |
|---|---|---:|---|
| `24-01` | **Research Desk** | $50,000 | Earn science points from recorded production milestones. |
| `24-02` | **Land Surveyor Kit** | $105,000 | Unlock precise per-cell moisture, tree and root status. |
| `24-03` | **Experimental Prototypes** | $220,000 | Unlock advanced alternate tool attachments through research jobs. |
| `24-04` | **Climate Monitoring Tower** | $450,000 | Display historical climate state and conversion trends by region. |
| `24-05` | **Aerial Survey Drone** | $950,000 | Reveal hard-to-reach unconverted cells without teleporting the player. |
| `24-06` | **Last-Green-Cell Filter** | $2,000,000 | Highlight the categories of conditions blocking desert conversion. |
| `24-07` | **Dispatch-to-Coordinate** | $4,250,000 | Assign a qualified owned machine to a selected cell or waypoint. |
| `24-08` | **Automated Drainage Diagnostic** | $9,250,000 | Suggest fixes for wet cells based on live simulation, not fabricated estimates. |
| `24-09` | **Territory Completion Office** | $20,000,000 | Show exact remaining cells per owned region and stability timer. |
| `24-10` | **Mega-Dryer Blueprints** | $42,500,000 | Unlock a powered expensive fictional terra-dryer with limited operating radius. |
| `24-11` | **Last Pixel Protocol** | $87,500,000 | Queue targeted cleanup jobs for all currently visible failing cells. |
| `24-12` | **100 Percent Certificate** | $180,000,000 | Unlock only at genuine map-wide stable 100% desert; records victory and permanent trophy. |

**Catalog count: 288 individually named, functional upgrades.** Implementation must reflect these as typed data with unique IDs, costs, unlock logic, and actual effects, not just text labels.

---

# 20. DATA-DRIVEN GAME SYSTEMS AND CONTENT CONTRACTS

Treat the listed content as maintainable game data, not 288 unrelated if/else statements. For example:

```ts
type UpgradeEffect =
  | { kind: 'statMultiplier'; stat: string; factor: number }
  | { kind: 'statAdd'; stat: string; amount: number }
  | { kind: 'unlockTool'; toolId: string }
  | { kind: 'unlockRecipe'; recipeId: string }
  | { kind: 'unlockBuilding'; buildingId: string }
  | { kind: 'unlockVehicle'; vehicleId: string }
  | { kind: 'unlockWorkerJob'; jobId: string }
  | { kind: 'unlockSimulationFeature'; featureId: string }
  | { kind: 'setConfig'; key: string; value: number | boolean };

type Upgrade = {
  id: string;
  name: string;
  branch: string;
  stage: number;
  moneyCost: number;
  scienceCost?: number;
  prerequisiteUpgradeIds: string[];
  requiredMilestones?: string[];
  description: string;
  effects: UpgradeEffect[];
};

type Recipe = {
  id: string;
  workstation: string;
  inputs: Array<{ itemId: string; amount: number }>;
  outputs: Array<{ itemId: string; amount: number; quality?: string }>;
  byproducts?: Array<{ itemId: string; amount: number }>;
  productionSeconds: number;
  electricityKWh?: number;
  waterLiters?: number;
  exhaustHeat?: number;
  requiredUpgrades?: string[];
};

type WorldItem = {
  instanceId: string;
  itemTypeId: string;
  amount: number;
  massKg: number;
  dimensionsM: [number, number, number];
  worldPosition?: [number, number, number];
  sourceTreeId?: string;
  currentOwner: 'world' | 'player' | 'vehicle' | 'building';
  reservedByJobId?: string;
};
```

**Do not use unrestricted arbitrary strings in final production code where a real enum/registry can eliminate misspellings.** The examples demonstrate schema intent, not a command to write a brittle prototype. Validate all content registry references when booting and fail loudly in development if an unlock points to a nonexistent machine or stat.

## 20.1 Example early recipe balancing

| Recipe | Actual consumed input | Output | Time (initial) | Energy |
|---|---|---|---:|---:|
| Hand-saw sapling | 1 small log | 3 rough boards + 1 small offcut | 24 sec | Manual stamina |
| Sort small firewood | 1 small log | 4 firewood pieces | 10 sec | Manual stamina |
| Debark | 1 medium log | 1 clean log + 2 bark | 15 sec | Small machine power |
| Sawmill softwood | 1 clean medium log | 6 rough boards + 2 sawdust | 20 sec | 0.5 kWh |
| Air-dry rough boards | 6 rough boards | 6 dry boards (quality variable) | 120 sec | None |
| Kiln-dry rough boards | 6 rough boards | 6 kiln-dried boards | 35 sec | 2 kWh |
| Pallet assembly | 5 dry boards + 2 fastener units | 1 pallet | 18 sec | Workshop power |
| Simple wooden crate | 4 dry boards + 1 fastener unit | 1 crate | 15 sec | Workshop power |
| Small table | 12 finished boards + 3 hardware units | 1 finished table | 50 sec | Workshop power |
| Small cardboard bundle | 8 pulp units | 4 cardboard sheets | 35 sec | 3 kWh + water |
| Pellet batch | 4 sawdust units | 2 pellet units | 16 sec | 1 kWh |
| Charcoal batch | 1 dry log | 3 charcoal units + heat | 60 sec | Fuel/startup energy |

These counts are arbitrary **game-unit recipes**, not real industrial yields. Always conserve in-game item quantities according to the authored recipe; match item visuals to the actual product type. The first hand saw can be used on a log lying on an actual 3D sawbench: the animation and physical target matter, not just pressing `Craft` in an inventory modal.

## 20.2 Item quality

Graded resources should have `species`, `moisture`, `grade`, `defectRate`, `mass`, `size`, `processingHistory`, and unique lot or item IDs. Better equipment raises yield or improves grading; poorer cuts increase waste. High-value contracts can require species, grade, minimum quantity, and a delivery deadline. The sale UI must make it obvious why one log is worth more than another.

## 20.3 Machine states

Every machine has at least these states: **unbuilt → constructing → idle → loading → processing → outputting → blocked/full → damaged/maintenance → idle**. Machines report reason codes such as `NO_POWER`, `NO_WATER`, `NO_INPUT`, `OUTPUT_FULL`, `NEEDS_OPERATOR`, or `BROKEN`. Render real machine motion while operating and reduce motion during idle periods.

## 20.4 Financial ledger

Keep a verifiable in-game ledger of payments and costs:

```text
2026-game-day-01  + $15.00  Ash Exchange: 1 young jungle log
2026-game-day-01  - $15.00  Upgrade: Butter Knife Serration
2026-game-day-02  + $45.00  Lumber Buyer: 3 rough boards
2026-game-day-02  - $22.00  Purchased rope + hand-saw parts
```

The **game's dates are fictional simulation timestamps**, not real invoices. Display per-route profit, cumulative expenses, gross revenue, idle cost, and current income/minute. Make income/minute a rolling measured statistic, not estimated from the number of buildings.

---

# 21. BIOME CONVERSION ENGINE — FORMULAS AND RULES

## 21.1 A reproducible simulation

Use fixed step environmental ticks (e.g., one sim tick every 0.5–2 seconds) and weighted influences from active facilities. Do not simulate highly detailed real climate science; make a comprehensible, deterministic game system with observable outcomes. A reference structure:

```ts
function simulateCell(cell: BiomeCell, env: EnvironmentalInputs, dt: number) {
  const sunlight = env.sunIntensity;
  const rain = env.rainfall;
  const extraction = env.waterPumpDemand;
  const industrialHeat = env.localIndustrialHeat;
  const clearing = env.vegetationRemoval;
  const soilLoss = env.erosionAndMining;
  const grazing = env.overgrazingPressure;
  const restoration = env.regrowthPressure;

  const evaporation = (sunlight * 0.015 + industrialHeat * 0.006) * dt;
  cell.soilMoisture = clamp01(
    cell.soilMoisture + rain * dt - evaporation - env.drainageRate * dt,
  );
  cell.groundwater = clamp01(
    cell.groundwater + env.rechargeRate * dt - extraction * dt,
  );
  cell.naturalVegetation = clamp01(
    cell.naturalVegetation - clearing * dt - grazing * dt + restoration * dt,
  );
  cell.soilFertility = clamp01(
    cell.soilFertility - soilLoss * dt - env.farmingDepletion * dt,
  );
  cell.erosion = clamp01(cell.erosion + soilLoss * dt);
  cell.localHeat = Math.max(0, industrialHeat);

  // All thresholds and stability timers are loaded from balance data.
  cell.desertified = isStableDesertCell(cell, env);
  cell.stage = deriveVisibleBiomeStage(cell);
}
```

This example omits boundary handling, diffusion and timestep integration for clarity. The real code should use a stable update order, sensible clamping, fixed-time accumulation, measured area-of-influence values, and preferably property-based tests.

## 21.2 Biome stage transitions

- `jungle`: Tall trees, dense canopy, high moisture, fertile soil, rich ambient wildlife soundscape.
- `cleared`: No standing canopy, scattered logs/stumps, soil still moist and green.
- `plains`: Grasses and shrubs can grow, open sunny land, optional agricultural potential.
- `degraded`: Patchy grass, bare soil, declining water/fertility.
- `dry_scrub`: Scrubby bushes, dust, cracked soil, low regrowth.
- `barren`: Minimal plants, exposed substrate, poor fertility and low moisture, still may have stubborn water pocket.
- `desert`: No meaningful natural vegetation, sufficiently dry/stable biome, sand/rock/crack material treatment, dust/heat visuals.

Transitions must be driven by simulation state, with **hysteresis** so cells do not flicker from dry scrub to desert and back every frame around threshold values. Regrowth may reverse earlier stages when conditions genuinely improve, but a stable fully desertified campaign cannot secretly reverse immediately after victory.

## 21.3 No free percent upgrades

The percentage is a result of actually converted cells. Upgrades may increase rates, radii, device capability, efficiency, or automation but **never directly set percentage to a higher value**. The most advanced facility still operates within a simulated region over time. The player can inspect coverage on the map.

## 21.4 Boundaries, water bodies, and buildings

- Classify every cell as land, shoreline, bedrock, structure-covered, or water-affected for rendering and interaction.
- The win denominator is predetermined at world creation: every in-bounds **eligible** cell, including land beneath industry and roads, counts; no cell silently disappears from denominator after construction.
- For water or river cells, either declare them convertibly drainable in the simulation or explicitly document predetermined non-land exclusions at generation. Prefer a campaign map where all playable cells can ultimately be converted so the goal literally feels like **the entire map is desert**.
- Never generate permanently indestructible decorative jungle trees on eligible cells; all vegetation must ultimately have a valid removal path.
- World edges should have obvious bounds (ocean/cliffs/valley wall) and should not expose an inaccessible moist cell that prevents victory.

---

# 22. REAL 3D ASSET PIPELINE

## 22.1 No PNG-to-object shortcuts

**Hard restriction:** Do **not** create any of the following as a substitute for actual three-dimensional objects:

- PNG tree billboards or rotating tree sprites.
- Flat character cutouts walking in 3D space.
- A wallpaper screenshot of a factory instead of a modeled factory.
- An image of a truck on a rectangular plane.
- A 2D card that claims to be a sawmill.
- A single flat picture of grass standing in for the whole terrain.
- Smoke as one static PNG hovering above a building.
- Pre-rendered GIFs presented as moving machine parts.

**Allowed:** Normal maps, roughness/metalness textures, base-color textures applied to real meshes, UI icons, map thumbnails, and screenshots for save slots. When an item is placed into the world, it must have true depth, spatial transform, mesh and appropriate collider.

## 22.2 Procedural starter-model requirements

A coding AI can generate the entire starter game without downloading external artwork:

| Model | Minimum actual geometry |
|---|---|
| Butter knife | Extruded blunt blade + handle geometry, 3D wrist/hand representation or believable tool rig |
| Tree | Tapered trunk cylinders, 3D branching, volumetric foliage clusters, root/stump mesh |
| Felled tree | Jointed/converted rigidbody log, visible cut disk, length/radius variation |
| Fire pit | Stone or brick ring meshes, log grate, 3D flames, embers, ash mound |
| Manual sawbench | Legs, frame, clamps, saw blade mesh, real slot for incoming log |
| Sled/cart | Frame, wheels/runners, ropes, load support surfaces |
| Sawmill | Rotating saw blade, rollers, feeder rails, frame, guarded output location |
| Kiln | Housing, doors, vents, heat lines, stacks of real wooden boards |
| Logging truck | Cab, chassis, wheels, trailer, stake walls, cargo surface, rear lights |
| Excavator | Tracks, rotating upper house, arm, boom, bucket, articulated joints |
| Data center | Server rows, metal cabinets, vents, fans, pipes, conduits, rooftop HVAC |
| Desert landscape | Actual terrain mesh, rocks, drift/sculpted ridges, physical industrial ruins |

Each should be designed to read clearly from a first-person game camera, not just from a distant isometric perspective.

## 22.3 Tree optimization and felling transitions

1. Use instanced meshes for far trees where they are not yet interactable.
2. When a tree approaches interaction range, represent it by an individual hierarchical 3D model with collider.
3. When chopping begins, transfer deterministic tree data to a destructible interaction component and render actual cut feedback.
4. When the tree falls, replace its rooted state with a real falling trunk object and detachable log segments. Preserve identity and prevent duplicate items.
5. Return distant stationary tree batches to optimized storage where possible.
6. Rebuild only modified chunk mesh data rather than the entire world after one fallen tree.

## 22.4 Physical interaction quality checklist

- Tree trunk casts a shadow and accepts impacts at different heights.
- Player can walk around, under, and between larger trees where geometry allows.
- Falling trunk physically rests on slopes and can roll downhill.
- Carried/dragged logs do not snap through every solid object.
- Log mass visibly affects sprint speed, cart speed, and towing.
- A log can be loaded from the world onto a real vehicle bed and remain visible there.
- Fire consumes the specific log that crossed the intake boundary rather than subtracting a random inventory number.
- Planks visibly come out of the sawmill (possibly spawned in batches for performance).
- Conveyor cargo moves along real 3D belts/rollers.
- All industrial structures have collision, legitimate dimensions, and appropriate construction footprints.

---

# 23. BUILD ROADMAP — DELIVER WORKING MILESTONES

**The game is far too large to fake in one screen.** Implement it iteratively, preserving a playable game and save compatibility. At the end of every milestone, run the build, unit tests, and at least a smoke test in a browser. Fix errors before adding the next system. Check completed items in the tracking list, and do not mark incomplete features as finished.

## M0 — Website boot and 3D walking

- [ ] Vite/TypeScript app boots with an actual 3D `<canvas>` and FPS pointer lock.
- [ ] Player moves on 3D heightmapped/procedural jungle terrain with collisions.
- [ ] Daylight/shadow, fog, sky, basic ambience, pause/settings, graphics presets.
- [ ] At least three procedurally modeled tree shapes in the initial region.
- [ ] No PNG/image billboard world props.
- [ ] Player sees plastic butter knife as a three-dimensional tool.

**Exit test:** Open the site, move among trees, look around, swing the visibly modeled knife, and remain above terrain.

## M1 — Butter knife, chopping, falling, dragging, fire sale

- [ ] Small trees take real valid-hit damage, visibly accumulate cut marks and fall.
- [ ] Fallen trunk becomes a physical 3D object and stump remains.
- [ ] Hold E to physically drag, push, release or roll a log.
- [ ] Real 3D fire pit accepts actual delivered logs, burns and pays cash.
- [ ] Cash is spent on at least four functional starter upgrades.
- [ ] No duplication when selling the same log twice.
- [ ] Inventory, wallet, objective, save/load preserve chopped tree and money.

**Exit test:** From $0, cut and drag one tree, earn first sale, buy an upgrade, cut the next tree faster, reload page, and observe consistent saved progress.

## M2 — First profitable refining branch

- [ ] Add real sawbench, pocket saw, segments, and plank model output.
- [ ] Add raw timber buyer and board buyer with actual receipts.
- [ ] Add drying rack and hand-built crate or pallet recipe.
- [ ] Build a small logging route with rope, sled and wheelbarrow.
- [ ] Market UI compares fire, raw, and processed value.
- [ ] Purchase and equip early physical-tool upgrades.

**Exit test:** The same tree's materials can be sold through distinct mutually exclusive routes; processing takes time but gives superior potential payout.

## M3 — Game economy and progression foundation

- [ ] Data registry for all upgrade nodes, prerequisites, branching and costs.
- [ ] Implement at least the 48 early-game upgrades with actual gameplay effects.
- [ ] Player journal, first quest series, milestones, unlock notifications.
- [ ] Recipes, inventory, buy/sell ledger, market contract lifecycle.
- [ ] Local IndexedDB autosave + manual export/import.
- [ ] Basic options and input remapping.

**Exit test:** New upgrade purchases change measured movement/cutting/milling/sale behavior and persist across reloads.

## M4 — Vehicles and a real logging operation

- [ ] Ride/driving support, cargo mass/bed loading, unloading and fuel.
- [ ] 3D hand cart, small ATV, pickup, skid steer and first logging truck.
- [ ] Winch, hitch, trailers, grapple, forklift interaction.
- [ ] 3D road/path placement and connected-route display.
- [ ] Zone ownership, work areas, worker helpers and log delivery task.

**Exit test:** Player cuts several trees, loads them onto an actual vehicle, drives to the mill, unloads and processes them.

## M5 — Industrial processing and factory network

- [ ] Sawmills, kilns, joinery, pallet plant, chipper and paper chain.
- [ ] Machine buffers, recipe times, electricity and product quality.
- [ ] Belts, rollers, warehouses, route sorting, product buyers.
- [ ] Workers and work orders; basic time-saving automation.
- [ ] First 10 full product families and at least 100 genuinely implemented upgrade effects.

**Exit test:** Logs can move from physical logging zone to mill to finished goods to sales with transparent throughput and no free inventory spawns.

## M6 — World conversion and map progress

- [ ] Finite 4,096 m map architecture, region streaming and save state.
- [ ] Full biome data cells with clearing, plains, degradation, barren and desert.
- [ ] Regrowth, rain, water/soil/heat influences and stable desert test.
- [ ] 3D biome visualization transitions, dust and drying effects.
- [ ] Exact global and zone conversion counts.
- [ ] Fire, grazing, soil removal and early pump routes to desert.

**Exit test:** Clearing a tree creates plains, not automatic desert; subsequent land/water/heat changes turn that area into desert, the terrain appearance changes, and the result persists.

## M7 — Heavy industry and multiple victory strategies

- [ ] Heavy harvester, bulldozer, excavator, truck freight and automated forestry.
- [ ] Quarries, cement, asphalt, overfarming/grazing, thermal power, drainage.
- [ ] Electricity/water networks, heat overlays, industrial waste effects.
- [ ] Advanced mining and material processing.
- [ ] Data centers with compute contracts and true power/cooling demands.
- [ ] Multiple automated zone strategies that can desertify without any data center.

**Exit test:** Two separately configured campaigns can reach high desertification via different industries; no data-center-specific mandatory gate.

## M8 — Massive late-game depth

- [ ] Full **288 upgrade catalog** purchasable when prerequisites met, all with implemented effects.
- [ ] Rail, drone jobs, machine repair, specialized markets and long contracts.
- [ ] Regional logistics and large facilities with actual geometry.
- [ ] Endgame terrain tools, diagnostic scanners and mega-dryer.
- [ ] Dynamic events, challenges, achievements and optional offline progress.
- [ ] Optimization to handle large industrial bases and many converted cells.

**Exit test:** No upgrade is a dead button or false promise. Simulate full-map economic operation with frame-time and save-size monitoring.

## M9 — Actual 100% ending and final polish

- [ ] Determine campaign eligibility from fixed world cell data.
- [ ] Convert, validate and stabilize every cell.
- [ ] Report exact remaining cells and blockers near completion.
- [ ] Trigger endgame when and only when authoritative desert count is total.
- [ ] Victory flyover, stats, postgame continuation and optional New Game+.
- [ ] Full automated test suite + manual browser QA + audio/visual polish.
- [ ] Mobile touch controls, performance presets and responsive presentation.

**Exit test:** An end-to-end run using accelerated *test-only* settings completes the map; the ordinary campaign remains balanced, has no inaccessible green cells, and the win check is correct.

---

# 24. ACCEPTANCE TEST MATRIX

The project is not done because a screenshot looks appealing. The following behaviors must be demonstrable in a working build.

## 24.1 First-play and physical chores

1. [ ] Starting money is exactly zero and starting usable tool is the plastic butter knife.
2. [ ] All visible jungle trees are genuinely three-dimensional meshes.
3. [ ] A knife swing missing a trunk causes no tree damage.
4. [ ] Hitting a tree at valid range reduces persistent health and produces visual/audible feedback.
5. [ ] At least the smallest tree can be felled within the target beginner time.
6. [ ] Tree fall direction and collision are believable and do not always use an identical scripted spin.
7. [ ] Felled tree leaves a persistent stump and one or more actual physical trunk items.
8. [ ] Grab-and-drag uses physical motion/constraints, not instantaneous item-to-wallet conversion.
9. [ ] Releasing a log leaves it where it is and allows resuming later.
10. [ ] Dropping the tree in the fire intake pays once and consumes the correct wood instance.
11. [ ] Currency is deposited only after the sell/burn job succeeds.
12. [ ] Purchasing a starter upgrade debits the wallet and measurably alters gameplay.
13. [ ] Saving/reloading preserves removed tree, fallen log positions, money, and upgrades.
14. [ ] Moving out of range deactivates the tree's interaction target.
15. [ ] Massive late-game trees cannot be effortlessly felled by an unupgraded starter knife.

## 24.2 Refining and markets

16. [ ] A log accepted into the sawbench cannot simultaneously be sold as raw timber.
17. [ ] Plank processing consumes a valid log and produces visible 3D boards.
18. [ ] The same material yields different net economic outcomes through fire/woodshop routes.
19. [ ] Quality and moisture affect available products and customer payouts.
20. [ ] Machines stop when output capacity is full.
21. [ ] Machines pause when power or required inputs are unavailable.
22. [ ] Product delivery causes one ledger entry and debits appropriate inventory.
23. [ ] Selling or refunding cannot duplicate items through rapid repeated interaction.
24. [ ] All first 10 product families have recipe data, meshes and valid buyers.
25. [ ] Contracts have a real timer, input requirements and completion/failure behavior.

## 24.3 Vehicles, transport and automation

26. [ ] The physical log can be transferred onto a cart or truck bed.
27. [ ] Heavy loads slow or affect a vehicle according to tuned handling rules.
28. [ ] Wrong cargo or excess mass is rejected with a clear explanation.
29. [ ] Winches/ropes operate at finite range with real attachment points.
30. [ ] Roads, rail and conveyor routes are visible 3D geometry.
31. [ ] Forklift or crane arms visibly move while loading.
32. [ ] A hired hauler can pick up and move eligible logs to a chosen station.
33. [ ] A machine assigned to a job cannot accept the same job twice concurrently.
34. [ ] Offscreen automation consumes actual resources and produces bounded outputs.
35. [ ] A stalled truck can be recovered without corrupting cargo or save state.
36. [ ] Route screens show cause of blocked transfers.

## 24.4 Industry and environment

37. [ ] Removing trees advances clearing but does not instantly count all cleared cells as desert.
38. [ ] Exposed terrain physically changes across at least seven visible biome stages.
39. [ ] Soil moisture/water/heat changes are inspectable and consistent with active infrastructure.
40. [ ] Building a water pump consumes power and only affects its configured region/network.
41. [ ] Quarrying/soil stripping changes landscape or substrate state in affected cells.
42. [ ] Grazing or overfarming can suppress regrowth under the game rules.
43. [ ] Data centers earn contracted compute revenue only when appropriately powered/cooled.
44. [ ] Data centers are not needed for all desertification paths or required by the win trigger.
45. [ ] A full desert region stays dry through configured stabilization checks.
46. [ ] Environmental simulations yield consistent results regardless of render distance.
47. [ ] Save/load does not change exact biome conversion counts.
48. [ ] Rain and regrowth cannot cause impossible negative moisture or vegetation values.
49. [ ] A machine/bulldozer can navigate to or affect the final cells marked by the scanner.
50. [ ] Buildings or roads cannot remove difficult cells from the victory denominator.

## 24.5 Upgrade catalog and endgame

51. [ ] All **288** upgrade IDs are unique and validated at application boot.
52. [ ] All purchasable upgrades have a meaningful implementation, not a label-only placeholder.
53. [ ] Upgrades cannot be purchased without meeting money and prerequisite rules.
54. [ ] Upgrade price is deducted only once and bought nodes persist after reload.
55. [ ] No tree, building or biome cell is permanently inaccessible in a generated valid world.
56. [ ] Game shows exact desert cell count and accurately displays the remaining percentage.
57. [ ] The game does **not** grant victory at 99.99%, 99.995%, or any non-total desert count.
58. [ ] One stable valid cell count per every eligible cell triggers precisely one victory event.
59. [ ] A saved completed campaign reloads in the completed state without playing the finale repeatedly.
60. [ ] Optional New Game+ creates a newly finishable finite world with separate save integrity.

## 24.6 Usability, browser and performance

61. [ ] App works in a current Chromium browser and at least one other modern browser.
62. [ ] Canvas resize does not break input targeting or render resolution.
63. [ ] Pointer lock failure is handled with a clear user action.
64. [ ] UI remains readable at 1920×1080 and common laptop resolutions.
65. [ ] No uncaught console errors during ordinary game flow.
66. [ ] Settings and audio preferences survive reload.
67. [ ] Pausing the simulation does not allow worker jobs to silently complete.
68. [ ] No screenshot billboards masquerade as scenery, vehicles, trees or factories.
69. [ ] Save/export/import works, with version checks and visible recovery on invalid files.
70. [ ] Quality presets preserve object geometry and functional collider behavior.

---

# 25. BALANCE TARGETS AND PLAYTESTING

The game should be long but not padded solely by waiting. Every phase should introduce a **new physical job or a better solution to an old job**. Suggested baseline milestones, to be adjusted through playtesting:

| Time into a typical playthrough | What the player can actually do |
|---|---|
| 0–3 minutes | Cut the first tree with butter knife; drag it to fire; see and spend first money |
| 3–10 minutes | Cut trees faster; rope/early hand transport; see raw versus refined value |
| 10–25 minutes | First sawbench and simple planks, several starter upgrades |
| 25–60 minutes | Small workshop or cart; stack wood, craft crates, make contracts |
| 1–3 hours | Small sawmill, wood treatment, basic vehicle, first hired worker |
| 3–6 hours | Logging route, production network, multiple product chains |
| 6–12 hours | Large vehicles, full mill, warehouses, power, region-level logging |
| 12–20 hours | Heavy clearing, energy/water/soil systems, first sustained desert regions |
| 20–40 hours | Huge industry, several viable desert pathways, macro automation |
| 40–60 hours | Completionist upgrades, last-cell work, genuine 100% map conversion |

These are **design targets**, not promises that a real implementation will match before tuning. Add an in-development `balance` panel showing average tree completion time, earnings/minute, time to next affordable upgrade, hourly desert conversion rate, bottlenecked machines, and unmet material demand. Simulate common play styles (instant seller, furniture refiner, logging specialist, water-focused industrialist, data-center tycoon, no-data-center challenge) to avoid accidental dead ends.

### Anti-boredom pacing

- Early tasks are tactile; upgrades arrive every few minutes.
- Midgame introduces physical transport complexity rather than only bigger numbers.
- Factories add visual choreography and thoughtful routing.
- Large industrial machines feel earned because the player remembers dragging one miserable log by hand.
- Idle/automation enables progression between active sessions but never forces an excessive wait to play.
- The final 1% uses diagnostics and task scheduling; no hidden single unclickable sapling should ruin an otherwise finished game.
- Optional trophies for knife-only feats reward absurd manual challenge without making it mandatory.

---

# 26. OPTIONAL EXPANSION SYSTEMS

These are secondary to the core loop. Add them **after** the baseline game is genuinely playable and tested.

## 26.1 More industrial jobs

- Scrap collection after demolishing unused factories.
- Recycling machinery and old vehicle parts into new equipment.
- Mobile sawmills that can be towed to logging fronts.
- Repair/maintenance minigames with actual 3D parts.
- Hydraulic attachment swapping at a workshop.
- Modular bridge building for swamp/canyon hauling routes.
- Tree species with tangled roots requiring multiple extraction phases.
- Cavern mining, underground conveyor networks, and ore lifts.
- Salvage value for abandoned machines after an industrial site is retired.
- Shipping-container logistics and rail switching.
- Cargo inspection/grade sorting minigames.
- Conveyor jams that can be cleared manually or prevented by a purchased sorter.
- Wood-loading cranes with first-person or cabin controls.
- Dedicated shipping yards that visibly fill with 3D crates and lumber stacks.
- Forestry road quality and mud seasons, making tracked vehicles worthwhile.
- Custom truck/trailer attachment configurations.

## 26.2 Business depth

- Machine loans with understandable interest and actual repayment obligations.
- Stock purchasing and component supply contracts using game currency only.
- Wholesale versus retail buyers for handcrafted products.
- Worker training and specializations.
- Research equipment prototypes and experimental upgrade trees.
- Optional branded industrial company name and logo, displayed on real 3D signage.
- Company reputation affecting premium contracts.
- Warehouse insurance or breakdown protection.
- Production recalls when product quality is insufficient.
- Land auctions and neighboring industrial competitor NPCs.
- Cooperative challenge leaderboards (optional, privacy-conscious and anti-cheat aware).

## 26.3 Postgame creativity

- One new biome-rich island per New Game+ run, always finite.
- Start with a different ridiculous starter item in alternate challenge modes (plastic spoon, dull ruler, cardboard saw) while retaining the butter-knife canonical campaign.
- Build a museum of the original knife, first log and first sold plank.
- Speedrun seeds and completion timers.
- Blueprint sharing for factory/logistics layouts.
- Construction-only sandbox mode with save/load.
- Photo mode that captures screenshots **for the UI/gallery** without using screenshots as stand-ins for world models.
- Optional cooperative multiplayer only after single-player save consistency and performance are rock solid.

---

# 27. UI, VISUAL IDENTITY, AND SOUND DESIGN

## 27.1 Website presentation

Make the game look like a premium playable desktop sim, not a generic startup dashboard. The home menu should contain **Play / Continue / New Game / Settings / How to Play / Credits**. The background can show an actual live 3D scene of a dense jungle and distant industrial horizon. Avoid still PNG hero backgrounds if they replace a usable in-engine scene. The site should load directly into a lightweight interactive experience after an explicit Play click and support fullscreen.

**Visual style:** Near-black UI panels with warm forest-green highlights in the beginning; color-coded wood, transport, factory, and climate systems; progression into industrial yellow/orange and desert ochre. Use accessible contrast. Numbers should be prominent without consuming the entire view. Motion should be purposeful and consistent.

## 27.2 Interactions that make work feel good

- Heavy chopping should have distinct animation, sound, hit stop, and particle intensity.
- The knife's early swings should be audibly pathetic compared with later chainsaws.
- Log dragging should make friction sounds whose pitch/volume respond to mass and terrain.
- Large logs have low-frequency rolling/thudding audio.
- Fire sale has crackles and a satisfying earning cue.
- Sawmill blades spin up with motor load, wood passes through the mill, and finished boards clatter into stacks.
- Truck engines react to load and terrain.
- Huge clearing machines visibly rip/shred vegetation with controlled effects.
- Environmental ambience loses bird/insect density as jungle disappears and gains wind, dust and machinery sounds.
- Upgrades use short audio stings and visual reveals but should never force long unskippable animations.

## 27.3 Diegetic details

In-world gauges, computer screens, conveyor arrow signage, truck license plates, batch numbers, machine nameplates, and physical signposts should match the world's corporate satire. Use actual 3D sign geometry and appropriate 3D-surface text; do not paste giant billboards where a real mesh is expected. Make high-value products look visibly different from raw wood so refining always feels rewarding.

---

# 28. SECURITY, RIGHTS, AND QUALITY CONSTRAINTS

- **Original intellectual property:** Make original models, code, sounds, names, UI, text, and level generation. Do not replicate existing commercial game assets, characters, logos, or proprietary maps.
- **License hygiene:** If third-party GLB models, textures, sound effects, fonts, or libraries are used, confirm redistribution/commercial-use rights and list attribution in `CREDITS.md`; prefer original procedural models if uncertain.
- **No real-money economy:** All currencies and contracts are fictional in-game systems; do not include gambling, NFTs, or deceptive payment systems.
- **Browser security:** Do not run untrusted file content as code, use unsafe DOM HTML injection, or put private API keys in the frontend.
- **Accessibility:** Offer control remapping, UI scaling, reduced animation/screen shake and clear interaction labels.
- **Data ownership:** Single-player offline saves should work without account creation. Exported saves are user-controlled files; do not collect private analytics without notice and consent.
- **Stability:** Use build checks, consistent TypeScript types, error boundaries, fallback web graphics messages, valid save schema versions, and no unexplained dead buttons.
- **Performance disclosure:** When a system is simplified for browser performance (such as offscreen truck simulation), make it internally consistent and do not fake user-visible physical interactions while nearby.

---

# 29. CODING AI EXECUTION INSTRUCTIONS

Use this as the operating sequence when implementing from the README:

1. **Inspect the repository and environment first.** If a project already exists, understand its build system, assets and existing playable features before editing. Preserve and upgrade working code instead of replacing it wholesale.
2. **Define a scoped implementation plan** from M0 through M9 with completed/not-completed status, then execute the next smallest playable milestone. Do not begin by writing a fancy README instead of code; this document is already supplied.
3. **Create a real 3D scene** and verify the player can walk and interact. Procedurally build needed models instead of using 2D placeholders.
4. **Fully implement the opening butter-knife loop** before adding huge factory menus. The minimum acceptable early experience is: swing → damage → tree falls → physical log → drag → burn → cash → purchase upgrade → improved next run.
5. **Add wood-processing choices** with actual item transfers and variable payouts before building late-game industrial systems.
6. **Extend the world simulation and upgrade registry** from reusable data-driven systems rather than massive one-off callbacks.
7. **Add logistics, heavy equipment, buildings, multiple land conversion methods and data centers**, each with true world meshes and functional inputs/outputs.
8. **Implement the exact 100% win condition** at the simulation layer and prove it via tests. A progress bar animation is not a win implementation.
9. **Run the app and test in a browser** after each milestone. Fix interaction errors, browser console exceptions, save corruption, physics instability, and performance regressions.
10. **Do not claim unimplemented work is finished.** Leave a clear implementation checklist of remaining work. If execution stops because of context/tool limits, the repository should still build and the latest completed milestone should actually be playable.

### Priorities if forced to choose

- Real functional 3D interactions are more valuable than hundreds of polished but nonworking menu cards.
- One end-to-end operating sawmill is more valuable than 20 inert factory models.
- A properly simulated 10% desert region is more valuable than a fake 100% progress animation.
- A small selection of working upgrades is more valuable than 288 buttons that do nothing; **then** systematically finish the catalog.
- Browser performance, deterministic saves and content integrity are requirements, not optional last-minute extras.

### Deliverables from the coding AI

- A running web application with all source code.
- A valid package manifest, reproducible install/build/run commands, and no undisclosed proprietary dependencies.
- Procedural 3D mesh definitions and/or legally usable 3D model assets.
- Functional data registries for tools, upgrades, products, recipes, buildings, vehicles, and biome mechanics.
- Automated tests for harvesting, physical sale acceptance, inventory conservation, manufacturing, save/load, desert percentage and victory.
- A current checklist identifying exactly which milestones and acceptance tests are complete.
- Clear instructions for development, production build and deployment.

---

# 30. FINAL PRODUCT DEFINITION

A finished **Project Clearcut: The Last Jungle** is a **large, visually satisfying, actual 3D web game** in which a person starts with literally nothing but a **plastic butter knife** and can physically cut down a real 3D tree, drag the trunk over jungle terrain, and burn it for quick starting cash. That person can instead refine the timber through a growing production economy, unlock **288 working upgrades**, buy and operate increasingly ridiculous hauling and destruction machines, build immense interconnected factories and utility systems, and reshape a **finite 3D jungle map** through logging, soil stripping, farming, overgrazing, mining, construction, water extraction, thermal plants, data centers or specialized fictional desertification facilities.

The grass dries, trees vanish, the soundscape changes, real 3D industry fills the horizon, and every cell of the world carries persistent consequences. The end goal remains simple and uncompromising:

> **Remove every last patch of viable natural vegetation. Dry or degrade the required ground. Convert every eligible square of the campaign map into stable desert. Reach exactly 100% and win.**

**Not a text clicker. Not a PNG world. Not only data centers. Not only chopping. A massive physical chore-to-industry simulator, from one stupid butter knife to an entire manufactured desert.**

---

## Quick start for someone giving this prompt to an AI coding tool

Copy this entire `README.md` into the game repository and tell the coding AI:

> **“Build the game described in README.md. This document is your authoritative specification. Start by implementing milestones M0 and M1 completely as a working, polished 3D browser game, then continue milestone by milestone. Use real interactive 3D objects/models, not PNG or flat image scenery. Every feature you mark complete must work in the browser. Keep the code running, test actual interactions, and prioritize the physical butter-knife → falling tree → drag → fire → money → upgrade loop before adding larger industrial features. The full win condition is precisely 100% stable desertification of the entire eligible campaign map, achievable with multiple strategies, not only data centers.”**

**Project status:** Game design specification / build prompt. The README describes what to build; it is not a claim that the game itself has already been implemented.


---

# APPENDIX B — ORIGINAL USER-PROVIDED EXPANSION, SECTIONS 31–103 (FULL TEXT)

**Source:** Uploaded `task_31-103.md`. The following text is included unabridged. Sections 66–103 supersede earlier numeric targets as stated above.

# PROJECT CLEARCUT: THE LAST JUNGLE — EXPANSION PROMPT V2

> **LATEST EXPANSION — READ FIRST:** This is the current standalone companion `prompt.md` for the original `README.md` (Sections 1–30). The first expansion, Sections 31–65, is retained in full below so no earlier feature or upgrade is lost. **NEW Sections 66–103 supersede the older numeric targets**: 604 km² instead of 67.1 km²; 2,359,296 cells instead of 262,144; target approximately 170 engaged hours instead of 100; **1,696 total unique upgrades**, including 640 more on top of the existing 1,056; and **eight simultaneous audited 100% win objectives**, not merely 100% stable desert. Earlier sections are still binding for mechanics and the 3D-only artwork rules unless explicitly superseded by later values. Build the game; do not stop at a UI concept or design-only demo.

**Use `README.md` + this entire `prompt.md` as the complete coding-agent instruction.** Start with a plastic butter knife, drag physically fallen trees to the fire sale, refine wood, expand industry, build giant cities/data centers/factories, operate energy and climate systems, and finally render the distinct industrially ruined biome states across the whole finite campaign world. Every meter and result must reflect simulated state. Build and test incrementally, keep progress files truthful, and verify all eight win conditions before claiming completion.

### Quick navigation for this expansion

- **31–65:** Prior first expansion, including first 768 additional upgrades, existing systems, technical architecture and tests (preserved).
- **66–69:** V2 superseding rules, 150–200-hour pacing, 604 km² world and eight 100% victory objectives.
- **70–75:** Carbon/climate, 30 weather events, water, pollution composition and distinct true-3D world decay.
- **76–81:** Revenue-generating megafactories, skyscrapers, city building, hyperscale data centers, energy, transport and manufacturing.
- **82–94:** Live telemetry, construction, regions, automation, disaster recovery, polish, code architecture and upgrade registry rules.
- **95:** New 640 upgrade entries across 40 complete, distinct branches (73–112); total game catalog 1,696.
- **96–103:** Eight medal quests, optional game systems, expanded milestones, 100 new acceptance tests and final coding-agent mandate.

---

> **`prompt.md` — Sections 31 onward. Companion to `README.md`, not a replacement.**
>
> **Expanded production mandate:** Build a beautiful, deeply interactive, real-3D browser simulation that takes approximately **100 hours of engaged play** to legitimately convert a truly enormous, finite, persistent world to **100% stable desert**. Every tree, log, tool, machine, truck, building, and terrain change must be an actual 3D simulation object or streamed procedural representation—not a PNG posing as 3D. Start with a plastic butter knife; end with a world-spanning industrial system and a complete environmental audit.
>
> **Content mandate:** The original README specifies **288 upgrades** across 24 branches. This companion adds **768 new independently functional upgrades** across 48 additional branches, bringing the authored catalog to **1,056 unique upgrades across 72 branches**. No inert buttons, duplicate effects dressed up as new products, or purchased upgrades that only modify a label.

**Read this with `README.md`.** Keep `README.md` intact. Interpret sections 1–30 as the foundational game contract and sections 31–65 below as a binding implementation expansion. When a later specification explicitly *supersedes* an earlier numeric target (map size, progression length, upgrade count), the later specification wins. Do not discard early physical mechanics or the strict 100%-desert win logic. Existing milestones M0–M9 remain required; additional milestones E10–E19 below extend them.

---

# 31. EXTENDED MASTER IMPLEMENTATION PROMPT

You are the lead game director, engine programmer, systems designer, economy designer, technical artist, UI engineer, and quality-assurance lead for **Project Clearcut: The Last Jungle**. Turn both documents into a **complete, shippable, original 3D browser game**, not a design pitch, static site, fake screenshot, unfinished prototype, clicker page, or a few mock menus. Inspect the existing repository and its tools before changing code. Write production-grade implementation incrementally; run it, play it, test it, fix defects, and carry verified results into the next milestone.

The absurd opening must remain unaltered: the player has no money and a flimsy **plastic butter knife**. Repeated physical swipes notch an actual tree until a three-dimensional trunk fractures, tilts, falls, collides, and becomes draggable cargo. Drag it into a visibly burning **fire-sale pit**, receive the exact proceeds from a measured sale, and unlock something that changes the *next* physical job. Eventually the player can salvage and sort different grades of timber, slice logs into boards, kiln-dry and manufacture finished goods, operate trains and fleets, lay power lines and cooling pipes, run acres of real server racks, develop sprawling mines, and intentionally desiccate every one of the map's finite eligible cells.

The final 100% condition is *not* merely an economy level or a painted texture. It means every eligible cell across the campaign world passes a stable-desert predicate evaluated from live simulation state, including underlying soil beneath roads and constructed buildings. The final 0.01% must be discoverable, reachable, convertible, and auditable. The player's actions directly determine how jungle, cleared plains, overgrazed land, toxic industrial sites, depleted watersheds, rocky wastelands, and high-heat facilities become desert. The simulation can be stylized and accelerated; it must not purport to be a scientific prediction of real ecosystems.

**Do not begin by populating 1,056 nonfunctional menu items.** Build the verified playable vertical slice first, then define the full catalog as data, activate upgrades branch by branch, write effect-specific tests, and show unsupported items as not-yet-implemented in development builds. Every completed milestone must remain buildable, loadable, and playable. The requirements below are implementation targets; do not claim anything is already complete unless code and tests prove it.

## 31.1 Completion definition and integration precedence

1. `README.md` sections 1–30 define the original loop, 288 upgrades, required graphics rules, mechanics, core data contracts and first ten milestones.
2. `prompt.md` sections 31–65 extend these with the 100-hour campaign, 8.192 km world width, 768 more upgrades, advanced data centers, deeper power/pollution simulation, real-time telemetry, and exhaustive late-game validation.
3. The map override is **8,192 m × 8,192 m**, not 4,096 × 4,096 m; biome cell width remains 16 m for **512 × 512 = 262,144 campaign cells**. This is a fixed playable world, not infinite land.
4. The pacing override is **approximately 100 hours median engaged play to a verified victory**, with target range 85–120 hours across first-time player styles. Do not stretch it by simply doubling timers or requiring offline waiting.
5. The upgrade count is **1,056** authored unique nodes (original 288 plus 768 from Section 54); every node requires a real effect handler, cost, dependencies and regression tests before it can be marked functional.
6. The energy/pollution/industry systems are genuinely coupled to throughput, equipment behavior, regional climate, climate diagnostics and profits; graphical meters must display measured data, not animation-only fake numbers.
7. Missing external assets, services or APIs are not excuses for image impostors or dead interfaces: use original programmatic 3D geometry, local-first saves, and deterministic simulation fallbacks.

---

# 32. A 100-HOUR GAME WITHOUT EMPTY GRIND

**Design objective:** A skilled first-time player who explores several production branches and steadily optimizes their operation should complete the whole finite map around the **100-hour** mark. Hands-on progression, discovery, construction, logistics, environmental trade-offs, and new machine behaviors should occupy the player—not an endless idle timer, arbitrary stamina locks, account creation requirement, or payment mechanic. Test with three profiles: efficient optimizer (70–90 hours), typical explorer (90–110 hours), and deliberate completionist (110–140 hours). These are tuning targets, never claims before measured playtesting.

## 32.1 Campaign acts and milestone experiences

| Act | Typical elapsed play time | New physical work and world transformation | Expected progression |
|---|---:|---|---|
| I · Dinnerware Lumberjack | 0–2 h | Scrape, fell, drag and fire-sell small trees; learn branch and trunk mass | 0–10 purchased upgrades; first workbench |
| II · Primitive Yard | 2–6 h | Rope rigs, slides, sorting piles, manual saws and charcoal | Small logging yard, simple contracts, first $10k |
| III · Timber Business | 6–12 h | Powered saws, carts, compact loaders, board drying and pallets | First functioning production line and worker |
| IV · Regional Mill | 12–20 h | Forklifts, trucks, mills, log grades, packaging, roads | Multiple forest sectors cleared, first substations |
| V · Heavy Logging | 20–30 h | Harvesters, winches, tracked equipment, rail, mass transport | Large visible plains and several industrial depots |
| VI · Factory Landscape | 30–42 h | Wood chemistry, furniture, paper, automated yards and plant networks | Major earnings, full utility economy, systematic desertifying begins |
| VII · Ecological Collapse | 42–55 h | Drainage, overfarming, quarrying, soil stripping, river engineering | Several regional biomes visibly dry, pollution zones develop |
| VIII · Megawatt Economy | 55–68 h | Large power stations, heat recycling, grid dispatch, industrial automation | City-scale industrial districts and reliable machine fleets |
| IX · Data Civilization | 68–80 h | Server halls, workloads, rack placement, cooling, water and fiber systems | Full data-center company option and rival desert methods |
| X · Regional Domination | 80–92 h | Multi-region operations, automated surveys, autonomous cleanup | Last climate pockets become primary challenge |
| XI · Last Green Pixel | 92–100 h | Cell-specific diagnosis, inaccessible terrain cleanup, desert stabilization | Verified 262,144/262,144 eligible cells or appropriate fixed denominator |

**No hard mandatory data-center gate.** A high-throughput forestry/soil path, hydro-industrial path, agricultural path, mineral extraction path, energy-heavy urbanization path, or blended path must independently reach victory. Data centers are the most highly developed optional pathway, not the only answer. The table is a pacing target and progression illustration, not a prescription that every player buy every facility.

## 32.2 Anti-padding contract

- Introduce a distinct action, new interaction or genuine optimization problem at least every 20–40 minutes in the first 15 hours, and at least once per 60–90 minutes thereafter.
- An upgrade in every branch must solve a felt bottleneck; if a branch does not produce a changed action, capability, throughput, energy bill, terrain effect, visual appearance or automation behavior, redesign it.
- Active players should make more progress through skilled hauling, building, configuration and intervention than a disconnected idle timer can make in the same elapsed wall time.
- Limit early-game repeated chopping; the butter knife is a memorable introduction, not a mandatory six-hour slog. Later allow intentionally absurd knife-only challenge rewards.
- Environmental conversion should require planning across rainfall, water retention, groundwater, fertility, heat, vegetation, access and stability. A powerful dryer alone cannot permanently skip all physical or economic requirements.
- Every few hours the skyline, soundscape, industrial motion and map should look meaningfully different. The player must see their influence spreading across the world.
- If a player is stuck, diagnostics expose specific bottlenecks and suggested in-world fixes without instantly granting free progress.

## 32.3 Content scaling targets

Target at least **72 research branches**, **1,056 unique upgrade nodes**, **60+ distinct transportation/hauling configurations**, **40+ tool/tool-attachment types**, **70+ functional machine/building archetypes**, **120+ manufactured products/grades**, **40+ industrial process recipes**, **25+ distinct environmental influence actions**, **12+ terrain and climate visual states**, **150+ contracts/missions** generated from varied rule families, **150+ achievements**, **eight major geographic provinces**, and **at least six independent victory-feasible strategies**. Quantity alone is not completion: use procedural content only where it creates meaningful combinations with coherent implementation and verifiable differences.

---

# 33. THE ENORMOUS STREAMED CAMPAIGN WORLD

## 33.1 Non-negotiable geographic specification

The main world is **8,192 m east–west by 8,192 m north–south**, approximately **67.1 square kilometres**. Every in-bounds eligible cell must be modeled in the authoritative desert simulation, with a fixed 16-m grid, **262,144 cells total** before any explicitly generated immutable exclusions. The preferred design is to make all in-bounds cells ultimately convertible. Rivers, steep slopes, gorges, wetlands, mountain forests, bogs and industrial lots must have valid paths to stable desert. At first load only a small local operating sector is unlocked; entire world contents still exist deterministically from the seed, with purchasable easements, settlements, routes and land sectors.

The world must feel gigantic to traverse. On foot, the distant mountains and smoke plumes should be visible, but crossing the world is not practical without vehicles and logistics. Give the player eight 1,024-m provinces along a carefully planned network of 64 contiguous 1,024 m × 1,024 m districts, with distinct terrain character and clearing difficulty. Sectors are 512 m across for ownership/mission breakdown, 64-m chunks for local renderer streaming, and 16-m cells for biome accounting. These nested divisions are independent of scene-graph structure.

Example provinces and physical hazards: **Greenheart Basin** (tutorial jungle), **Rainspine Mountains** (slopes and rocky hardwood), **Mireglass Wetlands** (mud and standing water), **Copperbark Plateau** (thick old-growth trunks), **Ribbon Riverlands** (bridges and seasonal flooding), **Cinder Flats** (dry plains and quarries), **Cloudroot Highlands** (fog and road building), and **Outer Canopy** (dense late-game megaforest). These are original fictional places; rearrange layout with the world seed while preserving beginner accessibility and late-game obstacles.

## 33.2 World representation and data efficiency

- Keep persistent cell and region statistics in compact typed arrays or equivalent binary stores; separate base terrain (seed + deterministic noise) from sparse deltas such as tree removal and built foundations.
- Render nearby terrain as true 3D meshes with slope geometry. Use chunk-scoped instanced trunks/branches, hierarchical canopy clusters, geometry LOD and geometry impostor simplification **without converting objects to flat images**.
- Maintain actual collider geometry near the player; distant equipment uses deterministic abstract simulation until streamed in. Rehydrate trucks and machines in consistent positions and production state.
- Track world ownership and access separately from cell eligibility; unowned cells always count toward world completion and remain possible future conversion targets.
- Preserve ecological state under asphalt, building foundations and floor slabs. A demolished structure must reveal the underlying correct state rather than green default grass or a fixed brown texture.
- Generate bridge anchor points, climbable slopes, road connection candidates and navigable corridors so every required region can be physically reached or serviced.
- Use deterministic chunk regeneration and save only modified trees, removed deposits, built entities, terrain deformation and time-indexed environment changes. Compress changes by district and use schema-versioned snapshots.
- Target world re-entry in seconds, not a full re-generation of millions of instantiated objects. Display a true progress loading indicator if chunk warming takes noticeable time.

## 33.3 The map is an actual management tool

The map has zoomable layers for biome stage, tree species and harvestable mass, owned plots, roads and rails, logistics throughput, active jobs, power generation/distribution, battery state, water table, drainage and pumping, measured pollution, local heat, soil fertility, erosion, machine failures, and exact pending desert cells. Each layer reads the same authoritative world and device data as the simulation. Support layer filters, tile drill-down, district comparison, timestamp rewind of tracked aggregate history, waypoints, route planning and export of an optional diagnostics report.

**Never fake 100.00%.** UI can display `99.99%` for a rounded value, but victory triggers only when integer `desertCells === eligibleCells` and all stabilization conditions pass. When exactly one cell remains, show where it is, which requirement fails, its current trend, and at least one reachable method of correcting it.

---

# 34. REAL 3D ART DIRECTION AND POLISH ESCALATION

The website must resemble a polished modern game, not an enterprise dashboard sitting on a blank plane. Use a coherent, slightly stylized semi-realistic 3D industrial world: sculpted tropical trees, solid canopy volumes, colorful products, readable machine silhouettes, physically believable collisions, heavy equipment animation, beautiful light through tree branches, credible mud and dust, changing sky, and a gradual transition from lush saturated greens to dusty orange, ochre and gray. Use real GLB/glTF models or original geometry. **Do not use flat PNG/JPEG/WebP planes as trees, plants, structures, fires, vehicles or distant scenery.** Texture maps and shader detail on actual 3D geometry are allowed; camera-facing sprite impostors are not allowed as substitute world objects.

The evolution should be immediately visible at several scales: individual bark shaving, notch deformation and tree fall; at the yard scale, stacks of logs, pallets, smoke, vehicles and new buildings; at the district scale, meadows, drying grasses, eroded hillsides and industrial blocks; at the world scale, the jungle shrinks and a continuous desert spreads. Use terrain geometry modifications for craters, strip mines, road cuts and quarry pits, with controlled chunk remeshing. Ruts can use mesh deformation or terrain material effects where geometry is impractical, but structural pits, trenches and altered traversable grades must be actual geometry. Roads and rails follow terrain; water uses 3D mesh surfaces and physically coherent local levels.

In-world 3D objects need multiple LODs, proper UV/material slots, normal/roughness detail, and animated joints where relevant. Build procedural trunk taper, growth rings, knot shapes, branching variation, root flares, stump cut faces, log segment caps, bark types, wood grain, track assemblies, wheels, blade teeth, fan ducts, server cages, server trays, fiber racks, pumps, cooling towers, transformer coils, and conveyor rollers. At minimum, give every machine working parts that respond to its current state. A parked saw spins down, a stalled conveyor stops, an overheating rack lights amber, a pump awaiting water cavitates or refuses to run, and a truck bed visibly changes as logs are added or removed.

**Presentation modes:** First-person work, third-person vehicle camera, cab camera for heavy equipment, zoomable overhead industrial planner, and cinematic/photo mode. The in-game menus should have compact readable typography, color-blind-safe status encoding, search and filtering, contextual tooltips, grouped skill-tree visualization, and a crisp modern industrial look. Do not prioritize fancy postprocessing over interactions or frame rate. Avoid inaccessible particle clutter and flashing status animations; supply reduced-motion and accessibility options.

---

# 35. MORE PHYSICAL DESTRUCTION — A WHOLE WORLD OF THINGS TO OPERATE

Destruction must feel tactile, progressive and varied. Tree felling stays the primary beginning chore; the later game adds distinct *in-engine jobs*, not a single button called "Destroy Region." Each method has costs, prerequisites, relevant 3D tools and machinery, localized physical results, effects on the environment, and a natural reason to use it.

## 35.1 Forestry techniques

The tool family extends from plastic knives and utensils to scraping rigs, axes, handsaws, electric saws, gas chainsaws, pole saws, tree wedges, directional felling jacks, winches, skidders, hydraulic grapples, mechanized fellers, full harvesters, stump grinders, mulchers and multi-head processors. Every technique should differ in reach, swing/hit geometry, durability or fuel, target diameter, output quality, debris profile, noise, cycle speed and safety of tree falls. Thin saplings fall quickly; tropical giants require planning, equipment and hauling routes. Some giant root systems must be extracted separately after felling. A stump has an actual collider and may obstruct construction until ground or root clearing occurs.

## 35.2 Terrain and ecosystem destruction types

- **Root grubbing and stump extraction:** Leave holes and soil damage; require backfill or can become drainage sumps.
- **Mechanical mulching:** Turn bushes and undergrowth into biomass or organic litter, reducing shade and changing soil cover.
- **Controlled in-game fuel burning:** Small site-scale burn pits and fictional industrial burn machinery, each with smoke, ash, operating constraints and gameplay side effects; no real-world procedural instructions.
- **Bulldozing and scraping:** Remove topsoil and flatten land in visible passes, generating material piles that must be hauled.
- **Excavation:** Dig clay, gravel, rock and resource pits using machines, bucket fill and unloading interactions.
- **Strip mining:** Expose mineral ground, accumulate tailings, change water paths and accelerate erosion; map scars persist.
- **Quarry blasting:** Stylized, fictional, upgrade-gated industrial event with warning zone, debris and a permanent quarry deformation; do not simulate or teach real explosive manufacture.
- **Agricultural exhaustion:** Drain and till land, repeated harvest cycles, heavy fertilizer/pesticide abstraction as fictional pollution mechanics, overgrazing and topsoil depletion.
- **Water infrastructure:** Pumping fields, artificial canals, drainage trenches, reservoirs, diversion stations and industrial water consumption; wetlands can be dried but may rewet during storms.
- **Paving and construction:** Replace habitat with roads, yards, factories, concrete, solar arrays and cooling equipment; foundations inherit underlying biome state and cannot evade the win test.
- **Thermal industrialization:** Power plants, foundries, kilns, high-density server campuses and heat-heavy industries create measurable local thermal influence.
- **Dust, soot and wind erosion:** Exposed dry ground releases airborne dust in stylized weather, reducing visibility and affecting maintenance; dust does not independently cause instant desert conversion.
- **Demolition and salvage:** Decommission old buildings into scrap, recycling streams and construction waste, with physical debris and persistent soil damage.

## 35.3 Required interaction quality

Provide tree directional hints, notch stage geometry, predicted fall arc, a ragdoll-like but bounded rigidbody fall, collision-triggered ground impact, persistent stumps and collectable logs; allow hand splitting, chainsaw sectioning and automatic processor outputs. Excavators need articulated boom/bucket controls and material payload. Bulldozers need blade-height interaction and terrain height deltas. Quarries need working loading/haul loops. Fire pits must measure actual delivered wood rather than accepting arbitrary nearby inventory counts. Heavy machines require refueling, repairs, attachments and correct access paths. Debris should consolidate into salvage piles offscreen to avoid exhausting the browser's physics engine, without silently granting resources.

**Fiction boundary:** This is a satirical simulation of environmental destruction. Keep the mechanics in-game and do not present them as practical instructions for harming real land or infrastructure.

---

# 36. CARGO, LOG HAULING, VEHICLES AND ROUTE COMPLEXITY

Moving wood is a second full game, as important as chopping it. A freshly felled giant cannot teleport to market. Give cargo persistent mass, moisture, quality, shape, center-of-mass, friction and ownership. The earliest log is dragged by hand with a press-and-hold grab joint; later use handcarts, sleds, rope anchors, rollers, pulley blocks, wheelbarrows, log arches, winches, pack trailers, compact skid steers, utility tractors, forklifts, loader cranes, logging trucks, articulated dumpers, rail cars, barges in suitable river sectors, automated haulers, overhead cable systems and yard conveyor lines. Offer **60+ genuinely distinct configurations** by combining chassis, bed, suspension, power source, hitch, loader, traction tire/track package, containment and routing module—not 60 differently colored copies of one truck.

Routes matter because steepness, mud, flooding, road wear, obstruction, cargo mass and fuel/battery consumption alter achievable throughput. Trucks are real 3D vehicles in the local active simulation; unloaded fleets are represented by journey plans with travel times, capacity and deterministic failure events. Their destination depots have real storage limits and unloading geometry. Loading may be manual with a grapple or automated with a purchased loader; cranes should lift visible cargo and trailers should be able to tip or dump only at compatible receivers. All transport needs clear task status, capacity utilization, arrival estimate, running cost, cargo trace and unload result.

Add configurable schedules, dynamic route costs, reserved lanes, one-way forest roads, broken bridge warnings, loading-bay appointment queues, railroad switching, fuel delivery, field maintenance, spare-part distribution, collision recovery and emergency tow. World expansion should reward infrastructure planning: the beginner carries one trunk a few meters; late game keeps dozens of depots, ports, rail stations and production campuses supplied across kilometres.

---

# 37. A MULTI-TIER WOOD AND BYPRODUCT ECONOMY

A fire is the fastest possible early cash but a bad long-term value proposition. Log value depends on species, diameter, length, moisture, quality and damage. A practical player can cut, debark, grade, split, chip, plane, dry, glue, laminate, finish, package and sell. Add distinct visual products: raw logs, sawdust bags, wood chips, bark mulch, split firewood, charcoal sacks, pellets, boards, beams, siding, tongue-and-groove floorboards, plywood, oriented strand board, glulam beams, timber frames, shipping pallets, crates, paper rolls, cardboard sheets, tissue bundles, molded pulp containers, shelving, cabinets, tables, chairs, trim, doors, decorative panels, wooden toys and industrial packaging.

Manufacturing means **input stock enters a machine and output stock emerges into a physical receiver**. A recipe consumes exact mass and energy; yields variable grade, co-products and scrap; can be interrupted or bottlenecked by electricity, labor, dryness, packaging or machine failure; and can use a quality-control step. Markets should have demand saturation, freight cost, premium rush orders, grade requirements and a volatile but bounded fictional price index. The financial ledger records every sale once. Research can unlock blended products, reduce scrap, improve yield or open market tiers, but cannot duplicate matter.

Keep at least seven viable business identities: burn-and-volume seller; premium furniture maker; construction timber supplier; engineered board industrialist; paper/packaging producer; charcoal/biomass operator; vertically integrated resource-to-data-center conglomerate. No branch should be a purely decorative side track. A forest industry can finance late-game conversion without constructing server campuses.

---

# 38. POWER, ENERGY, FUEL, THERMAL LOAD AND THE GRID

**Energy is a resource, not just a green HUD icon.** Implement two distinct readable systems: (A) **player exertion**—stamina, fatigue, recovery and optionally food/rest on lower difficulty—so manual physical chores have rhythm; and (B) **industrial power**—measured production, consumption, distribution, storage and failures. The user's requested energy meter should show a useful compact factory overview in the HUD and an expanded grid-control panel.

Industrial power has units: instantaneous power in **kW or MW**; produced/consumed energy in **kWh or MWh** over time; batteries in kWh with power limits; fuel reserves in litres or stylized game fuel units; cooling thermal load in kWth; water consumption in m³ per game day. Never add watts and watt-hours together. If simulation days are accelerated, document the conversion between real seconds and in-game hours so bills, generation, consumption and weather remain consistent. Show **available capacity, actual draw, reserve margin, peak draw, current generation, battery state of charge, unmet demand and energy cost per product**.

Generation archetypes include compact wood generator, gas/diesel machinery, biomass boilers, steam engine generator, solar fields, wind farms, grid import transformer, combined heat-and-power plant, thermal power campus, geothermal fiction plant, and fictional megaproject reactors as late-game optional choices. All are balanced game fiction and should not turn into an engineering manual. Substations, switchgear, power poles, underground cable routes, transformers, distribution feeders, circuit breakers and backup generators should appear as modeled in-world components. Model cable length/capacity and topology at the grid-graph level while keeping visuals efficient.

Buildings draw power dynamically according to productive state, startup surge, maintenance and cooling. Factories enter slowed or paused states under partial power; data centers throttle jobs before overheating; workers reroute tasks when electricity fails; backup systems only supply what their fuel/capacity allows. Batteries charge/discharge subject to efficiency and power caps. Solar and wind depend on weather in a simplified, comprehensible way. Heat reclaimed by secondary processes improves economics but does not erase the original source's electricity draw. Energy UI must show the source of all numbers and a rolling historical graph, with total energy conservation checked in tests.

---

# 39. POLLUTION, CLIMATE, WATER, SOIL AND PUBLIC STATISTICS

**Pollution needs both a highly visible global meter and physically meaningful local maps.** Each polluting process emits one or more fictional game pollutants: smoke/particulate index, soil contamination index, water contamination index, waste-heat index and airborne dust burden. These are stylized dimensionless simulation indices rather than claims about real-world atmospheric science. Global pollution is an area-weighted summary of measured regional fields, not a number arbitrarily added per purchase. Show the index 0–1000 with explicit legend, scope and trend; the HUD may use a normalized 0–100 bar, but detailed tooltips must reveal raw values and units.

Pollution should matter: soot reduces output grade without filters, dust fouls solar modules and fans, water contamination affects industrial intake quality, soil pollution alters regrowth, and smoke/heat affects local visibility and operating conditions. High pollution can help some fictional degradation mechanics but also increases maintenance, worker downtime, water-treatment burden and environmental instability. It is not always beneficial or the same thing as dryness. If players invest in filters, treatment plants or heat recovery they can manage damage and efficiency; such upgrades **must not fake lower emissions while still granting all of their gameplay penalties or desertification effects**. Give meaningful clean-versus-dirty tradeoffs and multiple legitimate conversion strategies.

Per-cell environment includes natural vegetation, canopy cover, exposed root fraction, soil moisture, groundwater, fertility, soil compaction, soil pollution, water pollution, erosion, heat, dust susceptibility, drainage, evapotranspiration and runoff. At the district level, simulate rainfall, wind, sunlight, temperature bands, storm pulses, heat islands and dust events. Adjacent cells exchange moisture and heat with bounded, stable numerical methods. Roots and retained biomass influence local retention so cleared land dries differently from shaded intact jungle; the exact game rules must be explained in a readable environmental encyclopedia. Provide reversibility before stable desert, using hysteresis, rainfall response and threshold holding periods.

**Always-visible statistics** should include money, income/minute, lifetime earned/spent, environmental conversion %, converted/total cells, pollution index, active industrial power draw/generation and reserve, global water table trend, trees cut, wood hauled, manufactured units, active machines, broken machines, fleet jobs, contract queue, current weather, top bottleneck, and estimated throughput (not ungrounded completion time). The expanded dashboard includes selectable time series at 1m/10m/1h/24h/campaign lifetime, zone-level comparisons and alert drill-down.

---

# 40. DATA CENTERS AS A FULL SECOND INDUSTRY

Data centers should be **one of the deepest systems in the game**, mechanically interesting even for players who could win through other methods. Buying a single warehouse and watching a "money/sec" label is not a data-center feature. Players must secure land, foundations, utility service, backup power, cooling, fiber/communications, interior rack rows, power-distribution units, server chassis, storage, network switches, maintenance staff and client workloads. Each component has capacity, cost, heat, reliability, upgrade paths and a legible 3D representation.

## 40.1 Hands-on campus construction

Start with a prefabricated server shed and grow into modular containerized racks, a small tiered server hall, an urban edge node, dedicated GPU warehouse, hyperscale campus, liquid-cooled megacluster, desert-edge research district, and large fictional regional compute park. Build 3D foundations and floor grid, lay cable trays and cooling pipe routes, connect transformers and switchgear, place rack frames, slide visually modeled server chassis into racks, install fans and pumps, wire switch cabinets, connect appropriate coolant routes, and commission the hall. Later construction teams automate placement while preserving actual grid/capacity constraints and visible operating equipment.

## 40.2 Jobs rather than magic passive profit

Client workloads have CPU/GPU/storage/network requirements, priority, due time, uptime target, energy sensitivity, data-locality constraint, heat production and payout. Examples are fictional rendering contracts, archival storage, scientific simulation, weather modeling, game hosting, AI batch processing and enterprise backup. Model queuing and resource allocation, but **never actually run cryptocurrency miners or consume real GPU resources to simulate revenue**. Virtual compute units are game abstractions; the browser renders the game, not actual cloud jobs. Payout is based on fulfilled simulation work with completed job ledger entries. Contracts can be missed from downtime, insufficient cooling, lack of network capacity or poor dispatch policy.

## 40.3 Cooling as a controllable game system

Implement ambient-air cooling, evaporative cooling, closed-loop liquid cooling, chilled-water loops, rear-door heat exchangers, immersion-tank fiction variants, district cooling and heat reuse. Each has different electric draw, water draw, complexity, operating window and reliability. Make player choose between water-efficient high-energy cooling and energy-efficient water-intensive cooling. Hot weather and dusty air can derate performance. Server load produces virtual thermal power, and cooling removes or redistributes it with conservation-friendly abstractions. Overtemperature first reduces throughput, then triggers emergency shutdown or damage; never instantly deletes hardware without warnings and recovery options.

## 40.4 Data-center interface and environmental consequence

The data center has dashboards for per-campus **IT load, facility load, power usage effectiveness (PUE, energy ratio), cooling coefficient, inlet temperature, water use effectiveness (stylized L/kWh), rack occupancy, available network throughput, SLA fulfillment, earnings/hour, power cost/hour, failure rate, coolant reserve, pollution influence, water depletion and district heat map**. Do not fake standards certification. Explain PUE as total facility energy divided by IT equipment energy and handle zero IT load without divide-by-zero. A high-heat/hard-water extraction strategy can aid fictional desertification while risking outages and poor profits; efficient centers can be lucrative with smaller environmental impact. The player has agency; there must not be a single objectively superior upgrade branch for all situations.

---

# 41. MANY PATHS TO MAKE THE MAP A DESERT

Give the player an **industrial strategy board** showing where and why biome conversion happens. At least six approaches must be capable of reaching the end condition without depending on data centers: high-volume logging and root removal; quarry/mining/soil removal; water extraction and drainage; intensive industrial agriculture and soil degradation; thermal/power/urban sprawl; and mixed logistics megaprojects. Add a seventh optional data-center–focused pathway. Each makes different demands on cash, fuel, labor, access, transport, infrastructure, upkeep, terrain conditions and environmental counterpressure.

Clearing canopy alone is not enough: the intermediate result is usually **plains**, not desert. A completely treeless wetland is still wet. An asphalt district with green fertile ground under it has not automatically passed. Rain can reverse a half-completed cell, particularly beside rivers and wetlands. The reliable industrialist learns to dry the water table, expose or damage soil, prevent natural regeneration, or create sufficient stable thermal/substrate conditions. No upgrade writes directly to the global percent counter. Every method works through cell inputs and bounded influence radii; show them as overlays on the map and as physical machines in the world.

The final cleanup period should not force the player to drive manually to 2,000 hidden cells. Unlock an expensive survey bureau, mobile scan trucks, aerial lidar drones, moisture inspectors, task schedulers and precision clean-up rigs. Their jobs are real simulation tasks with travel times and operating cost; the map lists required conditions, equipment capability and expected time range. An automated machine can only work on reachable/owned cells and its actions must be simulated just like a player's tool. The victory audit runs independently of the HUD and cannot be cheated with rounded percentages.

---

# 42. PLAYER NEEDS, TOOL DURABILITY AND MACHINE FAILURE

Keep the main loop satisfying rather than punishing. Manual stamina slows work but does not trap the player indefinitely. Allow settings for forgiving/default/hardcore exertion, permanent tool mastery for advanced players, and optional lightweight food/rest systems. Fuel, electricity, water, spare parts, lubricant, wear, thermal stress and contamination form operating expenses for industrial tools and buildings. Worn saws produce crooked cuts; dull blades create chips instead of premium boards; poor tire tread causes mud delays; dirty radiators reduce engine efficiency; filters clog as dust rises; failing batteries shorten peak-power support; servers throttle before safe shutdown. Repairs are jobs with 3D components and valid spare parts, not just a generic "Pay $200" modal.

Provide a maintenance scheduler with service intervals, predictive warnings based on actual recent load, part inventories, dispatch priorities and downtime accounting. Automation upgrades can reduce labor but must not be allowed to duplicate materials or repeatedly sell the same cargo. All equipment must have an explicit state machine: idle, assigned, pathing, loading, operating, blocked, power-limited, maintenance, damaged, returning and unavailable, with sensible transitions and failure recovery.

---

# 43. FULL GAME HUD, MANAGEMENT SCREENS AND TELEMETRY

Design a modern game HUD that can be read without hiding the world. Core top bar: cash, current income/min, available MW, demand MW, brownout icon, global pollution index, water trend, world desert %, and tiny progress toward the active goal. Bottom left: player stamina/energy, health only if meaningful, tool integrity, tool capacity or fuel. Bottom center: equipped tool, interactable object prompt, contextual action and short job status. Bottom right: physical inventory mass and cargo/vehicle capacity. Alerts sit in an optional collapsible stack and never obscure the center crosshair.

Build polished screens: **Upgrade Atlas** (72 branches, prereq graph, search, affordability, effect preview), **Research Lab** (queue and prototypes), **World Atlas** (layered 2D UI map from live simulation), **Industry Ledger**, **Fleet Dispatcher**, **Factory Designer**, **Power Dispatcher**, **Water Office**, **Pollution Monitor**, **Climate Monitor**, **Campus Builder**, **Server Workload Scheduler**, **Contract Exchange**, **Achievements**, **Operations Timeline**, **Construction Blueprints**, **Maintenance Office**, **Save Manager**, **Photo/Cinematic Mode**, and **Accessibility & Settings**. All important numbers link back to a definable source. Make useful graphs, rate-of-change indicators, drill-downs and before/after comparisons.

Telemetry events should track manual cuts, trunk mass, fire sales, item input/output, warehouse occupancy, energy generated/consumed, power curtailment, water pumping, emissions, road trips, accidents, repair jobs, machines purchased, upgrades activated, and per-cell desert transitions. Limit event storage with rollups and periodic snapshots. Distinguish **lifetime generated**, **currently stored**, **actively flowing**, **sold**, and **wasted** metrics. Any dashboard graph must calculate from actual events or sampling, never a random trend. Provide a developer inspection panel to verify registry upgrades and inspect entity/cell state in a test build.

---

# 44. AUDIO, FEEDBACK, ANIMATION AND ENVIRONMENTAL EVOLUTION

The butter knife makes a comically inadequate plastic scrape; progressive wood stress adds creaks, splinters and a heavy crack. Fallen trunks thump and roll according to mass. Worn logs grind through mud, sleds rattle, carts squeak, saw teeth sing, conveyors pulse, kilns hum, forklifts beep, turbines rumble, pumps cavitate, cooling towers roar and server halls have a layered fan tone. Sound is spatial and parameterized by load and distance; use original or properly licensed audio. Never rely on one endlessly repeated stock sound. Support separate sliders for master, effects, machinery, ambience, music and UI; dynamic range compression and hearing-friendly options are essential.

Visual feedback must be tied to events: actual cut depth changes a trunk model, wood chips bounce and settle before pooling into inexpensive particle aggregates, the fire's flame geometry scales with fuel throughput, mills physically animate their rollers, racks light according to job/temperature state, water troughs lower as intake continues, exhaust density responds to emissions and dust storms arrive according to weather. Wildlife sound slowly declines with jungle area; wind in open grass becomes industrial fan noise, eventually replaced by dry gusts in the final desert. Changes should be vivid but not photorealistic at the cost of frame stability. Motion reduction must preserve gameplay readability.

---

# 45. ECONOMY AND CONTENT SYSTEMS THAT CAN SCALE

A production recipe has input item types/grades, mass and volume, energy, water, worker time, machine capability, output grades, byproducts, emissions, waste heat, maintenance wear, waste and market destination. Keep ledger transactions idempotent and side effects atomic. **Stock cannot go negative**, a player cannot sell an unowned log, a machine cannot fabricate an output without consuming resources, and physical cargo cannot be simultaneously stored on two vehicles. Financial health should be visible: cash balance, revenue, operating profit, debt, credit (if available), power cost, labor expense, freight expense, inventory value and cash conversion cycle.

Use bounded buyer demand with category-specific price responses: raw wood income helps fund beginnings but finished goods pay better with higher labor, energy and capital requirements. Introduce regional buyers, construction projects, recurring paper contracts, government-funded fictional infrastructure grants, high-uptime computing clients and late-game megaproject orders. Auctions, rush jobs and rare hardwood premiums add choice; do not gate the mandatory campaign behind a lucky randomized contract. Contracts expose expected production chains and logistics obligations before acceptance.

Late-game spending must remain meaningful through 100 hours: enormous equipment deposits, industrial district expansion, environmental monitoring, power backup, routing and automation upgrades, research facilities, water treatment, replacement parts, road upkeep and ultra-expensive finish-line rigs. Money numbers may become massive but avoid meaningless 10^100 price inflation. Support compact numeric formatting with accessible full numeric tooltips.

---

# 46. WORLD SIMULATION CONTRACT: DETERMINISTIC, COUPLED, EXPLAINABLE

Use fixed discrete simulation ticks for economy/production and a potentially slower tick for regional climate. Separating tick schedules is fine if every subsystem has a defined handoff. Quantities must have named units and clamp or bound invariants. Prevent large time skips from causing instability by processing substeps or an analytically verified aggregate. Visuals interpolate but do not independently update authoritative climate or resource data.

**Suggested environmental state:** `vegetation`, `treeCover`, `rootBiomass`, `soilMoisture`, `groundwater`, `fertility`, `compaction`, `erosion`, `soilContamination`, `waterContamination`, `pollutionParticulates`, `industrialHeat`, `dustPotential`, `drainage`, `substrateExposure`, `stabilizationTimer`, `stage`, `desertified`, `lastTick`. Use typed arrays or an equivalent memory-efficient ECS data format; provide a schema with full save migration support. Constants are **game balance values**, not real climatological coefficients.

For each cell, estimate incoming rain infiltration, soil evaporation, soil drainage, groundwater recharge and extraction, near-neighbor lateral moisture exchange, foliage growth/death, root effects, tillage damage, mining/soil removal, emissions deposit, heat diffusion and erosion. Clamp each bounded dimension to `[0,1]`; track any excess as runoff or overflow if it represents conserved water. Use a small explicit conservative flux model for water exchange. For speed, evaluate climate in groups of dirty/active districts and analytically integrate stable coarse far-field trends with verified equivalence on short horizons.

**Sample type contract:**

```ts
interface EnergySnapshot {
  tick: number;
  generatedKW: number;
  importedKW: number;
  consumedKW: number;
  lossesKW: number;
  chargedKW: number;
  dischargedKW: number;
  curtailedKW: number;
  unmetKW: number;
  storedKWh: number;
}
interface PollutionSnapshot {
  tick: number;
  globalIndex: number; // 0..1000, weighted from local sources
  particulatesIndex: number;
  soilContaminationIndex: number;
  waterContaminationIndex: number;
  dustIndex: number;
  heatIndex: number;
}
interface CampaignProgress {
  eligibleCells: number; // fixed at world generation
  stableDesertCells: number; // count of exact passing cells
  stabilizingCells: number;
  unstableCells: number;
  percentPrecise: number; // display only, never victory source
  verifiedVictory: boolean; // stableDesertCells === eligibleCells AND audit passed
}
```

**Equations as sanity constraints:** `generated + imported + discharged = consumed + charged + transmission_losses + curtailed + reserve_unassigned ± numerical_tolerance` for a single resolved tick, with unmet demand excluded from actually delivered consumption. `PUE = facility_kWh / IT_kWh` only when `IT_kWh > 0`. `profit = sales - wages - fuel - power - repair - financing - other operating expenses`. `eligibleCells` never changes after creation. Pollution summary = area-weighted mean of explicitly normalized local channels, not a count of machines. A never-powered device does not create operational pollution or heat unless its inactive state has a separate modeled source.

Test integration with canonical snapshots, property-based checks and replay determinism. Inspect and fix NaN, negative inventory, negative water, overflow, duplicate payout, oscillating biome stages, stranded jobs, and possible unreachable cells. Set a maximum simulation catch-up interval and disclose it to the player.

---

# 47. PLAYABILITY AND PERFORMANCE ON AN ORDINARY WEBSITE

The browser must be able to handle 262,144 climate cells, huge forests and hundreds of factories without maintaining every object as an active physics body. Use chunk streaming, instanced meshes, merged geometry for static details, LOD based on geometry complexity, impostor-free trees, spatial hashes, batched collisions, worker-thread calculation for optional high-cost tasks, pooled particles, lazy UI data retrieval and deterministic distant fleet simulation. Do not render all 72 upgrade pages as giant React node trees at startup. Construct visible upgrade lists on demand with virtualized rows.

Performance targets should be measured on a documented midrange desktop profile and a low settings profile: steady 60 FPS target at 1080p with hundreds of visible tree instances and at least a modest operating yard; acceptable sustained 30 FPS on low-quality hardware; no catastrophic memory growth from frequent chopping, scene reloads or save cycles. New chunks should stream without long UI freezes or unexplained terrain holes. Before gameplay, detect WebGL support; provide useful recovery instructions rather than a broken blank screen. The mobile browser may support limited movement and management UI, but desktop is the primary full experience; do not claim mobile parity without testing it.

A literal "100 hours" of browser time must not cause timer drift, currency overflow, event-log unbounded growth, storage-quota failure or completion rounding bugs. Use periodically compacted save deltas and user-readable error recovery. Autosave on a safe cadence and before page unload when possible, but do not rely solely on unload events. Offer export/import, backup slots, save version migration and a visible last successful save timestamp.

---

# 48. MULTIPLE DISTINCT PLAYSTYLES AND BALANCE PROFILES

A balanced victory can be achieved via different combinations of tools, products, logistics and environmental pressure. At minimum, test these strategy archetypes:

1. **Old-school logger:** manual chopping specialists evolve into automated harvesting, stump grubbing and soil exhaust with minimal data centers.
2. **Craftsman empire:** make profitable high-grade furniture and engineered wood before hiring machines to finance land transformation.
3. **Freight magnate:** build superior roads/rail networks and use highly optimized material flows to enable multi-region quarry and conversion.
4. **Water baron:** operate pumps, drainage and irrigated agriculture until water/fertility become limiting factors, then convert the landscape.
5. **Dirty industrialist:** run high-heat factories, mines, cement and thermal generation, accepting high maintenance and contamination.
6. **Efficient data-center operator:** build a massive but carefully cooled virtual-compute enterprise, profit from work and invest in deliberate land conversion.
7. **Hot data-center operator:** accept costly high-water and high-heat infrastructure with faster regional degradation but higher outage/repair risk.
8. **Mixed systems engineer:** build small synergistic industries and automate coverage with district-scale controllers.

Balance must not equate "more pollution" with "instant win." A player with clean power and good water efficiency can still reach the end by manual soil removal, drainage, heat routing or quarry work. Equally, a messy factory-heavy player can progress without purchasing an ultra-premium server campus. Cross-branch synergy should reward planning without producing one mandatory meta build. Track median completion time, dry-cells-per-hour, income/hour, travel workload, required repeated actions and time to each new mechanic under deterministic simulation agents and real playtest logs.

---

# 49. ADVANCED CONTENT AND UPGRADE IMPLEMENTATION RULES

The new upgrade registry starts at branch **25**, preserving original IDs `01-01` through `24-12`. The new IDs are `25-01` through `72-16` and must be stable, unique and serializable. Every purchase must have: `id`, `name`, `description`, `category`, `tier`, `prerequisites`, `moneyCost`, optional `researchCost`, optional `itemRequirements`, `effectType`, `effectParams`, `schemaVersion`, `visualOrAudioFeedback`, `trackedMetric`, `automatedTestId` and an implementation state. Effect types can be typed modifiers, capability unlocks, operating rules, machine unlocks, logistics policies, terrain tools, production recipes, visual state changes, job scheduling skills, power/cooling dispatch logic and special contract access. Permanent upgrades survive load and apply exactly once.

Use upgrade tags to enable cross-tree dependencies without writing thousands of if-statements. A purchase is atomic: verify prerequisites/resources, spend once, apply the effect once, record a single transaction, notify UI and save. Research cost and cash cost both matter for some late tiers. A visible locked entry has an explanation and a path to unlock; a purchased entry shows the effect's measurable delta, a before/after comparison and its actual simulation source. Respect a late-game discount cap, a speed multiplier cap, and physical constraints so the same acceleration cannot reach infinity from stacking upgrades. Unique effect test cases verify that *changing a particular registry entry changes an actual system variable or unlocks the named feature*.

This extension's 768 new upgrades are **in addition to**, not replacing, the existing 288. The entire authoring list is in Section 54. For economy prototyping, costs follow a clear escalation with branch-specific starting prices; tune them through gameplay. The branch order is an editorial grouping, not a requirement to finish all 16 nodes before purchasing from the next branch. Some advanced items are parallel sidegrades with unique tradeoffs rather than strictly linear improvements. Preserve tool variety throughout the long campaign.

---

# 50. IMPLEMENTATION ROADMAP: EXTRA PHASES BEYOND README M9

Carry the original `README.md` milestones M0–M9 to verified playability. Then add expansion milestones. A new subsystem may be developed earlier when it naturally supports an existing mechanic, but never mark an item complete solely because its UI exists.

| Expansion milestone | Required deliverable | Verification gate |
|---|---|---|
| E10 · Map-scale streaming | 8,192-m seeded world, 262,144 authoritative cells, district ownership and chunk loaders | Long-distance traversal, save/load and precise world count |
| E11 · Forest realism | More species, proper wood quality, stumps, roots, debris and terrain changes | Tree fall → haul → multiple processing recipes verified |
| E12 · 60 transport configurations | Route planner, terrain costs, physics carriers, fleet simulation | Cargo conservation over distant and local routes |
| E13 · Energy grid | Plants, wires, transformers, storage, outages and grid dashboard | Power-balance tests, brownout/rack response |
| E14 · Pollution and climate | Regional air/soil/water pollution, heat, groundwater, rain and recovery | Repeatable multi-season conversion and reversibility tests |
| E15 · Data-center enterprise | Actual rack construction, commissioning, virtual jobs, cooling and monitoring | Virtual workload P&L, energy/water accounting, heat throttling |
| E16 · Expanded manufacturing | 120+ products, quality, contracts, stock and byproducts | Mass, value and ledger invariants across recipe graphs |
| E17 · Upgrade Atlas | All 1,056 unique upgrades authored, implemented and validated | Registry count, dependency checks, effect unit/integration tests |
| E18 · Campaign systems | 100-hour progression, regional questlines, achievements and finish-line tools | Multiple strategic victory paths, measured pacing |
| E19 · Ship-level polish | Modern UI, save migration, graphics settings, sound, profiler and final cinematic | Browser acceptance suite, real performance reports, no false green checks |

**Live project documentation required:** Maintain `TASKS.md` (planned, working on, blocked), `COMPLETED.md` (only evidence-backed completions), `CONTINUE_WORKING.md` (next concrete action, exact blocker, failing test), `TEST_REPORT.md` (build and browser results), and `CHANGELOG.md` (behavior changes). Update these with each milestone and with substantial code changes. Never write a line like "all 1,056 upgrades implemented" unless every effect handler and its tests are present and green.

---

# 51. UPGRADE ECONOMY, RESEARCH ACCESS AND EFFECT CURVES

A simple, transparent balance generator may assign initial nominal prices for each branch: `cost(tier) = roundToFriendly(baseCost × 1.66^(tier−1))`, with early-tier costs reduced as necessary to keep the butter-knife phase lively and late-tier costs tuned against earnings. Cost alone does not determine access: material quality, relevant buildings, research tokens, world sector, tool proficiency, completed jobs and industrial grid capacity unlock major capability milestones. Never hide requirements behind unexplained random rolls. Costs in the catalog below are **prototype USD-style fictional in-game dollars**, not a claim of calibrated economics.

For direct numeric multipliers, communicate whether effects are additive or multiplicative, the active equipment scope and final capped value. Example: a saw "15% faster" must reduce its actual saw-cycle time or increase its calibrated stroke rate, not simply raise the money reward. A "capacity +10 t" upgrade increases a compatible transport's cargo limit and affects acceleration, fuel and physical visible load. A "drier soil" capability changes modeled moisture removal rate within a valid radius, with power and water constraints. A "higher cooling efficiency" update changes energy/water consumption and reliably improves server throttling or economics under the specified ambient conditions. Preserve meaningful differences between efficiency, power, quality, radius, reliability, automation and convenience.

The new catalog uses 48 branches × 16 upgrades = **768 new nodes**. Its branch range and counts are machine-checkable; treat unimplemented effects as backlog, not an excuse to substitute a generic percentage modifier. The following advanced catalogs supplement all existing branch material.

---

# 52. UPGRADE ATLAS UI REQUIREMENTS

Render the **72-branch atlas** as a zoomable, filterable industrial research map with category clusters: manual tools, mechanical tools, transport, cargo handling, sawmills, wood products, utilities, data-center hardware, data-center cooling/networking, climate, terrain and automation. Every node needs the exact actual ID, cost and prerequisites; a detailed description of a *specific implemented effect*; measured output before and after; a visual model or animation preview when it unlocks equipment; and a clear status indicator (locked, affordable, bought, working on, test failing, not yet implemented). Show the player's path through neighboring branches without forcing them to scroll through 1,056 cards at once.

Support searching "butter knife", "rack", "pump", "haul", "polution" [sic, spell-correct to pollution], "megawatt", "cooling", "stump" and other common player terms. Display actual bottleneck suggestions based on recently measured unmet energy demand, idle factory time, hauling distance or water shortages. Allow saveable upgrade wishlists and route-to-prerequisite navigation. The interface never spends money without a confirmation if a purchase is over a user-configurable threshold. All branch effects are applied via game logic, not CSS-only animations.

---

# 53. CATALOG LEGEND AND DEPENDENCY GUIDELINES

**New upgrade table schema:** `ID | Upgrade | Prototype price | Meaningful gameplay effect`. Most branch chains unlock approximately tier by tier; exceptional cross-branch requirements are suggested in the branch description. Early manual/transport branches begin at affordable prices. Industrial and data-center late branches unlock only when the player has functional prerequisite infrastructure; a $100 upgrade cannot spawn a free MW-scale facility merely because the player found the UI. Branch entries that grant a machine grant the *blueprint or purchase category*, not necessarily a magically free built asset. Upgrades that change statistics must point at a real observable system variable. All names and mechanics below are original fictional game content.

---

# 54. 768 NEW, INDIVIDUALLY NAMED AND MECHANICALLY DISTINCT UPGRADES

This section lists **48 new upgrade branches with exactly 16 nodes each** (768 new nodes), which supplement the original 288 items. Each entry has a stable ID, a tuning-only initial price and a concrete mechanic. Prices are illustrative, subject to playtesting; unlocks grant blueprints/abilities rather than magically spawning physical machines. Every listed effect must map to an implemented handler and a test before it is considered shipped.

## 54.25: Ultimate Butter Knife Engineering

**Entry price:** $30 (prototype)  ·  **Access:** Available after the first fire sale; completes the absurd starter-tool mastery path.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `25-01` | **Microtooth Edge** | $30 | Add a +9% tree-notch damage bonus specifically to plastic utensils. |
| `25-02` | **Grip Memory** | $45 | Retain the last chopping angle after a miss and shorten the next swing recovery by 12%. |
| `25-03` | **Flexible Spine** | $70 | Reduce knife durability loss when scraping hardwood by 20%. |
| `25-04` | **Double-Hand Butter Grip** | $110 | Unlock a deliberate two-hand knife stance that trades movement for 30% more notch force. |
| `25-05` | **Slip-Proof Handle** | $175 | Reduce dropped-tool events when stamina is below 15%. |
| `25-06` | **Perfectly Blunt Geometry** | $270 | Make near-miss swings remove a small amount of bark from the target rather than missing entirely. |
| `25-07` | **Cutline Chalk** | $415 | Display a physical notch guideline on trunks within knife reach. |
| `25-08` | **Serration Oscillator II** | $645 | Increase the powered knife's oscillation rate by 22% while drawing 10% more battery energy. |
| `25-09` | **Polymer Edge Conditioner** | $1,000 | Unlock a workbench task that restores knife sharpness with a consumable compound. |
| `25-10` | **Tapered Dinner Edge** | $1,550 | Add damage bonuses against root sprouts and thin branch junctions. |
| `25-11` | **Multilayer Picnic Alloy** | $2,400 | Increase the maximum trunk diameter the upgraded knife can affect by 0.25 m. |
| `25-12` | **Butter Knife Lunge** | $3,720 | Unlock a short precision thrust with distinct impact and stamina mechanics. |
| `25-13` | **Pocket Motor Mount** | $5,770 | Install a visible battery motor on the knife and enable sustained blade vibration. |
| `25-14` | **Heat-Treated Utensil** | $8,940 | Prevent knife performance loss from hot, dry desert work sites. |
| `25-15` | **Legendary Butter Resonance** | $13,860 | Allow charged precision swipes to cut two adjacent thin branches in a single stroke. |
| `25-16` | **Museum-Grade Knife** | $21,485 | Unlock a preserved first-tool display, legendary manual challenge route and measurable knife-only bonuses. |

## 54.26: Axes, Steel and Tool Longevity

**Entry price:** $150 (prototype)  ·  **Access:** Hand-tool workshop and wood-scrap stockpile.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `26-01` | **Edge Alignment Jig** | $150 | Unlock manual sharpening with a visibly aligned blade angle and lower post-repair wobble. |
| `26-02` | **Balanced Axe Head** | $230 | Reduce swing recovery on medium trunks by 11%. |
| `26-03` | **Hickory Handle Laminate** | $360 | Raise axe durability and reduce broken-handle probability during hard swings. |
| `26-04` | **Impact Ferrule** | $560 | Increase transmitted chop force while reducing stamina consumption by 8%. |
| `26-05` | **Branching Hatchet** | $865 | Unlock a lighter hatchet optimized for small limbs, with reduced reach and faster strokes. |
| `26-06` | **Two-Way Felling Axe** | $1,340 | Unlock directional notch cuts that shape the predicted fall corridor. |
| `26-07` | **Low-Friction Steel Coating** | $2,080 | Reduce tool heat and wear during rapid repetitive chops. |
| `26-08` | **Quick Change Heads** | $3,225 | Swap axe and splitter heads at a station without purchasing duplicate handles. |
| `26-09` | **Heavy Splitting Maul** | $4,995 | Unlock log splitting that yields standardized firewood sections with accurate mass. |
| `26-10` | **Resin-Resistant Edge** | $7,745 | Reduce sap buildup maintenance events on tropical tree species. |
| `26-11` | **Hand Saw Raker Teeth** | $12,005 | Increase handsaw extraction of long straight boards from a compatible log jig. |
| `26-12` | **Hardwood Microbevel** | $18,610 | Improve hand-tool grade preservation on dense premium logs. |
| `26-13` | **Toolbelt Scabbards** | $28,845 | Carry three compatible hand tools with a shorter swap animation. |
| `26-14` | **Workshop Gauge Station** | $44,710 | Display measured edge condition and estimate cuts until service. |
| `26-15` | **Master Carpenter's Edge** | $69,300 | Unlock precision crosscut bonuses on high-grade hardwood billets. |
| `26-16` | **Lifetime Tool Registry** | $107,415 | Track each tool's actual work, repairs, quality yield and earned specialization modifiers. |

## 54.27: Electric, Gas and Advanced Saws

**Entry price:** $450 (prototype)  ·  **Access:** Generator, sawbench and basic maintenance research.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `27-01` | **Starter Cordless Saw** | $450 | Unlock a rechargeable handheld saw with power-limited cuts and a visible blade. |
| `27-02` | **Chain Lubrication Pump** | $700 | Reduce chain wear and record real lubricant consumption. |
| `27-03` | **Bar Length 35 cm** | $1,080 | Unlock safe cuts of thicker medium trunks with the matching longer 3D bar. |
| `27-04` | **Battery Swap Harness** | $1,675 | Swap battery packs without returning to a workshop station. |
| `27-05` | **Carburetor Tuning Kit** | $2,595 | Improve gas saw power under variable weather at the cost of fuel use. |
| `27-06` | **Dual-Chain Guide** | $4,025 | Reduce cutting drift in long hardwood trunks. |
| `27-07` | **Automatic Chain Tensioner** | $6,240 | Extend maintenance intervals while preserving realistic sharpening needs. |
| `27-08` | **Low-Kickback Sprocket** | $9,670 | Reduce forced recovery time following an off-axis chainsaw hit. |
| `27-09` | **Heated Handle Grips** | $14,990 | Prevent cold-weather hand-tool slowing in highland provinces. |
| `27-10` | **Quiet Motor Housing** | $23,240 | Reduce saw noise radius and worker interruption, with slight extra weight. |
| `27-11` | **Crosscut Rail Jig** | $36,020 | Unlock repeatable accurate cuts of logs into standard transport lengths. |
| `27-12` | **Hybrid Fuel-Battery Saw** | $55,830 | Allow the saw to operate in electric or fuel mode, with separate consumable accounting. |
| `27-13` | **Professional Felling Head** | $86,535 | Unlock heavy tree notch geometry and faster kerf completion. |
| `27-14` | **High-Torque Gear Reduction** | $134,130 | Increase torque against giant old-growth wood with lower swing speed. |
| `27-15` | **Precision Milling Rail** | $207,900 | Allow field saw cuts to produce premium slab material at a slower rate. |
| `27-16` | **Self-Diagnosing Power Saw** | $322,245 | Report overheated motor, chain condition, expected output quality and required spare parts. |

## 54.28: Hydraulic Harvesting Heads

**Entry price:** $25,000 (prototype)  ·  **Access:** Heavy vehicle depot plus powered forestry equipment.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `28-01` | **Twin Roller Grasp** | $25,000 | Unlock mechanical grip that stabilizes long logs before cutting. |
| `28-02` | **Hydraulic Clamp Pressure** | $38,750 | Increase maximum harvestable trunk mass by 12% without changing vehicle lift rating. |
| `28-03` | **Automatic Diameter Gauge** | $60,065 | Measure incoming trunk diameter and choose eligible cutting routines. |
| `28-04` | **Felling Shear Attachment** | $93,095 | Unlock a heavy hydraulic cutter for medium trees with its own fuel and wear. |
| `28-05` | **Articulated Boom Reach** | $144,300 | Extend harvester working radius while increasing hydraulic energy cost. |
| `28-06` | **Floating Head Suspension** | $223,665 | Reduce breakage and product-grade loss over rocky ground. |
| `28-07` | **Branch Knife Array** | $346,680 | Delimb a felled trunk as it feeds through mechanical rollers. |
| `28-08` | **Segment Length Encoder** | $537,355 | Produce specified standard log lengths with less offcut waste. |
| `28-09` | **High-Volume Hydraulic Pump** | $832,900 | Increase cutting head duty cycle but require a larger powertrain. |
| `28-10` | **Dual Trunk Feed** | $1,290,995 | Process two small compatible stems through a twin-track head. |
| `28-11` | **Tree Alignment Camera** | $2,001,045 | Improve auto-felling placement within a surveyed safety sector. |
| `28-12` | **Quick-Coupled Processing Head** | $3,101,620 | Swap felling, delimbing and bucking attachments at a maintenance pad. |
| `28-13` | **Oversize Grapple Jaw** | $4,807,510 | Move large tropical trunks otherwise exceeding ordinary grapple span. |
| `28-14` | **Predictive Seal Monitoring** | $7,451,645 | Surface impending hydraulic leak maintenance before catastrophic downtime. |
| `28-15` | **Multi-Head Felling Rig** | $11,550,050 | Unlock a high-cost dual-machine forestry platform with measured throughput. |
| `28-16` | **Whole Forest Process Controller** | $17,902,575 | Coordinate head cut orders with unloading, route and downstream sawmill demand. |

## 54.29: Tree Physics, Falls and Breakage

**Entry price:** $900 (prototype)  ·  **Access:** Tree geometry scanning and logging safety training.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `29-01` | **Fall Direction Markers** | $900 | Display predicted ground impact corridor for the current tree and notch shape. |
| `29-02` | **Notch Depth Gauge** | $1,395 | Show progress along the actual generated cut surface rather than a generic health bar. |
| `29-03` | **Wood Stress Colorizer** | $2,160 | Reveal stress points on large trees during deliberate inspection mode. |
| `29-04` | **Wedge Placement** | $3,350 | Unlock a visible wedge item that can influence a nearly cut tree's fall direction. |
| `29-05` | **Hinge Preservation Technique** | $5,195 | Reduce premature snapped stems during precision felling. |
| `29-06` | **Crosswind Compensation** | $8,050 | Add dynamic wind offset to the predicted fall curve. |
| `29-07` | **Fall Obstacle Scan** | $12,480 | Warn when an identified loaded trailer or high-value machine lies in the landing zone. |
| `29-08` | **Branch Collision Budget** | $19,345 | Simulate near-player major branches as true colliders during trunk impact. |
| `29-09` | **Breakaway Crown Mechanics** | $29,985 | Permit top-heavy crowns to fracture into recoverable segments on violent landing. |
| `29-10` | **Stem Rolling Dynamics** | $46,475 | Improve physical rolling of irregular trunks based on slope and center of mass. |
| `29-11` | **Dynamic Rope Anchor Limits** | $72,040 | Show strain and failure load in tethered directional felling systems. |
| `29-12` | **Heavy Trunk Fracture Model** | $111,660 | Create physically consistent primary trunk splits with tracked product grades. |
| `29-13` | **Root Plate Tip Simulation** | $173,070 | Allow certain uprooted storm-damaged trees to tip with root geometry attached. |
| `29-14` | **Predictive Drop Lane Planner** | $268,260 | Search nearby terrain for a feasible unloading and safe fall corridor. |
| `29-15` | **Selective Timber Preservation** | $415,800 | Reduce premium wood grade damage from planned landing on prepared pads. |
| `29-16` | **Forest Damage Audit** | $644,495 | Summarize recoverable biomass, damaged logs and cleared obstacle geometry by felling event. |

## 54.30: Stumps, Roots and Ground Clearing

**Entry price:** $700 (prototype)  ·  **Access:** First stump and ground-work contract.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `30-01` | **Manual Grubbing Bar** | $700 | Allow the player to pry exposed shallow roots using timed physical strokes. |
| `30-02` | **Root Hook Chain** | $1,085 | Attach short roots to a tractor or winch for extraction. |
| `30-03` | **Handheld Stump Grinder** | $1,680 | Unlock a slow walk-behind grinder with visible cutter motion and fuel use. |
| `30-04` | **Stump Depth Scanner** | $2,605 | Measure remaining root mass that prevents foundation placement. |
| `30-05` | **Split Tooth Grinding Wheel** | $4,040 | Increase grinder throughput on dense roots by 18%. |
| `30-06` | **Towed Root Rake** | $6,265 | Gather shallow root debris into an actual transportable pile. |
| `30-07` | **Excavator Root Bucket** | $9,705 | Unlock a bucket attachment that extracts deep connected root clusters. |
| `30-08` | **Soil Return Hopper** | $15,045 | Separate removed soil from roots and allow backfilling without creating material. |
| `30-09` | **Hydraulic Stump Puller** | $23,320 | Increase maximum whole-stump extraction diameter. |
| `30-10` | **Deep Root Cutter** | $36,150 | Remove buried root networks under mature old-growth stumps. |
| `30-11` | **Root Debris Chipper** | $56,030 | Convert excavated roots to a low-grade biomass product. |
| `30-12` | **Automated Foundation Clearance** | $86,845 | Dispatch root-removal equipment to an explicitly planned construction footprint. |
| `30-13` | **Underground Root Survey** | $134,610 | Reveal unseen roots and avoid failed placements in surveyed districts. |
| `30-14` | **Continuous Grubbing Rig** | $208,645 | Clear an aligned strip of root mass with documented vehicle pathing. |
| `30-15` | **Precision Substrate Preparer** | $323,400 | Leave selected cells with a controllable exposed-substrate contribution. |
| `30-16` | **Regional Root Clearance Bureau** | $501,270 | Batch prioritize root jobs for remaining vegetation and stable-desert blockers. |

## 54.31: Canopy, Vines and Undergrowth

**Entry price:** $1,000 (prototype)  ·  **Access:** First cleared forest district.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `31-01` | **Manual Vine Hook** | $1,000 | Cut entangled vines that reduce movement and pulling force. |
| `31-02` | **Brush Clearing Blade** | $1,550 | Remove a physical cluster of understory shrubs in one sustained pass. |
| `31-03` | **Collectable Leaf Litter** | $2,405 | Generate baggable biomass from canopy cleanup rather than silent disappearance. |
| `31-04` | **Understory Species Scanner** | $3,725 | Identify dense brush types and their cutting resistances. |
| `31-05` | **Brush Rake Attachment** | $5,770 | Gather cut vines and shrub mass using a vehicle rake. |
| `31-06` | **Tracked Mulcher Head** | $8,945 | Unlock an actual rotating mulcher that processes bushes while moving. |
| `31-07` | **Canopy Shredder** | $13,865 | Turn detached crowns into sorted chips and contaminated fragments. |
| `31-08` | **Groundcover Sorting Hopper** | $21,495 | Separate clean biomass from stones before resale. |
| `31-09` | **Wet Brush Work Kit** | $33,315 | Reduce mulcher performance penalties in swamp-like soils. |
| `31-10` | **Low-Clearance Mast Cutter** | $51,640 | Open tall-vine passageways for a logging truck convoy. |
| `31-11` | **Dense Canopy Processor** | $80,040 | Process bulky fallen foliage near a road without blocking vehicle access. |
| `31-12` | **Leaf Compost Sorter** | $124,065 | Create compost byproduct for optional agriculture instead of burning all foliage. |
| `31-13` | **Brush-Harvest Automation** | $192,300 | Dispatch clearing crews to eligible planned strips with recorded biomass removal. |
| `31-14` | **Regional Shadow Analyzer** | $298,065 | Display canopy shade contributions to evaporation and vegetation growth. |
| `31-15` | **Ultra-Heavy Mulch Combine** | $462,000 | Unlock high-throughput commercial shrub clearing at significant operating cost. |
| `31-16` | **Canopy-to-Soil Auditor** | $716,105 | Report exactly how a clearing event changed vegetation, roots, runoff and moisture inputs. |

## 54.32: Field Surveying and Site Planning

**Entry price:** $1,500 (prototype)  ·  **Access:** Survey desk and map access.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `32-01` | **Handheld Laser Rangefinder** | $1,500 | Show true distance to a tagged tree, cargo pile or station. |
| `32-02` | **Topographic Stakes** | $2,325 | Place visible route-planning stakes that persist across sessions. |
| `32-03` | **Tree Volume Caliper** | $3,605 | Estimate trunk cubic volume and expected raw wood yield before felling. |
| `32-04` | **Slope Clinometer** | $5,585 | Show a road segment's grade and vehicle feasibility. |
| `32-05` | **Handheld Soil Probe** | $8,660 | Read the current cell moisture and fertility with game-defined units. |
| `32-06` | **Groundwater Locator** | $13,420 | Highlight candidate pumping cells through a distinct map layer. |
| `32-07` | **Survey Flags** | $20,800 | Mark high-value trees as eligible targets for assigned teams. |
| `32-08` | **Waypoint Network** | $32,240 | Save multi-stop transport routes on the tactical map. |
| `32-09` | **Drone Photo Geometry** | $49,975 | Generate actual 3D surveyed terrain previews without billboard scenery. |
| `32-10` | **Infrastructure Clearance Overlay** | $77,460 | Show collision and ownership conflicts for proposed buildings. |
| `32-11` | **Bridge Span Calculator** | $120,065 | Validate supported build spans and estimate material costs. |
| `32-12` | **Multi-Sector Lidar Grid** | $186,095 | Reveal terrain elevations and forest density across owned sectors. |
| `32-13` | **Resource Density Forecast** | $288,450 | Estimate available timber mass using actual seeded resource deposits. |
| `32-14` | **Land Value Heatmap** | $447,100 | Compare sector prices, access costs and revenue potential. |
| `32-15` | **Survey Dispatch AI** | $693,005 | Send a drone or technician to missing information points with physical travel time. |
| `32-16` | **Authoritative District Auditor** | $1,074,155 | Produce an exact summarized list of unconverted cells and status by district. |

## 54.33: Exertion, Strength and Ergonomics

**Entry price:** $220 (prototype)  ·  **Access:** Player manual-labor mastery.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `33-01` | **Comfortable Tool Grip** | $220 | Lower hand-tool stamina expenditure by 7%. |
| `33-02` | **Reinforced Work Boots** | $340 | Improve carrying traction over loose leaves and wet slopes. |
| `33-03` | **Quick Recovery Breathing** | $530 | Increase stamina regeneration during walking but not sprinting. |
| `33-04` | **Shoulder Load Balance** | $820 | Reduce manual handling penalties for awkward short logs. |
| `33-05` | **Double-Lift Harness** | $1,270 | Enable lifting two compatible small processed pieces together. |
| `33-06` | **Drag Posture Training** | $1,970 | Reduce stamina drain while pulling a rope under heavy load. |
| `33-07` | **Hill-Climber Conditioning** | $3,050 | Reduce uphill movement penalty under moderate loads. |
| `33-08` | **Manual Winch Endurance** | $4,730 | Extend continuous hand-crank duration before a recovery pause. |
| `33-09` | **Tool Weight Familiarity** | $7,330 | Lower swing stamina cost for frequently used equipment categories. |
| `33-10` | **Long-Shift Recovery** | $11,360 | Recover a fraction of fatigue while riding as passenger in vehicles. |
| `33-11` | **Precision Grip Strength** | $17,610 | Increase controllable manual cargo mass without changing maximum world physics mass. |
| `33-12` | **Slip Prevention Training** | $27,295 | Reduce load loss chance on muddy slopes when manually dragging. |
| `33-13` | **Industrial Safety Conditioning** | $42,305 | Reduce time lost after nonlethal fictional stumble events. |
| `33-14` | **Dual-Task Carrier** | $65,575 | Allow holding a small utility item while dragging a compatible load. |
| `33-15` | **Maximal Effort Stance** | $101,640 | Enable a slow high-force pull mode with explicit energy tradeoff. |
| `33-16` | **Veteran Yard Laborer** | $157,545 | Unlock a measurable efficient-handling bonus for the first tool/rope interaction of each shift. |

## 54.34: Rope, Grapple and Cable Engineering

**Entry price:** $1,200 (prototype)  ·  **Access:** Rope winch and field anchor permissions.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `34-01` | **Heavy Rope Fiber** | $1,200 | Raise safe tether load for a starter rope. |
| `34-02` | **Rapid Knot Coupler** | $1,860 | Cut rope attach animation duration while preserving tension checks. |
| `34-03` | **Multiple Anchor Posts** | $2,885 | Route a log around a rock using several placed 3D anchors. |
| `34-04` | **Tension Color Gauge** | $4,470 | Show cable tension with a physical indicator and HUD readout. |
| `34-05` | **Pulley Block Kit** | $6,925 | Add mechanical advantage that trades pulling distance for lower player force. |
| `34-06` | **Cable Fairlead** | $10,735 | Reduce friction loss where a tether wraps around a machine guide. |
| `34-07` | **Grapple Hook Launcher** | $16,640 | Throw a limited-range rope attachment onto valid trunks or cargo loops. |
| `34-08` | **Remote Anchor Release** | $25,795 | Unhook a rope safely from a nearby control station. |
| `34-09` | **Dual-Winch Steering** | $39,980 | Control two winches independently to orient a log through a narrow gap. |
| `34-10` | **Reusable Steel Cable** | $61,970 | Increase tether durability and make repair cost visible. |
| `34-11` | **Powered Cable Reeler** | $96,050 | Recover slack automatically using grid or generator energy. |
| `34-12` | **Cableway Support Tower** | $148,880 | Build 3D supports for an aerial log transport line. |
| `34-13` | **Load Sway Dampener** | $230,760 | Reduce swinging of suspended logs at the cost of cable speed. |
| `34-14` | **Automated Hook Handler** | $357,680 | Assign a worker to connect valid staged logs to a winch line. |
| `34-15` | **Long-Span Valley Cable** | $554,400 | Unlock crossing wider ravines after engineering the necessary anchor foundations. |
| `34-16` | **Cable Network Dispatch** | $859,325 | Automatically book loads and prevent conflicting cableway movements. |

## 54.35: Carts, Sleds and Primitive Vehicles

**Entry price:** $350 (prototype)  ·  **Access:** Hand-cart ownership.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `35-01` | **Reinforced Sled Frame** | $350 | Raise the number of logs safely carried on a manual sled. |
| `35-02` | **Greased Axle Bearings** | $540 | Reduce wheel cart rolling resistance under load. |
| `35-03` | **Wider Cart Track** | $840 | Improve stability of small 3D carts on irregular forest tracks. |
| `35-04` | **Front Cargo Gate** | $1,305 | Prevent billets escaping the cart while moving downhill. |
| `35-05` | **Animal-Free Tow Hitch** | $2,020 | Connect a hand cart to a compatible powered microtractor. |
| `35-06` | **Low-Pressure Tires** | $3,130 | Improve cart movement on wet forest floors. |
| `35-07` | **Sprung Log Dolly** | $4,855 | Unlock a long-log dolly that lifts one trunk end clear of the ground. |
| `35-08` | **Pallet Jack Conversion** | $7,525 | Allow the player to move standard pallets on suitable hard surfaces. |
| `35-09` | **Cargo Weight Scale** | $11,660 | Show the measured mass and load distribution of the cart. |
| `35-10` | **Twin Dolly Tandem** | $18,075 | Connect dollies to carry unusually long uncut trunks. |
| `35-11` | **Trail Repair Kit** | $28,015 | Restore wheel damage in the field using parts. |
| `35-12` | **Electric Assist Cart** | $43,425 | Add a rechargeable motor that lowers pulling effort and consumes stored energy. |
| `35-13` | **Auto-Braking Handcart** | $67,305 | Reduce runaway cart events on steep roads. |
| `35-14` | **Compact Articulated Hauler** | $104,325 | Unlock a small motorized load bed with a narrow turning radius. |
| `35-15` | **Quick-Stacking Tray** | $161,700 | Align delivered short wood pieces for one-click physical unload into a receiver. |
| `35-16` | **Primitive Fleet Dispatcher** | $250,635 | Assign assistant carts to dedicated yard loops with true cycle time. |

## 54.36: Winches, Skidders and Forest Extraction

**Entry price:** $7,000 (prototype)  ·  **Access:** Light logging depot and first powered winch.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `36-01` | **PTO Forestry Winch** | $7,000 | Unlock a tractor-compatible winch with a modeled spool and cable. |
| `36-02` | **Reinforced Snatch Block** | $10,850 | Increase extraction force from a compatible anchored pulley arrangement. |
| `36-03` | **Hydraulic Fairlead** | $16,820 | Reduce cable wear while winching around obstacles. |
| `36-04` | **Logging Arch Clearance** | $26,065 | Raise one heavy trunk end above rocks during extraction. |
| `36-05` | **Skid Plate Reinforcement** | $40,405 | Reduce damage when towing logs across harsh stone tracks. |
| `36-06` | **Tracked Skidder Chassis** | $62,625 | Unlock a high-traction 3D skidder for difficult forest roads. |
| `36-07` | **Grapple Skidder Upgrade** | $97,070 | Pick up one end of bundled logs with a controlled grapple. |
| `36-08` | **Wet-Terrain Traction** | $150,460 | Improve loaded skidder speed on saturated soils. |
| `36-09` | **Dual Spool Winch** | $233,210 | Pull two separate compatible logs with constrained combined force. |
| `36-10` | **Remote Winch Operator** | $361,480 | Give a worker a controllable remote winch task without spawning a free worker. |
| `36-11` | **Variable Pull Governor** | $560,295 | Allow force-limited extraction to protect premium logs from breakage. |
| `36-12` | **Hill Descent Brake** | $868,455 | Reduce runaway-load risks when extracting on steep slopes. |
| `36-13` | **Auto-Bundle Clamp** | $1,346,105 | Group several small trunks into one rigid loading assembly with preserved mass. |
| `36-14` | **Forestry Recovery Rig** | $2,086,460 | Recover a stuck skidder through a separate tow job. |
| `36-15` | **Heavy Ground Anchor** | $3,234,015 | Build durable fixed anchors for extracting very large trunks. |
| `36-16` | **Extraction Route Scheduler** | $5,012,720 | Pick feasible extraction corridors based on mud, grade, tow load and destination. |

## 54.37: Truck Chassis and Fleet Mechanics

**Entry price:** $24,000 (prototype)  ·  **Access:** First truck and maintained road route.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `37-01` | **Six-Wheel Work Truck** | $24,000 | Unlock a medium cargo chassis and its actual wheel geometry. |
| `37-02` | **Long Wheelbase Frame** | $37,200 | Fit longer logs while increasing turning radius. |
| `37-03` | **All-Terrain Tire Set** | $57,660 | Reduce slipping on forest roads at higher rolling resistance on pavement. |
| `37-04` | **Dual Rear Axles** | $89,375 | Raise legal fictional in-game payload and add wheel collision support. |
| `37-05` | **Cab-over Layout** | $138,530 | Improve yard maneuverability with a shorter hood and different cargo limits. |
| `37-06` | **Trailer Air Suspension** | $214,720 | Reduce impact damage to premium finished products. |
| `37-07` | **High-Torque Engine** | $332,815 | Improve hauling acceleration under heavy cargo at greater fuel cost. |
| `37-08` | **Cold-Start Package** | $515,860 | Lower starting delay in highland weather conditions. |
| `37-09` | **Diesel Tank Enlargement** | $799,585 | Extend operating range while adding vehicle weight. |
| `37-10` | **Retarder Brake** | $1,239,355 | Improve controlled downhill hauling and reduce brake maintenance. |
| `37-11` | **Hybrid Freight Powertrain** | $1,921,005 | Recover limited energy under braking and share power demand with an onboard battery. |
| `37-12` | **Heavy Haul Tractor Unit** | $2,977,555 | Unlock a reinforced tractor for oversize long-log trailers. |
| `37-13` | **Axle Load Sensor** | $4,615,210 | Display overweight warnings and actual load sharing. |
| `37-14` | **Truck Fleet Standardization** | $7,153,580 | Reduce maintenance part variety across a chosen chassis family. |
| `37-15` | **Road-Train Coupler** | $11,088,045 | Connect two compatible trailers only on suitable route classes. |
| `37-16` | **Fleet Reliability Center** | $17,186,470 | Predict service needs from distance, load, hills and engine idle time. |

## 54.38: Vehicle Attachments and Cargo Manipulation

**Entry price:** $16,000 (prototype)  ·  **Access:** Vehicle workshop and loader permission.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `38-01` | **Stake Bed Rails** | $16,000 | Add modeled side stakes to carry loose short logs securely. |
| `38-02` | **Side-Tip Hopper** | $24,800 | Allow a compatible truck to unload wood chips at a bulk receiver. |
| `38-03` | **Flatbed Strap System** | $38,440 | Bind pallets to a trailer with mass-preserving cargo constraints. |
| `38-04` | **Telescopic Loader Fork** | $59,580 | Increase forklift reach into warehouse racking at lower safe lift mass. |
| `38-05` | **Hydraulic Log Grapple** | $92,350 | Grip a single heavy trunk using a controllable boom. |
| `38-06` | **Rotator Grapple Head** | $143,145 | Turn an attached log 360 degrees before precise drop placement. |
| `38-07` | **Self-Loading Truck Crane** | $221,875 | Add a powered crane to a log truck, reducing cargo capacity. |
| `38-08` | **Bale Clamp Attachment** | $343,910 | Move packaged pulp, cardboard and bundles without crushing them. |
| `38-09` | **Pallet Side-Shift** | $533,055 | Align fork loads with tight receiver openings. |
| `38-10` | **Trailer Auto-Leveling Legs** | $826,240 | Stabilize parked trailers during crane unloading. |
| `38-11` | **Extended Reach Boom** | $1,280,670 | Lift cargo over neighboring trailers at higher tip risk. |
| `38-12` | **Bulk Chip Vacuum** | $1,985,035 | Transfer eligible lightweight chips into silos at a power cost. |
| `38-13` | **Container Twist-Locks** | $3,076,810 | Allow correctly sized shipping containers on an approved chassis. |
| `38-14` | **Cargo Inspection Camera** | $4,769,050 | Reveal physical load damage and grade before shipping. |
| `38-15` | **Multi-Tool Loader Plate** | $7,392,030 | Swap fork, grapple, bucket and clamp heads at a workshop. |
| `38-16` | **Autonomous Loading Bay** | $11,457,645 | Coordinate trucks, cranes, safety spacing and unloading receivers as real jobs. |

## 54.39: Rail, River and Mass Freight

**Entry price:** $90,000 (prototype)  ·  **Access:** Rail yard land permit or navigable river district.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `39-01` | **Narrow-Gauge Logging Track** | $90,000 | Lay 3D rails between two compatible yard nodes. |
| `39-02` | **Rail Tie Fabricator** | $139,500 | Manufacture track supports from processed timber. |
| `39-03` | **Switch Lever Junction** | $216,225 | Route a train through a selectable physical switch. |
| `39-04` | **Open Log Wagon** | $335,150 | Unlock a modeled railcar with valid strapped-log cargo. |
| `39-05` | **Covered Finished-Goods Wagon** | $519,480 | Protect high-grade furniture during long transport. |
| `39-06` | **Diesel Shunter** | $805,195 | Move small rakes of wagons between yards with fuel expense. |
| `39-07` | **Rail Loading Gantry** | $1,248,050 | Load wagons from an overhead crane with physical cargo handoff. |
| `39-08` | **River Loading Ramp** | $1,934,480 | Transfer logs from trucks to shallow-draft barges on designated river nodes. |
| `39-09` | **Self-Propelled Log Barge** | $2,998,445 | Navigate navigable stretches with current and draft constraints. |
| `39-10` | **Bridge Weight Certification** | $4,647,590 | Enable heavy rail crossings only after a structural upgrade and inspection. |
| `39-11` | **Dual-Track Freight Corridor** | $7,203,765 | Increase train capacity between busy regions without instant teleportation. |
| `39-12` | **Rail Yard Signal Controller** | $11,165,835 | Prevent two scheduled trains occupying the same block. |
| `39-13` | **Bulk Commodity Terminal** | $17,307,045 | Load chips, gravel, paper and coal analogs using dedicated hoppers. |
| `39-14` | **Freight Intermodal Depot** | $26,825,920 | Transfer containers between trucks, rail and barge using compatible cranes. |
| `39-15` | **Regional Logistics Railroad** | $41,580,170 | Coordinate multi-province services with queues and travel timetables. |
| `39-16` | **Heavy-Haul Continental Spine** | $64,449,265 | Unlock a world-scale freight route with realistic per-run tonnage and major upkeep. |

## 54.40: Autonomous Freight and Robotics

**Entry price:** $80,000 (prototype)  ·  **Access:** Fleet dispatcher plus sensor/power infrastructure.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `40-01` | **Basic Route Follower** | $80,000 | Allow one utility hauler to follow a saved waypoint loop. |
| `40-02` | **Obstacle Stop Sensor** | $124,000 | Pause autonomous vehicles when a solid collider blocks their lane. |
| `40-03` | **Docking Beacon** | $192,200 | Align a qualified vehicle precisely with a loading receiver. |
| `40-04` | **Cargo Identity Tags** | $297,910 | Track distinct physical loads as they change vehicles. |
| `40-05` | **Autonomous Battery Swap** | $461,760 | Route electric utility carts through a compatible battery bay. |
| `40-06` | **Task Priority Queue** | $715,730 | Rank freight jobs by urgency, profit and material shortage. |
| `40-07` | **Multi-Stop Dispatch** | $1,109,380 | Permit a single truck to service multiple depots without losing cargo trace. |
| `40-08` | **Dynamic Road Closure Response** | $1,719,540 | Recompute routes when terrain damage blocks a road. |
| `40-09` | **Automated Yard Forklift** | $2,665,285 | Move pallets between labeled areas with capacity constraints. |
| `40-10` | **Drone Dispatch Relay** | $4,131,190 | Synchronize field surveys and dispatch requests with a central planner. |
| `40-11` | **Predictive Return Hauling** | $6,403,345 | Assign eligible backhaul loads on otherwise empty return journeys. |
| `40-12` | **Congestion-Aware Scheduler** | $9,925,185 | Spread vehicle departures to reduce loading-bay queues. |
| `40-13` | **Fuel-Efficient Route Optimizer** | $15,384,040 | Compare route time and expected power/fuel costs. |
| `40-14` | **Robotic Log Sorting Line** | $23,845,260 | Recognize grade and size and direct logs to compatible lanes. |
| `40-15` | **District Fleet Coordinator** | $36,960,155 | Schedule dozens of abstracted distant vehicles with deterministic costs and results. |
| `40-16` | **World Transport Command** | $57,288,235 | Display full-fleet bottlenecks and auto-assign qualified haulers by district budget. |

## 54.41: Warehouses, Yards and Stock Control

**Entry price:** $12,000 (prototype)  ·  **Access:** Warehouse foundation technology.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `41-01` | **Ground-Level Log Lanes** | $12,000 | Define persistent marked log storage rows with measured tonnage. |
| `41-02` | **Covered Wood Shelter** | $18,600 | Reduce rain-related moisture gain for stored billets. |
| `41-03` | **Stack Height Markers** | $28,830 | Warn before physical lumber stacks exceed support limits. |
| `41-04` | **Dry Goods Shelves** | $44,685 | Unlock a compatible shelving receiver for packed manufactured goods. |
| `41-05` | **Item Lot Numbering** | $69,265 | Track source tree/recipe and quality of each stored product batch. |
| `41-06` | **Pallet Racking System** | $107,360 | Increase packed-goods space per floor tile with physical rack geometry. |
| `41-07` | **Moisture-Isolated Bay** | $166,405 | Hold kiln-dried boards under controlled humidity at a power cost. |
| `41-08` | **Barcode-Style Lot Scanner** | $257,930 | Inspect exact quantities and grades in a selected warehouse zone. |
| `41-09` | **FIFO Stock Routing** | $399,795 | Prioritize older compatible lots for production to avoid spoilage. |
| `41-10` | **Automated Stock Transfer** | $619,680 | Assign forklifts to fulfill real machine input orders from storage. |
| `41-11` | **Overflow Depot Planner** | $960,500 | Warn when contract demand will exceed active receiver capacity. |
| `41-12` | **Bulk Material Silo** | $1,488,780 | Store chips, pellets, ash and mineral aggregates in separated bulk bins. |
| `41-13` | **Cross-Dock Scheduling** | $2,307,605 | Route incoming inventory directly to a confirmed outgoing vehicle. |
| `41-14` | **Multi-Warehouse Allocation** | $3,576,790 | Reserve specific grades by contract across several depots. |
| `41-15` | **Climate-Controlled Product Vault** | $5,544,025 | Protect premium finished furniture and prevent weather damage. |
| `41-16` | **Global Inventory Auditor** | $8,593,235 | Reconcile input/output mass, physical stock and financial ledgers across districts. |

## 54.42: Conveyor Belts, Sorters and Factory Robotics

**Entry price:** $22,000 (prototype)  ·  **Access:** First powered factory belt.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `42-01` | **Basic Motorized Belt** | $22,000 | Unlock a 3D belt with moving rollers and power-dependent throughput. |
| `42-02` | **Angled Belt Transfer** | $34,100 | Connect machinery at different floor heights with realistic item flow. |
| `42-03` | **Log Roller Table** | $52,855 | Automatically orient round logs before entry into a sawmill. |
| `42-04` | **Belt Speed Controller** | $81,925 | Trade power draw against parcel rate and jam likelihood. |
| `42-05` | **Weight-Gated Diverter** | $126,985 | Route cargo based on its true mass classification. |
| `42-06` | **Vision Quality Sorter** | $196,825 | Inspect product grade and divert rejected boards to a reclaim line. |
| `42-07` | **Powered Lift Platform** | $305,080 | Transfer pallets vertically within a factory floor. |
| `42-08` | **Overhead Grabber Crane** | $472,875 | Move bulky stock across busy conveyors without hand carrying. |
| `42-09` | **Sensor-Based Jam Detector** | $732,955 | Pause upstream belts and report the exact stuck segment. |
| `42-10` | **Automatic Debris Clearing** | $1,136,080 | Dispatch a nearby worker or cleaning robot to clear jams. |
| `42-11` | **Articulated Palletizing Arm** | $1,760,920 | Stack boards into stable pallets with real completed-package output. |
| `42-12` | **Smart Buffer Hopper** | $2,729,425 | Reserve a controlled volume between upstream and downstream machines. |
| `42-13` | **Demand Pull Controller** | $4,230,610 | Start production only when a valid downstream order and stock capacity exist. |
| `42-14` | **Parallel Lane Balancer** | $6,557,445 | Route loads across multiple conveyor lines based on measured queue length. |
| `42-15` | **Recipe-Guided Sorting Matrix** | $10,164,040 | Select item destinations based on active manufacturing job recipes. |
| `42-16` | **Facility Robotics Orchestrator** | $15,754,265 | Coordinate conveyor, gantry, forklift and robot availability under one task scheduler. |

## 54.43: Sawmill Throughput and Grade Accuracy

**Entry price:** $35,000 (prototype)  ·  **Access:** Operational sawmill and graded logs.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `43-01` | **Band Saw Blade Upgrade** | $35,000 | Increase board throughput per processing cycle by 11%. |
| `43-02` | **Precision Log Centering** | $54,250 | Reduce off-center cuts and improve output board dimension accuracy. |
| `43-03` | **Automated Debarker** | $84,090 | Unlock bark removal as a timed input/output step yielding bark stock. |
| `43-04` | **Adjustable Blade Kerf** | $130,335 | Trade cutting time against sawdust waste and board recovery. |
| `43-05` | **Laser Cutline Grid** | $202,020 | Show expected board yield and grade from the current irregular log. |
| `43-06` | **Dual-Cant Saw Station** | $313,130 | Process a prepared cant into two synchronized board streams. |
| `43-07` | **Live Knot Scanning** | $485,355 | Detect modeled knots and select higher-grade board cuts where possible. |
| `43-08` | **Variable Feed Rollers** | $752,300 | Adjust feed rate based on timber species resistance and motor power. |
| `43-09` | **Saw Change Cartridge** | $1,166,060 | Replace a worn blade without lengthy facility teardown. |
| `43-10` | **On-Line Board Edger** | $1,807,395 | Trim rough edges into saleable standard boards and tracked offcuts. |
| `43-11` | **Waste Capture Cyclone** | $2,801,465 | Collect sawdust automatically instead of losing it as background effects. |
| `43-12` | **Log Rotation Saddle** | $4,342,270 | Rotate heavy trunks between programmed cuts with visible hydraulic motion. |
| `43-13` | **Multi-Blade Resaw** | $6,730,515 | Turn thick timbers into several boards during one high-power pass. |
| `43-14` | **Batch Optimization Controller** | $10,432,300 | Plan cuts across a group of tagged logs for reduced scrap. |
| `43-15` | **High-Capacity Lumber Mill** | $16,170,065 | Unlock a fully integrated dual-line sawmill with real inputs, staff and utility requirements. |
| `43-16` | **Milling Yield Auditor** | $25,063,605 | Compare theoretical volume, saleable outputs, byproducts and accounted losses per shift. |

## 54.44: Drying, Treatment and Premium Timber

**Entry price:** $28,000 (prototype)  ·  **Access:** Sawmill output and electricity.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `44-01` | **Air Drying Rack** | $28,000 | Place actual stacked board batches in an ambient-drying bay. |
| `44-02` | **Humidity Gauge** | $43,400 | Read wood moisture and estimate remaining drying time from weather. |
| `44-03` | **Solar Drying Shelter** | $67,270 | Accelerate drying in bright conditions without continuous heater fuel. |
| `44-04` | **Forced-Air Kiln Fan** | $104,270 | Increase kiln batch uniformity while consuming more electricity. |
| `44-05` | **Kiln Temperature PID** | $161,615 | Reduce energy waste when maintaining a target chamber temperature. |
| `44-06` | **Board Spacer Automator** | $250,505 | Stack boards with correct drying gaps using a powered jig. |
| `44-07` | **Moisture Sorting Gate** | $388,285 | Reject wet timber from a premium furniture recipe. |
| `44-08` | **Vacuum Drying Vessel** | $601,840 | Unlock faster high-cost drying for rare wood grades. |
| `44-09` | **Surface Planer** | $932,850 | Improve surface finish and dimensional consistency with measured shaved waste. |
| `44-10` | **Resin Sealer Station** | $1,445,915 | Produce weather-protected boards using a consumable coating input. |
| `44-11` | **Thermal Wood Treatment** | $2,241,170 | Unlock a fictional heat-process premium exterior grade at elevated power cost. |
| `44-12` | **Uniformity Sensor Array** | $3,473,815 | Reveal uneven kiln zones before batch grade loss. |
| `44-13` | **Automated Kiln Cart** | $5,384,415 | Move entire drying stacks without manual individual board transfer. |
| `44-14` | **Precision Finish Spray Booth** | $8,345,840 | Apply finish to eligible boards, with ventilation and pollution costs. |
| `44-15` | **Rarewood Conditioning Lab** | $12,936,055 | Stabilize selected unusual species for high-value recipes. |
| `44-16` | **Premium Lumber Certification** | $20,050,885 | Unlock high-grade customer contracts based on actually measured finished timber metrics. |

## 54.45: Engineered Lumber and Structural Goods

**Entry price:** $45,000 (prototype)  ·  **Access:** Dry boards, glue production and a woodworking plant.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `45-01` | **Plywood Veneer Lathe** | $45,000 | Convert suitable large logs into thin veneer sheets with tracked core scraps. |
| `45-02` | **Plywood Cross-Lay Press** | $69,750 | Glue alternating veneer layers into actual saleable panels. |
| `45-03` | **OSB Strand Chipper** | $108,115 | Convert selected wood stock into consistent strands for board manufacture. |
| `45-04` | **Resin Binder Mixer** | $167,575 | Consume adhesive stock to assemble engineered panels. |
| `45-05` | **Glulam Beam Jig** | $259,740 | Laminate graded long boards into heavy structural beams. |
| `45-06` | **Panel Edge Trimmer** | $402,595 | Improve standard panel size accuracy and yield premium-grade sheets. |
| `45-07` | **Finger-Joint Line** | $624,025 | Join short offcuts into longer construction members with measured adhesive use. |
| `45-08` | **Structural Beam Grader** | $967,240 | Reject flawed members and route them for nonstructural resale. |
| `45-09` | **Laminated Flooring Press** | $1,499,225 | Produce finished floorboard stacks in a multi-stage recipe. |
| `45-10` | **CNC Timber Frame Cutter** | $2,323,795 | Fabricate construction-frame components from specified dimensions. |
| `45-11` | **Pallet Block Press** | $3,601,880 | Convert wood scraps into stronger standardized pallet components. |
| `45-12` | **Acoustic Panel Perforator** | $5,582,915 | Produce high-margin decorative acoustic panels with precise patterns. |
| `45-13` | **Prefabricated Wall Cell** | $8,653,520 | Convert wood structures into larger kit bundles requiring multiple inputs. |
| `45-14` | **Modular Bridge Deck Fabricator** | $13,412,960 | Manufacture compatible timber deck sections for in-world bridge building. |
| `45-15` | **High-Strength Composite Line** | $20,790,085 | Unlock high-value hybrid engineered boards with substantial energy demand. |
| `45-16` | **Structural Goods Contract Office** | $32,224,635 | Accept engineered timber contracts with true recipe, quantity and quality checks. |

## 54.46: Furniture, Cabinetry and Retail Goods

**Entry price:** $32,000 (prototype)  ·  **Access:** Woodworking station and premium wood grade.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `46-01` | **Furniture Design Bench** | $32,000 | Unlock configurable chair and table production blueprints. |
| `46-02` | **Joinery Jig** | $49,600 | Reduce defective joints when manufacturing framed furniture. |
| `46-03` | **Drawer Slide Assembly** | $76,880 | Add working modeled drawer runners to a cabinet recipe. |
| `46-04` | **Router Table** | $119,165 | Produce rounded trim and decorative edges from prepared boards. |
| `46-05` | **Sanding Station** | $184,705 | Improve surface quality with consumable abrasive wear and dust generation. |
| `46-06` | **Upholstery Purchase Desk** | $286,290 | Source fictional fabric inputs for upholstered wood furniture. |
| `46-07` | **CNC Cabinet Mill** | $443,750 | Cut repeatable cabinet parts from sheet goods with actual machine cycle time. |
| `46-08` | **Low-Waste Furniture Nesting** | $687,815 | Reduce offcuts on compatible panel-cutting recipes. |
| `46-09` | **Spray Finish Cell** | $1,066,115 | Apply visible surface finish to completed furniture at an emissions cost. |
| `46-10` | **Premium Hardware Supplier** | $1,652,475 | Unlock higher-margin handles, hinges and door hardware inputs. |
| `46-11` | **Modular Shelf Assembly** | $2,561,340 | Build kits with fewer unique components but realistic assembly labor. |
| `46-12` | **Wooden Toy Workshop** | $3,970,075 | Produce colorful toy bundles from small high-quality offcuts. |
| `46-13` | **Designer Table Line** | $6,153,615 | Build a premium table using exact wood type and finish requirements. |
| `46-14` | **Retail Packaging Line** | $9,538,105 | Convert furniture to shippable boxed products with damage reduction. |
| `46-15` | **Regional Furniture Showroom** | $14,784,060 | Unlock customer demand and display actual finished product models. |
| `46-16` | **Luxury Interior Contracts** | $22,915,295 | Sell large complete room orders with stringent quality and delivery requirements. |

## 54.47: Pulp, Paper and Packaging

**Entry price:** $42,000 (prototype)  ·  **Access:** Wood chips, water and pulp mill utilities.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `47-01` | **Chip Washer** | $42,000 | Remove dirt from pulp feedstock while consuming measured water. |
| `47-02` | **Mechanical Pulp Refiner** | $65,100 | Convert chip stock into fibrous pulp with power usage. |
| `47-03` | **Pulp Consistency Sensor** | $100,905 | Detect too-dilute batches before paper-machine input. |
| `47-04` | **Paper Press Roll** | $156,405 | Increase sheet throughput by reducing retained moisture. |
| `47-05` | **Drying Cylinder Bank** | $242,425 | Evaporate water from wet paper with accountable thermal load. |
| `47-06` | **Basis-Weight Controller** | $375,760 | Produce more uniform paper roll weight for premium buyers. |
| `47-07` | **Sheet Slitter** | $582,425 | Cut large paper rolls into counted commercial paper stacks. |
| `47-08` | **Cardboard Corrugator** | $902,760 | Convert paper sheets into boxed corrugated stock. |
| `47-09` | **Recycled Pulp Blend** | $1,399,275 | Use designated scrap paper input to reduce virgin wood demand. |
| `47-10` | **Molded Pulp Press** | $2,168,875 | Manufacture protective inserts for furniture packaging. |
| `47-11` | **Box Folding Machine** | $3,361,755 | Create shipping cartons with actual throughput and adhesive requirements. |
| `47-12` | **Tissue Converting Line** | $5,210,725 | Process eligible rolls into wrapped consumer bundles. |
| `47-13` | **Specialty Art Paper** | $8,076,620 | Unlock high-grade sheets using fine pulp and additional drying steps. |
| `47-14` | **Industrial Sack Line** | $12,518,760 | Produce stronger bulk-material bags for pellet/ash sales. |
| `47-15` | **Packaging Contract Scheduler** | $19,404,080 | Reserve paper stock by packaging demand and buyer deadline. |
| `47-16` | **Paper Campus Heat Integration** | $30,076,325 | Reuse compatible waste heat in paper dryers, with temperature constraints and metering. |

## 54.48: Charcoal, Pellets and Biomass Streams

**Entry price:** $26,000 (prototype)  ·  **Access:** Wood waste yard and heat-processing license.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `48-01` | **Controlled Charcoal Kiln** | $26,000 | Turn qualifying logs into charcoal batches with measured shrinkage and smoke. |
| `48-02` | **Ash Separation Table** | $40,300 | Separate saleable ash from unburned impurities. |
| `48-03` | **Bark Pellet Grinder** | $62,465 | Reduce bark feedstock size before densification. |
| `48-04` | **Pellet Press Roller** | $96,820 | Compress dry biomass into bags with electricity demand. |
| `48-05` | **Low-Moisture Storage** | $150,070 | Prevent pellets from absorbing rain at an enclosed warehouse. |
| `48-06` | **Pyrolysis Gas Capture** | $232,610 | Reuse a fictional fraction of processing gas for burner heat. |
| `48-07` | **Charcoal Size Grader** | $360,550 | Separate fine and lump charcoal for different contract prices. |
| `48-08` | **Bulk Pellet Auger** | $558,850 | Load pellet stock into compatible hoppers without manual bags. |
| `48-09` | **Ash Brick Press** | $866,215 | Manufacture low-margin bricks from qualified ash and binder stock. |
| `48-10` | **Biomass Boiler Upgrade** | $1,342,635 | Improve usable heat from delivered solid biomass fuel. |
| `48-11` | **Heat Recovery Coil** | $2,081,085 | Reclaim a portion of kiln heat for adjacent wood drying. |
| `48-12` | **Smoke Filter Cassette** | $3,225,685 | Reduce particulate emission rate while consuming service filters. |
| `48-13` | **Pellet Quality Scanner** | $4,999,815 | Reject excessively damp or contaminated fuel batches. |
| `48-14` | **Mobile Charcoal Container** | $7,749,710 | Bring small scale conversion equipment to a remote logging depot. |
| `48-15` | **Industrial Biomass Terminal** | $12,012,050 | Dispatch large fuel shipments to power and thermal plants. |
| `48-16` | **Full Biomass Audit** | $18,618,675 | Reconcile original input mass, outputs, moisture loss, ash and energy conversion. |

## 54.49: Markets, Bidding and Contracts

**Entry price:** $7,000 (prototype)  ·  **Access:** First completed manufactured product.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `49-01` | **Daily Timber Index** | $7,000 | Show current fictional timber demand and historical local prices. |
| `49-02` | **Grade-A Buyer List** | $10,850 | Unlock premium buyers that reject substandard wood. |
| `49-03` | **Contract Deposit Desk** | $16,820 | Reserve buyer demand and charge a clear refundable or nonrefundable bond. |
| `49-04` | **Rush Order Board** | $26,065 | Offer timed high-premium deliveries with realistic logistics deadlines. |
| `49-05` | **Standing Firewood Account** | $40,405 | Sell consistent low-grade batches at a predictable but lower price. |
| `49-06` | **Manufactured Goods Broker** | $62,625 | Access buyers for furniture, plywood and finished products. |
| `49-07` | **Rail Freight Discount** | $97,070 | Reduce logistics cost for correctly consolidated bulk shipments. |
| `49-08` | **Multi-Stop Customer Route** | $150,460 | Fulfill several compatible orders with one delivery vehicle. |
| `49-09` | **Quality Claims Desk** | $233,210 | Handle defective product disputes using traceable lot records. |
| `49-10` | **Commodity Price Alerts** | $361,480 | Warn when current price falls outside player-selected bands. |
| `49-11` | **Regional Export Terminal** | $560,295 | Sell bulk product to distant fictional markets after freight handling. |
| `49-12` | **Contract Portfolio Manager** | $868,455 | Show expected margin, machine usage and inventory commitments. |
| `49-13` | **Long-Term Paper Buyer** | $1,346,105 | Unlock recurring packaging and paper supply contracts. |
| `49-14` | **Price Hedging Office** | $2,086,460 | Offer limited fictional fixed-price sales agreements that reduce volatility. |
| `49-15` | **Custom Industrial Commission** | $3,234,015 | Accept large mixed-component orders with partial deliveries tracked. |
| `49-16` | **Global Sales Consortium** | $5,012,720 | Combine buyer access across regions with dynamic demand caps and quality rules. |

## 54.50: Roads, Bridges and Civil Construction

**Entry price:** $13,000 (prototype)  ·  **Access:** Land access and basic gravel processing.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `50-01` | **Forest Trail Grader** | $13,000 | Flatten narrow access tracks with visible terrain geometry updates. |
| `50-02` | **Timber Culvert** | $20,150 | Build a small drainage crossing with capacity and water flow. |
| `50-03` | **Road Base Compactor** | $31,235 | Improve unpaved road stability after applying compatible aggregate. |
| `50-04` | **Gravel Road Surface** | $48,410 | Allow heavier wheeled transport through muddy sectors. |
| `50-05` | **Temporary Logging Bridge** | $75,035 | Bridge a narrow creek with structural load limits. |
| `50-06` | **Guardrail Fabricator** | $116,305 | Place modular rail sections on hazardous roadside edges. |
| `50-07` | **Concrete Mixer Station** | $180,275 | Convert cement/aggregate/water inputs into construction batches. |
| `50-08` | **Rebar Handling Rig** | $279,425 | Use steel stock for approved high-load foundation recipes. |
| `50-09` | **Heavy Bridge Foundation** | $433,110 | Support large trucks over deep terrain cuts with full material costs. |
| `50-10` | **Dust Suppression Truck** | $671,320 | Reduce road dust temporarily while consuming water. |
| `50-11` | **Road Drainage Channels** | $1,040,545 | Shift runoff from chosen roads to adjacent modeled cells. |
| `50-12` | **Asphalt Plant** | $1,612,845 | Manufacture fictional paving stock with thermal and pollution costs. |
| `50-13` | **Four-Lane Industrial Parkway** | $2,499,905 | Unlock high-capacity traffic routes with high land/maintenance costs. |
| `50-14` | **Automated Pothole Crew** | $3,874,855 | Repair road wear based on measured vehicle passes. |
| `50-15` | **Regional Overpass Builder** | $6,006,025 | Create grade-separated road/rail crossings with true geometry clearance. |
| `50-16` | **World Infrastructure Planner** | $9,309,340 | Compare route grades, travel times, freight efficiency and project cost before construction. |

## 54.51: Excavators and Ground Engineering

**Entry price:** $30,000 (prototype)  ·  **Access:** Excavation equipment depot.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `51-01` | **Compact Backhoe** | $30,000 | Unlock a small tracked excavator with modeled arm joints. |
| `51-02` | **Bucket Fill Indicator** | $46,500 | Display actual loose material mass held in the bucket. |
| `51-03` | **Rotating Upper Structure** | $72,075 | Control 360-degree excavator turret yaw independent of tracks. |
| `51-04` | **Hydraulic Stick Extension** | $111,715 | Increase digging reach with slower fully extended movement. |
| `51-05` | **Interchangeable Buckets** | $173,160 | Swap grading, trenching and rock-handling bucket types. |
| `51-06` | **Grade Control Laser** | $268,400 | Show target terrain elevation and over-dig warnings. |
| `51-07` | **Auto-Low Loader Ramp** | $416,015 | Allow excavators to mount a compatible transport trailer. |
| `51-08` | **Deeper Trench Package** | $644,825 | Extend excavatable depth while applying slope safety constraints. |
| `51-09` | **Articulated Dump Receiver** | $999,480 | Transfer excavated earth to a nearby aligned haul truck. |
| `51-10` | **Bucket Tooth Hardening** | $1,549,195 | Reduce wear when handling coarse rocky material. |
| `51-11` | **Hydraulic Hammer Head** | $2,401,255 | Break suitable surface boulders into actual mineral chunks. |
| `51-12` | **Precision Foundation Dig** | $3,721,945 | Prepare structure footings with measured material removal. |
| `51-13` | **Multi-Bucket Work Cycle** | $5,769,015 | Schedule repeatable dig/swing/dump actions over surveyed trenches. |
| `51-14` | **Slope Stability Monitor** | $8,941,975 | Warn of simulated collapse risk on extremely steep cut faces. |
| `51-15` | **Heavy Mining Shovel** | $13,860,055 | Unlock a larger stationary excavation system for quarries. |
| `51-16` | **District Earthworks Manager** | $21,483,090 | Dispatch digging and hauling crews to a surveyed terrain-deformation plan. |

## 54.52: Quarries, Mines and Mineral Processing

**Entry price:** $70,000 (prototype)  ·  **Access:** Quarry permission and heavy mining shovel.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `52-01` | **Rock Survey Drill** | $70,000 | Reveal mineral type and grade in a marked resource cell. |
| `52-02` | **Crushing Jaw Machine** | $108,500 | Convert large rock pieces to smaller aggregate with measured mass. |
| `52-03` | **Screening Deck** | $168,175 | Sort crushed minerals into distinct graded size products. |
| `52-04` | **Quarry Loader Bay** | $260,670 | Create a compatible pickup zone for tracked haul trucks. |
| `52-05` | **Ore Wash Trough** | $404,040 | Remove some impurities while consuming industrial water. |
| `52-06` | **Tailings Settling Pit** | $626,265 | Store mining waste and transfer a pollution penalty if not managed. |
| `52-07` | **Stone Cutting Bench** | $970,705 | Produce premium slab stone from compatible quarry blocks. |
| `52-08` | **Aggregate Conveyor Tunnel** | $1,504,595 | Move bulk mineral stock through a defined three-dimensional route. |
| `52-09` | **Ore Concentration Plant** | $2,332,125 | Upgrade saleable mineral quality at high energy and waste cost. |
| `52-10` | **Dust Extraction Hood** | $3,614,790 | Reduce crusher fouling and local particulate emissions with power use. |
| `52-11` | **Quarry Bench Planner** | $5,602,930 | Define safe stepwise excavation regions and expected rock output. |
| `52-12` | **Heavy Haul Mine Truck** | $8,684,540 | Unlock a specialized high-capacity vehicle restricted to suitable roads. |
| `52-13` | **Exposed Bedrock Converter** | $13,461,035 | Produce stable low-fertility ground when actual soil layers are stripped. |
| `52-14` | **Subsurface Pump Station** | $20,864,605 | Remove quarry groundwater that would otherwise refill excavation pits. |
| `52-15` | **Mine-to-Cement Integration** | $32,340,135 | Route compatible limestone material directly into cement production. |
| `52-16` | **Regional Extraction Authority** | $50,127,210 | Coordinate mineral work, tailings transport and terrain restoration/erosion flags across sites. |

## 54.53: Farming, Irrigation and Soil Exhaustion

**Entry price:** $22,000 (prototype)  ·  **Access:** Cleared plains and agriculture office.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `53-01` | **Field Plow Attachment** | $22,000 | Turn cleared ground into a physical cultivated soil state. |
| `53-02` | **Crop Seed Inventory** | $34,100 | Add crop planting as a recipe with seed, moisture and time requirements. |
| `53-03` | **Starter Irrigation Line** | $52,855 | Deliver pumped water to designated crops, drawing from the actual water system. |
| `53-04` | **Soil Fertility Gauge** | $81,925 | Show nutrient abstraction with a clear fictional game index. |
| `53-05` | **Tractor Sprayer Rig** | $126,985 | Apply stylized crop-treatment material with budgeted pollution effects. |
| `53-06` | **Large Crop Harvester** | $196,825 | Collect mature crops as a resource that can be sold or processed. |
| `53-07` | **Drainage Tile Trencher** | $305,080 | Install underground drainage segments in selected fields. |
| `53-08` | **Intensive Rotation Planner** | $472,875 | Schedule multiple growing cycles with predictable fertility depletion tradeoffs. |
| `53-09` | **Combine Grain Trailer** | $732,955 | Move harvested material to dryers and bulk buyer routes. |
| `53-10` | **Dryland Tillage Rig** | $1,136,080 | Cultivate low-water land while accelerating exposed soil erosion. |
| `53-11` | **High-Demand Monoculture Contract** | $1,760,920 | Unlock lucrative recurring crop orders with soil-stress penalties. |
| `53-12` | **Salinized Soil Simulator** | $2,729,425 | Introduce fictional irrigation-salt buildup and related cultivation consequences. |
| `53-13` | **Exhaustive Soil Sampling** | $4,230,610 | Measure nutrient, moisture, compaction and erosion state by field tile. |
| `53-14` | **Automated Irrigation Controller** | $6,557,445 | Adjust delivered water to selected field thresholds with metered cost. |
| `53-15` | **Industrial Crop Campus** | $10,164,040 | Operate large multiseason field plans with realistic machine staffing. |
| `53-16` | **Final Harvest Strip Program** | $15,754,265 | Convert abandoned depleted fields toward dry scrub using permitted earthwork actions. |

## 54.54: Grazing, Animal Logistics and Compaction

**Entry price:** $25,000 (prototype)  ·  **Access:** Farming office and pasture on cleared land.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `54-01` | **Pasture Fencing Kit** | $25,000 | Place real 3D paddock fences with gates and grass accessibility checks. |
| `54-02` | **Grazing Capacity Gauge** | $38,750 | Display living pasture carrying capacity rather than unlimited invisible livestock. |
| `54-03` | **Mobile Water Trough** | $60,065 | Provide metered pumped water to a herd sector. |
| `54-04` | **Feed Storage Barn** | $93,095 | Store feed material and assign recurring consumption jobs. |
| `54-05` | **Pasture Movement Schedule** | $144,300 | Move fictional animal groups between fenced areas with time and route limits. |
| `54-06` | **Grass Height Scanner** | $223,665 | Read forage coverage and track vegetation reduction after grazing. |
| `54-07` | **Heavy Herd Concentration** | $346,680 | Allow higher local grazing density at increased soil compaction cost. |
| `54-08` | **Tractor Feed Trailer** | $537,355 | Deliver stock to distant fenced yards using transport routes. |
| `54-09` | **Compaction Roller** | $832,900 | Apply controllable surface compaction on previously cleared land using machinery. |
| `54-10` | **Dry Pasture Shelter** | $1,290,995 | Reduce weather-driven herd downtime in harsh provinces. |
| `54-11` | **Seasonal Grazing Planner** | $2,001,045 | Forecast regrowth and exploitation of pasture across cycles. |
| `54-12` | **Overgrazing Warning Board** | $3,101,620 | Show zones close to permanently degraded dry scrub. |
| `54-13` | **Industrial Manure Separator** | $4,807,510 | Convert byproduct into fertilizer or waste with actual mass accounting. |
| `54-14` | **Abandoned Pasture Cleanup** | $7,451,645 | Remove fences, water points and remaining biomass for soil work. |
| `54-15` | **Multi-Herd Dispatcher** | $11,550,050 | Schedule pasture, water and feed deliveries across districts. |
| `54-16` | **Terrain Compaction Bureau** | $17,902,575 | Report soil density and root damage contributions per grazed land cell. |

## 54.55: Groundwater Pumping and Drains

**Entry price:** $38,000 (prototype)  ·  **Access:** Access to a water table and power network.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `55-01` | **Hand Pump Survey** | $38,000 | Estimate shallow groundwater availability in a marked cell. |
| `55-02` | **Small Electric Pump** | $58,900 | Extract metered water from a valid reservoir at bounded kW draw. |
| `55-03` | **Flexible Pipe Couplers** | $91,295 | Route fluid between compatible short pipe segments with clear connection feedback. |
| `55-04` | **Water Holding Tank** | $141,505 | Store water in a physical tank with maximum m³ capacity. |
| `55-05` | **Drainage Ditch Plow** | $219,335 | Create an open ditch that changes local cell runoff and terrain geometry. |
| `55-06` | **Pump Intake Filter** | $339,970 | Reduce clogging and capacity loss from suspended contaminants. |
| `55-07` | **High-Lift Transfer Pump** | $526,955 | Move water uphill with higher energy cost and reduced delivered flow. |
| `55-08` | **Deep Well Drill** | $816,780 | Access deeper fictional groundwater volumes on surveyed land. |
| `55-09` | **Smart Valve Network** | $1,266,010 | Split metered flow between authorized receiving facilities. |
| `55-10` | **Groundwater Drawdown Map** | $1,962,315 | Show current pumping cones and nearby refilling sources. |
| `55-11` | **Multi-Pump Manifold** | $3,041,590 | Coordinate extraction from several compatible groundwater cells. |
| `55-12` | **Wetland Dewatering Fleet** | $4,714,465 | Place mobile pumps and pipes across a currently wet district. |
| `55-13` | **Automatic Drainage Inspector** | $7,307,420 | Locate blocked pipes and issue real worker service tasks. |
| `55-14` | **District Groundwater Control** | $11,326,500 | Schedule water extraction against plant cooling, irrigation and biome targets. |
| `55-15` | **High-Volume Pumping Campus** | $17,556,075 | Unlock large-scale water transfer with high capital and power consumption. |
| `55-16` | **Aquifer Depletion Auditor** | $27,211,915 | Account for water removed, stored, transported, evaporated and returned across the district. |

## 54.56: Rivers, Reservoirs and Hydrology

**Entry price:** $65,000 (prototype)  ·  **Access:** River district ownership and surveyed channels.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `56-01` | **River Gauge Station** | $65,000 | Read modeled local flow rate, season and water level. |
| `56-02` | **Small Diversion Gate** | $100,750 | Redirect limited channel flow through a permitted branch. |
| `56-03` | **Canal Excavation Plan** | $156,165 | Construct a continuous open channel using actual excavation tasks. |
| `56-04` | **Reservoir Earth Berm** | $242,050 | Hold a bounded volume behind a visibly modeled compacted embankment. |
| `56-05` | **Spillway Controller** | $375,180 | Automatically release water when a reservoir crosses a safe game threshold. |
| `56-06` | **Floodplain Drainage Rack** | $581,530 | Clear debris blocking field channels after storms. |
| `56-07` | **Water Transfer Barge** | $901,370 | Ship water stock as a real cargo route between compatible terminals. |
| `56-08` | **Industrial Intake Tower** | $1,397,125 | Supply several facilities through a capacity-limited inlet. |
| `56-09` | **Sediment Trap Basin** | $2,165,545 | Collect silt during high-flow weather, requiring periodic disposal. |
| `56-10` | **Automated Flood Alert** | $3,356,595 | Predict localized fictional flood cells from known storm inputs. |
| `56-11` | **High-Head Water Transfer** | $5,202,720 | Move large water flows across district elevation differences at major kW cost. |
| `56-12` | **Wetland Drawdown Planner** | $8,064,215 | Estimate how drainage jobs alter adjacent wetland cell moisture over time. |
| `56-13` | **Riverbed Excavator** | $12,499,530 | Adjust shallow channel elevation while preserving finite terrain/material state. |
| `56-14` | **Cross-Province Pipe Trunk** | $19,374,275 | Connect large pumping networks with travel length and pressure loss. |
| `56-15` | **Regional Water Market** | $30,030,125 | Sell surplus industrial water stock without creating extra water in the simulation. |
| `56-16` | **Hydrology Master Console** | $46,546,695 | Inspect all water sources, sinks, flows, rainfall and refill blocking cell conversion. |

## 54.57: Soil Removal, Grading and Erosion

**Entry price:** $45,000 (prototype)  ·  **Access:** Heavy earthworks and environmental scanning.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `57-01` | **Topsoil Blade** | $45,000 | Scrape a thin soil layer into a recoverable dirt pile. |
| `57-02` | **Substrate Sampler** | $69,750 | Distinguish soil, clay, gravel, bedrock and constructed surface layers. |
| `57-03` | **Soil Stockpile License** | $108,115 | Place designated stockyards that track removed topsoil mass. |
| `57-04` | **Grader Auto-Level** | $167,575 | Smooth terrain inside a bounded, surveyed work zone. |
| `57-05` | **Rock Ripper Tooth** | $259,740 | Break compacted substrate before a blade pass. |
| `57-06` | **Dry Soil Scarfing** | $402,595 | Expose bare mineral soil with calculated erosion and dust susceptibility. |
| `57-07` | **Scraper Train** | $624,025 | Pull a high-capacity earth scraper behind a heavy tractor. |
| `57-08` | **Dust Containment Curtain** | $967,240 | Lower nearby operational dust at a material and maintenance cost. |
| `57-09` | **Open Pit Drain Package** | $1,499,225 | Prevent work sites flooding and invalidating removal jobs. |
| `57-10` | **Topsoil Export Terminal** | $2,323,795 | Sell, dispose or transport stripped fertile soil without duplication. |
| `57-11` | **Bulldozer Blade Profile** | $3,601,880 | Switch between shallow grading and high-volume material push modes. |
| `57-12` | **Slope Cut Stabilizer** | $5,582,915 | Permit deeper cuts where terrain stability would otherwise block operations. |
| `57-13` | **Regional Surface Stripper** | $8,653,520 | Run a bounded-width automated topsoil-removal machine along approved routes. |
| `57-14` | **Foundation Underlay Scanner** | $13,412,960 | Show current ground state beneath roads and factories. |
| `57-15` | **Desert Substrate Engineer** | $20,790,085 | Unlock a recipe to establish stable exposed mineral ground in qualifying dry cells. |
| `57-16` | **Substrate Completion Team** | $32,224,635 | Automatically target remaining eligible cells failing the desert ground-exposure test. |

## 54.58: Industrial Heat and Thermal Factories

**Entry price:** $100,000 (prototype)  ·  **Access:** Heavy grid connection and industrial district.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `58-01` | **Industrial Kiln Heat Meter** | $100,000 | Display delivered thermal load in game-defined kilowatts thermal. |
| `58-02` | **Lumber Kiln Heat Exchange** | $155,000 | Reuse compatible waste heat from a neighboring powered plant. |
| `58-03` | **Hot Exhaust Stack** | $240,250 | Move a heat-emission point above the facility with a visible plume. |
| `58-04` | **Thermal Pipe Loop** | $372,390 | Transfer compatible waste heat between connected industries with loss over distance. |
| `58-05` | **Smelter Furnace Module** | $577,200 | Unlock high-temperature metal processing with accountable fuel and pollution. |
| `58-06` | **Ceramic Processing Kiln** | $894,660 | Make premium ceramic building goods with new raw-material demand. |
| `58-07` | **Heat Island Surveyor** | $1,386,725 | Map local temperature influence of compact industrial buildings. |
| `58-08` | **Waste Heat Greenhouse** | $2,149,425 | Use part of thermal output for optional controlled-agriculture recipes. |
| `58-09` | **Heavy District Boiler** | $3,331,605 | Generate shared industrial heat by burning eligible game fuels. |
| `58-10` | **High-Temperature Storage** | $5,163,990 | Bank a limited amount of thermal energy to smooth machine demand. |
| `58-11` | **Exhaust Heat Reclaimer** | $8,004,180 | Improve thermal use efficiency and reduce wasted local heat. |
| `58-12` | **Cement Clinker Plant** | $12,406,485 | Manufacture fictional cement feedstock from mineral resources with high energy consumption. |
| `58-13` | **Modular Thermal Substation** | $19,230,050 | Dispatch heat between lines and warn of blocked demand. |
| `58-14` | **Regional Furnace Campus** | $29,806,575 | Operate synchronized high-heat industries with peak-load budgeting. |
| `58-15` | **Dry-Zone Thermal Controller** | $46,200,190 | Apply bounded heat effects to adjacent already-cleared cells with measurable power cost. |
| `58-16` | **Thermal Conservation Auditor** | $71,610,295 | Report fuel heat input, reused heat, ambient waste heat and cooling sinks by district. |

## 54.59: Generators, Turbines and Fuel Systems

**Entry price:** $70,000 (prototype)  ·  **Access:** Industrial grid research.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `59-01` | **Wood Gasifier Generator** | $70,000 | Produce modest electricity from eligible biomass fuel with an explicit waste stream. |
| `59-02` | **Diesel Generator Yard** | $108,500 | Run a switchable fuel generator with noise, emissions and service time. |
| `59-03` | **Solar Panel Field** | $168,175 | Install modeled solar arrays with daylight-dependent power output. |
| `59-04` | **Small Wind Turbine** | $260,670 | Generate variable power from regional wind rather than a constant multiplier. |
| `59-05` | **Transformer Grid Import** | $404,040 | Purchase power through a metered connection with capped capacity. |
| `59-06` | **Steam Engine Plant** | $626,265 | Produce grid power from a modeled boiler/steam engine abstraction. |
| `59-07` | **Fuel Delivery Tanker** | $970,705 | Move generator fuel over roads as owned cargo with delivery failures possible. |
| `59-08` | **Automated Generator Startup** | $1,504,595 | Start backup generation after measured reserve shortfall and a short delay. |
| `59-09` | **Combined Heat and Power** | $2,332,125 | Use some waste heat for compatible factory demand, changing total efficiency. |
| `59-10` | **High-Capacity Turbine** | $3,614,790 | Unlock utility-scale generator capacity with major upfront and fuel cost. |
| `59-11` | **Fuel Quality Monitor** | $5,602,930 | Adjust generator derating based on actual input fuel grade. |
| `59-12` | **Plant Cooling Assembly** | $8,684,540 | Require adequate water or air cooling for continuous high-output generation. |
| `59-13` | **Long-Range Power Intertie** | $13,461,035 | Connect distant district grids through rated transmission corridors. |
| `59-14` | **Peak Demand Governor** | $20,864,605 | Smooth generator startup timing and power ramp limitations. |
| `59-15` | **Fictional Experimental Megaplant** | $32,340,135 | Unlock a high-capital endgame energy source without real-world engineering instructions. |
| `59-16` | **Generation Portfolio Auditor** | $50,127,210 | Display actual efficiency, availability, emissions and cost per delivered MWh for every plant. |

## 54.60: Grid Switching, Losses and Dispatch

**Entry price:** $60,000 (prototype)  ·  **Access:** Two powered industrial facilities and transmission design.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `60-01` | **Utility Meter Array** | $60,000 | Measure production and consumption separately for each connected machine. |
| `60-02` | **Cable Ampacity Overlay** | $93,000 | Show which distribution lines are at overload risk. |
| `60-03` | **Local Fuse Panel** | $144,150 | Isolate a damaged circuit without shutting down an entire district. |
| `60-04` | **Transformer Tap Switch** | $223,435 | Reduce voltage-related derating in a remote industrial branch. |
| `60-05` | **Demand Priority Queue** | $346,320 | Keep critical pumps or servers supplied before noncritical mills during brownouts. |
| `60-06` | **Substation Remote Control** | $536,795 | Switch disconnected feeders from a central dispatch view. |
| `60-07` | **Peak Shaving Policy** | $832,035 | Temporarily slow low-priority factories to avoid grid import penalties. |
| `60-08` | **Power Factor Training** | $1,289,655 | Reduce an abstract distribution loss factor for compatible heavy motors. |
| `60-09` | **Redundant Ring Feeder** | $1,998,965 | Give essential facilities a secondary physical power route. |
| `60-10` | **Automated Load Forecast** | $3,098,395 | Estimate the next operating hour's expected power demand from queued tasks. |
| `60-11` | **Black-Start Procedure** | $4,802,510 | Restore a local grid from a qualified backup unit after full outage. |
| `60-12` | **Grid Storage Arbitration** | $7,443,890 | Route spare power to batteries before curtailing production. |
| `60-13` | **Multi-Region Energy Exchange** | $11,538,030 | Transfer rated power between adjacent district networks at modeled losses. |
| `60-14` | **Rolling Demand Budget** | $17,883,945 | Let operations managers cap peak MW draw by facility priority. |
| `60-15` | **Self-Healing Grid Logic** | $27,720,115 | Reclose safe isolated branches after fault diagnostics are cleared. |
| `60-16` | **World Grid Control Room** | $42,966,180 | Show accurate supply/demand balance, overloads, unmet load and historical outages for all regions. |

## 54.61: Batteries and Energy Buffering

**Entry price:** $45,000 (prototype)  ·  **Access:** Battery workshop and grid meter.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `61-01` | **Starter Lithium Bank** | $45,000 | Store a small amount of game electricity with charge/discharge rate limits. |
| `61-02` | **Battery Room Ventilation** | $69,750 | Reduce overheating during repeated high-rate charging. |
| `61-03` | **Inverter Capacity Module** | $108,115 | Increase maximum discharge kW without increasing stored kWh. |
| `61-04` | **Scheduled Battery Charging** | $167,575 | Buy cheaper off-peak game power when storage headroom exists. |
| `61-05` | **State-of-Charge Logger** | $259,740 | Record charge efficiency, losses and energy reserve history. |
| `61-06` | **Container Battery Rack** | $402,595 | Increase installed energy capacity with physical container modules. |
| `61-07` | **Temperature-Controlled Battery Bay** | $624,025 | Reduce charge-rate derating in high ambient heat. |
| `61-08` | **High-Current Busbar** | $967,240 | Increase safe instantaneous delivery to heavy machinery. |
| `61-09` | **Grid Frequency Fiction Controller** | $1,499,225 | Reduce abstract instability penalties during large factory startup. |
| `61-10` | **Battery Swap Service Cart** | $2,323,795 | Deliver charged packs to field tools and electric utility vehicles. |
| `61-11` | **Peak-Demand Reserve Rule** | $3,601,880 | Hold a minimum charge for emergency production instead of spending all energy immediately. |
| `61-12` | **Battery Health Monitor** | $5,582,915 | Track capacity fade and replacement part cost. |
| `61-13` | **Solar Storage Co-Dispatch** | $8,653,520 | Align daytime charging with measured solar production. |
| `61-14` | **UPS Rack Battery** | $13,412,960 | Provide short backup time to a compatible data-center rack aisle. |
| `61-15` | **Long-Duration Energy Vault** | $20,790,085 | Unlock expensive district-scale reserve with low efficiency but long runtime. |
| `61-16` | **Global Reserve Optimizer** | $32,224,635 | Coordinate discharge schedules across facilities while preserving energy conservation. |

## 54.62: Pollution, Emission Controls and Waste

**Entry price:** $90,000 (prototype)  ·  **Access:** First major polluting plant and environmental office.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `62-01` | **Smoke Stack Monitor** | $90,000 | Read particulate production at one operating exhaust source. |
| `62-02` | **Baghouse Filter Bank** | $139,500 | Reduce particles from a compatible plant with consumable filters and energy draw. |
| `62-03` | **Wastewater Settling Tanks** | $216,225 | Hold contaminated industrial water and process it over time. |
| `62-04` | **Oil Leak Containment** | $335,150 | Reduce soil pollution from equipment failures when a spill kit is present. |
| `62-05` | **Soot Scrubber Cartridge** | $519,480 | Lower soot emissions on eligible biomass burners until the cartridge is exhausted. |
| `62-06` | **Dust Road Sweeper** | $805,195 | Remove accumulated road dust while using fuel and maintenance resources. |
| `62-07` | **Hazardous Waste Pallet** | $1,248,050 | Store fictional classified contaminated scrap in secure finite inventory. |
| `62-08` | **Stack Heat Recovery Screen** | $1,934,480 | Visualize the tradeoff between recovered heat and ambient thermal emissions. |
| `62-09` | **Regional Emission Ledger** | $2,998,445 | Show measured emission sources and hour-by-hour environmental impact. |
| `62-10` | **Water Reclamation Membrane** | $4,647,590 | Recycle a bounded fraction of industrial process water with electricity cost. |
| `62-11` | **Storm Runoff Trap** | $7,203,765 | Capture some polluted runoff before it enters modeled downstream cells. |
| `62-12` | **Air Quality Alarm Network** | $11,165,835 | Notify about high local particulate burden and equipment derating risk. |
| `62-13` | **Treatment Sludge Processor** | $17,307,045 | Turn wastewater treatment byproduct into a transported disposal resource. |
| `62-14` | **Pollution Trading Simulator** | $26,825,920 | Offer fictional offset contracts that cost money but never erase actual cell contamination. |
| `62-15` | **Multi-Facility Emission Controller** | $41,580,170 | Coordinate pollution control devices across powered buildings with supply constraints. |
| `62-16` | **Pollution Dynamics Auditor** | $64,449,265 | Prove global pollution indices agree with measured local fields and applied treatment actions. |

## 54.63: Climate Sensors and Environmental Research

**Entry price:** $115,000 (prototype)  ·  **Access:** Climate monitoring tower and first stable-desert region.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `63-01` | **Weather Station Mast** | $115,000 | Measure wind, rainfall and thermal bands in the current district. |
| `63-02` | **Distributed Moisture Probes** | $178,250 | Report sampled soil conditions from surveyed 16-m cells. |
| `63-03` | **Groundwater Observation Wells** | $276,290 | Track recharge and extraction over time in accessible water-table nodes. |
| `63-04` | **Soil Compaction Penetrometer** | $428,245 | Detect physically compacted ground in grazed or trafficked zones. |
| `63-05` | **Pollution Sample Drone** | $663,780 | Survey air and dust conditions over a reachable flight route. |
| `63-06` | **Regional Heat Flux Map** | $1,028,860 | Display heat sources and bounded spread to neighboring cells. |
| `63-07` | **Rainfall Radar Simulator** | $1,594,735 | Forecast short-term fictional weather shifts based on seeded storm events. |
| `63-08` | **Vegetation Regrowth Camera** | $2,471,835 | Summarize shrub return and young-tree regeneration by sector. |
| `63-09` | **Substrate Spectrometer** | $3,831,345 | Distinguish dry mineral ground from painted cosmetic surface color. |
| `63-10` | **Scientific Workbench Queue** | $5,938,585 | Spend research points on climate-capability prototypes with material costs. |
| `63-11` | **Multi-Probe Climate Truck** | $9,204,810 | Survey several districts per journey with fuel and travel requirements. |
| `63-12` | **Time-Series Comparison Lab** | $14,267,455 | Compare actual climate conditions before and after machine operations. |
| `63-13` | **Failure Cause Analyzer** | $22,114,555 | Reveal the specific threshold preventing one cell from counting as desert. |
| `63-14` | **Ecological Forecast Sandbox** | $34,277,560 | Predict approximate consequences from proposed climate projects without altering the save. |
| `63-15` | **Regional Stability Timer Viewer** | $53,130,220 | Show desert stabilization time remaining for each selected cell. |
| `63-16` | **Planetary Desert Census** | $82,351,840 | Reconcile precisely 262,144 cells with live map, historical state and eventual victory audit. |

## 54.64: Data Center Campus Buildings and Racks

**Entry price:** $200,000 (prototype)  ·  **Access:** Land purchase, reliable power and telecom connection.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `64-01` | **Modular Server Shed** | $200,000 | Unlock a small modeled data-center building with explicit power and heat limits. |
| `64-02` | **Server Room Floor Grid** | $310,000 | Place racks only at compatible accessible 3D floor sockets. |
| `64-03` | **Rack Rail Mount** | $480,500 | Install a physical server rack with defined height units and weight constraints. |
| `64-04` | **Hot Aisle Containment** | $744,775 | Add real modeled doors and panels to reduce cooling leakage between aisles. |
| `64-05` | **Dual Power Distribution Unit** | $1,154,400 | Supply qualified racks through redundant metered lines. |
| `64-06` | **Prefabricated Rack Pod** | $1,789,320 | Deploy a purchased container with rack, power and cooling sockets. |
| `64-07` | **Raised Service Flooring** | $2,773,450 | Route ducts and cabling under removable physical floor sections. |
| `64-08` | **Security Entry Vestibule** | $4,298,845 | Add fictional access control and reduce site event interruptions. |
| `64-09` | **Overhead Cable Tray** | $6,663,210 | Route fiber/network/power cable visually with collision-aware placement. |
| `64-10` | **Server Hall Expansion Wing** | $10,327,975 | Extend the building footprint and available rack slots at material cost. |
| `64-11` | **Automated Rack Installation** | $16,008,365 | Assign construction workers to rack placement tasks using carried inventory. |
| `64-12` | **Multi-Hall Campus Road** | $24,812,965 | Join several server buildings with road, conduit and routing connections. |
| `64-13` | **Tiered Backup Architecture** | $38,460,095 | Add separate backup power pathways and uptime protection logic. |
| `64-14` | **Hyper-Dense Rack Gallery** | $59,613,150 | Unlock high-density rack frames that require advanced cooling and floor rating. |
| `64-15` | **Hyperscale Campus Blueprint** | $92,400,385 | Unlock a large multi-building server campus with staging and commissioning jobs. |
| `64-16` | **Data Center Construction Auditor** | $143,220,595 | Verify that every active rack has legal placement, power and adequate cooling before earning revenue. |

## 54.65: CPUs, GPUs and Compute Workloads

**Entry price:** $250,000 (prototype)  ·  **Access:** Operational rack and commissioned power/cooling.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `65-01` | **Basic CPU Server Blade** | $250,000 | Run low-density fictional compute contracts in a purchased rack unit. |
| `65-02` | **Dual-Socket Processor Board** | $387,500 | Increase CPU virtual compute capacity and power draw per blade. |
| `65-03` | **Job Queue Scheduler** | $600,625 | Queue actual virtual compute tasks by deadline and resource needs. |
| `65-04` | **Memory Expansion Module** | $930,970 | Unlock memory-heavy workloads with increased rack power. |
| `65-05` | **Entry GPU Accelerator** | $1,443,000 | Enable GPU-intensive rendering jobs at higher heat output. |
| `65-06` | **Workload Priority Slider** | $2,236,650 | Trade high-priority contract fulfillment against lower-value batch jobs. |
| `65-07` | **GPU Cluster Backplane** | $3,466,810 | Pool supported GPU blades for larger single jobs within a rack group. |
| `65-08` | **Idle Server Power Saving** | $5,373,555 | Lower power draw of racks without active virtual compute assignments. |
| `65-09` | **Batch Job Checkpointing** | $8,329,015 | Resume interrupted compatible workloads after safe shutdown. |
| `65-10` | **High-Bandwidth Memory Stack** | $12,909,970 | Increase efficiency for supported scientific simulation contracts. |
| `65-11` | **Heterogeneous Compute Router** | $20,010,455 | Assign CPU/GPU jobs to compatible hardware rather than wasting capacity. |
| `65-12` | **Rack Thermal Throttle Logic** | $31,016,205 | Slow computing automatically before temperature reaches damage threshold. |
| `65-13` | **Advanced AI Job Templates** | $48,075,120 | Unlock high-value fictional training/inference contracts without running real training jobs. |
| `65-14` | **Large Scientific Cluster** | $74,516,440 | Unlock complex simulation contract chains requiring coordinated compute jobs. |
| `65-15` | **Compute Efficiency Compiler** | $115,500,480 | Reduce virtual compute energy cost per job in selected supported workloads. |
| `65-16` | **Worldwide Compute Scheduler** | $179,025,740 | Distribute jobs across operating campuses based on energy, thermal reserve and deadline. |

## 54.66: Networking, Storage and Fiber Infrastructure

**Entry price:** $240,000 (prototype)  ·  **Access:** Server hall with active virtual compute jobs.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `66-01` | **Local Fiber Uplink** | $240,000 | Connect a campus to fictional clients with bounded network throughput. |
| `66-02` | **Rack Top-of-Row Switch** | $372,000 | Route virtual jobs between connected rack groups. |
| `66-03` | **Structured Cabling Panel** | $576,600 | Enable tidy cable routing with reduced maintenance fault chance. |
| `66-04` | **Network Redundancy Loop** | $893,730 | Keep some traffic flowing when one connection path fails. |
| `66-05` | **Storage Server Shelf** | $1,385,280 | Add finite archival space for data-storage contracts. |
| `66-06` | **High-Speed SSD Array** | $2,147,185 | Increase storage-job performance with measurable kW cost. |
| `66-07` | **Data Replica Policy** | $3,328,140 | Protect selected virtual stored data through capacity-limited duplication. |
| `66-08` | **Core Campus Router** | $5,158,615 | Link separate halls into one shared network domain. |
| `66-09` | **Long-Distance Fiber Trench** | $7,995,855 | Construct a modeled buried connection path between districts. |
| `66-10` | **Latency-Aware Job Placement** | $12,393,575 | Assign client contracts to qualifying campuses with sufficient network path. |
| `66-11` | **Optical Transceiver Bank** | $19,210,040 | Increase bandwidth of a compatible fiber link while consuming small extra power. |
| `66-12` | **Storage Tiering Controller** | $29,775,560 | Move virtual data between fast and archival tiers with transfer time. |
| `66-13` | **Multi-Campus Redundancy** | $46,152,115 | Keep eligible contracts active after one campus experiences downtime. |
| `66-14` | **Virtual Backup Vault** | $71,535,780 | Unlock premium backup clients with stricter storage integrity checks. |
| `66-15` | **Global Traffic Balancer** | $110,880,460 | Allocate workloads between regions based on bandwidth and heat/power budgets. |
| `66-16` | **Network Operations Center** | $171,864,710 | Show real traffic, overloaded links, completed jobs, uptime and failed transfers. |

## 54.67: Data Center Air and Liquid Cooling

**Entry price:** $300,000 (prototype)  ·  **Access:** Server room with thermal sensor and water or air source.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `67-01` | **Rack Fan Control** | $300,000 | Modulate physical fan RPM based on measured virtual heat load. |
| `67-02` | **Cold-Aisle Ventilation** | $465,000 | Install inlet ducting that lowers rack inlet temperature under valid airflow. |
| `67-03` | **Fan Filtration Cartridge** | $720,750 | Reduce dust fouling until replacement time and add pressure-related fan power. |
| `67-04` | **Variable-Speed CRAH Unit** | $1,117,165 | Unlock a modeled room air handler whose draw follows cooling demand. |
| `67-05` | **Heat Exchanger Module** | $1,731,600 | Transfer waste heat from one compatible cooling loop to another. |
| `67-06` | **Evaporative Cooling Tower** | $2,683,985 | Reduce cooling electricity at the price of metered water consumption. |
| `67-07` | **Waterless Dry Cooler** | $4,160,175 | Trade higher electricity draw for low water usage in suitable weather. |
| `67-08` | **Chilled-Water Plant** | $6,448,270 | Serve multiple buildings with a network of pumps and coolant pipes. |
| `67-09` | **Rear-Door Heat Exchanger** | $9,994,815 | Improve thermal removal for supported high-density racks. |
| `67-10` | **Direct-to-Chip Liquid Loop** | $15,491,965 | Allow dense server blades with lower heat resistance but higher service complexity. |
| `67-11` | **Leak Detection Grid** | $24,012,545 | Pause affected rack loops and alert maintenance after a modeled leak event. |
| `67-12` | **Immersion-Cooling Pod** | $37,219,450 | Unlock high-density fictional tank racks with distinct repair cycles. |
| `67-13` | **Thermal Storage Tank** | $57,690,145 | Bank a limited amount of cold thermal capacity during cheap-power periods. |
| `67-14` | **Dynamic Cooling Controller** | $89,419,725 | Optimize cooling pump/fan split within actual ambient and water constraints. |
| `67-15` | **Multi-Campus Cooling Dispatch** | $138,600,575 | Share eligible chilled capacity between connected nearby halls subject to line losses. |
| `67-16` | **Cooling Engineering Console** | $214,830,890 | Report inlet/outlet temperature, thermal load, electric draw, water draw, throttling and efficiency. |

## 54.68: Data Center Water and Heat Reuse

**Entry price:** $340,000 (prototype)  ·  **Access:** Liquid cooling and industrial water infrastructure.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `68-01` | **Cooling Water Meter** | $340,000 | Track exactly how much water the campus receives, consumes and returns. |
| `68-02` | **Cooling Loop Reservoir** | $527,000 | Provide finite buffer water for short pump interruptions. |
| `68-03` | **Makeup Water Valve** | $816,850 | Replace losses in an evaporative cooler from an authorized source. |
| `68-04` | **Closed-Loop Conversion** | $1,266,120 | Reduce water depletion while increasing cooling hardware cost and some electrical demand. |
| `68-05` | **Blowdown Treatment Tank** | $1,962,480 | Process contaminated cooling water before reuse or discharge. |
| `68-06` | **Dry Weather Cooler Switch** | $3,041,845 | Change cooling strategy when the water table or weather makes evaporation costly. |
| `68-07` | **Industrial Cooling Pipe Trunk** | $4,714,865 | Share water between several halls through capacity-limited modeled pipes. |
| `68-08` | **Thermal Water Quality Sensor** | $7,308,040 | Penalize fouling when intake quality is poor rather than ignoring contamination. |
| `68-09` | **Waste Heat Greenhouse Offtake** | $11,327,460 | Deliver useful heat to a connected cultivation building while output is demanded. |
| `68-10` | **Campus Heat-to-Kiln Link** | $17,557,560 | Reuse server waste heat in a low-temperature compatible drying process. |
| `68-11` | **Water Efficiency Dashboard** | $27,214,220 | Show stylized L/kWh, actual intake volume, losses and recycled flow. |
| `68-12` | **High-Density Cooling Water Plan** | $42,182,040 | Reserve scheduled supply to keep a selected critical rack group online. |
| `68-13` | **Regional Reclaimed Water Works** | $65,382,165 | Substitute qualified treated process water for some fresh intake. |
| `68-14` | **Seasonal Cooling Forecast** | $101,342,355 | Show upcoming water demand based on predicted weather and accepted workloads. |
| `68-15` | **Thermal District Loop** | $157,080,650 | Connect campus waste heat to multiple consumers subject to supply temperature and distance. |
| `68-16` | **Hydro-Thermal Operations Auditor** | $243,475,010 | Reconcile IT heat, cooling electricity, heat reuse, freshwater withdrawal and returned flow. |

## 54.69: Data Center Staff, SLAs and Reliability

**Entry price:** $280,000 (prototype)  ·  **Access:** At least one commissioned compute campus.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `69-01` | **24-Hour Technician Roster** | $280,000 | Hire and schedule real staff roles that reduce rack repair response time. |
| `69-02` | **SLA Monitoring Board** | $434,000 | Compare fulfilled virtual jobs and scheduled uptime obligations. |
| `69-03` | **Automatic Ticket Assignment** | $672,700 | Dispatch technicians to specific failing rack or cooling unit jobs. |
| `69-04` | **Spare Server Parts Store** | $1,042,685 | Keep finite replacement blades, fans and drives on-site. |
| `69-05` | **Preventive Rack Inspection** | $1,616,160 | Reduce unplanned failures in serviced rack aisles at a labor cost. |
| `69-06` | **Client Contract Tiering** | $2,505,050 | Offer distinct uptime/reliability premiums and failure penalties. |
| `69-07` | **Cold Standby Blade Pool** | $3,882,830 | Maintain unassigned hardware capable of taking over eligible interrupted jobs. |
| `69-08` | **Battery-Backed Network Core** | $6,018,385 | Keep network path alive through brief compatible power interruptions. |
| `69-09` | **Thermal Emergency Shutdown** | $9,328,495 | Safely halt racks before heat causes costly component damage. |
| `69-10` | **Multi-Campus Failover** | $14,459,170 | Shift qualified virtual workloads to live remote capacity after failure. |
| `69-11` | **Rack Replacement Robot** | $22,411,710 | Automate swapping accessible failed components from owned spare inventory. |
| `69-12` | **Advanced Uptime Forecast** | $34,738,150 | Estimate risk from recent power, cooling, age and maintenance data. |
| `69-13` | **Service Level Negotiator** | $53,844,135 | Choose contract payout versus outage penalty under fictional client markets. |
| `69-14` | **Predictive Failure AI** | $83,458,410 | Rank upcoming parts service based on observed wear and temperature cycles. |
| `69-15` | **Autonomous Campus Operations** | $129,360,535 | Automate commissioning checks, maintenance queues and load balancing under budgets. |
| `69-16` | **Global Reliability Office** | $200,508,830 | Audit achieved uptime, penalties, repair causes and system redundancy across all campuses. |

## 54.70: Megaproject Ecology and Regional Conversion

**Entry price:** $500,000 (prototype)  ·  **Access:** Multiple industrial districts and climatic research.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `70-01` | **Regional Soil Sampling Hub** | $500,000 | Create a district-wide queue of ground-substrate inspections. |
| `70-02` | **Industrial Drying Corridor** | $775,000 | Coordinate several powered surface dryers along an actual traversable road. |
| `70-03` | **Mine-Tailings Landfill** | $1,201,250 | Convert a designated mined lot into a stable mineral-waste substrate at disposal cost. |
| `70-04` | **Networked Drainage Pumps** | $1,861,940 | Schedule pumping based on selected zone groundwater thresholds. |
| `70-05` | **Multi-Site Thermal Project** | $2,886,005 | Route available industrial heat through a fixed pipeline network to qualifying cells. |
| `70-06` | **Overgrazing Coordination Office** | $4,473,305 | Plan large-scale pasture depletion without exceeding valid livestock/feed inventories. |
| `70-07` | **Large Substrate Remediation Rig** | $6,933,625 | Strip or degrade exposed soil on a narrow serviced work front. |
| `70-08` | **Coordinated Quarry Expansion** | $10,747,115 | Sequence excavation and earth transport over contiguous eligible regions. |
| `70-09` | **Regional Water Deficit Planner** | $16,658,030 | Forecast remaining drainage and water consumption needed per sector. |
| `70-10` | **Land Conversion Contractor** | $25,819,945 | Hire NPC contractors with limited equipment and work rates to carry out valid assigned jobs. |
| `70-11` | **Degradation Feedback Monitor** | $40,020,910 | Identify conditions where nearby rainfall or regrowth reverses partial conversion. |
| `70-12` | **Industrial Climate Research Array** | $62,032,415 | Unlock more accurate projected simulation rates for planned megaproject footprints. |
| `70-13` | **Multi-Province Conversion Network** | $96,150,240 | Dispatch physically possible jobs to several districts using transport infrastructure. |
| `70-14` | **High-Capacity Desert Stabilizer** | $149,032,875 | Operate a costly modeled final-stage dry-substrate treatment in a finite serviced radius. |
| `70-15` | **Full-Scale Terrain Operations Office** | $231,000,955 | Coordinate forestry, mining, agriculture, pumping and heat within budgeted district plans. |
| `70-16` | **Continental Conversion Master Plan** | $358,051,485 | Generate transparent sequenced work orders for all still-non-desert eligible regions. |

## 54.71: Inspections, Final-Cell Tools and Victory

**Entry price:** $1,200,000 (prototype)  ·  **Access:** 75% confirmed stable desert and last-green-cell scanner.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `71-01` | **Conversion Obstacle Lens** | $1,200,000 | Color cells by the exact predicate currently failing rather than only biome stage. |
| `71-02` | **Stabilization Countdown Map** | $1,860,000 | Display the remaining stable hold duration for almost-finished cells. |
| `71-03` | **Inaccessible Terrain Flag** | $2,883,000 | Warn when a queued cleanup job lacks an actual route. |
| `71-04` | **Localized Water Probe** | $4,468,650 | Allow a precision ground job to discover an isolated underground wet pocket. |
| `71-05` | **Compact Surface Dryer** | $6,926,410 | Unlock a small handheld powered device for final damp cells. |
| `71-06` | **Mobile Root-Shred Unit** | $10,735,930 | Remove remnant root biomass from unreachable narrow terrain. |
| `71-07` | **Precision Soil Extractor** | $16,640,695 | Extract the last small fertile substrate patch with measured carried mass. |
| `71-08` | **Aerial Moisture Survey** | $25,793,075 | Send a drone to expose missed wet cells with a bounded flight range. |
| `71-09` | **Steep-Cliff Cleanup Winch** | $39,979,265 | Position qualifying equipment at high-angle cells after a safe anchor is built. |
| `71-10` | **Final Riverbank Dredger** | $61,967,865 | Remove residual wet organic substrate from reachable shoreline parcels. |
| `71-11` | **Foundation Underlay Inspector** | $96,050,190 | Reveal failing ground beneath roads/buildings without changing eligibility. |
| `71-12` | **Automated Cell Repair Scheduler** | $148,877,795 | Generate work tickets for all outstanding threshold problems in selected owned zones. |
| `71-13` | **Full-Map Non-Desert Report** | $230,760,580 | Export precise cell IDs and their failing predicates, sorted by accessibility. |
| `71-14` | **Victory Audit Dry Run** | $357,678,900 | Run a nondestructive complete-map eligibility and stabilization check. |
| `71-15` | **Last-Meter Response Crew** | $554,402,295 | Send specialized owned cleanup units to individually diagnosed stubborn cells. |
| `71-16` | **Verified Desert Completion** | $859,323,560 | Unlock the real closing ceremony only when stableDesertCells equals the exact invariant denominator. |

## 54.72: Operations Analytics and Global Automation

**Entry price:** $900,000 (prototype)  ·  **Access:** Three industrial regions, central dispatch office and telemetry service.

| ID | Upgrade | Prototype cost | Required gameplay effect |
|---|---|---:|---|
| `72-01` | **Shift Profit Snapshot** | $900,000 | Show real revenue and expenses for a selected production shift. |
| `72-02` | **Idle Machine Reporter** | $1,395,000 | Identify machines waiting on stock, energy, labor or output clearance. |
| `72-03` | **Bottleneck Cause Map** | $2,162,250 | Mark exact facilities constraining region-level throughput. |
| `72-04` | **Fleet Delay Histogram** | $3,351,490 | Summarize travel, loading and unloading delays from actual job events. |
| `72-05` | **Energy Cost Allocator** | $5,194,805 | Attribute billed kWh and generator fuel to individual production recipes. |
| `72-06` | **Water Use Chargeback** | $8,051,950 | Assign exact pump/pipe usage to industries and campuses. |
| `72-07` | **Pollution Source Breakdown** | $12,480,520 | Rank modeled emitters contributing to the current environmental index. |
| `72-08` | **Automated Reorder Threshold** | $19,344,805 | Create purchase requests when consumable inventories reach user-set values. |
| `72-09` | **Profit-Aware Factory Scheduler** | $29,984,450 | Route jobs to lower-cost compatible machines with inventory locks. |
| `72-10` | **Contract Risk Predictor** | $46,475,900 | Compare committed deliveries with realistic route and factory capacity. |
| `72-11` | **Machine Wear Forecast** | $72,037,640 | Schedule maintenance based on accumulated usage and historical faults. |
| `72-12` | **Cross-Industry Material Exchange** | $111,658,345 | Send true byproducts from one production chain to another with transport cost. |
| `72-13` | **Environmental Work Order Router** | $173,070,435 | Assign reachable dryland work to equipment with valid capabilities and fuel supply. |
| `72-14` | **World Production Digital Twin** | $268,259,175 | Run an optional short-horizon non-authoritative forecast of bottlenecks and outcomes. |
| `72-15` | **Global Operating Budget** | $415,801,720 | Enforce adjustable spending, fuel, power and labor caps for all automated districts. |
| `72-16` | **Executive Operations Wall** | $644,492,670 | Display verified world progress, running profit, energy, pollution and alerts in one high-density control room. |


---

# 55. PRECISE COUPLED ENVIRONMENTAL MODEL AND VICTORY MATHEMATICS

The environmental simulation must be systemic rather than a sequence of cinematic tricks. A player destroying vegetation should alter local shade, stored biomass, soil exposure, runoff, habitat cover, and the probability of regrowth. An overdrawn aquifer should change water availability for soil, crops, coolant makeup, and neighboring wells. A hot power station or rack field should alter local thermal forcing and its operating cost. All relationships must be **gameplay-scale approximations**, fully documented as fictional rules and not presented as exact real-world climate science.

## 55.1 Authoritative cell state

A cell covers 16 m × 16 m. Store its fixed identity `(cx, cz)` and immutable generation seed, plus compact, serializable dynamic fields: `elevationM`, `slope`, `terrainClass`, `biomeStage`, `soilMoisture01`, `groundwater01`, `vegetationBiomass01`, `rootBiomass01`, `topsoil01`, `soilCompaction01`, `salinity01`, `heatLoad01`, `airPollution01`, `waterPollution01`, `groundCover01`, `surfaceWater01`, `erosion01`, `recoveryPotential01`, `stableDesertHours`, `infrastructureFlags`, `ownerDistrictId`, `surveyStatus`, `lastSimTick` and `version`. Use byte-quantized ranges where acceptable but maintain enough internal precision that completion cannot oscillate due to round-off.

The static world seed can determine rainfall baselines, topography, initial forest species and bedrock. Dynamic changes are saved as compact, versioned patches. Never regenerate a modified tree or soil cell because its chunk was unloaded. Every action records its specific affected cells and explains the net environmental delta in the local inspector.

## 55.2 Explicit environment update order

Run deterministic, fixed-step environmental ticks. Resolve in this order: (1) scheduled industrial emissions and heat; (2) withdrawals and transfers of water; (3) weather and precipitation inputs; (4) groundwater exchange and runoff; (5) soil moisture and salinity; (6) soil erosion and compaction; (7) vegetation decay, harvesting, resprouting and regrowth; (8) diffusion/advection of relevant pollution and heat; (9) biome classification; (10) desert-stability eligibility and progress accounting. Separate draw frame rate from simulation ticks. Use seeded, stream-specific pseudo-random values so the same replay and seed produce the same results even if chunks render in a different order.

Each industrial process has a source/sink vector: `electricityDemandKWh`, `fuelInputKg`, `waterWithdrawalM3`, `waterReturnedM3`, `usableHeatMJ`, `wasteHeatMJ`, `emissionsUnits`, `ashKg`, `soilDisturbanceUnits`, `cargoInputsKg`, and `cargoOutputsKg`. Attribute outputs to actual owners and cells; do not spawn pollution because the HUD looks too clean.

A simplified groundwater update can be implemented as `gwNext = clamp(gw + infiltration + lateralFlowIn - pumping - plantUptake - baseFlowOut, 0, 1)`, where flows have consistent simulation units. A cooling tower's evaporation is a separately measured sink and a water treatment station's output is not magically new water. If the stylized game allows atmospheric recapture, show its substantial energy requirement and receipt. Water pipes, heat exchangers, and storage tanks must obey capacity, transmission loss and resource accounting.

## 55.3 Desert definition and anti-exploit safeguards

A candidate cell is **desert** when its persistent biomass/ground cover, plant-available moisture and recovery potential are beneath configurable late-game thresholds, and its soil or surface condition is sufficiently arid/degraded. Desert status must be stable for a defined accelerated in-game duration (for example 72 simulated hours, tuned later). Distinguish a newly cleared cell from a properly dry, stable cell. A dirt lot, factory footprint, pool of wastewater, dormant burned patch, or yellow sand texture **does not** automatically qualify.

Define `eligibleCellCount` once for each campaign seed; default should be exactly 262,144. Prefer zero permanent exclusions. When unavoidable exclusions exist, record their immutable IDs at world creation and expose them in the victory audit. `stableDesertCellCount` is an integer from 0 to denominator. UI percentage is calculated from that integer; **never use a rounded displayed `100.00%` as an unlock condition**. Victory requires count equality and a complete verification pass with no unsaved chunk deltas. The completion ceremony must report the exact counts, audit timestamp, stable-condition duration, water status and residual vegetation. Buildings cannot conceal living vegetation beneath their collision mesh.

## 55.4 Regrowth, reversibility and permanent operational choices

Not all interventions are permanent. A region may slowly recover if its water table refills, topsoil remains and new precipitation arrives. This creates meaningful late-game stabilization decisions. Players can prevent rebound with soil grading, permanent drainage, vegetation suppression, controlled ground cover engineering or other fictional high-level mechanisms, each with machinery, costs, throughput and energy use. Regrowth should be understandable from displayed source fields; never spontaneously steal completion credit without a visible causal reason. For accessibility, let players choose a *relaxed climate* mode with slower recovery, but keep the selected rules visibly recorded on the save.

## 55.5 Last-cell repair tools

The World Atlas must offer a **Last Green Cells** tab from the first time progress passes 90%. Sort by why a cell fails: water above threshold, lingering roots, shade, topsoil, surface pond, vegetation, rain input, insufficient stable time, missing survey, inaccessible coastline, building footprint or an unresolved input error. Click a row to pin the exact 3D position, current readings, affected machinery, and recommended valid actions. Let the player create a work order for owned compatible equipment. Ensure the final hundred cells remain mechanically interesting but do not require searching every square meter by eye.

---

# 56. HIGH-FIDELITY DATA-CENTER INDUSTRY: FROM EMPTY LOT TO EXASCALE CAMPUS

Data centers must be one of the game's richest optional branches. The player should physically see the campus grow, and its revenue, power load, water demands, equipment temperature, outage risk, cooling response, emissions footprint, and eventual contribution to desertification must all emerge from simulation state.

## 56.1 Campus lifecycle and physical components

1. **Land survey:** Pick a parcel, measure grade, utility access, proximity to water and ambient heat, local flood/erosion risk, road reach, construction cost, and network latency to fictional demand regions.
2. **Site preparation:** Remove actual trees and root systems, grade terrain with machines, place drainage, footings, fencing and a construction entrance. Construction consumes stone, cement and steel from stockpiles.
3. **Power connection:** Place substations, switchgear, distribution frames, battery rooms, generators, modeled cables and capacity-rated transformers. A completed building with no utility connection earns nothing.
4. **Cooling:** Place real 3D roof chillers, fans, cooling towers, water-loop pipe segments, pumps, heat exchangers, filters, thermal stores and optional dry-cooling loops. Show water flow and return paths on overlay, not by painting random blue lines.
5. **Compute floor:** Install real 3D cabinets and rack units with rails, shelves, servers, network switches, storage trays, UPS units, cable paths, floor tiles and service aisles. Near-field models have actual depth, fans, LEDs and separate subparts; distance LODs retain geometry.
6. **Commissioning:** Perform power-on checks, cooling-flow tests, network reachability and initial system validation; reject an incomplete campus rather than flipping an `isReady` boolean based only on buying a building.
7. **Contracts:** Accept jobs with compute, storage, latency, availability, completion window, price, power and cooling needs. Customer requests must be game-native fictional workloads, not real commercial APIs.
8. **Operations:** Rack equipment develops heat and wear, cooling consumes water/power, jobs produce revenue only after service delivery, and staffing/maintenance prevent downtime.
9. **Expansion:** Add halls, stack campus utility networks, create workload priorities, bid for larger contracts, and measure regional environmental effects.
10. **Retirement/rebuild:** Recover reusable hardware, sell scrap, demolish obsolete buildings with physical stages, or rebuild for more efficient layouts.

## 56.2 Individual rack and server simulation

Model server archetypes such as economy CPU, high-density CPU, GPU training, inference cluster, storage appliance, networking node, control plane, monitoring node and backup unit. Each archetype has purchase cost, idle watts, peak watts, thermal output, compute points per simulated second, storage capacity, network throughput, failure curve, repair cost, useful life and replacement value. Racks have physical `U` capacity, total electrical rating, cooling capacity, airflow restriction and cabling reach. The player can drag devices into a slot in a 3D rack elevation viewer; the actual rack mesh fills or empties accordingly.

Compute job fulfillment should integrate delivered work over time: `completedWork += availableCapacity * effectiveUtilization * dt`. `availableCapacity` is reduced by thermal throttling, unmet power demand, equipment failure, network bottlenecks, insufficient storage, and maintenance. Never pay for a workload that was not completed. Contracts can pay bonuses for reliability and penalties for missed deadlines. Time-series charts must derive from observed ticks, and the P&L ledger must include electricity, cooling water, replacement parts, staff, construction, fuel and contract receipts.

## 56.3 Cooling trade-offs with visible consequences

Offer distinct systems: forced air, hot/cold aisle containment, rear-door liquid exchangers, direct-to-chip liquid, immersion tanks, evaporative towers, air-cooled chillers, hybrid ambient cooling, thermally coupled water loops and heat-recovery modules. They need different capital cost, water use, power use, ambient-temperature sensitivity, noise, footprint and maintenance risk. Hot climates should worsen specific cooling methods; a pump failure should visibly raise rack temperatures and throttle workloads until resolved. Better cooling need not always be the greenest or cheapest option; let players optimize to match their fictional industrial expansion goals.

Expose `IT Load (MW)`, `Cooling Load (MW)`, `Facility Draw (MW)`, `Power Available (MW)`, `Water Use (m³/h)`, `Peak Temperature (°C)`, `Average Utilization (%)`, `Rack Availability (%)`, `Revenue/h`, `Cost/h`, `Waste Heat (MJ/h)` and `Site Climate Effect` on a single drill-down campus dashboard. Clearly explain that power usage effectiveness is a game ratio and should update to reflect actual modeled facility power divided by IT power when IT load is nonzero.

## 56.4 Data-center scale and automation

Progress from a shipping-container lab to a single rack room, edge node, regional hall, multi-hall campus, factory-scale cluster and sprawling multi-campus network. The player should have valid reasons to run several different sites instead of one giant infinite-capacity cube: local grid limits, region-level water availability, delivery costs, throughput redundancy, heat concentration, terrain suitability and industrial-contract demand. Cross-campus orchestration can relocate simulated workloads, reserve backup power, schedule preventive maintenance and balance water consumption. The player can build an intentionally inefficient, heat-intensive campus for landscape transformation, but doing so has genuine operating costs and profit consequences.

## 56.5 Data-center visual and sound polish

Close-up rack doors open on hinges, fans spin, link lights react to simulated traffic, coolant circulates inside pipes, condensation or steam appears in compatible conditions, roof fans accelerate with thermal load, generators vibrate when active, and alarms identify actual faults. Provide a clean, readable server-room interface that is integrated into the 3D campus. Avoid 2D PNG server racks, empty halls disguised with textures, and decorative charts showing invented data.

---

# 57. IN-GAME MARKETS, CUSTOMER DEMAND, AND INDUSTRIAL PRODUCT DEPTH

Create a dynamic but deterministic economy in which raw burning is always an available quick-cash escape valve, while industrial processing usually produces better value at the cost of electricity, infrastructure, transport and time. Price changes should have legible causes: local supply, product grade, season, buyer demand, fulfillment reputation, region accessibility and contract urgency. Set guardrails against runaway exponential wealth and endless negative-cash spirals. A struggling player must still have a recoverable path with their owned starter tool, basic wood, available free fire pit and optional small advance contracts.

## 57.1 Eight overlapping product families

**Primitive products:** unprocessed logs, bundles of branches, firewood, kindling, ash, charcoal and rough posts. **Sawn timber:** boards, beams, studs, planks, veneer, trim, high-grade flooring, fencing and decking. **Engineered goods:** plywood, cross-laminated panels, particle board, MDF analogues, laminated beams, construction modules, roofing underlayment and prefabricated wall sections. **Household products:** furniture parts, shelves, cabinets, worktables, tool handles, doors, pallets and crates. **Paper and packaging:** pulp, roll paper, cardboard, cartons, notebook paper, insulation fiber, egg cartons, mailing boxes and shipping sleeves. **Biomass products:** pellets, briquettes, chips, char, processed heat feedstock and fertilizer byproduct where appropriate. **Mineral/ground products:** gravel, sand, crushed stone, ore concentrates, ceramics, concrete, glass and industrial aggregate. **Digital services:** batch compute, video rendering simulation, archival storage, scientific model runs, game streaming simulation, virtual private servers and AI training simulation. These are in-game fictional workloads with no real hosted compute required.

Implement at least 120 differentiated SKUs and grades with a typed recipe/quality registry, not 120 near-identical cosmetic entries. Recipes require exact physical or abstracted cargo quantities, processing time, machines, energy, waste streams and quality modifiers. Early crafting can physically animate every board. At factory scale, simulate aggregated tons in the background but visualize real pallets, conveyors and machine operations nearby; never violate inventory mass conservation.

## 57.2 Contracts and selling points

Selling is a physical logistics problem. Require goods to reach an owned shipping dock, customer depot, rail transfer point, market stall or the original burn pit before sale, unless a paid commercial pickup service physically collects them. A sale receipt records SKU, grade, delivered mass/count, gross price, transport, fees, operating costs and net contribution. Contract types should include spot order, time-critical order, quality premium, recurring replenishment, mixed load, regional shortage, construction project, server-compute rental, disposal project and rare collector commission. Maintain a history of accepted, delivered, failed and canceled orders. No double-counting deliveries that pass through multiple sell trigger volumes.

## 57.3 Sophisticated but comprehensible price signals

Present the player with a visible market board showing destination, order size, grade, unit price, payout, deadline, route cost estimate and requirements. Buyer supply-demand shifts should be bounded, explainable and seed-deterministic; no opaque random 90% price cuts. Let players pin a material and see whether it is better to burn, sell raw, refine locally or send to a premium buyer. Calculate profitability with actual measured throughput and remaining fuel, not just the product's sticker price.

---

# 58. WORLD BUILDING, MECHANICAL VISUALS, AND CONSTRUCTION INTERACTIONS

The player should **build** industrial infrastructure, not buy floating menu labels. Use snap-to-grid for building foundations, free rotation for terrain equipment, spline tools for roads/pipes/conveyors/rails, attachment sockets for racks, and zone paint for automated work. Construction has real stages: survey → clear → grade → deliver material → erect frame → attach utilities → commission → operate. Every stage is visible in the 3D world. Blueprints must preview whether an object will collide with a tree, stump, road, machine, river, another building or prohibited parcel. Use clear hologram-style preview meshes, not photo mockups.

### Destruction and debris

Offer tree saw cuts, precision cuts, sectional cuts, stump grinders, root pullers, brush cutters, controlled burning of *fictional* vegetation, bulldozer blades, front-loaders, forestry mulchers, excavator buckets, soil scrapers, quarry drills, hydraulic breakers, rock crushers, road ripper teeth, building dismantlers, automated felling heads, rope winch pulls, heavy rail-assisted hauling, and large mechanized land stripping. Destruction happens on simulated objects, not a background timer. An excavator needs to reach the terrain, move its bucket, extract a measured quantity and deposit actual cargo or valid tracked aggregate into the truck/stockpile. Make actions satisfying via geometry, animation, collision, impacts, material change, persistent scars and clean sound design.

### Character-and-machinery presentation

Tools must show real 3D meshes in the player's hands. The plastic knife should bend slightly under stress; axes strike and recover; chainsaws visibly rotate their chain; a winch drum winds cable; a log cart's axle and tires support cargo; bulldozers articulate tracks/blade; a harvester jaw clamps a trunk and feeds it across rollers; sawmill blades spin and boards exit at correctly timed intervals; a concrete mixer turns while consuming ingredients. Use scalable animation parameters linked to actual operational speed.

### Large-map skyline evolution

At 0–10% conversion, the horizon is forested and wet. At 10–30%, clearings and roads puncture the canopy. At 30–55%, forest gives way to plains, mills, farms and rail. At 55–75%, large pits, factories, utilities and industrial districts dominate. At 75–95%, exposed soil, dust, depleted streams and hot campuses take over. At 95–100%, the last rare green pockets stand out in a desert-wide industrial landscape. These are approximate art-direction thresholds, not shortcuts that directly set the climate state. Environment art should read cell data and nearby actual buildings; no fake full-map texture transitions.

---

# 59. REAL GAME UI, METERS, TIME SERIES, AND ACCOUNTABLE STATS

A player should be able to answer, within two clicks: *What is making me money? Where is my power going? What is polluting the world? Why is this region still green? What should I upgrade next? How much material is in transit? How close am I to finishing?* All numbers must be derived from actual event logs or authoritative simulation state.

## 59.1 Top-level gameplay HUD

Show money and net change/minute; currently held tool and durability; stamina/drag effort; selected object mass and destination; active objective and waypoint; local environmental stage; precise stable-desert progress; energy generation/consumption; pollution index with change direction; local groundwater indicator; current delivered wood/material inventory; and urgent maintenance/fleet alerts. Allow the player to resize, hide or rearrange noncritical widgets. Keep the physical 3D world visible; use intelligent compact panels rather than permanently covering half the screen.

## 59.2 Energy, pollution and regional health dashboards

**Energy:** generation MW, demand MW, transmission loss, battery charge MWh, reserve margin, curtailed loads, outages, energy cost/hour, fuel reserves, facilities ordered by power draw, and timelines for last 5 minutes/1 hour/day/season. **Pollution:** world index, emissions rate, airborne particle proxy, water contamination proxy, soil contamination proxy, pollution by source, regional trend, plume transport, deposition and visible environmental effect. **Water:** aquifer stored amount, region-level level, liters/ton of wood product, data-center water per job, pumping volume, evaporation, river inflow/outflow, storage, leaks and drought exposure. **Desertification:** live stage map, stable cells by province, candidate cells pending stabilization, recovering cells, top remaining obstacles and actual modeled conversion velocity per game day. Index values should include a legend, meaning and units or explicitly state that they are fictional normalized scores.

## 59.3 Detailed player and business statistics

Track lifetime trees felled by species/tool, total felled biomass, kilograms dragged by hand, rope-distance hauled, vehicle cargo-ton-kilometers, logs fed to fire, burned versus refined wood ratio, individual wood species processed, energy generated and spent, total grid failures, groundwater withdrawn, water recycled, emissions generated, workers hired, payroll paid, products built, customer contract success rate, dollars earned/spent, hourly net income, current net assets, vehicles owned, maintenance cost, industrial structures erected, environmental cells converted and lost to recovery, best single delivery, longest intact trunk moved, record factory throughput, highest rack occupancy, highest rack temperature, completed compute jobs, computer revenue, top earning industry and time played. Store both lifetime totals and bounded time buckets to avoid unbounded logs.

## 59.4 Graphs and drill-downs

Every graph must have valid axes, units, timestamp, aggregation interval, data-source tooltip and missing-data behavior. Support 15-minute, 1-hour, 1-day and entire-campaign views for currency, throughput, MW, pollution, groundwater, profit, tree removals, desert percentage and energy efficiency. Never display sample data in a real save without an explicit `Sample data` banner. Allow exporting save statistics to a locally generated CSV/JSON report without exposing private data or requiring a server account.

---

# 60. DETAILED 100-HOUR QUEST DESIGN AND CONTENT WITHOUT WAIT-WALLS

There should be *so much to do* that players choose their own route, but no single mandatory task should demand hours of noninteractive waiting. Introduce 8 major provinces with different obstacles, weather, tree species, product premiums, water reserves, utility constraints and land-conversion strategies. Example provinces: Verdant Basin (starting rainforest), Ironroot Highlands (huge hardwoods and roots), Whispering Wetlands (high water table), Longgrass Steppe (rapid agricultural access), Slateback Ridge (quarries/rock), Rainshadow Frontier (wind and drought dynamics), Riverbend Corridor (river transport/hydrology) and Central Crown (dense endgame jungle surrounding the industrial core). All are fictional and geographically connected inside the 8.192 km map.

## 60.1 Provincial arc template

Each province has at least one guided introduction, a physical labor challenge, a logistics bottleneck, an industrial productivity decision, an ecological constraint, two optional approaches to resolve it, a regional completion event, and a persistent visual transformation. A province must be completable without data centers and should never require all upgrade branches. Objectives should arise from live world state, including reachability, ownership, vehicle stock and environmental readings. Seeded contracts and side jobs may vary, but key arc content must have deterministic safe fallbacks.

## 60.2 Sample 25 long-form achievements / objectives

1. **Dinnerware Revolution:** Cut the first tree using only a plastic butter knife.
2. **The Long Drag:** Drag a fallen tree into the fire without using a vehicle.
3. **No More Free Labor:** Buy a proper hand tool with earnings from burned wood.
4. **First Board:** Mill a log and sell a correctly graded plank.
5. **A Better Use for Trees:** Sell a crafted item for at least four times its raw wood value.
6. **Fire-Fed Economy:** Reach a recorded quantity of real burn-pit deliveries.
7. **Rope Works:** Complete a drag using fixed anchors and rope tension.
8. **Load Bearing:** Move a full cart without losing a log on a hill.
9. **First Truck:** Complete a regional truck delivery.
10. **Cabin Fever:** Build a functioning staffed sawmill.
11. **Pallet Economy:** Fill a warehouse with manufactured goods.
12. **Road to Nowhere:** Connect a newly cleared province to the main industry road.
13. **Branch Manager:** Run three factories with their actual inputs automatically supplied.
14. **Powered Up:** Commission a generator and powered machine.
15. **Blackout Recovery:** Restore a halted factory after a genuine power failure.
16. **Timber Monopoly:** Fulfill a large mixed-product contract from owned stock.
17. **Under the Roots:** Remove roots and topsoil from a large abandoned grove.
18. **The Water Table:** Discover and correctly interpret an aquifer survey.
19. **First Dust Storm:** Witness a simulated dust event in a sufficiently degraded area.
20. **One Megawatt Club:** Reach 1 MW sustained active in-game industrial draw.
21. **First Data Job:** Deliver a compute contract from a physically commissioned server rack.
22. **Redundancy Pays:** Keep a data center online through a legitimate cooling failure.
23. **Halfway Gone:** Confirm 50% of all eligible cells as stable desert.
24. **Last Living Acre:** Identify and treat the last hundred failing cells with survey tools.
25. **The Last Jungle:** Trigger victory through an exact world-state audit.

These are examples within a target of 150+ achievements. Other achievements should reward alternative strategies and technical skill rather than demand repetitive quota inflation. Major rewards should grant a useful blueprint, special cosmetic geometry, operations office function, new job class or substantial one-time boost, with no mandatory pay-to-win or external purchase.

## 60.3 Pacing and telemetry validation

Create developer-only accelerated simulation profiles that model 1 hour, 20 hours and 100 hours without running the browser for the entire duration. Use these for save integrity, curve testing and endgame bugs, but do **not** treat automated time skips as evidence that a human campaign is fun or lasts 100 hours. Track playtest data: time to first tree fall, time to first cart, first mill, first heavy machine, first province unlocked, first stable-desert cell, first power plant, first server rack, 50%, 90%, 99% and exact 100%. Adjust unlocks and production profitability after evidence, with documented balance patches and reproducible seeds.

---

# 61. ACCESSIBILITY, SETTINGS, GAME FEEL AND PREMIUM-QUALITY PRESENTATION

The user experience should look and feel like a polished independent Steam-style industrial simulator, rendered in a browser. Use a coherent industrial UI palette that changes subtly with the world: early warm jungle greens and timber browns, midgame steel grays and brass highlights, and late-game dry amber, charcoal and electrical cyan. Preserve text contrast and clear button states. Animations should reinforce actual state transitions, not distract from them. Use meaningful icons, spatial inventory previews and sound. Avoid stock images or PNG-based world assets.

Provide remappable keyboard/mouse/gamepad controls, optional toggle-to-drag, hold versus toggle sprint, aim-assist for very small log targets, camera sensitivity, camera FOV, left-handed layout, motion reduction, photo sensitivity reduction, subtitle/caption support, volume buses, color-vision-safe overlays, scalable text, high-contrast diagrams and pause controls. If manual log dragging becomes physically difficult, offer a legitimate accessibility setting that simplifies grab physics without changing the economy or dishonestly completing haul jobs. Show feature availability rather than displaying disabled-but-clickable decorative settings.

Graphics presets should control 3D geometry LOD, shadows, antialiasing, vegetation density, draw distance, reflections, particles, terrain detail, ambient effects, quality of 3D leaves, weather volumetrics and maximum physics props, while preserving world interaction and simulation accuracy. Low quality mode may simplify geometry and distant animations but may not replace 3D trees with images or skip climate cells.

Ensure satisfying feedback throughout: accurate tool-hit sound, crack propagation, haptic-friendly movement cues, heavy logs resisting acceleration, winch cable tension, stacked boards clattering, conveyor rollers turning, industrial warning hum, GPU-fan intensity tracking measured temperature, heat shimmer where appropriate, soil crumbling after drought, clouds changing with weather, and a discernible skyline visible from long-range transport roads. Keep audio performances optional for players who prefer a quiet simulation.

---

# 62. PERFORMANCE ENGINEERING: LARGE WORLD, REAL GEOMETRY, NO IMPOSTORS

To make an 8.192 km world feasible on ordinary desktops, separate the authoritative simulation representation from rendered detail. **All world objects presented to the player are three-dimensional geometry**, but distant forests need not be actively simulated as tens of millions of independent rigid bodies. Generate trees deterministically by seed and cell characteristics, render them with GPU instancing of mesh-based species variants, and only create detailed rigid bodies when cut/loaded/approached. Tree tops must retain actual volume at distance through a smaller mesh LOD, not flip into flat billboards. The authoritative tree record persists even when its rendered mesh is unloaded.

Use grid or quadtree chunk streaming; per-chunk material/instance groups; physics activation radii; worker calculations for climate batches; batched collision meshes in untouched zones; CPU/GPU budgets; offscreen caching; short-lived particle pools; deferred mesh loading; async save snapshotting; virtualized management tables; and event-driven UI subscriptions. Target a smooth 60 FPS on a reasonable desktop at medium settings and an explicit 30 FPS minimum setting for lower-end hardware. Report measured machine conditions; the target is not a guarantee. The simulation should remain correct regardless of frame rate, browser tab visibility and graphics quality.

Set data-budget targets: a base cell record sized for 262,144 cells; sparse altered-cell patches; bounded fleet event histories; aggregated inventories for distant stockpiles; deterministic building instance generation; deduplicated GLB/geometry buffers; and bounded cached tiles. Evaluate IndexedDB storage and quota failures explicitly. Avoid storing every branch swing and particle forever. Save changes as compact state, plus separately retained lifetime counters and recent timeline rollups.

Define performance acceptance scenes: dense uncut starting forest; sawmill with 200 visually active log objects; truck depot with 20 moving vehicles; industrial plaza with 100 energy-consuming machines; a fully staffed rack hall; province-scale aerial view; 99.99% converted world; and save/export/import across the entire campaign. Test low/medium/high presets and measure frame time, heap footprint, climate tick latency, physics tick latency and worst-case autosave duration. When a scene is slow, instrument it and fix the actual bottleneck, not simply hide the objects or stop updating required systems.

---

# 63. ENGINEERING ARCHITECTURE, SAVE SAFETY AND DEVELOPMENT HYGIENE

Use a clean TypeScript-based website/game codebase, with a performant real 3D renderer such as Three.js/Babylon.js or a game framework that builds on WebGL/WebGPU, a carefully selected physics engine, and a declarative UI layer. The exact stack should follow the inspected repository's existing frameworks when viable, rather than force a gratuitous rewrite. Keep world generation, physics, inventory, economy, upgrade registry, power, water, pollution, data centers, save/load and presentation as independent modules that communicate through typed interfaces and explicit events.

## 63.1 Suggested source tree

```text
src/
  game/              bootstrap, scene, camera, input, gameplay state
  terrain/           chunks, seed generation, mesh creation, deformation
  environment/       climate cells, water, soil, vegetation, pollution
  forestry/          trees, felling, stumps, roots, wood grades
  physics/           collisions, grabs, hinges, ropes, cargo joints
  tools/             hand tools, power tools, wear, attachments
  transport/         vehicles, rail, routes, autopilots, unloading
  production/        item registry, recipes, factories, inventories
  economy/           ledger, contracts, markets, pricing
  utilities/         grid, fuel, water, heating, cooling
  datacenters/       racks, facilities, jobs, thermal systems
  upgrades/          registry, prerequisites, effects, purchase logic
  interface/         HUD, maps, atlas, telemetry, settings
  persistence/       IndexedDB save slots, migrations, export/import
  tests/             unit, integration, browser, replay, performance
assets/models/        original GLB assets and procedural recipes
scripts/              validation, balance reports, asset checks
TASKS.md
COMPLETED.md
CONTINUE_WORKING.md
TEST_REPORT.md
CHANGELOG.md
README.md
prompt.md
```

## 63.2 Invariants and testable interfaces

- Purchases are atomic and cannot charge twice after fast double-clicks.
- Cargo cannot be sold twice if it overlaps two sell volumes.
- Every generated tree has a persistent identity; a felled tree never reappears because of chunk streaming.
- A vehicle cannot move more real cargo than its measured maximum capacity.
- Every factory recipe explicitly accounts for inputs, outputs, byproducts and losses.
- Every power producer/consumer publishes its actual generation/demand to the central grid.
- Battery charge/discharge obeys state-of-charge, efficiency and inverter limits.
- Rack compute jobs never earn revenue without delivered work; unmet energy/cooling causes measured consequences.
- Climate cells cannot be silently deleted, skipped or treated as completed outside the campaign audit.
- Upgrade effects apply exactly once through versioned save migrations.
- Recoverable save failure does not silently erase progress; provide clear error, manual export and backup path.
- Settings affect actual rendering/input/game behavior, not only visual form elements.

## 63.3 Developer documentation and evidence

At the beginning of work, inspect repository scripts and implement a working build/test command. Maintain `TASKS.md` with statuses `todo`, `working on`, `built not tested`, `tested`, `blocked`, `needs work`; put a timestamp or commit reference next to significant status changes. `COMPLETED.md` is reserved for verified code/tests and exact evidence, while `CONTINUE_WORKING.md` names the next file/module/action and any unresolved issue. Update `TEST_REPORT.md` with commands run, environment, pass/fail, known limitations and tests not yet executed. Do not fabricate screenshots, playtest hours, performance numbers or game availability. The next developer or coding AI should be able to resume from these files alone.

---

# 64. EXPANSION ACCEPTANCE TESTS: REALITY CHECK FOR ALL CLAIMS

These tests extend the original README acceptance matrix. Assign stable IDs, implement repeatable test fixtures and retain explicit pass/fail outcomes. A compile-only check does **not** pass a physics, climate, graphical or gameplay test.

| ID | Required behavior and what the test must prove |
|---|---|
| X001 | A fresh save starts with $0, butter knife, jungle, and a usable fire-sale volume. |
| X002 | The butter knife removes real notch health only when a valid 3D strike hits a tree. |
| X003 | A felled tree falls as geometry, collides and remains absent from its stump location after reload. |
| X004 | A fallen log has measurable weight, friction and a valid grab/drag interaction. |
| X005 | Moving cargo across an actual sell zone produces exactly one sale receipt. |
| X006 | Fire processing, milling and crafting reward different net cash after costs. |
| X007 | Every cargo product has a 3D preview and a correctly assigned mass/volume. |
| X008 | Winch cable tension responds to mass, distance, friction and anchor selection. |
| X009 | A fully loaded truck loses acceleration and consumes more fuel under the configured model. |
| X010 | A disconnected road segment does not create a magical zero-cost delivery. |
| X011 | Loading 100 visual logs does not mean 100 extra sale receipts unless inventory contains them. |
| X012 | A factory stops with a clear reason when any required item is missing. |
| X013 | A factory throttles/stops under insufficient power and resumes after recovery. |
| X014 | Output stock cannot exceed hopper and warehouse capacity. |
| X015 | Multi-stage manufacturing conserves inventory within documented loss/byproduct rules. |
| X016 | 262,144 cells are created or deterministically represented at the full map size. |
| X017 | One cell spans 16 m × 16 m inside the 8,192 m square. |
| X018 | Initial map seed and modified-cell deltas persist through two reloads. |
| X019 | Crossing chunk boundaries does not reset destroyed trees or constructed machinery. |
| X020 | The map can be traversed end to end without falling through unloaded terrain. |
| X021 | Distant forests retain 3D mesh volume; no tree switches to a camera-facing image. |
| X022 | Desert classification depends on authoritative cell state, not painted terrain color. |
| X023 | A newly cleared green cell does not immediately pass the stable-desert check. |
| X024 | A long-term depleted cell can qualify after the required stability duration. |
| X025 | A formerly dry cell can recover when rules warrant it and visibly lose qualification. |
| X026 | Buildings and roads do not exempt living underlying cells from the win condition. |
| X027 | World progress uses exact integer counts, never rounded display percentages. |
| X028 | The game cannot win when just one required cell is still unqualified. |
| X029 | The final-cell survey identifies a legitimate failing cell and why it fails. |
| X030 | An authorized machine order can reach and treat the diagnosed final-cell region. |
| X031 | Valid completed world states pass a fresh full-map victory audit. |
| X032 | Generator fuel consumption correlates with actual measured output. |
| X033 | Transmission losses are nonnegative and accounted for in grid allocation. |
| X034 | Grid over-demand triggers predictable prioritization and brownouts. |
| X035 | Battery energy cannot be created by round trips through charge/discharge. |
| X036 | Power dashboards reconcile producer totals, losses, loads and storage. |
| X037 | Groundwater pumping changes the correct local cell/watershed stores. |
| X038 | Water withdrawn and water returned are visible separately on the ledger. |
| X039 | Local groundwater differences affect crops, growth and cooling as designed. |
| X040 | Pollution comes from actual machines/vehicles/processes and has traceable sources. |
| X041 | Turning off an emitter changes modeled regional pollution over time. |
| X042 | Pollution curves are shown with correct timestamps, units or normalized-score legend. |
| X043 | Data-center halls cannot commission without adequate power connection. |
| X044 | A cabinet physically fills with installed server models in the 3D viewer. |
| X045 | A rack respects RU, breaker and cooling capacity rules. |
| X046 | A real job requires compute delivered across simulation ticks. |
| X047 | A power cut slows/stops compute and reduces earned revenue appropriately. |
| X048 | Insufficient cooling increases temperature and can throttle workloads. |
| X049 | A liquid cooling loop consumes and accounts for water/pump electricity. |
| X050 | A UPS/battery bridge only lasts as long as simulated stored energy allows. |
| X051 | Campus heat and water use feed actual environment cells or shared regional pools. |
| X052 | PUE-like ratio is computed from modeled facility and IT electricity. |
| X053 | The same save and seed replay produces reproducible industry/environment output. |
| X054 | Purchasing an upgrade changes a tested capability or performance variable. |
| X055 | Every upgrade ID in 01-01..24-12 and 25-01..72-16 is unique. |
| X056 | The registry has exactly 1,056 authored entries once all original/extension nodes are loaded. |
| X057 | Locked upgrades explain prerequisites and cannot be purchased early. |
| X058 | A purchase double-click cannot charge twice or apply a stat twice. |
| X059 | Save/load never re-purchases or drops an already applied upgrade. |
| X060 | All claimed complete upgrade nodes have an effect handler and effect-specific test. |
| X061 | A large atlas can filter/search smoothly without rendering every item at once. |
| X062 | A player can pin a target upgrade and see the real prerequisite route. |
| X063 | A market contract checks physical or tracked delivery before payout. |
| X064 | Customer contract profit subtracts all recorded operating and delivery costs. |
| X065 | An autonomous hauler only accepts assignments it can physically/reliably complete. |
| X066 | Automation does not teleport cargo across disconnected inventory systems. |
| X067 | A 20-vehicle fleet visibly behaves correctly inside the active streamed region. |
| X068 | A distant fleet can aggregate travel without duplicating units when approached. |
| X069 | At least six distinctly viable desertification strategies pass guided test scenarios. |
| X070 | The game remains recoverable from a zero-cash late-game stall. |
| X071 | Export/import restores world, vehicles, contracts, upgrades and climate data. |
| X072 | Save version migration preserves canonical owned items and cell IDs. |
| X073 | IndexedDB/storage failure is reported, never silently treated as save success. |
| X074 | The HUD energy/pollution indicators reconcile with relevant detailed screens. |
| X075 | Every graph's data comes from real save state, never fabricated sample data. |
| X076 | A disconnected campus or idle factory is indicated in both 3D and management UI. |
| X077 | Reduced-motion mode suppresses optional camera shake and environmental jitter. |
| X078 | Input remapping persists and correctly changes gameplay controls. |
| X079 | Visual quality setting changes geometry detail without changing cell simulation. |
| X080 | Graphics, sound, input and saves work across supported desktop browsers. |
| X081 | The fully industrialized late-game scene is profiled with real timing evidence. |
| X082 | Time acceleration/replay does not overflow money, ticks or large lifetime counters. |
| X083 | A human tester can identify an unpowered machine within two useful clicks. |
| X084 | A human tester can locate the top source of pollution within two useful clicks. |
| X085 | Victory cinematic and statistics fire only on successful verified 100% audit. |
| X086 | New Game+ never destroys the original winning save without explicit confirmation. |
| X087 | Planned/built-untested/failed items are never marked completed in task documents. |
| X088 | A fresh repository checkout builds and launches using the documented commands. |
| X089 | Every required owned in-world machine has a visible 3D model and valid collider. |
| X090 | A 100-hour campaign simulation does not overflow saved counters or lose cell state. |

For every test, store fixture seed, environment, test category (unit/integration/browser/visual/performance/playtest), status, run date, and evidence file. Add smoke checks for every major milestone and do not waive a failing core loop because the rest of the UI looks polished.

---

# 65. FINAL BUILD INSTRUCTIONS — USE BOTH DOCUMENTS TO SHIP THE ACTUAL GAME

The coding AI must treat **`README.md` sections 1–30** and this companion **`prompt.md` sections 31–65** as a joint, binding build specification. Preserve all current working code and features in the repository, inspect the existing structure before modifications, and implement features rather than replacing the repository with a prompt-only website. Make a playable version quickly, then iterate to the complete scope in tested milestones.

**Order of execution:** inspect → establish repository baseline → create tasks and acceptance gates → implement real 3D world & movement → implement butter knife/tree-felling/dragging/fire sale → create wood refining & finance ledger → add hauling progression → establish factories & power → build climate cells/huge world → add mineral/agricultural/water options → commission data-center gameplay → load and verify all 1,056 upgrade effects → balance a real 100-hour progression → run automated and in-browser testing → polish all graphics, performance, sound and accessibility → verify the exact 100%-stable-desert ending.

**At every milestone, record:** what is implemented; what is working; what is built but untested; what failed; what needs work; actual test and build commands/results; save schema changes; gameplay screenshots or recorded footage *only if captured from a running build*; and the next concrete task. Keep `TASKS.md`, `COMPLETED.md`, `CONTINUE_WORKING.md`, `TEST_REPORT.md` and `CHANGELOG.md` accurate. Never label a demo as complete, never invent passing tests or measured 100-hour playtime, never silently skip the original butter-knife physical chore, and never use PNG billboards as in-world 3D trees or machinery.

**Definition of done:** a first-time player can start from $0 and a plastic butter knife; fell, drag and fire-sell real logs; build and refine into profitable material; choose their own industrial pathway; control transportation, factory throughput, electricity, water, pollution and data centers; observe authentic numbers and live terrain changes; progress through a vast finite world; and finally verify **every eligible cell** has become a stable desert, with an earned ending and persistent lifetime statistics. The project should be comprehensively tested, attractive, optimized, recoverable after save/load, and original. The approximately 100-hour duration is a **playtested balance goal**, not a false guarantee or excuse for artificial delay.

**Final instruction for the builder:** Keep implementing the next concrete verified task. If work is stopped by a genuine tooling or runtime blocker, state that blocker and leave the repository runnable with accurate completion records. A good-looking menu is not the game; functioning systems and player-visible consequences are the game.

---

# 66. V2 SUPERSEDING DIRECTIVE — MUCH BIGGER WORLD, LONGER CAMPAIGN, MANY INDEPENDENT VICTORY OBJECTIVES

> **This is the V2 expansion to the 30-section `README.md` and Sections 31–65 above.** It does not invalidate the physical beginning, original 1,056 upgrade registry, functional-first engineering discipline, real-3D model requirement, or the need for honest build verification. **Sections 66 onward supersede all previous numeric targets for map size, target campaign duration, upgrade count, and the win condition.** A coding AI must read and apply *all* sections in order, with later explicit overrides taking precedence. Do not build a 67.1 km² world, finish at 100 hours, or award victory for desert percentage alone.

## 66.1 Non-negotiable new targets

| Property | Earlier extension | Mandatory V2 target | Evidence required |
|---|---:|---:|---|
| Campaign terrain | 8,192 × 8,192 meters (67.1 km²) | **24,576 × 24,576 meters (603.98 km²)**, a 9× larger area | Actual traversable world bounds and correct coordinate transforms |
| Environmental grid | 512 × 512 at 16 m/cell | **1,536 × 1,536 at 16 m/cell = 2,359,296 authoritative cells** | Indexed save data, inspection UI, audit queries and coverage tests |
| Typical time to full victory | ~100 hours | **150–200 hours engaged, target median ~170 hours**; efficient 120–150 h, completionist 200–260 h | Tunable simulation/playtest model, not timers pasted into a UI |
| Total upgrades | Original 288 + extension 768 = 1,056 | **1,696 unique named, functional upgrades**: preserve 1,056 and add **640 entirely new** upgrades in 40 branches (73–112) | Upgrade registry validates IDs, dependencies, effects and tests |
| Endgame | 100% stable-desert cells | **Eight simultaneously satisfied planetary ruin objectives** plus a full-map audit | No prematurely won saves; tracked, individually auditable percentages |
| Simulation | Power, water, pollution, vegetation | **Multi-layer climate, hydrology, aerosol/pollutant, carbon, heat, soil, biodiversity and weather-event simulation** | Reproducible stats derived from active source/sink processes |
| Construction | Power stations, mills, data centers | **Mega-buildings, factories, industrial cities, urban districts, ports, airports, rail corridors, mines, steelworks and server cities** | Inspectable 3D construction states, supply chains, throughput and revenue |

**Important interpretation of 100%:** The HUD percentages are *completion-to-threshold* metrics, never the literal claim that the atmosphere contains 100% CO₂ or that actual real-world pollutant concentrations would physically reach 100%. This is an explicitly stylized fictional environmental-collapse sim, not a guide or scientific forecast. The final result must genuinely follow the game's own mass/energy rules and be shown through visible land changes.

## 66.2 AI coding-agent mission

Implement the actual site and game, not merely a revised design. Reconcile the existing repository first; do not bulldoze working systems. Build in tested vertical slices; refactor incompatible old systems; log `working on`, `built — untested`, `needs work`, `tested — passed`, and `completed` accurately. Maintain `tasks.md`, `completed.md`, `continue-working.md`, and `KNOWN_ISSUES.md`, and link every claimed milestone to implementation paths and repeatable tests. Do not mark a branch complete when its only implementation is a menu entry or a hardcoded stat increment. Be transparent if execution is interrupted.

# 67. THE 170-HOUR CAMPAIGN — PROGRESSION WITHOUT EMPTY WAITING

The target is **more than 100 hours of meaningful engaged gameplay** to earn every mandatory global completion medal in one standard campaign. The total must result from tool mastery, manual work, production-chain decisions, regional travel, network planning, tuning, catastrophes, and late-game optimization. The player should never need to leave a browser tab idle for a mandatory real-world countdown. Player skill, strategy and optional assistance can change the total substantially; do not label hours as guaranteed until measured.

## 67.1 Sixteen escalating acts

| Act | Hours (cumulative) | Main playable jobs | What visually changes | Representative unlock |
|---|---|---|---|---|
| I. Picnic Cutlery | 0–2 | Scrape small trees with plastic butter knife, drag first trunk to fire | Tiny gap in dense jungle | Rope, basic knife repair, fire sale receipt |
| II. Burn Pile Economics | 2–6 | Deliver multiple logs, split into firewood, sort by quality | Charred clearing, smoke and ash | Sledge, sled, hand carts |
| III. More Than Fire | 6–12 | Mill boards, make crates and furniture, sell contracts | Yard, workshop, sawdust | Powered saw, small kiln |
| IV. Logging Yard | 12–20 | Build stacks, loaders, ramps, service roads | First durable grass plains | Forklift, log truck |
| V. Heavy Forestry | 20–30 | Harvest ancient trees, drag whole stems, route crews | Open forest corridors | Harvester, winch skidder |
| VI. Timber District | 30–42 | Factories, warehouses, rail, paper/pellet products | Multiple plumes and resource flow | Regional sawmill, freight terminal |
| VII. Land Reclamation (in reverse) | 42–54 | Remove roots, scrape topsoil, dry and destabilize cleared land | Scrub, exposed soil, cracked ground | Graders, soil conveyors |
| VIII. Water Barons | 54–67 | Industrial reservoirs, pump networks, basin-by-basin drawdown | Shrinking lakes, dry creek beds | Pump farms, canals, transfer mains |
| IX. Mines and Metal | 67–80 | Quarry, mine, smelt, refine and ship | Terraced pits, tailings, colored plumes | Conveyor megamines, steelworks |
| X. City Builder | 80–94 | Develop profitable factory towns and dense urban zones | Skyline, streets, utilities | Municipal districts, towers |
| XI. Energy Empire | 94–108 | Interconnected grid, power stations, heat/peak scheduling | Grid corridors, heat shimmer | Supergrid, thermal districts |
| XII. Server Civilization | 108–122 | Build multi-building server campuses, sell compute, plan cooling | Huge data-center complexes | Multi-campus orchestration |
| XIII. Industrial Weather | 122–135 | Respond to storms, pollution inversions, fires, drought and floods | Regional weather and haze diverge | Climate observatories |
| XIV. Intercontinental-Scale Logistics (within map) | 135–148 | Optimize ports, airports, trains, autonomous fleets and deep supply chains | Industrial corridors across regions | Megafreight hubs |
| XV. Planetary Ruin Audits | 148–160 | Remove lingering forests/water, tune distributed emissions and soil collapse | Different pollution biomes | Multi-layer satellite scan |
| XVI. The Last Living Cells | 160–180+ | Resolve remaining microclimates, aquifers, runoff, trees, habitats, stable desert | The entire finite world becomes a visually varied desert | Eight-medal audit and final flyover |

The displayed act boundaries are design targets, not forced gates. A power-focused player can skip many server milestones; a manufacturing player can specialize in advanced refining; a climate-destruction specialist may need fewer cities. Content is horizontally deep, but the eight global completion metrics still require deliberate systems to cover all areas.

## 67.2 Anti-filler pacing contract

- First 5 h: a tangible new manual interaction every 10–20 min; first 30 h: meaningful new tools, cargo logistics or production approximately every 20–40 min; then new distinct problems roughly every 45–90 min.
- At least 20 meaningful regional missions, 15 complex manufacturing contracts, 12 site-commissioning challenges, 12 weather-response jobs, 10 grand projects and 8 endgame audit investigations; provide multiple resolutions per situation.
- Repeated routine actions must be increasingly automatable. No campaign success depends on an endless manual button press once the player has a credible industrial network.
- Late-game gains must depend on logistics, power, inputs, climate, machine state and access rather than multiplying a global `desertRate` number with no explanation.
- Every 5–10 engaged hours should transform a visible region, enable a new major system or create a new production corridor.
- Optional complexity toggles may simplify fleet management, but must never fabricate income or completion.

# 68. THE 604 KM² WORLD — HUGE, CONNECTED, STREAMED, PERSISTENT

**Authoritative bounds:** `worldSizeM=24576`, `cellSizeM=16`, `gridWidth=1536`, `gridHeight=1536`, `cellCount=2359296`, `totalAreaKm2=603.979776`. Every index `0..2359295` maps to exactly one finite world location. World edge must have plausible physical borders (ocean edge where relevant, massive boundary escarpments, visible game-zone limit) but no unreachable ghost cell in victory accounting.

## 68.1 Sixteen provinces, each a substantial game region

Divide the world into **4×4 provinces**, each 6,144 m wide and 37.748736 km²; within provinces use 6×6 administration districts (576 total), ecological watershed boundaries may cross borders. Provinces are not 16 identical copies: combine topography, climate, resource distribution, timber, rain shadows, accessibility, soil types, urban sites, special species and disaster risks.

1. **Emerald Heart** — dense starter jungle, enormous roots, heavy leaf litter.
2. **Hanging Canopy** — vertical forest with high bridge routes and fallen log bottlenecks.
3. **Copper Ridge** — mineral-rich highlands, rockslides, sparse mountain pines.
4. **Monsoon Basin** — torrential weather, flooded tracks, deep clay.
5. **Mirror Lakes** — large freshwater lakes, wetland edges, difficult drying.
6. **Black Mangroves** — coastal tidal roots, saltwater boundaries, special soil.
7. **Saffron Savanna** — scattered trees, seasonal drought, grazing opportunities.
8. **Storm Crown** — extreme wind and electrical storms, high elevation.
9. **Old-Growth Cathedral** — huge rare tree trunks, complex mass handling.
10. **Amber Floodplain** — fertile soil, river networks, fast regrowth risk.
11. **Basalt Steps** — terraced bedrock, quarries and transmission routes.
12. **Cloudwood Plateau** — mist forest and fog-dependent vegetation.
13. **Iron Marsh** — contaminated wetlands, peat layers and extraction challenge.
14. **Sunbreak Prairie** — early plains and easiest first industrial city.
15. **Granite Coast** — harbor, shipping and imported goods.
16. **Last Rain Sanctuary** — hard endgame forest and aquifer refuge, expensive to convert.

Each province must contain at least four recognizable landforms, bespoke procedural tree silhouettes, visible regional weather and unique late-game logistics constraints. The player can physically traverse the map using foot/vehicle/rail/air travel with practical fast travel unlocked through actually built depots, so 604 km² does not become meaningless commuting time.

## 68.2 Dual-resolution simulation and entity streaming

- Treat 2,359,296 environmental cells as the authority. Store dense fundamentals in **typed-array or packed binary chunks**, sparse deltas for rare objects, and metadata for soil strata and tree references. Preserve deterministic seed + explicit modifications.
- Render local terrain and 3D objects at full detail near player; distant regions receive *real 3D simplified meshes*, clustered foliage volume meshes or geometry instancing, **never image planes or PNG impostors**.
- Process nearby active cells at fine simulation ticks; distant cells process deterministic, mass-conserving aggregate updates or event-batched scheduling. Crossing the LOD boundary must reconcile totals exactly and never duplicate trees, logs, cash, energy, water or pollution.
- Sim chunks: 64×64 cells (1024 m square), **24×24 = 576 authoritative simulation chunks**. Render chunks may be smaller based on hardware. Use visible 3D streaming seams only as a bug to fix.
- Run expensive biome/weather fluxes in Web Workers, gracefully degrade physical debris count, set animation-budget priorities, and persist all important state across reloads.
- Design for approximately **30–60 FPS** on a midrange desktop at an adjustable graphics preset; expose actual browser benchmark results and clear limitations. Do not promise 60 FPS unmeasured on all hardware.
- Cloud saves can be optional. Offline-first local saves, compressed incremental snapshots, migration, backups and explicit export/import are mandatory.

# 69. EIGHT MANDATORY 100% VICTORY OBJECTIVES — ONE WORLD, EIGHT END CONDITIONS

A traditional 100% desert-only check is **insufficient in V2**. The following eight independent metrics must each reach 100.00% **at the same time** under the game's explicitly fictional, normalized endgame thresholds. They share physical simulation causes but cannot be unlocked via a single purchased 'win' button.

| Medal | Completion definition | Visible effect | How it can regress |
|---|---|---|---|
| **D1 — Desert World** | Every one of 2,359,296 eligible cells passes stable-desert predicate during audit | All land shows sand, cracked clay, salt flats or stony barren desert | Rain, regrowth or active irrigation re-wets a cell |
| **D2 — No Trees** | 0 living tree entities / viable standing saplings worldwide; no regrowth-enabled viable seed bank | Forest canopy gone; dead trunks/stumps optional, visibly dry | A planted or naturally germinated viable tree returns |
| **D3 — Dry Hydrosphere** | Every freshwater lake/river/wetland surface store below dry epsilon; every required aquifer/watershed under depletion threshold; water available to living ecosystems effectively zero | Exposed lakebeds, river scars, dried swamps, dusty wells | Storm precipitation, aquifer recharge or active water transfer |
| **D4 — Carbon Overload** | Fictional atmospheric CO₂ **burden** meets global campaign cap and has been at/above it over stability window | Denser warm haze, atmospheric tint and separate CO₂ chart | Capture/vegetation sink or emission drop lowers burden |
| **D5 — Pollution Saturation** | Every required region meets multi-pollutant contamination threshold; global accumulated pollutant index meets cap, with no untouched clean refuge | Differently colored smog, oily runoff, contaminated ground and particulates | Dispersion, rain washout, treatment or no source replenishment |
| **D6 — Soil Sterility** | No eligible cell retains viable fertile topsoil or sufficient soil health/organic carbon for spontaneous recovery | Eroded sand, crust, salt, exposed mineral | Compost/erosion input, sediments or remediation improve health |
| **D7 — Heat Collapse** | Regional temperature/anomaly thresholds passed in every modeled province and global thermal stress target met over stability window | Shimmer, cracked terrain, heat mirages, dry wind | Weather cooling, energy shutdown or recovery lowers heat |
| **D8 — Wildlife Exit** | Every province has lost persistent wildlife habitat suitability and remaining wild animal populations are at the game-defined extinction threshold | Animal activity ceases, silent barren regions, abandoned nests | Rewilding/vegetation recovery restores habitats |

**Do not interpret “no water” as physically deleting 100% of every water molecule on Earth**, or “100% pollution” as literally saturating air volume. The rules are gameplay-defined collapse targets and must be unit-labeled. Do not create a false implication that the game is a faithful real climate projection.

### 69.1 Exact completion computations

```text
D1 = 100 × count(cell.stableDesert=true) / 2,359,296
D2 = 100 × (1 − viableTreeCount / initialViableTreeReference)  [force <100 if viableTreeCount >0]
D3 = min(100 × dryFreshwaterStores/totalRequiredStores, 100 × depletedAquifers/totalAquifers)
D4 = 100 × clamp((atmosphericCO2ppm − baselinePPM)/(fictionalCapPPM − baselinePPM),0,1)
D5 = min(100 × saturatedDistricts/576, 100 × globalPollutionIndex/campaignPollutionCap)
D6 = 100 × sterileSoilCells / 2,359,296
D7 = min(100 × heatCollapsedProvinces/16, 100 × globalThermalStress/thermalStressCap)
D8 = 100 × destroyedHabitatProvinces/16   [enforce live population threshold separately]
```

Where a score reaches 100 due to rounding but its discrete gate is still unsatisfied, show `99.99%` or an explicit `100.00% (audit pending)` state—never award victory. Keep all values in finite, validated numeric ranges; arrays must never contain NaN or negative reservoir mass. Different provinces can reach 100% in different orders.

### 69.2 Final stability and audit

The player must hold all eight victory predicates simultaneously for **at least 12 in-game days** and pass two independent full-world audits: (1) streaming-independent aggregate pass and (2) full indexed authoritative-cell pass. The length is tunable and must not be a real-time waiting wall: legal time acceleration is unlocked late game, with energy/input costs and simulation consistency. If any metric regresses, show the precise offending province/cell/source and a physical way to correct it. A single protected wetland, live seed, clean town cell, fresh aquifer or cooled province must block victory until resolved.

No required cell can be hidden forever by water, a building, an underground mine, a deadlocked automation job, or unloaded chunks. Endgame tools must always offer an authorized path to complete it. A full 100%-desert display without the other seven medals is **not victory**.

# 70. GLOBAL CARBON AND CLIMATE SYSTEM — EMISSIONS MUST COME FROM ACTUAL WORK

Maintain one global fictional atmosphere state and spatial weather fields. Every physically operating emitter or sink must appear in the audit ledger: electricity generation, wood fire sales, logging trucks, sawmills, concrete kilns, smelters, chemical industries, city traffic, aviation, construction, stationary burning, forests, soil carbon, water bodies and capture systems. **No free emissions from a purchased upgrade.** Paid upgrades may permit new *working* machinery that consumes inputs and emits measured pollution.

Model the following separately: CO₂ mass equivalent, concentration-like fictional ppm indicator, methane-equivalent short-lived climate stress, sulfur/nitrogen aerosol precursors, soot, dust, toxic vapor, microplastic contamination, soot-on-snow darkening and waste heat. CO₂/air-quality/pollution are not interchangeable. The dashboard should graph all and show who emitted it, what was captured, and source-to-cell paths.

## 70.1 Fictional climate equation guidance

```text
atmosphericCarbonNext = max(0, atmosphericCarbon + Σ(emitterCarbon) − Σ(capture) − Σ(landSink))
CO2ppm = baselineCO2ppm + atmosphericCarbon / fictionalCO2MassPerPPM
cellTemperature = seasonalBaseline + regionalHeatAnomaly + globalFictionalForcing
                    + urbanHeatIsland + localWasteHeat − stormCooling − evapCooling
regionalRainRisk = function(wind, cloudWater, humidity, localVegetation,
                             season, terrainRainShadow, globalFictionalForcing)
```

Choose stable, fun coefficients, document them and expose presets rather than presenting them as real-world climate constants. A high CO₂ burden can amplify drought and storms under the chosen fictional model, but may not instantly wipe all trees for free; it must be integrated with water, soil and temperature. Always conserve/log resource mass between ledgers within declared numerical tolerance.

## 70.2 Climate controls and charts

Always-accessible Climate HUD: temperature °C, local apparent temperature, 24h/7d/30d curves, average world temperature anomaly, seasonal rainfall, rolling humidity, cloud cover, wind speed/direction, drought stage, global CO₂ ppm, effective emissions tonnes/day, source breakdown, remaining carbon-to-cap, local soil moisture, climate instability index, future weather probabilities **as predictions with uncertainty**, and 16 province heatmaps. Provide time-lapse climate replays for selected provinces and overlays for before/after infrastructure commissioning.

# 71. WEATHER ENGINE — EVENTS, PREPARATION, DAMAGE, AND NEW VISUAL STATES

Weather must be a **mechanically active local simulation**, not a random skybox color or text toast. Each event has trigger conditions, forecast window, current state, spatial footprint, strength, duration, damage, opportunity, ecological consequences and cleanup tasks. Events propagate across adjacent regional cells using winds, topography and humidity; not all events should affect the whole world at once.

| Event | 3D and sound appearance | Actual impacts / gameplay response |
|---|---|---|
| Sunshower | Moving volumetric cloud volumes, sparse droplets | Slight soil recharge; logging traction penalty |
| Tropical downpour | Dense 3D rain streaks and rippling puddles | Mud, flooded access roads, local aquifer recharge |
| Monsoon outbreak | Regional wall of rain, dark sky | High river flow, bridge stress, soggy wood quality |
| River flood | Visible advancing water, floating debris | Damaged stockpiles, temporary transport blockage |
| Flash flood | Sudden lowland water rise | Vehicle rescue mission, sediment movement |
| Thunderstorm | Lightning geometry and branching thunder | Grid surges, fire ignition, machine shutdown risk |
| Hailstorm | Falling hail meshes and impacts | Roof damage, sapling mortality, glass maintenance |
| Wind gust front | Swaying branches, blowing particles | Felling direction hazard, cranes need safe mode |
| Tropical cyclone | Spiraling storm cloud field | Mass treefall, port shutdown, flooded yards |
| Tornado | Volumetric rotating dust column | Local destruction of trees and structures, debris |
| Dense fog | Scattering volume, lowered visibility | Vehicle speed restrictions, delayed aviation |
| Persistent cloud inversion | Low smog/fog ceiling | Traps industrial particulates regionally |
| Dry thunderstorm | Lightning + little rain | Wildfire risk without matching replenishment |
| Wildfire | 3D advancing burning front | Live tree loss, smoke, assets at risk, ash deposition |
| Peat fire | Ground-level smoke vents | Persistent emissions, subsurface hot zones |
| Heat wave | Mirages, warm tint, shimmering geometry | Cooling demand, worker heat limits, water losses |
| Drought | Faded vegetation, dusty crust | Growth stalls, reservoirs recede, fire risk rises |
| Sandstorm | Dense drifting sand volumes, low orange light | Visibility loss, intake filter wear, grit deposits |
| Dust devil | Small particle vortex | Minor cargo loss, localized dirt displacement |
| Industrial acid mist | Corrosive haze color and wetness effects | Machine coating damage, soil/water chemistry shift |
| Black-smog episode | Dark near-surface atmospheric band | Solar-generation derating, air-filter loading |
| Ashfall | Flakes, gray ground overlay, muffled ambience | Equipment clogging, runoff sedimentation |
| Freezing rain / frost | Icy 3D droplets and surface sheen | Road slip, thin branch damage, pump freeze |
| Lightning-caused blackout | Flickering facilities and emergency lighting | Server jobs failover, power restart logistics |
| Dry wind season | Constant dust streaks, sound | Accelerated topsoil loss and water evaporation |
| Shifting rain shadow | Spatial cloud/rain gradient | New hard-to-dry pockets and altered growth risk |
| Toxic runoff event | Colored water channels after rain | Pollutant transport, water-index change |
| Locust swarm | Volumetric low-poly insect swarm | Agriculture crop loss, food-economy shift |
| Smoke-choked sunset | Directional light through modeled smog | Severe visibility, flight restrictions |
| Hyper-dry collapse season | Bare soils, heat plumes, rapid dry wind | Late-game stability challenge and high upkeep |

Provide at least 30 distinct regional weather archetypes (table above), and verify at least 12 in full end-to-end gameplay. Use actual mesh/particle volumes or procedural rendering on geometry, never a static painted photograph. Accessibility settings must limit flashes, shake, storm volume and particle density without changing actual outcomes. The player must be able to view event footprints on the world map and prepare responses.

# 72. WATER, GROUNDWATER, RIVERS AND BASIN-BY-BASIN DRYING

The world must begin with a nontrivial hydrosphere: lakes with shorelines, rivers flowing through actual valleys, wetlands, groundwater zones, snow/fog capture in highlands, storm runoff, aquifer recharge, pumping and process-water circuits. Distinguish oceans/saltwater that serve as scenic boundary from **freshwater stores scored in D3**; do not make victory logically impossible because a distant ocean cannot be drained.

Every basin has: finite freshwater volume, sediment depth, basin floor height, recharge rate, runoff/evaporation, connection topology, flood threshold, contamination vector, and vegetation/animal dependence. Industrial water withdrawals are paid for via real pump units and energy draw; compute cooling loops meter intake, evaporation, blowdown, return flows and leakage. Hydrology conserves water across lakes, aquifers, industry, vapor and export ledgers within declared tolerances. The win system tests **freshwater availability for the terrestrial campaign**, not ocean physics.

Visible water decline progresses in real geometry: rippling deep water → shallow shore → mudflats → reeds dying → cracked lakebed → dusty salt-flat / desert substrate. Player can stand on newly exposed bed after it dries and still see stranded old docks, boat ramps, corroded pipe outlets, empty reservoirs and former river channels. Rainstorms can temporarily reverse progress; late-game stabilization requires sufficient global/process changes rather than an unearned instant complete button.

# 73. POLLUTION AS A MAP OF DISTINCT MATERIALS, NOT ONE GREEN BAR

Represent contamination with multiple independent real-valued layers per cell or coarser fluid-field plus conservative cell interpolation: **PM2.5-like fine particles, coarse dust, soot, industrial smog, sulfur/nitrogen compounds, ground-level irritant gas, heavy metal dust, oil/petroleum residue, chemical effluent, sewage/organic waste, heat discharge, plastic debris/microplastics, ash, saline residue, soil toxicity and water contamination**. A *single normalized D5 pollution score* aggregates these under a documented formula, but the underlying constituents must remain inspectable and visualized differently.

| Dominant pollutant | Distinct appearance | Functional gameplay consequences |
|---|---|---|
| Coarse dust | Brown/orange moving ground haze | Filter clog, vehicle wear, low visibility |
| Fine particles | Gray-white volumetric smog | Solar derating, city productivity penalties |
| Soot/ash | Black smoke and gray deposition | Sootened buildings, contamination cleanup |
| Sulfur compounds | Yellow-gray stack plumes | Corrosion, soil acidity, rainfall chemistry |
| Reactive gas | Amber-green industrial haze, sparse | Worker protective-equipment costs |
| Metals | Rust/red/orange dust and tailing piles | Unusable agricultural soils |
| Chemicals | Unnatural-tinted pools and vented process vapor | Contract quality and water-treatment costs |
| Oil | Dark surface slicks, stained soil | Fire risk and water contamination |
| Sewage | Opaque runoff and processing ponds | City operating constraints and disease-event abstraction |
| Salt | Bright salt crusts on dry beds | Reduced soil fertility and groundwater quality |
| Plastic debris | Actual small 3D debris shapes near camera | Clogged intake/pump and cleanup costs |
| Heat | Refractive shimmer + hot facade surfaces | Cooling electricity demand |

**No simple sphere around a factory automatically fills the entire map.** Use winds, weather, terrain barriers, drainages, runoff, retention, redeposition, chemistry simplification and finite transport. Crosswind plumes must shift; inversions trap emissions; storms clean air but may move pollutants into soil or water; abandonment allows some contaminants to dissipate. D5 requires **regional coverage across all 576 districts**, not merely a giant absolute global emissions number.

## 73.1 Polluted landscapes change building materials

3D building surfaces acquire procedural grime, corrosion, dust buildup, moss loss, soot streaks and weathering. Roads gather ruts, oil staining and windblown sand. Air around a coal/metal district looks unlike an acid plant district or dusty quarry. No fixed background image is used to fake the effect. Under extreme contamination, distant objects remain present as meshes but can be occluded physically by fog/smog volumes. Make low graphics presets still communicate the pollutant type with material color, silhouettes and readable UI legends.

# 74. VISIBLE ENVIRONMENTAL DESTRUCTION — TEN OR MORE STAGES PER REGION

Use shader and geometry state driven by simulation fields, not a global `desertColor` swap. A cell can have different degradation routes; do not require the same art progression everywhere.

1. **Pristine forest:** giant canopies, layered undergrowth, wildlife, damp ground, streams.
2. **Selective logging:** broken understory, fallen trunks, drag scars, fewer birds.
3. **Clear-cut forest:** stumps, dirt gouges, timber piles, exposed roots.
4. **Open plains:** grass, weeds, intermittent regrowth and shallow creek beds.
5. **Industrializing plains:** roads, foundations, machinery tracks, smoke from real sources.
6. **Water-stressed grassland:** pale blades, irregular dry patches, stressed shrubs.
7. **Contaminated steppe:** particulate layers, dead grass, slag/dust or salt per source.
8. **Dry scrub:** sparse brittle plants, wind erosion and fissures.
9. **Barren mineral:** cracked clay, compacted soil, eroded rock, no recoverable vegetation.
10. **Stable desert:** shifting dunes, salt flats, stony desert, dry lake floors and persistent extreme aridity.
11. **Toxic desert overlay:** polluted soil/air shapes persist over base desert; optional separate material effects.
12. **Heat-scarred desert:** deeper ground fissures, stronger mirages and heat shimmer around hot industry.

Use at least six distinct desert visual palettes (pale dune, rust iron dust, black basalt grit, gray ash desert, chalk-white salt pan, yellow cracked clay), selected by real geology and contamination. A giant mine and a city can both end in desert but look different. Show weathering/damage on thousands of 3D objects efficiently via instancing and material parameter textures on genuine mesh geometry. Keep road and building footprints in the audit: a concrete city is *not* automatically desert merely because the material looks gray.

# 75. ACTUAL THREE-DIMENSIONAL TOOLS, BUILDINGS, MACHINES, AND ANIMATED OPERATIONS

World object silhouettes must be real geometry. All buildings should have actual multiple floors/facades, support structures, loading docks, vents, towers, power connectors and meaningful interiors where the player works. A detailed visible data center must contain rack rows, fans, switchgear and cooling hardware, not a cardboard box with `DATA CENTER` label.

**Baseline asset families:** 25+ tree species with meaningful trunk shapes, 15+ stumps/root types, 30+ manual and powered tool meshes, 50+ distinct industrial machines, 25+ vehicle/chassis families with animated parts, 35+ detailed buildings/production facilities, 20+ giant megastructures, 12+ rail/port/airport functional elements, 12+ pollutant-specific environment overlays, and at least 8 visible weather particle types. Asset variants can be parametric but must meaningfully change shape as appropriate.

## 75.1 Destruction beyond trees

The player can physically dismantle/clear: brush, vines, canopy roots, stumps, boulders, hillsides, rocky outcrops, soil layers, deadwood, derelict structures, old mills, quarries, contaminated debris, abandoned roads, disused pipes, dry dams, foundations and selected industrial buildings. Use an equipment-appropriate interaction: cutting, grinding, breaking, sawing, drilling, excavation, disassembly, dismantling, loading, salvaging or hauling. Salvage produces accountable materials and often profitable byproducts; world destruction never creates materials from nowhere.

## 75.2 Large physical machines and facilities

- Logging: cable yarders, skidders, feller-bunchers, tracked harvesters, slashers, industrial chippers, whole-tree processors, line excavators.
- Earthmoving: bulldozers with blades, graders, bucket-wheel excavators, draglines, scraper trains, blasting as **abstract fictional construction contracts** (do not include real explosive recipes), quarry crushers, soil conveyor systems.
- Water and cooling: intake stations, reservoirs, towers, piping, valves, pumps, cooling lagoons, mist stacks, condensers and high-pressure fictional extractors.
- Logistics: cranes, gantries, straddle carriers, forklifts, multi-axle haulers, rail wagons, moving freight barges, port container cranes, cargo aircraft.
- Manufacturing: sawmills, plywood plants, pulp mills, paper mills, prefab housing works, furniture factories, cement plants, steelworks, glassworks, battery factories and computer factories.
- Cities/data infrastructure: district substations, bus depots, tower cranes, apartment blocks, corporate towers, server racks, battery rooms, cooling towers, fiber trunks, satellite dishes and skyscraper clusters.

**Animation contract:** Powered equipment has tracked input/output states, idle/spin-up/active/cooldown/fault modes, moving tool parts, realistic stockyard flow, machine motion synced to consumed fuel/electricity and a readable on-site inspector. An inactive machine does not keep producing smoke, electricity, products or income.

# 76. MANY PROFITABLE INDUSTRIES — VISIBLE ECONOMIC MEGABUILDINGS

**Construction unlocks new revenue, not merely environmental destruction.** Each facility should consume measured inputs (at least one primary resource and energy), have capacity and staffing/automation requirements, produce at least one output, create byproducts, wear/maintenance, power demands, heat/emission impact and distinct rendered state. A big city should generate income through residents, demand and services, but those numbers must follow occupancy, supply and infrastructure instead of appearing passively on placement.

| Industry / building | Primary saleable outputs | Required supply | Local environmental signature |
|---|---|---|---|
| Fire sale yard | Fast low-margin burned-wood sale | Wood delivered physically | Smoke, ash, heat |
| Sawmill complex | Planks, beams, slabs, offcuts | Logs, saw power, labor | Sawdust, noise, fuel |
| Plywood & board mill | Plywood, OSB, engineered panels | Wood input, resin, power | Adhesive fumes and scrap |
| Paper megamill | Paper, boxes, packaging | Fiber, water, heat | Water draw and effluent |
| Furniture megafactory | Desks, cabinets, panels | Dried wood, fasteners, power | Finishing vapor, high revenue |
| Prefabricated house factory | Modular homes | Wood/metal/concrete | Delivery traffic and waste |
| Biomass electric plant | Grid electricity and ash | Chipped biomass | CO₂, particles, waste heat |
| Coal-style fictional power plant | Large dispatchable electricity | Finite mined fuel | Soot, ash, CO₂, heat |
| Natural-gas-style plant | Flexible electricity | Finite gas commodity | CO₂, hot exhaust |
| Oil refinery | Fuel grades and feedstocks | Extracted crude + utilities | Oily residue, flares/heat |
| Mine & ore concentrator | Ores and concentrates | Rock extraction, power, water | Tailing dust, water use |
| Cement works | Cement and construction binders | Limestone, heat, fuel | Dust and CO₂ |
| Concrete megafactory | Precast parts, road slabs | Cement, aggregate, water | Dust, water depletion |
| Steelworks | Steel coils, beams, rails | Ore, coke/electricity, water | Thermal plume, slag |
| Glassworks | Pane glass, optical materials | Sand, energy, soda inputs | Heat exhaust |
| Battery plant | Battery packs | Refined metals, energy | Chemical waste/recycling |
| Microchip fabrication | Chipsets and sensors | Highly refined inputs, clean energy/water | Ultra-high water and power costs |
| Server assembly factory | Racks, hardware, networking | Chips, metal, plastic, electricity | Manufacturing scraps, thermal load |
| Data center | Paid compute jobs, storage, cloud contracts | Power, cooling, servers, networking | Waste heat, cooling water, CO₂ from grid |
| AI supercompute campus | High-value workload contracts | Massive grid, advanced cooling | Extreme electric and cooling demand |
| Logistics warehouse | Storage/fulfillment fees | Delivery routes, staff, power | Trucks, paving, noise |
| Truck & rail terminal | Transport fees, route optimization | Vehicles, fuel, tracks | Transport emissions |
| Port/shipyard | Export contracts, freight services | Containers, cranes, ships | Spills, fuel and shoreline impacts |
| Airport cargo hub | Express freight income | Runways, fuels, cargo planes | Noise, high fuel consumption |
| High-rise residential city | Rent, property and service income | Building supplies, water, power, access | Water draw, sewage, heat island |
| Corporate city | Commercial rents and taxes | Network connectivity, labor, transport | Traffic, energy and cooling loads |
| Financial tower district | Business service fees | Data center capacity, power, occupancy | Dense grid/water demand |
| Theme/entertainment district | Ticket and visitor income | Residents, transport, power | Waste and peak energy demand |
| Hypermarket megaplex | Retail income | Logistics and consumer demand | Traffic, packaging, refuse |
| Mega-agriculture district | Crops, biomass and food | Irrigation, soil, fertilizer | Water depletion, soil erosion |
| Livestock/agri-processing | Food goods, fertilizer | Feed, land, water | Methane-like climate stress and waste |
| Industrial greenhouse array | High-value produce | Water, electricity, climate control | High power/water use |
| Waste facility | Recycling income, recovered metals | Industrial/city waste | Landfill gases, leachate |
| Chemical production hub | Saleable process chemicals | Refined feedstocks, heat, water | Material-dependent vapor/effluent |
| Industrial urban core | Combined jobs, rent, contracts and taxes | All utilities + connected logistics | Multi-source pollution and heat |

**Revenue integrity:** `grossRevenue − rawInputs − salaries − energy − water − maintenance − hauling − financing − penalties = operatingCashFlow`. Prevent self-trading profit loops, inventory duplication, unlimited demand, instant teleportation, unmetered free grid energy and buying zero-cost megaprojects. Provide market demand curves and contracts so specialized industries are viable without making any single industry strictly mandatory for full victory.

# 77. CITY BUILDER SUBSYSTEM — FINANCIALLY SUCCESSFUL BUT ECOLOGICALLY COSTLY

The game must support **genuine buildable industrial cities**, not a passive rectangular texture. Cities contain districts, plots, roads, sewage, heat, utilities, occupancy, services, freight and building maintenance. Buildings are 3D meshes with footprint, volume, height, floor count, construction phase and visible equipment. City regions should visibly grow into a skyline of towers, apartment blocks, office parks, malls, power lines, server cities and highways, changing atmosphere and local weather.

**Zone classes:** company town, worker housing, residential, office, retail, high-density towers, heavy industry, research park, data center campus, container port, rail terminal, freight airport, parking/roads, waste processing, agriculture and quarry permits. Developer provides roads/utility connections; construction does not complete until materials arrive and cranes perform stages. Buildings require valid foundation and flood-risk checks.

**Population model:** fictional city residents are abstract agents with housing, jobs, commute capacity, rent income, utilities, services and migration. Do not model harming individual people; the satire targets wasteful industry. Hazardous pollution reduces occupancy and profitability, creating a strategic tradeoff between maximizing environmental damage and keeping a lucrative city running. Allow city economies to shrink under the player-created climate collapse; provide alternative endgame industrial income when this happens.

**Giant building classes:** 120-story corporate tower, 80-story residential complex, four-block industrial supermall, hyperscale data-center cathedral, 24-hectare factory campus, stacked logistics hub, mega-coal station, 4 km long rail yard, deep ore concentrator, elevated water-transfer aqueduct, mega-warehouse and skyline megacity. Scale dimensions to actual terrain and prevent visually enormous structures with tiny fake capacities. Interior detail should be highest for inspectable high-interaction buildings; procedural exterior floor geometry and instancing allowed for skyscraper performance.

# 78. DATA CENTERS AS A SECOND COMPLETE GAME — COMPUTE, NETWORKS, COOLING AND PROFIT

Never place a gray box that prints money. Data-center construction must support: surveying/graded foundation, shell assembly, concrete/steel inputs, delivery docks, substations, transformer/breaker limits, backup batteries/generators, real 3D racks, multiple server types, compute workload queue, network bandwidth, fiber routing, storage tiers, redundancy, temperature, humidity, air handling, cooling towers, liquid loops, water intake/return, filter servicing, maintenance schedules and real paid contracts.

**Dashboard for every campus:** power delivered MW, IT power MW, total facility MW, PUE-like ratio, rack count, active servers, rack density, server CPUs/GPUs, utilization %, thermal budget, thermal incidents, intake water L/day, evaporation L/day, water-use metric, network Gbps, uptime %, completed jobs, rejected jobs, revenue/h, power costs, maintenance, actual profit/h, CO₂ emissions attributable to grid mix and local waste-heat contribution. Charts must reconcile with live equipment.

### 78.1 Eight campus scales

1. Shed server rack — 1–4 racks, borrowed workshop electricity.
2. Maker colocation — 5–24 racks, first backup battery.
3. Small regional facility — 25–150 racks, basic cooling plant.
4. Campus cluster — 151–1,000 racks, dedicated substation.
5. Hyperscale hall — 1,001–10,000 racks, cooling tower fields.
6. Industrial hyperscale campus — 10,001–50,000 racks across multiple halls.
7. Server metropolis — 50,001–250,000 rack-equivalents with aggregated distant racks.
8. Continental-scale fictional grid campus — world-spanning aggregate workloads with inspectable 3D core facilities.

The physically visible and interactive near-camera servers cannot all be instantiated at 250k racks. Nearfield racks use physical geometry, long-distance rack fields use 3D instancing and aggregated worker-job simulation. Never falsely claim 250k independently simulated thermodynamic nodes if that would freeze the browser. Growth must be accurately summarized at coarse scales.

### 78.2 Workload and cooling tradeoffs

Customers submit contracts requiring compute units, memory/storage, bandwidth, deadlines, redundancy and data residency zone. Server hardware has failure rates, efficiency curves, heat output, power draw and upgrade slots. Electricity shortage throttles workloads, cooling outage triggers ramp-down, and water restrictions reduce evaporative cooling availability; no work is sold without computational throughput. Data centers are a lucrative **optional** route, with high environmental footprint under selected configurations—not the sole source of emissions or desert progress.

# 79. ENERGY GRID — REAL NETWORKS, BILLING, BROWNOUTS, AND INDUSTRIAL HEAT

Add thermal power stations, biomass, gas turbine, diesel backup, solar, wind, hydro, grid interties, batteries and optional advanced energy tech. Some energy is clean; some is dirty, with actual choices about emissions, reliability, cooling, cost and water consumption. Buildings connect via electricity network segments and substations; track circuit rating, transmission distance, voltage tier abstraction, demand peaks, dispatch priority, line loss, batteries and heat.

**No free-energy loops.** Fuel reserves cannot become electricity without thermal or mechanical efficiency, batteries lose energy to cycling, power cannot be sold and rebought endlessly at a profitable fixed spread, and power plants cannot simultaneously produce their entire sold quota and power your industries without accounting for it. Dirty generation enables fictional environmental outcomes but clean sources can keep machines operational as the world dries. Maintain every source's traceable pollution and CO₂ output.

# 80. TRANSPORTATION AND INDUSTRIAL NETWORK MEGASYSTEMS

The initial manual dragging mechanic remains essential. Progress through tree rolling, rope hauling, wheelbarrows, log sleds, handcarts, horse-style fictional haulers if desired, skidders, forwarders, articulated trucks, flatbeds, conveyor belts, gantry cranes, rail logging cars, automated road trains, river barges, cargo ships, airlifts and drone logistics for compatible small objects. Heavy logs have dimensional fit limits and material grades; no 'collect log' button that converts a giant trunk into weightless inventory.

Each route has travel distance, capacity, terrain access, loading/unloading time, congestion, fuel/kWh, wear and optional emissions. The player places roads, bridges, docks, rail lines, container yards, loading bays and charging pads. Regional industries cannot get paid until outputs reach accepted buyers or contract fulfillment centers, except explicitly modeled local onsite consumption. Late-game aggregate logistics use real graph flow and inventory accounting, with nearfield entities visibly reconciling when loaded.

# 81. MASS-PRODUCTION, RECYCLING, TECH RESEARCH AND ADVANCED CRAFTING

Create real assembly recipes, tiered machines and distinct production phases. Example wood evolution: trunk → sorted log → debarked stem → boards/chips → dried wood → laminated stock → furniture/pallets/houses/paper. Example metals: extracted ore → concentrate → smelted ingot → rolled steel → machine part → vehicle/campus construction. Example computers: refined silicon/metal inputs + electronics components → server board → assembled chassis → installed rack → paid compute jobs. Feed all by transport, storage and machine energy.

Product grades should affect prices and downstream acceptance. Recycled scrap has lower grade or additional processing cost, not unlimited multiplicative yield. Research unlocks **engineering capability**, not free instantaneous installed infrastructure. Large research projects require costly prototype parts, trials or one-time contracts; avoid arbitrary real-time lockouts.

# 82. GAMEPLAY TELEMETRY — ENERGY, POLLUTION, CLIMATE AND EVERYTHING THE PLAYER OWNS

The default HUD must expose money, net income/h, current carried mass, active job/tool mode, local weather, energy produced/consumed, local pollution class, and **eight victory progress bars with exact percentages and diagnostics**. A collapsible advanced dashboard provides at least the following real, unit-labeled series:

**Economy:** cash, debt, lifetime revenue/profit, revenue by facility/product, contract margin, capex, opex, average selling price, idle capacity, employee and vehicle costs, inventory valuation, insolvency safety net.

**Forestry/terrain:** live trees, viable saplings, trees chopped, roots removed, wood volume/mass, area cleared km², soil stripped m³, barren cells, desert cells, topsoil fertility, vegetation recovery risk, last unconverted cells.

**Energy:** generation MW by source, demand MW, reserve MW, losses MW, consumed fuel tonnes/day, battery MWh, brownouts, carbon intensity, facility-level electricity bills, waste-heat thermal MW.

**Climate/weather:** CO₂ ppm, daily CO₂-eq emissions, climate forcing score, 24h/7d/30d temp curves, avg humidity, evaporation, precipitation, wind roses, drought index, forecast confidence, extreme weather history, events currently active.

**Hydrology:** river and lake freshwater m³, total aquifer reserve m³, water consumed/day, cooling intake/day, return flow, industrial discharge, recharge, wetland area, dry basins and waterless districts.

**Pollution:** particulate concentrations, fine/coarse dust, smoke, acids, heavy metals, oily soil, toxic runoff, thermal stress, sewage and saline contamination, emissions sources, daily depositions, per-pollutant maps, cleanest 20 cells and unmet D5 districts.

**Data centers:** installed server counts, jobs/s, workload completions, IT load, PUE-like efficiency, cooling water/day, profit/h, failover incidents, uptime SLA, rack thermal hotspots, most profitable customer.

**Cities:** construction sites, occupied floors, active jobs, population simulation, rent, tax, transit demand, freight traffic, utilities, city energy/water footprint, abandonment and net profit.

**Automation:** active task orders, failed/queued jobs, machine utilization, chokepoints, routes blocked, fuel stock, repair backlog, inventory stranded, time-to-cap and verified throughput.

Charts must be sourced from timestamped records, not hand-drawn stock graphics. Data is persistent, filterable by province/district/company/facility and exportable as CSV/JSON. Use a separate 'planetary autopsy' screen explaining **what caused each biome conversion**, including tree loss, water withdrawal, erosion, energy use, CO₂ and pollution deposition, without implying actual scientific validation.

# 83. BUILDING DESIGNER — EXPANDABLE, VISIBLE, INDUSTRIAL 3D CONSTRUCTION

Players must see buildings under construction, not instantly spawn finished factories. A building blueprint has terrain constraints, footprint, building materials, transport routes, utility hook-ups, assembly phases, time, commissioning tests and actual operating animation. Render diggers working foundations, cranes lifting 3D modules, trucks unloading resources, weld-like light effects, pipe connections, walls/floors being added, industrial chimneys, cooling arrays, and scaffolding. At high scale, use simplified but geometrically real LOD assembly sequences with faithful resource ledgers.

**Modular structure categories:** footings, concrete raft, steel columns, floors, walls, industrial shells, roof trusses, heavy bay doors, ducts, smoke stacks, cooling towers, power substations, intake pipes, effluent lines, rail spurs, loading doors, parking areas, office towers, apartment modules, server rack halls, server cages, cable trays, clean rooms and control centers. A giant facility must occupy and visually transform a credible area of real terrain.

**Builder UX:** snap/no-snap modes, grid alignment, terrain grading estimate, structure outline, material bill, projected per-hour profit, electricity/water demand, emissions estimate, physical obstruction checks, undo before commitment, demolish/recycle with measurable returned materials, road/rail curve tool, utility connection preview, building stages, copy/paste blueprint, favorites, district templates and a network overlay. A blueprint may be shared through JSON (sanitize parsing) but may not execute arbitrary scripts.

# 84. DEGRADATION STRATEGIES — MULTIPLE WAYS TO DESTROY THE WORLD

No single recipe is mandatory. The player may combine the following **fictional gameplay strategies**, which require real constructions, resources, time, regional planning and constraints:

| Strategy | Active gameplay | Main environmental outputs | Economic upside | Constraint |
|---|---|---|---|---|
| Whole-tree logging | Operate knives → chainsaws → harvesters → logistics | Tree removal, soil exposure | Timber and crafted goods | Huge mass handling |
| Charcoal/bioenergy industry | Deliver and process biomass in plants | CO₂, soot, ash, heat | Electricity and commodity sales | Fuel replenishment |
| Intensive industrial forestry | Plant/harvest short-cycle crops and exhaust soils | Soil loss, water stress | Predictable wood throughput | Regrowth hinders final D2 |
| Open-pit mining | Excavate, haul, crush, refine | Rock scars, dust, drainage | Ore and manufactured metals | Machinery costs |
| Quarry/cement megacomplex | Quarry mineral substrate, fire kilns | Dust, CO₂, heat | High-value construction materials | Demand and energy |
| Petrochemical industrial park | Refine fictional feedstocks | Multiple toxic pollutions | Chemicals, plastics | Water, power and waste handling |
| Steel/metal foundry district | Smelt materials, supply factories | Soot, slag, heat | Steel products and machinery | Fuel/input supply |
| Hydrological extraction | Pump water for manufacturing/cooling | Aquifer depletion, river drying | Industrial throughput | Pump MW and recharge |
| Industrial agriculture | Irrigate and cultivate at scale, then shift to exhaustion | Groundwater loss, soil fertility decline | Food and feed | Rain/flood cycles |
| Expanding cities | Build high-density jobs, housing, services | Heat islands, traffic emissions, water draw | Rent, taxes, commerce | Pollution reduces occupancy |
| Freight supernetwork | Run road/rail/air/ship trade | Transport emissions and land footprints | Distribution and trade | Maintenance and bottlenecks |
| Data center megacampuses | Sell server compute while paying power/cooling | Indirect CO₂, heat, water depletion | Compute and storage | Grid, cooling, outages |
| Power megagrid | Dispatch high-volume generators | Source-specific emissions and waste heat | Power sales | Fuel logistics and efficiency |
| Landfill/waste megafacilities | Handle real industrial/city waste | Leachate, particulate or gas | Waste processing fees | Finite waste production |
| Regional thermal districts | Route waste heat among real buildings | Heat stress and local microclimate | District utility income | Pipes and actual energy conservation |
| Combined megaindustry | Co-locate factories and cities strategically | Several stressors at once | Synergy and scale economy | Dangerous cascading failures |

Environmental success should carry an **economic tradeoff**: destroying local water may cripple cooling and farms; severe smog may close a city; soil loss can interrupt crop feedstocks; storms can disable grids. Let players solve these contradictions with alternate production methods and network redundancy. Avoid simplistic “build polluter = +1%” behaviors.

# 85. 576-DISTRICT GOVERNANCE, MAP TOOLS AND LATE-GAME REGION CONTROL

Each province has 36 districts with separate budgets, logistics access, industry strengths, weather, water stores, pollution sources and ecological state. The world map supports 16 province panels, 576 district summaries, clickable environmental cells, selected-building details, camera fly-to, route highlights, automatic completion checklists and explicit last-blocker finders. Zoom levels: world → province → district → cell → actual 3D machine.

A district can be named and assigned one of several development doctrines (timber, city, industry, mining, power, logistics, water, mixed) without magically converting it. District managers issue orders to existing assets, forecast inventory and power demand, suggest construction sites and report why they are failing. Each district has survey completeness, accessible route coverage, contamination diversity, dry-water progress and weather risk; the user can compare districts by profit/km², CO₂/day, pollution stress, construction cost and expected contribution to final medals.

# 86. AUTOMATION WITHOUT TELEPORTING RESOURCES OR DELETING PROBLEMS

Automation is earned, progressively more sophisticated and never replaces the underlying simulation. Implement dispatch boards for trees, roots, hauling, loading, milling, drying, manufacturing, road building, water pumps, power plants, repair, weather shutdown, fuel delivery, server workload placement, heat routing and cell remediation/re-desertification. Jobs must state accepted input location, inventory reservation, machine capability, route, energy, expected completion and actual outcome.

**Automation levels:** (1) direct manual play, (2) machine assist, (3) repeat local work order, (4) district job queue, (5) regional logistics coordinator, (6) cross-province optimization, (7) climate stabilization network, (8) audited world completion scheduler. Later tiers reduce busywork but can be misconfigured, and each automation order must be inspectable/cancelable.

Use a proper dependency graph to prevent deadlocks, circular reservations and jobs in unreachable locations. Jobs can pause on weather hazard and resume. Failed orders remain in an exception queue instead of silently vanishing. Avoid automation creating cash, items, pollution or completion progress without measured machine work.

# 87. WEATHER FORECASTING, INDUSTRIAL DISASTERS AND EMERGENCY RECOVERY GAMEPLAY

The player's empire can suffer utility cascades: lightning damages substation → cooling power fails → server throttles → income falls → pump station outage → local wetlands refill → D3/D1 regress. UI must show causality and let the player inspect and fix each step. Other optional event chains: hurricane wrecks log transport bridge; wildfire consumes unsalvaged lumber; flood deposits fertile sediment; smog inversion makes distant city lose occupancy; dust storm clogs server filters; drought crashes irrigated crop output; wild winds overload cranes; heavy rain washes toxic residue into a river; prolonged heat causes transformers to derate.

Make challenge fair: forecast likelihood and mitigations are observable, losses cap within a balanced range, autosaves protect against data corruption, and there is always a recovery route using repair parts, insurance, alternative electricity, reserve fuel, worker crews or redundant transport. Do not use random unavoidable deletion of many hours of progress. Include a weather-history viewer and post-incident report: start time, location, destroyed/damaged assets, repair cost, root causes, environment changes and player prevention actions.

# 88. DYNAMIC ECONOMY AND GIGANTIC INDUSTRIAL CONTRACTS

Market simulation tracks regional demand, marginal pricing and shipped volumes for timber, furniture, boxes, paper, construction modules, scrap, ore, concrete, metals, electronics, cloud compute, power, freight, urban services, food and waste processing. Baseline demand is finite but renews through fictional NPC regions under documented rules; output must physically reach a buyer, network endpoint or explicitly simulated exchange with route costs.

**Progression contract arcs:** first $10 in burned wood; first delivered one-ton log; first pallet of boards; first house-frame shipment; 100,000 board-feet wood-equivalent; first electric grid; first metro population threshold; first successful multi-day server SLA; energy export net profit; profitable steel-and-concrete complex; first 100 km² clear-cut milestone; first dried province; all 16 provinces connected; first multimodal freight loop; first 10 GW dispatchable capacity; a profitable city in a high-drought basin; eight medal pre-audits; eliminate last 1000 forest trees; dry last connected freshwater basin; remove final live seed; pollution in every district; final simultaneous 8-medal victory.

Contracts provide money, technology unlock, construction permits or logistics reputation. The same contract cannot be claimed infinitely unless it consumes a new corresponding amount of real goods or service throughput. Describe and implement anti-exploit constraints.

# 89. STATISTICS, CAMERA MODES, GRAPHICS AND VISUAL POLISH

**Presentation target:** large PC-quality 3D game in browser with clean readable industrial UI and compelling environmental change. Use a coherent art direction (stylized realism or refined low-poly with excellent materials), physically grounded lighting, dynamic sky, detailed foliage silhouettes, procedural texture detail on actual meshes, volumetric fog, smog shading, weather systems, dust particles, wetness, dirt accumulation, heat distortion, night lighting, tire tracks, physically animated water surfaces and smooth streaming. Optimize everything for long play sessions.

**Camera modes:** first person (primary manual work), optional third person for vehicles, machinery operator seats, building overview orbit, rail follow cam, cinematic drone camera and satellite-style environmental map. Vehicles need actual wheels/tracks/rotors and visible cargo. Buildings should reveal internal production via inspect/section-cut views; each megastructure should have an impressive 3D silhouette at all distances.

**Audio:** knife scrape, tree fracture, log drag friction, fire crackle, distinct saws, motors, conveyors, mills, factory ambience, server rack fan hum, high voltage buzz, thunder, torrential rain, dry winds, distant cities, different pollution biomes and escalating score. Provide separate sliders and reduced-intensity modes.

**Accessibility:** reduced motion and camera shake, photosensitivity-safe lightning, colorblind pollutant legend with patterns/icons, scalable HUD, subtitles/captions, alternate keyboard/gamepad remapping, adjustable FOV, graphics presets, high-contrast chart mode, toggle-hold interactions and save reminders.

# 90. ENDGAME DETAILED DIAGNOSTICS — EVERY LAST GATE IS PLAYABLE

Provide **Planetary Audit Console** with eight enormous meter rows (D1–D8), current true values, target threshold, stability clock, province/district heat maps, top 100 noncompliant cells, source/sink ledger, weather forecasts that could regress progress and a `Why am I not done?` inspector. Each failing metric should offer 2–5 real, existing, machine-backed remediation *toward collapse* routes, not a button that simply increments progress.

**D1 blockers:** wet ground, fertile regrowth, missed islands, cool highlands, constructed cell with moist subsoil. **D2 blockers:** seedlings, inaccessible canopy pockets, viable seeds, tree farms not switched off. **D3 blockers:** seasonal marsh, connected aquifer, leak, rain-recharged lake. **D4 blockers:** industrial emission decline, carbon sinks still active, poor fuel supply. **D5 blockers:** wind shadow clean districts, captured pollutants, inactive machinery, contamination diluted by rain. **D6 blockers:** residual fertile soil in floodplain, sediment or compost deposit. **D7 blockers:** fog-cooled plateau, missing distributed heat sources, storm cooldown. **D8 blockers:** residual animal habitat in wet canyon, recent regrowth, unconverted water-dependent biome.

Every blocker links to an exact diagnostic and reachable world area. An endgame all-region map audit must be deterministic across reloads and unaffected by whether the player camera is in a district.

# 91. FINAL VICTORY PRESENTATION, NEW GAME+ AND NON-PUNITIVE REPLAYS

After all eight medals hold over the stability window, the game runs an unbiased global audit. Show **Final Environmental Balance Sheet**: map km² transformed, trees removed, initial/final freshwater m³, CO₂-equivalent net emissions, pollution type and distribution, energy generated/used by source, weather disasters, live/dead facilities, city population, remaining wildlife, original species lost, lifetime goods created, timber dragged meters, fire-sale revenue, data center jobs completed, total profit, most productive factory, highest-density server hall, favorite tool, total distance, total playtime, eight medals, final-region flyover. All numbers must come from stored telemetry.

The final camera tour is a **real-time 3D cinematic** traveling across notable converted provinces, giant mining sites, smog cities, massive cooling towers, dry lakes, sand-swept server megacampuses and the formerly green starter zone. Victory is permanent in a separate save record; a post-victory sandbox can continue without erasing completion history. New Game+ may unlock alternative seeds, harder weather and new building visual variants but must not be necessary to earn 100% on the first standard campaign.

# 92. ENGINEERING ARCHITECTURE FOR THE HUGE BROWSER SIMULATION

**Suggested technology, not religious requirements:** TypeScript, Vite/React for menu and overlays, Three.js/Babylon.js or equivalent real-time 3D engine, glTF/GLB asset loading, instanced 3D geometry, Web Workers, Rapier or another reliable deterministic-where-needed physics approach, IndexedDB/OPFS snapshots, Vitest/unit tests, Playwright browser E2E tests. Choose engine libraries appropriate to the actual repository and document why; avoid risky unnecessary rewrites.

Modules/contracts:

```text
src/game/
  runtime/             fixed-step clock, pause, time acceleration, deterministic RNG
  world/               finite bounds, province maps, chunk streaming, biome generation
  ecology/             trees, seed bank, wildlife, soil health, D1/D2/D6/D8
  hydrology/           rivers, lakes, aquifers, atmospheric moisture, water balance
  atmosphere/          CO2, aerosol transport, pollutant classes, D4/D5
  climate/             seasonal weather, storms, wind field, temperature, D7
  visuals/             meshes, materials, effects, 3D instancing, LOD
  physics/             tools, tree falls, collision, rope/cargo interaction
  industry/            recipe graphs, throughput, inventories, wear, maintenance
  cities/              zoning, building modules, occupancy, services, traffic
  datacenters/         racks, jobs, networking, cooling, revenue, reliability
  power/               grid routing, dispatch, storage, fuel, pricing
  logistics/           graph routing, vehicle fleets, cargo handling
  automation/          work orders, priority, reservations, exceptions
  upgrades/            old 1056 + new 640, dependencies and effect handlers
  telemetry/           financial and environmental audit ledgers, time series
  victory/             D1–D8, exact cell scans, stability window, final ledger
  persistence/         schema, compression, autosaves, versioned migrations
  ui/                  responsive HUD, inspectors, atlas, construction, settings
  tests/               fixture maps, conservation, replay and browser E2E
```

**Data schemas:** `WorldCell`, `Watershed`, `AtmosphereState`, `WeatherFront`, `TreeEntity`, `IndustrialMachine`, `CargoStack`, `PowerEdge`, `Facility`, `CityBuilding`, `DataCenterRack`, `Workload`, `EmissionRecord`, `PollutantField`, `UpgradeDefinition`, `Job`, `VictoryMetric`, `GameSave`. Each carries schema version, stable ID, declared units, explicit update/serialization rules and migration tests. Implement a local simulation determinism harness with seed + player action log + tick count replay.

**Sim invariants:** all cash transactions double-entry, inventory mass conserved, energy balance reconciled, hydrological source/sinks accounted, emissions traced to work done, cells do not have duplicate ownership, tree counts can be rebuilt from entity data, game state never contains NaN, cross-chunk offscreen effects equal on-screen results within tolerance, all eight medals recomputed from authority not cached HUD rounded numbers.

# 93. PERFORMANCE, SAVES AND FAILURE RECOVERY — MAKE 604 KM² PRACTICAL

- Initial load should generate only the seed, starting forest and nearby operating chunks; do not construct 2.36 million unique JS objects or all 25 tree species for every cell in one frame.
- Use SoA typed arrays for dense cell fields: moisture, fertility, temperature, desert state, contamination categories as quantized fields where acceptable, and sparse dictionaries for uncommon structures. Compress and chunk long-term data; do not write megabytes every animation frame.
- Nearby forest meshes use true geometry, collisions and LOD instancing; distant tree populations are spatial aggregates **rendered with simplified 3D volumes where visible**. On approach, instantiate specific trees consistently from seeded populations and saved removals.
- Offscreen industrial facilities use deterministic recipes with batch simulation; active nearfield buildings switch to full animated machines without inventory jumps or duplicate output.
- At least three save slots, autosave frequency adjustable, crash recovery, world seed display, snapshot rollback, upgrade migration across patches, partial-write protection, export/import with integrity check, version compatibility notice.
- Detect browsers without required WebGL/WebGPU and display a clear capability warning rather than broken controls. Game must remain functional on agreed baseline supported browsers.
- Monitor CPU frame ms, GPU frame ms where available, memory budget, chunk count, render triangles, draw calls, active physics bodies, network graph solve time, save size and max tick catch-up.
- Benchmark representative cases: starter jungle, dense 3D mill, city skyline, 20 active trucks, storm over a city, major wildfire, data center interior, endgame global audit, zoomed-out province map. Make truthful reports instead of claiming performance based on compilation.

# 94. DATA DEFINITIONS, DESIGN RULES AND UPGRADE REGISTRY EXPANSION

This replaces earlier numeric upgrade targets **without discarding any existing upgrade**. Include 288 base upgrades (`01-01`…`24-12`) and 768 first-extension upgrades (`25-01`…`72-16`) from Sections 1–65. Add **exactly 640 new nodes** in 40 branches with identifiers `73-01`…`112-16`. Thus the complete catalog has **1,696 authored unique upgrades, 112 branches**. Do not rename IDs from either earlier document; preserve save migration mapping.

Every node in the additional 640 requires: `id`, `name`, `description`, `branchId`, `tier`, `baseCost`, `prerequisites`, `unlockRequirements`, `effectType`, numerical/boolean/schematic effect parameters, `visibilityState`, `purchaseTimestamp`, `saveVersion`, `telemetryKey`, `onPurchase` effect, and `unitTestName`. The table lists one *prototype* effect for each node; the implementation can tune numbers but must keep mechanical distinctness and consistency with existing balance. Branch pricing should escalate reasonably (often exponential), with affordability based on stage cash flow; cap costs so ordinary 150–200-hour players can reach a viable endgame without grinding all 1,696 upgrades. Not every optional node is required for victory.

Each upgrade belongs to a specific actual capability, not a fake bonus. Upgrades that affect real-world conditions—emissions, rainfall, climate, contamination—must do so through a modeled asset, work order, equipment capability or conserved state, never immediate unearned magic percentage. Favor visible 3D changes when they alter tool, building, transport or machinery hardware.

# 95. SIX HUNDRED AND FORTY ADDITIONAL, FULLY SPECIFIED UPGRADES — BRANCHES 73–112

**Counts:** Original `README.md` contributes 288 nodes (24 branches × 12). Prior Sections 31–65 contribute 768 nodes (48 × 16). The following table adds 640 nodes (40 × 16). Combined **1,696 upgrade IDs in 112 branches**. Prices below are initial suggested tuning points, not fixed real-world economics; preserve real distinct functionality. The price for each tier is calculated from the branch entry price with a prototype 1.42× tier multiplier and may be balanced against actual 150–200-hour earnings. The implementation must store the actual charged price and node ownership in the save.

## 95.1 New branches at a glance

| Branch | Specialty | New upgrades | Initial price | Unlock gate |
|---|---|---:|---:|---|
| 73 | Mythic Butter-Knife Mastery | 16 | $1,500,000 | First tool preserved and 3 provinces surveyed |
| 74 | Adaptive Blade and Multi-Tool Engineering | 16 | $180,000 | Advanced saw workshop and precision contracts |
| 75 | Forest Giants and Hard-to-Reach Extraction | 16 | $500,000 | Highland logging contract and grapple boom |
| 76 | Forest Transport Megafleets | 16 | $750,000 | At least 5 logging vehicles and 2 regional depots |
| 77 | Rail, Ports, Barges and Freight Airships | 16 | $1,500,000 | First working train and coastal trade hub |
| 78 | Remote Excavation and Terrain Megaworks | 16 | $3,000,000 | Quarry and heavy civil equipment research |
| 79 | Demolition, Salvage and Building Lifecycle | 16 | $2,000,000 | First city district and industrial recycling depot |
| 80 | Artificial Soil Exhaustion Industries | 16 | $4,000,000 | Topsoil survey, industrial farming and mine equipment |
| 81 | Aquifer Networks and Dry-Lake Engineering | 16 | $6,000,000 | Water resource authority and connected pipeline |
| 82 | Atmosphere Laboratories and Carbon Accounting | 16 | $8,000,000 | Global sensor program and first major power station |
| 83 | Storm Meteorology and Weather Prediction | 16 | $10,000,000 | Weather station network across 4 provinces |
| 84 | Emergency Response and Climate Disaster Equipment | 16 | $7,000,000 | First weather-caused breakdown and maintenance garage |
| 85 | Air Pollution Diagnostics and Smog Architecture | 16 | $9,000,000 | Industrial smog witnessed and 2 pollution districts surveyed |
| 86 | Wastewater, Chemical Tracers and Toxic Soils | 16 | $12,000,000 | Chemical factory or sewage works and a wet district |
| 87 | Industrial Thermal Engineering and Heat Stress | 16 | $15,000,000 | Large power network and 2 operating thermal factories |
| 88 | Pollution-Specific World Art and Environmental Scars | 16 | $6,000,000 | Photo mode and first heavily contaminated district |
| 89 | Megacity Foundations and Municipal Utilities | 16 | $20,000,000 | Profitable town and industrial city permit |
| 90 | Skyscrapers, Office Parks and Giant Corporate Buildings | 16 | $30,000,000 | First 20-floor building completed |
| 91 | Industrial City Economy and Consumer Demand | 16 | $22,000,000 | City population economy and 5 operating factories |
| 92 | Roads, Transit, Airports and Port Metropolises | 16 | $18,000,000 | Regional freight and city road authority |
| 93 | Hyperscale Data Center Architecture | 16 | $40,000,000 | Working 150-rack facility and server construction permit |
| 94 | Server Processors, Accelerators and Rack Hardware | 16 | $35,000,000 | Server assembly factory operating and rack commissioning |
| 95 | Immersion, Liquid Cooling and Industrial Water Systems | 16 | $50,000,000 | First liquid cooled rack and cooling water utility |
| 96 | Fiber, Storage Cloud and Compute Workload Markets | 16 | $42,000,000 | Multi-customer workloads and two connected campuses |
| 97 | Data Center Backup and Cascading Failure Engineering | 16 | $38,000,000 | SLA incident and grid storage research |
| 98 | Supergrid and Industrial Power Markets | 16 | $45,000,000 | At least 1 GW dispatch and 3 operating substations |
| 99 | Mega Power Plants, Fuel Industry and Generation Reliability | 16 | $65,000,000 | Large fuel supply and thermal generation permit |
| 100 | Cement, Concrete and Mineral Kiln Empires | 16 | $55,000,000 | Quarry and industrial concrete works |
| 101 | Metallurgy, Steelworks and Industrial Alloy Chains | 16 | $70,000,000 | Ore railway and working metal foundry |
| 102 | Petrochemical, Plastics and Industrial Waste Chains | 16 | $85,000,000 | Licensed fictional chemical industrial complex |
| 103 | Mega Agriculture, Soil Demand and Food Industry | 16 | $32,000,000 | Agricultural district with irrigation and processing |
| 104 | Livestock, Grazing and Desertifying Pastures | 16 | $28,000,000 | Ranch construction and farm vehicle garage |
| 105 | Industrial Research Centers and Experiment Facilities | 16 | $40,000,000 | Research city and 5 advanced manufacturing lines |
| 106 | Regional Industrial Megaprojects | 16 | $80,000,000 | 12 districts owned and cross-province utilities |
| 107 | Cross-Province Automation and Production Intelligence | 16 | $65,000,000 | Regional dispatcher and full factory supply network |
| 108 | Environmental Sensor Mesh and Planetary Statistics | 16 | $55,000,000 | 12 sensor districts, telemetry history and world map |
| 109 | Multi-Medal Strategy and Planetary Completion | 16 | $95,000,000 | At least 4 environmental medals above 80% |
| 110 | Planetary Destruction Visualizer and Cinematics | 16 | $35,000,000 | Game camera, drone surveying and polluted world |
| 111 | Late-Game Industrial Stability and Crisis Management | 16 | $100,000,000 | 12 owned provinces and one severe outage |
| 112 | Final Desert Empire and New Game Plus | 16 | $150,000,000 | Seven medals at 95% and global audit unlocked |

## 95.2 Complete upgrade registry

**Implementation-level contract:** Each row is a different capability, model change, measured process, UI analysis or operational tool. A purchased node must produce an observable change to the exact listed subsystem and pass a dedicated test. For example, a *water leak localization* upgrade must identify real pipe leaks from pressure telemetry; it must not simply display a badge. A 3D building upgrade must unlock, construct and connect the actual mesh/working facility; it must not add fictitious income. Maintain explicit dependencies that unlock tier `n` only after appropriate preceding technology and real gameplay actions; a sequential baseline is acceptable where it does not make gameplay absurdly linear.

### 95.73 — Mythic Butter-Knife Mastery

**New node count:** 16 · **Prototype entry cost:** $1,500,000 · **Capability gate:** First tool preserved and 3 provinces surveyed. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `73-01` | **Silver Picnic Inlay** | $1,500,000 | Add a visible reinforced inlay that raises knife maximum branch hardness. |
| `73-02` | **Dual-Grip Handle** | $2,130,000 | Allow alternating-handed knife attacks with separate stamina cooldowns. |
| `73-03` | **Tree-Bark Resonance Meter** | $3,024,600 | Predict exact remaining manual swipes before a thin bark section yields. |
| `73-04` | **Microserration Forge** | $4,294,900 | Manufacture and swap tiny tooth inserts using steel scrap. |
| `73-05` | **Counterweight Pommel** | $6,098,800 | Shift blade balance to change reach versus striking recovery. |
| `73-06` | **Field Sharpening Drone** | $8,660,300 | Dispatch a drone to restock a carried knife sharpening kit from a depot. |
| `73-07` | **Blade Heat Indicator** | $12,297,600 | Show thermal stress and actual edge damage after sustained manual work. |
| `73-08` | **Sap-Repellent Sheath** | $17,462,600 | Keep blade wear from resin-rich species below its prior measured value. |
| `73-09` | **Hinge-Cut Precision Trial** | $24,796,900 | Unlock a scored challenge for felling trees inside marked corridors. |
| `73-10` | **Ceramic Hybrid Dinner Edge** | $35,211,600 | Require ceramic stock to expand knife-compatible hardwood range. |
| `73-11` | **Fallen-Trunk Surgery** | $50,000,500 | Cut straps and branches off a lodged trunk to free it for physical hauling. |
| `73-12` | **One-Handed Limb Peeler** | $71,000,800 | Enable stripping bark on dragged small logs during movement. |
| `73-13` | **Pocket-Powered Sharpener** | $100,821,100 | Unlock a consumable-battery sharpening minigame in the field. |
| `73-14` | **Highland Handcut Permit** | $143,165,900 | Unlock knife-only contracts on wind-stressed alpine trees. |
| `73-15` | **Original-Knife Hall of Fame** | $203,295,600 | Build a real display pedestal recording the lifetime tree count of the starter tool. |
| `73-16` | **Legendary Last Sapling** | $288,679,800 | Unlock a mechanically real manual finish challenge for the final viable tree. |

**Branch-level verification:** Unlock 73-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.74 — Adaptive Blade and Multi-Tool Engineering

**New node count:** 16 · **Prototype entry cost:** $180,000 · **Capability gate:** Advanced saw workshop and precision contracts. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `74-01` | **Articulated Blade Angle** | $180,000 | Adjust cut approach angle when operating near boulders and roots. |
| `74-02` | **Variable Kerf Profile** | $255,600 | Switch thin/high-precision and wide/high-clearance cut geometries. |
| `74-03` | **Shock-Absorbing Saw Mount** | $363,000 | Reduce tool stall time after hitting dense knots. |
| `74-04` | **Bark Thickness Probe** | $515,400 | Reveal depth of bark before choosing a cutting head. |
| `74-05` | **Integrated Debark Blade** | $731,900 | Perform a separate debark pass without leaving machine seat. |
| `74-06` | **Wetwood Tooth Compound** | $1,039,200 | Extend cutting life specifically on rain-soaked hardwood. |
| `74-07` | **Quick-Swap Carbide Rack** | $1,475,700 | Physically exchange used tooth cartridges at a maintenance bay. |
| `74-08` | **Magnetic Splinter Collector** | $2,095,500 | Capture metal-contaminated offcut fragments into a waste bin. |
| `74-09` | **Automated Cut Plan Overlay** | $2,975,600 | Display optimal graded sections on a selected log mesh. |
| `74-10` | **Stepped Limb Cutter** | $4,225,400 | Cut branch junctions through multiple reachable articulation positions. |
| `74-11` | **Blade Deflection Sensors** | $6,000,100 | Stop feeds when observed bending exceeds tool tolerance. |
| `74-12` | **Jammed-Chain Reverse Gear** | $8,520,100 | Recover a stopped saw through a fuel-consuming reverse cycle. |
| `74-13` | **Parallel Twin-Bar Head** | $12,098,500 | Split very wide logs into two managed segments. |
| `74-14` | **Abrasive Stone-Root Bit** | $17,179,900 | Cut stone-embedded roots without pretending to cut bedrock with steel saw. |
| `74-15` | **Portable Blade Calibration Bench** | $24,395,500 | Restore cut accuracy through a paid field work order. |
| `74-16` | **Universal Tool Head Bus** | $34,641,600 | Share compatible attachments across registered machine chassis. |

**Branch-level verification:** Unlock 74-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.75 — Forest Giants and Hard-to-Reach Extraction

**New node count:** 16 · **Prototype entry cost:** $500,000 · **Capability gate:** Highland logging contract and grapple boom. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `75-01` | **Ancient Crown Survey** | $500,000 | Detect inaccessible tree crowns above normal felling machines. |
| `75-02` | **Twin-Trunk Hinge Study** | $710,000 | Unlock coordinated cuts on paired-root old-growth trees. |
| `75-03` | **Helical Rope Descent** | $1,008,200 | Lower suspended logs in controlled short segments. |
| `75-04` | **Ridge Cable Towers** | $1,431,600 | Build load-bearing 3D cable-yard towers on surveyed ridgelines. |
| `75-05` | **High-Tension Guy Anchors** | $2,032,900 | Expand yarder operating spans where foundation rock permits. |
| `75-06` | **Canopy Grapple Lift** | $2,886,800 | Lift large fallen crown clusters separately from trunk cargo. |
| `75-07` | **Steep-Slope Skid Shoes** | $4,099,200 | Reduce downhill log sled slip on steep tracks. |
| `75-08` | **Cross-Valley Log Shuttle** | $5,820,900 | Carry finite load batches between two properly anchored towers. |
| `75-09` | **Skyline Tension Monitor** | $8,265,600 | Expose actual working load and snap-risk at cable joints. |
| `75-10` | **Slope Stabilization Mat** | $11,737,200 | Lay transportable mats reducing track rutting during hauling. |
| `75-11` | **Wind-Safe Crown Harness** | $16,666,800 | Delay giant-tree felling safely during damaging gusts. |
| `75-12` | **Winch Brake Heat Monitor** | $23,666,900 | Prevent uncontrolled descents by adding active brake cooling time. |
| `75-13` | **High-Capacity Log Cradle** | $33,607,000 | Carry one enormous trunk using a heavy vehicle attachment. |
| `75-14` | **Multi-Winch Synchronizer** | $47,722,000 | Coordinate two machines pulling a single trunk without item duplication. |
| `75-15` | **Old-Growth Recovery Auction** | $67,765,200 | Unlock premium contracts for physically delivered giant logs. |
| `75-16` | **Cloudwood Clearance Operation** | $96,226,600 | Schedule endgame autonomous cleanup on foggy ridge tree pockets. |

**Branch-level verification:** Unlock 75-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.76 — Forest Transport Megafleets

**New node count:** 16 · **Prototype entry cost:** $750,000 · **Capability gate:** At least 5 logging vehicles and 2 regional depots. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `76-01` | **Double-Bogie Logger** | $750,000 | Unlock a longer chassis that requires wider turning radii. |
| `76-02` | **Overlength Load Flagging** | $1,065,000 | Mark oversized cargo and limit allowable route segments. |
| `76-03` | **Low-Gear Terrain Pack** | $1,512,300 | Increase trailer hill-start capability at extra fuel consumption. |
| `76-04` | **Self-Leveling Log Trailer** | $2,147,500 | Reduce rollover risk for unevenly stacked logs. |
| `76-05` | **Gantry Unload Port** | $3,049,400 | Unload compatible trailers using actual overhead cranes. |
| `76-06` | **Yard Traffic Signals** | $4,330,200 | Prevent two logging trucks entering a one-lane choke simultaneously. |
| `76-07` | **Weighted Cargo Scheduler** | $6,148,800 | Assign the nearest capable vehicle based on actual mass. |
| `76-08` | **Articulated Road Train** | $8,731,300 | Link tractor and modular trailers with jointed physics near camera. |
| `76-09` | **Hill Descent Retarder** | $12,398,500 | Add braking heat and safe speed constraints to heavy truck operation. |
| `76-10` | **Quick-Lock Load Bunks** | $17,605,800 | Reduce strap time but require the correct attachment geometry. |
| `76-11` | **Automated Fleet Refuel Queue** | $25,000,300 | Sequence vehicles at stocked fuel stations. |
| `76-12` | **Cold-Weather Starter Kit** | $35,500,400 | Lower failed ignition rates in frosty uplands. |
| `76-13` | **Mud Tire Pressure Mode** | $50,410,500 | Trade pavement wear for low-soil-traction grip. |
| `76-14` | **Regional Truck Ferry** | $71,583,000 | Move heavy cargo across a modeled river on a capacity-limited ferry. |
| `76-15` | **Fleet Accident Review** | $101,647,800 | Show collision, cargo loss and repair history per truck. |
| `76-16` | **Hundred-Truck Dispatch Core** | $144,339,900 | Aggregate distant hauls with exact conserved inventory and logged trips. |

**Branch-level verification:** Unlock 76-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.77 — Rail, Ports, Barges and Freight Airships

**New node count:** 16 · **Prototype entry cost:** $1,500,000 · **Capability gate:** First working train and coastal trade hub. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `77-01` | **Timber Loading Siding** | $1,500,000 | Build a low-speed rail spur and physical car loader. |
| `77-02` | **Rotary Log Crane** | $2,130,000 | Rotate and place logs onto compatible wagon bunks. |
| `77-03` | **Switch Yard Interlocks** | $3,024,600 | Prevent unsafe simultaneous occupation of a track junction. |
| `77-04` | **Heavy Ore Unit Train** | $4,294,900 | Move high-mass mineral loads with axle-weight constraints. |
| `77-05` | **Container Transload Gantry** | $6,098,800 | Transfer standardized crates among train, truck and ship. |
| `77-06` | **Barge Draft Monitor** | $8,660,300 | Calculate how loaded cargo affects legal channel depth. |
| `77-07` | **River Tug Wake** | $12,297,600 | Model tug pushing cargo barges through a flow-speed penalty. |
| `77-08` | **Seaport Tide Scheduler** | $17,462,600 | Restrict selected dock movements during low-water windows. |
| `77-09` | **Cold Chain Warehouse** | $24,796,900 | Enable refrigerated crop cargo at measured electric cost. |
| `77-10` | **Rail Electrification** | $35,211,600 | Power train movement from connected grid rather than free diesel replacement. |
| `77-11` | **Bulk Ash Hopper Car** | $50,000,500 | Transport ash/slag without treating it as clean lumber. |
| `77-12` | **Ferry Port Crane** | $71,000,800 | Ship full machinery between separated industrial shores. |
| `77-13` | **Cargo Airship Hangar** | $100,821,100 | Build a huge 3D airship for costly low-road-access cargo. |
| `77-14` | **Airborne Heavy Lift Rig** | $143,165,900 | Move one large component using high fuel and weather limits. |
| `77-15` | **Seaport Customs Contracts** | $203,295,600 | Unlock export orders with container inspection and fee. |
| `77-16` | **Global Freight Control Room** | $288,679,800 | Compare throughput and bottlenecks across all owned hubs. |

**Branch-level verification:** Unlock 77-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.78 — Remote Excavation and Terrain Megaworks

**New node count:** 16 · **Prototype entry cost:** $3,000,000 · **Capability gate:** Quarry and heavy civil equipment research. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `78-01` | **Bucket-Wheel Mine Face** | $3,000,000 | Excavate a wide open-pit face with finite strata accounting. |
| `78-02` | **Continuous Spoil Conveyor** | $4,260,000 | Send excavated overburden into a real stockpile route. |
| `78-03` | **Interchangeable Rock Tooth** | $6,049,200 | Mount geological-specific cutter heads on a large digger. |
| `78-04` | **Heavy Dragline Mast** | $8,589,900 | Build a wide-reach crane requiring stability foundations. |
| `78-05` | **Deep-Cut Grader Blade** | $12,197,600 | Strip defined depth increments from a marked terrain polygon. |
| `78-06` | **Autonomous Scraper Pair** | $17,320,600 | Coordinate two graders on non-overlapping strips. |
| `78-07` | **Tailings Containment Berm** | $24,595,300 | Store mine waste on actual ground footprint, with breach risk. |
| `78-08` | **Bench Elevation Planner** | $34,925,300 | Lay out stepped mine terraces with slope and truck routing. |
| `78-09` | **Overburden Density Sensor** | $49,593,900 | Estimate bulk mass before choosing a hauler. |
| `78-10` | **Rock Crusher Chute** | $70,423,300 | Break stone into recipe-specific aggregate with power draw. |
| `78-11` | **Mineral Sorting Trommel** | $100,001,100 | Mechanically separate material grades and reject streams. |
| `78-12` | **Foundation Breaker Head** | $142,001,500 | Dismantle failed concrete foundations into recoverable rubble. |
| `78-13` | **Tunnel Portal Support** | $201,642,200 | Enable specific industrial tunnels and their ventilation loads. |
| `78-14` | **High-Wall Slope Alarm** | $286,331,900 | Pause mining near imminent fictional wall failure. |
| `78-15` | **Mine-To-Rail Loader** | $406,591,300 | Load sorted ore into compatible rolling stock. |
| `78-16` | **Province-Scale Earthworks Planner** | $577,359,600 | Author real multi-day equipment tasks for surveyed districts. |

**Branch-level verification:** Unlock 78-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.79 — Demolition, Salvage and Building Lifecycle

**New node count:** 16 · **Prototype entry cost:** $2,000,000 · **Capability gate:** First city district and industrial recycling depot. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `79-01` | **Deconstruction Permit Desk** | $2,000,000 | Allow permitted removal of owned derelict structures. |
| `79-02` | **Salvage Material Scanner** | $2,840,000 | Reveal recoverable steel, concrete, copper and wood per building. |
| `79-03` | **Hydraulic Concrete Shear** | $4,032,800 | Separate structural concrete into tracked chunks. |
| `79-04` | **Steel Beam Unscrewer** | $5,726,600 | Recover high-grade steel from prefabricated frames. |
| `79-05` | **Modular Floor Removal** | $8,131,700 | Take down upper levels in staged sections rather than instant deletion. |
| `79-06` | **Building Stabilization Props** | $11,547,100 | Permit selective dismantling without total collapse. |
| `79-07` | **Salvage Conveyor Line** | $16,396,800 | Route dismantled pieces to a recycler with measured throughput. |
| `79-08` | **Glass Recovery Vacuum** | $23,283,500 | Extract pane units as high-grade material before demolition. |
| `79-09` | **Pipe Drain-Down Pump** | $33,062,600 | Recover contained fluid before disconnecting a utility network. |
| `79-10` | **Cable Stripper Facility** | $46,948,900 | Convert removed high-voltage cable into copper scrap and waste. |
| `79-11` | **Rebar Separator** | $66,667,400 | Improve steel recovery from concrete rubble using energy. |
| `79-12` | **Asbestos-Like Fictional Hazard Survey** | $94,667,700 | Require abstract protective equipment and proper waste handling. |
| `79-13` | **Controlled Structural Failure Mode** | $134,428,100 | Simulate non-explosive mechanical collapse from removed supports. |
| `79-14` | **Relocation Crane Rig** | $190,887,900 | Move compatible small structures intact to another foundation. |
| `79-15` | **Urban Rebuild Auction** | $271,060,900 | Sell materials from decommissioned city infrastructure. |
| `79-16` | **Abandoned Skyline Clearance** | $384,906,400 | Coordinate late-game removal of obsolete, unprofitable buildings. |

**Branch-level verification:** Unlock 79-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.80 — Artificial Soil Exhaustion Industries

**New node count:** 16 · **Prototype entry cost:** $4,000,000 · **Capability gate:** Topsoil survey, industrial farming and mine equipment. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `80-01` | **Deep Soil Core Archive** | $4,000,000 | Measure fertility by depth rather than only surface color. |
| `80-02` | **Mechanical Topsoil Peeler** | $5,680,000 | Separate upper fertile layer into measured transportable loads. |
| `80-03` | **Erosion Gully Simulator** | $8,065,600 | Predict where bare soil will wash away during storms. |
| `80-04` | **Industrial Soil Drying Pad** | $11,453,200 | Evaporate stored wet soil with purchased energy input. |
| `80-05` | **Heavy Land Compactor** | $16,263,500 | Reduce infiltration capacity on specifically treated cells. |
| `80-06` | **Salt Concentration Pond** | $23,094,100 | Evaporate saline industrial water into recoverable salt loads. |
| `80-07` | **Rock Flour Deposit Line** | $32,793,700 | Spread inert crushed stone over a bounded earthworks site. |
| `80-08` | **Nutrient Export Hopper** | $46,567,000 | Sell collected fertile soil amendments as a finite commodity. |
| `80-09` | **Controlled Grass Removal** | $66,125,200 | Task mowers/brush machines to remove remaining biomass before grading. |
| `80-10` | **Substrate Moisture Bypass** | $93,897,700 | Route rain runoff around an existing construction pad to a tracked channel. |
| `80-11` | **Arid Crust Roller** | $133,334,800 | Mechanically compact exposed mineral soil with durable vehicle track effects. |
| `80-12` | **Eroded Bank Survey** | $189,335,400 | Detect washed sediment that has created new fertile pockets. |
| `80-13` | **Sediment Freight Loader** | $268,856,200 | Recover displaced sediment from wetland-like reservoirs. |
| `80-14` | **Floodplain Soil Recovery Alert** | $381,775,900 | Identify source-based soil rejuvenation that threatens D6. |
| `80-15` | **Deep-Sterility Inspection Probe** | $542,121,700 | Test subsoil layers below paving and buildings. |
| `80-16` | **Last Fertile Square Meter Team** | $769,812,900 | Send machines to precisely identified remaining soil-health blockers. |

**Branch-level verification:** Unlock 80-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.81 — Aquifer Networks and Dry-Lake Engineering

**New node count:** 16 · **Prototype entry cost:** $6,000,000 · **Capability gate:** Water resource authority and connected pipeline. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `81-01` | **Aquifer Tracer Test** | $6,000,000 | Identify which wells share a hydrological reservoir. |
| `81-02` | **Confined Basin Piezometer** | $8,520,000 | Measure underground pressure and predict connected drawdown. |
| `81-03` | **Submersible Pump Overhaul** | $12,098,400 | Raise reliable duty cycle with purchased replacement components. |
| `81-04` | **Multi-Well Collection Manifold** | $17,179,700 | Combine actual well outflows through a capacity-limited pipe. |
| `81-05` | **Pipeline Leak Localization** | $24,395,200 | Find underground leak coordinates using pressure differences. |
| `81-06` | **Water Hammer Arrestor** | $34,641,200 | Lower burst risk during rapid industrial valve closures. |
| `81-07` | **Solar Evaporation Channel** | $49,190,500 | Carry shallow surface water toward a tracked evaporation facility. |
| `81-08` | **Mudflat Vehicle Track** | $69,850,500 | Allow specialized equipment to traverse newly exposed soft lakebeds. |
| `81-09` | **Deep Basin Pump Platform** | $99,187,700 | Keep intake operating when lake level falls below original shore. |
| `81-10` | **River Source Gauge Network** | $140,846,600 | Show upstream runoff and downstream flow separately. |
| `81-11` | **Industrial Cooling Water Auction** | $200,002,200 | Sell finite treated water to neighboring modeled data centers. |
| `81-12` | **Reservoir Sediment Excavation** | $284,003,100 | Remove sludge without treating it as water disappearance. |
| `81-13` | **Headwater Capture Pipeline** | $403,284,400 | Connect upland freshwater stock to large industrial consumers. |
| `81-14` | **Salt Flat Consolidation Roller** | $572,663,800 | Prepare dried beds for stable desert status after hydrological drying. |
| `81-15` | **Aquifer Source/Sink Inspector** | $813,182,600 | Trace rainfall recharge, extraction, leaks and industrial returns. |
| `81-16` | **Final Freshwater Auditor** | $1,154,719,300 | Enumerate remaining real freshwater stores and reachable depletion equipment. |

**Branch-level verification:** Unlock 81-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.82 — Atmosphere Laboratories and Carbon Accounting

**New node count:** 16 · **Prototype entry cost:** $8,000,000 · **Capability gate:** Global sensor program and first major power station. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `82-01` | **Stack CO2 Mass Flowmeter** | $8,000,000 | Report actual carbon output per connected emitting chimney. |
| `82-02` | **Mobile Carbon Survey Van** | $11,360,000 | Sample local modeled air fields along traversed roads. |
| `82-03` | **Continuous Baseline Recorder** | $16,131,200 | Maintain separate natural baseline and industrial change traces. |
| `82-04` | **Facility Carbon Attribution** | $22,906,300 | Allocate power-grid carbon to each consuming industry. |
| `82-05` | **Fuel Quality Carbon Tags** | $32,527,000 | Track carbon content differences between fictional fuel commodities. |
| `82-06` | **Land Carbon Ledger** | $46,188,300 | Deduct surviving forest and soil carbon sinks from atmospheric gains. |
| `82-07` | **Flue Calibration Protocol** | $65,587,300 | Prevent anomalous emissions readings from failed sensors. |
| `82-08` | **Thermal Plume Anemometer** | $93,134,000 | Relate winds to dispersion and tower plume geometry. |
| `82-09` | **Regional Carbon Observatory** | $132,250,300 | Install permanent linked carbon monitors in a district. |
| `82-10` | **High-Stack Flow Visualization** | $187,795,500 | Show source-specific colored tracer paths from a working chimney. |
| `82-11` | **Carbon Price Scenario Planner** | $266,669,600 | Project future business cost if fictional regulation events occur. |
| `82-12` | **Global Carbon Budget Curve** | $378,670,800 | Compare observed historical emissions with remaining D4 threshold. |
| `82-13` | **Grid-Emission Factor Meter** | $537,712,500 | Show CO2-equivalent per electricity unit by dispatched source. |
| `82-14` | **Carbon Capture Inventory Screen** | $763,551,700 | Count captured and stored carbon mass rather than invisibly subtracting it. |
| `82-15` | **Industrial Emission Routing Console** | $1,084,243,500 | Identify fuel-starved plants and the physical logistics causing D4 slowdowns. |
| `82-16` | **Final Carbon Stability Analyzer** | $1,539,625,700 | Predict whether active emission/sink balance can hold D4 over the audit window. |

**Branch-level verification:** Unlock 82-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.83 — Storm Meteorology and Weather Prediction

**New node count:** 16 · **Prototype entry cost:** $10,000,000 · **Capability gate:** Weather station network across 4 provinces. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `83-01` | **Doppler-Like Rain Mapper** | $10,000,000 | Estimate the position and intensity of approaching rain bands. |
| `83-02` | **Lightning Strike Triangulation** | $14,200,000 | Calculate probable impact sector from multiple observed strikes. |
| `83-03` | **Pressure Gradient Board** | $20,164,000 | Display storm-front travel direction from sampled pressure stations. |
| `83-04` | **Anemometer Tower Grid** | $28,632,900 | Unlock persistent wind measurements throughout active districts. |
| `83-05` | **Cloud-Base Lidar** | $40,658,700 | Estimate modeled low-cloud altitude and fog forecast confidence. |
| `83-06` | **Highland Frost Alarm** | $57,735,300 | Warn connected transport routes before icy surfaces develop. |
| `83-07` | **Flood Arrival Calculator** | $81,984,200 | Forecast river rise from upstream rainfall and terrain grade. |
| `83-08` | **Dry-Lightning Watch** | $116,417,500 | Highlight storm regions prone to fire without significant rain. |
| `83-09` | **Tornado Signature Detector** | $165,312,900 | Mark risky rotating storm cells with uncertainty bounds. |
| `83-10` | **Severe Wind Crane Lockout** | $234,744,300 | Auto-pause tower cranes above their rated gust speed. |
| `83-11` | **Harbor Storm Closure** | $333,336,900 | Suspend ship loading only while the simulated forecast exceeds harbor limits. |
| `83-12` | **Regional Forecast Replay** | $473,338,500 | Rewatch weather fields and event causes over the last simulation month. |
| `83-13` | **Forecast Model Ensemble** | $672,140,600 | Compare three internally seeded weather forecast estimates. |
| `83-14` | **Industrial Microclimate Station** | $954,439,700 | Separate building waste heat from ambient temperature reading. |
| `83-15` | **Storm Damage Prebudget** | $1,355,304,300 | Estimate expected repair part consumption from forecast severity. |
| `83-16` | **World Weather Operations Center** | $1,924,532,100 | Route sensor-backed forecasts to all 576 districts. |

**Branch-level verification:** Unlock 83-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.84 — Emergency Response and Climate Disaster Equipment

**New node count:** 16 · **Prototype entry cost:** $7,000,000 · **Capability gate:** First weather-caused breakdown and maintenance garage. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `84-01` | **Wildfire Perimeter Radar** | $7,000,000 | Track the actual spreading fire front around owned depots. |
| `84-02` | **Tracked Firebreak Plow** | $9,940,000 | Strip narrow mineral barriers using fuel and soil disturbance. |
| `84-03` | **Emergency Water Tank Truck** | $14,114,800 | Haul measured water loads to protect critical assets. |
| `84-04` | **Lightning Surge Fuse Kit** | $20,043,000 | Replace burnt substation fuses with tracked parts. |
| `84-05` | **Flood Roadside Pumps** | $28,461,100 | Drain road floodwater into a valid adjacent water storage or flow channel. |
| `84-06` | **Storm-Proof Cargo Tarps** | $40,414,700 | Reduce exposure damage to wood stacks during heavy rain. |
| `84-07` | **Crane Boom Storm Stow** | $57,388,900 | Lower a crane boom and suspend work during dangerous wind. |
| `84-08` | **Backup Server Ventilation** | $81,492,300 | Keep a limited set of racks thermally safe during outage. |
| `84-09` | **Emergency Bridge Span** | $115,719,000 | Deploy a temporary finite-tonnage bridge across washed-out road. |
| `84-10` | **Dust-Filter Changeout Trailer** | $164,321,000 | Deliver fresh filters to exposed cooling equipment. |
| `84-11` | **Portable Grid Microplant** | $233,335,900 | Supply finite fuel-backed emergency power to isolated districts. |
| `84-12` | **Compensated Dispatch Queue** | $331,336,900 | Shift work orders around a temporary weather closure. |
| `84-13` | **City Evacuation Simulation Plan** | $470,498,400 | Reduce abstract productivity loss without modeling individual harm. |
| `84-14` | **Post-Storm Timber Salvage** | $668,107,800 | Reclassify fallen trees into recoverable graded log stock. |
| `84-15` | **Disaster Insurance Claims Engine** | $948,713,000 | Compute actual covered asset loss and deductibles from records. |
| `84-16` | **Regional Recovery Commander** | $1,347,172,500 | Prioritize repair, salvage, utility restart and critical freight after storms. |

**Branch-level verification:** Unlock 84-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.85 — Air Pollution Diagnostics and Smog Architecture

**New node count:** 16 · **Prototype entry cost:** $9,000,000 · **Capability gate:** Industrial smog witnessed and 2 pollution districts surveyed. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `85-01` | **Particulate Size Analyzer** | $9,000,000 | Separate simulated PM-fine and coarse-dust map values. |
| `85-02` | **Source Fingerprint Filter** | $12,780,000 | Match pollution traces to logged plant and vehicle emitter classes. |
| `85-03` | **Ground-Layer Smog Sensor** | $18,147,600 | Measure near-surface inversion concentrations independently of stack output. |
| `85-04` | **Wind-Borne Ash Counter** | $25,769,600 | Count deposition of visible ash onto registered industrial grounds. |
| `85-05` | **Soot Building Stain Study** | $36,592,800 | Tie procedural wall darkening intensity to accumulated soot per building. |
| `85-06` | **Long-Distance Plume Camera** | $51,961,800 | Visualize industrial clouds over multiple world chunks as 3D volumes. |
| `85-07` | **Industrial Stack Draft Monitor** | $73,785,800 | Reveal throughput penalties caused by clogged flue systems. |
| `85-08` | **Inversion Threshold Alarm** | $104,775,800 | Warn when forecast weather will trap pollution in a basin. |
| `85-09` | **Sulfur Compound Analyzer** | $148,781,600 | Expose acidifying emissions and corrosion risk separately. |
| `85-10` | **Metro Air Quality Board** | $211,269,900 | Connect population/occupancy impacts to real nearby modeled air. |
| `85-11` | **Pollution Dispersion Simulator** | $300,003,200 | Preview bounded plume movement under current wind field. |
| `85-12` | **Cross-Basin Dust Tracing** | $426,004,600 | Track named mineral dust across mountain passes. |
| `85-13` | **Regional Soot Registry** | $604,926,500 | Reconcile emitted soot with air storage, deposition and cleanup. |
| `85-14` | **Zero-Emission Detectability Test** | $858,995,700 | Alert if a visually smoking plant has zero logged source emissions. |
| `85-15` | **Pollution Source Ranking** | $1,219,773,900 | List the top fifty emitting active facilities by pollutant and period. |
| `85-16` | **Final Clean-Air Pocket Scanner** | $1,732,078,900 | Locate districts with pollution metrics below the D5 threshold. |

**Branch-level verification:** Unlock 85-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.86 — Wastewater, Chemical Tracers and Toxic Soils

**New node count:** 16 · **Prototype entry cost:** $12,000,000 · **Capability gate:** Chemical factory or sewage works and a wet district. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `86-01` | **Runoff Sampling Sampler** | $12,000,000 | Inspect local modeled effluent chemistry at a river-bank point. |
| `86-02` | **Oil Slick Thickness Gauge** | $17,040,000 | Measure slick volume on an existing water surface mesh. |
| `86-03` | **Metal Dust Core Assay** | $24,196,800 | Distinguish mine-tainted soils from normal iron-rich red sand. |
| `86-04` | **Sewage Ledger Gate** | $34,359,500 | Meter real city waste inflow to a processing plant. |
| `86-05` | **Leachate Migration Solver** | $48,790,400 | Move landfill contamination through adjacent compatible soil strata. |
| `86-06` | **Chemical Sludge Tankers** | $69,282,400 | Haul measured toxic waste barrels to accepted disposal industries. |
| `86-07` | **Industrial Pond Liner** | $98,381,000 | Prevent one storage pond from leaking, changing contamination trajectories. |
| `86-08` | **Effluent Mixing Audit** | $139,701,000 | Separate clean cooling return flow from polluted process discharge. |
| `86-09` | **Factory Drainage Connection** | $198,375,500 | Route plant output only through built water network edges. |
| `86-10` | **Contamination-Layer Map** | $281,693,200 | Display oil, metal, chemicals and organic waste independently. |
| `86-11` | **Storm Washout Recorder** | $400,004,300 | Log which pollutants moved from air into river sediment during rain. |
| `86-12` | **Pond Sediment Dredger** | $568,006,100 | Recover contaminated solids with a heavy energy-consuming excavator. |
| `86-13` | **Industrial Salt Crystal Harvester** | $806,568,700 | Convert evaporated high-salinity water into bagged salt goods. |
| `86-14` | **Polluted Ground Stockpile** | $1,145,327,600 | Store excavated toxic soils as physical cargo without deleting toxicity. |
| `86-15` | **Chemical Facility Inspection** | $1,626,365,200 | Block fraudulent revenue from a machine missing required waste storage. |
| `86-16` | **Last Clean Ground Inspector** | $2,309,438,600 | Identify low-contamination districts blocking global D5 coverage. |

**Branch-level verification:** Unlock 86-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.87 — Industrial Thermal Engineering and Heat Stress

**New node count:** 16 · **Prototype entry cost:** $15,000,000 · **Capability gate:** Large power network and 2 operating thermal factories. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `87-01` | **Waste Heat Flux Probe** | $15,000,000 | Show actual MW of thermal waste around industrial buildings. |
| `87-02` | **Cooling Water Heat Ledger** | $21,300,000 | Measure heat carried into and out of process-water loops. |
| `87-03` | **Thermal Stack Exit Monitor** | $30,246,000 | Attribute hot exhaust to each active industrial stack. |
| `87-04` | **Urban Canyon Thermometer** | $42,949,300 | Track skyscraper heat retention under low wind conditions. |
| `87-05` | **Ground Conduction Scanner** | $60,988,000 | Display heat moving into soil beneath a working plant. |
| `87-06` | **Hot-Air District Ducts** | $86,603,000 | Route a bounded quantity of waste heat along installed utility corridors. |
| `87-07` | **Pipe Insulation Degrader** | $122,976,300 | Simulate ageing thermal losses in long-distance heat lines. |
| `87-08` | **Heat-Exchanger Surface Upgrade** | $174,626,300 | Increase heat transfer capacity while adding maintenance load. |
| `87-09` | **Regional Thermal Link** | $247,969,400 | Connect two neighboring districts through finite-capacity heat piping. |
| `87-10` | **Industrial Heat Island Map** | $352,116,500 | Separate city pavement heat from generator exhaust. |
| `87-11` | **Thermal Storage Silos** | $500,005,400 | Store part of collected heat for later industrial demand. |
| `87-12` | **Cooling Tower Thermal Signature** | $710,007,700 | Show actual plume and local heat at evaporation machinery. |
| `87-13` | **Heat-Wave Work Shifts** | $1,008,210,900 | Reschedule vulnerable equipment operating hours based on temperature. |
| `87-14` | **Deep Rock Temperature Probe** | $1,431,659,500 | Read geology-limited ground thermal storage characteristics. |
| `87-15` | **Heat Stability Forecast** | $2,032,956,500 | Predict which provinces can maintain D7 over the audit window. |
| `87-16` | **Last Cool Province Investigator** | $2,886,798,200 | Identify missing operational heat sources or storm effects blocking D7. |

**Branch-level verification:** Unlock 87-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.88 — Pollution-Specific World Art and Environmental Scars

**New node count:** 16 · **Prototype entry cost:** $6,000,000 · **Capability gate:** Photo mode and first heavily contaminated district. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `88-01` | **Sooted Brick Material Pack** | $6,000,000 | Change real building mesh materials by accumulated soot depth. |
| `88-02` | **Acid-Stained Steelwork** | $8,520,000 | Render procedural corrosion based on sulfur exposure. |
| `88-03` | **Rust-Red Mining Dust** | $12,098,400 | Assign iron-dust deposition to roads and machine surfaces. |
| `88-04` | **White Salt Flat Tessellation** | $17,179,700 | Generate raised salt crust geometry on dried basin cells. |
| `88-05` | **Black Ash Dune Kit** | $24,395,200 | Morph wind-deposited ash into low relief dune meshes. |
| `88-06` | **Oil Streak Wetness** | $34,641,200 | Add physically located sheen/material overlays on contaminated 3D water. |
| `88-07` | **Dry River Scar Mesh** | $49,190,500 | Reveal formerly underwater sediment slopes as river water falls. |
| `88-08` | **Shrunken Reservoir Buoys** | $69,850,500 | Leave grounded navigation buoys on exposed lakebeds. |
| `88-09` | **Heat-Warp Material Nodes** | $99,187,700 | Apply view-dependent refractive shimmer over real hot equipment. |
| `88-10` | **Cracked Clay Displacement** | $140,846,600 | Increase actual local ground fissure relief as moisture falls. |
| `88-11` | **Dust-Swept Road Edges** | $200,002,200 | Accumulate transport-dependent 3D sand piles on low-traffic shoulders. |
| `88-12` | **Smog-Lit City Skyline** | $284,003,100 | Alter streetlight scattering by local modeled pollutant concentration. |
| `88-13` | **Dead Canopy Remnants** | $403,284,400 | Preserve 3D dead limbs during tree-collapse phases. |
| `88-14` | **Industrial Night Glow** | $572,663,800 | Render dynamic power-backed facility and skyline lighting after dark. |
| `88-15` | **Before/After Geological Lens** | $813,182,600 | Compare two saved 3D terrain snapshots at the same camera angle. |
| `88-16` | **Planetary Collapse Cinematic Camera** | $1,154,719,300 | Unlock deterministic camera paths across verified major ruined landscapes. |

**Branch-level verification:** Unlock 88-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.89 — Megacity Foundations and Municipal Utilities

**New node count:** 16 · **Prototype entry cost:** $20,000,000 · **Capability gate:** Profitable town and industrial city permit. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `89-01` | **Mass Foundation Survey** | $20,000,000 | Check multi-building soil strata and flood risk before zoning. |
| `89-02` | **Underground Utility Duct Bank** | $28,400,000 | Build shared power/water/fiber conduits with finite capacity. |
| `89-03` | **High-Density Road Junction** | $40,328,000 | Resolve modeled vehicle paths through a crowded avenue. |
| `89-04` | **District Sewage Lift Station** | $57,265,800 | Route measured waste output uphill at MW cost. |
| `89-05` | **Municipal Water Metering** | $81,317,400 | Charge occupied buildings for their actual network water use. |
| `89-06` | **Residential Occupancy Contract** | $115,470,700 | Unlock rent income based on filled floor area and jobs. |
| `89-07` | **City Streetlight Grid** | $163,968,400 | Power distinct nighttime meshes and deduct electricity. |
| `89-08` | **Commercial Elevator Cores** | $232,835,100 | Increase usable tower floors at higher energy cost. |
| `89-09` | **Skybridge Connector** | $330,625,800 | Connect supported high-rise buildings as real traversable geometry. |
| `89-10` | **Urban Freight Curb Management** | $469,488,600 | Time-limit heavy deliveries in congested dense districts. |
| `89-11` | **Waste Transfer Terminal** | $666,673,900 | Collect city waste from connected buildings into physical containers. |
| `89-12` | **High-Rise Fire Utility** | $946,676,900 | Add paid sprinkler/water service required by selected office towers. |
| `89-13` | **Metro Transit Spur** | $1,344,281,200 | Reduce worker commuter congestion between two linked stations. |
| `89-14` | **District City Services Budget** | $1,908,879,300 | Set operational spending affecting rent and occupancy. |
| `89-15` | **High-Rise Renovation Permit** | $2,710,608,600 | Retrofit a tower while retaining structural and inventory record. |
| `89-16` | **Metropolitan Works Department** | $3,849,064,300 | Plan coordinated urban construction projects across districts. |

**Branch-level verification:** Unlock 89-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.90 — Skyscrapers, Office Parks and Giant Corporate Buildings

**New node count:** 16 · **Prototype entry cost:** $30,000,000 · **Capability gate:** First 20-floor building completed. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `90-01` | **Steel Core Tower Blueprint** | $30,000,000 | Unlock a 40-floor building requiring delivered steel modules. |
| `90-02` | **Multi-Tower Podium** | $42,600,000 | Share a built commercial base between adjacent compatible towers. |
| `90-03` | **Curtain Wall Panel Factory** | $60,492,000 | Produce visible glass wall assemblies for tower exteriors. |
| `90-04` | **Office Floor Plate Optimizer** | $85,898,600 | Increase rentable space within the existing building footprint. |
| `90-05` | **Vertical Freight Elevator** | $121,976,100 | Lift construction material to upper levels at measurable kWh cost. |
| `90-06` | **Penthouse Utility Plant** | $173,206,000 | Host HVAC modules on the roof with distinct rooftop meshes. |
| `90-07` | **Mechanical Floor Intervals** | $245,952,500 | Add building service floors required for extremely tall structures. |
| `90-08` | **Skyline Advertising Contract** | $349,252,600 | Earn sign revenue from a powered illuminated facade. |
| `90-09` | **Corporate Data Suite** | $495,938,700 | Sell office connectivity requiring nearby installed fiber capacity. |
| `90-10` | **Parking Stack Building** | $704,233,000 | Consolidate 3D city vehicle parking onto a smaller land footprint. |
| `90-11` | **Office Tower Redevelopment** | $1,000,010,800 | Change building use with material/permit and occupancy downtime. |
| `90-12` | **Eighty-Story Residential Frame** | $1,420,015,400 | Unlock residential megatowers and their water demand. |
| `90-13` | **Hundred-Story Corporate Spire** | $2,016,421,800 | Construct true tall tower geometry with staged cranes. |
| `90-14` | **Two-Hundred-Story Fictional Megatower** | $2,863,319,000 | Unlock a landmark-scale tower with extreme supply demands. |
| `90-15` | **Skyline Wind Load Analyzer** | $4,065,912,900 | Track severe-weather structural derating of tallest towers. |
| `90-16` | **Capital City Portfolio Board** | $5,773,596,400 | Aggregate occupancy, utility load, taxes, maintenance and profit across owned skylines. |

**Branch-level verification:** Unlock 90-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.91 — Industrial City Economy and Consumer Demand

**New node count:** 16 · **Prototype entry cost:** $22,000,000 · **Capability gate:** City population economy and 5 operating factories. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `91-01` | **Job Market Survey** | $22,000,000 | Display which factory jobs are unfilled by current city labor pool. |
| `91-02` | **Residential Commuter Graph** | $31,240,000 | Route worker trips over the actual transport network. |
| `91-03` | **Retail Demand Classifier** | $44,360,800 | Separate food, furniture, electronics and service demand. |
| `91-04` | **Commercial Lease Registry** | $62,992,300 | Track each rentable building's occupancy and periodic payments. |
| `91-05` | **Service District Warehouse** | $89,449,100 | Supply offices and housing with real delivery shipments. |
| `91-06` | **City Tax Ledger** | $127,017,700 | Collect bounded tax revenue from operating businesses and occupied buildings. |
| `91-07` | **Shopfront Refurbishment Shop** | $180,365,200 | Manufacture saleable storefront fixtures in a functioning factory. |
| `91-08` | **Public Transit Ticketing** | $256,118,600 | Produce transit revenue tied to boarded simulated passengers. |
| `91-09` | **Industrial Park Recruitment** | $363,688,400 | Attract fictional companies when power/logistics/land conditions qualify. |
| `91-10` | **Housing Supply Forecast** | $516,437,500 | Predict rent pressure and new construction viability from household counts. |
| `91-11` | **City Logistics Price Signals** | $733,341,300 | Raise delivery costs when traffic exceeds network capacity. |
| `91-12` | **Water-Rationed Rent Model** | $1,041,344,600 | Reduce occupancy value under measured municipal shortages. |
| `91-13` | **Pollution Discount Factor** | $1,478,709,300 | Lower office rents in high-smog districts based on live air quality. |
| `91-14` | **Festival Freight Demand** | $2,099,767,300 | Generate periodic high-volume goods contracts tied to stocked shops. |
| `91-15` | **Urban Bankruptcy Resolution** | $2,981,669,500 | Repurpose a failed complex through salvage instead of deleting city records. |
| `91-16` | **Economic Skyline Report** | $4,233,970,700 | Rank buildings by true profit, emissions, pollution and resource use per m². |

**Branch-level verification:** Unlock 91-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.92 — Roads, Transit, Airports and Port Metropolises

**New node count:** 16 · **Prototype entry cost:** $18,000,000 · **Capability gate:** Regional freight and city road authority. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `92-01` | **Four-Lane Industrial Boulevard** | $18,000,000 | Expand a congested road using paid paving and survey work. |
| `92-02` | **Multi-Level Freight Interchange** | $25,560,000 | Build 3D elevated ramps with height-specific clearances. |
| `92-03` | **Bridge Live-Load Sensor** | $36,295,200 | Restrict loaded trucks based on bridge rated capacity. |
| `92-04` | **Urban Tunnel Ventilation** | $51,539,200 | Allow underground traffic routes at measurable fan MW and service costs. |
| `92-05` | **Container Truck Appointment App** | $73,185,600 | Reduce empty dock queues using real reservation times. |
| `92-06` | **Overhead Cargo Monorail** | $103,923,600 | Move standardized industrial containers on elevated fixed rails. |
| `92-07` | **Electric Freight Charger Bank** | $147,571,500 | Refill fleet batteries from connected grid substations. |
| `92-08` | **Airport Runway Grading** | $209,551,600 | Build a usable long airstrip with dirt/concrete inputs. |
| `92-09` | **Air Freight Dispatch Tower** | $297,563,200 | Schedule takeoff windows and affected weather constraints. |
| `92-10` | **Aircraft Fuel Farm** | $422,539,800 | Supply flights from finite stored fuel stock. |
| `92-11` | **Marine Bulk Terminal** | $600,006,500 | Import and export aggregates at ship berth throughput rates. |
| `92-12` | **Dockside Shore Power** | $852,009,200 | Supply moored vessels from local grid rather than onboard fuel. |
| `92-13` | **Customs Scanning Hangar** | $1,209,853,100 | Inspect high-value cargo and prevent invalid contract claims. |
| `92-14` | **Coastal Drydock Fabricator** | $1,717,991,400 | Build larger cargo vessels from real steel/modules. |
| `92-15` | **Multi-Modal Shipping Exchange** | $2,439,547,800 | Assign contracts to truck/rail/ship/air by time and cost. |
| `92-16` | **Transport Emissions Audit** | $3,464,157,800 | Attribute cargo transport fuel burn to each route and destination. |

**Branch-level verification:** Unlock 92-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.93 — Hyperscale Data Center Architecture

**New node count:** 16 · **Prototype entry cost:** $40,000,000 · **Capability gate:** Working 150-rack facility and server construction permit. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `93-01` | **Long-Span Server Hall Frame** | $40,000,000 | Build wider data halls from actual assembled steel beams. |
| `93-02` | **Stackable Server Mezzanine** | $56,800,000 | Place a second cooled rack level with rated support structure. |
| `93-03` | **High-Voltage Intake Yard** | $80,656,000 | Connect campus to a higher-capacity grid feeder. |
| `93-04` | **Dense Rack Floor Load Rating** | $114,531,500 | Raise allowed server mass per raised-floor bay after reinforcement. |
| `93-05` | **Modular Data Hall Pod** | $162,634,800 | Construct repeatable 3D pretested server room modules. |
| `93-06` | **Campus Thermal Corridor** | $230,941,400 | Route hot and cold air through physically linked building ducts. |
| `93-07` | **Rack Aisle Service Robot** | $327,936,700 | Move replacement components between active racks and stocked depots. |
| `93-08` | **Cable Ladder Megagrid** | $465,670,200 | Support long overhead fiber and power paths with connector constraints. |
| `93-09` | **N+1 Facility Shell** | $661,251,600 | Build one redundant cooling/power hall that actually backs up a peer. |
| `93-10` | **Dual-Service Campus Entry** | $938,977,300 | Accept deliveries at two real loading bays with independent access. |
| `93-11` | **Underground Compute Vault** | $1,333,347,800 | Build an insulated service floor with measured pumping/cooling needs. |
| `93-12` | **Hundred-Hall Campus Map** | $1,893,353,800 | Stream many buildings with correct total capacity and selected interiors. |
| `93-13` | **Water-Efficient Site Survey** | $2,688,562,400 | Compare locations using their actual weather and aquifer stress. |
| `93-14` | **Fiber-Adjacent Campus Permit** | $3,817,758,600 | Reduce network latency only where physical backbone is nearby. |
| `93-15` | **Server Metropolis Administrative Tower** | $5,421,217,300 | Consolidate contracts and jobs from owned data centers. |
| `93-16` | **Industrial Exascale Campus** | $7,698,128,500 | Unlock a landmark compute city requiring multi-province supply chains. |

**Branch-level verification:** Unlock 93-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.94 — Server Processors, Accelerators and Rack Hardware

**New node count:** 16 · **Prototype entry cost:** $35,000,000 · **Capability gate:** Server assembly factory operating and rack commissioning. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `94-01` | **Low-Power CPU Blade** | $35,000,000 | Unlock a cheaper server unit with reduced compute and energy draw. |
| `94-02` | **High-Clock Compute Module** | $49,700,000 | Exchange efficiency for faster serial workload completion. |
| `94-03` | **Vector Accelerator Board** | $70,574,000 | Improve compatible parallel analytics contracts only. |
| `94-04` | **Dedicated Storage Node** | $100,215,100 | Expand archival storage service capacity with disk failure risk. |
| `94-05` | **Memory-Dense Board** | $142,305,400 | Process memory-heavy customers without rejecting their contracts. |
| `94-06` | **Hot-Swap Drive Bay** | $202,073,700 | Replace failed storage devices with reduced rack downtime. |
| `94-07` | **Liquid-Ready Accelerator** | $286,944,600 | Enable direct-to-chip liquid cooling for supported modules. |
| `94-08` | **Rack Power Distribution Meter** | $407,461,400 | Report real kW draw at each rack's breaker. |
| `94-09` | **Hot-Spot Thermistor Array** | $578,595,200 | Surface the hottest installed node and its throttling reason. |
| `94-10` | **Mixed-Hardware Scheduler** | $821,605,100 | Assign different jobs to hardware families without fake uniform compute. |
| `94-11` | **GPU Interconnect Fabric** | $1,166,679,300 | Speed multi-accelerator jobs with an actual bandwidth bottleneck. |
| `94-12` | **Nonvolatile Cache Layer** | $1,656,684,600 | Reduce storage I/O on applicable workloads at extra power cost. |
| `94-13` | **Hardware Refurbishment Bench** | $2,352,492,100 | Recover bounded server components from old units. |
| `94-14` | **Fault-Tolerant Memory** | $3,340,538,800 | Lower crash rate for compatible premium compute contracts. |
| `94-15` | **Per-Rack Power Throttling** | $4,743,565,100 | Control server job speed to stay under real facility breaker limits. |
| `94-16` | **Chip Lifecycle Analytics** | $6,735,862,500 | Forecast failures and replacement cost from logged operating hours. |

**Branch-level verification:** Unlock 94-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.95 — Immersion, Liquid Cooling and Industrial Water Systems

**New node count:** 16 · **Prototype entry cost:** $50,000,000 · **Capability gate:** First liquid cooled rack and cooling water utility. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `95-01` | **Direct-Chip Cold Plate** | $50,000,000 | Attach liquid cooling hardware to compatible server boards. |
| `95-02` | **Manifold Flow Balance** | $71,000,000 | Split coolant among rack rows based on measured pressure demand. |
| `95-03` | **Coolant Chemistry Sensor** | $100,820,000 | Detect degraded cooling fluid and schedule replacement. |
| `95-04` | **Variable-Speed Pump Drive** | $143,164,400 | Match pump electric load to requested cooling flow. |
| `95-05` | **Heat Exchanger Bypass** | $203,293,400 | Route coolant past a failed exchanger with temperature penalties. |
| `95-06` | **Immersion Server Tank** | $288,676,700 | Replace air-rack geometry with a real fluid tank assembly. |
| `95-07` | **Immersion Fluid Filtration** | $409,920,900 | Extend service life while consuming spare filter stock. |
| `95-08` | **Dry Cooler Fin Bank** | $582,087,700 | Reject heat without consuming evaporative makeup water when climate allows. |
| `95-09` | **Hybrid Evaporative Tower** | $826,564,500 | Switch between wet and dry operating modes using weather constraints. |
| `95-10` | **District Cooling Pipeline** | $1,173,721,600 | Connect multiple server buildings to one plant with pressure loss. |
| `95-11` | **Cooling Lagoon Thermal Map** | $1,666,684,700 | Measure and visualize stored heated water in a real reservoir. |
| `95-12` | **Storm-Resistant Cooling Intake** | $2,366,692,300 | Keep pumps functional through a limited flash-flood event. |
| `95-13` | **Full-Campus Heat Balance** | $3,360,703,000 | Reconcile IT heat, fan heat, coolant exports and air rejection. |
| `95-14` | **Last-Drop Water Alarm** | $4,772,198,300 | Predict impending aquifer cutoff before server cooling fails. |
| `95-15` | **Heat-to-Industry Exchanger** | $6,776,521,600 | Sell usable recovered heat to a physically connected factory. |
| `95-16` | **Waterless Server Survival Mode** | $9,622,660,600 | Reduce jobs and run dry cooling to operate in a drained world. |

**Branch-level verification:** Unlock 95-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.96 — Fiber, Storage Cloud and Compute Workload Markets

**New node count:** 16 · **Prototype entry cost:** $42,000,000 · **Capability gate:** Multi-customer workloads and two connected campuses. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `96-01` | **Metro Fiber Backbone** | $42,000,000 | Connect two city computing sites with real physical route length. |
| `96-02` | **Long-Haul Optical Repeater** | $59,640,000 | Restore signal performance along a long fiber link at power cost. |
| `96-03` | **Dual-Path Redundant Fiber** | $84,688,800 | Fail over traffic during a broken cable incident. |
| `96-04` | **Low-Latency Peering Exchange** | $120,258,100 | Unlock premium workloads when delay and throughput qualify. |
| `96-05` | **Bulk Archival Storage Contract** | $170,766,500 | Sell capacity only when disk space and redundancy exist. |
| `96-06` | **Transactional Compute Queue** | $242,488,400 | Distinguish short burst jobs from continuous workloads. |
| `96-07` | **Image Rendering Workload** | $344,333,600 | Use compatible GPU throughput for simulated image batch contracts. |
| `96-08` | **Fictional Weather Model Contract** | $488,953,700 | Sell CPU-heavy scientific processing jobs. |
| `96-09` | **Corporate Analytics Cluster** | $694,314,200 | Run memory-bound workload requiring RAM and storage throughput. |
| `96-10` | **AI Training Workload** | $985,926,200 | Run high-compute parallel jobs with large thermal demand. |
| `96-11` | **Live Service Availability SLA** | $1,400,015,100 | Trigger fees if server availability drops under contract threshold. |
| `96-12` | **Customer Data Region Selector** | $1,988,021,500 | Restrict selected jobs to legally configured in-world regions. |
| `96-13` | **Cross-Campus Job Migration** | $2,822,990,500 | Transfer queued jobs via finite network bandwidth during faults. |
| `96-14` | **Workload Electricity Bidding** | $4,008,646,600 | Set compute prices based on actual marginal electricity cost. |
| `96-15` | **Compute Marketplace Demand Curves** | $5,692,278,100 | Show market saturation and rejected customer requests. |
| `96-16` | **Exascale Revenue Accounting** | $8,083,034,900 | Reconcile sold compute units to completed machine workloads. |

**Branch-level verification:** Unlock 96-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.97 — Data Center Backup and Cascading Failure Engineering

**New node count:** 16 · **Prototype entry cost:** $38,000,000 · **Capability gate:** SLA incident and grid storage research. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `97-01` | **UPS Battery Health Check** | $38,000,000 | Track actual age and remaining usable kWh for backup circuits. |
| `97-02` | **Automatic Transfer Switch** | $53,960,000 | Transfer eligible rack loads between two real energized feeders. |
| `97-03` | **Diesel Backup Fuel Meter** | $76,623,200 | Deduct standby generator fuel from a finite delivery tank. |
| `97-04` | **Redundant Cooling Pump Pair** | $108,804,900 | Swap pumping to a second live unit on primary breakdown. |
| `97-05` | **Emergency Rack Shutdown Policy** | $154,503,000 | Shed lower-priority paid jobs before thermal damage occurs. |
| `97-06` | **Switchgear Temperature Alarm** | $219,394,300 | Warn when building breaker losses exceed thermal limit. |
| `97-07` | **Spare-Fan Depot** | $311,539,900 | Stock physical replacement fans and schedule rapid repair jobs. |
| `97-08` | **Network Partition Detector** | $442,386,600 | Detect when fiber graph splits active compute sites. |
| `97-09` | **Grid Black-Start Sequence** | $628,189,000 | Restart power in dependency order after a total collapse. |
| `97-10` | **Cooling Leak Containment** | $892,028,400 | Limit water loss during a detected pipe rupture. |
| `97-11` | **Battery Islanding Control** | $1,266,680,400 | Keep a server building energized briefly without grid supply. |
| `97-12` | **Hot-Aisle Pressure Sensor** | $1,798,686,100 | Diagnose poor airflow inside visible 3D rack corridors. |
| `97-13` | **SLA Disaster Insurance** | $2,554,134,300 | Cover limited contractual outages with priced monthly premiums. |
| `97-14` | **Maintenance Crew Shift Planner** | $3,626,870,700 | Assign workers/robots to high-risk live halls first. |
| `97-15` | **Multi-Campus Recovery Simulator** | $5,150,156,400 | Stress-test a hypothetical outage without changing the saved world. |
| `97-16` | **Planet-Scale Failover Office** | $7,313,222,100 | Coordinate real powered spare capacity across all owned server cities. |

**Branch-level verification:** Unlock 97-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.98 — Supergrid and Industrial Power Markets

**New node count:** 16 · **Prototype entry cost:** $45,000,000 · **Capability gate:** At least 1 GW dispatch and 3 operating substations. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `98-01` | **High-Voltage Transmission Tower** | $45,000,000 | Place longer grid segments requiring new 3D pylon models. |
| `98-02` | **Substation Transformer Bank** | $63,900,000 | Increase one node's safe power transfer capacity. |
| `98-03` | **Intertie Synchronization Relay** | $90,738,000 | Connect two independently produced grid regions. |
| `98-04` | **Grid Phase Stability Abstraction** | $128,848,000 | Penalize over-rapid generator switching instead of teleporting supply. |
| `98-05` | **Power Line Resistance Survey** | $182,964,100 | Estimate losses for distance and conductor grade. |
| `98-06` | **Industrial Demand Response** | $259,809,000 | Temporarily throttle optional plants when peak demand exceeds supply. |
| `98-07` | **Storage Charge Arbitration** | $368,928,800 | Allocate spare electricity among real battery stations. |
| `98-08` | **Critical Hospital-Style Utility Class** | $523,878,900 | Prioritize abstract city service loads over noncritical industry. |
| `98-09` | **Dynamic Power Pricing** | $743,908,100 | Update electricity sale price using connected supply and demand. |
| `98-10` | **Regional Reserve Margin Meter** | $1,056,349,500 | Show available spinning and stored power backup separately. |
| `98-11` | **Transformer Fire Sensor** | $1,500,016,200 | Detect overload damage before cascading distribution failures. |
| `98-12` | **Blackout Root-Cause Graph** | $2,130,023,000 | Display failed generator/line/load chains after incidents. |
| `98-13` | **Cross-Province Wheeling Tariff** | $3,024,632,700 | Charge for power transported through neighboring grid operators. |
| `98-14` | **Power Export Settlement** | $4,294,978,500 | Pay only for measured delivered megawatt-hours. |
| `98-15` | **Supergrid Map Switchboard** | $6,098,869,400 | Issue remote real node actions through audited dispatch queue. |
| `98-16` | **Ten-Gigawatt Coordination Engine** | $8,660,394,600 | Balance many sources and sinks with tested numerical stability. |

**Branch-level verification:** Unlock 98-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.99 — Mega Power Plants, Fuel Industry and Generation Reliability

**New node count:** 16 · **Prototype entry cost:** $65,000,000 · **Capability gate:** Large fuel supply and thermal generation permit. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `99-01` | **Mega-Boiler Drum Inspection** | $65,000,000 | Identify pressure-related plant downtime using simplified safety metrics. |
| `99-02` | **High-Capacity Turbine Hall** | $92,300,000 | Construct a physically larger generator with bigger fuel input need. |
| `99-03` | **Condensing Heat Rejection Tower** | $131,066,000 | Reject measured waste heat using connected cooling resources. |
| `99-04` | **Coal Yard Stacker-Reclaimer** | $186,113,700 | Physically handle bulk fuel via stockpile conveyor. |
| `99-05` | **Rail Fuel Unloading Gantry** | $264,281,500 | Accept timed rail fuel deliveries to a thermal plant. |
| `99-06` | **Fuel Moisture Analyzer** | $375,279,700 | Adjust burn efficiency according to delivered commodity grade. |
| `99-07` | **Low-Load Turbine Control** | $532,897,200 | Maintain stability at reduced output with lower efficiency. |
| `99-08` | **Generator Lubrication Circuit** | $756,714,000 | Extend mean time between generator service through purchased lubricant. |
| `99-09` | **Ash Conveyor Megaline** | $1,074,533,900 | Transport residue to sale or contained dumps without deletion. |
| `99-10` | **Stack Emission Continuous Recorder** | $1,525,838,100 | Attribute trace pollutant mass to delivered fuel consumption. |
| `99-11` | **Emergency Turbine Trip** | $2,166,690,100 | Prevent major failure at the cost of a real temporary power blackout. |
| `99-12` | **Multi-Fuel Conversion Station** | $3,076,700,000 | Switch eligible units among tracked fuel types using retrofit parts. |
| `99-13` | **Power Plant Industrial District** | $4,368,913,900 | Share feed infrastructure among several physically connected generators. |
| `99-14` | **Weatherproof Fuel Storage Dome** | $6,203,857,800 | Protect stored fuel from rain and wind losses. |
| `99-15` | **Rolling Power Plant Maintenance** | $8,809,478,100 | Service turbines one at a time while keeping reserve capacity. |
| `99-16` | **Twenty-Gigawatt Megagravel Grid** | $12,509,458,800 | Unlock a capstone fictional superpower complex using real fuel/plant/line networks. |

**Branch-level verification:** Unlock 99-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.100 — Cement, Concrete and Mineral Kiln Empires

**New node count:** 16 · **Prototype entry cost:** $55,000,000 · **Capability gate:** Quarry and industrial concrete works. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `100-01` | **Limestone Grade Sorting** | $55,000,000 | Separate mineral feedstock by chemistry and price. |
| `100-02` | **Rotary Kiln Shell Upgrade** | $78,100,000 | Increase processing length, heat and footprint of a cement kiln. |
| `100-03` | **Preheater Tower Structure** | $110,902,000 | Recover limited process heat with visible tall industrial geometry. |
| `100-04` | **Bulk Powder Storage Silo** | $157,480,800 | Store finite cement capacity without weather contamination. |
| `100-05` | **Raw Meal Blending System** | $223,622,800 | Stabilize output grade from variable mineral inputs. |
| `100-06` | **Industrial Clinker Cooler** | $317,544,400 | Convert hot clinker into safe transport cargo with heat discharge. |
| `100-07` | **Concrete Batching Arrays** | $450,913,000 | Produce several concrete grades against verified recipes. |
| `100-08` | **Precast Beam Mold Line** | $640,296,500 | Manufacture heavy structural beams with curing time and storage. |
| `100-09` | **Bridge Deck Panel Line** | $909,221,000 | Produce road/bridge slabs from concrete and reinforcement. |
| `100-10` | **Tilt-Up Wall Factory** | $1,291,093,800 | Create visible building-panel cargo used in megacity construction. |
| `100-11` | **Cement Dust Settling Lagoon** | $1,833,353,200 | Track particulate captured and sedimented rather than removed magically. |
| `100-12` | **Kiln Refractory Maintenance** | $2,603,361,500 | Replace worn lining with purchased materials and downtime. |
| `100-13` | **High-Rise Concrete Pump Truck** | $3,696,773,300 | Lift ready-mix concrete to selected tower floors. |
| `100-14` | **Aggregate Rail Terminal** | $5,249,418,100 | Deliver enormous stone loads to several batching sites. |
| `100-15` | **Global Megaconstruction Contract** | $7,454,173,700 | Sell construction modules for finite large projects. |
| `100-16` | **Cement Carbon Accounting** | $10,584,926,700 | Attribute process CO2 and fuel CO2 separately for each kiln. |

**Branch-level verification:** Unlock 100-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.101 — Metallurgy, Steelworks and Industrial Alloy Chains

**New node count:** 16 · **Prototype entry cost:** $70,000,000 · **Capability gate:** Ore railway and working metal foundry. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `101-01` | **Ore Pelletizing Drum** | $70,000,000 | Create consistent furnace feed using fine ore and power. |
| `101-02` | **Coke Yard Bunker** | $99,400,000 | Store finite reductant commodity for thermal steel recipes. |
| `101-03` | **Blast Furnace Shell Module** | $141,148,000 | Expand hot-metal capacity with additional furnace height. |
| `101-04` | **Electric Arc Steel Furnace** | $200,430,200 | Use grid electricity to melt eligible metal inputs. |
| `101-05` | **Continuous Casting Line** | $284,610,800 | Turn liquid steel into measured slab/billet output. |
| `101-06` | **Hot Rolling Mill** | $404,147,400 | Produce high-volume structural steel products with rolling energy. |
| `101-07` | **Precision Pipe Mill** | $573,889,300 | Manufacture industrial fluid pipes in selectable diameters. |
| `101-08` | **Rail Track Steelworks** | $814,922,800 | Produce track lengths used by real rail construction jobs. |
| `101-09` | **Heavy Plate Mill** | $1,157,190,300 | Unlock thick steel panels for mining and shipbuilding. |
| `101-10` | **Stainless Alloy Recipe** | $1,643,210,300 | Combine finite alloy inputs for premium corrosion-resistant steel. |
| `101-11` | **Forge Press Foundation** | $2,333,358,600 | Build an oversized press requiring massive vibration-resistant footings. |
| `101-12` | **Slag Recycling Yard** | $3,313,369,200 | Recover bounded aggregate from real blast-furnace slag. |
| `101-13` | **Scrap Metal Sorter** | $4,704,984,200 | Recover ferrous and nonferrous grades from dismantled cargo. |
| `101-14` | **Steelworks Cooling Loop** | $6,681,077,600 | Deduct water losses and waste heat from an operating cooling plant. |
| `101-15` | **Alloy Quality Laboratory** | $9,487,130,200 | Validate output grade before high-value contracts pay. |
| `101-16` | **Integrated Metal City Blueprint** | $13,471,724,900 | Coordinate ore → power → furnace → parts factory across multiple districts. |

**Branch-level verification:** Unlock 101-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.102 — Petrochemical, Plastics and Industrial Waste Chains

**New node count:** 16 · **Prototype entry cost:** $85,000,000 · **Capability gate:** Licensed fictional chemical industrial complex. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `102-01` | **Crude Feedstock Sorting** | $85,000,000 | Track distinct refinery input grades and handling costs. |
| `102-02` | **Distillation Tower Model** | $120,700,000 | Produce finite fuel fractions in an energy-consuming stylized plant. |
| `102-03` | **Polymer Pellet Factory** | $171,394,000 | Convert selected feedstocks into branded industrial pellets. |
| `102-04` | **Industrial Solvent Recovery** | $243,379,500 | Recover bounded reused process fluid from tracked waste streams. |
| `102-05` | **Tank Farm Level Sensors** | $345,598,900 | Display actual quantities and fail-safe limits of connected storage. |
| `102-06` | **Chemical Rail Car Loading** | $490,750,400 | Ship measured liquid feedstocks through compatible freight routes. |
| `102-07` | **Fuel Blend Contract** | $696,865,500 | Create saleable low/high grade fuel mixtures from accounted stocks. |
| `102-08` | **Plastics Injection Hall** | $989,549,100 | Manufacture durable machine housings from polymer pellets. |
| `102-09` | **Piping Corrosion Monitor** | $1,405,159,700 | Increase maintenance demand according to real chemical exposure. |
| `102-10` | **Stack Gas Composition Inspector** | $1,995,326,800 | Separate CO2, soot and gaseous irritation emissions. |
| `102-11` | **Wastewater Pre-Treatment Plant** | $2,833,364,000 | Change actual output chemistry using consumed power and reagents. |
| `102-12` | **Leachate Monitoring Bore** | $4,023,376,900 | Reveal local subsoil movement of plant-related contamination. |
| `102-13` | **Industrial Polymer Recycler** | $5,713,195,100 | Recover finite pellet feedstock from sorted plastic waste. |
| `102-14` | **High-Pressure Storage Upgrade** | $8,112,737,100 | Allow larger specialized tanks with maintenance/pressure risk. |
| `102-15` | **Tanker Fleet Safety Dispatcher** | $11,520,086,700 | Route chemical cargo around weather-closed industrial corridors. |
| `102-16` | **Chemical Empire Ledger** | $16,358,523,100 | Reconcile raw material input, outputs, byproducts, wastes and company profit. |

**Branch-level verification:** Unlock 102-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.103 — Mega Agriculture, Soil Demand and Food Industry

**New node count:** 16 · **Prototype entry cost:** $32,000,000 · **Capability gate:** Agricultural district with irrigation and processing. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `103-01` | **Center-Pivot Field Layout** | $32,000,000 | Build crop irrigation pivots with circular reach and measurable water use. |
| `103-02` | **Autonomous Seeder Tractors** | $45,440,000 | Plant real field cells along traversable vehicle paths. |
| `103-03` | **Crop Nutrient Balance** | $64,524,800 | Monitor soil nutrient stores separately from crop moisture. |
| `103-04` | **Industrial Harvester Convoy** | $91,625,200 | Operate cooperating vehicles that collect finite harvested mass. |
| `103-05` | **Grain Elevator Logistics** | $130,107,800 | Store grain by grade, with ventilation power and spoilage. |
| `103-06` | **Produce Cold Storage** | $184,753,100 | Preserve food shipments at measured electric and maintenance costs. |
| `103-07` | **River-Feed Irrigation Intake** | $262,349,400 | Pump only from a genuinely connected live river reach. |
| `103-08` | **Dryland Rotation Planner** | $372,536,100 | Alter crop choice to cope with falling regional rainfall. |
| `103-09` | **Greenhouse Thermal Controls** | $529,001,300 | Run humidity/heat/cooling hardware for premium crops. |
| `103-10` | **Vertical Farming Tower** | $751,181,800 | Trade high urban power demand for yield on a compact footprint. |
| `103-11` | **Fertilizer Bulk Rail Dock** | $1,066,678,200 | Feed field work orders with delivered consumable fertilizers. |
| `103-12` | **Industrial Food Processing Plant** | $1,514,683,100 | Convert crops into packaged goods through proper recipes. |
| `103-13` | **Water-Shortage Crop Auction** | $2,150,849,900 | Change contract pricing according to observed harvest failures. |
| `103-14` | **Saline Soil Recovery Experiment** | $3,054,206,900 | Show why heavily salinated fields fail to yield; optional restoration test. |
| `103-15` | **Agricultural Abandonment Policy** | $4,336,973,800 | Shut fields down and reclaim remaining equipment for endgame D6 work. |
| `103-16` | **Post-Farming Sterility Survey** | $6,158,502,800 | Identify formerly productive soil that still blocks D6 qualification. |

**Branch-level verification:** Unlock 103-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.104 — Livestock, Grazing and Desertifying Pastures

**New node count:** 16 · **Prototype entry cost:** $28,000,000 · **Capability gate:** Ranch construction and farm vehicle garage. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `104-01` | **Fenced Paddock Planner** | $28,000,000 | Place traversable 3D perimeter fence pieces and gate controls. |
| `104-02` | **Automated Feed Trough** | $39,760,000 | Consume actual feed stock to support abstract livestock output. |
| `104-03` | **Ranch Water Meter** | $56,459,200 | Deduct water from connected reservoir/well for livestock operations. |
| `104-04` | **Pasture Growth Sensor** | $80,172,100 | Show consumed and regenerated grass biomass separately. |
| `104-05` | **Heavy Grazing Density Plan** | $113,844,300 | Alter crop/grass wear in designated ranch sections. |
| `104-06` | **Livestock Transport Trailer** | $161,658,900 | Move finite animal inventory in compatible cargo classes. |
| `104-07` | **Manure Collection Facility** | $229,555,700 | Convert bounded animal waste into saleable fertilizer and process gas. |
| `104-08` | **Animal Health Abstraction** | $325,969,100 | Track herd productivity without violent individual interactions. |
| `104-09` | **Fodder Drying Barn** | $462,876,100 | Convert harvested grass into storable feed with quality loss. |
| `104-10` | **Soil Compaction Route** | $657,284,100 | Track where livestock traffic reduces infiltration and grass growth. |
| `104-11` | **Mobile Grazing Caravan** | $933,343,400 | Relocate ranch groups between owned districts according to forage. |
| `104-12` | **Food Processing Contract** | $1,325,347,700 | Sell animal goods through real cold-chain logistics. |
| `104-13` | **Pasture Fire Risk Monitor** | $1,881,993,700 | Alert to dry grass ignition risks near occupied ranches. |
| `104-14` | **Ranch Wastewater Collection** | $2,672,431,000 | Track organic runoff that affects waterways. |
| `104-15` | **Pasture Retirement Buyout** | $3,794,852,100 | Sell equipment and liquidate livestock before ending grazing operations. |
| `104-16` | **Last Pasture Removal Survey** | $5,388,690,000 | Flag surviving grass clumps and fertile soil in retired regions. |

**Branch-level verification:** Unlock 104-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.105 — Industrial Research Centers and Experiment Facilities

**New node count:** 16 · **Prototype entry cost:** $40,000,000 · **Capability gate:** Research city and 5 advanced manufacturing lines. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `105-01` | **Material Stress Test Tower** | $40,000,000 | Physically test a timber/steel beam recipe to unlock rated loads. |
| `105-02` | **Toolwear Laboratory** | $56,800,000 | Compare cut durations and blade degradation by material. |
| `105-03` | **Microclimate Wind Tunnel** | $80,656,000 | Evaluate a small-scale physical mesh under selected wind loads. |
| `105-04` | **Rack Thermal Test Bench** | $114,531,500 | Benchmark cooling airflow before deploying new rack layouts. |
| `105-05` | **Prototype Cargo Rig** | $162,634,800 | Test a crane load envelope before fleet-wide unlock. |
| `105-06` | **Soil Column Simulation Hall** | $230,941,400 | Explore water/fertility changes in a controlled fictional test setup. |
| `105-07` | **Industrial Emissions Observatory** | $327,936,700 | Run calibrated sensor studies for stack outputs. |
| `105-08` | **Robotic Assembly Sandbox** | $465,670,200 | Validate a new recipe robot sequence without selling fake output. |
| `105-09` | **High-Voltage Switch Lab** | $661,251,600 | Verify a new grid intertie under synthetic load tests. |
| `105-10` | **Water Circuit Diagnostic Facility** | $938,977,300 | Trace pump/cooling mass balance using sample instruments. |
| `105-11` | **Remote Mining Autonomous Course** | $1,333,347,800 | Practice automated excavator routing in a test quarry. |
| `105-12` | **Urban Traffic Prediction Lab** | $1,893,353,800 | Compare alternative lane designs against measured route flow. |
| `105-13` | **City Materials Testing Lab** | $2,688,562,400 | Qualify new skyscraper panels against weather/humidity stress. |
| `105-14` | **Fictional Climate Control Center** | $3,817,758,600 | Run forecast scenarios without magically changing world conditions. |
| `105-15` | **Industry Certification Registry** | $5,421,217,300 | Unlock premium contracts after passing repeatable engineering tests. |
| `105-16` | **Planetary Systems University** | $7,698,128,500 | Unlock multi-disciplinary research quests spanning six production systems. |

**Branch-level verification:** Unlock 105-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.106 — Regional Industrial Megaprojects

**New node count:** 16 · **Prototype entry cost:** $80,000,000 · **Capability gate:** 12 districts owned and cross-province utilities. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `106-01` | **Million-Tonne Lumber City** | $80,000,000 | Link giant sawmills, dryers and furniture plants into one project. |
| `106-02` | **Automated Quarry Mountain** | $113,600,000 | Operate a large mine with multiple conveying and rail outputs. |
| `106-03` | **Trans-Provincial Power Corridor** | $161,312,000 | Build a live high-capacity line across a regional border. |
| `106-04` | **Multi-Basin Water Transfer Hub** | $229,063,000 | Route finite water among three connected watersheds. |
| `106-05` | **Rail-to-Ship Mineral Export Port** | $325,269,500 | Commission a working mine/rail/port logistics chain. |
| `106-06` | **Hundred-Megawatt Paper Mill** | $461,882,700 | Build a multi-stage water/power-consuming paper megafactory. |
| `106-07` | **Industrial Furnace Valley** | $655,873,500 | Connect several furnaces to shared fuel and cooling service. |
| `106-08` | **Metropolitan Freight Ring** | $931,340,300 | Circulate paid goods shipments through a functioning city beltway. |
| `106-09` | **Factory-Satellite Town** | $1,322,503,200 | Found a town whose income depends on a nearby working industry. |
| `106-10` | **Coal-Ash Disposal Region** | $1,877,954,600 | Allocate finite covered ash stockpiles and wind-deposition risk. |
| `106-11` | **Smart Sensor Mesh Province** | $2,666,695,500 | Cover all province districts with weather/soil/water telemetry. |
| `106-12` | **Thermal Campus Corridor** | $3,786,707,600 | Link three data centers to electricity and real cooling infrastructure. |
| `106-13` | **Dried Lake Power Park** | $5,377,124,800 | Use exposed basin ground for industrial facilities after hydrology passes. |
| `106-14` | **Coastal Logistics Empire** | $7,635,517,300 | Build active port, rail, road and airport cargo interchange. |
| `106-15` | **Pollution-Heavy Industrial Cluster** | $10,842,434,500 | Commission multiple emitters with distinct source fields and diagnostics. |
| `106-16` | **Sixteen-Province Development Plan** | $15,396,257,000 | Coordinate road, power and freight capacity across entire world. |

**Branch-level verification:** Unlock 106-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.107 — Cross-Province Automation and Production Intelligence

**New node count:** 16 · **Prototype entry cost:** $65,000,000 · **Capability gate:** Regional dispatcher and full factory supply network. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `107-01` | **Distributed Work Queue** | $65,000,000 | Schedule jobs among machines across multiple provinces. |
| `107-02` | **Machine Capability Matching** | $92,300,000 | Match tasks to actual attachments, reach and mass capacity. |
| `107-03` | **Multi-Stop Pickup Planner** | $131,066,000 | Combine compatible cargo loads into one route with time/cost tradeoff. |
| `107-04` | **Predictive Fuel Replenishment** | $186,113,700 | Dispatch tankers before remote machines stop due to empty fuel. |
| `107-05` | **Energy-Aware Shift Scheduler** | $264,281,500 | Move eligible factory operations to lower-cost grid periods. |
| `107-06` | **Storm-Avoidance Route Graph** | $375,279,700 | Recalculate actual cargo routes around forecast closures. |
| `107-07` | **Production Bottleneck Visualizer** | $532,897,200 | Mark the slowest transfer step in each recipe chain. |
| `107-08` | **Inventory Reservation Lock** | $756,714,000 | Prevent double-spending the same log, steel beam or fuel tank. |
| `107-09` | **Multi-Region Fleet Charging** | $1,074,533,900 | Schedule vehicle power use against live electrical network capacity. |
| `107-10` | **Priority-Based Parts Repair** | $1,525,838,100 | Send limited replacement parts to the most urgent machines. |
| `107-11` | **Overstock Liquidation Controller** | $2,166,690,100 | Offer real surplus goods to markets without inventing demand. |
| `107-12` | **Agricultural Harvest Timing** | $3,076,700,000 | Coordinate field jobs with weather and processing capacity. |
| `107-13` | **Compute Job Power Scheduler** | $4,368,913,900 | Move optional server workloads to campuses with available cooling and watts. |
| `107-14` | **Emissions Attribution Scheduler** | $6,203,857,800 | Compare real pollution output by alternative task dispatch plans. |
| `107-15` | **Unreachable Job Exception Board** | $8,809,478,100 | Report work orders that cannot run because of terrain or access. |
| `107-16` | **Worldwide Work Order Commander** | $12,509,458,800 | Control all machine teams while preserving logged causal events. |

**Branch-level verification:** Unlock 107-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.108 — Environmental Sensor Mesh and Planetary Statistics

**New node count:** 16 · **Prototype entry cost:** $55,000,000 · **Capability gate:** 12 sensor districts, telemetry history and world map. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `108-01` | **Groundwater Field Databook** | $55,000,000 | Store timestamped water-depth series for every visited aquifer. |
| `108-02` | **District Air Sampling Beacons** | $78,100,000 | Deploy powered sensors distinguishing local pollution types. |
| `108-03` | **Biome Conversion Change Log** | $110,902,000 | Record exact cells that changed classification this tick. |
| `108-04` | **Tree and Seed Inventory Probe** | $157,480,800 | Count viable vegetation, not only visible mature trunks. |
| `108-05` | **Soil Fertility Raster** | $223,622,800 | Generate a per-cell overlay of validated nutrient and organic stores. |
| `108-06` | **Wildlife Habitat Acoustic Net** | $317,544,400 | Track modeled habitat activity with low-power field sensors. |
| `108-07` | **Temperature Sensor Cube Array** | $450,913,000 | Monitor thermal anomalies at multiple altitudes in a district. |
| `108-08` | **Emissions-to-Profit Scatterplot** | $640,296,500 | Compare facility economic yield against actual CO2 output. |
| `108-09` | **Water-to-Compute Dashboard** | $909,221,000 | Show water consumed per delivered unit of server service. |
| `108-10` | **Province Historical Replay** | $1,291,093,800 | Reconstruct past environment overlays from saved snapshots. |
| `108-11` | **Weather Damage Trend Chart** | $1,833,353,200 | Plot incidents and repair spending by storm type. |
| `108-12` | **Data Quality Validator** | $2,603,361,500 | Highlight disconnected, stale or impossible sensor readings. |
| `108-13` | **Source-to-Outcome Causality Chart** | $3,696,773,300 | Trace material/emission/weather contribution to a changed cell. |
| `108-14` | **Custom Statistics Panel Builder** | $5,249,418,100 | Let players pin any verified time series with units. |
| `108-15` | **Telemetry Export Bundle** | $7,454,173,700 | Export timestamped readings in user-readable CSV/JSON. |
| `108-16` | **Global Environmental Ledger** | $10,584,926,700 | Audit every reservoir, emission source and grid sink across all provinces. |

**Branch-level verification:** Unlock 108-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.109 — Multi-Medal Strategy and Planetary Completion

**New node count:** 16 · **Prototype entry cost:** $95,000,000 · **Capability gate:** At least 4 environmental medals above 80%. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `109-01` | **D1 Geographic Blocker Finder** | $95,000,000 | Rank remaining stable-desert failures by province and biome cause. |
| `109-02` | **D2 Hidden Sapling Patrol** | $134,900,000 | Dispatch forestry scanners to detect remaining living seedlings. |
| `109-03` | **D3 Groundwater Closure Atlas** | $191,558,000 | List all aquifers and connected surface stores failing dryness. |
| `109-04` | **D4 Carbon Deficit Monitor** | $272,012,400 | Identify remaining emissions/capture imbalance to fictional cap. |
| `109-05` | **D5 Clean District Watchlist** | $386,257,600 | Rank unsaturated districts by distance and pollutant class. |
| `109-06` | **D6 Fertile Substrate Scanner** | $548,485,700 | Find under-road and under-building soil still supporting recovery. |
| `109-07` | **D7 Cooling Pocket Detection** | $778,849,700 | Find rain-shadow, altitude and heat-loss causes in low-heat provinces. |
| `109-08` | **D8 Last Habitat Camera** | $1,105,966,600 | Locate surviving modeled ecological refuges without visual cheating. |
| `109-09` | **Compound Blocker Clustering** | $1,570,472,600 | Merge compatible nearby jobs while preserving separate medal conditions. |
| `109-10` | **Remaining Workload Cost Estimator** | $2,230,071,100 | Price equipment, electricity and time required for each medal. |
| `109-11` | **Twelve-Day Stability Timeline** | $3,166,700,900 | Display which metrics will regress under predicted active conditions. |
| `109-12` | **Automated Audit Test Run** | $4,496,715,300 | Perform a non-awarding scan of all 2,359,296 cells and 576 districts. |
| `109-13` | **Cross-Medal Tradeoff Alert** | $6,385,335,700 | Warn if draining a cooling basin disables a critical emitting data center. |
| `109-14` | **Final Reachability Planner** | $9,067,176,800 | Find safe routes to isolated cells and suggest constructing access. |
| `109-15` | **Last One Percent Control Room** | $12,875,391,000 | Issue focused operations only to identified failing area cells. |
| `109-16` | **Eight-Medal Commission** | $18,283,055,200 | Unlock final audited victory only after simultaneous actual thresholds. |

**Branch-level verification:** Unlock 109-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.110 — Planetary Destruction Visualizer and Cinematics

**New node count:** 16 · **Prototype entry cost:** $35,000,000 · **Capability gate:** Game camera, drone surveying and polluted world. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `110-01` | **Starter Forest Ghost Overlay** | $35,000,000 | Show original forest footprint in a 3D time-lapse comparison. |
| `110-02` | **Treefall Lifetime Montage** | $49,700,000 | Replay selected physically simulated logging events. |
| `110-03` | **Thirty-Year Fictional Climate Graph** | $70,574,000 | Render accelerated campaign climate history with labeled units. |
| `110-04` | **River Retreat Cinema** | $100,215,100 | Fly over exposed riverbanks using actual past water-level traces. |
| `110-05` | **Acid-Haze Color Grading** | $142,305,400 | Tie ambient color to local reactive pollutant composition. |
| `110-06` | **Coal-Smoke Volumetric Trail** | $202,073,700 | Render moving dense soot sources with scalable particle quality. |
| `110-07` | **Wind-Rippled Desert Dunes** | $286,944,600 | Animate sand ripples over real procedurally deformed dune meshes. |
| `110-08` | **Industrial Skylight Flicker** | $407,461,400 | Respond to grid brownouts with visible powered building lights. |
| `110-09` | **Night Megacity Reflections** | $578,595,200 | Render actual lit tower windows and road reflections where wet. |
| `110-10` | **Satellite Pollutant Layers** | $821,605,100 | Display 16 different mapped pollution categories with matching legends. |
| `110-11` | **Server Cathedral Interior Tour** | $1,166,679,300 | Enter a detailed rack corridor with real active cooling parts. |
| `110-12` | **Dried Lake Historical Diorama** | $1,656,684,600 | Compare present exposed basin with seed-time lake mesh. |
| `110-13` | **Factory Heat Mirage Mode** | $2,352,492,100 | Increase local visual shimmer in direct proportion to recorded waste heat. |
| `110-14` | **Season-by-Season Province Reel** | $3,340,538,800 | Compose short clips from stored weather and biome states. |
| `110-15` | **Planetary Before-and-After Flyover** | $4,743,565,100 | Link all 16 province camera checkpoints in a cinematics timeline. |
| `110-16` | **Environmental Ruin Museum** | $6,735,862,500 | Build an in-world exhibition displaying live stats and historical 3D scenes. |

**Branch-level verification:** Unlock 110-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.111 — Late-Game Industrial Stability and Crisis Management

**New node count:** 16 · **Prototype entry cost:** $100,000,000 · **Capability gate:** 12 owned provinces and one severe outage. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `111-01` | **World Fuel Reserve Calculator** | $100,000,000 | Forecast how long finite fuels can support all current generators. |
| `111-02` | **Climate-Safe Logistics Overpass** | $142,000,000 | Build elevated routes across persistent flood-prone ground. |
| `111-03` | **Heat-Resistant Electrical Cabinets** | $201,640,000 | Reduce failure rates in high-heat districts after material upgrades. |
| `111-04` | **Dust-Sealed Vehicle Intakes** | $286,328,800 | Lower engine breakdowns during region-wide sandstorms. |
| `111-05` | **Redundant Mine Ventilation** | $406,586,900 | Keep fictional underground machines operating through single fan faults. |
| `111-06` | **Grid Priority Micro-Islands** | $577,353,400 | Preserve essential district service loads when a transmission link fails. |
| `111-07` | **Automated Storm Pump Staging** | $819,841,800 | Position working drainage pumps before a forecast flood. |
| `111-08` | **Long-Term Server Spare Parts** | $1,164,175,400 | Stock and distribute rack replacements with known shelf-life. |
| `111-09` | **Emergency Finance Reserve** | $1,653,129,000 | Protect operating wages and repair spending from short-term contract shortfalls. |
| `111-10` | **Cross-Industry Byproduct Exchange** | $2,347,443,200 | Route captured ash, heat or waste to compatible valid buyers. |
| `111-11` | **City Cooling Demand Cap** | $3,333,369,400 | Reduce occupancy-load demand during dangerous heat episodes. |
| `111-12` | **Pollution Regrowth Threat Alarm** | $4,733,384,500 | Warn when clean rain zones might enable reforestation. |
| `111-13` | **Industrial Remobilization Bonds** | $6,721,406,100 | Finance a real construction project with future repayments. |
| `111-14` | **Five-Province Emergency Drill** | $9,544,396,600 | Run an optional resilience test without deleting saved assets. |
| `111-15` | **Planetary Freeze-Proof Simulation Clock** | $13,553,043,200 | Advance weather and environmental processes safely at faster late-game speeds. |
| `111-16` | **Audit Window Reliability Planner** | $19,245,321,300 | Keep mandatory industrial systems active during 12-day stability test. |

**Branch-level verification:** Unlock 111-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

### 95.112 — Final Desert Empire and New Game Plus

**New node count:** 16 · **Prototype entry cost:** $150,000,000 · **Capability gate:** Seven medals at 95% and global audit unlocked. All sixteen entries need a mechanically distinct effect handler, save schema and effect-specific test. 3D equipment models must be real geometry, with visual/animated differences where applicable.

| ID | Upgrade | Prototype price | Required functional effect |
|---|---|---:|---|
| `112-01` | **Universal Last-Tree Map** | $150,000,000 | Mark exact coordinates of every remaining viable tree. |
| `112-02` | **Hidden Aquifer Audit Probe** | $213,000,000 | Reveal unsurveyed freshwater pockets blocking D3. |
| `112-03` | **Desert Soil Integrity Stamp** | $302,460,000 | Verify stable substrate state under every built footprint. |
| `112-04` | **Pollution District Completeness Map** | $429,493,200 | Color each of 576 districts by failing pollutant threshold. |
| `112-05` | **Global CO2 Source/Sink Ledger** | $609,880,300 | Show net carbon change needed to maintain D4 at the cap. |
| `112-06` | **Final Heat Source Census** | $866,030,100 | Inventory regional temperature contributions and thermal deficits. |
| `112-07` | **Ecological Habitat End-State Report** | $1,229,762,700 | Verify population and habitat zero-threshold rules. |
| `112-08` | **Weather Stability Horizon** | $1,746,263,100 | Identify threats to medals over the next 12 in-game days. |
| `112-09` | **Last Cell Reachability Bridge Kit** | $2,479,693,600 | Unlock transportable structures to reach blocked final cells. |
| `112-10` | **Audit-Grade Automated Surveyors** | $3,521,164,900 | Run multiple independent scans with reconciled cell counts. |
| `112-11` | **Final Industrial Balance Sheet** | $5,000,054,100 | Calculate lifetime goods, cash flow, power, water and emissions. |
| `112-12` | **All-Provinces Desert Flyover** | $7,100,076,800 | Render a genuine 3D journey across the completed 604 km² map. |
| `112-13` | **Eight-Medal Monument Foundation** | $10,082,109,100 | Build a large 3D structure only after verified medal thresholds. |
| `112-14` | **Historical World Preservation Vault** | $14,316,594,900 | Save compressed world-state snapshots for postgame comparison. |
| `112-15` | **New Game Plus World Seed Charter** | $20,329,564,700 | Start a fresh seed without changing or deleting the completed campaign. |
| `112-16` | **The Last Jungle Completion Certificate** | $28,867,981,900 | Award victory only when the full authoritative audit and stability window pass. |

**Branch-level verification:** Unlock 112-01 using the described world state; buy all 16 in a controlled test save; compare baseline versus upgraded operation under identical seed, weather, input stock and equipment condition; reload; confirm the effect persists and does not generate cash, water, energy, pollution or inventory without a recorded source. Test partial adoption on a fresh save, and confirm at least one observable 3D/visual change for the equipment-building nodes.

## 95.3 Registry implementation and anti-duplication gates

- Validate exactly 640 unique new IDs and exactly 1,696 combined IDs; no old branch 01–72 may be renamed or dropped.
- At runtime, reject or visibly report duplicate IDs, duplicated grant events, broken prerequisites, missing effect implementations, unsupported save schema and credits charged without a successful state mutation.
- Maintain an `effects` switch/registry linking each table row to the corresponding typed module. Create automated tests named by ID such as `upgrade_73_01.test.ts` or a generated structured suite with distinct fixtures. A generic test that only asserts `purchased=true` does not satisfy the mechanic-specific test.
- A completionist can optionally collect all upgrades, but the standard 170-hour objective is to reach eight medals with a carefully chosen meaningful subset; do not force every expensive upgrade branch as a mandatory unlock.
- Support 112 branch tabs, global filtering, build-synergy search, cost-to-go, per-branch stats, favorite upgrades, costs by currency units and cross-system effects, with virtualized UI so the atlas stays responsive.
- Provide a branch analytics panel: chosen nodes, actual savings, machine efficiency changes, achieved outputs, energy/water/pollution impact and visual enhancement. Never show faked impact numbers.


# 96. EIGHT-MEDAL QUESTLINES AND LARGE-SCALE WORLD EVENTS

The world is not a generic collection of meters. Turn each endgame medal into a **distinct questline with physical work, different region-specific problems, and legible rewards**. NPC job requests are fictional industrial contracts in the satire; they do not require dialogue-heavy plot or moralizing. Medal progress relies on the authoritative sim; quests only help players understand and accomplish it.

## 96.1 D1 — Stable desert campaign

- Map all 16 provinces, then identify at least 64 contrasting micro-biomes with ground conditions.
- Complete a regional pipeline of terrain grading, forest clearing, drainage, land-use change and desert stabilization through actual operations.
- See the first 1 km², 10 km², 50 km², 100 km², 300 km² and 600 km² convert with satellite time-lapse comparisons.
- Investigate why a city footprint with beautiful tan pavement is not desert underneath. Enable actual subsoil work/sensors.
- Solve the final islands, mountain valleys, riverbeds, weather-protected cliff pockets and groundwater refuges.

## 96.2 D2 — No living trees or seed bank

- Distinguish 25+ species by regeneration behavior and terrain suitability.
- Start by chopping one small jungle tree with a plastic butter knife; later clear old-growth canopies using real forestry fleets.
- Run sapling patrols, tree-seed surveys and stump/root excavation jobs.
- Shut down or convert industrial tree plantations that otherwise keep regrowing.
- Last forest pockets are findable with binoculars, ground scanners, drones and district patrols; never rely on random pixel hunting.

## 96.3 D3 — No viable freshwater supply

- Identify at least 20 important watersheds and 1000+ local water stores represented through scalable reservoir aggregation.
- Commission a truly connected pump and pipeline network; test daily electric, water, maintenance and revenue costs.
- Watch lakes retreat via moving 3D water surfaces, exposed shoreline geometry and stranded structures.
- Storms can refill a depleted basin; late-game weather and water-balance interventions must make the remaining system stable.
- The last spring/aquifer must be precisely locateable and accessible with a real gameplay work order.

## 96.4 D4 — Atmospheric carbon overload

- Gain access to the global atmospheric ledger only after the player operates multiple emission sources.
- Increase emissions by **running** actual measured machinery/factories/power stations/logistics, not by purchasing an abstract `+CO₂` button.
- Discover which firms are emission-intensive and how their income changes with demand and grid mix.
- Track carbon sinks from surviving vegetation and stored soil; deleting a tree affects sinks as well as carbon release through disposal.
- Maintain carbon burden above the stylized cap during the final audit window without requiring physically impossible percentages.

## 96.5 D5 — Pollution saturation of all regions

- Build multiple real contaminating industry types and see different airborne/deposited materials.
- Learn wind patterns, inversion valleys, rain washout, toxic runoff, and pollutant transport from actual source ledgers.
- Fill coverage gaps in at least 576 districts; each has a separate target and pollution composition profile.
- A dusty quarry does not look like a soot-heavy smelter, acid plant or oil terminal. Inspect and replay differences.
- Diagnose the last clean region: it may be shielded by mountains, rainfall, distance, maintenance shutdown or clean-grid decisions.

## 96.6 D6 — Soil sterility

- Use soil inspection, topsoil removal, erosion, mineral exposure, salt accumulation, and construction footprints with real underlying-soil storage.
- Distinguish loss of vegetation from loss of viable soil—cutting grass alone is not enough.
- Heavy rains may wash fertile sediment into former empty riverbeds, delaying completion.
- Restore equipment access to protected terrain pockets with roads, bridges or cable operations.
- Complete a full-world soil audit independent of render LOD or camera location.

## 96.7 D7 — Heat collapse

- Display urban heat island and factory thermal output separately from fictional greenhouse forcing.
- High CO₂ alone may increase average heat but should not automatically satisfy distributed 16-province conditions.
- Build and power sufficient regional heat-intensive industry or thermal networks to affect all target provinces.
- Handle cooling storms, highland fog and heat sinks that temporarily reduce local thermal stress.
- Use an 8–12 day trend forecast to avoid sudden threshold regressions at final audit.

## 96.8 D8 — Wildlife habitat exit

- Track habitat suitability and abstract wildlife populations; do not require hunting or harm against individual animals.
- Logging, soil drying, water loss, noise, roads and pollution destroy habitat through the game's ecosystem rules.
- Visible fauna population and ambient sound must decline as the model predicts, with reappearance if a viable region recovers.
- Endgame district surveyors find isolated livable pockets. Their removal follows land/environment operations.
- Final report explains ecological causes rather than pretending animals vanished solely because the UI bar reached 100.

# 97. NEW GAME SYSTEMS AND OPTIONAL CONTENT THAT SUPPORTS A LONG CAMPAIGN

The following features should be prioritized where they add recurring actual decisions, never inserted as filler. Each feature must declare UI, save data, asset requirements, performance model, tests and player value before implementation.

## 97.1 Player, tool and work-life details

- Manual actions: variable-direction cutting, cutting depth, tool wear and sharpening, dragging with ropes, attaching hooks, rolling trunks down slopes, carrying planks, splitting wood, moving crates, moving machinery into service positions and repairing components.
- Player comfort settings: adjustable stamina severity, auto-hold and optional accessibility control for repeated actions; do not arbitrarily prevent player from completing starter stages.
- Skill records: trees cut by hand, logs dragged distance, manually made product value, vehicle driving precision, construction/factory commissioning records.
- Tool display: original plastic butter knife retains historical records and is visible in a workshop trophy room even after industrialization.

## 97.2 Society and settlements

- City population is deliberately aggregated and fictional; simulate services and jobs, not detailed real-world harm.
- Companies can compete for labor, electricity, water and freight delivery bandwidth.
- City residents buy furniture, packaging, electronics and food, giving factories internal demand rather than infinite magical buyers.
- Pollution makes dense city development less profitable and creates strategic choice: extract money while it works, then repurpose or abandon expensive properties.
- Empty streets, broken windows and dust-encroached plazas visually communicate city decline when the world reaches aridity extremes.

## 97.3 Industrial exploration and discoveries

- Rare old-growth trees, special ore seams, unusual rock textures, abandoned mills, ruined industrial structures and waterfall sites provide exploration goals.
- Unlock playable archaeology-like salvage sites via original fiction, not copyrighted locations or asset packs.
- Use mining/scanning surveys to identify finite mineral resources; deposits cannot be mined forever.
- Regional factories and contracts require diverse real inputs, encouraging exploration and logistics rather than always choosing the nearest flat clearing.

## 97.4 Industrial disasters and lifecycle

- Breakdowns: damaged saw tooth, diesel engine failure, jammed chipper, broken conveyor belt, overheated crane brake, ruptured water main, grid line fault, rack thermal alert, city sewer backup and storm-damaged warehouse.
- Show a concrete work order and required replacement item to repair each one.
- Disasters can change the world (fallen trees, floods, deposited pollutants, washed-out ground) but must not irreversibly ruin a game save or destroy everything at random.
- A damaged factory produces no saleable output until the affected line is repaired; smoke/heat/energy reflect actual operation.

## 97.5 Prestige and self-imposed modes

- Optional 'Knife Loyalist', 'No Data Centers', 'All Rail Freight', 'Clean Grid Only', 'No Instant Travel', 'Single Industry Starter' and 'High Weather Volatility' scenarios.
- Standard campaign must remain completable **without** purchasing all optional upgrades or building data centers.
- New Game+ can preserve encyclopedic unlocks or cosmetic distinctions but starts a new world seed and independent environmental ledger. The original victory file remains immutable.

# 98. EXPANDED PRODUCTION ROADMAP — COMPLETE WORKING FEATURES IN ORDER

Continue and preserve README milestones M0–M9 and previous extension phases E10–E19. The **V2 roadmap extends through E20–E35**, never skipping the starter physical loop. The coding AI must verify earlier milestones before adding later dependencies. Each milestone lists code/asset/test proof; update the four status files on every genuine state change.

| Phase | Concrete deliverable | Mandatory proof before marked complete |
|---|---|---|
| **E20** | V2 design reconciliation and schema migrations | Current working game loads; old saves mapped; 1,056 old upgrade IDs intact |
| **E21** | 24,576 m world boundaries and 2,359,296 cells | Cell index/end bounds, all provinces traversable, 576 chunks valid |
| **E22** | Real-3D province biome differentiation | Actual forest/wetland/mountain/coast meshes; no billboard trees |
| **E23** | Large-scale climate and weather engine | Reproducible cloud, rain, wind, storm events; source-driven weather fields |
| **E24** | Hydrology, subsoil and aquatic destruction | Water conservation, receding lakes, last-basin inspection, dry lake geometry |
| **E25** | Pollution chemistry and visible dirty world | At least 12 identifiable pollutant visuals; source and deposition maps |
| **E26** | Working thermal, carbon, ecology and biodiversity | Baseline/sinks/sources, habitat progression, 8 metric previews |
| **E27** | Giant city construction and urban economics | Multi-floor stages, actual rent/occupancy/utilities/profit |
| **E28** | Megaindustries and manufacturing recipes | Steel, cement, chemical, food and electronics plants with ledgers |
| **E29** | Ports, airports, industrial road/rail corridors | Route loads, ticketed freight, real delivery, no teleport cargo |
| **E30** | Second-generation hyperscale data centers | Actual racks/jobs/fiber/cooling power and revenue reconciliation |
| **E31** | Advanced world-scale industrial automation | Cross-province job planner, source reservations, exception queue |
| **E32** | New 640-upgrade catalog (73–112) | Exactly 640 new distinct IDs, dependencies, real effects and unit tests |
| **E33** | Eight medal victory system and last-blocker investigations | All eight exact targets, 12-day stability, double world audit |
| **E34** | 150–200-hour balancing / robust performance and save recovery | Benchmarks, scenario simulations, save migration and browser E2E |
| **E35** | Full release, final cinematic, accessibility and QA polish | No game-blocking defects, public release build reviewed, final scorecard |

**Game must stay playable at every phase.** Deploying a UI panel without underlying functionality is an incomplete phase. When a test or dependency fails, mark it `needs work`, repair it, and rerun relevant checks before proceeding.

# 99. ADDITIONAL V2 ACCEPTANCE TESTS — NEVER REPLACE OLD TESTS

Append these to README acceptance criteria and expansion X001–X090. New IDs **V201–V300** are additive. The tool must execute genuine automated tests where practical and perform actual browser interaction tests with evidence for interactive/visual requirements.

| Test | Required result |
|---|---|
| V201 | World size is exactly 24,576 m square; geometry coordinates and physics match. |
| V202 | Grid contains exactly 1,536×1,536 = 2,359,296 campaign cells. |
| V203 | Each of 16 provinces spans a real 6,144 m square with its own terrain and ecosystem parameters. |
| V204 | All 576 districts have stable identities and can be selected on the map. |
| V205 | No required cell exists outside reachable/simulatable world bounds. |
| V206 | Active and distant simulation across two chunks produce conserved resource results. |
| V207 | Loading the 604 km² map does not instantiate every fine tree or building as one JS object initially. |
| V208 | No 3D world object is an image plane/PNG substitute; visible trees/machines/buildings have actual mesh. |
| V209 | The starter plastic butter knife works with actual hits, tree fall, log drag and fire sale. |
| V210 | The original 1,056 upgrade IDs remain valid after V2 save migration. |
| V211 | New upgrade IDs range from 73-01 to 112-16, each with 16 per branch. |
| V212 | Combined upgrade registry contains exactly 1,696 unique IDs. |
| V213 | Each claimed working new upgrade has an effect-specific test. |
| V214 | All upgrade prerequisites form a valid acyclic graph, with no unreachable required progression. |
| V215 | Purchasing one upgrade cannot apply it twice on double-click. |
| V216 | Save/load preserves cost, node ownership and actual applied mechanical effect. |
| V217 | Locked/unbuilt upgrades are honestly identified in development UI. |
| V218 | D1 uses actual stable desert cells and cannot reach 100 with a painted tan terrain. |
| V219 | D2 is strictly below 100 when any viable tree or sapling remains. |
| V220 | D3 is strictly below 100 when a required freshwater reservoir/aquifer fails dryness. |
| V221 | D4 responds to real emissions and sinks, not an upgrade that adds free CO₂. |
| V222 | D5 fails if any of the 576 required districts lacks pollution coverage. |
| V223 | D6 fails if one required cell has recoverable fertile soil under a building. |
| V224 | D7 fails when a province is below its sustained thermal threshold. |
| V225 | D8 fails when a required viable habitat/refuge remains. |
| V226 | Eight displayed 100% text values are not enough: all discrete gates must pass. |
| V227 | Victory fails if any medal regresses inside the 12-day stability window. |
| V228 | Two independent full-world audits agree on authoritative end state. |
| V229 | Final audit is independent of camera location and loaded render chunks. |
| V230 | Victory is impossible if 2,359,295/2,359,296 eligible cells qualify. |
| V231 | Last failing cell UI reveals coordinate, diagnosis and feasible work route. |
| V232 | Full victory report reconciles with recorded 8-medal time series. |
| V233 | Atmospheric CO₂ is labeled as fictional concentration/cap progress, never literal 100% pure CO₂. |
| V234 | Water conservation holds across sources, sinks, pumps and evaporative transfer. |
| V235 | Pumping a disconnected or dry water source produces no free water. |
| V236 | A drying lake visibly recedes and uncovers walkable genuine 3D lakebed geometry. |
| V237 | Rain can refill permitted watersheds and regress progress according to model. |
| V238 | Dryness predicate excludes scenic boundary saltwater consistently. |
| V239 | Industrial return water is tracked separately from water consumed. |
| V240 | Weather does not apply the same random effect uniformly to all 604 km². |
| V241 | A moving storm front changes local conditions with correct map footprint. |
| V242 | Rain updates traction, wet wood, soil moisture and hydrology where warranted. |
| V243 | Wind influences pollution dispersion and selected machinery operations. |
| V244 | A drought changes vegetation/water but is not only a sky tint. |
| V245 | A lightning power fault can cause a measured server workload interruption. |
| V246 | A rain washout moves pollutants from air into water/soil ledger without loss. |
| V247 | A dust storm increases intake filter wear and reduces visibility. |
| V248 | Wildfire consumes tracked biomass; smoke and ash output reconcile to consumed amount. |
| V249 | Weather warnings provide useful lead time in standard campaign mode. |
| V250 | Extreme events are recoverable and do not corrupt saves. |
| V251 | Soot, dust, salts, chemicals and oily surfaces have visibly distinct 3D/material states. |
| V252 | The pollutant map can isolate at least 12 separate material classes. |
| V253 | Plume direction changes with wind and source shutdown. |
| V254 | A passive smoke effect cannot persist when an emitter is completely inactive. |
| V255 | Pollution dispersion retains traceable source/sink mass within declared tolerance. |
| V256 | Rain and inversion produce different pollutant field movements. |
| V257 | Clean remote district blocks D5 until actually contaminated under the game rules. |
| V258 | Buildings accumulate grime according to local source concentration. |
| V259 | World desert states have at least six visually distinct geology/pollutant variants. |
| V260 | Waterless dirt beneath a skyscraper is audited rather than exempted. |
| V261 | Factories do not pay revenue while disabled or without inputs. |
| V262 | Every giant factory shows stage construction, real resource deliveries and commissioning. |
| V263 | City buildings have construction costs and actual occupancy/utilities. |
| V264 | City rent changes with jobs, pollution and supply adequacy. |
| V265 | City population cannot grow without accessible housing capacity. |
| V266 | Municipal water consumption lowers connected finite stores. |
| V267 | Sewage/waste quantity is derived from modeled production/occupancy. |
| V268 | A 100-floor tower has materially distinct 3D geometry and real capacity. |
| V269 | A building cannot be placed on an occupied/invalid foundation without resolution. |
| V270 | Demolition returns bounded salvage and preserves waste streams. |
| V271 | Data center racks visibly exist as 3D geometry in an inspectable hall. |
| V272 | A data center earns only after actual powered and networked compute work completes. |
| V273 | Cooling failure reduces output and may trigger thermal shutdown. |
| V274 | Rack counts in inspector match installed nearfield/aggregate hardware. |
| V275 | Data center electrical demand appears in the actual grid ledger. |
| V276 | Waterless cooling mode has reduced efficiency, not free full output. |
| V277 | Cross-campus failover respects available power, bandwidth and server capacity. |
| V278 | Reported campus profit subtracts power, repairs, water and finance costs. |
| V279 | Grid dispatch cannot produce or sell more energy than generator output plus storage. |
| V280 | Transmission losses and batteries obey conservation and efficiency. |
| V281 | A blacked-out mine stops producing powered ore output. |
| V282 | Freight shipment inventory is conserved while crossing a streamed chunk boundary. |
| V283 | Multi-vehicle loading avoids duplicate hauling of a single log ID. |
| V284 | Cargo aircraft cannot land/use a noncommissioned runway. |
| V285 | A disconnected port cannot magically complete a local delivery contract. |
| V286 | Climate time-series exports have valid units, time and no fabricated history. |
| V287 | Facility attribution reconciles CO₂/energy/pollution to source machines. |
| V288 | HUD financial totals reconcile with recorded production and sale ledger. |
| V289 | Province stats match the sum of authoritative district/cell values. |
| V290 | Map heatmap shows uncovered pollution areas, not merely a single percent. |
| V291 | An unreachable automation job appears in exception queue rather than vanishing. |
| V292 | Automation cannot work for free without machine, fuel/power, inputs and transport. |
| V293 | Late-game speed-up preserves source/sink balances and weather event causality. |
| V294 | Endgame weather regeneration does not make a required medal permanently impossible. |
| V295 | A zero-cash deadlock has a reasonable recovery path. |
| V296 | Three save slots and one export/import roundtrip preserve all eight exact metrics. |
| V297 | Game remains playable at graphics low preset with all completion feedback understandable. |
| V298 | Midrange benchmark reports measured FPS, memory, chunk count and rendering cost. |
| V299 | Campaign pace is evaluated via simulated player archetypes plus tracked playtest data. |
| V300 | Public-release victory achieved legitimately in a complete real-world browser E2E scenario. |

# 100. PREVENT HOLLOW “FEATURE BLOAT” — FUNCTIONALITY FIRST, BEAUTY SECOND, THEN BOTH

This project is huge. A fully playable core is more important than claiming that 1,696 buttons or 604 km² of empty terrain constitute a finished game. Every feature must survive the following quality bar before it is marked **completed**:

1. **Visible affordance:** the user can see and discover it in the game without reading the code.
2. **Real action:** it responds to input, a scheduled job or meaningful external simulation state.
3. **Causal inputs:** it draws from appropriate inventory, energy, water, worker or machine availability.
4. **Mechanic-specific effect:** it alters actual geometry, physics, income, output, source/sink balance, navigation, statistics or permitted operations.
5. **Persistence:** its state survives reload, migration and late-game time acceleration.
6. **Failure mode:** resource shortages, weather or maintenance can alter the result transparently when relevant.
7. **Accounting:** the HUD and source ledger are mutually consistent.
8. **Testing:** unit/integration/browser tests (as appropriate) confirm the intended behavior.
9. **Visual polish:** 3D object, material, movement, particles/sound and user feedback match the action.
10. **Performance:** the scene remains playable in the agreed environment and has sane LOD/aggregation.

No inert unlocks; no fake smoke sources; no income-only cities with no occupied property; no 3D pictures used in place of actual tree models; no desert percentage painting; no claims of final completion after implementing only a small slice. Mark unfinished work truthfully.

# 101. FILES THE CODING AI MUST KEEP UPDATED THROUGHOUT BUILD

**`tasks.md`** is an itemized work queue tagged `[ ]`, `[~]` or `[x]`, with feature ID, milestone, priority, implementation file path, owner agent and test evidence. **`completed.md`** lists only reviewed, tested accomplishments and commit hashes or build revisions. **`continue-working.md`** records the exact next actionable issue, what is currently working, what is built but untested, failing tests, game-play blockers and the next execution command. **`KNOWN_ISSUES.md`** tracks reproducible defects, severity, owner and attempted fixes. Add a **`FEATURE_MATRIX.md`** crosswalking each of the 1,696 upgrades and eight victory objectives to code and tests, and **`BALANCE_REPORT.md`** with economy progression and estimated campaign completion from repeatable simulation.

Suggested statuses: `planned`, `working on`, `built — needs test`, `test failing`, `needs rework`, `tested — passed`, `reviewed`, `completed`, `blocked — external`. Never mark a task done based on code generation alone. On every milestone, run lint/type check/build and key gameplay tests, record the actual outcomes, then continue to the next feasible unfinished milestone.

# 102. TARGET PERFORMANCE, LEGIBILITY AND COMPLETENESS CHECKLIST

Provide a clean main menu with Continue/New Game/Load/Settings/Credits/Benchmark, a polished in-world HUD, a 3D title backdrop of a living jungle, actual save management, map, eight planetary-metric widgets, inventory, shop, research, construction, finances, machine inspectors, districts, contracts, climate, pollution, data centers, cities, automation, help and accessible controls. Navigation must be keyboard/pointer/controller compatible where feasible and not bury key information behind repetitive modal windows.

Use high-contrast numbers on dark/light adaptable cards, smooth chart zoom, sparklines sourced from actual data, good typography, GPU/CPU-friendly environmental effects, clear mini-map, global search/filter, direct 'go to source' actions, camera bookmarking, scalable tooltips, theme-consistent icons and responsive layouts. Make the first ten minutes extremely clear even though the eventual game is enormous. Let players physically enjoy their own industrial empire from first person rather than playing exclusively from spreadsheets.

**Graphics benchmarks:** trees are real 3D branches and leaves; there are huge forests in distance through spatially clustered 3D geometry; winds move tree crowns; lumber falls and stays moved; smog forms volumetric clouds; city towers cast shadows; vehicles carry visible cargo; power stations look alive when running; water visibly evaporates/shrinks over the campaign; dried lakebeds are explorable; six desert material palettes appear in correct regions; 8-medal victory cinematic shows persistent actual ruins. Tune visuals without turning the world into a slideshow.

# 103. FINAL AI CODING MASTER DIRECTIVE — BUILD THE GAME, VERIFY IT, THEN POLISH

**You are implementing Project Clearcut: The Last Jungle, a huge original 3D browser-based chore simulator and industrial ecosystem-collapse tycoon.** The first play action is cutting down a real 3D tree with a **plastic butter knife**, hauling the fallen trunk physically into a **fire-sale pit**, then investing that money into better cutting, transportation, wood refining and manufacturing. The end is a 604 km² world of distinct wasteland biomes, working mega-factories, visible mines, railways, cities, large buildings, pollutant-specific smog and sprawling data-center campuses. There is an actual power grid, dynamic weather and water, climate, CO₂, pollution, soil and wildlife simulation. A fully audited final victory needs **eight separate 100% objectives**, including all 2,359,296 land cells stable desert, no living/viable trees, drained terrestrial freshwater/aquifers, fictional atmospheric CO₂ at campaign cap, pollution in every required district, sterile soils, persistent regional heat stress, and no viable wild habitat.

The user expects a game taking **well over 100 hours** to finish by normal play, with a balanced target median of approximately 170 engaged hours—not 170 hours of waiting. There are **1,696 named upgrades across 112 branches**, including **640 entirely new V2 upgrades**, real tools and machines, multiple viable industrial strategies, 3D construction, data-center workloads and live, reconciled statistics. Keep the previous README and first extension fully integrated. Later numeric definitions here override earlier map length, campaign duration, upgrade count and victory requirements.

**Required agent execution loop:** inspect project → compare current implementation against milestone list → select highest-priority playable gap → implement complete vertical feature → run compile/build/unit tests → play in a real browser → fix visual, physics, gameplay and save defects → record status and proof in the project files → move to next task. Work from the opening loop outward while preserving an always-playable version. Do not treat a static design document, fake UI, isolated screenshots, partially implemented 3D world, disconnected upgrade store, or plausible but untested simulation as the finished game. Do not falsely claim every feature has been built. The final playable release must survive exact world-state victory tests and deliver the full 3D, statistical and mechanical experience described.

---

## DOCUMENT CONSISTENCY NOTE

This `prompt.md` contains the previous Sections **31–65** and the second expansion **66–103**. It must be paired with the unchanged foundational **`README.md` Sections 1–30**. The prior document remains the main mechanical contract and the new expansion is the higher-priority contract only for explicitly superseded properties. Every named source system, world-rule exception, upgrade identifier, target and test should be mapped into code before release is called complete.


---

# END OF COMPLETE SECTIONS 1–103 — EXECUTION HANDOFF

This single document contains the unabridged original and expanded scope. Implement it in **Unity 6000.6.10f1** using **Unity MCP** and **Blender MCP** as mandatory live development tools, with the **web build as primary**, verified Windows/Linux releases, and continued work in the existing GitHub repository. Before reporting any requirement complete, cite the actual committed Unity implementation path, corresponding test and observed result. On the next action, inspect the repository and MCP/editor state, then make the playable vertical slice genuinely run.
