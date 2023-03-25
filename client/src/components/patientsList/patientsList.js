import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { useGetPatientsQuery } from "../../features/apiSlice";
import Patient from "../patient/patient.component";
import { useAddNewPatientMutation } from "../../features/apiSlice";
const PatientsList = () => {
  const { data: patients, isLoading, isError } = useGetPatientsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching tasks</div>;
  }
  console.log(patients.data);
  return (
    <div>
      {patients.data.map((patient, index) => (
        <Patient key={index} patient={patient} />
      ))}
    </div>
  );
};

export default PatientsList;
