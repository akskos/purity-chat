let adjectives = [
    'Holy', 'Pure', 'Heavenly', 'Righteous',
    'Highest', 'Honorable', 'Altruistic', 'Angelic', 
    'Admirable', 'Valiant', 'Dirty'
];

let names = [
    'Ramiel', 'Castiel', 'Euriel', 'Gabriel', 'Michael',
    'Lucifer', 'MorningStar', 'Haniel', 'Rafael', 'Adriel',
    'Cael', 'Moloch', 'Cherub', 'Lemuel', 'Yael', 'Raziel',
    'Ezekiel', 'Seraphina', 'Sariel', 'Hadraniel', 'Tabbris',
    'Gadreel', 'Afriel'
];

function generateName() {
    let adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    let name = names[Math.floor(Math.random() * names.length)];
    return adj + ' ' + name;
}

module.exports = generateName;