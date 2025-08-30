import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/AuthSlice";
import storesReducer from "../features/stores/StoresSlice";
import ratingsReducer from "../features/ratings/RatingsSlice";

export default combineReducers({
  auth: authReducer,
  stores: storesReducer,
  ratings: ratingsReducer,
});
