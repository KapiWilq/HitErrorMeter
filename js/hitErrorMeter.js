/**
 * A helper class for managing the hit error meter.
 */
class HitErrorMeter {
  constructor() {
    // Default settings.
    this.rulesetID = 0;
    this.overallDiff = 0;
    this.mods = '';
    this.hitWindows = {
      hit320: 0,
      hit300: 80,
      hit200: 0,
      hit100: 140,
      hit50: 200
    };
    this.hemScale = 1;
    this.tickAppearanceDuration = 500;
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
    let hemElement = document.querySelector('.hitErrorMeterContainer');
    let unstableRate = document.querySelector('#unstableRate');
    let rootStyles = document.querySelector(':root');

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
    hemElement.querySelector('.segments').style.transform = `scale(${this.hemScale})`;
    hemElement.querySelector('.segments').style.height = `${hemHeight * this.hemScale / 16}rem`;

    unstableRate.style.transform = `scale(${Math.max(0, settings.urFontSize) / 24})`;
    if (settings.urFontFamily === 'Roboto') {
      unstableRate.style.fontFamily = '"Roboto", sans-serif';
    } else {
      unstableRate.style.fontFamily = `"${settings.urFontFamily}", "Roboto", sans-serif`;
    };
    unstableRate.style.color = settings.urFontColor;
    
    hemElement.querySelector('.movingAverageArrow').style.height = `${settings.movingAverageArrowSize * this.hemScale / 16}rem`;
    hemElement.querySelector('.movingAverageArrow').style.marginBottom = `${4 * this.hemScale / 16}rem`;
    hemElement.querySelector('.movingAverageArrow').style.filter = `drop-shadow(0 0 ${2 * (settings.movingAverageArrowSize / 8) * this.hemScale / 16}rem black)`;

    hemElement.querySelector('.mainTick').style.height = `${mainTickHeight / 16}rem`;
    hemElement.querySelector('.mainTick').style.color = settings.mainTickColor;

    rootStyles.style.setProperty('--tickHeightRem', tickHeight / 16);
    rootStyles.style.setProperty('--tickWidthRem', tickWidth / 16);

    hemElement.querySelector('.movingAverageArrow').style.opacity = Number(settings.showMovingAverageArrow);

    this.applyColorToRootProperty('--hit320BG', settings.hit320Color, settings.showHitWindows);
    this.applyColorToRootProperty('--hit300BG', settings.hit300Color, settings.showHitWindows);
    this.applyColorToRootProperty('--hit200BG', settings.hit200Color, settings.showHitWindows);
    this.applyColorToRootProperty('--hit100BG', settings.hit100Color, settings.showHitWindows);
    this.applyColorToRootProperty('--hit50BG', settings.hit50Color, settings.showHitWindows);

    this.widthMultiplier = this.clamp(settings.widthMultiplier, 0.5, 5);

    this.tickAppearanceDuration = this.clamp(settings.tickAppearanceDuration, 0, 5000)
    this.tickDisappearanceDuration = this.clamp(settings.tickDisappearanceDuration, 0, 10000);

    this.prepareHitErrorMeter();
  };

