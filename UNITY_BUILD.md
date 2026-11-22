# Project Clearcut Unity opening

Open this project with Unity **6000.6.10f1**. The opening scene is
`Assets/Scenes/TheLastJungle.unity`. The generated scene is checked into the Unity project. Use **Clearcut → Build Opening Scene** to regenerate it from
the FBX model sources after an art or layout change.

## Play

Click **Enter the clearing**, then use WASD and mouse look. Walk to the young
tree ahead, aim at the trunk, and hold the left mouse button to swing. Face the
fallen timber and hold E to drag it into the stone ring. Release E and wait for
the receipt. Open the field desk with Tab to buy a starter upgrade. Escape and I
also open the desk. If the browser blocks pointer lock, select **Hold right
mouse** in Settings. F5 checkpoints in the desktop player. Web checkpoints are
automatic and the field desk has an explicit save button.

## Local builds

Use the **Web**, **Windows**, and **Linux** build modules installed for the pinned
editor. Keep `TheLastJungle` checked in the scene list and use **File → Build Profiles**
to select the destination. Put output under `Builds/`, which Git ignores.

Run the Web output through a static HTTP server. From the project root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory Builds/Web
```

Open [the local Web build](http://127.0.0.1:4173/) while the server is running.
The local save belongs to the browser profile and origin. Open the same URL to
resume, or copy the backup text from the field desk before changing origins.

## Verify the opening

In Edit Mode with `TheLastJungle` open, choose **Clearcut → Run Opening Smoke
Test**. The test enters Play Mode with an isolated save, then writes its checks
to `Builds/Evidence/opening-smoke.txt` and returns to Edit Mode. The
[feature matrix](FEATURE_MATRIX.md) records acceptance evidence and remaining work.

## Photon co-op

Before building Web from a clean checkout, run `./Tools/install-photon-web.sh`
to install the pinned official Photon Realtime Core SDK into the Web template.

For automatic configuration, put the Photon Realtime App ID on one line in
`Assets/Clearcut/Resources/PhotonRealtimeAppId.txt` before building. This file
and its metadata are ignored by Git. Unity bundles the App ID in the Web client.
Builds without the file offer the App ID field in the game.

In each Web client, enter the clearing and open **Field desk → Multiplayer**.
Use the same region in both clients. One player clicks **Host a copy of solo**,
then shares the displayed code so another can choose **Join room**. The host retains its own room checkpoint. A room shares timber, money, and purchases. The host validates guest actions
and simulates forestry, hauling, sales, and workbench jobs. Use the pinned
project's Web module for Photon co-op.

## Upgrade data

Run `python3 Tools/generate-upgrade-catalog.py --check` to verify the runtime
catalog against the master prompt. The generated data keeps all 1,696 entries.
The field desk sells the entries with wired gameplay effects.

## Regenerate the sled model

Run Blender in a separate background process from the project root. The generator
writes the editable `.blend`, a Unity-oriented FBX, and a PNG preview to `Builds/Art`.

```sh
blender --background --factory-startup --python Tools/generate-primitive-sled.py
```
