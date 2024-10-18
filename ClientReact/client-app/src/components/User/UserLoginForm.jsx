import React, { useState } from 'react';
import styles from "../../styles/User.module.css"
import { useDispatch } from 'react-redux';
import { loginUser, setBasket } from '../../features/user/userSlice';

const UserLoginForm = ({toggleCurrentFormType, closeForm}) => {

    const dispatch = useDispatch();
    const [values, setValues] = useState({
        email: "",
        password: ""
    });

    const handleChange = ( { target: {value, name } }) => {
        setValues({...values, [name]: value})
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        const isNotEmpty = Object.values(values).some(val => val)

        if(!isNotEmpty) 
            return;
        dispatch(loginUser(values));
        closeForm();
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.close} onClick={closeForm}>
                <svg className="icon">
                    <use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#close`} />
                </svg>
            </div>

            <div className={styles.title}>
                Log In
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.group}>
                    <input 
                    type='text'
                    placeholder='Your email'
                    name="email"
                    value={values.email}
                    autoComplete='off'
                    onChange={handleChange}
                    //required
                    />
                </div>

                <div className={styles.group}>
                    <input 
                    type='password'
                    placeholder='Your password'
                    name="password"
                    value={values.password}
                    autoComplete='off'
                    onChange={handleChange}
                    required
                    />
                </div>

                <div
                className={styles.link}
                onClick={() => toggleCurrentFormType("signup")}
                >
                    Create account
                </div>
                <button type='sumbit' className={styles.submit}>
                    Log In
                </button>
            </form>
        </div>
    );
}

export default UserLoginForm;