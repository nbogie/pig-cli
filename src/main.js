//@ts-expect-error type doesn't mention Confirm export but it's there.

const { Confirm } = require("enquirer");
const { WaitForAnyKey } = require("./AnyKeyPrompt");
const colors = require("ansi-colors");
const chalk = require("chalk"); //use v4 for commonJS module version

/**
 * @typedef {"p1"|"p2"} Player
 * @typedef {{p1:number, p2:number}} Scores
 */

async function main() {
    const scoreRequiredToWin = 10;

    showTitlePage(scoreRequiredToWin);

    let scores = { p1: 0, p2: 0 };
    /** @type {Player} */
    let whoseTurnIsIt = "p1";

    while (scores.p1 < scoreRequiredToWin && scores.p2 < scoreRequiredToWin) {
        const { newScores } = await playOneTurn(whoseTurnIsIt, scores);
        scores = newScores;
        bannerForPlayer(
            whoseTurnIsIt + " your score is " + scores[whoseTurnIsIt],
            whoseTurnIsIt
        );
        whoseTurnIsIt = whoseTurnIsIt === "p1" ? "p2" : "p1";
    }
    showFinalScores(scores);
}

/**
 *
 * @param {Player} whoseTurnIsIt
 * @param {Scores} scores
 * @returns {Promise<
 *   { outcome: "bank", newScores:Scores }
 * | { outcome: "bust", newScores:Scores }
 * >}
 */
async function playOneTurn(whoseTurnIsIt, scores) {
    const bankedScore = scores[whoseTurnIsIt];

    bannerForPlayer("Your Turn, " + whoseTurnIsIt, whoseTurnIsIt);

    let isBust = false;
    let runningTotal = 0;
    do {
        const dieResult = rollDie();
        isBust = dieResult === 1;
        runningTotal += dieResult;
        console.log(
            whoseTurnIsIt +
                "You rolled a: " +
                dieResult +
                (isBust
                    ? "You are bust!"
                    : ".  You could bank: " +
                      runningTotal +
                      ", adding to your existing " +
                      bankedScore)
        );
    } while (!isBust && (await wantsToContinue(whoseTurnIsIt)));
    if (!isBust) {
        const newScores = {
            ...scores,
            [whoseTurnIsIt]: scores[whoseTurnIsIt] + runningTotal,
        };
        return { outcome: "bank", newScores };
    } else {
        await WaitForAnyKey();
        return { outcome: "bust", newScores: { ...scores } };
    }
}

/**
 * @returns {number} an integer between 1 and 6, representing a single 6-sided die roll
 */
function rollDie() {
    return 1 + Math.floor(Math.random() * 6);
}

/** @param {"p1"|"p2"} whoseTurnIsIt */
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

function bannerForPlayer(message, playerName) {
    const fnName = playerName === "p1" ? "bgRed" : "bgYellow";

    console.log(chalk.black[fnName].bold(padCentre(message, 50, "=")));
}

/**
 * @returns {"p1"|"p2"} name of player who won */
function whoWon(scores) {
    //TODO: draw? (should be impossible in this game)
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
main();
