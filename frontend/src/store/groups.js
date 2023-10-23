import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = 'groups/getAllGroups';

const getAllGroups = (groups) => {
    return {
        type: GET_ALL_GROUPS,
        groups
    }
}

export const fetchGroups = () => async dispatch => {
    const res = await fetch('/api/groups');
    const data = await res.json();
    dispatch(getAllGroups(data.Groups));
    return data;
}

export const consumeAllGroups = () => (state) => Object.values(state.groups.Groups);

const initialState = {Groups:[]};

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_GROUPS: {
            const newGroups = {};
            action.groups.forEach(group=> {
                group.isPrivate=group.private ? "private" : "public";
                delete group.private;
                newGroups[group.id] = group;
            })
            return {...state, Groups: newGroups}
        }
        default:
            return state;
    }
};

export default groupsReducer;
