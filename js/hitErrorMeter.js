/**
 * A helper class for managing the hit error meter.
 */
class HitErrorMeter {
    constructor() {
        // Default settings.
        this.client = 'stable';
        this.rulesetName = 'osu';
        this.overallDiff = 0;
        this.circleSize = 0;
        this.mods = '';
        this.rate = 1;
        this.hitWindows = {
            hit320: 0,
            hit300: 80,
            hit200: 0,
            hit100: 140,
            hit50: 200
        };
        this.hemScale = 1;
        this.tickAppearanceDuration = 250;
        this.tickDisappearanceDuration = 3000;
        this.widthMultiplier = 1;
    };

    /**
   * A helper method to apply user's settings.
   * @param {{hemScale: number,
   *          urStyle: 'Show nothing' | 'Show only the value' | 'Show both the prefix and the value',
   *          urFontSize: number,
   *          urFontFamily: string,
   *          urFontColor: string,
   *          showMovingAverageArrow: boolean,
   *          movingAverageArrowSize: number,
   *          mainTickHeight: number,
   *          mainTickColor: string,
   *          showHitWindows: boolean,
   *          showHemInCatch: boolean,
   *          widthMultiplier: number,
   *          hit320Color: string,
   *          hit300Color: string,
   *          hit200Color: string,
   *          hit100Color: string,
   *          hit50Color: string,
   *          tickHeight: number,
   *          tickWidth: number,
   *          tickAppearanceDuration: number,
   *          tickDisappearanceDuration: number,
   *          hideInGameScoreMeter: boolean}} settings - User settings.
   */
    applyUserSettings(settings) {
        let hemHeight = 36, mainTickHeight = 24, tickHeight = 36, tickWidth = 4;

        mainTickHeight = Math.max(6, settings.mainTickHeight);
        tickHeight = Math.max(6, settings.tickHeight);
        tickWidth = this.clamp(settings.tickWidth, 1, 8);
        if (mainTickHeight > tickHeight) {
            hemHeight = mainTickHeight;
        } else {
            hemHeight = tickHeight;
        };

        this.hemScale = this.clamp(settings.hemScale, 0.5, 5);
        document.querySelector('.segments').style.transform = `scale(${this.hemScale})`;
        document.querySelector('.segments').style.height = `${hemHeight * this.hemScale / 16}rem`;

        if (settings.urFontSize >= 0) {
            document.querySelector('#unstableRate').style.transform = `scale(${Math.max(0, settings.urFontSize) / 24})`;
        };
        document.querySelector('#unstableRate').style.fontFamily = `"${settings.urFontFamily}", "Roboto", sans-serif`;
        document.querySelector('#unstableRate').style.color = settings.urFontColor;

        document.querySelector('.movingAverageArrow').style.opacity = Number(settings.showMovingAverageArrow);
        if (settings.showMovingAverageArrow) {
            if (settings.movingAverageArrowSize >= 0) {
                document.querySelector('.movingAverageArrow').style.height = `${settings.movingAverageArrowSize * this.hemScale / 16}rem`;
                document.querySelector('.movingAverageArrow').style.filter = `drop-shadow(0 0 ${2 * (settings.movingAverageArrowSize / 8) * this.hemScale / 16}rem black)`;
            };
        } else {
            document.querySelector('.movingAverageArrow').style.height = 0;
            document.querySelector('.movingAverageArrow').style.filter = 'drop-shadow(0 0 0 black)';
        };
        document.querySelector('.movingAverageArrow').style.marginBottom = `${4 * this.hemScale / 16}rem`;

        document.querySelector('.mainTick').style.height = `${mainTickHeight / 16}rem`;
        document.querySelector('.mainTick').style.backgroundColor = settings.mainTickColor;

        this.widthMultiplier = this.clamp(settings.widthMultiplier, 0.5, 5);

        this.applyColorToRootProperty('--hit320BG', settings.hit320Color, settings.showHitWindows);
        this.applyColorToRootProperty('--hit300BG', settings.hit300Color, settings.showHitWindows);
        this.applyColorToRootProperty('--hit200BG', settings.hit200Color, settings.showHitWindows);
        this.applyColorToRootProperty('--hit100BG', settings.hit100Color, settings.showHitWindows);
        this.applyColorToRootProperty('--hit50BG', settings.hit50Color, settings.showHitWindows);

        document.querySelector(':root').style.setProperty('--tickHeightRem', tickHeight / 16);
        document.querySelector(':root').style.setProperty('--tickWidthRem', tickWidth / 16);

        if (settings.tickAppearanceDuration >= 0) {
            this.tickAppearanceDuration = Math.min(settings.tickAppearanceDuration, 5000);
        };
        if (settings.tickDisappearanceDuration >= 0) {
            this.tickDisappearanceDuration = Math.min(settings.tickDisappearanceDuration, 10000);
        };

        this.prepareHitErrorMeter();
    };

