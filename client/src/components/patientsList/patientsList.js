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
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            backgroundColor: colors.greenAccent[600],
            color:colors.primary[100],
            '&:hover': {
              backgroundColor: colors.greenAccent[800],
            },
          }}
        >
          Add New Patient
        </Button>
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
