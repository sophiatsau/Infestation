import React from 'react'
import { useModal } from '../../context/Modal';
import { useHistory} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteOneGroup } from '../../store/groups';
import { deleteOneEvent } from '../../store/events';

import './DeleteModal.css'

export default function DeleteModal({featureId, feature, groupId}) {
    const { closeModal } = useModal();
    const history = useHistory();
    const dispatch = useDispatch();

    const capitalFeature = feature[0].toUpperCase() + feature.slice(1);

    const handleDelete = async(e) => {
        let thunk, redirection
        if (feature==="group") {
            thunk = deleteOneGroup;
            redirection = '/groups'
        } else {
            thunk = deleteOneEvent;
            redirection = `/groups/${groupId}`
        }

        try {
            await dispatch(thunk(featureId))
            history.push(redirection);
            closeModal(e);
        } catch (err) {
            console.log(err)
        }
        return;
    }

    return (
        <div className="delete-feature-confirmation">
            <h1 id="confirm-delete-header">Confirm Delete</h1>
            <p>Are you sure you want to remove this {feature}?</p>
            <button id='delete-yes' onClick={handleDelete}>Yes (Delete {capitalFeature})</button>
            <button id='delete-no' onClick={closeModal}>No (Keep {capitalFeature})</button>
        </div>
    )
}
