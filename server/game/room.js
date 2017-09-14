const { minion, loyal } = require('./roles');

module.exports = class Room {
    constructor(id, host) {
        this.id = id;
        this.host = host; // User

        this.players = [host];
        this.started = false;
    }

    add(player) {
        if (this.started) {
            throw new Error('Cannot add player after room has started.');
        }
        this.players.push(player);
    }

    /**
     * Remove the specified player from the room's player list.
     */
    remove(player) {
        this.players = this.players.filter(p => p.id !== player.id);
    }

    /**
     * Assign a role to each player in the room. No more players can be added after this function 
     * is called!
     */
    assignRoles() {
        const available = roles[this.players.length];

        shuffle(available);

        this.players.forEach((player, i) => {
            player.role = available[i];
        });
    }
};

/**
 * Each element of the `roles` array describes the distribution of each role that should exist for the
 * number of players specified by the index. For example, the distribution for a 5-player game can be
 * found by looking at roles[5].
 */
const roles = [
    undefined,  // 0
    undefined,  // 1
    undefined,  // 2
    undefined,  // 3
    undefined,  // 4
    [minion, minion, loyal, loyal, loyal], // 5
    [minion, minion, loyal, loyal, loyal, loyal],    // 6
    [minion, minion, minion, loyal, loyal, loyal, loyal], // 7
    [minion, minion, minion, loyal, loyal, loyal, loyal, loyal], // 8
    [minion, minion, minion, loyal, loyal, loyal, loyal, loyal, loyal], // 9
    [minion, minion, minion, minion, loyal, loyal, loyal, loyal, loyal, loyal], // 10
];

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}