import { Box, Button, TextField } from "@mui/material";
import { Formik, useFormikContext } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../header/Header";
import { useAddNewPatientMutation } from "../../features/apiSlice";
const AddPatientForm = (setOpen) => {
  const [addNewPatient] = useAddNewPatientMutation();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values, { resetForm, setStatus }) => {
    try {
      console.log(values);
      addNewPatient(values);
      resetForm();
      setStatus({ success: true });
    } catch (error) {
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
              {/*<TextField*/}
              {/*  fullWidth*/}
              {/*  variant="filled"*/}
              {/*  type="text"*/}
              {/*  label="Address 1"*/}
              {/*  onBlur={handleBlur}*/}
              {/*  onChange={handleChange}*/}
              {/*  value={values.address1}*/}
              {/*  name="address1"*/}
              {/*  error={!!touched.address1 && !!errors.address1}*/}
              {/*  helperText={touched.address1 && errors.address1}*/}
              {/*  sx={{ gridColumn: "span 4" }}*/}
              {/*/>*/}
              {/*<TextField*/}
              {/*  fullWidth*/}
              {/*  variant="filled"*/}
              {/*  type="text"*/}
              {/*  label="Address 2"*/}
              {/*  onBlur={handleBlur}*/}
              {/*  onChange={handleChange}*/}
              {/*  value={values.address2}*/}
              {/*  name="address2"*/}
              {/*  error={!!touched.address2 && !!errors.address2}*/}
              {/*  helperText={touched.address2 && errors.address2}*/}
              {/*  sx={{ gridColumn: "span 4" }}*/}
              {/*/>*/}
            </Box>
            <Box display="flex" justifyContent="center" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
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
