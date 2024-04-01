import { csrfFetch } from "./csrf";
import { UPDATE_MEMBERSHIP, REQUEST_MEMBERSHIP, DELETE_MEMBERSHIP } from "./actions";

export const SET_USER = 'session/setUser';
export const REMOVE_USER = 'session/removeUser';

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

export const signup = (user) => async dispatch => {
    const res = await csrfFetch(`/api/users`, {
        method: 'POST',
        body: JSON.stringify(user)
    });
    const data = await res.json();
    dispatch(setUser(data))
    return data;
}

const initialState = {user: null};

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER: {
            if (!action.user.user) return {...action.user}
            const user = {
                ...action.user.user,
                memberships: {}
            }
            action.user.user.memberships.forEach(membership => user.memberships[membership.groupId] = membership.status)
            return {user}
        }
        case REMOVE_USER: {
            return {user: null};
        }
        case UPDATE_MEMBERSHIP:
        case REQUEST_MEMBERSHIP: {
            if (action.payload.memberId !== state.user.id) return state
            const newState = {...state}
            newState.user.memberships[action.groupId] = action.payload.status
            return newState
        }
        // case UPDATE_MEMBERSHIP: {
        //     const newState = {...state}
        //     newState.user.memberships[action.groupId] = action.payload.status
        //     return newState
        // }
        case DELETE_MEMBERSHIP: {
            const newState = {...state}
            delete newState.user.memberships[action.payload.groupId]
            return newState
        }
        default:
            return state;
    }
};

export default sessionReducer;
