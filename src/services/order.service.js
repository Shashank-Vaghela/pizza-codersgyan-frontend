import { baseApi } from "./baseApi.service";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Customer endpoints
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders", "Cart"],
    }),

    getUserOrders: builder.query({
      query: () => ({
        url: "/orders/my-orders",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    getOrderById: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "OrderDetails", id }],
    }),

    // Admin endpoints
    getAllOrders: builder.query({
      query: ({ status, paymentStatus, paymentMode } = {}) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (paymentStatus) params.append("paymentStatus", paymentStatus);
        if (paymentMode) params.append("paymentMode", paymentMode);
        return {
          url: `/orders?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Orders"],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Orders",
        { type: "OrderDetails", id },
      ],
    }),

    updatePaymentStatus: builder.mutation({
      query: ({ id, paymentStatus }) => ({
        url: `/orders/${id}/payment-status`,
        method: "PUT",
        body: { paymentStatus },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Orders",
        { type: "OrderDetails", id },
      ],
    }),

    getOrderStats: builder.query({
      query: () => ({
        url: "/orders/stats/overview",
        method: "GET",
      }),
      providesTags: ["AdminDashboard"],
    }),

    getSalesData: builder.query({
      query: () => ({
        url: "/orders/stats/sales",
        method: "GET",
      }),
      providesTags: ["AdminDashboard"],
    }),

    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        "Orders",
        { type: "OrderDetails", id },
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useGetOrderStatsQuery,
  useGetSalesDataQuery,
  useCancelOrderMutation,
} = orderApi;
