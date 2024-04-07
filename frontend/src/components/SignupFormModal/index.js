import {useEffect, useState} from 'react';
import { useDispatch} from "react-redux";
import * as sessionActions from "../../store/session";

import { useModal } from '../../context/Modal';
import './SignupForm.css';

export default function SignupFormModal() {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [disabled, setDisabled] = useState(true);
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    useEffect(() => {
        if (username.length>=4 && firstName && lastName && email && password.length>=6 && confirmPassword===password) setDisabled(false);
        else setDisabled(true)
    }, [username, firstName, lastName, email, password, confirmPassword])

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password===confirmPassword) {
            setErrors({});

            return dispatch(sessionActions.signup({
                email,
                username,
                firstName,
                lastName,
                password,
            }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    //make sure there are errors before setting
                    setErrors(data.errors);
                }
            })
        }

        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
          });
    }

    const updateErrorsDisabled = (value, fieldName, minLength, errMsg) => {
        console.log("updateErrorsDisabled:", value, fieldName, minLength, errMsg)
        if (value.length < minLength) {
            setDisabled(true)
            setErrors({...errors, [fieldName]: errMsg})
        } else {
            const newErrors = {...errors}
            delete newErrors[fieldName]
            setErrors(newErrors)
        }
    }

    const handleErrors = e => {
        const {value, id} = e.target
        console.log(value, id)
        switch (id) {
            case "first-name":
                updateErrorsDisabled(value, "firstName", 1, "Please enter a first name")
                break
            case "last-name":
                updateErrorsDisabled(value, "lastName", 1, "Please enter a last name")
                break
            case "email":
                updateErrorsDisabled(value, "email", 1, "Please enter your email")
                break
            case "username":
                updateErrorsDisabled(value, "username", 4, "Username must be 4 or more letters")
                break
            case "password":
                updateErrorsDisabled(value, "password", 6, "Password must be 6 or more letters")
                break
            case "confirm-password":
                if (value !== password) {
                    setDisabled(true)
                    setErrors({...errors, confirmPassword: "Passwords do not match"})
                } else {
                    const newErrors = {...errors}
                    delete newErrors.confirmPassword
                    setErrors(newErrors)
                }
                break
            default:
                return
        }
    }

    return (
        <>
        <h2 id="sign-up-header">Sign Up</h2>
        <form id='sign-up-form' onSubmit={handleSubmit}>
            <label htmlFor='first-name'>
                First Name
                <input
                    type="text"
                    id='first-name'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    onBlur={handleErrors}
                />
                <div className='form-error'>
                    {errors.firstName && <p>{errors.firstName}</p>}
                </div>
            </label>
            <label htmlFor='last-name'>
                Last Name
                <input
                    type="text"
                    id='last-name'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    onBlur={handleErrors}
                />
                <div className='form-error'>
                    {errors.lastName && <p>{errors.lastName}</p>}
                </div>
            </label>
            <label htmlFor='email'>
                Email
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    onBlur={handleErrors}
                />
                <div className='form-error'>
                    {errors.email && <p>{errors.email}</p>}
                </div>
            </label>
            <label htmlFor='username'>
                Username
                <input
                    type="text"
                    value={username}
                    id='username'
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    onBlur={handleErrors}
                />
                <div className='form-error'>
                    {errors.username && <p>{errors.username}</p>}
                </div>
            </label>
            <label htmlFor='password'>
                Password
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    id='password'
                    onBlur={handleErrors}
                />
                <div className='form-error'>
                    {errors.password && <p>{errors.password}</p>}
                </div>
            </label>
            <label htmlFor='confirm-password'>
                Confirm Password
                <input
                    type="password"
                    id='confirm-password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    onBlur={handleErrors}
                />
                <div className='form-error'>
                    {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
                </div>
            </label>

            <button type="submit" disabled={disabled}>Sign Up</button>
        </form>
        </>
    )
}
