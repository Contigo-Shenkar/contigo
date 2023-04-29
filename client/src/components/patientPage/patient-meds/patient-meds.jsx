import React, { useCallback, useMemo, useState } from "react";
import {
  useAddReviewMutation,
  useGetAlternativeMedMutation,
  useUpdatePatientMutation,
} from "../../../features/apiSlice";
import { Box, Button, TextField, TextareaAutosize } from "@mui/material";
import { useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { toast } from "react-toastify";
import Header from "../../header/Header";

export const PatientMeds = ({ patient }) => {
  const [reviewText, setReviewText] = useState("");
  const [alternativeMedications, setAlternativeMedications] = useState([]);
  const [replacedMed, setReplacedMed] = useState(null);
  const [addReview] = useAddReviewMutation();
  const [getAlternativeMedsQuery] = useGetAlternativeMedMutation();
  const [updatePatient] = useUpdatePatientMutation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleSeeAlternativeMeds = useCallback(
    async (row) => {
      setReplacedMed(row);
      const { data } = await getAlternativeMedsQuery({
        medication: row.medication,
      });

      if (data.message) {
        return toast.error(data.message);
      }
      setAlternativeMedications(data.alternatives);
      toast.success("Showing alternative medications for " + row.medication);
    },
    [getAlternativeMedsQuery]
  );

  const onReplace = useCallback(
    async (row) => {
      try {
        console.log("row", row);
        const updatedMeds = [...patient.medication];
        const index = updatedMeds.findIndex(
          (m) => m.medication === replacedMed.medication
        );
        // update endedAt for the replaced med
        updatedMeds[index] = {
          ...updatedMeds[index],
          endedAt: new Date(),
        };
        const newMed = {
          condition: replacedMed.condition,
          medication: row["Medication/drug name"],
        };
        updatedMeds.push(newMed);
        const { data } = await updatePatient({
          patientId: patient._id,
          data: { medication: updatedMeds, type: "replace-med" },
        });
        if (data.message) {
          return toast.error(data.message);
        }
        setAlternativeMedications(data.alternatives);
      } catch (e) {
        return toast.error(e.message);
      }
    },
    [patient?._id, patient?.medication, replacedMed, updatePatient]
  );

  const handleAddReview = async (e) => {
    e.preventDefault();
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

  const { rows, columns } = useMemo(() => {
    if (alternativeMedications?.length) {
      const { rows, columns } = getAlternativeMeds(
        alternativeMedications,
        onReplace,
        replacedMed.medication
      );
      return { rows, columns };
    }

    return getMeds(
      patient.medication.map((m) => ({
        ...m,
        endedAt: m.endedAt
          ? new Date(m.endedAt).toLocaleDateString("en-GB")
          : "",
        startedAt: new Date(m.startedAt).toLocaleDateString("en-GB"),
      })),
      handleSeeAlternativeMeds
    );
  }, [
    alternativeMedications,
    handleSeeAlternativeMeds,
    onReplace,
    patient?.medication,
    replacedMed?.medication,
  ]);

  return (
    <div>
      <form onSubmit={handleAddReview}>
        <Header title="Add Review" subtitle="Add new review" />

        <Box display="grid" gap="30px">
          <TextField
            sx={{ minHeight: "100px", width: "50%" }}
            variant="filled"
            type="text"
            label="Review"
            value={reviewText}
            name="fullName"
            multiline={true}
            rows={3}
            onChange={(event) => {
              setReviewText(event.target.value);
            }}
          />
        </Box>

        <Button
          type="submit"
          size="small"
          color="secondary"
          variant="contained"
        >
          Submit
        </Button>
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
          getRowId={(row) => row._id}
        />
      </Box>
    </div>
  );
};
function getMeds(medications, handleSeeAlternativeMeds) {
  return {
    rows: medications,
    columns: [
      {
        field: "medication",
        headerName: "Medication Name",
        minWidth: 150,
      },
      {
        field: "condition",
        headerName: "Diagnosis/Condition",
        minWidth: 150,
      },
      {
        field: "startedAt",
        headerName: "Started at",
        minWidth: 150,
      },
      {
        field: "endedAt",
        headerName: "Ended at",
        minWidth: 150,
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: (data) => (
          <Button
            size="small"
            color="secondary"
            variant="contained"
            onClick={() => handleSeeAlternativeMeds(data.row)}
          >
            See Alternatives
          </Button>
        ),
      },
    ],
  };
}

function getAlternativeMeds(alternativeMedications, onReplace, replacedMed) {
  const rows = alternativeMedications.map((med) => ({
    id: med["Medication/drug name"],
    sideEffects: med["Problem/side effects"].join(", "),
    ...med,
  }));
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
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (data) => (
        <Button
          color="secondary"
          variant="contained"
          onClick={() => onReplace(data.row)}
        >
          Replace "{replacedMed}" with this med
        </Button>
      ),
    },
  ];
  return { rows, columns };
}