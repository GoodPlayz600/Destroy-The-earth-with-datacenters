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
| F · L · H | Drive or exit · load or unload · couple or detach a trailer |
| Esc | Pause or close a panel |

In Settings, select **drag** look to use right-mouse drag in place of pointer lock. Touch devices use screen controls. Campaign saves live in IndexedDB for the site's origin. Export a backup from Settings before clearing browser data.

## Build and check

```sh
npm test
npm run build
npm run preview
```

Deploy the contents of `dist/` to a static host. The [GitHub Actions review](https://github.com/GoodPlayz600/Destroy-The-earth-with-datacenters/actions/workflows/review.yml) also packages a `Project-Clearcut-Web` artifact. Once extracted, run `python3 -m http.server 4173` inside the extracted folder and open `http://localhost:4173`. The production build uses relative asset URLs and needs no server-side game service. The field manual is available from the main menu. See [tasks.md](tasks.md) and [completed.md](completed.md) for the scope and review status.

## Browser test

```sh
npx playwright install chromium
npm run test:browser
```

The browser review checks the opening from a fresh campaign and imports prepared saves to verify refining, pickup delivery and the final cell. Chromium also checks touchscreen movement and chopping. Run `BROWSER=firefox npm run test:browser` after installing Playwright Firefox. On Linux systems without a hardware display, use `xvfb-run --auto-servernum env HEADED=1 BROWSER=firefox npm run test:browser`.

Heavy equipment and utilities unlock through the 24 research branches. Use the survey's remaining-cell markers to find unconverted ground. Site panels show deliveries, production buffers, power, water, and dispatch assignments. In a developed campaign, authorized crews can work on marked parcels while you continue harvesting and hauling.

Run `npm run test:performance` to exercise all 64 districts, reload the completed save, and measure another 180 simulation ticks. The funded scenario reports tick times and serialized save size. The browser review also samples five seconds of animation in a prepared industrial save at 960 × 660 with low graphics. Compare frame times on the same device and graphics settings.

## Accounts, cloud backup and leaderboard

On the hosted game, open **Account** from the main menu or pause screen. Accounts use ChatGPT sign-in. The game saves automatically in the current browser. Choose **Back up campaign** to store a copy on your account, and **Restore cloud backup** on another device to continue it. Restoring saves the current local campaign in **Settings → Archives**.

To share a run, create a cloud backup, enter a display name and choose **Post backup progress**. The board lists up to 50 entries per campaign mode. Ranking favors stable desert cells, then faster completion, then lifetime earnings. Entries reflect player-submitted campaign saves. You can remove your entries from Account.

The main menu and leaderboard reserve ad placements. These are empty slots until an ad provider or sponsor creative is connected.

`npm run build:sites` builds the Sites Worker as well as the browser bundle. The hosted game uses the `DB` binding for rankings and `SAVES` for private backups. The static build still supports local play, saves and imports. Online services require the Sites deployment.
