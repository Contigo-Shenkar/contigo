import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { toast } from "react-toastify";
import { colors } from "../helpers/colors";
import Header from "../components/header/Header";
// import icons
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import TokenIcon from "@mui/icons-material/Token";
import VaccinesIcon from "@mui/icons-material/Vaccines";
//import charts for dashboard
import ProgressCircle from "../components/progressCircle/ProgressCircle";
import LineChart from "../components/lineChart/lineChart";
import StatBox from "../components/statBox/StatBox";
import PieChart from "../components/pieChart/pieChart";
import { useGetPatientsQuery, useTokenLoginQuery } from "../features/apiSlice";
import { useEffect, useMemo, useState } from "react";
import { getDayAndMonth, getPast7Days, isLastXDays } from "../helpers/dates";
import { IMAGE_PLACEHOLDER } from "../helpers/images";

import { Link } from "react-router-dom";
import { getLineData } from "../components/lineChart/get-line-data";
import { getInsights } from "../components/patientPage/patientPage";

const thirdRowSpan = 3;

const Dashboard = () => {
  const [recentlyVisited, setRecentlyVisited] = useState([]);
  const theme = useTheme();
  const themeColors = tokens(theme.palette.mode);
  const { data, isLoading } = useGetPatientsQuery();
  const patients = data?.data;
  const { data: userData } = useTokenLoginQuery();
  const user = userData?.user;

  useEffect(() => {
    const recentlyVisited =
      JSON.parse(localStorage.getItem("recentlyVisited")) || [];
    if (recentlyVisited.length > 0) {
      setRecentlyVisited(recentlyVisited);
    }

    toast.error("Please notice important insights about your patients below.");
  }, []);

  const dashboardData = useMemo(() => {
    if (!patients || !user) return {};

    const filteredPatient = patients.filter((p) =>
      String(p.id).includes(user.childId)
    );

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
    const pastWeekCompletedTasksImages = new Set();
    const bonusThisWeek = {};
    let currentlyInProgressTasks = 0;
    let totalTasks = 0;
    let newPatientsThisWeek = 0;
    const newPatientsImages = [];
    let newReviewsThisWeek = 0;
    const insights = [];

    for (const patient of filteredPatient) {
      const { insights: patientInsights } = getInsights({ data: patient });
      insights.push(patientInsights);
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
        newPatientsImages.push(patient.imageUrl);
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
            pastWeekCompletedTasksImages.add(patient.imageUrl);
            if (task.tokenType === "bonus") {
              bonusThisWeek[patient.imageUrl] =
                (bonusThisWeek[patient.imageUrl] || 0) + 1;
            }
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
        color: themeColors[stagesPieData.length],
      });
    }
    const pastWeekCompletedTasksImagesArr = Array.from(
      pastWeekCompletedTasksImages
    );

    const maxBonus = Math.max(Object.values(bonusThisWeek));
    const bestBonusImage = Object.keys(bonusThisWeek).find(
      (key) => bonusThisWeek[key] === maxBonus
    );

    return {
      stages,
      stagesPieData,
      completedTasks,
      totalTasks,
      pastWeekCompletedTasks,
      currentlyInProgressTasks,
      newPatientsThisWeek,
      newPatientsImages,
      newReviewsThisWeek,
      last7days,
      pastWeekCompletedTasksImages: pastWeekCompletedTasksImagesArr,
      bestBonusImage,
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
      insights,
    };
  }, [patients, themeColors, user]);

  if (isLoading) {
    return <ProgressCircle />;
  }

  console.log({ dashboardData });
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dashboard" subtitle="Welcome to your dashboard" />
      </Box>

      {user?.childId ? (
        <Box my={2}>
          <Typography>
            Showing data for patient with id: {user?.childId}
          </Typography>
        </Box>
      ) : null}

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
            increase=""
            images={dashboardData.newPatientsImages}
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
            title={`Most bonus tasks`}
            subtitle="Patient of the week"
            increase=""
            images={[dashboardData.bestBonusImage]}
            icon={
              <FamilyRestroomIcon
                sx={{ color: themeColors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn={user?.childId ? "span 12" : "span 8"}
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
            <Typography
              variant="h5"
              fontWeight="600"
              p="30px 0 0 30px"
              ml="30px"
            >
              Completed tasks per stages
            </Typography>
            <LineChart
              isDashboard={true}
              data={[
                dashboardData.patientPerMonth,
                dashboardData.completedTasksPerMonth,
              ]}
            />
          </Box>
        </Box>
        {!user?.childId ? (
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
              const patient = patients?.find((p) => p._id === patientId);
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
        ) : null}

        {/* ROW 3 */}
        {/* <Box
          gridColumn="span 4"
          gridRow={`span ${thirdRowSpan}`}
          backgroundColor={themeColors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Notifications of children failures
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size={100 * thirdRowSpan} />
            <Typography
              variant="h5"
              color={themeColors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box> */}
        {/* <Box
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
        </Box> */}
        <Box
          gridColumn="span 6"
          gridRow={`span ${thirdRowSpan}`}
          backgroundColor={themeColors.primary[400]}
          padding="20px 0 20px 20px"
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
        <Box
          gridColumn="span 6"
          gridRow={`span ${thirdRowSpan + 1}`}
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
              Last insights
            </Typography>
          </Box>
          {dashboardData?.insights?.map((insights, index) => {
            const patient = patients[index];
            if (!patient) return null;
            return (
              <Box
                key={index}
                display="flex"
                // justifyContent="space-between"
                alignItems="center"
                gap="20px"
                borderBottom={`4px solid ${themeColors.primary[500]}`}
                p="15px"
              >
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={"10px"}
                  width={"150px"}
                >
                  <img
                    src={patient.imageUrl || IMAGE_PLACEHOLDER}
                    alt="profile"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      objectPosition: "top",
                      borderRadius: "50%",
                      maxWidth: "unset",
                      border: `3px solid ${themeColors.greenAccent[500]}`,
                    }}
                  />
                  <Typography color={themeColors.grey[100]}>
                    {patient.fullName}
                  </Typography>
                </Box>
                <Box>
                  {insights.map((insight, index) => {
                    return (
                      <Typography
                        key={index}
                        color={themeColors.redAccent[300]}
                        sx={{ display: "block" }}
                      >
                        {insight}
                      </Typography>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
export default Dashboard;
