
module.exports = class Message {
    static from(raw) {
        const { type, body } = JSON.parse(raw);

        const msg = new Message(type);
        msg.body = body;

        return msg;
    }

    constructor(type, body = {}) {
        this.type = type;
        this.body = body;
    }
}

// TODO: check this
const valid_types = ['start', 'set_role'];