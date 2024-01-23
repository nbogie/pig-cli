const colors = require("ansi-colors");
const chalk = require("chalk"); //use v4 for commonJS module version
//@ts-expect-error type doesn't mention Confirm export but it's there.
const { Confirm } = require("enquirer");

/**
 * @typedef {import('./types').Player} Player
 * @typedef {import('./types').Scores} Scores
 */

/**
 * @returns {number} an integer between 1 and 6, representing a single 6-sided die roll
 */
function rollDie() {
    return 1 + Math.floor(Math.random() * 6);
}

/**
 * @param {Player} whoseTurnIsIt
 */
async function wantsToContinue(whoseTurnIsIt) {
    const colour = whoseTurnIsIt === "p1" ? colors.yellow : colors.red;
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
    bannerForPlayer(`!!!! ${winner} won !!!`, whoWon(scores));
    console.log(chalk.bgWhite.black(padCentre("Final Scores", 50, "=")));
    const p1Decoration = winner === "p1" ? "🌈" : "🤷";
    const p2Decoration = winner === "p2" ? "🌈" : "🤷";
    console.log(
        chalk.bgWhite.black(
            padCentre(p1Decoration + "P1: " + scores.p1, 50, "=")
        )
    );
    console.log(
        chalk.bgWhite.black(
            padCentre(p2Decoration + "P2: " + scores.p2, 50, "=")
        )
    );
}

/**
 *
 * @param {string} message
 * @param {Player} playerName
 */
function bannerForPlayer(message, playerName) {
    const fnName = playerName === "p1" ? "bgRed" : "bgYellow";

    console.log(
        chalk.black[fnName].bold(
            padCentre(playerName + ": " + message, 50, "=")
        )
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
    whoWon,
};
