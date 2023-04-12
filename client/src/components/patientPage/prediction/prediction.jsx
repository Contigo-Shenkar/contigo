import React, { useState } from "react";
import { useAddReviewMutation } from "../../../features/apiSlice";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { toast } from "react-toastify";

export const Prediction = ({ patient }) => {
  const [reviewText, setReviewText] = useState("");
  const [alternativeMedications, setAlternativeMedications] = useState([]);
  const [addReview] = useAddReviewMutation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Inside your App component

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(patient);
    try {
      const { data } = await addReview({
        patientId: patient._id,
        data: { content: reviewText },
      });
      if (data.alternativeMedications.length) {
        const relevantDiagnosis = [
          ...new Set(data.recognizedSymptoms.map((s) => s.diagnosis)),
        ];
        toast.warning(
          "Found possible side effects for medication treatment for " +
            relevantDiagnosis.join(", ") +
            ". Listed alternative medications."
        );

        setAlternativeMedications(data.alternativeMedications);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    {
      field: "Medication/drug name",
      headerName: "Medication Name",
      flex: 1,
    },
    {
      field: "Diagnosis/Condition",
      headerName: "Diagnosis/Condition",
      flex: 1,
    },
    {
      field: "sideEffects",
      headerName: "Possible side effects",
      flex: 3,
    },
  ];

  const rows = alternativeMedications.map((med) => ({
    id: med["Medication/drug name"],
    sideEffects: med["Problem/side effects"].join(", "),
    ...med,
  }));

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Review:</label>
        <input
          type={"text"}
          value={reviewText}
          onChange={(event) => {
            setReviewText(event.target.value);
          }}
        />
        <button type="submit">Submit</button>
      </form>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
};
