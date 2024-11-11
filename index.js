import WebSocketManager from './js/socket.js';
import HitErrorMeter from './js/hitErrorMeter.js';
const socket = new WebSocketManager(`${location.host}`);

let cache = {
    showHemInCatch: false,
    hemScaleWithResolution: true,
    hideInGameScoreMeter: true,
    urStyle: '',
    client: '',
    previousState: '',
    currentState: '',
    isConvert: false,
    rulesetName: '',
    overallDiff: 0,
    circleSize: 0,
    mods: 'asdf',
    rate: -1,
    isFullscreen: true,
    gameWindowedHeight: -1,
    gameFullscreenHeight: -1,
    foldersBeatmap: '',
    filesBackground: '',
    backgroundDim: -1,
    scoreMeterSize: 0,
    hitErrors: [14, 34, 69, 420, 1337, 2137],
    unstableRate: -1,
    hitErrorsPreviousAmount: -1,
    relativeMovingAverageArrowPosition: 0
};

let unstableRate = new CountUp('unstableRate', 0, 0, 2, .5, { useEasing: true, useGrouping: true, separator: ' ', decimal: '.', prefix: 'UR: ' });

const hemManager = new HitErrorMeter();



/**
 * A helper method to prepare the Unstable Rate display.
 * @param {string} previousGameState - The game state before the current one.
 * @param {string} currentGameState - The current game state.
 * @param {'Show nothing' | 'Show only the value' | 'Show both the prefix and the value'} urStyle - The display style of the Unstable Rate display.
 */
function prepareUnstableRateDisplay(previousGameState, currentGameState, urStyle) {
    let urElement = document.querySelector('#unstableRate');
    cache.urStyle = urStyle;

    // You cannot edit existing CountUps' properties, therefore redeclare it.
    if (cache.urStyle === 'Show only the value') {
        unstableRate = new CountUp('unstableRate', cache.unstableRate, 0, 2, .5, { useEasing: true, useGrouping: true, separator: ' ', decimal: '.' });
    } else if (cache.urStyle === 'Show both the prefix and the value') {
        unstableRate = new CountUp('unstableRate', cache.unstableRate, 0, 2, .5, { useEasing: true, useGrouping: true, separator: ' ', decimal: '.', prefix: 'UR: ' });
    };

    // Either during gameplay or when going to the results screen from gameplay.
    urElement.style.opacity = Number((currentGameState === 'play' || (currentGameState === 'resultScreen' && previousGameState === 'play')) && urStyle !== 'Show nothing');
};

/**
 * Calculate standard deviation. Used to replace tosu's sometimes buggy (and even rarer crash-causing) implementation.
 * @param {number[]} values - An array of values to get a standard deviaton of.
 * @returns {number} Standard deviation of given numbers.
 * @see {@link https://www.w3schools.com/statistics/statistics_standard_deviation.php}
 */
function calculateStandardDeviation(values) {
    if (values.length <= 1) {
        return 0;
    };

    let sum = 0, sumOfSquares = 0, mean = 0, diffs = [], standardDeviation = 0;

    values.forEach(value => {
        sum += value;
    });

    mean = sum / values.length;
    values.forEach(value => {
        diffs.push(Math.pow(value - mean, 2));
    });

    diffs.forEach(diff => {
        sumOfSquares += diff;
    });

    standardDeviation = Math.sqrt(sumOfSquares / values.length);

    return standardDeviation;
};



socket.sendCommand('getSettings', encodeURI(window.COUNTER_PATH));

socket.commands(({ command, message }) => {
    try {
        if (command === 'getSettings') {
            cache.showHemInCatch = message.showHemInCatch;
            cache.hemScaleWithResolution = message.hemScaleWithResolution;
            cache.hideInGameScoreMeter = message.hideInGameScoreMeter;

            // tosu's osu!(lazer) implementation doesn't have this yet.
            if (cache.hemScaleWithResolution && cache.client !== 'lazer') {
                if (cache.isFullscreen) {
                    document.querySelector('.main').style.transform = `scale(${cache.gameFullscreenHeight / 1080})`;
                } else {
                    document.querySelector('.main').style.transform = `scale(${cache.gameWindowedHeight / 1080})`;
                };
            } else {
                document.querySelector('.main').style.transform = `scale(1)`;
            };

            hemManager.applyUserSettings(message);
            document.querySelector('.hitErrorMeterContainer').style.opacity = Number(cache.currentState === 'play' && (message.showHemInCatch || cache.rulesetName !== 'fruits'));
            // Taiko applies a vertical offset to the map background only in some maps (can't determine why yet).
            // See https://github.com/ppy/osu/issues/14238#issuecomment-2167691307
            document.querySelector('.inGameScoreMeterHider').style.opacity = Number(cache.currentState === 'play' && cache.hideInGameScoreMeter && cache.rulesetName !== 'taiko');

            prepareUnstableRateDisplay(cache.previousState, cache.currentState, message.urStyle);
        };
    } catch (error) {
        console.error(error);
    };
});

