import React, { useState } from "react";
import { useGetPatientsQuery } from "../../features/apiSlice";
import Patient from "../patient/patient.component";
import { tokens } from "../../theme";
import {
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  useTheme,
} from "@mui/material";
import AddPatientForm from "../addPatientForm/addPatientForm";
import CustomButton from "../customButton/customButton";

const PatientsList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { data: patients, isLoading, isError } = useGetPatientsQuery();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching tasks</div>;
  }

  return (
    <Container fixed>
      <Box display="flex" justifyContent="flex-end" marginBottom="16px">
        <CustomButton onClick={handleOpen}>Add New Patient</CustomButton>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent sx={{ minWidth: "400px" }}>
          <AddPatientForm />
        </DialogContent>
      </Dialog>
      {patients.data.map((patient, index) => (
        <Patient key={index} patient={patient} />
      ))}
    </Container>
  );
};

export default PatientsList;