    /**
   * Prepares the hit error meter: sets correct hit windows widths, and rounds corners at the edges.
   * @param {'stable' | 'lazer'} client - The currently played client.
   * @param {'osu' | 'taiko' | 'fruits' | 'mania' | 'maniaConvert'} rulesetName - The currently played ruleset.
   * @param {number} overallDiff - The Overall Difficulty value of the currently played map. NOTE: This is the original value (without any mods).
   * @param {number} circleSize - The Circle Size value of the currently played map. NOTE: This is the original value (without any mods).
   * @param {string} mods - The list of mods formatted as a not separate list of acronyms, e.g. `HDDT`.
   * @param {number} rate - The speed of the currently played beatmap.
   */
    prepareHitErrorMeter(client = this.client, rulesetName = this.rulesetName, overallDiff = this.overallDiff, circleSize = this.circleSize, mods = this.mods, rate = this.rate) {
        this.applyBaseSettings(client, rulesetName, overallDiff, circleSize, mods, rate);

        this.recalculateHitWindows();
        const WIDTH_CONSTANT = 1.125;

        let hit320Size = 0, hit300Size = 0, hit200Size = 0, hit100Size = 0, hit50Size = 0;

        switch (this.rulesetName) {
        case 'osu':
            hit300Size = Math.floor(this.hitWindows.hit300 * WIDTH_CONSTANT * this.widthMultiplier);
            hit100Size = Math.floor((this.hitWindows.hit100 - this.hitWindows.hit300) * WIDTH_CONSTANT * this.widthMultiplier);
            hit50Size = Math.floor((this.hitWindows.hit50 - this.hitWindows.hit100) * WIDTH_CONSTANT * this.widthMultiplier);
            break;
        case 'taiko':
            hit300Size = Math.floor(this.hitWindows.hit300 * WIDTH_CONSTANT * this.widthMultiplier);
            hit100Size = Math.floor((this.hitWindows.hit100 - this.hitWindows.hit300) * WIDTH_CONSTANT * this.widthMultiplier);
            break;
        case 'fruits':
            hit300Size = Math.floor(this.hitWindows.hit300 * WIDTH_CONSTANT * this.widthMultiplier);
            break;
        default:
            hit320Size = Math.floor(this.hitWindows.hit320 * WIDTH_CONSTANT * this.widthMultiplier);
            hit300Size = Math.floor((this.hitWindows.hit300 - this.hitWindows.hit320) * WIDTH_CONSTANT * this.widthMultiplier);
            hit200Size = Math.floor((this.hitWindows.hit200 - this.hitWindows.hit300) * WIDTH_CONSTANT * this.widthMultiplier);
            hit100Size = Math.floor((this.hitWindows.hit100 - this.hitWindows.hit200) * WIDTH_CONSTANT * this.widthMultiplier);
            hit50Size = Math.floor((this.hitWindows.hit50 - this.hitWindows.hit100) * WIDTH_CONSTANT * this.widthMultiplier);
            break;
        };

        document.querySelectorAll('.hit320').forEach(segment => {
            segment.style.width = `${hit320Size / 16}rem`;
        });
        document.querySelectorAll('.hit300').forEach(segment => {
            segment.style.width = `${hit300Size / 16}rem`;
        });
        document.querySelectorAll('.hit200').forEach(segment => {
            segment.style.width = `${hit200Size / 16}rem`;
        });
        document.querySelectorAll('.hit100').forEach(segment => {
            segment.style.width = `${hit100Size / 16}rem`;
        });
        document.querySelectorAll('.hit50').forEach(segment => {
            segment.style.width = `${hit50Size / 16}rem`;
        });

        // Applying CSS scaling only affects it visually - everything has the "1x scale" sizing under the hood.
        // Since the average chevron relies on the hit error meter's width, the not segments' width, resize the parent container.
        document.querySelector('.hitErrorMeterContainer').style.width = `${(hit320Size + hit300Size + hit200Size + hit100Size + hit50Size) * 2 * this.hemScale / 16}rem`;

        let edgeSegments = null;

        if (this.rulesetName === 'osu' || this.rulesetName === 'mania' || this.rulesetName === 'maniaConvert') {
            edgeSegments = document.querySelectorAll('.hit50');
            document.querySelectorAll('.hit100').forEach(segment => {return segment.style.borderRadius = '0';});
            document.querySelectorAll('.hit300').forEach(segment => {return segment.style.borderRadius = '0';});
        } else if (this.rulesetName === 'taiko') {
            edgeSegments = document.querySelectorAll('.hit100');
            document.querySelectorAll('.hit300').forEach(segment => {return segment.style.borderRadius = '0';});
            document.querySelectorAll('.hit50').forEach(segment => {return segment.style.borderRadius = '0';});
        } else {
            edgeSegments = document.querySelectorAll('.hit300');
            document.querySelectorAll('.hit100').forEach(segment => {return segment.style.borderRadius = '0';});
            document.querySelectorAll('.hit50').forEach(segment => {return segment.style.borderRadius = '0';});
        };

        let edgeSegmentsHeight = parseFloat(getComputedStyle(edgeSegments[0]).getPropertyValue('height').replace('px', '')) / 16;
        setTimeout(() => {
            edgeSegments.forEach(segment => {
                segment.style.borderRadius = `0 ${edgeSegmentsHeight / 2}rem ${edgeSegmentsHeight / 2}rem 0`;
            });
        }, 500);
    };

