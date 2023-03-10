import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "patientsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/",
  }),
  tagTypes: ["patients"],
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: () => "api/patients",
      providesTags: ["patients"],
    }),
    addNewPatient: builder.mutation({
      query: (patient) => ({
        url: "api/patients",
        method: "POST",
        body: patient,
      }),
      invalidatesTags: ["patients"],
    }),
    updatePatient: builder.mutation({
      query: (patient) => ({
        // url: `api/patients/${patient.id}`,
        url: `api/patients/63ab62da213b56abda1c5890`,
        method: "PATCH",
        body: patient,
      }),
      invalidatesTags: ["patients"],
    }),
    deletePatient: builder.mutation({
      query: ({ id }) => ({
        url: `api/patients/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["patients"],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useAddNewPatientMutation,
  useDeletePatientMutation,
  useUpdatePatientMutation,
} = apiSlice;
