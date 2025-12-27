import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCategory: "all",
  selectedProduct: null,
  filters: {
    search: "",
    published: true,
    category: null,
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.filters.category = action.payload === "all" ? null : action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchQuery: (state, action) => {
      state.filters.search = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        published: true,
        category: null,
      };
      state.selectedCategory = "all";
    },
  },
});

export const {
  setSelectedCategory,
  setSelectedProduct,
  clearSelectedProduct,
  setFilters,
  setSearchQuery,
  clearFilters,
} = productSlice.actions;

export default productSlice.reducer;
