import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = 'groups/getAllGroups';
const GET_ONE_GROUP = 'groups/getOneGroup';
const GET_GROUP_EVENTS = 'events/getGroupEvents';

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
    const res = await fetch(`/api/groups/${groupId}/events`);
    const data = await res.json();

    if (res.ok) dispatch(getGroupEvents(data.Events));

    return data.Events;
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
        default:
            return state;
    }
};

export default groupsReducer;
