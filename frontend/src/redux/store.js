import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import ratingsReducer from "../features/ratings/RatingsSlice";

export const store = configureStore({
  reducer: rootReducer,
  ratings: ratingsReducer,
});
