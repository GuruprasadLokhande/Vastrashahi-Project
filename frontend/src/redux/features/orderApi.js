import { apiSlice } from "../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/api/order/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),
    getOrder: builder.query({
      query: (id) => `/api/order/${id}`,
      providesTags: ["Orders"],
    }),
    getUserOrders: builder.query({
      query: () => `/api/order/my-orders`,
      providesTags: ["Orders"],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/api/order/update-status/${id}`,
        method: "PATCH",
        body: { status: "cancelled" }
      }),
      invalidatesTags: ["Orders"],
    }),
    returnOrder: builder.mutation({
      query: (data) => ({
        url: `/api/order/update-status/${data.orderId}`,
        method: "PATCH",
        body: { 
          status: "Return Requested"
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