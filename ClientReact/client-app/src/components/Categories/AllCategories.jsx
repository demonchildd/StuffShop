import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../../features/api/apiSlice';

import Poster from '../Poster/Poster';
import styles from "../../styles/Category.module.css"
import Products from '../Products/Products';
import { useSelector } from 'react-redux';

const AllCategories = () => {

    
    const { list } = useSelector(({ categories }) => categories);

    const defaultValues = {
        title: "",
        price_min: 0,
        price_max: 0,
       
    }

    const defaultParams = {
        limit: 5,
        offset: 0,
        ...defaultValues
    }


    const [isEnd, setEnd] = useState(false);
    const [items, setItems] = useState([]);
    
    const [values, setValues] = useState(defaultValues);
    const [params, setParams] = useState(defaultParams);

    const {data = [], isLoading, isSuccess} = useGetProductsQuery(params)

    


    useEffect(() => {
        if (isLoading) return;
        
        if(!data.length) return setEnd(true);
    
        setItems((_items) => [..._items, ...data]);
      }, [data, isLoading]);

    
    

    const handleSubmit = (e) => {
        e.preventDefault();

        setItems([]);
        setEnd(false);
        setParams({...defaultParams, ...values});
    }

    

    const handleReset = () => {
        setValues(defaultValues);
        setParams(defaultParams);
        setEnd(false);
    }
    const handleChange = ({ target: { value, name } }) => {
        setValues({ ...values, [name]: value });
    };
    
    return (
        <>
            <Poster />
            <section className={styles.wrapper}>
            <h2 className={styles.title}>All</h2>
            <form className={styles.filters} onSubmit={handleSubmit}>
                <div className={styles.filter}>
                <input
                    type="text"
                    name="title"
                    onChange={handleChange}
                    placeholder="Product name"
                    value={values.title}
                />
                </div>
                <div className={styles.filter}>
                <input
                    type="number"
                    name="price_min"
                    onChange={handleChange}
                    placeholder="0"
                    value={values.price_min}
                />
                <span>Price from</span>
                </div>
                <div className={styles.filter}>
                <input
                    type="number"
                    name="price_max"
                    onChange={handleChange}
                    placeholder="0"
                    value={values.price_max}
                />
                <span>Price to</span>
                </div>

                <button type="submit" hidden />
            </form>

            {isLoading ? (
                <div className="preloader">Loading...</div>
            ) : !isSuccess || !items.length ? (
                <div className={styles.back}>
                <span>No results</span>
                <button onClick={handleReset}>Reset</button>
                </div>
            ) : (
                <Products
                title=""
                products={items}
                style={{ padding: 0 }}
                amount={items.length}
                />
            )}

            {!isEnd && (
                <div className={styles.more} style={ {margin: '32px 0 0 0 '} }>
                <button
                    onClick={() =>
                    setParams({ ...params, offset: params.offset + params.limit })
                    }
                >
                    See more
                </button>
                </div>
            )}
        </section>
        </>
    );
}

export default AllCategories;