import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = 'groups/getAllGroups';
const GET_ONE_GROUP = 'groups/getOneGroup';
const GET_GROUP_EVENTS = 'groups/getGroupEvents';
const CREATE_GROUP = 'groups/createGroup';

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

const getGroupEvents = (events) => {
    return {
        type: GET_GROUP_EVENTS,
        events,
    }
}

const createGroup = (group) => {
    return {
        type: CREATE_GROUP,
        group,
    }
}

export const fetchGroups = () => async dispatch => {
    const res = await csrfFetch('/api/groups');
    const data = await res.json();
    if (res.ok) dispatch(getAllGroups(data.Groups));
    return data;
}

export const fetchGroupById = (groupId) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}`);
    const data = await res.json();
    const group = data.Groups;
    if (res.ok) dispatch(getOneGroup(group));
    return group;
}

export const fetchEventsByGroup = (groupId) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}/events`);
    const data = await res.json();

    if (res.ok) dispatch(getGroupEvents(data.Events));

    return data.Events;
}

export const createNewGroup = (payload) => async dispatch => {
    const {url, ...newGroup} = payload;

    const resGroup = await csrfFetch(`/api/groups`, {
        method: 'POST',
        body: JSON.stringify(newGroup)
    })

    const dataGroup = await resGroup.json();

    const resImage = await csrfFetch(`/api/groups/${dataGroup.id}/images`, {
        method: 'POST',
        body: JSON.stringify({url, preview: true})
    })

    const dataImage = await resImage.json;

    if (resGroup.status < 400 && resImage.ok) {
        dataGroup.previewImage = resImage
        console.log("🚀 ~ file: groups.js:79 ~ createNewGroup ~ dataGroup:", dataGroup)
        dataGroup.isPrivate = dataGroup.private ? "Private" : "Public";
        dispatch(createGroup(dataGroup))
    }

    return [dataGroup, dataImage]
}

export const consumeAllGroups = () => (state) => Object.values(state.groups);

export const consumeOneGroup = (groupId) => (state) => state.groups[groupId];

const initialState = {events: {}};

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_GROUPS: {
            const newGroups = {...state, events: {...state.events}};
            action.groups.forEach(group=> {
                group.isPrivate = group.private ? "Private" : "Public";
                delete group.private;
                newGroups[group.id] = group;
            })
            return {...newGroups}
        }
        case GET_ONE_GROUP: {
            const newGroups = {...state, events: {...state.events}};
            action.group.isPrivate = action.group.private ? "Private" : "Public";
            newGroups[action.group.id] = action.group;
            return newGroups;
        }
        case GET_GROUP_EVENTS: {
            const events = {};

            action.events.forEach(event => {
                events[event.id] = event;
            })
            const newGroups = {...state, events};
            return newGroups;
        }
        case CREATE_GROUP: {
            console.log("🚀 ~ file: groups.js:121 ~ groupsReducer ~ action.group:", action.group)
            const newState = {
                ...state,
                events: {...state.events},
                [action.group.id]: action.group,
            };
            return newState;
        }
        default:
            return state;
    }
};

export default groupsReducer;
