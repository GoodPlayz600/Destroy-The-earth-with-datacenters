# Continue

Brief: `/home/blynx/Downloads/PROMPT.md`. A copy is in the Unity project's `Assets/PROMPT.md`.

> The first five minutes must actually work: **$0 + plastic butter knife → physically cut a small real-3D tree → falling and colliding 3D log → drag to actual fire-sale pit → sale transaction → working upgrade → saved progress**.

The active Unity project is `/media/blynx/D/unity/Destroy-The-Earth-With-Datacenters`. The tracking files are in the Codex workspace. Unity and Blender MCP checks passed for read operations. No Unity gameplay milestone has been verified yet. Next is the source and asset audit, requirements index, and a playable opening.

The Unity project is on `codex/unity-clearcut`. Existing working-tree edits predate this session. Its configured origin differs from the legacy GitHub URL in the brief. The legacy main at `faf09f5` was read separately. The Unity project's `FEATURE_MATRIX.md` is the per-requirement evidence ledger. Web, Windows and Linux Unity modules are installed. Blender MCP also ran a Python read against the saved `Untitled.blend`, and FBX export is available.

The opening C# services and scene are on disk. The Blender source lives at `Assets/Models/Source~/OpeningKit.blend`, with imported FBX files in `Assets/Models/Clearcut/`. Runtime features are spread across `Assets/Clearcut/Runtime/`; `Clearcut > Build Opening Scene` rebuilds the saved scene from its Blender exports. The Web template lives in `Assets/WebGLTemplates/Clearcut/`. As of the latest check, usage was 55% of the five-hour window and 83% weekly remaining. Web build job `build-73e70546a3` is scheduled. Treat play, sale, upgrades and saves as unverified until a runtime pass.

The legacy Web history is preserved locally as `reference/legacy-web`. The current Web build progressed through asset and shader import into IL2CPP / WebAssembly compilation. Unity's editor test now has a separate smoke-test save slot and a report at `Builds/Evidence/opening-smoke.txt` once it runs. See `UNITY_BUILD.md` for local play and rebuild instructions.

The editor smoke test passed. Its report is `Builds/Evidence/opening-smoke.txt`. It drives the normal gameplay methods with a test-only save slot. Actual browser keyboard and mouse input are a separate verification step. The first Web job failed because the Emscripten linker could not resolve Embind symbols. The pinned project now supplies `-lembind` and job `build-afa88a3e08` is retrying. The usage panel was restored after a browser disconnect and showed 41% five-hour and 81% weekly remaining.
