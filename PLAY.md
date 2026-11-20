# Play Project Clearcut

Use Node.js 22.12 or later and a desktop browser with WebGL 2 enabled.

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite. Click **Play campaign**. Walk toward the sapling in front of you and hold the left mouse button while aiming at its trunk. Walk around the stump, hold **E** beside the log, and strafe or back up toward the Ash Exchange. Release the trunk at the stone ring and wait for the receipt.

| Control | Action |
| --- | --- |
| WASD · mouse | Walk and look |
| Left mouse | Swing or place equipment |
| E · G | Hold to drag or interact · release or push |
| Q or Tab | Equipment and inventory |
| B · U · M · J | Construction · upgrades · survey · journal |
| F · L | Drive or exit · load or unload |
| Esc | Pause or close a panel |

In Settings, select **drag** look to use right-mouse drag in place of pointer lock. Touch devices use screen controls. Campaign saves live in IndexedDB for the site's origin. Export a backup from Settings before clearing browser data.

## Build and check

```sh
npm test
npm run build
npm run preview
```

Deploy the contents of `dist/` to a static host. The production build uses relative asset URLs and needs no server-side game service. The field manual is available from the main menu. See [tasks.md](tasks.md) and [completed.md](completed.md) for the scope and review status.
