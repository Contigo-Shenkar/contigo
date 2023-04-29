import {
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { Formik, useFormikContext } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../header/Header";
import { useAddNewPatientMutation } from "../../features/apiSlice";
import CustomButton from "../customButton/customButton";
import { DIAGNOSES } from "../../data/diagnoses";
import { useState } from "react";

const AddPatientForm = (setOpen) => {
  const [addNewPatient] = useAddNewPatientMutation();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [diagnosis, setDiagnosis] = useState([]);
  const [medication, setMedication] = useState([]);

  const handleDiagnosesChange = (event) => {
    const {
      target: { value },
    } = event;
    setDiagnosis(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleMedicineChange = (event) => {
    const {
      target: { value },
    } = event;
    setMedication(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleFormSubmit = (values, { resetForm, setStatus }) => {
    console.log("handleFormSubmit", handleFormSubmit);
    try {
      console.log(values);
      const meds = medication.map((m) => {
        const [condition, medication] = m.split("$");
        return { condition, medication };
      });
      addNewPatient({ ...values, diagnosis, medication: meds });
      resetForm();
      setStatus({ success: true });
    } catch (error) {
      console.log(error);
      // Handle form submission error here
    }
  };

  const SuccessMessage = () => {
    const { status } = useFormikContext();
    return (
      <div style={{ color: "green" }}>
        {status && status.success && "Form submitted successfully!"}
      </div>
    );
  };

  return (
    <Box m="20px">
      <Header title="Add Patient" subtitle="Add new patient" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullName}
                name="fullName"
                error={!!touched.fullName && !!errors.fullName}
                helperText={touched.fullName && errors.fullName}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id}
                name="id"
                error={!!touched.id && !!errors.id}
                helperText={touched.id && errors.id}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contactNumber}
                name="contactNumber"
                error={!!touched.contactNumber && !!errors.contactNumber}
                helperText={touched.contactNumber && errors.contactNumber}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Image URL"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.imageUrl}
                name="imageUrl"
                error={!!touched.contactNumber && !!errors.contactNumber}
                helperText={touched.contactNumber && errors.contactNumber}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Age"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.age}
                name="age"
                error={!!touched.age && !!errors.age}
                helperText={touched.age && errors.age}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <FormControl fullWidth sx={{ marginTop: "20px" }}>
              <InputLabel id="demo-multiple-name-label">Diagnoses</InputLabel>
              <Select
                fullWidth
                variant="filled"
                labelId="demo-multiple-name-label"
                id="diagnosis"
                multiple
                value={diagnosis}
                onChange={handleDiagnosesChange}
                sx={{ gridColumn: "span 4" }}
                input={<OutlinedInput label="Name" />}
              >
                {Object.keys(DIAGNOSES).map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginTop: "20px" }}>
              <InputLabel id="demo-multiple-name-label">Medications</InputLabel>
              <Select
                fullWidth
                variant="filled"
                labelId="demo-multiple-name-label"
                id="medications"
                multiple
                value={medication}
                disabled={diagnosis.length === 0}
                onChange={handleMedicineChange}
                sx={{ gridColumn: "span 4" }}
                input={<OutlinedInput label="Name" />}
              >
                {Object.entries(DIAGNOSES)
                  .filter(([diagnosisName]) =>
                    diagnosis.includes(diagnosisName)
                  )
                  .flatMap(([diagnosisName, { medications }]) => {
                    console.log({ medication });
                    return medications.map((m, i) => (
                      <MenuItem key={m + i} value={diagnosisName + "$" + m}>
                        {diagnosisName}: {m}
                      </MenuItem>
                    ));
                  })}
              </Select>
            </FormControl>
            <Box display="flex" justifyContent="center" mt="20px">
              <CustomButton type="submit">Create New User</CustomButton>
            </Box>
            <SuccessMessage />
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  fullName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  contactNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  id: yup.string().required("required"),
  age: yup.number().required("required"),
});
const initialValues = {
  fullName: "",
  email: "",
  contactNumber: "",
  id: "",
  age: "",
};

export default AddPatientForm;
