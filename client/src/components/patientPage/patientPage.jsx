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
import { PatientMeds } from "./patient-meds/patient-meds";
import { STATUSES, categoryPerActivity } from "../patientTasks/tasks";
import { BarChart } from "../barChart/BarChart";
import { useMemo } from "react";

import { isPast7days, isToday } from "../../helpers/analyze-tasks";
import { getDayAndMonth, getPast7Days } from "../../helpers/dates";
import PieChart from "../pieChart/pieChart";

const totalTokensKeys = ["Today", "Last Week", "All Time"];
export const PatientPage = () => {
  const { id: patientId } = useParams();
  const {
    data: patient,
    isLoading,
    isError,
  } = useGetPatientByIdQuery({ id: patientId });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {
    openTasksInTheLast7Days,
    failedTasksTypes,
    completedTasksInTheLast7Days,
    last7days,
    completedAllTimeCount,
    completedTodayCount,
    pieChartData,
  } = useMemo(() => {
    if (!patient?.data.tasks) return [];

    const last7days = getPast7Days();

    let completedAllTimeCount = 0;
    let completedTodayCount = 0;
    const openTasksInTheLast7Days = [];
    const completedTasksInTheLast7Days = [];
    const failedTasksTypes = new Set();

    const categoryCount = {};

    for (const t of patient?.data.tasks) {
      const category = categoryPerActivity.get(t.task);
      categoryCount[category] = categoryCount[category] || 0 + 1;

      if (t.status === STATUSES.IN_PROGRESS && isPast7days(t.createdAt)) {
        openTasksInTheLast7Days.push(t);
        failedTasksTypes.add(t.taskType);
      } else if (t.status === STATUSES.COMPLETED) {
        completedAllTimeCount++;
        if (!t.hidden) {
          completedTasksInTheLast7Days.push(t);
          if (isPast7days(t.completedAt)) {
            const key = getDayAndMonth(t.completedAt);
            last7days[key]++;
            if (isToday(new Date(t.completedAt))) {
              completedTodayCount++;
            }
          }
        }
      }
    }

    const pieChartData = [];
    for (const [category, count] of Object.entries(categoryCount)) {
      pieChartData.push({
        id: category,
        label: category,
        value: count,
        // color: colors[category],
      });
    }

    return {
      failedTasksTypes,
      openTasksInTheLast7Days,
      completedTasksInTheLast7Days,
      last7days,
      completedAllTimeCount,
      completedTodayCount,
      pieChartData,
    };
  }, [patient]);

  console.log({
    openTasksInTheLast7Days,
    failedTasksTypes,
    completedTasksInTheLast7Days,
    last7days,
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
      <Header
        title={`${patient.data.fullName} personal information`}
        subtitle="Welcome to your personal card"
      />
      <Box display={"flex"} sx={{ m: "15px" }}>
        <Link
          to={`/patients/${patientId}/tasks`}
          style={{ color: colors.greenAccent[300] }}
        >
          <Button
            sx={{ fontSize: "18px" }}
            size="large"
            color="secondary"
            variant="contained"
          >
            View & manage patients tasks
          </Button>
        </Link>
        {/* <Typography variant="h3" gutterBottom>
          {!completedTasksInTheLast7Days.length
            ? 0
            : Math.floor(
                (completedTasksInTheLast7Days.length /
                  (completedTasksInTheLast7Days.length +
                    openTasksInTheLast7Days.length)) *
                  100
              )}
          % Last week tasks completion rate
        </Typography> */}
      </Box>
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
                  src={
                    patient.data.imageUrl ||
                    "/assets/avatars/avatar-placeholder.png"
                  }
                  sx={{
                    height: 80,
                    mb: 2,
                    width: 80,
                    cursor: "pointer",
                  }}
                />
              </Button>
              <Typography gutterBottom variant="h3" textTransform="uppercase">
                {patient.data.fullName}
              </Typography>
              <Typography color="text.secondary" variant="body">
                ID: {patient.data.id}
              </Typography>
              <Typography color="text.secondary" variant="body">
                Diagnoses: {patient.data.diagnosis.join(", ")}
              </Typography>
              <Typography color="text.secondary" variant="body">
                Medications:{" "}
                {patient.data.medication
                  .map(({ medication }) => medication)
                  .join(", ")}
              </Typography>
            </CardContent>
          </Card>

          {/* child graph */}
        </Grid>
        <Grid item>
          <Card sx={cardStyles}>
            <CardContent>
              <Box
                height="250px"
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography variant="h5" align="center">
                  Past week completed tasks
                </Typography>
                <Box mt="-20px" height="250px">
                  <BarChart
                    isDashboard={true}
                    keys={Object.keys(last7days).reverse()}
                    values={Object.entries(last7days)
                      .reverse()
                      .map(([key, value]) => ({
                        date: key,
                        [key]: value,
                      }))}
                    indexBy="date"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card sx={cardStyles}>
            <CardContent>
              <Box
                height="250px"
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography variant="h5" align="center">
                  Total Tokens
                </Typography>
                <Box mt="-20px" height="250px">
                  <BarChart
                    isDashboard={true}
                    keys={totalTokensKeys}
                    values={[
                      { date: "All Time", "All Time": completedAllTimeCount },
                      {
                        date: "Last Week",
                        "Last Week": completedTasksInTheLast7Days.length,
                      },
                      { date: "Today", Today: completedTodayCount },
                    ]}
                    indexBy="date"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card sx={cardStyles}>
            <CardContent>
              <Box
                height="250px"
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography variant="h5" align="center">
                  Task distribution by Category
                </Typography>
                <Box mt="-20px" height="250px">
                  <PieChart data={pieChartData} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box m="40px 0 0 40px"></Box>

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
      <PatientMeds patient={patient.data} />
    </Box>
  );
};

export default PatientPage;
