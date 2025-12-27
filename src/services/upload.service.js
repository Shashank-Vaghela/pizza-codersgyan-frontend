import { baseApi } from "./baseApi.service";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (imageData) => ({
        url: "/upload",
        method: "POST",
        body: { image: imageData },
      }),
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
