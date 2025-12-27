import { createSlice } from "@reduxjs/toolkit";
import { cartApi } from "../services/cart.service";

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  appliedPromo: null,
  promoDiscount: 0,
};

const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const itemPrice = item.customization?.totalPrice || 0;
    return sum + itemPrice * item.quantity;
  }, 0);
  return { totalItems, totalPrice };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    applyPromo: (state, action) => {
      state.appliedPromo = action.payload.promo;
      state.promoDiscount = action.payload.discount;
    },
    removePromo: (state) => {
      state.appliedPromo = null;
      state.promoDiscount = 0;
    },
    clearCartState: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.appliedPromo = null;
      state.promoDiscount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get cart
      .addMatcher(
        cartApi.endpoints.getCart.matchFulfilled,
        (state, action) => {
          const items = action.payload.data?.items || [];
          state.items = items;
          const { totalItems, totalPrice } = calculateTotals(items);
          state.totalItems = totalItems;
          state.totalPrice = totalPrice;
        }
      )
      // Add to cart
      .addMatcher(
        cartApi.endpoints.addToCart.matchFulfilled,
        (state, action) => {
          const items = action.payload.data?.items || [];
          state.items = items;
          const { totalItems, totalPrice } = calculateTotals(items);
          state.totalItems = totalItems;
          state.totalPrice = totalPrice;
        }
      )
      // Update cart item
      .addMatcher(
        cartApi.endpoints.updateCartItem.matchFulfilled,
        (state, action) => {
          const items = action.payload.data?.items || [];
          state.items = items;
          const { totalItems, totalPrice } = calculateTotals(items);
          state.totalItems = totalItems;
          state.totalPrice = totalPrice;
        }
      )
      // Remove from cart
      .addMatcher(
        cartApi.endpoints.removeFromCart.matchFulfilled,
        (state, action) => {
          const items = action.payload.data?.items || [];
          state.items = items;
          const { totalItems, totalPrice } = calculateTotals(items);
          state.totalItems = totalItems;
          state.totalPrice = totalPrice;
        }
      )
      // Clear cart
      .addMatcher(
        cartApi.endpoints.clearCart.matchFulfilled,
        (state) => {
          state.items = [];
          state.totalItems = 0;
          state.totalPrice = 0;
          state.appliedPromo = null;
          state.promoDiscount = 0;
        }
      );
  },
});

export const { applyPromo, removePromo, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
