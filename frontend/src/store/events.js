import { csrfFetch } from "./csrf";

// const GET_GROUP_EVENTS = 'events/getGroupEvents';

// const getGroupEvents(payload) => {

// }

// export const fetchEventsByGroup = (groupId) => async dispatch => {
//     const res = await fetch(`/api/groups/${groupId}/events`);
//     const data = await res.json();

//     dispatch();

//     return data;
// }

const initialState={};

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default eventsReducer;