    /**
   * A helper method to apply base play settings for use by other methods.
   * @param {'stable' | 'lazer'} client - The client version that the game is currently being played.
   * @param {'osu' | 'taiko' | 'fruits' | 'mania' | 'maniaConvert'} rulesetName - The currently played ruleset.
   * @param {number} overallDiff - The Overall Difficulty value of the currently played map. NOTE: This is the original value (without any mods).
   * @param {number} circleSize - The Circle Size value of the currently played map. NOTE: This is the original value (without any mods).
   * @param {string} mods - The list of mods formatted as a not separate list of acronyms, e.g. `HDDT`.
   * @param {number} rate - The speed of the map that is being currently played.
   */
    applyBaseSettings(client, rulesetName, overallDiff, circleSize, mods, rate) {
        this.client = client;
        this.rulesetName = rulesetName;
        this.rate = rate;

        do {
            this.mods = mods;

            // This mess exists purely because osu!(mania) calculates hit windows differently.
            // See the mania section in the `recalculateHitWindows()` method.
            if (this.client === 'stable' && (this.rulesetName === 'mania' || this.rulesetName === 'maniaConvert')) {
                this.overallDiff = overallDiff;
                this.circleSize = circleSize;
            } else {
                if (this.mods.includes('EZ')) {
                    this.overallDiff = overallDiff / 2;
                    this.circleSize = circleSize / 2;
                } else if (this.mods.includes('HR')) {
                    this.overallDiff = Math.min(overallDiff * 1.4, 10);
                    this.circleSize = Math.min(circleSize * 1.3, 10);
                } else {
                    this.overallDiff = overallDiff;
                    this.circleSize = circleSize;
                };
            };
        } while (this.mods == undefined);
    };

