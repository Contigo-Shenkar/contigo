import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "../features/apiSlice";
import { firebaseApi } from "../features/firebaseApiSlice";
import { authApi } from "../features/authSlice";
import { predictApi } from "../features/predictSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [firebaseApi.reducerPath]: firebaseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [predictApi.reducerPath]: predictApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      firebaseApi.middleware,
      authApi.middleware,
      predictApi.middleware
    ),
});
setupListeners(store.dispatch);