socket.api_v2(({ client, state, settings, beatmap, play, folders, files }) => {
    try {
        if (cache.client !== client) {
            cache.client = client;
        };

        // Normally, all of these checks would be separate `if` statements (especially the state check),
        // however this approach wouldn't work in a way that I want this overlay to work.
        if (cache.currentState !== state.name
            || cache.rulesetName !== settings.mode.name
            || cache.isConvert !== beatmap.isConvert
            || cache.overallDiff !== beatmap.stats.od.original
            || cache.circleSize !== beatmap.stats.cs.original
            || cache.mods !== play.mods.name
            || cache.rate !== play.mods.rate) {
            cache.previousState = cache.currentState;
            cache.currentState = state.name;

            cache.rulesetName = settings.mode.name;
            cache.isConvert = beatmap.isConvert;
            cache.overallDiff = beatmap.stats.od.original;
            cache.circleSize = beatmap.stats.cs.original;
            cache.mods = play.mods.name;
            cache.rate = play.mods.rate;

            // osu!mania has different hit windows on converts.
            if (cache.rulesetName === 'mania' && cache.isConvert) {
                cache.rulesetName = 'maniaConvert';
            };

            prepareUnstableRateDisplay(cache.previousState, cache.currentState, cache.urStyle);
            hemManager.prepareHitErrorMeter(cache.rulesetName, cache.overallDiff, cache.circleSize, cache.mods, cache.rate);
            document.querySelector('.hitErrorMeterContainer').style.opacity = Number(cache.currentState === 'play' && (cache.showHemInCatch || cache.rulesetName !== 'fruits'));
            // Taiko applies a vertical offset to the map background only in some maps (can't determine why yet).
            // See https://github.com/ppy/osu/issues/14238#issuecomment-2167691307
            document.querySelector('.inGameScoreMeterHider').style.opacity = Number(cache.currentState === 'play' && cache.hideInGameScoreMeter && cache.rulesetName !== 'taiko');

            let hitWindows = hemManager.getHitWindows();

            // tosu's osu!(lazer) implementation doesn't have this yet.
            if (cache.scoreMeterSize !== settings.scoreMeter.size && cache.client !== 'lazer') {
                cache.scoreMeterSize = settings.scoreMeter.size;
            };

            if (cache.rulesetName === 'fruits' || settings.scoreMeter.type.name === 'colour') {
                // It's actually 21.5px, hovewer I will use that to my advantage to make sure it actually covers the entire thing.
                // Also yes, the size at 1x scale is the same across the board.
                document.querySelector('.inGameScoreMeterHider').style.height = `${Math.ceil(22 * cache.scoreMeterSize) / 16}rem`;

                // 1 pixel for each side is added for a good measure in case the in-game hit error meter peaks on one side or the other.
                document.querySelector('.inGameScoreMeterHider').style.width = `${Math.ceil((639 + 2) * cache.scoreMeterSize) / 16}rem`;
            } else if (settings.scoreMeter.type.name === 'error') {
                document.querySelector('.inGameScoreMeterHider').style.height = `${Math.ceil(27 * cache.scoreMeterSize) / 16}rem`;

                if (cache.rulesetName === 'taiko') {
                    // The additional 19px is for 50's hit window that doesn't actually do anything in taiko.
                    document.querySelector('.inGameScoreMeterHider').style.width = `${Math.ceil(((hitWindows.hit100 * 1.125 + 19) * 2 + 2) * cache.scoreMeterSize) / 16}rem`;
                } else {
                    document.querySelector('.inGameScoreMeterHider').style.width = `${Math.ceil((hitWindows.hit50 * 1.125 * 2 + 2) * cache.scoreMeterSize) / 16}rem`;
                };
            } else {
                document.querySelector('.inGameScoreMeterHider').style.width = '0';
                document.querySelector('.inGameScoreMeterHider').style.height = '0';
            };
        };

        if (cache.isFullscreen !== settings.resolution.fullscreen || cache.gameWindowedHeight !== settings.resolution.height || cache.gameFullscreenHeight !== settings.resolution.heightFullscreen) {
            cache.isFullscreen = settings.resolution.fullscreen;
            cache.gameWindowedHeight = settings.resolution.height;
            cache.gameFullscreenHeight = settings.resolution.heightFullscreen;

            // tosu's osu!(lazer) implementation doesn't have this yet.
            if (cache.hemScaleWithResolution && cache.client !== 'lazer') {
                if (cache.isFullscreen) {
                    document.querySelector('.main').style.transform = `scale(${cache.gameFullscreenHeight / 1080})`;
                } else {
                    document.querySelector('.main').style.transform = `scale(${cache.gameWindowedHeight / 1080})`;
                };
            } else {
                document.querySelector('.main').style.transform = `scale(1)`;
            };
        };

        if (cache.foldersBeatmap !== folders.beatmap || cache.filesBackground !== files.background) {
            cache.foldersBeatmap = folders.beatmap;
            cache.filesBackground = files.background;

            if (cache.filesBackground !== '') {
                document.getElementById('background').src = `${location.origin}/files/beatmap/${cache.foldersBeatmap}/${cache.filesBackground}`;
            } else {
                document.getElementById('background').src = '';
            };
        };

        if (cache.backgroundDim !== settings.background.dim) {
            cache.backgroundDim = settings.background.dim;

            document.getElementById('background').style.filter = `brightness(${1 - cache.backgroundDim / 100})`;
        };
    } catch (error) {
        console.error(error);
    };
});

