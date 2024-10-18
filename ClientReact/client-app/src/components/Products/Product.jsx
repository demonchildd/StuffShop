import React, { useEffect } from 'react';

import styles from "../../styles/Product.module.css"
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, toggleForm } from '../../features/user/userSlice';
import { url } from '../../utils/constants';
import axios from "axios";
import { AddItems } from '../../utils/common';


const Product = (item) => {
    const { title, image, price, description } = item
    const dispatch = useDispatch();
    
    const {currentUser, cart} = useSelector(({ user }) => user) 
 
    
    
    
    const addToCart = async (cart) => {
        dispatch(addItemToCart(item));

        
    }

    useEffect(() => {
        if(cart.length)
            AddItems(cart)
    }, [cart])

    const handleClick = () => {
        if(!currentUser)
            dispatch(toggleForm(true));
        else {
            addToCart();
        }
            
    }

    
    return (
        <section className={styles.product}>
            <div className={styles.images}>
                <div 
                className={styles.current}
                style={{backgroundImage: `url(${url}/${image})`}}
                />
            </div>
            <div className={styles.info}>
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.price}>
                    {price}BYN
                </div>
                <p className={styles.description}>
                    {description}
                </p>
                <div className={styles.actions}>
                    <button onClick={handleClick} className={styles.add}>Add to cart</button>
                </div>
            </div>
        </section>
        
    );
}

export default Product;