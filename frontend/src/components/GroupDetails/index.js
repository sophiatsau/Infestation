import React, { useEffect, useState } from 'react';
import {useParams, Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import {fetchGroupById, consumeOneGroup, fetchEventsByGroup } from '../../store/groups';

import GroupEvents from './GroupEvents';
import BreadcrumbLink from '../BreadcrumbLink';
import GroupDetailsInfo from './GroupDetailsInfo';

import './GroupDetails.css';

export default function GroupDetails() {
  const {groupId} = useParams();
  const dispatch = useDispatch();

  const group = useSelector(consumeOneGroup(groupId))

  let events = useSelector((state) => Object.values(state.groups.events));

  const [upcomingEvents, pastEvents] = events ? sortEvents(events) : [[],[]];

  useEffect(() => {
    async function getGroup() {
        return await dispatch(fetchGroupById(groupId))
            .catch(async (res) => {
                const data = await res.json();
                console.log(data.title, '-', data.message)
                // history.push('/not-found')
            })
    }
    getGroup()
  }, [groupId, dispatch])

  useEffect(() => {
    (async () => {
      await dispatch(fetchEventsByGroup(groupId));
    })()
  }, [dispatch])

  return (
    <>
    <BreadcrumbLink to="/groups" text="Groups"/>
    <GroupDetailsInfo group={group}/>
    <GroupEvents type="Upcoming" events={upcomingEvents} />
    <GroupEvents type="Past" events={pastEvents} />
    </>
  )
}

function sortEvents(events) {
  events.forEach(event => event.startDate = new Date(event.startDate).getTime());

  //test past events
  // events.push({name: "old event", previewImage: null, startDate: new Date('10/20/23'), Group: {id: 1, name: 'Evening Tennis on the Water', city: 'New York', state: 'NY'}})

  events = events.sort((a,b) => {
    return a.startDate > b.startDate ? 1 : -1;
  });

  const index = events.findIndex(event => event.startDate > new Date().getTime());

  const pastEvents = events.slice(0,index)
  const upcomingEvents = events.slice(index)

  return [upcomingEvents, pastEvents];
}
