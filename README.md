# PROJECT CLEARCUT: The Last Jungle

**Unity project** · [Clearcut source and setup](Clearcut/README.md) · [Blender and FBX models](Clearcut/Assets/Models/) · [Master Unity prompt](prompt.md) · [Completed work](Clearcut/completed.md)


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
