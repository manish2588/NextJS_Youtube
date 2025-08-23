import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  activeCategory: string; // store categoryId
}

const initialState: CategoryState = {
  activeCategory: "all", // default All
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload;
    },
  },
});

export const { setCategory } = categorySlice.actions;
export default categorySlice.reducer;
