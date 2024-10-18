import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getOrders, updateUser } from "../../features/user/userSlice";
import axios from "axios";
import styles from "../../styles/Profile.module.css";
import { url } from "../../utils/constants";

const Profile = () => {
    const dispatch = useDispatch();
    const { currentUser, orders } = useSelector(({ user }) => user);


    
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if (!currentUser) return;

        dispatch(getOrders(currentUser.id));
        setValues(currentUser);
        
        
    }, [currentUser]);

    const handleChange = ({ target: { value, name } }) => {
        setValues({ ...values, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const isNotEmpty = Object.values(values).every((val) => val);

        if (!isNotEmpty) return;
        
        dispatch(updateUser(values));
    };

    return (
        <>
            <section className={styles.profile}>
            {!currentUser ? (
                <span>You need to log in</span>
            ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.group}>
                    <input
                    type="email"
                    placeholder="Your email"
                    name="email"
                    value={values.email}
                    autoComplete="off"
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className={styles.group}>
                    <input
                    type="name"
                    placeholder="Your name"
                    name="name"
                    value={values.name}
                    autoComplete="off"
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className={styles.group}>
                    <input
                    type="password"
                    placeholder="Your password"
                    name="password"
                    value={values.password}
                    autoComplete="off"
                    onChange={handleChange}
                    required
                    />
                </div>

                

                <button type="submit" className={styles.submit}>
                    Update
                </button>
                </form>
            )}
            </section>
            

            {currentUser &&
                <section className={styles.cart}>
                

               
                    <div className={styles.list}>
                        {orders.slice().reverse().map((item) => {
                            const {id, total_price, count_product, order_date, confirm} = item
                            return (
                                <div className={styles.item} key={id}>
                                    <div>ID: {id}</div>
                                    <div>Total price: {total_price}</div>
                                    <div>Count product: {count_product}</div>
                                    <div>Date: {order_date}</div>
                                    <div>{confirm}</div> 
                                    
                                
                                </div>
                            )
                        })}
                    </div>
           
                </section>
            }
        </>
    );
};

export default Profile;