import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../header/Header";
import { useTheme } from "@mui/material";
import { useGetPatientsQuery } from "../../features/apiSlice";

const TokensCalculation = () => {
  const { data: patients, isLoading, isError } = useGetPatientsQuery();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  //////////////////////////////////////////////////

  const patientsWithCompletedTasksPercent = patients?.data.map((patient) => {
    const openTasksCount = patient.tasks.reduce(
      (total, task) => (task.status === "run" ? total + 1 : total),
      0
    );
    const completedTasks = patient.tasks.reduce(
      (total, task) => (task.status === "completed" ? total + 1 : total),
      0
    );
    const completedRegularTasks = patient.tasks.reduce(
      (total, task) =>
        task.status === "completed" && task.type === "regular"
          ? total + 1
          : total,
      0
    );
    const completedBonusTasks = patient.tasks.reduce(
      (total, task) =>
        task.status === "completed" && task.type === "bonus"
          ? total + 1
          : total,
      0
    );
    const totalRegularTasks = patient.tasks.filter(
      (task) => task.type === "regular"
    ).length;
    const totalBonusTasks = patient.tasks.filter(
      (task) => task.type === "bonus"
    ).length;
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
          patient.tasks.filter(
            (task) => task.type === "regular" && task.status === "not-completed"
          ).length)) /
        totalRegularTasks >=
      0.8;

    const canStillSucceedBonusTasks =
      (completedBonusTasks +
        (totalBonusTasks -
          completedBonusTasks -
          patient.tasks.filter(
            (task) => task.type === "bonus" && task.status === "not-completed"
          ).length)) /
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

  return (
    <Box m="20px">
      <Header
        title="Tokens Calculation System"
        subtitle="Managing a tokens calculation system for the Children’s Psychiatric Unit "
      />
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
