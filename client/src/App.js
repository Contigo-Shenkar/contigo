import React from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./components/global/topBar";
import Sidebar from "./components/global/sideBar";
import Dashboard from "./scenes/dashboard/index";
import PatientsList from "./components/patientsList/patientsList";
import Contacts from "./scenes/contacts";
import Invoices from "./scenes/invoices";
import LoginForm from "./components/login/loginForm";

// import Bar from "./scenes/bar";
import Form from "./scenes/form";
import PatientTasks from "./components/patientTasks/patientTasks";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// import FAQ from "./scenes/faq";
// import Geography from "./scenes/geography";
// import Calender from "./scenes/calender";

const App = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/patients" element={<PatientsList />} />
              <Route path="/patients/:id/tasks" element={<PatientTasks />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/team" element={<PatientsList />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              {/* <Route path="/bar" element ={<Bar/>}/>  */}
              <Route path="/form" element={<Form />} />
              {/* <Route path="/line" element ={<Line/>}/> */}
              {/* <Route path="/pie" element ={<Pie/>}/> */}
              {/* <Route path="/faq" element ={<FAQ/>}/> */}
              {/* <Route path="/geography" element ={<Geography/>}/> */}
              {/* <Route path="/calender" element ={<Calender/>}/> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
