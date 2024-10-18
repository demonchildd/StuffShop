import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductQuery } from '../../features/api/apiSlice';
import { ROUTES } from '../../utils/routes';
import Product from './Product';
import Products from './Products';
import { useDispatch, useSelector } from 'react-redux';
import { getRelatedProducts } from '../../features/products/productsSlice';



const SingleProduct = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isFetching, isSuccess } = useGetProductQuery({ id })
    console.log(data);
    const {list, related} = useSelector(({products}) => products)

    useEffect(() => {
        if(!isFetching && !isLoading && !isSuccess)
            navigate(ROUTES.HOME)
    }, [isFetching, isLoading, isSuccess]);

    useEffect(() => {
        
        if(!data || !list.length) 
            return
        
            dispatch(getRelatedProducts(data.categoryId));
        
    }, [data, dispatch, list.length])
    return (
        !data ? (
            <section style={{margin: 'auto'}}>Loading...</section>
        ) :   
        (  
            <>           
                <Product {...data} />
                <Products products={related} amount={5} title="Related products" />
            </>
        )
    );
}

export default SingleProduct;