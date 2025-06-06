import { apiSlice } from "../api/apiSlice";

export const brandApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getActiveBrands: builder.query({
      query: () => `/api/brand/active`,
      providesTags: ["Brands"],
    }),
  }),
});

export const { useGetActiveBrandsQuery } = brandApi;
