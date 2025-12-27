import { baseApi } from "./baseApi.service";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (orderId) => ({
        url: "/payment/create-checkout-session",
        method: "POST",
        body: { orderId },
      }),
    }),

    verifyPayment: builder.mutation({
      query: ({ sessionId, orderId }) => ({
        url: "/payment/verify-payment",
        method: "POST",
        body: { sessionId, orderId },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useVerifyPaymentMutation,
} = paymentApi;
