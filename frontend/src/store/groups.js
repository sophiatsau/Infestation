import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = 'groups/getAllGroups';
const GET_ONE_GROUP = 'groups/getOneGroup';

const getAllGroups = (groups) => {
    return {
        type: GET_ALL_GROUPS,
        groups
    }
}

const getOneGroup = (group) => {
    return {
        type: GET_ONE_GROUP,
        group
    }
}

export const fetchGroups = () => async dispatch => {
    const res = await csrfFetch('/api/groups');
    const data = await res.json();
    dispatch(getAllGroups(data.Groups));
    return data;
}

export const fetchGroupById = (groupId) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}`);
    const data = await res.json();
    const group = data.Groups;
    dispatch(getOneGroup(group));
    return group;
}

export const consumeAllGroups = () => (state) => Object.values(state.groups);

export const consumeOneGroup = (groupId) => (state) => state.groups[groupId];

const initialState = {};

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_GROUPS: {
            const newGroups = {};
            action.groups.forEach(group=> {
                group.isPrivate = group.private ? "Private" : "Public";
                delete group.private;
                newGroups[group.id] = group;
            })
            return {...newGroups}
        }
        case GET_ONE_GROUP: {
            const newGroups = {...state};
            action.group.isPrivate = action.group.private ? "Private" : "Public";
            // delete action.group.private;
            newGroups[action.group.id] = action.group;
            console.log("🚀 ~ file: groups.js:57 ~ groupsReducer ~ newGroups:", newGroups)

            return newGroups;
        }
        default:
            return state;
    }
};

export default groupsReducer;
