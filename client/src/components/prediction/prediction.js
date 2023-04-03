import React, { useState, useEffect } from "react";
import { useGetPatientByIdQuery } from "../../features/apiSlice";
import Select from "react-select";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";

const Prediction = ({ patient }) => {
  console.log(patient.data.medication);
  const [reviewText, setReviewText] = useState("");
  const [result, setResult] = useState(null);
  const [conditionType, setConditionType] = useState("");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Inside your App component
  const [conditions, setConditions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [medicationType, setMedicationType] = useState("");

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/conditions");
        const data = await response.json();
        setConditions(data);
      } catch (error) {
        console.error("Error fetching conditions:", error);
      }
    };
    fetchConditions();
  }, []);

  const fetchMedications = async (condition) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/medications/${condition}`
      );
      const data = await response.json();
      setMedications(data);
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

  const handleConditionChange = (e) => {
    setConditionType(e.target.value);
    fetchMedications(e.target.value);
  };

  function sortTreatmentsByScore(treatments) {
    return Object.entries(treatments)
      .sort(([, a], [, b]) => b.score - a.score)
      .slice(0, 5)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  }

  const handleMedicationChange = (e) => {
    setMedicationType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const predictionInfo = {
      review: reviewText,
      medication: medicationType,
      condition: conditionType,
    };

    const handleMedicationChange = (e) => {
      setMedicationType(e.target.value);
    };
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(predictionInfo),
      });

      const data = await response.json();
      const top5Treatments = sortTreatmentsByScore(data);
      await console.log(top5Treatments);
      setResult(top5Treatments);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Medication",
      flex: 1,
    },
    {
      field: "amountOfReviews",
      headerName: "Amount of Reviews",
      flex: 1,
    },
    {
      field: "score",
      headerName: "Score",
      flex: 1,
    },
  ];

  const resultRows = result
    ? Object.entries(result).map(([name, data], index) => ({
        id: index,
        name,
        amountOfReviews: data["amount of reviews"],
        score: data["score"],
      }))
    : [];

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
        <select
          id="task-type-select"
          value={conditionType}
          onChange={handleConditionChange}
        >
          <option value="" disabled>
            Select a condition
          </option>
          {[...new Set(patient.data.medication.map((m) => m.condition))].map(
            (condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            )
          )}
        </select>

        <select
          id="medication-type-select"
          value={medicationType}
          onChange={handleMedicationChange}
        >
          <option value="" disabled>
            Select a medication
          </option>
          {patient.data.medication
            .filter((m) => m.condition === conditionType)
            .map((m) => (
              <option key={m._id} value={m.medication}>
                {m.medication}
              </option>
            ))}
        </select>

        <button type={"submit"}>Submit</button>
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
          rows={{ result } && resultRows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
};

export default Prediction;