  /**
   * Prepares hit error meter: sets appropriate hit windows widths, and rounds corners at the edge.
   * @param {0 | 1 | 2 | 3 | 4} rulesetID - The ID of the currently played ruleset. NOTE: The ruleset ID of `4` is the equivalent of playing an osu! map converted to osu!mania (aka mania convert).
   * @param {number} overallDiff - The Overall Difficulty value of the currently played map. NOTE: This is the original value (without any mods).
   * @param {string} mods - The list of mods formatted as a not separate list of acronyms, e.g. `HDDT`.
   */
  prepareHitErrorMeter(rulesetID = this.rulesetID, overallDiff = this.overallDiff, mods = this.mods) {
    this.applyBaseSettings(rulesetID, overallDiff, mods);

    this.recalculateHitWindows();
    const WIDTH_CONSTANT = 1.125;

    let hit320Size = 0, hit300Size = 0, hit200Size = 0, hit100Size = 0, hit50Size = 0;

    switch (this.rulesetID) {
      case 0:
        hit300Size = Math.floor(this.hitWindows.hit300 * WIDTH_CONSTANT * this.widthMultiplier);
        hit100Size = Math.floor((this.hitWindows.hit100 - this.hitWindows.hit300) * WIDTH_CONSTANT * this.widthMultiplier);
        hit50Size = Math.floor((this.hitWindows.hit50 - this.hitWindows.hit100) * WIDTH_CONSTANT * this.widthMultiplier);
        break;
      case 1:
        hit300Size = Math.floor(this.hitWindows.hit300 * WIDTH_CONSTANT * this.widthMultiplier);
        hit100Size = Math.floor((this.hitWindows.hit100 - this.hitWindows.hit300) * WIDTH_CONSTANT * this.widthMultiplier);
        break;
      case 2:
        hit300Size = Math.floor(this.hitWindows.hit300 * WIDTH_CONSTANT * this.widthMultiplier);
        break;
      default:
        hit320Size = Math.floor(this.hitWindows.hit320 * WIDTH_CONSTANT * this.widthMultiplier);
        hit300Size = Math.floor((this.hitWindows.hit300 - this.hitWindows.hit320) * WIDTH_CONSTANT * this.widthMultiplier);
        hit200Size = Math.floor((this.hitWindows.hit200 - this.hitWindows.hit300) * WIDTH_CONSTANT * this.widthMultiplier);
        hit100Size = Math.floor((this.hitWindows.hit100 - this.hitWindows.hit200) * WIDTH_CONSTANT * this.widthMultiplier);
        hit50Size  = Math.floor((this.hitWindows.hit50 - this.hitWindows.hit100) * WIDTH_CONSTANT * this.widthMultiplier);
        break;
    };

    document.querySelectorAll('.hit320').forEach(segment => segment.style.width = `${hit320Size / 16}rem`);
    document.querySelectorAll('.hit300').forEach(segment => segment.style.width = `${hit300Size / 16}rem`);
    document.querySelectorAll('.hit200').forEach(segment => segment.style.width = `${hit200Size / 16}rem`);
    document.querySelectorAll('.hit100').forEach(segment => segment.style.width = `${hit100Size / 16}rem`);
    document.querySelectorAll('.hit50').forEach(segment => segment.style.width = `${hit50Size / 16}rem`);

    // Applying CSS scaling only affects it visually - everything has the "1x scale" sizing under the hood.
    // Since the average chevron relies on the hit error meter's width, not segments' width, resize the parent container.
    document.querySelector('.hitErrorMeterContainer').style.width = `${(hit320Size + hit300Size + hit200Size + hit100Size + hit50Size) * 2 * this.hemScale / 16}rem`;

    let edgeSegments = null;

    if (this.rulesetID === 0 || this.rulesetID === 3 || this.rulesetID === 4) {
      edgeSegments = document.querySelectorAll('.hit50');
      document.querySelectorAll('.hit100').forEach(segment => segment.style.borderRadius = '0');
      document.querySelectorAll('.hit300').forEach(segment => segment.style.borderRadius = '0');
    } else if (this.rulesetID === 1) {
      edgeSegments = document.querySelectorAll('.hit100');
      document.querySelectorAll('.hit300').forEach(segment => segment.style.borderRadius = '0');
      document.querySelectorAll('.hit50').forEach(segment => segment.style.borderRadius = '0');
    } else {
      edgeSegments = document.querySelectorAll('.hit300');
      document.querySelectorAll('.hit100').forEach(segment => segment.style.borderRadius = '0');
      document.querySelectorAll('.hit50').forEach(segment => segment.style.borderRadius = '0');
    };

    let edgeSegmentsHeight = parseFloat(getComputedStyle(edgeSegments[0]).getPropertyValue('height').replace('px', '')) / 16;
    setTimeout(() => edgeSegments.forEach(segment => segment.style.borderRadius = `0 ${edgeSegmentsHeight / 2}rem ${edgeSegmentsHeight / 2}rem 0`), 500);
  };

  /**
   * A helper method to apply base play settings for use by other methods.
   * @param {0 | 1 | 2 | 3 | 4} rulesetID - The ID of the currently played ruleset. NOTE: The ruleset ID of `4` is the equivalent of playing an osu! map converted to osu!mania (aka mania convert).
   * @param {number} overallDiff - The Overall Difficulty value of the currently played map. NOTE: This is the original value (without any mods).
   * @param {string} mods - The list of mods formatted as a not separate list of acronyms, e.g. `HDDT`.
   */
  applyBaseSettings(rulesetID, overallDiff, mods) {
    this.rulesetID = rulesetID;

    do {
      this.mods = mods;
      if (mods.includes('EZ')) {
        this.overallDiff = overallDiff / 2;
      } else if (mods.includes('HR')) {
        this.overallDiff = Math.min(overallDiff * 1.4, 10);
      } else {
        this.overallDiff = overallDiff;
      };
    } while (this.mods == undefined);
  };

