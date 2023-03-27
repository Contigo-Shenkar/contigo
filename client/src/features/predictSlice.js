import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const predictApi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:5000/",
  }),
  endpoints: (builder) => ({
    test: builder.query({
      query: () => "test",
    }),
    predict: builder.mutation({
      query: (predictionInfo) => ({
        url: "predict",
        method: "POST",
        body: predictionInfo,
      }),
    }),
  }),
});

export const { useTestQuery,usePredictMutation } = predictApi;
