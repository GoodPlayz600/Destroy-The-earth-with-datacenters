# Continue

Brief: `/home/blynx/Downloads/PROMPT.md`. A copy is in the Unity project's `Assets/PROMPT.md`.

> The first five minutes must actually work: **$0 + plastic butter knife → physically cut a small real-3D tree → falling and colliding 3D log → drag to actual fire-sale pit → sale transaction → working upgrade → saved progress**.

The active Unity project is `/media/blynx/D/unity/Destroy-The-Earth-With-Datacenters`. The tracking files are in the Codex workspace. Unity and Blender MCP checks passed for read operations. No Unity gameplay milestone has been verified yet. Next is the source and asset audit, requirements index, and a playable opening.

The Unity project is on `codex/unity-clearcut`. Existing working-tree edits predate this session. Its configured origin differs from the legacy GitHub URL in the brief. The legacy main at `faf09f5` was read separately. The Unity project's `FEATURE_MATRIX.md` is the per-requirement evidence ledger. Web, Windows and Linux Unity modules are installed. Blender MCP also ran a Python read against the saved `Untitled.blend`, and FBX export is available.

The opening C# services and scene are on disk. The Blender source lives at `Assets/Models/Source~/OpeningKit.blend`, with imported FBX files in `Assets/Models/Clearcut/`. Runtime features are spread across `Assets/Clearcut/Runtime/`; `Clearcut > Build Opening Scene` rebuilds the saved scene from its Blender exports. The Web template lives in `Assets/WebGLTemplates/Clearcut/`. As of the latest check, usage was 55% of the five-hour window and 83% weekly remaining. Web build job `build-73e70546a3` is scheduled. Treat play, sale, upgrades and saves as unverified until a runtime pass.

The legacy Web history is preserved locally as `reference/legacy-web`. The current Web build progressed through asset and shader import into IL2CPP / WebAssembly compilation. Unity's editor test now has a separate smoke-test save slot and a report at `Builds/Evidence/opening-smoke.txt` once it runs. See `UNITY_BUILD.md` for local play and rebuild instructions.

The editor smoke test passed. Its report is `Builds/Evidence/opening-smoke.txt`. It drives the normal gameplay methods with a test-only save slot. Actual browser keyboard and mouse input are a separate verification step. The first Web job failed because the Emscripten linker could not resolve Embind symbols. The pinned project now supplies `-lembind` and job `build-afa88a3e08` is retrying. The usage panel was restored after a browser disconnect and showed 41% five-hour and 81% weekly remaining.

The revised source is `Assets/Models/Source~/OpeningKitArtPass.blend` and the FBX exports are in `Assets/Models/Clearcut/`. The first opening is preserved in local commit `248ebf0` and `OpeningKit.blend`. Latest art changes include separate sapling, ribbonwood and ironwood silhouettes, sculpted roots and leaves, flowers, moss boulders, a cordwood crate, a revised Ash Exchange and a tapered 3D flame. The latest Unity scene is saved. The second Web build still had unresolved Emscripten value symbols. The retry uses explicit WebGL 2 graphics and clears the temporary Embind argument. The current browser connection closed while running the Mana reference, so the last confirmed usage read remains 41% and 81% pending reconnection.

## Latest handoff

The final art revision is in `Assets/Models/Source~/OpeningKitArtPass.blend`. Unity exported the last successful solo Web build to `Builds/Web-Opening`. The updated scene and Photon integration are on the local Unity branch. The clean Photon transport report is `Builds/Evidence/photon-transport.txt`. The user supplied the Realtime App ID and reported **10%** usage left. The App ID should be entered locally in Multiplayer and kept out of public source.

For co-op tests, open the Web build twice, enter the same Realtime App ID and region, then host and join with the same room code. Verify the avatar motion, guest chop, host haul and burn, and sync of the receipt and wallet. Guest hauling and upgrade purchases still need implementation, as do desktop Photon support, host recovery, and long-session testing. The current clearing is the Unity opening. The full campaign, factory and logistics systems, eight victory objectives, and public release remain open in `FEATURE_MATRIX.md`.

### November 22 continuation

The GitHub branch `codex/unity-clearcut` includes README, the exact root prompt, and game models through commit `ce13804`. The models were downloaded and checked in a clean clone. The first Unity Web room reached two clients and the guest applied its host snapshot. The next Web candidate adds content-hashed files, guest hauling and guest purchases. The editor smoke test passed the guest authority checks. Verify the candidate with two live clients before marking the full upgrade or hauling route as verified. Usage was 73% in the five-hour window and 70% weekly at the last browser check. The next gameplay milestone is a physical timber yard with raw sales, milling, drying, and higher-value products.

### Timber-yard checkpoint

The expanded opening and timber yard passed `Builds/Evidence/opening-smoke.txt` and were pushed as `d5f92c1`. The editable yard kit is `Assets/Models/Source~/TimberYard.blend`. Web, Windows x64, and Linux x64 builds completed under `Builds/TimberYard` after running each desktop target individually. Linux initialized with a graphics window. The Windows build reached engine startup through headless Wine.

Two Web clients joined the same Photon room and the guest received the host wallet. Guest actions exposed a Web-only error when Unity tried to create a stripped collider on an avatar. The replacement is a saved, collider-free `FieldOperatorAvatar` prefab. The corrected Web build is rebuilding. After it ships, verify an actual guest purchase and record whether the host and guest both see the new wallet balance. Live guest hauling through the timber yard still needs dedicated coverage.

Primitive tether, sled, and cart hauling, the rest of the upgrade effects, the full traversable world, and later campaign systems are outstanding. At the last observed usage check, the five-hour window had 29% remaining and the weekly window had 63%.
