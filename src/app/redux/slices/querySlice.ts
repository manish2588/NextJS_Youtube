import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QueryState {
  value: string;
}

const initialState: QueryState = {
  value: "",
};

const querySlice = createSlice({
  name: "query",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    clearQuery: (state) => {
      state.value = "";
    },
  },
});

export const { setQuery, clearQuery } = querySlice.actions;
export default querySlice.reducer;
