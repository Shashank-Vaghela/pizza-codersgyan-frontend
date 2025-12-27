import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./services/baseApi.service";
import userSlice from "./slice/user.slice";
import cartSlice from "./slice/cart.slice";
import orderSlice from "./slice/order.slice";
import productSlice from "./slice/product.slice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartSlice,
    order: orderSlice,
    product: productSlice,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);
