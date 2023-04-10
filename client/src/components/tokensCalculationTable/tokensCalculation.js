import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../header/Header";
import { useTheme } from "@mui/material";
import { useGetPatientsQuery } from "../../features/apiSlice";
import { useState } from "react";
import { Link } from "react-router-dom";
import { STATUSES } from "../patientTasks/tasks";

const weekInMs = 7 * 24 * 60 * 60 * 1000;

const TokensCalculation = () => {
  const [date, setDate] = useState("all");
  const { data: patients, isLoading, isError } = useGetPatientsQuery();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  //////////////////////////////////////////////////

  const patientsWithCompletedTasksPercent = patients?.data.map((patient) => {
    let openTasksCount = 0;
    let completedTasks = 0;
    let completedRegularTasks = 0;
    let completedBonusTasks = 0;
    let totalRegularTasks = 0;
    let totalBonusTasks = 0;
    let regularNotCompletedTasks = 0;
    let bonusNotCompletedTasks = 0;
    const today = new Date().toLocaleDateString();
    for (const task of patient.tasks) {
      if (
        date === "day" &&
        new Date(task.createdAt).toLocaleDateString() !== today
      ) {
        continue;
      }
      if (
        date === "week" &&
        !(new Date(task.createdAt).getTime() > new Date().getTime() - weekInMs)
      ) {
        continue;
      }
      if (task.status === STATUSES.IN_PROGRESS) {
        openTasksCount++;
      } else if (task.status === STATUSES.COMPLETED) {
        completedTasks++;
        if (task.type === "regular") {
          completedRegularTasks++;
        } else if (task.type === "bonus") {
          completedBonusTasks++;
        }
      } else if (task.status === STATUSES.NOT_STARTED) {
        if (task.type === "regular") {
          regularNotCompletedTasks++;
        } else if (task.type === "bonus") {
          totalBonusTasks++;
        }

        if (task.type === "regular") {
          totalRegularTasks++;
        } else if (task.type === "bonus") {
          bonusNotCompletedTasks++;
        }
      }
    }

    const completedTasksPercent =
      patient.tasks.length > 0
        ? (completedTasks / patient.tasks.length) * 100
        : 0;
    const completedRegularTasksPercent =
      totalRegularTasks > 0
        ? (completedRegularTasks / totalRegularTasks) * 100
        : 0;
    const completedBonusTasksPercent =
      totalBonusTasks > 0 ? (completedBonusTasks / totalBonusTasks) * 100 : 0;

    const isSuccessful =
      completedRegularTasksPercent >= 80 && completedBonusTasksPercent >= 20;

    const canStillSucceedRegularTasks =
      (completedRegularTasks +
        (totalRegularTasks -
          completedRegularTasks -
          regularNotCompletedTasks)) /
        totalRegularTasks >=
      0.8;

    const canStillSucceedBonusTasks =
      (completedBonusTasks +
        (totalBonusTasks - completedBonusTasks - bonusNotCompletedTasks)) /
        totalBonusTasks >=
      0.2;

    let successStatus;
    if (isSuccessful) {
      successStatus = "Yes";
    } else if (!canStillSucceedRegularTasks || !canStillSucceedBonusTasks) {
      successStatus = "Cannot succeed";
    } else {
      successStatus = "in progress";
    }

    return {
      ...patient,
      completedTasks,
      completedTasksPercent,
      completedRegularTasksPercent,
      completedBonusTasksPercent,
      successStatus,
      openTasksCount,
    };
  });

  //////////////////////////////////////////////////

  const columns = [
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        return (
          <Link
            to={`/patients/${params.row._id}`}
            style={{ color: colors.greenAccent[300] }}
          >
            {params.value}
          </Link>
        );
      },
    },
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "completedRegularTasksPercent",
      headerName: "Completed Regular Tasks %",
      type: "number",
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => `${Math.round(params.value)}%`,
    },
    {
      field: "completedBonusTasksPercent",
      headerName: "Completed Bonus Tasks %",
      type: "number",
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => `${Math.round(params.value)}%`,
    },

    {
      field: "completedTasksPercent",
      headerName: "Completed Tasks %",
      type: "number",
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => `${Math.round(params.value)}%`,
    },

    {
      field: "openTasksCount",
      headerName: "Open Tasks",
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "stage",
      headerName: "Stage",
      type: "number",
      headerAlign: "center",
      align: "center",
    },

    {
      field: "completedTasks",
      headerName: "Total Tokens",
      type: "number",
      headerAlign: "center",
      align: "center",
    },

    {
      field: "successStatus",
      headerName: "Success Status",
      headerAlign: "center",
      align: "center",
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching tasks</div>;
  }
  console.log("patients", patients[0]);

  console.log(date);
  return (
    <Box m="20px">
      <Header
        title="Tokens Calculation System"
        subtitle="Managing a tokens calculation system for the Children’s Psychiatric Unit "
      />

      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Choose Date</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="all"
          name="radio-buttons-group"
          row
          onChange={(e) => setDate(e.target.value)}
        >
          <FormControlLabel value="day" control={<Radio />} label="Today" />
          <FormControlLabel
            value="week"
            control={<Radio />}
            label="This Week"
          />
          <FormControlLabel value="all" control={<Radio />} label="All time" />
        </RadioGroup>
      </FormControl>
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
          rows={patientsWithCompletedTasksPercent}
          key={(row) => row.id}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default TokensCalculation;