  /**
   * A helper method to recalculate hit windows for given overall difficulty.
   */
  recalculateHitWindows() {
    switch (this.rulesetID) {
      case 0:
        this.hitWindows = {
          hit320: 0,
          hit300: Math.round(80 - 6 * this.overallDiff),
          hit200: 0,
          hit100: Math.round(140 - 8 * this.overallDiff),
          hit50: Math.round(200 - 10 * this.overallDiff)
        };
        break;

      case 1:
        this.hitWindows = {
          hit320: 0,
          hit300: Math.round(50 - 3 * this.overallDiff),
          hit200: 0,
          hit100: Math.round(this.overallDiff <= 5 ? 120 - 8 * this.overallDiff : 110 - 6 * this.overallDiff),
          hit50: 0
        };
        break;

      // osu!catch shows where the fruit landed relative to the catcher's center.
      case 2:
        this.hitWindows = {
          hit320: 0,
          hit300: 72,
          hit200: 0,
          hit100: 0,
          hit50: 0
        };
        break;

      case 3:
        this.hitWindows = {
          hit320: 16 * this.getRateChange(),
          hit300: Math.round((64 - 3 * this.overallDiff) * this.getRateChange()),
          hit200: Math.round((97 - 3 * this.overallDiff) * this.getRateChange()),
          hit100: Math.round((127 - 3 * this.overallDiff) * this.getRateChange()),
          hit50: Math.round((151 - 3 * this.overallDiff) * this.getRateChange())
        };
        break;

      // Mania converts have different hit windows.
      // See https://osu.ppy.sh/wiki/en/Gameplay/Judgement/osu%21mania#judgements.
      case 4:
        this.hitWindows = {
          hit320: 16 * this.getRateChange(),
          hit300: Math.round((this.overallDiff > 4 ? 34 : 47) * this.getRateChange()),
          hit200: Math.round((this.overallDiff > 4 ? 67 : 77) * this.getRateChange()),
          hit100: 97 * this.getRateChange(),
          hit50: 121 * this.getRateChange()
        };
        break;

      default: 
        console.error(`Couldn't calculate hit windows.\nRuleset ID: ${this.rulesetID}\nOverall Difficulty: ${this.overallDiff}\n300's hit window: ${this.hitWindows.hit300}`);
        break;
    };
  };

  getHitWindows() {
    return this.hitWindows;
  }

  /**
   * A helper method to get the rate change based on given mods list. This implementation uses mods saved locally inside the class.
   * @returns {0.75 | 1 | 1.5} Rate change.
   */
  getRateChange() {
    if (this.mods.includes('DT') || this.mods.includes('NC')) {
      return 1.5;
    };

    if (this.mods.includes('HT')) {
      return 0.75;
    };

    return 1;
  };

  /**
   * A helper method to set a property value in the root pseudo-class.
   * @param {string} property - A property to be changed.
   * @param {string} color - A color that should be set for this property.
   * @param {boolean} shouldBeVisible - Whether the color should be opaque or transparent.
   */
  applyColorToRootProperty(property, color, shouldBeVisible) {
    let rootStyles = document.querySelector(':root');

    if (color === 9) {
      color = color.slice(0, -2);
    };

    if (shouldBeVisible) {
      color += 'FF';
    } else {
      // Dirty hack to make computed style not return transparent black for hit error ticks.
      color += '01';
    };

    rootStyles.style.setProperty(property, color);
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

    switch (this.rulesetID) {
      case 0:
        if (absHitError < this.hitWindows.hit300) {
          return document.getElementById(`hit300${whichSegment}`);
        };

        if (absHitError < this.hitWindows.hit100) {
          return document.getElementById(`hit100${whichSegment}`);
        };

        return document.getElementById(`hit50${whichSegment}`);

      case 1:
        if (absHitError < this.hitWindows.hit300) {
          return document.getElementById(`hit300${whichSegment}`);
        };

        return document.getElementById(`hit100${whichSegment}`);

      case 3:
      case 4:
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
        return document.getElementById(`hit300${whichSegment}`);
    };
  };

  /**
   * A helper method to get a relative position of the hit error tick inside a hit error window.
   * @param {number} absHitError - The absolute value of the given hit error.
   * @returns {number} Relative position of the hit error tick.
   */
  getTickPositionPercentage(absHitError) {
    this.recalculateHitWindows();

    switch (this.rulesetID) {
      case 0:
        if (absHitError < this.hitWindows.hit300) {
          return absHitError / this.hitWindows.hit300;
        };

        if (absHitError < this.hitWindows.hit100) {
          return (absHitError - this.hitWindows.hit300) / (this.hitWindows.hit100 - this.hitWindows.hit300);
        };

        return (absHitError - this.hitWindows.hit100) / (this.hitWindows.hit50 - this.hitWindows.hit100);

      case 1:
        if (absHitError < this.hitWindows.hit300) {
          return absHitError / this.hitWindows.hit300;
        };

        return (absHitError - this.hitWindows.hit300) / (this.hitWindows.hit100 - this.hitWindows.hit300);

      case 3:
      case 4:
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
        return absHitError / this.hitWindows.hit300;
    };
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
    if (this.rulesetID === 2) {
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

    switch (this.rulesetID) {
      case 0:
      case 3:
      case 4: {
        return this.hitWindows.hit50;
      };

      case 1: {
        return this.hitWindows.hit100;
      };

      default: {
        return this.hitWindows.hit300;
      };
    };
  };
};

export default HitErrorMeter;