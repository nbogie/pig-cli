const colors = require("ansi-colors");
const chalk = require("chalk"); //use v4 for commonJS module version
//@ts-expect-error type doesn't mention Confirm export but it's there.
const { Confirm } = require("enquirer");
const { WaitForAnyKey } = require("./AnyKeyPrompt");

/**
 * @typedef {import('./types').Player} Player
 * @typedef {import('./types').Scores} Scores
 * @typedef {import('./types').TurnOutcome} TurnOutcome

 */

/**
 * Plays out one turn of the game of pig (until a player banks or goes bust)
 * and returns a promise resolving to the appropriate new scores for the game.
 * @param {Player} currentPlayer
 * @param {Scores} scores current scores before starting this turn
 * @returns {Promise<TurnOutcome>}
 */
async function playOneTurn(currentPlayer, scores) {
    const bankedScore = scores[currentPlayer];

    bannerForPlayer("Your Turn, " + currentPlayer, currentPlayer);

    let isBust = false;
    let runningTotal = 0;
    do {
        const dieResult = rollDie();
        isBust = dieResult === 1;
        runningTotal += dieResult;
        console.log(
            currentPlayer +
                ", you rolled a: " +
                chalk.bgWhite.black.bold(" " + dieResult + " ")
        );
        console.log(
            isBust
                ? "You are bust!"
                : `You could bank: ${runningTotal}, adding to your existing ${bankedScore}`
        );
    } while (!isBust && (await wantsToContinue(currentPlayer)));

    const newScores = isBust
        ? { ...scores } //a copy of previous scores, rather than the same reference.
        : bankToScore(scores, currentPlayer, runningTotal);

    bannerForPlayer(
        `Turn is Over.  Scores are p1:${newScores.p1} v p2:${newScores.p2}`,
        currentPlayer
    );

    if (!isBust) {
        return { outcome: "bank", newScores };
    } else {
        await WaitForAnyKey();
        return { outcome: "bust", newScores };
    }
}

/**
 * return a new score object, adding running total to the previous score of the indicated current player.
 * @param {Scores} scores previous scores object
 * @param {Player} currentPlayer
 * @param {number} runningTotal current player's running total to be banked
 * @returns {Scores} new scores object
 */
function bankToScore(scores, currentPlayer, runningTotal) {
    return {
        ...scores,
        [currentPlayer]: scores[currentPlayer] + runningTotal,
    };
}
/**
 * @returns {number} an integer between 1 and 6, representing a single 6-sided die roll
 */
function rollDie() {
    return 1 + Math.floor(Math.random() * 6);
}

/**
 * @param {Player} currentPlayer
 */
async function wantsToContinue(currentPlayer) {
    const colour = currentPlayer === "p1" ? colors.yellow : colors.red;
    const prompt = new Confirm({
        name: "question",
        message: "Want to push your luck?",
        styles: {
            strong: colour,
        },
    });
    return await prompt.run();
}
/**
 * @returns {void}
 * */
function showTitlePage(scoreRequiredToWin) {
    console.log(chalk.black.bgRed.bold(padCentre("=", 50, "=")));
    console.log(
        chalk.black.bgRed.bold(
            padCentre("Welcome to the game of PIG!", 50, " ")
        )
    );
    console.log(
        chalk.black.bgRed.bold(
            padCentre(
                "First to " + scoreRequiredToWin + " points wins",
                50,
                " "
            )
        )
    );
    console.log(chalk.black.bgRed.bold(padCentre("=", 50, "=")));
    console.log("\n\n");
}

/**
 *
 * @param {Scores} scores
 */
function showFinalScores(scores) {
    const winner = whoWon(scores);
    banner(` !!!! ${winner} won !!!! `, bgColourForPlayer(winner), "-");
    console.log(chalk.bgWhite.black(padCentre(" Final Scores ", 50, "=")));
    const p1Decoration = winner === "p1" ? "🌈" : "🤷";
    const p2Decoration = winner === "p2" ? "🌈" : "🤷";
    console.log(
        chalk.bgWhite.black(
            padCentre(` ${p1Decoration} P1: ${scores.p1} `, 50, "=")
        )
    );
    console.log(
        chalk.bgWhite.black(
            padCentre(` ${p2Decoration} P2: ${scores.p2} `, 50, "=")
        )
    );
    console.log(chalk.bgWhite.black(padCentre("", 50, "=")));
}

/**
 *
 * @param {Player} player
 * @returns {string} bg color function name for chalk for background of message.
 */
function bgColourForPlayer(player) {
    return player === "p1" ? "bgRed" : "bgYellow";
}

/**
 *
 * @param {string} message
 * @param {Player} playerName
 */
function bannerForPlayer(message, playerName) {
    const fnName = bgColourForPlayer(playerName);
    console.log(
        chalk.black[fnName].bold(
            padCentre(" " + playerName + ": " + message + " ", 50, "=")
        )
    );
}

/**
 *
 * @param {string} message
 * @param {string} colour
 * @param {string} padChar
 */
function banner(message, colour, padChar = "=") {
    console.log(
        chalk.black[colour].bold(padCentre(" " + message + " ", 50, padChar))
    );
}
/**
 *@param {Scores} scores
 * @returns {Player} name of player who won */
function whoWon(scores) {
    //TODO: draw? (should be impossible in this game if we only call this method when the game is over)
    return scores.p1 > scores.p2 ? "p1" : "p2";
}

/**
 * Return the next player to go after the given one
 * @param {Player} currentPlayer
 * @returns {Player} next player in sequence
 */
function nextPlayer(currentPlayer) {
    return currentPlayer === "p1" ? "p2" : "p1";
}

/**
 * Distributes padding evenly around the given string.
 * @param {string} str string to pad
 * @param {number} targetLength target length of total output string (original str + padding)
 * @param {string} padString string to use as padding (defaults to space)
 */
function padCentre(str, targetLength, padString = " ") {
    if (str.length >= targetLength) {
        return str;
    }

    const totalPadding = targetLength - str.length;
    const paddingStart = Math.floor(totalPadding / 2);
    const paddingEnd = totalPadding - paddingStart;

    return padString.repeat(paddingStart) + str + padString.repeat(paddingEnd);
}

module.exports = {
    rollDie,
    wantsToContinue,
    showTitlePage,
    showFinalScores,
    bannerForPlayer,
    banner,
    whoWon,
    playOneTurn,
    nextPlayer,
};