    /**
   * A helper method to recalculate hit windows for given overall difficulty (except for osu!catch).
   */
    recalculateHitWindows() {
        switch (this.rulesetName) {
        case 'osu':
            this.hitWindows = {
                hit320: 0,
                hit300: Math.round(80 - 6 * this.overallDiff),
                hit200: 0,
                hit100: Math.round(140 - 8 * this.overallDiff),
                hit50: Math.round(200 - 10 * this.overallDiff)
            };
            break;

        case 'taiko':
            this.hitWindows = {
                hit320: 0,
                hit300: Math.round(50 - 3 * this.overallDiff),
                hit200: 0,
                hit100: Math.round(this.overallDiff <= 5 ? 120 - 8 * this.overallDiff : 110 - 6 * this.overallDiff),
                hit50: 0
            };
            break;

        // osu!catch shows where the fruit landed relative to the catcher's center.
        case 'fruits':
            this.hitWindows = {
                hit320: 0,
                hit300: Math.round(72 - 6 * this.circleSize),
                hit200: 0,
                hit100: 0,
                hit50: 0
            };
            break;

        case 'mania':
            // Hit windows in osu!(lazer) are not affected by the rate anymore.
            // Also, 320's hit windows now scale in osu!(lazer) (and in osu!(stable) with ScoreV2).
            // See https://osu.ppy.sh/wiki/en/Client/Release_stream/Lazer/Gameplay_differences_in_osu%21%28lazer%29#the-perfect-judgement-hit-window-scales-with-od
            //     https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Scoring/HitWindows.cs#L20
            //     https://osu.ppy.sh/wiki/en/Gameplay/Judgement/osu%21mania#scorev2
            if (this.client === 'lazer') {
                this.hitWindows = {
                    hit320: (this.overallDiff <= 5 ? 22.4 - 0.6 * this.overallDiff : 24.9 - 1.1 * this.overallDiff),
                    hit300: (64 - 3 * this.overallDiff),
                    hit200: (97 - 3 * this.overallDiff),
                    hit100: (127 - 3 * this.overallDiff),
                    hit50: (151 - 3 * this.overallDiff)
                };
            } else if (this.client === 'stable' && this.mods.includes('v2')) {
                this.hitWindows = {
                    hit320: (this.overallDiff <= 5 ? 22.4 - 0.6 * this.overallDiff : 24.9 - 1.1 * this.overallDiff) * this.rate,
                    hit300: (64 - 3 * this.overallDiff) * this.rate,
                    hit200: (97 - 3 * this.overallDiff) * this.rate,
                    hit100: (127 - 3 * this.overallDiff) * this.rate,
                    hit50: (151 - 3 * this.overallDiff) * this.rate
                };
            } else {
                this.hitWindows = {
                    hit320: 16 * this.rate,
                    hit300: (64 - 3 * this.overallDiff) * this.rate,
                    hit200: (97 - 3 * this.overallDiff) * this.rate,
                    hit100: (127 - 3 * this.overallDiff) * this.rate,
                    hit50: (151 - 3 * this.overallDiff) * this.rate
                };
            };

            // I've Been Tricked, I've Been Backstabbed and I've Been, Quite Possibly, Bamboozled.
            // For some reason, osu!mania not only uses the original OD value when playing with EZ or HR,
            // it also scales every hit window by a factor of 1.4 one way or the other, depending on the mod selected.

            // See it for yourself by selecting a mania map and switch between EZ, HR, and NoMod and compare the hit windows' sizes by hovering on the map stats.
            // This is the only reason why the hit windows are being rounded here and not in the actual calculation.
            if (this.client === 'stable') {
                for (let hitWindow in this.hitWindows) {
                    if (this.mods.includes('HR')) {
                        this.hitWindows[hitWindow] = Math.floor(this.hitWindows[hitWindow] / 1.4);
                    } else if (this.mods.includes('EZ')) {
                        this.hitWindows[hitWindow] = Math.floor(this.hitWindows[hitWindow] * 1.4);
                    } else {
                        this.hitWindows[hitWindow] = Math.floor(this.hitWindows[hitWindow]);
                    };
                };
            };
            break;

        // Mania converts have different hit windows only in osu!(stable).
        // See https://osu.ppy.sh/wiki/en/Gameplay/Judgement/osu%21mania#judgements.
        case 'maniaConvert':
            this.hitWindows = {
                hit320: Math.round(16 * this.rate),
                hit300: Math.round((this.overallDiff > 4 ? 34 : 47) * this.rate),
                hit200: Math.round((this.overallDiff > 4 ? 67 : 77) * this.rate),
                hit100: Math.round(97 * this.rate),
                hit50: Math.round(121 * this.rate)
            };

            // I've Been Tricked, I've Been Backstabbed and I've Been, Quite Possibly, Bamboozled.
            // For some reason, osu!mania not only uses the original OD value when playing with EZ or HR,
            // it also scales every hit window by a factor of 1.4 one way or the other, depending on the mod selected.

            // See it for yourself by selecting a mania map and switch between EZ, HR, and NoMod and compare the hit windows' sizes by hovering on the map stats.
            // This is the only reason why the hit windows are being rounded here and not in the actual calculation.
            for (let hitWindow in this.hitWindows) {
                if (this.mods.includes('HR')) {
                    this.hitWindows[hitWindow] = Math.floor(this.hitWindows[hitWindow] / 1.4);
                } else if (this.mods.includes('EZ')) {
                    this.hitWindows[hitWindow] = Math.floor(this.hitWindows[hitWindow] * 1.4);
                } else {
                    this.hitWindows[hitWindow] = Math.floor(this.hitWindows[hitWindow]);
                };
            };
            break;

        default:
            console.error(`Couldn't calculate hit windows.\nClient: ${this.client}\nRuleset ID: ${this.rulesetName}\nOverall Difficulty: ${this.overallDiff}\nCircle Size: ${this.circleSize}\nHit windows: ${JSON.stringify(this.hitWindows)}`);
            break;
        };
    };

