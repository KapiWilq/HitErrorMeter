# HitErrorMeter by KapiWilq

<a href="https://github.com/KapiWilq/HitErrorMeter/releases/latest/download/HitErrorMeter.by.KapiWilq.zip" target="_blank">
    <img height="35" src="https://img.shields.io/badge/Download_the_overlay-67A564?style=for-the-badge" />
</a>

|                 |                     |
| --------------- | ------------------- |
| For             | ingame, obs-overlay |
| Compatible with | tosu                |
| Size            | 720x100             |

> Supports all rulesets! | Very customizable! | The overlay resolution/size is for the default settings (both the overlay and the in-game score meter) in the osu!mania ruleset with EZDT at OD0.

# Gameplay preview

**Note**: The GIFs might make the overlay look pretty bad, I promise it looks better in person.

### osu! (OD10 in this example)

<img src=".github/images/osu_ruleset.png">  <img src=".github/gifs/osu_ruleset.gif">

### osu!mania (`inaccurate hit windows` setting enabled; OD8.2 in this example)

<img src=".github/images/mania_ruleset.png">  <img src=".github/gifs/mania_ruleset.gif">

### osu!mania (with disabled hit windows; OD8.2 in this example)

<img src=".github/images/mania_ruleset_no-hitwindows.png">  <img src=".github/gifs/mania_ruleset_no-hitwindows.gif">

### osu!taiko (OD7 in this example)

<img src=".github/images/taiko_ruleset.png">  <img src=".github/gifs/taiko_ruleset.gif">

### osu!catch (disabled by default; CS4.3 in this example)

<img src=".github/images/catch_ruleset.png">  <img src=".github/gifs/catch_ruleset.gif">

# How to install (recommended method)

1. Open `tosu` and go to the tosu dashboard.
2. Go to the overlays listing by clicking the `Available` tab near the top of the dashboard.
3. Search for the overlay and click `Download` button on the right of the overlay.
4. Add the overlay as a browser source (or in the in-game overlay) with the properties in the table near the top of this document.
5. (Optionally) Customize it to your liking, there's quite a few settings waiting for you!

## How to install (manual method; NOT RECOMMENDED UNLESS YOU WANT TO DEV/CONTRIBUTE SOMETHING)

1. Click the `Download the overlay` button at the top of this **document**.
2. Put the folder inside the zip archive into the `static` folder next to the `tosu` executable. If you don't know where that is, or if you want to go there quickly, go to the tosu dashboard and click the `open tosu folder` button in the top left.
3. Add the overlay as a browser source (or in the in-game overlay) with the properties in the table near the top of this document.
4. (Optionally) Customize it to your liking, there's quite a few settings waiting for you!

## Roadmap to v1.0 (DONE)
- [X] Add support for hiding the in-game score meter
- [X] Allow for slightly more customization of the Unstable Rate display
- [X] Add support for adjusting hit error tick appear and disappear duration
- [X] Add support for osu!mania converts
- [X] Update `index.js` to properly support tosu v4
- [X] Add support for changing the moving average arrow's color


## Scrapped ideas
- [ ] Add support for adjusting the moving average arrow animation duration - Requires more work to make the resizing animation fast while preserving the moving animation duration (both resizing and moving use the same CSS `transition` property)
- [ ] Add support for StreamCompanion - No reason for me to do this, unless there's enough demand

# Support

If you have any questions or problems with the overlay, ask either here on GitHub, or send me a DM on Discord as long as it's not something related to modifying the overlay files directly (e.g. feature requests are okay). I'm in the tosu support server, so you can find me more easily this way! (For validating | Username: `kapiwilq`; ID: `147791290908672000`)
