import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { url } from "../../utils/constants";

export const getCategories = createAsyncThunk(
    "categories/getCategories",
    async (_, thunkAPI) => {
        try{
            const res = await axios(url + '/category/all');
            return res.data;
        }
        catch(err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err);
        }
    }
        
)

const categoriesSlice = createSlice({
    name: "categories",
    initialState: {
        list: [],
        isLoading: false,
    },
    extraReducers: (builder) => {
        builder.addCase(getCategories.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.list = action.payload;
            state.isLoading = false;
        });
        builder.addCase(getCategories.rejected, (state) => {
            state.isLoading = false;
        })
    }

});


export default categoriesSlice.reducer;