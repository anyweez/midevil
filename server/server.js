const express = require('express');
const util = require('util');
const bodyParser = require('body-parser');
const session = require('express-session'); // new
const cors = require('cors');
const boom = require('express-boom');

const messenger = require('./messenger');
const Room = require('./game/room');
const User = require('./game/user');

const server = express();
server.use(bodyParser.json());
server.use(cors());
server.use(boom());

server.use(session({
    secret: '98rncailevn-_DT83FZ@',
    resave: false,
    saveUninitialized: true
}));

const rooms = {};

let nextRoomId = function () {
    const taken = new Set();

    return () => {
        let rand = Math.floor(Math.random() * 10000);

        while (taken.has(rand)) {
            rand = Math.floor(Math.random() * 10000);
        }

        taken.add(rand);
        // return rand;
        return 1111;
    };
}();

server.post('/game', (req, res) => {
    console.log(req.body);

    if (!req.body.name) {
        return res.boom.badRequest('Invalid username');
    }

    if (req.session.user) {
        return res.boom.badRequest('Already logged in');
    }

    const user = new User(req.body.name);
    const room = new Room(nextRoomId(), user);

    req.session.user = user;

    rooms[room.id] = room;
    user.room = room.id;

    res.json(user);
});

server.post('/game/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (!rooms[id]) {
        return res.boom.badRequest(`Room doesn't exist.`)
    }

    if (!req.body.name) {
        return res.boom.badRequest(`Name not specified.`);
    }

    const user = new User(req.body.name);
    const room = rooms[id];

    // If the room doesn't exist or has already started, it's too late to join.
    if (!room || room.started) {
        return res.boom.badRequest(`Room doesn't exist or has already started.`);
    }

    // Add the user to the room and remember who this user is.
    room.add(user);
    user.room = room.id;

    req.session.user = user;

    res.json(user);
});

server.get('/rooms', (req, res) => {
    res.json(rooms);
});

server.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

server.listen(8000, () => {
    console.log(`Listening on port 8000`);
});

messenger.start(8080, rooms);