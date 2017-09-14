/**
 * Arrive from: <none>
 * Move to: Login
 * 
 * Initial component where players join an existing game or create a new one. Transitions to
 * Lobby component if all goes well.
 */

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class LoginView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            room: 1111,
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleRoomChange = this.handleRoomChange.bind(this);

        this.startGame = this.startGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
    }

    handleNameChange(ev) {
        this.setState({
            name: ev.target.value,
        });
    }

    handleRoomChange(ev) {
        this.setState({
            room: parseInt(ev.target.value, 10),
        });
    }

    startGame() {
        const headers = new Headers();
        headers.set('Content-type', 'application/json');

        fetch('http://localhost:8000/game', {
            method: 'post',
            headers,
            body: JSON.stringify({ name: this.state.name }),
        })
        .then(r => r.json())
        .then(response => {
            this.props.onAuth({
                id: response.id,
                name: response.name,
                randhash: response.randhash,
            }, response.room);

            this.props.history.push(`/lobby`);
        });
    }

    joinGame() {
        const headers = new Headers();
        headers.set('Content-type', 'application/json');

        fetch(`http://localhost:8000/game/${this.state.room}`, {
            method: 'post',
            headers,
            body: JSON.stringify({ name: this.state.name }),
        })
        .then(r => r.json())
        .then(response => {
            this.props.onAuth({
                id: response.id,
                name: response.name,
                randhash: response.randhash,
            }, response.room);

            this.props.history.push(`/lobby`);
        });
    }

    render() {
        return (
            <div>
                <h2>Login</h2>

                <input type="text" placeholder="Name" value={this.state.name} onChange={this.handleNameChange} />
                <input type="number" min="1000" max="9999" value={this.state.room} onChange={this.handleRoomChange} />

                <button onClick={this.startGame}>Start</button>
                <button onClick={this.joinGame}>Join</button>

                <div>
                    <a href="/logout">Logout</a>
                </div>
            </div>
        );
    }
}

export default LoginView;