var fs = require('fs');
var readline = require('readline');

const minAnger = 0;
const maxAnger = 4;

const badMessageOptions = [
    '_ is BLASPHEMY!', 
    '_ is against the will of the One Above',
    'You are walking a dangerous path with _',
    'My wrath shall descend on those who mention __',
    '_ is for heathens and pagans'
];

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
                this.talk('Help me cleanse the unbelievers and heathens in this chat. Type "excommunicate" to report the sender of the previous message', 0);
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
        if (this.previousMessageSender) {
            if (sender === this.previousMessageSender) {
                this.talk('You may not excommunicate yourself. Only your brethren can decide your faith.', 300);
            } else if (sender.reputation < this.previousMessageSender.reputation) {
                this.talk(this.previousMessageSender.userName + " is a righteous member of our community and will not be excommunicated. You are hereby banished from this chat.", 300);
                setTimeout(sender.disconnect.bind(sender), 500);
            } else if (sender.reputation > this.previousMessageSender.reputation) {
                this.talk(this.previousMessageSender.userName + " is a heathen and has been excommunicated", 300);
                setTimeout(this.previousMessageSender.disconnect.bind(this.previousMessageSender), 500);
            } else {
                this.talk("You are both equal in the eyes of our Lord. I don't know why to bellieve. You may both stay.", 300);
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
            this.talk(this.randomBadWordMessage(curses[0]), Math.random() * 2000);
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

    randomBadWordMessage(badWord) {
        let message = badMessageOptions[Math.floor(Math.random() * badMessageOptions.length)];
        return message.replace('_', badWord);
    }
}

module.exports = Nun;