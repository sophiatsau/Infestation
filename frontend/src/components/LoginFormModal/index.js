import {useDispatch} from 'react-redux';
import React, {useState, useEffect} from 'react';
import "./LoginForm.css";

import * as sessionActions from "../../store/session";
import { useModal } from '../../context/Modal';

export default function LoginFormModal() {
    const {closeModal} = useModal();

    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if (credential.length>=4 && password.length>=6) {
            setDisabled(false);
        } else setDisabled(true);
    }, [credential, password])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatchLogin(credential, password);
    };

    const demoLogIn = (e) => {
        e.preventDefault();
        dispatchLogin("Demo-lition", "password")
    }

    function dispatchLogin(credential, password) {
        return dispatch(
            sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
    }

    return (
        <>
        <h2 id="login-title">Log In</h2>
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
            <div className='form-error'>
                {errors.credential && <p>{errors.credential}</p>}
            </div>
            <button type="submit" disabled={disabled}>Log In</button>
            <a href='#' id="demo-login" onClick={demoLogIn}>Log In As Demo User</a>
        </form>
        </>
    )
}
