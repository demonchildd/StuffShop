import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';
import styles from "../../styles/Cart.module.css";
import { url } from '../../utils/constants';
import { AddItems, SendMail, sumBy } from '../../utils/common';
import { addItemToCart, removeAllCart, removeItemFromCart } from '../../features/user/userSlice';


const Cart = () => {

    const dispatch = useDispatch();
    const { currentUser, cart } = useSelector(({user}) => user)
    const { list } = useSelector(({categories}) => categories);

    const [isVisible, setIsVisible] = useState(false);
    
    const changeQuantity = (item, quantity) => {
        dispatch(addItemToCart({...item, quantity}));
    }

    const [code, setCode] = useState("");

    useEffect(() => {
        if(cart.length)
            AddItems(cart)
        setIsVisible(false);
    }, [cart])

    const removeItem = (item) => {
        dispatch(removeItemFromCart(item));
    }
    const handleBuyClick = async () => {
        try{
            const data = JSON.parse(localStorage.getItem('user'))
            const token = localStorage.getItem('access_token');
            const res = await axios.post(url + '/order/send', {user: data}, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setIsVisible(true);
        
        }
        catch(err) {
            setIsVisible(false);
        }
    };

    const handleConfirmClick = async () => {
        try{
            
            const token = localStorage.getItem('access_token');
            const res = await axios.post(url + '/order/confirm', {code: code, basket: cart, id: currentUser.id}, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setIsVisible(false);
            dispatch(removeAllCart());
        
        }
        catch(err) {
            setIsVisible(true);
        }
    };

    const handleChange = (e) => {
        setCode(e.target.value);
    }
    return (
        <section className={styles.cart}>
            <h2 className={styles.title}>Your cart</h2>

            {!cart.length ? (
                <div className={styles.empty}> Here is empty</div>
            ) : ( 
                <>
                    <div className={styles.list}>
                        {cart.map((item) => {
                            const {title, categoryId, image, price, id, quantity} = item
                            return (
                                <div className={styles.item} key={id}>
                                    <div className={styles.image}
                                    style={{backgroundImage: `url(${url}/${image})`}}/>
                                    <div className={styles.info}>
                                        <div className={styles.name}>{title}</div>
                                        <div className={styles.category}>{list.find((i) => i.id==categoryId).name}</div>
                                    </div>
                                    <div className={styles.price}>{price}BYN</div>
                                    <div className={styles.quantity}>
                                        <div className={styles.minus} onClick={() => changeQuantity(item, Math.max(1, quantity - 1))}>
                                            <svg className="icon">
                                                <use
                                                    xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#minus`}
                                                />
                                            </svg>
                                        </div>

                                        <span>{quantity}</span>

                                        <div className={styles.plus} onClick={() => changeQuantity(item, Math.max(1, quantity + 1))}>
                                            <svg className="icon">
                                                <use
                                                    xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#plus`}
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className={styles.total}>{price * quantity}BYN</div>

                                    <div className={styles.close} onClick={() => removeItem(item)}>
                                        <svg className="icon">
                                            <use
                                                xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#close`}
                                            />
                                        </svg>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className={styles.actions}>
                        <div className={styles.total}>
                            TOTAL PRICE: {" "}
                            <span>
                                {sumBy(cart.map(({ quantity, price }) => quantity * price))}BYN
                            </span>
                        </div>
                        {isVisible && (
                            <div className={styles.group}>
                                <input type="text" value={code} onChange={handleChange} placeholder={"Your code..."}/>
                                
                                <button onClick={handleConfirmClick}>Confirm</button>
                            </div>
                        )}

                        {!isVisible && (
                            <div className={styles.group}>
                                <button className={styles.proceed} onClick={handleBuyClick}>Buy</button>
                            </div>
                            
                        )
                            
                        }
                    </div>
                </>
            )}
        </section>
    );
}

export default Cart;