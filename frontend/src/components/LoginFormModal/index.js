import {useDispatch} from 'react-redux';
import React, {useState} from 'react';
import "./LoginForm.css";

import * as sessionActions from "../../store/session";
import { useModal } from '../../context/Modal';

export default function LoginFormModal() {
    const {closeModal} = useModal();

    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        return dispatch(
            sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    console.log("🚀 ~ file: index.js:26 ~ data:", data)
                    if (data && data.errors) setErrors(data.errors);
                }
            );
    };

    return (
        <>
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
            <label>
            Username or Email
            <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
            />
            </label>
            <label>
            Password
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </label>
            {errors.credential && <p>{errors.credential}</p>}
            <button type="submit">Log In</button>
        </form>
        </>
    )
}
