const { showTitlePage, playOneTurn, showFinalScores } = require("./support");
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

    //setting this type restricts the variable so it can only ever be assigned the string "p1" or "p2" (or vscode complains)
    /** @type {Player} */
    let currentPlayer = "p1";

    while (scores.p1 < scoreRequiredToWin && scores.p2 < scoreRequiredToWin) {
        const { newScores } = await playOneTurn(currentPlayer, scores);
        scores = newScores; //replace the current scores
        currentPlayer = currentPlayer === "p1" ? "p2" : "p1";
    }
    showFinalScores(scores);
}

main();
