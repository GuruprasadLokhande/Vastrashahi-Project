import { apiSlice } from "../api/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (data) => ({
        url: "/api/category/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    getCategories: builder.query({
      query: () => `/api/category/show`,
      providesTags: ["Categories"],
    }),
    getCategoryByType: builder.query({
      query: (type) => `/api/category/show/${type}`,
      providesTags: ["Categories"],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByTypeQuery,
} = categoryApi;
