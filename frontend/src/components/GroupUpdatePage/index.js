import React, {useState, useEffect} from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { consumeOneGroup, fetchGroupById } from '../../store/groups';

import GroupForm from '../GroupForm'

export default function GroupUpdatePage() {
    window.scroll(0,0);
    const history = useHistory();
    const {groupId} = useParams();
    const dispatch = useDispatch();

    const sessionUserId = useSelector(state => state.session.user?.id);
    const group = useSelector(consumeOneGroup());
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
          .catch(() => {
            history.push('/');
          })
    }, [dispatch, groupId, history])

    if (!isOrganizer) return null;

    return (
        <GroupForm formType="edit" group={group}/>
    )
}
