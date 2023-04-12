import Header from "../header/Header";
import { tokens } from "../../theme";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link, useParams } from "react-router-dom";
// import {alertNotification} from "../alert/alertNotification";
import { useGetPatientByIdQuery } from "../../features/apiSlice";

import {
  Box,
  Avatar,
  Typography,
  useTheme,
  Card,
  CardContent,
  Grid,
  Button,
  CardActions,
} from "@mui/material";
import { Prediction } from "./prediction/prediction";
import { STATUSES } from "../patientTasks/tasks";
import { BarChart } from "../barChart/BarChart";
import { useMemo } from "react";
import { getRandomAvatar } from "../../data/avatars";
import { isPast7days } from "../../helpers/analyze-tasks";

export const analyzeTasks = (tasks) => {
  const taskTypeStats = {};

  tasks?.forEach((task) => {
    const taskType = task.taskType;
    if (!taskTypeStats[taskType]) {
      taskTypeStats[taskType] = {
        total: 0,
        completed: 0,
        notCompleted: 0,
      };
    }
    taskTypeStats[taskType].total += 1;
    if (task.status === STATUSES.COMPLETED) {
      taskTypeStats[taskType].completed += 1;
    } else if (task.status === STATUSES.IN_PROGRESS) {
      taskTypeStats[taskType].notCompleted += 1;
    }
  });

  let bestTaskType = "";
  let worstTaskType = "";
  let highestSuccessRate = -1;
  let lowestSuccessRate = 101;

  for (const taskType in taskTypeStats) {
    const stats = taskTypeStats[taskType];
    const successRate = (stats.completed / stats.total) * 100;
    if (successRate > highestSuccessRate) {
      highestSuccessRate = successRate;
      bestTaskType = taskType;
    }
    if (successRate < lowestSuccessRate) {
      lowestSuccessRate = successRate;
      worstTaskType = taskType;
    }
  }

  return {
    bestTaskType,
    worstTaskType,
    taskTypeStats,
  };
};

export const PatientPage = () => {
  const { id: patientId } = useParams();
  const {
    data: patient,
    isLoading,
    isError,
  } = useGetPatientByIdQuery({ id: patientId });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  console.log("patient", patient);

  const {
    openTasksInTheLast7Days,
    failedTasksTypes,
    completedTasksInTheLast7Days,
  } = useMemo(() => {
    if (!patient?.data.tasks) return [];

    const openTasksInTheLast7Days = [];
    const completedTasksInTheLast7Days = [];

    const failedTasksTypes = new Set();

    console.log(patient);

    for (const t of patient?.data.tasks) {
      if (t.status === STATUSES.IN_PROGRESS && isPast7days(t.createdAt)) {
        openTasksInTheLast7Days.push(t);
        failedTasksTypes.add(t.taskType);
      } else if (t.status === STATUSES.COMPLETED) {
        completedTasksInTheLast7Days.push(t);
      }
    }
    return {
      failedTasksTypes,
      openTasksInTheLast7Days,
      completedTasksInTheLast7Days,
    };
  }, [patient?.data.tasks]);

  console.log({
    openTasksInTheLast7Days,
    failedTasksTypes,
    completedTasksInTheLast7Days,
  });

  const cardStyles = {
    width: 400,
    height: 250,
    borderRadius: 10,
    backgroundColor: colors.blueAccent[700],
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching tasks</div>;
  }

  console.log("patient", patient);

  return (
    <Box m="20px">
      {/* title */}
      <Header
        title={`${patient.data.fullName} personal information`}
        subtitle="Welcome to your personal card"
      />
      {/* child card */}

      <Grid
        container
        spacing={3}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        <Grid item>
          <Card sx={cardStyles}>
            <CardActions
              sx={{ display: "flex", justifyContent: "flex-end" }}
            ></CardActions>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button onClick={() => console.log("Avatar clicked!")}>
                <Avatar
                  src={getRandomAvatar()}
                  sx={{
                    height: 80,
                    mb: 2,
                    width: 80,
                    cursor: "pointer",
                  }}
                />
              </Button>
              <Typography gutterBottom variant="h5" textTransform="uppercase">
                {patient.data.fullName}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {patient.data.email}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Age: {patient.data.age}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Phone: {patient.data.contactNumber}
              </Typography>
            </CardContent>
          </Card>

          {/* child graph */}
        </Grid>
        <Grid item>
          <Card sx={cardStyles}>
            <CardContent>
              <Box height="250px" mt="-20px">
                <BarChart isDashboard={true} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box m="40px 0 0 40px">
        <Typography variant="h3" gutterBottom>
          <Link
            to={`/patients/${patientId}/tasks`}
            style={{ color: colors.greenAccent[300] }}
          >
            View patients tasks
          </Link>
          <NavigateNextIcon />
        </Typography>
        <Typography variant="h3" gutterBottom>
          {!completedTasksInTheLast7Days.length
            ? 0
            : Math.floor(
                (completedTasksInTheLast7Days.length /
                  (completedTasksInTheLast7Days.length +
                    openTasksInTheLast7Days.length)) *
                  100
              )}
          % Success rate
        </Typography>
      </Box>

      {openTasksInTheLast7Days.length > 0 ? (
        <Box marginBottom={4} p={3}>
          <Typography variant="h3" gutterBottom>
            Open tasks
          </Typography>

          <Typography variant="h5" p={3}>
            {openTasksInTheLast7Days.map((task, i) => {
              return <li key={task._id + i}>{task.task}</li>;
            })}
          </Typography>

          <Typography variant="h5" p={3}>
            Patient failed tasks typical to the following diagnoses:
            <div>{[...failedTasksTypes].join(", ")}</div>
          </Typography>
        </Box>
      ) : null}
      <Prediction patient={patient.data} />
    </Box>
  );
};

export default PatientPage;
