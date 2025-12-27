import { baseApi } from "./baseApi.service";

export const promoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Customer endpoints
    validatePromo: builder.mutation({
      query: ({ code, orderAmount }) => ({
        url: "/promos/validate",
        method: "POST",
        body: { code, orderAmount },
      }),
    }),

    // Admin endpoints
    getAllPromos: builder.query({
      query: ({ active, discountType } = {}) => {
        const params = new URLSearchParams();
        if (active !== undefined) params.append("active", active);
        if (discountType) params.append("discountType", discountType);
        return {
          url: `/promos?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Promos"],
    }),

    getPromoById: builder.query({
      query: (id) => ({
        url: `/promos/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "PromoDetails", id }],
    }),

    createPromo: builder.mutation({
      query: (promoData) => ({
        url: "/promos",
        method: "POST",
        body: promoData,
      }),
      invalidatesTags: ["Promos"],
    }),

    updatePromo: builder.mutation({
      query: ({ id, ...promoData }) => ({
        url: `/promos/${id}`,
        method: "PUT",
        body: promoData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Promos",
        { type: "PromoDetails", id },
      ],
    }),

    deletePromo: builder.mutation({
      query: (id) => ({
        url: `/promos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Promos"],
    }),
  }),
});

export const {
  useValidatePromoMutation,
  useGetAllPromosQuery,
  useGetPromoByIdQuery,
  useCreatePromoMutation,
  useUpdatePromoMutation,
  useDeletePromoMutation,
} = promoApi;
