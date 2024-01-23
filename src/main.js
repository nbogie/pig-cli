"use strict";
const { WaitForAnyKey } = require("./AnyKeyPrompt");

const {
    rollDie,
    wantsToContinue,
    showTitlePage,
    showFinalScores,
    bannerForPlayer,
} = require("./support");

//Import Player, Scores, and TurnOutcome jsdoc type definitions from a shared file.
/**
 * @typedef {import('./types').Player} Player
 * @typedef {import('./types').Scores} Scores
 * @typedef {import('./types').TurnOutcome} TurnOutcome
 */

async function main() {
    const scoreRequiredToWin = 40;

    showTitlePage(scoreRequiredToWin);

    let scores = { p1: 0, p2: 0 };
    /** @type {Player} */
    let whoseTurnIsIt = "p1";

    while (scores.p1 < scoreRequiredToWin && scores.p2 < scoreRequiredToWin) {
        const { newScores } = await playOneTurn(whoseTurnIsIt, scores);
        scores = newScores; //replace the current scores
        bannerForPlayer(
            "Your score is " + scores[whoseTurnIsIt],
            whoseTurnIsIt
        );
        whoseTurnIsIt = whoseTurnIsIt === "p1" ? "p2" : "p1";
    }
    showFinalScores(scores);
}

/**
 * Plays out one turn of the game of pig (until a player banks or goes bust)
 * and returns a promise resolving to the appropriate new scores for the game.
 * @param {Player} whoseTurnIsIt
 * @param {Scores} scores current scores before starting this turn
 * @returns {Promise<TurnOutcome>}
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
        console.log(whoseTurnIsIt + "You rolled a: " + dieResult);
        console.log(
            isBust
                ? "You are bust!"
                : `You could bank: ${runningTotal}, adding to your existing ${bankedScore}`
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

main();
