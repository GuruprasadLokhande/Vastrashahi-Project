import { apiSlice } from "@/redux/api/apiSlice";

export const productApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get products
    getProducts: builder.query({
      query: (query) => ({
        url: `/api/product${query}`,
        method: "GET",
      }),
      providesTags: ["Products"],
    }),
    // get single product
    getProduct: builder.query({
      query: (id) => ({
        url: `/api/product/${id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    // get related products
    getRelatedProducts: builder.query({
      query: ({ id, category }) => ({
        url: `/api/product/related/${id}?category=${category}`,
        method: "GET",
      }),
      providesTags: ["RelatedProducts"],
    }),
    // get product by type
    getProductByType: builder.query({
      query: (type) => ({
        url: `/api/product/type/${type}`,
        method: "GET",
      }),
      providesTags: ["ProductType"],
    }),
    // get offer products
    getOfferProducts: builder.query({
      query: () => ({
        url: "/api/product/offer",
        method: "GET",
      }),
      providesTags: ["OfferProducts"],
    }),
    // get popular products
    getPopularProducts: builder.query({
      query: () => ({
        url: "/api/product/popular",
        method: "GET",
      }),
      providesTags: ["PopularProducts"],
    }),
    // get top rated products
    getTopRatedProducts: builder.query({
      query: () => ({
        url: "/api/product/top-rated",
        method: "GET",
      }),
      providesTags: ["TopRatedProducts"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetRelatedProductsQuery,
  useGetProductByTypeQuery,
  useGetOfferProductsQuery,
  useGetPopularProductsQuery,
  useGetTopRatedProductsQuery,
} = productApi; 