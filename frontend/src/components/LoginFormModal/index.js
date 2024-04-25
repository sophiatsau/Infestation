import {useDispatch} from 'react-redux';
import React, {useState, useEffect} from 'react';
import "./LoginForm.css";

import * as sessionActions from "../../store/session";
import { useModal } from '../../context/Modal';
import OauthButton from '../OauthButton';

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

    const validateInput = e => {
        const {value, name} = e.target;
        switch (name) {
            case "login":
                if (value.length < 4) {
                    setDisabled(true)
                    setErrors({...errors, login: "Username or Email must be 4 or more characters"})
                } else {
                    const newErrors = {...errors}
                    delete newErrors.login
                    setErrors(newErrors)
                }
                break
            case "password":
                if (value.length < 6) {
                    setDisabled(true)
                    setErrors({...errors, password: "Password must be 6 or more characters"})
                }
                else {
                    const newErrors = {...errors}
                    delete newErrors.password
                    setErrors(newErrors)
                }
                break
            default:
                return
        }
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
        <form id='login-form' onSubmit={handleSubmit}>
            <div className='form-error'>
                {errors.credential && <p>{errors.credential}</p>}
            </div>
            <label>
            Username or Email
            <input
                type="text"
                name="login"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                onBlur={validateInput}
                required
            />
            </label>
            <div className='form-error'>
                {errors.login && <p>{errors.login}</p>}
            </div>
            <label>
            Password
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                onBlur={validateInput}
                name="password"
            />
            </label>
            <div className='form-error'>
                {errors.password && <p>{errors.password}</p>}
            </div>
            <button type="submit" disabled={disabled}>Log In</button>
            <OauthButton />
            <button id="demo-login" onClick={demoLogIn}>Log In As Demo User</button>
        </form>
        </>
    )
}
