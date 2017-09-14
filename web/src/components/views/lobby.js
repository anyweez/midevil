
/**
 * Arrive from: Login
 * Move to: Play
 * 
 * All players that are in the same lobby will be listed here. As soon as its go time, the host can click
 * 'play' and all players transition to the Play view.
 */


import React, { Component } from 'react';

const websocketBaseUrl = `ws://localhost:8080/room`;

class LobbyView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            conn: null,
        };
    }

    componentWillMount() {
        // If no one's logged in, redirect back to the login page.
        if (this.props.user.id === null) {
            this.props.history.push('/');
        }

        const url = `${websocketBaseUrl}/${this.props.room.id}/${this.props.user.randhash}`;
        this.conn = new WebSocket(url);

        this.conn.addEventListener('open', ev => {
            console.log('connected!');
        });

        this.conn.addEventListener('message', ev => {
            console.log('receiving new message');
            const msg = JSON.parse(ev.data);

            this.props.onRoomUpdate({ players: msg.body });
        });
    }

    render() {
        const room = this.props.room;
        const players = room.players.map(p => {
            return (
                <li key={p.id}>{p.name}</li>
            );
        })

        return (
            <div>
                <h2>Lobby #{this.props.room.id}</h2>
                <h2>Players</h2>
                <ol>
                    {players}
                </ol>
            </div>
        );
    }
}

export default LobbyView;