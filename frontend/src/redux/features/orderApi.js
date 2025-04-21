import { apiSlice } from "../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/order/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),
    getOrder: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: ["Orders"],
    }),
    getUserOrders: builder.query({
      query: () => `/order/my-orders`,
      providesTags: ["Orders"],
    }),
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/order/cancel-order/${orderId}`,
        method: "PUT",
        body: { status: "Cancelled" }
      }),
      invalidatesTags: ["Orders"],
    }),
    returnOrder: builder.mutation({
      query: (data) => ({
        url: `/order/return-order/${data.orderId}`,
        method: "PUT",
        body: { 
          status: "Return Requested",
          returnReason: data.reason 
        }
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderQuery,
  useGetUserOrdersQuery,
  useCancelOrderMutation,
  useReturnOrderMutation,
} = orderApi; 