import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { shuffle } from "../../utils/common";
import { url } from "../../utils/constants";




export const createProduct = createAsyncThunk(
    "products/createProduct",
    async (payload, thunkAPI) => {
        try{
            const formData = new FormData();
            formData.append('title', payload.title);
            formData.append('description', payload.description);
            formData.append('price', payload.price);
            formData.append('categoryId', payload.categoryId);
            formData.append('image', payload.file);
            const { data } = await axios.post(url + '/product/addProduct', formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`

                }
            });
            return data;
            
            
        }
        catch(err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err);
        }
    }
        
)

export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async (payload, thunkAPI) => {
        try{
            const formData = new FormData();
            formData.append('title', payload.title);
            formData.append('oldTitle', payload.oldTitle);
            formData.append('description', payload.description);
            formData.append('price', payload.price);
            formData.append('categoryId', payload.categoryId);
            formData.append('image', payload.file);
            const { data } = await axios.put(url + '/product/updateProduct', formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`

                }
            });
            return data;
            
            
        }
        catch(err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err);
        }
    }
        
)

export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (payload, thunkAPI) => {
        try{
            const { data } = await axios.delete(url + `/product/deleteProduct/${payload.id}`,{
                headers: {
                    
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`

                }
            });
            return data;
            
            
        }
        catch(err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err);
        }
    }
        
)

export const getProducts = createAsyncThunk(
    "products/getProducts",
    async (_, thunkAPI) => {
        try{
            const res = await axios(url + '/product/all');
            
            return res.data;
        }
        catch(err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err);
        }
    }
        
)

const productsSlice = createSlice({
    name: "products",
    initialState: {
        list: [],
        filtered: [],
        related: [],
        isLoading: false,
    },
    reducers: {
        filterByPrice: ( state, { payload }) => {
            state.filtered = state.list.filter(({ price }) => price < payload)
        },
        getRelatedProducts: ( state, { payload }) => {
            const list = state.list.filter(({ categories: { id } }) => id === payload);
            state.related = shuffle(list);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getProducts.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.list = action.payload;
            state.isLoading = false;
        });
        builder.addCase(getProducts.rejected, (state) => {
            state.isLoading = false;
        })

        builder.addCase(createProduct.fulfilled, (state, action) => {
            state.list = action.payload;
            state.isLoading = false;
        });
        builder.addCase(updateProduct.fulfilled, (state, action) => {
            state.list = action.payload;
            state.isLoading = false;
        });
        builder.addCase(deleteProduct.fulfilled, (state, action) => {
            state.list = action.payload;
            state.isLoading = false;
        });
    }

});

export const {filterByPrice, getRelatedProducts } = productsSlice.actions;

export default productsSlice.reducer;