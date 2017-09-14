import React, { Component } from 'react';
import { Switch, Router, Route } from 'react-router-dom';

import LoginView from './components/views/login';
import LobbyView from './components/views/lobby';
import PlayView from './components/views/play';

import { connect } from './store';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
  }

  handleNewUser(user, roomId) {
    this.props.updateUser(user);
    this.props.updateRoom({ id: roomId });
  }

  render() {
    return (
      <div className="App">
        <header>
          <h2>Mid Evil</h2>
        </header>

        <main>
          <Switch>
            <Route exact path="/" render={({ history }) => <LoginView history={history} onAuth={(u, r) => this.handleNewUser(u, r)} />} />
            <Route exact path="/lobby" render={({ history }) => <LobbyView history={history} user={this.props.user} room={this.props.room} onRoomUpdate={this.props.updateRoom} />} />
            <Route exact path="/play" render={({ history }) => <PlayView history={history} user={this.props.user} room={this.props.room} />} />
          </Switch>
        </main>
      </div>
    );
  }
}

const ConnectedApp = connect(App);

export default ConnectedApp;
