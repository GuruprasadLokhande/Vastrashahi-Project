import { apiSlice } from "../../api/apiSlice";

export const couponApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: () => `/api/coupon`,
      providesTags:['Coupons']
    }),
  }),
});

export const { useGetCouponsQuery } = couponApi;
