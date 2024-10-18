import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppRoutes from "../Routes/Routes";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Sidebar from "../Sidebar/Sidebar";

import { getCategories } from "../../features/categories/categoriesSlice";
import { getProducts } from "../../features/products/productsSlice";
import UserForm from "../User/UserForm";
import { logoutUser, refreshTokens, setBasket, setInfo } from "../../features/user/userSlice";

const App = () => {

    const dispatch = useDispatch();
    const isAuth = localStorage.getItem('isAuth');
    

    const {isToken, isRefresh} = useSelector(({user}) => user);
    const data = JSON.parse(localStorage.getItem('user'));
    console.log(isToken);
    useEffect(() => {
        if(isAuth){
            console.log(data);
            if(data) {
                
                dispatch(setBasket(data))

            }
            dispatch(setInfo(data));
            
        }
        
        dispatch(getCategories());
        dispatch(getProducts());
        
    }, [dispatch])

    useEffect(() => {
        if(!isToken)
            dispatch(refreshTokens());
        
    }, [isToken])


    useEffect(() => {
        if(!isRefresh)
            dispatch(logoutUser(data));
        
    }, [isRefresh])


    

    return (
        <div className="App">
            <Header />
            <UserForm/>
            <div className="container">
                <Sidebar />
                <AppRoutes />
            </div>
            
            <Footer />
        </div>
    )
}

export default App