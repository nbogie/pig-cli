const {
    showTitlePage,
    playOneTurn,
    showFinalScores,
    nextPlayer,
} = require("./support");

//Import jsdoc type definitions for Player, Scores, and TurnOutcome from a shared file.
//(If you think this import syntax is ugly, you're not wrong.)
/**
 * @typedef {import('./types').Player} Player
 * @typedef {import('./types').Scores} Scores
 * @typedef {import('./types').TurnOutcome} TurnOutcome
 */

/** The main function.  Play the game of pig until one player has won. */
async function main() {
    const scoreRequiredToWin = 40;

    showTitlePage(scoreRequiredToWin);

    //Setting this type restricts the variable so it can only ever be assigned to an object of the shape defined by the Scores typedef.
    /** @type {Scores} */
    let scores = { p1: 0, p2: 0 };

    //setting this type restricts the variable so it can only ever be assigned the string "p1" or "p2" (or vscode complains)
    /** @type {Player} */
    let currentPlayer = "p1";

    while (scores.p1 < scoreRequiredToWin && scores.p2 < scoreRequiredToWin) {
        const { newScores } = await playOneTurn(currentPlayer, scores);
        scores = newScores; //replace the current scores
        currentPlayer = nextPlayer(currentPlayer);
    }
    showFinalScores(scores);
}

main();
