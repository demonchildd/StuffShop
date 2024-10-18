import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from '../Home/Home';

import { ROUTES } from '../../utils/routes';
import SingleProduct from '../Products/SingleProduct';
import Profile from '../Profile/Profile';
import AllCategories from '../Categories/AllCategories';
import SingleCategory from '../Categories/SingleCategory';
import Admin from '../Admin/Admin';
import { useSelector } from 'react-redux';
import Cart from '../Cart/Cart';
import Chat from '../Chat/Chat';

const AppRoutes = () => {
    
    const [isAdmin, setIsAdmin] = useState(false);
    
    const {currentUser} = useSelector(({ user }) => user) 

    useEffect(() => {
        if (!currentUser) {
            setIsAdmin(false);
        } 
        else {
            if(currentUser.role == "Admin")
                setIsAdmin(true);
            else
                setIsAdmin(false);
        }
    }, [currentUser])

    return (
        <Routes>
            <Route index element={<Home />}/>
            <Route path={ROUTES.PRODUCT} element={<SingleProduct />}/>
            <Route path={ROUTES.PROFILE} element={<Profile/>}/>
            <Route path={ROUTES.CATEGORY} element={<SingleCategory />}/>
            <Route path={ROUTES.PRODUCTS} element={<AllCategories />}/>
            <Route path={ROUTES.CART} element={<Cart />}/>
            <Route path={ROUTES.CHAT} element={<Chat />}/>
            {isAdmin && 
            (
                <Route path={ROUTES.ADMIN} element={<Admin />} />
            )}
        </Routes>
            
    );
}

export default AppRoutes;