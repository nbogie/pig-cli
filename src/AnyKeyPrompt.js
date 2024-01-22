const { Prompt } = require("enquirer");

function WaitForAnyKey(message) {
    const prompt = new AnyKeyPrompt({
        name: "anykey",
        message,
    });

    return prompt.run();
}

class AnyKeyPrompt extends Prompt {
    constructor(options = {}) {
        super(options);
        this.value = "";
    }

    async render() {
        let { message } = this.state;
        this.write(`${message} Press any key to continue...`);
    }

    async keypress() {
        this.submit();
    }
}

module.exports = { AnyKeyPrompt, WaitForAnyKey };
