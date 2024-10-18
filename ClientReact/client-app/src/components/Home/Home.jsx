import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Poster from '../Poster/Poster';
import Products from '../Products/Products';
import styles from "../../styles/Category.module.css"

import { filterByPrice } from '../../features/products/productsSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/routes';

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products: {list, filtered} } = useSelector(( state ) => state);


    const handleClick = () => {
        navigate(ROUTES.PRODUCTS);
    }
    useEffect(() => {
        if(!list.length)
            return;
        dispatch(filterByPrice(1000))
    }, [dispatch, list.length])
    return (
        <>
        <Poster />
        <Products products={list} amount={5} title="Trending"/>
        <div className={styles.more}>
                <button
                    onClick={handleClick}
                >
                    See more
                </button>
        </div>
        <Products products={filtered} amount={5} title="Less then 1000BYN"/>
        </>
    );
}

export default Home;