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
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import { toast } from "react-toastify";
import { analyzeTasksCompletion } from "../../helpers/analyze-tasks";

const TokensCalculation = () => {
  const [date, setDate] = useState("all");
  const { data: patients, isLoading, isError } = useGetPatientsQuery();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  //////////////////////////////////////////////////

  const patientsWithCompletedTasksPercent = analyzeTasksCompletion(
    patients?.data,
    date
  );

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
      align: "center",
    },
    {
      field: "completedRegularTasksPercent",
      headerName: "Completed Regular %",
      flex: 0.8,
      type: "number",
      align: "center",
      valueFormatter: (params) => `${Math.round(params.value)}%`,
    },
    {
      field: "completedBonusTasksPercent",
      headerName: "Completed Bonus %",
      flex: 0.8,
      type: "number",
      align: "center",
      valueFormatter: (params) => `${Math.round(params.value)}%`,
    },
    {
      field: "completedTasksPercent",
      headerName: "Completed Tasks %",
      flex: 0.8,
      type: "number",
      align: "center",
      valueFormatter: (params) => `${Math.round(params.value)}%`,
    },
    {
      field: "openTasksCount",
      headerName: "Open Tasks",
      type: "number",
      align: "center",
    },
    {
      field: "stage",
      headerName: "Stage",
      type: "number",
      align: "center",
    },
    {
      field: "completedTasks",
      headerName: "Total Tokens",
      type: "number",
      align: "center",
    },
    {
      field: "successStatus",
      headerName: "Success Status",
      align: "center",
      flex: 0.8,
    },
    {
      field: "alerts",
      headerName: "Alerts",
      align: "center",
      flex: 0.8,
      renderCell: (params) => {
        if (
          params.row.successStatus === "Missing bonus tasks" ||
          params.row.successStatus === "Missing regular tasks"
        ) {
          return (
            <ErrorIcon onClick={() => toast.error(params.row.successStatus)} />
          );
        }
        if (params.row.completedRegularTasksPercent < 50) {
          return (
            <WarningIcon onClick={() => toast.warning("Low completion rate")} />
          );
        }
      },
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching tasks</div>;
  }

  return (
    <Box m="20px">
      <Header
        title="Tokens Calculation System"
        subtitle="Managing a tokens calculation system for the Children’s Psychiatric Unit "
      />
      <Box display="flex" justifyContent="space-between" mt="20px">
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
            <FormControlLabel
              value="all"
              control={<Radio />}
              label="Since admission"
            />
          </RadioGroup>
        </FormControl>
      </Box>
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
