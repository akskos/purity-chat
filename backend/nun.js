const minAnger = 0;
const maxAnger = 4;

class Nun {
    constructor() {
        this.anger = minAnger;
    }

    // React to the message by updating the state
    reviseMessage(messageText) {
        if (Math.random() < 0.3) {
            this.anger = Math.max(minAnger, this.anger - 1);
        } else if (Math.random() > 0.7) {
            this.anger = Math.min(maxAnger, this.anger + 1);
        }

        return messageText;
    }

    getStatusMessage() {
        return {
            type: "nunStatus",
            anger: this.anger
        }
    }
}

module.exports = Nun;