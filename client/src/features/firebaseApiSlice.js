import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const firebaseApi = createApi({
  reducerPath: "firebaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://smart-bag-1c8c4-default-rtdb.firebaseio.com/",
  }),
  tagTypes: ["firebaseApi"],
  endpoints: (builder) => ({
    getBag: builder.query({
      query: () => "bags/b01/.json",
      providesTags: ["firebaseApi"],
    }),
    updateBag: builder.mutation({
      query: ({ tokens, currTokens }) => ({
        url: `bags/b01/.json`,
        method: "PATCH",
        body: {
          tokens: tokens + currTokens,
        },
      }),
      invalidatesTags: ["firebaseApi"],
    }),
  }),
});

export const { useGetBagQuery, useUpdateBagMutation } = firebaseApi;
