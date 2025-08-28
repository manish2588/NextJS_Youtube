import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "./slices/layoutSlice";
import categoryReducer from "./slices/categorySlice";
import queryReducer from "./slices/querySlice"; 
export const store = configureStore({
  reducer: {
    layout: layoutReducer,
    category: categoryReducer,
    query: queryReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
