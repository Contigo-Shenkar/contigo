import Header from "../../components/header/Header";
import { tokens } from "../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import {alertNotification} from "../alert/alertNotification";
import { useGetPatientByIdQuery } from "../../features/apiSlice";

import {
  Box,
  Container,
  Avatar,
  Typography,
  useTheme,
  Card,
  CardContent,
  Grid,
  Button,
  CardActions,
} from "@mui/material";

const PatientInfo = () => {
  const {
    data: patients,
    isLoading,
    isError,
  } = useGetPatientByIdQuery({ id: "6416311dee42cbbe6828b246" });
  console.log(patients?.data);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const user = {
    avatar: "../../assets/avatars/avatar-miron-vitold.png",
    Gender: "Male",
    DateOfBirth: "17/09/2016",
    name: "Netanel Admoni",
    Department: "Department D Child Psychiatry",
  };
  const patient = patients?.data;
  const openTasksCount =  patients?.data.tasks.reduce(
    (total, task) => (task.status === "run" ? total + 1 : total),
    0
  );
  const completedTasks =  patients?.data.tasks.reduce(
    (total, task) => (task.status === "completed" ? total + 1 : total),
    0
  );
  const completedRegularTasks =  patients?.data.tasks.reduce(
    (total, task) =>
      task.status === "completed" && task.type === "regular"
        ? total + 1
        : total,
    0
  );
  const completedBonusTasks =  patients?.data.tasks.reduce(
    (total, task) =>
      task.status === "completed" && task.type === "bonus" ? total + 1 : total,
    0
  );
  const totalRegularTasks =  patients?.data.tasks.filter(
    (task) => task.type === "regular"
  ).length;
  const totalBonusTasks =  patients?.data.tasks.filter(
    (task) => task.type === "bonus"
  ).length;
  const completedTasksPercent =
      patients?.data.tasks.length > 0
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
          patients?.data.tasks.filter(
          (task) => task.type === "regular" && task.status === "not-completed"
        ).length)) /
      totalRegularTasks >=
    0.8;

  const canStillSucceedBonusTasks =
    (completedBonusTasks +
      (totalBonusTasks -
        completedBonusTasks -
          patients?.data.tasks.filter(
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

  const patientWithCompletedTasksPercent = {
    ... patients?.data,
    completedTasks,
    completedTasksPercent,
    completedRegularTasksPercent,
    completedBonusTasksPercent,
    successStatus,
    openTasksCount,
  };

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
      {/* title */}
      <Header
        title="Patient personal information"
        subtitle="Welcome to your personal card"
      />
      {/* child card */}
      <Grid container spacing={7}>
        <Grid item>
          <Card
            sx={{
              width: 400,
              height: 300,
              borderRadius: 10,
              backgroundColor: colors.blueAccent[700],
            }}
          >
            <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button size="small" onClick={() => console.log("Edit clicked!")}>
                Edit
              </Button>
            </CardActions>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button onClick={() => console.log("Avatar clicked!")}>
                <Avatar
                  src={user.avatar}
                  sx={{
                    height: 80,
                    mb: 2,
                    width: 80,
                    cursor: "pointer",
                  }}
                />
              </Button>
              <Typography gutterBottom variant="h5">
                {user.name}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {user.Gender} {user.DateOfBirth}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {user.Department}
              </Typography>
            </CardContent>
          </Card>

          {/* child graph */}
        </Grid>
        <Grid item>
          <Card
            sx={{
              width: 400,
              height: 300,
              borderRadius: 10,
              backgroundColor: colors.blueAccent[700],
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                child graph
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                aliquet orci eget nibh ultricies vehicula.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* child notifications */}
        <Grid item>
          <Card
            sx={{
              width: 400,
              height: 300,
              borderRadius: 10,
              backgroundColor: colors.blueAccent[700],
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Third Card
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                aliquet orci eget nibh ultricies vehicula.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box
        m="40px 0 0 0"
        height="25vh"
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
          rows={[patientWithCompletedTasksPercent]}
          key={(row) => row.id}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default PatientInfo;
