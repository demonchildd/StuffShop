import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { buildUrl } from "../../utils/common";
import { url } from "../../utils/constants";

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({baseUrl: url + '/product'}),
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        getProduct: builder.query({
            query: ({ id }) => `/productById/${id}`,
            providesTags: ["Product"]
        }),
        getProducts: builder.query({
            query: (params ) => buildUrl("/search", params),
            providesTags: ["Products"]
        }),
    })
})


export const { useGetProductQuery, useGetProductsQuery } = apiSlice