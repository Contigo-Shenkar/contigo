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
    addNewPatientTask: builder.mutation({
      query: ({ task, type, id }) => ({
        url: `api/patients/${id}/tasks`,
        method: "POST",
        body: { task: task, type: type },
      }),
      invalidatesTags: ["patients"],
    }),
    getPatientById: builder.query({
      query: ({ id }) => ({
        url: `api/patients/${id}`,
        method: "GET",
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
    updateTaskStatus: builder.mutation({
      query: ({ patientId, taskId, status }) => ({
        url: `api/patients/${patientId}/tasks/${taskId}`,
        method: "PATCH",
        body: { status },
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
    getTasksByPatientId: builder.query({
      query: ({ id }) => `api/patients/${id}/tasks`,
      invalidatesTags: ["patients"],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useAddNewPatientMutation,
  useAddNewPatientTaskMutation,
  useDeletePatientMutation,
  useUpdatePatientMutation,
  useUpdateTaskStatusMutation,
  useGetTasksByPatientIdQuery,
  useGetPatientByIdQuery,
} = apiSlice;
