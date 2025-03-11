import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: { query: "", selectedProduct: null },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
  },
});

export const { setQuery, setSelectedProduct } = searchSlice.actions;
export default searchSlice.reducer;
