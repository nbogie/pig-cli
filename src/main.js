const { Confirm } = require("enquirer");
const { AnyKeyPrompt, WaitForAnyKey } = require("./AnyKeyPrompt");
const colors = require("ansi-colors");

const chalk = require("chalk"); //v4 for commonJS module version

async function main() {
    const scoreRequiredToWin = 30;

    showTitlePage(scoreRequiredToWin);
    let scores = { p1: 0, p2: 0 };
    let whoseTurnIsIt = "p1";
    while (scores.p1 < scoreRequiredToWin && scores.p2 < scoreRequiredToWin) {
        const result = await playOneTurn(whoseTurnIsIt, scores);
        if (result.outcome === "bank") {
            scores[whoseTurnIsIt] += result.amount;
        } else {
            //do nothing - bust
        }
        console.log(whoseTurnIsIt + " your score is " + scores[whoseTurnIsIt]);
        whoseTurnIsIt = whoseTurnIsIt === "p1" ? "p2" : "p1";
    }
    showFinalScores(scores);
}

async function playOneTurn(whoseTurnIsIt, scores) {
    const bankedScore = scores[whoseTurnIsIt];

    const playerName = whoseTurnIsIt;
    const fnName = whoseTurnIsIt === "p1" ? "bgRed" : "bgYellow";

    console.log(
        chalk.black[fnName].bold(
            "============= YOUR TURN, " + playerName + " ============"
        )
    );

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
        return { outcome: "bank", amount: runningTotal };
    } else {
        await WaitForAnyKey();
        return { outcome: "bust" };
    }
}
main();
function rollDie() {
    return 1 + Math.floor(Math.random() * 6);
}

/** @param {"p1"|"p2"} whoseTurnIsIt */
async function wantsToContinue(whoseTurnIsIt) {
    const colour = whoseTurnIsIt === "p1" ? colors.yellow : colors.red;
    const prompt = new Confirm({
        name: "question",
        styles: {
            strong: colour,
        },
        message: "Want to push your luck?",
    });

    return await prompt.run();
}

function showTitlePage(scoreRequiredToWin) {
    console.log(chalk.black.bgRed.bold("================================"));
    console.log(chalk.black.bgRed.bold("...Welcome to the game of PIG!.."));
    console.log(
        chalk.black.bgRed.bold(
            "It is first to " + scoreRequiredToWin + "......."
        )
    );
    console.log(chalk.black.bgRed.bold("================================"));
    console.log("\n\n");
}
function showFinalScores(scores) {
    console.log("Final Scores: ");
    console.log("P1: " + scores.p1);
    console.log("P2: " + scores.p2);
}
