import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { url } from "../../utils/constants";




export const createUser = createAsyncThunk(
    "user/createUser",
    async (payload, thunkAPI) => {
        try{
            
            const res = await axios.post(url +'/auth/register', payload);
            localStorage.setItem('user', JSON.stringify(payload));
            localStorage.setItem('isAuth', true);
            localStorage.setItem('access_token', res.data.access_token);
            localStorage.setItem('refresh_token', res.data.refresh_token);
            const login = await axios(url + '/users/profile', {
                headers: {
                    "Authorization": `Bearer ${res.data.access_token}`
                }
            });
            return login.data;;
        }
        catch(err) {
            console.log(err);
            alert(err);
            return thunkAPI.rejectWithValue(err);
        }
    }
        
)

export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    async (payload, thunkAPI) => {
        try{
            
            const res = await axios.post(url + '/auth/logout', payload);

            localStorage.setItem('user', null);
            localStorage.setItem('isAuth', false);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('basket');
            return null;
        }
        catch(err) {
            console.log(err);
            alert(err);
            return thunkAPI.rejectWithValue(err);
        }
    }
        
)

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (payload, thunkAPI) => {
        try{
            const res = await axios.post(url + '/auth/login', payload);
           
            const login = await axios(url + '/users/profile', {
                headers: {
                    "Authorization": `Bearer ${res.data.access_token}`
                }
            });
            const basket = await axios(url + `/basket/basketById/${login.data.id}`, {
                headers: {
                    "Authorization": `Bearer ${res.data.access_token}`
                }
            });

            let newCart = []
            basket.data.forEach(element => {
                const item = {...element.products, quantity: element.quantity};
                newCart.push(item)
            });

            localStorage.setItem('user', JSON.stringify(login.data));
            localStorage.setItem('isAuth', true);
            localStorage.setItem('access_token', res.data.access_token);
            localStorage.setItem('refresh_token', res.data.refresh_token);
            return {user: login.data, cart: newCart};
        }
        catch(err) {
            alert(err);
            return thunkAPI.rejectWithValue(err);
        }
    }
        
)


export const updateUser = createAsyncThunk(
    "user/updateUser",
    async (payload, thunkAPI) => {
        try{
            const token = localStorage.getItem('access_token');
            
            const res = await axios(url + '/users/profile', {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            return res.data;
        }
        catch(err) {
            alert(err);
            return thunkAPI.rejectWithValue(err);
        }
    }
        
)

export const setBasket = createAsyncThunk(
    "basket/setBasket",
    async (payload, thunkAPI) => {
        try{
           
            const token = localStorage.getItem('access_token');
            
            const res = await axios(url + `/basket/basketById/${payload.id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            let newCart = []
            res.data.forEach(element => {
                const item = {...element.products, quantity: element.quantity};
                newCart.push(item)
            });
            return newCart;
        }
        catch(err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
        
)

export const getOrders = createAsyncThunk(
    "orders/gerOrders",
    async (payload, thunkAPI) => {
        try{
           
            const token = localStorage.getItem('access_token');
            const {data} = await axios(url + `/order/orderById/${payload}`, {
                headers: {
                        "Authorization": `Bearer ${token}`
                    }
            });
            
            
            return data;
        }
        catch(err) {
            
            return thunkAPI.rejectWithValue(err);
        }
    }
        
)

export const refreshTokens = createAsyncThunk(
    "tokens/refreshTokens",
    async (payload, thunkAPI) => {
        try{
           
            const token = localStorage.getItem('refresh_token');
            const {data} = await axios.post(url + '/auth/refresh',{payload, token}, {
                headers: {
                        "Authorization": `Bearer ${token}`
                    }
            });   
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token); 
            return data;
        }
        catch(err) {
            
            return thunkAPI.rejectWithValue(err);
        }
    }
        
)


const addCurrentUser = (state, {payload}) => {
    state.currentUser = payload;

   
}

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        cart: [],
        orders: [],
        isLoading: false,
        formType: "signup", 
        showForm: false,
        isToken: true,
        isRefresh: true,
    },
    reducers: {
        addItemToCart: (state, { payload } ) => {
            let newCart = [...state.cart];
            const found = state.cart.find(({id}) => id ===payload.id)
            if(found){
                newCart = newCart.map((item) => {
                    return item.id === payload.id ? {...item, quantity: payload.quantity || item.quantity + 1 } : item
                })
            }
            else
                newCart.push({...payload, quantity: 1})
            localStorage.setItem('basket', JSON.stringify(newCart));
            state.cart = newCart;
        },
        removeItemFromCart: ( state, {payload}) => {
            localStorage.setItem('basket', JSON.stringify(state.cart.filter(({id}) => id != payload.id)));
            state.cart = state.cart.filter(({id}) => id != payload.id);
        },
        removeAllCart: ( state, {payload}) => {
            localStorage.removeItem('basket');
            state.cart = [];
        },
        toggleForm: (state, {payload}) => {
            state.showForm = payload;
            
        },
        toggleFormType: (state, {payload}) => {
            state.formType = payload;
        },
        setInfo: (state, {payload}) => {
            state.currentUser = payload;
        },

        
    },
    extraReducers: (builder) => {
    //     builder.addCase(getCategories.pending, (state) => {
    //         state.isLoading = true;
    //     })
        builder.addCase(createUser.fulfilled, addCurrentUser);
        builder.addCase(loginUser.fulfilled,(state, {payload}) => {
            state.currentUser = payload.user;
            state.cart = payload.cart;
            
           
        });
        builder.addCase(updateUser.fulfilled, (state, {payload}) => {
            state.currentUser = payload;
            
           
        });
        builder.addCase(logoutUser.fulfilled, (state, {payload}) => {
            state.currentUser = payload;
            state.cart = [];
            state.isRefresh = true;
           
        });
        builder.addCase(setBasket.fulfilled, (state, {payload}) => {
            state.cart = payload;
           
        });
        builder.addCase(getOrders.fulfilled, (state, {payload}) => {
            state.orders = payload;
           
        });

        builder.addCase(setBasket.rejected, (state, {payload}) => {
            state.isToken = false;
            
           
        });

        builder.addCase(getOrders.rejected, (state, {payload}) => {
            state.isToken = false;
            
           
        });

        builder.addCase(refreshTokens.fulfilled, (state, {payload}) => {
            state.isToken = true;
            
           
        });

        builder.addCase(refreshTokens.rejected, (state, {payload}) => {
            state.isRefresh = false;
            
           
        });


        

    //     builder.addCase(getCategories.rejected, (state) => {
    //         state.isLoading = false;
    //     })
    }

});

export const {addItemToCart, toggleForm, toggleFormType, setInfo, removeItemFromCart, removeAllCart} = userSlice.actions;

export default userSlice.reducer;