# HitErrorMeter by KapiWilq

<a href="https://github.com/KapiWilq/HitErrorMeter/releases/latest/download/HitErrorMeter.by.KapiWilq.zip" target="_blank">
    <img height="35" src="https://img.shields.io/badge/Download_the_overlay-67A564?style=for-the-badge" />
</a>

|                 |                     |
| --------------- | ------------------- |
| For             | ingame, obs-overlay |
| Compatible with | tosu                |
| Size            | 720 x 100           |

> Supports all rulesets! | The overlay resolution/size is for the default settings (both the overlay and the in-game score meter) in the osu!mania ruleset with EZDT at OD0.

## Gameplay preview

**Note**: The GIFs might make the overlay look pretty bad, I promise it looks better in person.

### osu! (OD10 in this example)

<img src=".github/images/osu_ruleset.png">  <img src=".github/gifs/osu_ruleset.gif">

### osu!mania (OD8.2 in this example)

<img src=".github/images/mania_ruleset.png">  <img src=".github/gifs/mania_ruleset.gif">

### osu!mania (with disabled hit windows; OD8.2 in this example)

<img src=".github/images/mania_ruleset_no-hitwindows.png">  <img src=".github/gifs/mania_ruleset_no-hitwindows.gif">

### osu!taiko (OD7 in this example)

<img src=".github/images/taiko_ruleset.png">  <img src=".github/gifs/taiko_ruleset.gif">

### osu!catch (disabled by default; CS4.3 in this example)

<img src=".github/images/catch_ruleset.png">  <img src=".github/gifs/catch_ruleset.gif">

## How to install (manually)

0. Remember to have both your game and `tosu` open! I've seen some people wondering why their stuff is not working only to find out neither was open.
1. Click the `Download the overlay` button at the top of this **document**.
2. Put the folder inside the zip archive into the `static` folder next to the `tosu` executable. If you don't know where that is, or if you want to go there quickly, go to the tosu dashboard and click the `open tosu folder` button in the top left.
3. Add the overlay as a browser source (or in the in-game overlay) with the properties in the table near the top of this document.
4. (Optionally) Customize it to your liking, there's quite a few settings waiting for you!

## Settings

| Setting                                                             | Type     | Default value                        | Customizability                                                                                     |
| ------------------------------------------------------------------- | -------- | ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Hit error meter scale                                               | Number   | `1`                                  | A number between `0.5` and `5`                                                                      |
| Automatically scale the overlay with resolution (osu!(stable) only) | Checkbox | `Enabled`                            | `Enabled` or `Disabled`                                                                             |
| Unstable Rate display style                                         | Options  | `Show both the prefix and the value` | `Show nothing`, `Show only the value`, `Show both the prefix and the value`                         |
| Unstable Rate display font size (in pixels)                         | Number   | `24`                                 | A positive number                                                                                   |
| Unstable Rate display font name                                     | Textbox  | `Roboto`                             | The font must be installed on your system (except for `Roboto` as it's the default for the overlay) |
| Unstable Rate display text color                                    | Color    | `#ffffff`                            | Any RGB color in the full opacity                                                                   |
| Show the moving average arrow                                       | Checkbox | `true`                               | `Enabled` or `Disabled`                                                                             |
| Moving average arrow size (in pixels)                               | Number   | `8`                                  | A positive number                                                                                   |
| Main tick height (in pixels)                                        | Number   | `24`                                 | A number bigger or equal `6`                                                                        |
| Main tick color                                                     | Color    | `#ffffff`                            | Any RGB color in the full opacity                                                                   |
| Show hit windows                                                    | Checkbox | `true`                               | `Enabled` or `Disabled`                                                                             |
| Show the hit error meter in osu!catch                               | Checkbox | `false`                              | `Enabled` or `Disabled`                                                                             |
| Hit windows width multiplier                                        | Number   | `1`                                  | A number between `0.5` and `5`                                                                      |
| 320's hit window color                                              | Color    | `#99ddff`                            | Any RGB color in the full opacity                                                                   |
| 300's hit window color                                              | Color    | `#47b6eb`                            | Any RGB color in the full opacity                                                                   |
| 200's hit window color                                              | Color    | `#99ffa0`                            | Any RGB color in the full opacity                                                                   |
| 100's hit window color                                              | Color    | `#47eb54`                            | Any RGB color in the full opacity                                                                   |
| 50's hit window color                                               | Color    | `#ebc247`                            | Any RGB color in the full opacity                                                                   |
| Hit error ticks height (in pixels)                                  | Number   | `36`                                 | A number bigger or equal `6`                                                                        |
| Hit error ticks width (in pixels)                                   | Number   | `4`                                  | A number between `1` and `8`                                                                        |
| Hit error ticks appearance style                                    | Options  | `Expand from the center`             | `Expand from the center`, `Fade in fully expanded`                                                  |
| Hit error ticks appearance animation duration (in milliseconds)     | Number   | `250`                                | A positive number smaller or equal `5000` (5 seconds)                                               |
| Hit error ticks disappearance animation duration (in milliseconds)  | Number   | `3000`                               | A positive number smaller or equal `10000` (10 seconds)                                             |
| Hide the in-game score meter (osu!(stable) only)                    | Checkbox | `true`                               | `Enabled` or `Disabled`                                                                             |

## Roadmap to v1.0
- [X] Add support for hiding the in-game score meter
- [X] Allow for slightly more customization of the Unstable Rate display
- [X] Add support for adjusting hit error tick appear and disappear duration
- [X] Add support for osu!mania converts
- [X] Update `index.js` to properly support tosu v4
- [X] Test the overlay thoroughly
- [ ] ~~Add support for adjusting the moving average arrow animation duration~~ Scrapped, requires more work to make the resizing animation fast while preserving the moving animation duration (both resizing and moving use the same CSS `transition` property)

## Roadmap to v1.1
- [ ] ~~Add support for StreamCompanion~~ Probably not going to do this

## Support

If you have any questions or problems with the overlay, ask either here on GitHub, or send me a DM on Discord as long as it's not something related to modifying the overlay files directly (e.g. feature requests are okay). I'm in the tosu support server, so you can find me more easily this way! (For validating | Username: `kapiwilq`; ID: `147791290908672000`)
