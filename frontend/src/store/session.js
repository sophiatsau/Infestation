import { csrfFetch } from "./csrf";

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => {
    return {
        type: SET_USER,
        user
    }
}

const removeUser = () => {
    return {
        type: REMOVE_USER
    }
}

//{credential: x, password: x}
export const login = (credentials) => async dispatch => {
    //DO NOT change backend to include update/createdAt
    const res = await csrfFetch(`/api/session`, {
        method: 'POST',
        body: JSON.stringify(credentials)
    })

    //csrfFetch handles errors
    const data = await res.json();
    dispatch(setUser(data));
    return data;
}

export const logout = () => async dispatch => {
    const res = await csrfFetch(`/api/session`, {
        method: 'DELETE'
    })

    //csrfFetch handles cases where res.status >= 400
    const data = await res.json();
    dispatch(removeUser());
    return data;
}

export const restoreUser = () => async dispatch => {
    const res = await csrfFetch(`/api/session`);
    const data = await res.json();
    dispatch(setUser(data))
    return data;
}

const initialState = {user: null};

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER: {
            return Object.assign({}, action.user)
        }
        case REMOVE_USER: {
            return {user: null};
        }
        default:
            return state;
    }
};

export default sessionReducer;
