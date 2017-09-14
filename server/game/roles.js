module.exports = {
    minion: {
        type: 'minion',
        display: 'Minion of Mordred',

        /**
         * Determine whether a user in this role can see the role of `who`.
         */
        see(who) { // who is a role
            return who.type === 'minion';
        }
    },
    loyal: {
        type: 'loyal_servant',
        display: 'Loyal Servant of Arthur',

        see(who) {
            return false;
        }
    },

    unknown: {
        type: 'unknown',
        display: 'Unknown',
    }
}