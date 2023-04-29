import React from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./components/global/topBar";
import Sidebar from "./components/global/sideBar";
import Dashboard from "./scenes/dashboard/index";
import PatientsList from "./components/patientsList/patientsList";
import TasksMonitoring from "./components/task-monitoring/task-monitoring";
import Invoices from "./scenes/invoices";
import LoginForm from "./components/login/loginForm";
import PatientTasks from "./components/patientTasks/patientTasks";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import { PatientPage } from "./components/patientPage/patientPage";
import AlertNotification from "./components/alert/alertNotification";
import ChildCalendar from "./scenes/calendar/index";
import { BarChart } from "./components/barChart/BarChart";
import PieChart from "./components/pieChart/pieChart";
import LineChart from "./components/lineChart/lineChart";
import ProgressCircle from "./components/progressCircle/ProgressCircle";
import StatBox from "./components/statBox/StatBox";
import { ToastContainer } from "react-toastify";
import { PatientMeds } from "./components/patientPage/patient-meds/patient-meds";

const App = () => {
  const [theme, colorMode] = useMode();
  const isAuthenticated = !!localStorage.getItem("token");
  const location = useLocation();

  const shouldShowSidebar = isAuthenticated && location.pathname !== "/login";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {shouldShowSidebar && <Sidebar />}{" "}
          {/* Conditionally render Sidebar */}
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/predict"
                element={
                  <PrivateRoute>
                    <PatientMeds />
                  </PrivateRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <PrivateRoute>
                    <PatientsList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/patients/:id/tasks"
                element={
                  <PrivateRoute>
                    <PatientTasks />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/patientsList"
                element={
                  <PrivateRoute>
                    <PatientsList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/tokensCalculation"
                element={
                  <PrivateRoute>
                    <TasksMonitoring />
                  </PrivateRoute>
                }
              />
              <Route
                path="/invoices"
                element={
                  <PrivateRoute>
                    <Invoices />
                  </PrivateRoute>
                }
              />

              <Route
                path="/patients/:id"
                element={
                  <PrivateRoute>
                    <PatientPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/alert"
                element={<PrivateRoute>{<AlertNotification />}</PrivateRoute>}
              />

              <Route
                path="/calendar"
                element={<PrivateRoute>{<ChildCalendar />}</PrivateRoute>}
              />

              <Route
                path="/barChart"
                element={<PrivateRoute>{<BarChart />}</PrivateRoute>}
              />

              <Route
                path="/pieChart"
                element={<PrivateRoute>{<PieChart />}</PrivateRoute>}
              />

              <Route
                path="/lineChart"
                element={<PrivateRoute>{<LineChart />}</PrivateRoute>}
              />

              <Route
                path="/dashboard"
                element={<PrivateRoute>{<ProgressCircle />}</PrivateRoute>}
              />

              <Route
                path="/dashboard"
                element={<PrivateRoute>{<StatBox />}</PrivateRoute>}
              />
            </Routes>
          </main>
        </div>
        <ToastContainer
          position="top-right"
          closeOnClick={true}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          autoClose={5000}
          draggable={true}
          closeButton={<p>Close</p>}
          icon={{
            success: <i className="fas fa-check-circle"></i>,
            warning: "⚠️",
            error: "❌",
            default: "ℹ️",
          }}
        />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
