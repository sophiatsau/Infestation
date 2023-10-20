import { csrfFetch } from "./csrf";

const LOGIN = 'session/login';
const LOGOUT = 'session/logout';

const login = (user) => {
    return {
        type: LOGIN,
        user
    }
}

const logout = () => {
    return {
        type: LOGOUT
    }
}

//{credential: x, password: x}
export const loginThunk = (credentials) => async dispatch => {
    //DO NOT change backend to include update/createdAt
    const res = await csrfFetch(`/api/session`, {
        method: 'POST',
        body: JSON.stringify(credentials)
    })

    const data = await res.json();

    if (res.ok) {
        await dispatch(login(data));
        return data;
    }
}

export const logoutThunk = () => async dispatch => {
    const res = await csrfFetch(`/api/session`, {
        method: 'DELETE'
    })

    const data = await res.json();

    if (res.ok) {
        await dispatch(logout());
        return data;
    }
}

const initialState = {user: null};

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN: {
            return Object.assign({}, action.user)
        }
        case LOGOUT: {
            return {user: null};
        }
        default:
            return state;
    }
};

export default sessionReducer;
