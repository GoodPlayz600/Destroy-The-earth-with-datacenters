# Continue

The brief lives at `/home/blynx/Downloads/PROMPT.md`. Both the root `prompt.md` and `Assets/PROMPT.md` match it byte for byte.

> The first five minutes must actually work: **$0 + plastic butter knife → physically cut a small real-3D tree → falling and colliding 3D log → drag to actual fire-sale pit → sale transaction → working upgrade → saved progress**.

## Project

The active Unity project is `/media/blynx/D/unity/Destroy-The-Earth-With-Datacenters` on branch `codex/unity-clearcut`. The brief's GitHub repository is `GoodPlayz600/Destroy-The-earth-with-datacenters`. Push this branch to that repository explicitly. The configured `origin` points to a different account. Existing changes to several project settings and the standalone `Untitled.blend` predate this work.

The editable opening and yard art live under `Assets/Models/Source~/`. Unity imports FBX exports from `Assets/Models/Clearcut/`. The saved scene is `Assets/Scenes/TheLastJungle.unity`. Use **Clearcut → Build Opening Scene** after editing the model kit and **Clearcut → Run Opening Smoke Test** for the isolated save and gameplay checks. See `UNITY_BUILD.md` for local play and rebuilding.

## Timber-yard checkpoint

The expanded opening and timber yard passed `Builds/Evidence/opening-smoke.txt` and were pushed as `d5f92c1`. The editable yard kit is `Assets/Models/Source~/TimberYard.blend`. Web, Windows x64, and Linux x64 builds completed under `Builds/TimberYard` after running each desktop target individually. Linux initialized with a graphics window. The Windows build reached engine startup through headless Wine.

Commit `78d2571` replaces collider-dependent avatar creation with the saved `FieldOperatorAvatar` prefab. The corrected Web build passed a two-client Photon purchase. The $75 Pocket Saw appeared installed for both players and each wallet showed $15 after starting at $90. For further tests, enter the supplied Realtime App ID locally and use the same region and room code. The ID stays out of the repository.

## Rope-hauling checkpoint

The Unity opening now sells ten upgrades with gameplay effects. The three rope upgrades passed the opening smoke test in `Builds/Evidence/opening-smoke.txt`. The Web player built successfully under `Builds/Towline/WebGL`. Both a solo player and a Photon guest attached the log with T and released it with G in Brave. The guest also moved with the rope attached. The latest build uses opening protocol version 4 so rope players use matching builds.

The next sled is modeled in `Assets/Models/Source~/PrimitiveSled.blend` and imports into Unity as `Assets/Models/Clearcut/PrimitiveSled.fbx`. The model includes the raised runners, cargo deck, bridle, and pulling eye. The $285 purchase, two-log cargo loading, and physical sled tow still need implementation.

## Next

- Verify guest movement, chopping, and hauling through a complete live timber-yard delivery with two clients. Desktop Photon support, host recovery, and long-session testing remain open.
- Implement the Crude Sled and then the cart with physical cargo. The runtime catalog already supplies the authored prices and prerequisites.
- Continue the full map, industrial systems, logistics, remaining upgrade effects, eight victory objectives, and public release. `FEATURE_MATRIX.md` tracks these requirements.
