import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import styles from '../../styles/Header.module.css'



import { ROUTES } from '../../utils/routes';


import LOGO from '../../images/logo.svg'
import AVATAR from '../../images/avatar.jpg'
import LOGOUT from '../../images/logout.png'
import ADMIN from '../../images/admin.png'
import CHAT from '../../images/chat.png'
import HOVER_CHAT from '../../images/hover_chat.png'
import HOVER_ADMIN from '../../images/hover_admin.png'
import HOVER_LOGOUT from '../../images/hover_logout.png'
import { logoutUser, toggleForm } from '../../features/user/userSlice';
import { useGetProductsQuery } from '../../features/api/apiSlice';
import { url } from '../../utils/constants';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState("Guest");

    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    
    const [searchValue, setSearchValue] = useState("");

    
    const {currentUser, cart} = useSelector(({ user }) => user) 


    const handleSearch = ({ target : {value} }) => {
        setSearchValue(value);
    }
    

    const { data, isLoading } = useGetProductsQuery({title: searchValue});

    
    const handleClick = () => {
        if(!currentUser)
            dispatch(toggleForm(true));
        else
            navigate(ROUTES.PROFILE);
    }

    const handleLogout = () => {
        if(currentUser)
            dispatch(logoutUser(currentUser));
              
    }

           


    useEffect(() => {
        if (!currentUser) {
            setName("Guest");
            setIsAdmin(false);
            setIsAuth(false);
        } 
        else {
            
            setName(currentUser.name);
            setIsAuth(true);
            if(currentUser.role == "Admin")
                setIsAdmin(true);
            else
                setIsAdmin(false);
        }
    }, [currentUser])

    


    
    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <Link to ={ROUTES.HOME}>
                    <img src={LOGO} alt="Sport"/>
                </Link>
            </div>
            <div className={styles.info}>
                <div className={styles.user} onClick={handleClick}>
                    <div className={styles.avatar}
                    style={{backgroundImage: `url(${AVATAR})`}}/>
                    <div className={styles.username}>{name}</div>
                </div>


                <form className={styles.form}>
                    <div className={styles.icon}>
                        <svg className="icon">
                            <use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#search`}/>
                        </svg>
                    </div>
                    <div className={styles.input}>
                        <input type="search" name="search"
                        placeholder="Search for anyting..."
                        autoComplete="off"
                        onChange={handleSearch}
                        value={searchValue}
                        />
                    </div>
                    {searchValue && (
                        <div className={styles.box}>
                            {isLoading ? 'Loading' : !data.length ? 'No results' :
                                data.map(({ title, image, id }) => {
                                    return (
                                    <Link
                                        key={id}
                                        onClick={() => setSearchValue("")}
                                        className={styles.item}
                                        to={`/products/${id}`}
                                    >
                                        <div
                                        className={styles.image}
                                        style={{ backgroundImage: `url(${url}/${image})` }}
                                        />
                                        <div className={styles.title}>{title}</div>
                                    </Link>
                                    );
                                })}
                        </div>
                    )}
                </form>

                <div className={styles.account}>
                    <Link to={ROUTES.CART} className={styles.cart}>
                        <svg className={styles["icon-cart"]}>
                            <use xlinkHref={`${process.env.PUBLIC_URL}/sprite.svg#bag`}/>
                        </svg>
                        { !!cart.length && 
                        (
                            <span className={styles.count}>
                                {cart.length}
                            </span>
                        )}
                        
                    </Link>

                    {isAuth &&
                    <Link to={ROUTES.CHAT} className={styles.cart}>
                        <div className={styles.icons}
                        style={{backgroundImage: `url(${CHAT})`}}
                        onMouseEnter={(event) => {
                            event.target.style.backgroundImage = `url(${HOVER_CHAT})`;
                        }}
                        onMouseLeave={(event) => {
                            event.target.style.backgroundImage = `url(${CHAT})`;
                        }}/>
                    </Link>}

                    {isAdmin && 
                    <Link to={ROUTES.ADMIN} className={styles.cart}>
                        <div className={styles.icons}
                        style={{backgroundImage: `url(${ADMIN})`}}
                        onMouseEnter={(event) => {
                            event.target.style.backgroundImage = `url(${HOVER_ADMIN})`;
                        }}
                        onMouseLeave={(event) => {
                            event.target.style.backgroundImage = `url(${ADMIN})`;
                        }}/>
                    </Link>}

                    <Link className={styles.cart}>
                        <div className={styles.icons} onClick={handleLogout}
                        style={{backgroundImage: `url(${LOGOUT})`}}
                        onMouseEnter={(event) => {
                            event.target.style.backgroundImage = `url(${HOVER_LOGOUT})`;
                        }}
                        onMouseLeave={(event) => {
                            event.target.style.backgroundImage = `url(${LOGOUT})`;
                        }}/>
                    </Link>


                </div>

            </div>
        </div>
    );
}

export default Header;