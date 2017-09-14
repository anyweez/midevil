import {
    applyMiddleware,
    combineReducers,
    createStore,
} from 'redux';

import { connect as _connect } from 'react-redux';
import { withRouter } from 'react-router';

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'UPDATE_USER':
            return {
                user: Object.assign({}, state.user, action.user),
                room: state.room,
            };
        case 'UPDATE_ROOM':
            const s = {
                user: state.user,
                room: Object.assign({}, state.room, action.room),
            };

            console.log('action');
            console.log(action);
            // Preference for the new player list if both are available.
            s.room.players = action.room.players || s.room.players;

            console.log(s);
            return s;
        default:
            return state;
    }
};

const defaultState = {
    user: {
        id: null,
        name: '',
        randhash: '',
    },
    room: {
        id: null,
        players: [],
    },
};

const actions = {
    updateRoom: room => {
        return { type: 'UPDATE_ROOM', room };
    },
    updateUser: user => {
        return { type: 'UPDATE_USER', user };
    },
};

// const reducers = combineReducers({ reducer });
export const store = createStore(reducer, defaultState);

export const connect = component => {
    const mapStateToProps = (state, own) => {
        return {
            room: state.room,
            user: state.user,
        };
    };

    const mapDispatchToProps = {
        updateRoom: actions.updateRoom,
        updateUser: actions.updateUser,
    };

    // If withRouter isn't present then the route transitions don't
    // happen...
    return withRouter(_connect(
        mapStateToProps,
        mapDispatchToProps,
    )(component));
};