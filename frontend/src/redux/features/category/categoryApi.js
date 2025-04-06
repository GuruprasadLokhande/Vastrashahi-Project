import { apiSlice } from "@/redux/api/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get categories
    getCategories: builder.query({
      query: () => ({
        url: "/api/category",
        method: "GET",
      }),
    }),
    // get category by slug
    getCategoryBySlug: builder.query({
      query: (slug) => ({
        url: `/api/category/show/${slug}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryBySlugQuery,
} = categoryApi;