    /**
   * A helper method to set a property value in the root pseudo-class.
   * @param {string} property - A property to be changed.
   * @param {string} color - A color that should be set for this property.
   * @param {boolean} shouldBeVisible - Whether the color should be opaque or transparent.
   */
    applyColorToRootProperty(property, color, shouldBeVisible) {
        if (color === 9) {
            color = color.slice(0, -2);
        };

        if (shouldBeVisible) {
            color += 'FF';
        } else {
            // Dirty hack to make the computed style not return transparent black for hit error ticks.
            color += '01';
        };

        document.querySelector(':root').style.setProperty(property, color);
    };

    /**
   * A helper method to get a value with lower and upper bounds.
   * @param {number} val - The value to be clamped.
   * @param {number} min - The lower bound. If the value is below it, this will return `min`.
   * @param {number} max - The upper bound. If the value is above it, this will return `max`.
   * @returns {number} A number between `min` and `max` inclusive.
   */
    clamp(val, min, max) {
        return Math.min(Math.max(min, val), max);
    };

    /**
   * A helper method to determine where should a hit error tick be placed.
   * @param {number} absHitError - The absolute value of the given hit error.
   * @param {string} whichSegment - Whether the hit error tick should be placed either in the `early` or `late` half of the hit error meter.
   * @returns {HTMLElement} HTML element that will store the hit error tick inside of it.
   */
    getHitWindowSegment(absHitError, whichSegment) {
        this.recalculateHitWindows();

        // osu!(lazer) does these comparisons differently than stable.
        // See https://osu.ppy.sh/wiki/en/Client/Release_stream/Lazer/Gameplay_differences_in_osu%21%28lazer%29#hit-window-edge-calculations-do-not-match-stable
        if (this.client === 'stable') {
            switch (this.rulesetName) {
            case 'osu':
                if (absHitError < this.hitWindows.hit300) {
                    return document.getElementById(`hit300${whichSegment}`);
                };
                if (absHitError < this.hitWindows.hit100) {
                    return document.getElementById(`hit100${whichSegment}`);
                };
                return document.getElementById(`hit50${whichSegment}`);
        
            case 'taiko':
                if (absHitError < this.hitWindows.hit300) {
                    return document.getElementById(`hit300${whichSegment}`);
                };
                return document.getElementById(`hit100${whichSegment}`);
        
            case 'fruits':
                return document.getElementById(`hit300${whichSegment}`);
        
            case 'mania':
            case 'maniaConvert':
                if (absHitError <= this.hitWindows.hit320) {
                    return document.getElementById(`hit320${whichSegment}`);
                };
                if (absHitError <= this.hitWindows.hit300) {
                    return document.getElementById(`hit300${whichSegment}`);
                };
                if (absHitError <= this.hitWindows.hit200) {
                    return document.getElementById(`hit200${whichSegment}`);
                };
                if (absHitError <= this.hitWindows.hit100) {
                    return document.getElementById(`hit100${whichSegment}`);
                };
                return document.getElementById(`hit50${whichSegment}`);
        
            default:
                console.error(`Couldn't determine the hit window segment.\nClient: ${this.client}\nRuleset ID: ${this.rulesetName}\nAbsolute hit error: ${absHitError}\nOverall Difficulty: ${this.overallDiff}\nCircle Size: ${this.circleSize}\nHit windows: ${JSON.stringify(this.hitWindows)}`);
                break;
            };
        } else {
            switch (this.rulesetName) {
            case 'osu':
                if (absHitError <= this.hitWindows.hit300) {
                    return document.getElementById(`hit300${whichSegment}`);
                };
                if (absHitError <= this.hitWindows.hit100) {
                    return document.getElementById(`hit100${whichSegment}`);
                };
                return document.getElementById(`hit50${whichSegment}`);
        
            case 'taiko':
                if (absHitError <= this.hitWindows.hit300) {
                    return document.getElementById(`hit300${whichSegment}`);
                };
                return document.getElementById(`hit100${whichSegment}`);
        
            case 'fruits':
                return document.getElementById(`hit300${whichSegment}`);
        
            case 'mania':
            case 'maniaConvert':
                if (absHitError <= this.hitWindows.hit320) {
                    return document.getElementById(`hit320${whichSegment}`);
                };
                if (absHitError <= this.hitWindows.hit300) {
                    return document.getElementById(`hit300${whichSegment}`);
                };
                if (absHitError <= this.hitWindows.hit200) {
                    return document.getElementById(`hit200${whichSegment}`);
                };
                if (absHitError <= this.hitWindows.hit100) {
                    return document.getElementById(`hit100${whichSegment}`);
                };
                return document.getElementById(`hit50${whichSegment}`);
        
            default:
                console.error(`Couldn't determine the hit window segment.\nClient: ${this.client}\nRuleset ID: ${this.rulesetName}\nAbsolute hit error: ${absHitError}\nOverall Difficulty: ${this.overallDiff}\nCircle Size: ${this.circleSize}\nHit windows: ${JSON.stringify(this.hitWindows)}`);
                break;
            };
        }
    };

