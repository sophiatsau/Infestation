import React, {useState, useEffect} from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { consumeOneGroup, fetchGroupById } from '../../store/groups';

import GroupForm from '../GroupForm'

export default function GroupUpdatePage() {
    const history = useHistory();
    const {groupId} = useParams();
    const dispatch = useDispatch();

    const sessionUserId = useSelector(state => state.session.user?.id);
    const group = useSelector(consumeOneGroup(groupId));
    const {organizerId} = group || {}

    if (!sessionUserId ||
      (sessionUserId && organizerId && sessionUserId!==organizerId)) {
        history.push('/');
    }

    const [isOrganizer, setIsOrganizer] = useState(false);

    useEffect(() => {
      setIsOrganizer(organizerId===sessionUserId)
    }, [organizerId, sessionUserId])

    useEffect(() => {
        dispatch(fetchGroupById(groupId))
    }, [dispatch])

    if (!isOrganizer) return null;

    return (
        <GroupForm formType="edit" group={group}/>
    )
}
