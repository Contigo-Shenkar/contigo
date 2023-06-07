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
import { daysPerStage } from "../../helpers/stages.mjs";
import { IMAGE_PLACEHOLDER } from "../../helpers/images";
import ProgressCircle from "../progressCircle/ProgressCircle";

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
    // openTasksInTheLast7Days,
    // failedTasksTypes,
    completedTasksInTheLast7Days,
    last7days,
    completedAllTimeCount,
    completedTodayCount,
    pieChartData,
    // completedRegularLast3Days,
    // completedBonusLast3Days,
    // availableStageTasks,
    insights,
    daysAtStage,
  } = useMemo(() => getInsights(patient), [patient]);

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
    height: 300,
    borderRadius: 10,
    backgroundColor: colors.blueAccent[700],
  };

  if (isLoading) {
    return <ProgressCircle />;
  }

  if (isError) {
    return <div>Error fetching tasks</div>;
  }

  const fontSizeSx = { fontSize: "16px" };
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
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                gap="20px"
              >
                <Box>
                  <Button>
                    <Avatar
                      src={patient.data.imageUrl || IMAGE_PLACEHOLDER}
                      sx={{
                        height: 80,
                        mb: 2,
                        width: 80,
                        cursor: "pointer",
                      }}
                    />
                  </Button>
                  <Typography
                    gutterBottom
                    variant="h3"
                    textTransform="uppercase"
                  >
                    {patient.data.fullName}
                  </Typography>
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexDirection={"column"}
                >
                  <ProgressCircle
                    progress={daysAtStage / daysPerStage[patient.data.stage]}
                  />
                  <Typography
                    gutterBottom
                    variant="p"
                    textTransform="uppercase"
                  >
                    Time at stage <br /> {daysAtStage} /{" "}
                    {daysPerStage[patient.data.stage]} days
                    <br />
                  </Typography>
                </Box>
              </Box>
              <Typography color="text.secondary" sx={fontSizeSx}>
                ID: {patient.data.id}
              </Typography>
              <Typography color="text.secondary" sx={fontSizeSx}>
                Diagnoses: {patient.data.diagnosis.join(", ")}
              </Typography>
              <Typography color="text.secondary" sx={fontSizeSx}>
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

      <Insights insights={insights} />
    </Box>
  );
};

export default PatientPage;

export const getInsights = (patient) => {
  if (!patient?.data.tasks) return [];

  const last7days = getPast7Days();

  let completedAllTimeCount = 0;
  let completedTodayCount = 0;
  let completedRegularLast3Days = 0;
  let completedBonusLast3Days = 0;
  let completedBonusThisStage = 0;
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

      if (t.tokenType === "bonus" && t.status === STATUSES.COMPLETED) {
        completedBonusThisStage++;
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

  const insights = [];
  if (completedBonusLast3Days === 0) {
    insights.push(
      <BadInsight>No bonus tasks was completed in the last 3 days</BadInsight>
    );
  }

  const daysAtStage = getDateDiffInDays(
    new Date(patient.data.stageStartDate).getTime(),
    Date.now()
  );

  const finishedBonusPercent =
    completedBonusThisStage / availableStageTasks.bonus;
  if (
    finishedBonusPercent < 0.8 &&
    daysAtStage + daysPerStage[patient.data.stage] / 4 >=
      daysPerStage[patient.data.stage]
  ) {
    insights.push(
      <BadInsight>
        Only
        {Math.round(
          (completedBonusThisStage / availableStageTasks.bonus) * 100
        )}
        % of bonus tasks was completed at current stage{" "}
      </BadInsight>
    );
  } else if (finishedBonusPercent > 0.8) {
    insights.push(
      <span style={{ backgroundColor: "green", color: "white" }}>
        Patient is doing great at current stage: {finishedBonusPercent * 100}%
        of bonus tasks was completed
      </span>
    );
  }

  if (completedRegularLast3Days === 0) {
    insights.push(
      <BadInsight>No regular tasks was completed in the last 3 days</BadInsight>
    );
  }
  if (availableStageTasks.regular < 2) {
    insights.push(
      <BadInsight>
        Only {availableStageTasks.regular} regular tasks assigned at current
        stage
      </BadInsight>
    );
  }
  if (availableStageTasks.bonus < 2) {
    insights.push(
      <BadInsight>
        Only {availableStageTasks.bonus} bonus tasks assigned at current stage{" "}
      </BadInsight>
    );
  }

  if (daysAtStage > daysPerStage[patient.stage]) {
    insights.push(
      <BadInsight>
        {" "}
        Patient is already {insights.daysAtStage} days at current stage, which
        is more than the average of {daysPerStage[insights.stage]} days
      </BadInsight>
    );
  }

  if (failedTasksTypes.size > 0) {
    insights.push(
      <BadInsight>
        Patient failed tasks typical to the following diagnoses: $
        {[...failedTasksTypes].join(", ")}
      </BadInsight>
    );
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
    insights,
    daysAtStage,
  };
};

const BadInsight = ({ children }) => {
  return (
    <span style={{ backgroundColor: "red", color: "white" }}>{children}</span>
  );
};