    /**
   * A helper method to get a relative position of the hit error tick inside a hit error window.
   * @param {number} absHitError - The absolute value of the given hit error.
   * @returns {number} Relative position of the hit error tick.
   */
    getTickPositionPercentage(absHitError) {
        this.recalculateHitWindows();

        if (this.client === 'stable') {
            switch (this.rulesetName) {
            case 'osu':
                if (absHitError < this.hitWindows.hit300) {
                    return absHitError / this.hitWindows.hit300;
                };
                if (absHitError < this.hitWindows.hit100) {
                    return (absHitError - this.hitWindows.hit300) / (this.hitWindows.hit100 - this.hitWindows.hit300);
                };
                return (absHitError - this.hitWindows.hit100) / (this.hitWindows.hit50 - this.hitWindows.hit100);
        
            case 'taiko':
                if (absHitError < this.hitWindows.hit300) {
                    return absHitError / this.hitWindows.hit300;
                };
                return (absHitError - this.hitWindows.hit300) / (this.hitWindows.hit100 - this.hitWindows.hit300);
        
            case 'fruits':
                return absHitError / this.hitWindows.hit300;
        
            case 'mania':
            case 'maniaConvert':
                if (absHitError <= this.hitWindows.hit320) {
                    return absHitError / this.hitWindows.hit320;
                };
                if (absHitError <= this.hitWindows.hit300) {
                    return (absHitError - this.hitWindows.hit320) / (this.hitWindows.hit300 - this.hitWindows.hit320);
                };
                if (absHitError <= this.hitWindows.hit200) {
                    return (absHitError - this.hitWindows.hit300) / (this.hitWindows.hit200 - this.hitWindows.hit300);
                };
                if (absHitError <= this.hitWindows.hit100) {
                    return (absHitError - this.hitWindows.hit200) / (this.hitWindows.hit100 - this.hitWindows.hit200);
                };
                return (absHitError - this.hitWindows.hit100) / (this.hitWindows.hit50 - this.hitWindows.hit100);
        
            default:
                console.error(`Couldn't determine the tick's position percentage.\nClient: ${this.client}\nRuleset ID: ${this.rulesetName}\nAbsolute hit error: ${absHitError}\nOverall Difficulty: ${this.overallDiff}\nCircle Size: ${this.circleSize}\nHit windows: ${JSON.stringify(this.hitWindows)}`);
                break;
            };
        } else {
            switch (this.rulesetName) {
            case 'osu':
                if (absHitError <= this.hitWindows.hit300) {
                    return absHitError / this.hitWindows.hit300;
                };
                if (absHitError <= this.hitWindows.hit100) {
                    return (absHitError - this.hitWindows.hit300) / (this.hitWindows.hit100 - this.hitWindows.hit300);
                };
                return (absHitError - this.hitWindows.hit100) / (this.hitWindows.hit50 - this.hitWindows.hit100);
        
            case 'taiko':
                if (absHitError <= this.hitWindows.hit300) {
                    return absHitError / this.hitWindows.hit300;
                };
                return (absHitError - this.hitWindows.hit300) / (this.hitWindows.hit100 - this.hitWindows.hit300);
        
            case 'fruits':
                return absHitError / this.hitWindows.hit300;
        
            case 'mania':
            case 'maniaConvert':
                if (absHitError <= this.hitWindows.hit320) {
                    return absHitError / this.hitWindows.hit320;
                };
                if (absHitError <= this.hitWindows.hit300) {
                    return (absHitError - this.hitWindows.hit320) / (this.hitWindows.hit300 - this.hitWindows.hit320);
                };
                if (absHitError <= this.hitWindows.hit200) {
                    return (absHitError - this.hitWindows.hit300) / (this.hitWindows.hit200 - this.hitWindows.hit300);
                };
                if (absHitError <= this.hitWindows.hit100) {
                    return (absHitError - this.hitWindows.hit200) / (this.hitWindows.hit100 - this.hitWindows.hit200);
                };
                return (absHitError - this.hitWindows.hit100) / (this.hitWindows.hit50 - this.hitWindows.hit100);
        
            default:
                console.error(`Couldn't determine the tick's position percentage.\nClient: ${this.client}\nRuleset ID: ${this.rulesetName}\nAbsolute hit error: ${absHitError}\nOverall Difficulty: ${this.overallDiff}\nCircle Size: ${this.circleSize}\nHit windows: ${JSON.stringify(this.hitWindows)}`);
                break;
            };
        }
    };

