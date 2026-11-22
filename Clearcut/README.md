# Project Clearcut · The Last Jungle

A first-person Unity game about starting a forestry operation with a plastic butter knife and no money. In the current playable opening, cut a sapling, drag its timber to the Ash Exchange, collect payment after the burn, and spend the proceeds on tools or hauling upgrades. The timber yard offers a raw buyer and a processing route through rough boards, dried boards, and finished crates.

## Run the project

1. Install Unity **6000.6.10f1** and Git LFS. Run `git lfs pull` after cloning to fetch the binary models and textures.
2. Open the repository in Unity Hub. Open [TheLastJungle](Assets/Scenes/TheLastJungle.unity) and press Play.
3. For a browser build, install the editor's Web Build Support module and run `./Tools/install-photon-web.sh` from the repository root. Build the Web profile to `Builds/Web`. [Build and play instructions](UNITY_BUILD.md)

| Input | Action |
| --- | --- |
| WASD and mouse | Move and look |
| Shift and Space | Sprint and jump |
| Hold left mouse | Swing the butter knife |
| Hold E | Grab and drag timber |
| T and G | Attach purchased twine with T. Release cargo with G or T |
| 1 and 2 | Equip the knife or the purchased Pocket Saw |
| Tab, Escape, or I | Open the field desk |

## Timber yard

Release cargo inside a station intake. Look at a loaded sawmill or crate bench and hold the left mouse button to work. The drying rack runs on elapsed play time. Choose the intake for your cargo. The raw buyer takes logs and the lumber buyer takes processed goods. The **Market** tab compares payouts.

Buy **Twine Bundle** for $15 to pull one light log hands-free. Face a nearby log, attach the twine with T, and walk away to take up the slack. **Long Rope** extends the line by 50%. **Knotted Hitch** improves its grip on heavier cargo.

## Play co-op

The Web build connects to Photon Realtime. Open **Field desk → Multiplayer**. One player hosts a copy of their solo clearing and shares the room code. Other players enter the code and use the host's region. Configured builds load the Realtime App ID automatically. A fresh checkout can be configured before building or can use the in-game App ID field. [Build setup](UNITY_BUILD.md#photon-co-op)

## Project files

- [Master specification](prompt.md) and [feature matrix](FEATURE_MATRIX.md)
- [Editable Blender project](Assets/Models/Source~/OpeningKitArtPass.blend) and [editable timber-yard models](Assets/Models/Source~/TimberYard.blend). Unity imports the [FBX exports](Assets/Models/Clearcut)
- [Editable sled model](Assets/Models/Source~/PrimitiveSled.blend), its [FBX export](Assets/Models/Clearcut/PrimitiveSled.fbx), and [Blender regeneration script](Tools/generate-primitive-sled.py)
- [Completed work](completed.md) and [continuation notes](continue.md)

The playable Unity scope covers the forestry opening and the first timber-processing routes. The larger campaign, industrial systems, full map, and eight victory objectives are tracked in the feature matrix.
