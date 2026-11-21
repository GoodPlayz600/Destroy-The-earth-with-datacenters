# Photon multiplayer

Project Clearcut supports private invite rooms for up to four players. The host runs the shared campaign simulation. Guests can explore, cut trees with the equipped forestry tool, hand-haul logs to facilities, survey the world and place unlocked buildings using the shared budget. The host handles equipment changes, vehicle operation, research, contracts, and industrial controls.

## Enable Photon

1. Sign in to the [Photon Dashboard](https://dashboard.photonengine.com/) and create a **Realtime** application.
2. Copy the **App ID** from the app’s details. For testing, paste it into the game’s **Multiplayer** panel in each browser. For a shared deployment, copy [.env.example](.env.example) to `.env.local`, fill in `VITE_PHOTON_APP_ID`, set `VITE_PHOTON_REGION` (default `us`), then rebuild and deploy `dist/`.
3. Select **Host new room** or **Host a copy of solo**. Open **Esc → Room details → Copy invite** to share the link. Guests join using the same Photon App ID, region and game version.

The App ID identifies the frontend application to Photon. It is included in the browser build when configured at build time. Keep dashboard credentials, API secrets and custom authentication credentials out of the game configuration and repository. See [Photon’s Realtime quick start](https://doc.photonengine.com/realtime-core/v6/getting-started/quick-start-guide).

## Keep or move a shared campaign

- The host’s browser automatically saves the authoritative room checkpoint. Each guest saves a copy of the latest checkpoint it received. Solo play has its own save slot.
- **Esc → Room details → Save and close room** saves the host’s checkpoint and attempts a final update to connected guests. A sudden disconnect closes the guest session and leaves each browser with its latest local checkpoint.
- To continue, open **Multiplayer → Saved rooms → Reopen**. One participant reopens the campaign, and the others join the same code and region. Pick the host with the most recent checkpoint.
- To move a room to another device, use **Download room backup** in the live room or **Download** next to the saved room. On the other device, use **Import room backup**, then **Reopen**. Checkpoints are stored in IndexedDB and can be deleted when the browser’s site data is cleared. Photon handles live transport and matchmaking. Automatic account-based cloud saves would need separate persistent storage.

## Acceptance check with your App ID

Use two independent browser profiles. Host a new room, join by invite, confirm both crew avatars appear, and have the guest fell and deliver a sapling. Check that the host and guest see the same money after the burn. Close the room, reopen the saved checkpoint, rejoin, and check the harvest and balance after reload. Repeat with **Download room backup** and **Import room backup** on a fresh profile.