    /**
   * A method to add the hit error tick in the hit error meter.
   * @param {number} hitError - The hit error value.
   */
    addTick(hitError) {
        let segmentForTheTick;
        // This is needed so that the expansion animation plays correctly, otherwise it just doesn't apply the transition.
        const ANIMATION_DELAY = 17;

        // osu!catch stores fruits landing on the right side of the catcher as ""early hits"" - flip the hit error to correct it.
        if (this.rulesetName === 'fruits') {
            hitError = -hitError;
        };
        if (hitError <= 0) {
            segmentForTheTick = this.getHitWindowSegment(-hitError, 'Early');
        } else {
            segmentForTheTick = this.getHitWindowSegment(hitError, 'Late');
        };

        let tickPositionPercentage = this.getTickPositionPercentage(Math.abs(hitError));

        let tick = document.createElement('div');
        tick.classList.add('tick');

        // We don't know if hit error segments are hidden - extract RGB(A) values and set the opacity manually.
        // RegExp source: https://regex101.com/library/dVOwn0
        const RGBA_REGEXP = /rgba?\((?<r>[.\d]+)[, ]+(?<g>[.\d]+)[, ]+(?<b>[.\d]+)(?:\s?[,\/]\s?(?<a>[.\d]+%?))?\)/;
        let tickColor = getComputedStyle(segmentForTheTick).getPropertyValue('background-color').match(RGBA_REGEXP).groups;
        tick.style.backgroundColor = `rgba(${tickColor.r}, ${tickColor.g}, ${tickColor.b}, 1)`;
        tick.style.left = `${tickPositionPercentage * 100}%`;

        tick.style.transition = `cubic-bezier(0, 1, 0.33, 1) ${this.tickAppearanceDuration}ms`;

        segmentForTheTick.appendChild(tick);

        setTimeout(() => {
            tick.style.height = 'calc(var(--tickHeightRem) * 1rem)';
        }, ANIMATION_DELAY);

        setTimeout(() => {
            tick.style.transition = `linear ${this.tickDisappearanceDuration}ms`;
            tick.style.opacity = 0;

            setTimeout(() => {
                tick.remove();
            }, this.tickDisappearanceDuration);

        }, this.tickAppearanceDuration + ANIMATION_DELAY);
    };

