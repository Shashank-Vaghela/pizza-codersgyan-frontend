import { baseApi } from "./baseApi.service";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public endpoints
    getPublishedProducts: builder.query({
      query: (category) => ({
        url: `/products/published${category ? `?category=${category}` : ""}`,
        method: "GET",
      }),
      providesTags: ["Products"],
    }),

    // Admin endpoints
    getAllProducts: builder.query({
      query: ({ category, published, search } = {}) => {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (published !== undefined) params.append("published", published);
        if (search) params.append("search", search);
        return {
          url: `/products?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Products"],
    }),

    getProductById: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ProductDetails", id }],
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Products",
        { type: "ProductDetails", id },
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetPublishedProductsQuery,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
