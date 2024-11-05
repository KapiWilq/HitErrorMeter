# HitErrorMeter by KapiWilq

<a href="https://github.com/KapiWilq/HitErrorMeter/releases/latest/download/HitErrorMeter.by.KapiWilq.zip" target="_blank"><img height="35" src="https://img.shields.io/badge/Download_the_overlay-67A564?style=for-the-badge" /></a>

|                 |                     |
| --------------- | ------------------- |
| For             | ingame, obs-overlay |
| Compatible with | tosu                |
| Size            | 500 x 100           |

> Supports all rulesets! (except mania converts, support for those is coming soon™) | The resolution above is for default settings at OD0 in the osu! ruleset.

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

### osu!catch (disabled by default; any CS)

<img src=".github/images/catch_ruleset.png">  <img src=".github/gifs/catch_ruleset.gif">

## How to install (manually)

0. Remember to have both your game and `tosu` open! I've seen some people wondering why their stuff is not working only to find out neither was open.
1. Click the `Download the overlay` button at the top of this **document**.
2. Put the folder inside the zip archive into the `static` folder next to the `tosu` executable.
3. Add the overlay as a browser source with the properties in the table below the download button.
4. (Optionally) Customize it to your liking, there's quite a few settings waiting for you!

## Settings

| Setting                                                                  | Type     | Default value                        | Customizability (if applicable)                                             |
| ------------------------------------------------------------------------ | -------- | ------------------------------------ | --------------------------------------------------------------------------- |
| Hit error meter scale                                                    | number   | 1                                    | A number from `0.5` to `5`                                                  |
| Unstable Rate display scale                                              | number   | 1                                    | A number from `0.5` to `5`                                                  |
| Automatically hide the in-game score meter                               | checkbox | Enabled                              |                                                                             |
| Show the hit error meter in osu!catch                                    | checkbox | Disabled                             |                                                                             |
| Show hit windows                                                         | checkbox | Enabled                              |                                                                             |
| Show the moving average arrow                                            | checkbox | Enabled                              |                                                                             |
| Unstable Rate display style                                              | options  | `Show both the prefix and the value` | `Show both the prefix and the value`, `Show only the value`, `Show nothing` |
| 320's hit window colo(u)r                                                | color    | #99ddff                              |                                                                             |
| 300's hit window colo(u)r                                                | color    | #47b6eb                              |                                                                             |
| 200's hit window colo(u)r                                                | color    | #99ffa0                              |                                                                             |
| 100's hit window colo(u)r                                                | color    | #47eb54                              |                                                                             |
| 50's hit window colo(u)r                                                 | color    | #ebc247                              |                                                                             |
| Height of the main tick (in pixels)                                      | number   | 24                                   | A number bigger or equal `6`                                                |
| Height of hit error ticks (in pixels)                                    | number   | 36                                   | A number bigger or equal `6`                                                |
| Width of hit error ticks (in pixels)                                     | number   | 4                                    | A number from `1` to `8`                                                    |
| Duration of the hit error tick appearance animation (in milliseconds)    | number   | 250                                  | A positive number smaller or equal 5000 (so 5 seconds)                      |
| Duration of the hit error tick disappearance animation (in milliseconds) | number   | 3000                                 | A positive number smaller or equal 10000 (so 10 seconds)                    |
| Width multiplier of hit windows                                          | number   | 1                                    | A number from `0.5` to `5`                                                  |

## Roadmap to v1.0
- [X] Add support for hiding the in-game score meter (using the [Files API](https://github.com/tosuapp/tosu/wiki#files-api) and the `settings.background.dim` property)
- [X] Allow for slightly more customization of the Unstable Rate display
- [X] Add support for adjusting hit error tick appear and disappear duration
- [ ] Add support for mania converts (current status: waiting for a new tosu release with a new `beatmap.isConvert` field, see [the conversation in the tosu support server](https://discord.com/channels/1056534107330445362/1185957776665628764/1302703274125824102))

# Roadmap to v1.1
- [ ] Update `index.js` to use the new tosu v4 API (notably the `play.mods.rate` field)
- [ ] Stretch: Add support for StreamCompanion (will think about this only after tosu v4 is released)

## Support

If you have any questions or problems with the overlay, ask either here on GitHub, or send me a DM on Discord as long as it's not something related to modifying the overlay files directly (e.g. feature requests are okay). I'm in the tosu support server, so you can find me more easily this way! (For validating | Username: `kapiwilq`; ID: `147791290908672000`)
