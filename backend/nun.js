var fs = require('fs');
var readline = require('readline');

const minAnger = 0;
const maxAnger = 4;

class Nun {
    constructor(talkCallbackArg) {
        this._anger = minAnger;
        this.cursewords = [];
        this.holyWords = [];
        this.readWordLists();
        this.talkCallback = talkCallbackArg;
        this.messagesSinceLastGuidance = 0;
        this.previousMessageSender = null;
        setInterval(() => {
            if (this.messagesSinceLastGuidance > 6) {
                this.talk('Help me get rid of hateful motherfuckos. Type \"Excommunicate\" if you find the previous message is bad bad bad, to help me fight blasphemy!', 0);
                this.messagesSinceLastGuidance = 0;
            }
        }, 60000);
    }

    readWordLists() {
        let curseLines = readline.createInterface({
            input: fs.createReadStream('./data/curseWords.txt')
        });
        curseLines.on('line', (line)=> {
            this.cursewords.push(line.toLowerCase());
        });

        let holyLines = readline.createInterface({
            input: fs.createReadStream('./data/holyWords.txt')
        });
        holyLines.on('line', (line)=> {
            this.holyWords.push(line.toLowerCase());
        });
    }

    tryExcommunicate(sender) {
        if (this.messagesSinceLastGuidance == 0) {
            this.talk('You know what happens when you try to excommunicate me, don\'t you?', 300);
            setTimeout(sender.disconnect.bind(sender), 500);
        } else if (this.previousMessageSender) {
            if (sender === this.previousMessageSender) {
                this.talk('What you doing, you cannot excommunicate yourself...', 300);
            } else if (sender.reputation < this.previousMessageSender.reputation) {
                this.talk(this.previousMessageSender.userName + " is an honorable member of our community. Leave now.", 300);
                setTimeout(sender.disconnect.bind(sender), 500);
            } else if (sender.reputation > this.previousMessageSender.reputation) {
                this.talk("I have learnt to trust you, " + sender.userName + ", " + this.previousMessageSender.userName + "must go!", 300);
                setTimeout(this.previousMessageSender.disconnect.bind(this.previousMessageSender), 500);
            }
        }
    }

    // React to the message by updating the state
    reviseMessage(messageText, sender) {
        let cleanMessage = messageText.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+\r]/g, '').replace(/\s{2,}/g," ").toLowerCase();

        let curses = [];
        let holies = [];
        let messageWords = cleanMessage.split(' ');
        
        if (messageWords.includes('excommunicate')) {
            this.tryExcommunicate(sender);
        }

        for (let word of messageWords) {
            if (this.cursewords.includes(word)) {
                curses.push(word);
            }
            if (this.holyWords.includes(word)) {
                holies.push(word);
            }
        }

        if (curses.length == 0) {
            this.anger -= 0.2;
        }
        this.anger -= Math.min(0.5, holies.length * 0.1);
        this.anger += Math.min(1.5, curses.length * 0.4);

        if (curses.length > 0) {
            sender.reputation -= 0.6 * curses.length;
            this.talk("Careful with " + curses.join(', '), Math.random() * 2000);
        }

        if (holies.length > 0) {
            sender.reputation += 0.6 * holies.length;
            this.talk("Blessed be those who talk like angels. " + sender.userName + " earned a purity coin <3", Math.random() * 2000);
        }

        this.previousMessageSender = sender;
        this.messagesSinceLastGuidance++;

        return messageText;
    }

    getStatusMessage() {
        return {
            type: "nunStatus",
            anger: Math.round(this.anger)
        }
    }

    // Talk in the chat
    talk(msgText, delay) {
        if (!this.talkCallback) { throw 'Nun cannot talk, it does not have a talk callback!'; }
        if (delay == null) {delay = 0;}
        setTimeout(() => {this.talkCallback(msgText)}, delay);
    }

    set anger(value) {
        this._anger = Math.min(maxAnger, Math.max(minAnger, value));
    }

    get anger() { return this._anger; }
}

module.exports = Nun;