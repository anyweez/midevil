const Message = require('../game/message');

module.exports = function ({ body }, room) {
    return room.players.map(player => new Message('start'));
};