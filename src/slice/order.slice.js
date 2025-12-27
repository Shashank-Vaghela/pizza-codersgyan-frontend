import { createSlice } from "@reduxjs/toolkit";
import { orderApi } from "../services/order.service";

const initialState = {
  currentOrder: null,
  trackingOrder: null,
  orderHistory: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setTrackingOrder: (state, action) => {
      state.trackingOrder = action.payload;
    },
    clearTrackingOrder: (state) => {
      state.trackingOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addMatcher(
        orderApi.endpoints.createOrder.matchFulfilled,
        (state, action) => {
          state.currentOrder = action.payload.data;
        }
      )
      // Get user orders
      .addMatcher(
        orderApi.endpoints.getUserOrders.matchFulfilled,
        (state, action) => {
          state.orderHistory = action.payload.data || [];
        }
      )
      // Get order by ID
      .addMatcher(
        orderApi.endpoints.getOrderById.matchFulfilled,
        (state, action) => {
          state.trackingOrder = action.payload.data;
        }
      );
  },
});

export const {
  setCurrentOrder,
  clearCurrentOrder,
  setTrackingOrder,
  clearTrackingOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
