import React from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./components/global/topBar";
import Sidebar from "./components/global/sideBar";
import Dashboard from "./scenes/dashboard/index";
import PatientsList from "./components/patientsList/patientsList";
import TokensCalculation from "./components/tokensCalculationTable/tokensCalculation";
import Invoices from "./scenes/invoices";
import LoginForm from "./components/login/loginForm";
import Form from "./scenes/form";
import PatientTasks from "./components/patientTasks/patientTasks";
import Prediction from "./components/prediction/prediction";
import PrivateRoute from "./components/privateRoute/PrivateRoute";

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
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/predict"
                element={
                  <PrivateRoute>
                    <Prediction />
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
                path="/team"
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
                    <TokensCalculation />
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
                path="/form"
                element={
                  <PrivateRoute>
                    <Form />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