    /**
   * A helper method to get the hit error's relative position. Used for the moving average arrow.
   * NOTE: This is a slight modification of the osu!(lazer)'s implementation of this functionality.
   * @param {number} value - The hit error value.
   * @returns {number} The position for the moving average arrow.
   * @see {@link https://github.com/ppy/osu/blob/master/osu.Game/Screens/Play/HUD/HitErrorMeters/BarHitErrorMeter.cs#L430-L435}
   */
    getRelativeHitErrorPosition(value) {
        return this.clamp((value / this.getMaxHitWindow()) / 2, -1, 1);
    };

    /**
   * A helper method to get the max hit window for given gamemode. NOTE: This uses the ruleset ID stored inside the class.
   * @returns {number} Max hit window for given ruleset.
   */
    getMaxHitWindow() {
        this.recalculateHitWindows();

        switch (this.rulesetName) {
        case 'osu':
        case 'mania':
        case 'maniaConvert': {
            return this.hitWindows.hit50;
        };

        case 'taiko': {
            return this.hitWindows.hit100;
        };

        case 'fruits': {
            return this.hitWindows.hit300;
        };

        default:
            console.error(`Couldn't get the max hit window.\nClient: ${this.client}\nRuleset ID: ${this.rulesetName}\nOverall Difficulty: ${this.overallDiff}\nCircle Size: ${this.circleSize}\nHit windows: ${this.hitWindows}`);
            break;
        };
    };
};

export default HitErrorMeter;