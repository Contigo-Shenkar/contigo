import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { mockTransactions } from "../data/mockData";
import Header from "../components/header/Header";
// import icons
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import TokenIcon from "@mui/icons-material/Token";
import VaccinesIcon from "@mui/icons-material/Vaccines";
//import charts for dashboard
import ProgressCircle from "../components/progressCircle/ProgressCircle";
import { BarChart } from "../components/barChart/BarChart";
import LineChart from "../components/lineChart/lineChart";
import StatBox from "../components/statBox/StatBox";
import PieChart from "../components/pieChart/pieChart";
import { useGetPatientsQuery } from "../features/apiSlice";
import { useEffect, useMemo, useState } from "react";
import { colors } from "../helpers/colors";
import { getDayAndMonth, getPast7Days, isLastXDays } from "../helpers/dates";
import { Link } from "react-router-dom";
import { getLineData } from "../components/lineChart/get-line-data";

const Dashboard = () => {
  const [recentlyVisited, setRecentlyVisited] = useState([]);
  const theme = useTheme();
  const themeColors = tokens(theme.palette.mode);
  const { data, isLoading } = useGetPatientsQuery();
  const patients = data?.data;

  useEffect(() => {
    const recentlyVisited =
      JSON.parse(localStorage.getItem("recentlyVisited")) || [];
    if (recentlyVisited.length > 0) {
      setRecentlyVisited(recentlyVisited);
    }
  }, []);

  const dashboardData = useMemo(() => {
    if (!patients) return {};
    console.log(patients);

    const last7days = getPast7Days();
    const stages = {};
    const patientPerMonth = {};
    new Array(new Date().getMonth() + 1).fill(0).forEach((_, i) => {
      patientPerMonth[i + 1] = 0;
    });
    const completedTasksPerMonth = {};
    new Array(new Date().getMonth() + 1).fill(0).forEach((_, i) => {
      completedTasksPerMonth[i + 1] = 0;
    });

    let completedTasks = 0;
    let pastWeekCompletedTasks = 0;
    let currentlyInProgressTasks = 0;
    let totalTasks = 0;
    let newPatientsThisWeek = 0;
    let newReviewsThisWeek = 0;

    for (const patient of patients) {
      // stages
      if (stages[patient.stage]) {
        stages[patient.stage] += 1;
      } else {
        stages[patient.stage] = 1;
      }

      if (patient.stage !== 1 && isLastXDays(patient.stageStartDate, 7)) {
        const key = getDayAndMonth(patient.stageStartDate);
        last7days[key]++;
      }

      // patients
      if (isLastXDays(patient.createdAt, 7)) {
        newPatientsThisWeek += 1;
      }

      patientPerMonth[new Date(patient.createdAt).getMonth() + 1] += 1;

      // reviews
      for (const review of patient.reviews) {
        if (isLastXDays(review.createdAt, 7)) {
          newReviewsThisWeek += 1;
        }
      }

      // tasks
      for (const task of patient.tasks) {
        totalTasks += 1;
        if (task.status === "Completed") {
          completedTasks += 1;
          if (isLastXDays(task.completedAt, 7)) {
            pastWeekCompletedTasks += 1;
          }
          completedTasksPerMonth[
            new Date(task.completedAt).getMonth() + 1
          ] += 1;
        } else if (!task.hidden) {
          currentlyInProgressTasks++;
        }
      }
    }

    const stagesPieData = [];
    for (const [stage, count] of Object.entries(stages)) {
      stagesPieData.push({
        id: stage,
        label: "Stage " + stage,
        value: count,
        color: colors[stagesPieData.length],
      });
    }

    return {
      stages,
      stagesPieData,
      completedTasks,
      totalTasks,
      pastWeekCompletedTasks,
      currentlyInProgressTasks,
      newPatientsThisWeek,
      newReviewsThisWeek,
      last7days,
      patientPerMonth: getLineData(
        "New patient per month",
        colors[1],
        patientPerMonth
      ),
      completedTasksPerMonth: getLineData(
        "Completed tasks per month",
        colors[2],
        completedTasksPerMonth
      ),
    };
  }, [patients]);
  console.log("dashboardData", dashboardData);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const tasksAvailableThisWeek =
    dashboardData.currentlyInProgressTasks +
    dashboardData.pastWeekCompletedTasks;
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" subtitle="Welcome to your dashboard" />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={themeColors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardData.newReviewsThisWeek}
            subtitle="New Reviews This Week"
            progress=""
            increase=""
            icon={
              <VaccinesIcon
                sx={{ color: themeColors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={themeColors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardData.completedTasks}
            subtitle="Patients Stages Completed"
            progress={dashboardData.completedTasks / dashboardData.totalTasks}
            increase=""
            icon={
              <TokenIcon
                sx={{ color: themeColors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={themeColors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardData.newPatientsThisWeek}
            subtitle="New Patients This Week"
            progress={dashboardData.newPatientsThisWeek / patients.length}
            increase=""
            icon={
              <ChildCareIcon
                sx={{ color: themeColors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={themeColors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${dashboardData.pastWeekCompletedTasks}/${tasksAvailableThisWeek}`}
            subtitle="Tasks completed this week"
            progress={
              dashboardData.pastWeekCompletedTasks / tasksAvailableThisWeek
            }
            increase=""
            icon={
              <FamilyRestroomIcon
                sx={{ color: themeColors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={themeColors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={themeColors.grey[100]}
              >
                {/* Revenue Generated */}
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={themeColors.greenAccent[500]}
              >
                {/* $59,342.32 */}
              </Typography>
            </Box>
          </Box>
          <Box height="280px" m="-30px 0 0 -30px">
            <LineChart
              isDashboard={true}
              data={[
                dashboardData.patientPerMonth,
                dashboardData.completedTasksPerMonth,
              ]}
            />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={themeColors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${themeColors.primary[500]}`}
            colors={themeColors.grey[100]}
            p="15px"
          >
            <Typography
              color={themeColors.grey[100]}
              variant="h5"
              fontWeight="600"
            >
              Recently Visited profiles
            </Typography>
          </Box>
          {recentlyVisited.map((patientId, i) => {
            const patient = patients.find((p) => p._id === patientId);
            console.log("patient", patient);
            if (!patient) return null;
            return (
              <Box
                key={patientId}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${themeColors.primary[500]}`}
                p="15px"
              >
                <Box>
                  <Typography color={themeColors.grey[100]}>
                    {patient.fullName}
                  </Typography>
                </Box>

                <Link
                  to={`/patients/${patientId}`}
                  style={{
                    color: "black",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  <Box
                    backgroundColor={themeColors.greenAccent[500]}
                    p="5px 10px"
                    borderRadius="4px"
                  >
                    {">>>"}
                  </Box>
                </Link>
              </Box>
            );
          })}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={themeColors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Faliure Stages
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={themeColors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              
            </Typography>
            <Typography></Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={themeColors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Patient's Updated stages
          </Typography>
          <Box height="250px" mt="-20px" px="5px">
            <BarChart
              isDashboard={true}
              keys={Object.keys(dashboardData.last7days).reverse()}
              values={Object.entries(dashboardData.last7days)
                .reverse()
                .map(([key, value]) => ({
                  date: key,
                  [key]: value,
                }))}
              indexBy="date"
            />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={themeColors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Stages of Patients
          </Typography>
          <PieChart data={dashboardData.stagesPieData} />
        </Box>
      </Box>
    </Box>
  );
};
export default Dashboard;
