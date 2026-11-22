# Project Clearcut · The Last Jungle

A first-person Unity game about starting a forestry operation with a plastic butter knife and no money. In the current playable opening, cut a sapling, drag its timber to the Ash Exchange, collect payment after the burn, and spend the proceeds on tools or hauling upgrades.

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
| Tab, Escape, or I | Open the field desk |

## Play co-op

The Web build connects to Photon Realtime. In **Field desk → Multiplayer**, enter a Realtime App ID and region. One player hosts a copy of their solo clearing and shares the room code. Other players enter the same App ID, region, and code. Keep your App ID out of commits. [Photon Dashboard](https://dashboard.photonengine.com/)

## Project files

- [Master specification](prompt.md) and [feature matrix](FEATURE_MATRIX.md)
- [Editable Blender project](Assets/Models/Source~/OpeningKitArtPass.blend) and [FBX exports](Assets/Models/Clearcut)
- [Completed work](completed.md) and [continuation notes](continue.md)

The playable Unity scope currently covers the forestry opening. The larger campaign, industrial systems, full map, and eight victory objectives are tracked in the feature matrix.
