import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = 'groups/getAllGroups';
const GET_ONE_GROUP = 'groups/getOneGroup';
// const GET_GROUP_EVENTS = 'groups/getGroupEvents';
const CREATE_GROUP = 'groups/createGroup';
// const EDIT_GROUP = 'groups/editGroup';
const DELETE_GROUP = 'groups/deleteGroup'
//TODO:
const GET_CURRENT_GROUPS = 'groups/getCurrentGroups'

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

// const getGroupEvents = (events) => {
//     return {
//         type: GET_GROUP_EVENTS,
//         events,
//     }
// }

// const createGroup = (group) => {
//     return {
//         type: CREATE_GROUP,
//         group,
//     }
// }

// const editGroup = (group) => {
//     return {
//         type: EDIT_GROUP,
//         group,
//     }
// }

const deleteGroup = (groupId) => {
    return {
        type: DELETE_GROUP,
        groupId
    }
}

export const fetchGroups = () => async dispatch => {
    const res = await csrfFetch('/api/groups');
    const data = await res.json();
    if (res.ok) dispatch(getAllGroups(data.Groups));
    return data;
}

export const fetchGroupById = (groupId) => async dispatch => {
    // try {
        const res = await csrfFetch(`/api/groups/${groupId}`);
        const data = await res.json();
        const group = data.Groups;
        if (res.ok) dispatch(getOneGroup(group));
        return group;
    // } catch(e) {
    //     return e;
    // }
}

// export const fetchEventsByGroup = (groupId) => async dispatch => {
//     try {
//         const res = await csrfFetch(`/api/groups/${groupId}/events`);
//         const data = await res.json();
//         if (res.ok) dispatch(getGroupEvents(data.Events));
//         return data.Events;
//     } catch (e) {
//         console.log(e, 'caught')
//         const data = await e.json();
//         return data;
//     }

// }

export const createNewGroup = (payload) => async dispatch => {
    const {url, ...newGroup} = payload;

    const resGroup = await csrfFetch(`/api/groups`, {
        method: 'POST',
        body: JSON.stringify(newGroup)
    })

    const dataGroup = await resGroup.json();

    await csrfFetch(`/api/groups/${dataGroup.id}/images`, {
        method: 'POST',
        body: JSON.stringify({url, preview: true})
    })

    // const dataImage = await resImage.json();

    // if (resGroup.status < 400 && resImage.ok) {
    //     dataGroup.previewImage = dataImage
    //     dataGroup.isPrivate = dataGroup.private ? "Private" : "Public";
    //     dispatch(createGroup(dataGroup))
    // }

    return dataGroup
}

export const editGroupById = (payload) => async dispatch => {
    const {groupId, ...newGroup} = payload;

    const resGroup = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        body: JSON.stringify(newGroup)
    })

    const dataGroup = await resGroup.json();

    // if (resGroup.status < 400) {
    //     dispatch(createGroup(dataGroup.id))
    // }

    return dataGroup
}

export const deleteOneGroup = (groupId) => async dispatch => {
    console.log("deleting...")
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
    })

    console.log("delete complete")

    if (res.ok) dispatch(deleteGroup(groupId));

    return await res.json();
}

export const consumeAllGroups = () => (state) => Object.values(state.groups.allGroups);

export const consumeOneGroup = () => (state) => state.groups.singleGroup;

const initialState = {allGroups: {}, singleGroup: {}};

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_GROUPS: {
            const newGroups = {...state};
            action.groups.forEach(group=> {
                group.isPrivate = group.private ? "Private" : "Public";
                delete group.private;
                newGroups[group.id] = group;
            })
            // return {...newGroups}
            return {...state, allGroups: newGroups}
        }
        case GET_ONE_GROUP: {
            const newGroups = {...state};
            action.group.isPrivate = action.group.private ? "Private" : "Public";
            newGroups[action.group.id] = action.group;
            // return newGroups;
            return {...state, singleGroup: action.group}
        }
        // case GET_GROUP_EVENTS: {
        //     const events = {};

        //     action.events.forEach(event => {
        //         events[event.id] = event;
        //     })
        //     const newGroups = {...state, events};
        //     return newGroups;
        // }
        case CREATE_GROUP: {
            const newState = {
                allGroups: {
                    ...state,
                    [action.group.id]: action.group
                },
                singleGroup: action.group
            };
            return newState;
        }
        case DELETE_GROUP: {
            const newGroups = {...state, singleGroup: {}};
            delete newGroups.allGroups[action.groupId];
            return newGroups;
        }
        default:
            return state;
    }
};

export default groupsReducer;
