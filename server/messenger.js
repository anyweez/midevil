const WebSocket = require('ws');

const Message = require('./game/message');

// Keyed by 'type' of message 
const handlers = {
    start: require('./handlers/start'),
};

const validConnectionUrl = new RegExp('/room/([0-9]+)/([a-z0-9]+)');

function findPlayer(randhash, room) {
    for (let i = 0; i < room.players.length; i++) {
        if (room.players[i].randhash === randhash) {
            return room.players[i];
        }
    }

    return null;
}

function prep(room, seeFn) {
    return room.players.map(p => {
        return {
            id: p.id,
            name: p.name,
            role: seeFn ? seeFn(p) : undefined,
        };
    });
}

function start(port, rooms) {
    const wss = new WebSocket.Server({ port });

    wss.on('connection', (conn, req) => {
        if (!validConnectionUrl.test(req.url)) return;

        const [_, roomId, randhash] = validConnectionUrl.exec(req.url);

        console.log(`New request (room=${roomId}, randhash=${randhash})`)
        const room = rooms[roomId];
        const player = findPlayer(randhash, room);

        // If the specified player doesn't exist, do nothing.
        if (player === null) return;

        player.conn = conn;

        // When a new connection comes in, send out an update to all subscribed players.
        console.log(`Received connection from ${player.name}`);

        room.players.forEach(p => {
            console.log(`new player joined; sending 'update_players' to ${p.name}`);

            p.send(new Message('update_players', prep(room)));
        });

        // Handle specified messages from each user.
        conn.on('message', raw => {
            const message = Message.from(raw);

            // TODO: make sure this message can only be sent from the host.
            if (message.type === 'start' && !room.started) {
                room.started = true;

                // Assign roles to all players. No new players can join at this point.
                room.assignRoles();

                const players = prep(room, p => player.see(p).display);

                room.players.forEach(player => {
                    player.send(new Message('start', players))
                });
            } else {
                console.error(`Unknown message: ${message.type}`)
            }
        });

        conn.on('close', () => {
            console.log(`player left`);                
            
            room.remove(player);
            // console.log(room.players);

            room.players.forEach(p => {
                console.log(`  - sending 'update_players' to ${p.name}`)
                p.send(new Message('update_players', prep(room)));
            });
        });
    });
};

module.exports = { start };