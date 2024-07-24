import { csrfFetch } from "./csrf";
import {DELETE_MEMBERSHIP, GET_GROUP_MEMBERS, UPDATE_MEMBERSHIP, CREATE_GROUP, DELETE_GROUP} from "./actions";
import membersReducer from "./members";

const GET_ALL_GROUPS = 'groups/getAllGroups';
const GET_ONE_GROUP = 'groups/getOneGroup';
// const GET_GROUP_EVENTS = 'groups/getGroupEvents';
// export const CREATE_GROUP = 'groups/createGroup';
// const EDIT_GROUP = 'groups/editGroup';
// export const DELETE_GROUP = 'groups/deleteGroup'
// const GET_CURRENT_GROUPS = 'groups/getCurrentGroups'

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

const createGroup = (group) => {
    return {
        type: CREATE_GROUP,
        group,
    }
}

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

    // const resImage =
    await csrfFetch(`/api/groups/${dataGroup.id}/images`, {
        method: 'POST',
        body: JSON.stringify({url, preview: true})
    })

    if (resGroup.ok) dispatch(createGroup(dataGroup))

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
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
    })

    if (res.ok) dispatch(deleteGroup(groupId));

    return await res.json();
}

export const consumeAllGroups = () => (state) => Object.values(state.groups.allGroups);

export const consumeOneGroup = () => (state) => state.groups.singleGroup;

const initialState = {allGroups: {}, singleGroup: {}};

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_GROUPS: {
            const allGroups = {...state.allGroups};
            action.groups.forEach(group=> {
                group.isPrivate = group.private ? "Private" : "Public";
                delete group.private;
                allGroups[group.id] = group;
            })
            // return {...allGroups}
            return {...state, allGroups: allGroups}
        }
        case GET_ONE_GROUP: {
            // const allGroups = {...state};
            action.group.isPrivate = action.group.private ? "Private" : "Public";
            // allGroups[action.group.id] = action.group;
            // return allGroups;
            return {...state,
                singleGroup: {
                    ...action.group,
                    // Members: membersReducer(state.singleGroup.Members, action),
                }
            }
        }
        case DELETE_MEMBERSHIP: {
            const newState = {...state,
                singleGroup: {
                    ...state.singleGroup,
                    Members: membersReducer(state.singleGroup.Members, action),
                }
            }
            console.log("groups reducer", Object.values(newState.singleGroup.Members))
            const newMembers = Object.values(newState.singleGroup.Members).filter(member => member.Membership.status !== "pending")
            newState.singleGroup.numMembers = newMembers.length
            console.log(newMembers, newMembers.length)
            return newState
        }
        case UPDATE_MEMBERSHIP: {
            const newState = {...state,
                singleGroup: {
                    ...state.singleGroup,
                    Members: membersReducer(state.singleGroup.Members, action),
                }
            }
            console.log("groups reducer", Object.values(newState.singleGroup.Members))
            const newMembers = Object.values(newState.singleGroup.Members).filter(member => member.Membership.status !== "pending")
            newState.singleGroup.numMembers = newMembers.length
            console.log(newMembers, newMembers.length)
            return newState
        }
        case GET_GROUP_MEMBERS: {
            const newState = {...state,
                singleGroup: {
                    ...state.singleGroup,
                    Members: membersReducer(state.singleGroup.Members, action),
                }
            }
            return newState
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