socket.api_v2_precise(({ hitErrors }) => {
    try {
        if (JSON.stringify(cache.hitErrors) !== JSON.stringify(hitErrors)) {
            cache.hitErrors = hitErrors;

            let ur = calculateStandardDeviation(cache.hitErrors) * 10;
            if (cache.rulesetName !== 'mania' || cache.rulesetName !== 'maniaConvert') {
                ur /= cache.rate;
            };
            cache.unstableRate = ur;
            unstableRate.update(cache.unstableRate);

            let hitErrorsCurrentAmount = cache.hitErrors.length;
            if (hitErrorsCurrentAmount === 0) {
                cache.relativeMovingAverageArrowPosition = 0;
                document.querySelector('.movingAverageArrow').style.left = '0%';
            };

            if (hitErrorsCurrentAmount > 0 && cache.hitErrorsPreviousAmount === -1) {
                cache.hitErrorsPreviousAmount = hitErrorsCurrentAmount - 50;
            };

            for (let i = cache.hitErrorsPreviousAmount; i < hitErrorsCurrentAmount; i++) {
                if (cache.hitErrors[i] !== undefined && !isNaN(cache.hitErrors[i]) && cache.hitErrors[i] !== null) {
                    hemManager.addTick(cache.hitErrors[i]);

                    // This is pretty much a slight modification of osu!(lazer)'s implementation (except for the if).
                    // See more details by looking at the `getRelativeHitErrorPosition`'s JSDoc.
                    // Also, osu!catch stores fruits landing on the right side of the catcher as ""early hits"" - flip the hit error to correct it.
                    if (cache.rulesetName !== 'fruits') {
                        document.querySelector('.movingAverageArrow').style.left = `${hemManager.getRelativeHitErrorPosition(cache.relativeMovingAverageArrowPosition = cache.relativeMovingAverageArrowPosition * 0.9 + cache.hitErrors[i] * 0.1) * 100}%`;
                    } else {
                        document.querySelector('.movingAverageArrow').style.left = `${hemManager.getRelativeHitErrorPosition(cache.relativeMovingAverageArrowPosition = cache.relativeMovingAverageArrowPosition * 0.9 - cache.hitErrors[i] * 0.1) * 100}%`;
                    };
                };
            };

            cache.hitErrorsPreviousAmount = hitErrorsCurrentAmount;
        };
    } catch (error) {
        console.error(error);
    };
});