import React, { useCallback, useMemo, useState } from "react";
import {
  useAddReviewMutation,
  useGetAlternativeMedMutation,
  useGetPatientByIdQuery,
  useUpdatePatientMutation,
} from "../../../features/apiSlice";
import { Box, Button, TextField } from "@mui/material";
import { useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import { toast } from "react-toastify";
import Header from "../../header/Header";
import { useParams } from "react-router-dom";
import { Avatar, Typography } from "@mui/material";
import HorizontalLinearStepper from "./stepper";

export const PatientMeds = () => {
  const [activeStep, setActiveStep] = useState(0);

  const [reviewText, setReviewText] = useState("");
  const [alternativeMedications, setAlternativeMedications] = useState([]);
  const [algoAlternativeMedications, setAlgoAlternativeMedications] = useState(
    []
  );
  const [replacedMed, setReplacedMed] = useState(null);
  const [addReview] = useAddReviewMutation();
  const [getAlternativeMedsQuery] = useGetAlternativeMedMutation();
  const [updatePatient] = useUpdatePatientMutation();
  const theme = useTheme();
  const { id: patientId } = useParams();
  const { data, isLoading, isError } = useGetPatientByIdQuery({
    id: patientId,
  });
  const patient = data?.data;
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
        const updatedMeds = [...patient.medication];
        // console.log("updatedMeds", updatedMeds);
        // console.log("replacedMed", replacedMed);
        const index = updatedMeds.findIndex(
          (m) => m.medication === replacedMed.medication
        );
        console.log("index", index);
        // update endedAt for the replaced med
        updatedMeds[index] = {
          ...updatedMeds[index],
          endedAt: new Date(),
        };
        const newMed = {
          condition: replacedMed.condition,
          medication: row["Medication/drug name"] || row.medication,
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
        setAlgoAlternativeMedications([]);
        toast.success("Medication replaced successfully");
        setActiveStep(2);
      } catch (e) {
        console.log(e);
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

      console.log("data", data);
      if (data?.alternativeMedications.length) {
        setActiveStep(1);
        toast.warning("Showing alternative medications.");
        setReplacedMed(patient.medication[0]);
        setAlgoAlternativeMedications(data.alternativeMedications);
      } else {
        toast.success("Review added successfully");
      }
      setReviewText("");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };

  const { rows, columns } = useMemo(() => {
    if (algoAlternativeMedications?.length) {
      const { rows, columns } = getAlgoAlternativeMeds(
        algoAlternativeMedications,
        onReplace,
        replacedMed?.medication
      );
      return { rows, columns };
    }
    if (alternativeMedications?.length) {
      const { rows, columns } = getAlternativeMeds(
        alternativeMedications,
        onReplace,
        replacedMed?.medication
      );
      return { rows, columns };
    }

    if (!patient?.medication?.length) {
      return { rows: [], columns: [] };
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
    algoAlternativeMedications,
    alternativeMedications,
    handleSeeAlternativeMeds,
    onReplace,
    patient?.medication,
    replacedMed?.medication,
  ]);

  const reviewHistory = useMemo(() => {
    if (!patient?.reviews?.length) {
      return { rows: [], columns: [] };
    }

    return getReviews(patient.reviews);
  }, [patient?.reviews]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Loading...</div>;
  }

  return (
    <Box px="35px" width="95%">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap="20px"
      >
        <Avatar
          src={patient.imageUrl || "/assets/avatars/avatar-placeholder.png"}
          sx={{
            height: 80,
            mb: 2,
            width: 80,
            cursor: "pointer",
          }}
        />
        <Typography gutterBottom variant="h3">
          {patient.fullName}'s Medication and Reviews
        </Typography>
      </Box>
      <HorizontalLinearStepper activeStep={activeStep} />
      <br />
      <form onSubmit={handleAddReview}>
        <Header title="Add Child Review" subtitle="Add new review" />

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
        <Header title="Current Medication & History" />
        {rows && columns && (
          <DataGrid
            rows={rows}
            columns={columns}
            // components={{ Toolbar: GridToolbar }}
            // getRowId={(row) => row._id}
          />
        )}
        <br />

        <Header title="Review History" subtitle="Add new review" />
        <br />

        {reviewHistory.rows && reviewHistory.columns && (
          <DataGrid
            columns={reviewHistory.columns}
            rows={reviewHistory.rows}
            // components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row._id}
          />
        )}
      </Box>
    </Box>
  );
};

function getReviews(reviews) {
  return {
    rows: reviews.map((r) => ({
      ...r,
      date: new Date(r.createdAt).toLocaleDateString("en-GB"),
      recognizedSymptoms: r.recognizedSymptoms.map((s) => s.symptom).join(", "),
    })),

    columns: [
      {
        field: "date",
        headerName: "Date",
      },
      {
        field: "content",
        headerName: "Content",
        minWidth: 200,
      },
      {
        field: "recognizedSymptoms",
        headerName: "Recognized Symptoms",
        minWidth: 150,
      },
    ],
  };
}
function getMeds(medications, handleSeeAlternativeMeds) {
  return {
    rows: medications.map((m, i) => ({ ...m, id: i })),
    columns: [
      {
        field: "medication",
        headerName: "Medication Name",
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
        renderCell: (data) => {
          if (data.row.endedAt) {
            return null;
          }
          return (
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={() => handleSeeAlternativeMeds(data.row)}
            >
              See Alternatives
            </Button>
          );
        },
      },
    ],
  };
}

function getAlgoAlternativeMeds(
  alternativeMedications,
  onReplace,
  replacedMed
) {
  const rows = alternativeMedications.map((med) => ({
    ...med,
    id: med.medication,
    score: Number(med["score"]).toFixed(2),
    sideEffect: med["sideEffectPercent"]
      ? med["detectedSideEffect"] + ": " + med["sideEffectPercent"]
      : "",
  }));
  const columns = [
    {
      field: "medication",
      headerName: "Medication Name",
      flex: 1,
    },
    {
      field: "score",
      headerName: "Score",
      flex: 1,
    },
    {
      field: "sideEffect",
      headerName: "Side Effect",
      flex: 1,
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
          disabled={replacedMed === data.row}
        >
          Replace
        </Button>
      ),
    },
  ];
  return { rows, columns };
}

function getAlternativeMeds(alternativeMedications, onReplace, replacedMed) {
  const rows = alternativeMedications.map((med) => ({
    id: med["Medication/drug name"],
    score: med["score"],
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
          {replacedMed
            ? `Replace "${replacedMed}" with this med`
            : "Replace with this med"}
        </Button>
      ),
    },
  ];
  return { rows, columns };
}
