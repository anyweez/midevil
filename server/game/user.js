const roles = require('./roles');

let nextUser = 0;

module.exports = class User {
    constructor(name) {
        this.id = nextUser++;
        this.name = name;
        this.room = null;
        this.conn = null;

        this.randhash = Math.random().toString(16).substring(2);
        // this.randhash = 'aaaa';
    }

    get isHost() {
        return this.room && this.room.host.id === this.id;
    }

    /**
     * Returns the view of the specified user that `this` user has.
     */
    see(user) {
        return this.role.see(user.role) ?
            user.role :
            roles.unknown;
    }

    send(message) {
        if (!this.conn) return false;
        
        const str = JSON.stringify(message);
        this.conn.send(str);
        return true;
    }
};