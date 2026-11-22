# Project Clearcut Unity opening

Open this project with Unity **6000.6.10f1**. The opening scene is
`Assets/Scenes/TheLastJungle.unity`. It is already generated and checked into
the Unity project. Use **Clearcut → Build Opening Scene** to regenerate it from
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
