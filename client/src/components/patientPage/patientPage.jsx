import Header from "../header/Header";
import { tokens } from "../../theme";
import { Link, useParams } from "react-router-dom";
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
import { STATUSES, categoryPerActivity } from "../patientTasks/tasks";
import { BarChart } from "../barChart/BarChart";
import { useEffect, useMemo } from "react";

import { isPast7days, isToday } from "../../helpers/analyze-tasks";
import {
  getDateDiffInDays,
  getDayAndMonth,
  getPast7Days,
  isLastXDays,
} from "../../helpers/dates";
import PieChart from "../pieChart/pieChart";
import { Insights } from "./insights/insights";

function updatedRecentlyVisited(patientId) {
  const recentlyVisited =
    JSON.parse(localStorage.getItem("recentlyVisited")) || [];
  const updatedRecentlyVisited = recentlyVisited.filter(
    (id) => id !== patientId
  );
  updatedRecentlyVisited.unshift(patientId);
  localStorage.setItem(
    "recentlyVisited",
    JSON.stringify(updatedRecentlyVisited)
  );
}

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

  useEffect(() => {
    updatedRecentlyVisited(patientId);
  }, [patientId]);

  const {
    openTasksInTheLast7Days,
    failedTasksTypes,
    completedTasksInTheLast7Days,
    last7days,
    completedAllTimeCount,
    completedTodayCount,
    pieChartData,
    completedRegularLast3Days,
    completedBonusLast3Days,
    availableStageTasks,
  } = useMemo(() => {
    if (!patient?.data.tasks) return [];

    const last7days = getPast7Days();

    let completedAllTimeCount = 0;
    let completedTodayCount = 0;
    let completedRegularLast3Days = 0;
    let completedBonusLast3Days = 0;
    const availableStageTasks = { bonus: 0, regular: 0 };
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

            if (isLastXDays(t.completedAt, 3)) {
              if (t.tokenType === "bonus") {
                completedBonusLast3Days++;
              } else {
                completedRegularLast3Days++;
              }

              if (isToday(new Date(t.completedAt))) {
                completedTodayCount++;
              }
            }
          }
        }
      }

      if (!t.hidden) {
        availableStageTasks[t.tokenType]++;
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
      completedRegularLast3Days,
      completedBonusLast3Days,
      availableStageTasks,
    };
  }, [patient]);

  const reason = useMemo(() => {
    if (!patient?.data?.reasons) return "No reason given for this patient";

    const obj = {};
    for (const { diagnosis, reason } of patient?.data?.reasons) {
      obj[diagnosis] = obj[diagnosis] || [];
      obj[diagnosis].push(reason);
    }
    const reasonString = Object.entries(obj).map(
      ([diagnosis, reasons]) =>
        `${diagnosis}: ${reasons.map((r) => `${r}`).join(", ")}`
    );
    return (
      <>
        <div>Reasons for hospitalization:</div>
        {reasonString.map((r) => (
          <li>{r}</li>
        ))}
        <br />
      </>
    );
  }, [patient?.data?.reasons]);

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
    <Box m="20px" p="20px" pb="50px">
      <Header
        title={`${patient.data.fullName} personal information`}
        subtitle="Welcome to your personal card"
      />
      <Box display={"flex"} gap="30px" sx={{ m: "15px" }}>
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
        <Link
          to={`/patients/${patientId}/review-and-meds`}
          style={{ color: colors.greenAccent[300] }}
        >
          <Button
            sx={{ fontSize: "18px" }}
            size="large"
            color="secondary"
            variant="contained"
          >
            Review & view meds
          </Button>
        </Link>
      </Box>
      <Box>{reason}</Box>
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
                pt: 0,
                textAlign: "center",
              }}
            >
              <Button>
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
      </Grid>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: "center", alignItems: "center" }}
        pt={3}
      >
        <Grid item>
          <Card sx={{ ...cardStyles, width: "600px" }}>
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
                  <PieChart data={pieChartData} showLegend={false} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box m="40px 0 0 40px"></Box>

      <Insights
        insights={{
          completedBonusLast3Days,
          completedRegularLast3Days,
          availableStageTasks,
          daysAtStage: getDateDiffInDays(
            new Date(patient.data.stageStartDate).getTime(),
            Date.now()
          ),
          stage: patient.data.stage,
          failedTasksTypes,
        }}
      />
    </Box>
  );
};

export default PatientPage;
