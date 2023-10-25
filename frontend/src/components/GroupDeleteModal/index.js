import React from 'react'
import { useModal } from '../../context/Modal';
import { useHistory} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteOneGroup } from '../../store/groups';

export default function GroupDeleteModal({groupId}) {
    const { closeModal } = useModal();
    const history = useHistory();
    const dispatch = useDispatch();

    const handleDelete = async(e) => {
        try {
            await dispatch(deleteOneGroup(groupId))
            history.push('/groups');
            closeModal(e);
        } catch (err) {
            console.log(err)
        }
        return;
    }

    return (
        <div>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this group?</p>
            <button onClick={handleDelete}>Yes (Delete Group)</button>
            <button onClick={closeModal}>No (Keep Group)</button>
        </div>
    )
}
