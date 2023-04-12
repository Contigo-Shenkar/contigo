import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useDeletePatientTaskMutation,
  useGetPatientByIdQuery,
  useUpdatePatientMutation,
  useUpdateTaskStatusMutation,
} from "../../features/apiSlice";
import { useAddNewPatientTaskMutation } from "../../features/apiSlice";
import { tokens } from "../../theme";
import DoneIcon from "@mui/icons-material/Done";
import { DataGrid } from "@mui/x-data-grid";
import StatBox from "../../components/statBox/StatBox";

// import icons
import TodayIcon from "@mui/icons-material/Today";
import TokenIcon from "@mui/icons-material/Token";
import BackspaceIcon from "@mui/icons-material/Backspace";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { Card, CardContent, CardHeader, LinearProgress } from "@mui/material";

import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  Avatar,
  Tooltip,
  IconButton,
  Autocomplete,
  TextField,
} from "@mui/material";

import Header from "../header/Header";
import { getRandomAvatar } from "../../data/avatars";
import { STATUSES, regularTasks, taskCategories } from "./tasks";
import { analyzeTasksCompletion } from "../../helpers/analyze-tasks";
import { toast } from "react-toastify";

const gridColumns = [
  {
    field: "taskName",
    headerName: "Task Name",
    flex: 0.9,
    cellClassName: "name-column--cell",
  },
  {
    field: "taskType",
    headerName: "Task type",
    flex: 0.4,
    cellClassName: "name-column--cell",
  },
  {
    field: "taskStatus",
    headerName: "Status",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "tokenType",
    headerName: "Token Type",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "createdAt",
    headerName: "Created Date",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "completedAt",
    headerName: "Date Completed",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "tokens",
    headerName: "Tokens",
    type: "number",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
  },
];

const PatientTasks = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskIdToDelete, setTaskIdToDelete] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskType, setTaskType] = useState("ADHD");
  const theme = useTheme();
  const { id: patientId } = useParams();
  const [addNewPatientTask] = useAddNewPatientTaskMutation();
  const [deletePatientTask] = useDeletePatientTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [updatePatient] = useUpdatePatientMutation();
  const { data, isLoading, isError } = useGetPatientByIdQuery({
    id: patientId,
  });
  const colors = tokens(theme.palette.mode);
  const patient = data?.data;

  const handleClickOpen = () => {
    setIsAddTaskOpen(true);
  };

  const handleClose = () => {
    setIsAddTaskOpen(false);
  };

  const handleAddTask = async () => {
    await addNewPatientTask({
      task: taskName,
      tokenType: taskCategory === regularTasks ? "regular" : "bonus",
      taskType: taskType,
      id: patientId,
    });
    handleClose();
  };

  const handleDeleteTask = async () => {
    await deletePatientTask({
      patientId,
      taskId: taskIdToDelete,
    });
    setIsDeleteTaskOpen(false);
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    await updateTaskStatus({
      patientId,
      taskId,
      status,
    });
    if (status === STATUSES.COMPLETED) {
      const updatedPatient = {
        ...patient,
        tasks: patient.tasks.map((task) => {
          if (task._id === taskId) {
            return { ...task, status: STATUSES.COMPLETED };
          }
          return task;
        }),
      };
      const [analysis] = analyzeTasksCompletion([updatedPatient]);
      if (analysis.isSuccessful) {
        const nextStage = patient.stage + 1;
        toast.success(`Patient has moved to next stage (${nextStage})!`);
        await updatePatient({ patientId, data: { stage: nextStage } });
      }
    }
  };

  const actionsCell = {
    field: "actions",
    headerName: "Actions",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      return (
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Tooltip title="Mark as In Progress" placement="top">
            <IconButton
              edge="end"
              aria-label="tasks"
              onClick={() =>
                handleUpdateTaskStatus(params.row.id, STATUSES.IN_PROGRESS)
              }
            >
              <PlayArrowIcon style={{ width: "24px", height: "24px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mark as Completed" placement="top">
            <IconButton
              edge="end"
              aria-label="tasks"
              onClick={() =>
                handleUpdateTaskStatus(params.row.id, STATUSES.COMPLETED)
              }
            >
              <DoneIcon style={{ width: "24px", height: "24px" }} />
            </IconButton>
          </Tooltip>
        </Box>
      );
    },
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching tasks</div>;
  }
  const tasks = patient.tasks.map((task) => {
    return {
      taskName: task.task,
      taskType: task.taskType,
      taskStatus: task.status,
      tokens: task.status === STATUSES.COMPLETED ? 1 : 0,
      id: task._id,
      tokenType: task.tokenType,
      completedAt: task?.completedAt?.slice(0, 10) || "",
      createdAt: task.createdAt.slice(0, 10),
    };
  });

  const DeleteTaskDialog = (
    <Dialog open={isDeleteTaskOpen} onClose={() => setIsDeleteTaskOpen(false)}>
      <DialogTitle>Delete Task</DialogTitle>
      <DialogContent>
        <Typography>Task from the list:</Typography>
        <FormControl fullWidth margin="normal">
          <Select
            labelId="task-type-select-label"
            id="task-type-select"
            value={taskIdToDelete}
            onChange={(e) => setTaskIdToDelete(e.target.value)}
          >
            {patient.tasks.map((task) => (
              <MenuItem key={task._id} value={task._id}>
                {task.task}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          fullWidth
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: colors.primary[100],
            "&:hover": {
              backgroundColor: colors.greenAccent[800],
            },
          }}
          onClick={handleDeleteTask}
          color="primary"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  const AddTaskDialog = (
    <Dialog open={isAddTaskOpen} onClose={handleClose}>
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <Typography>Task Category</Typography>
        <FormControl fullWidth margin="normal">
          <Select
            labelId="task-type-select-label"
            id="task-type-select"
            value={taskCategory}
            onChange={(e) => setTaskCategory(e.target.value)}
          >
            {Object.keys(taskCategories).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <Typography>Task Name</Typography>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            fullWidth
            options={
              taskCategories[taskCategory]?.map((task) => ({
                label: task,
              })) || []
            }
            onChange={(e, value) => setTaskName(value?.label)}
            renderInput={(params) => <TextField {...params} />}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Typography>Diagnosis</Typography>

          <Select
            labelId="task-type-select-label"
            id="task-type-select"
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
          >
            {patient.diagnosis.map((diagnosis) => (
              <MenuItem key={diagnosis} value={diagnosis}>
                {diagnosis}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          fullWidth
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: colors.primary[100],
            "&:hover": {
              backgroundColor: colors.greenAccent[800],
            },
          }}
          onClick={handleAddTask}
          color="primary"
        >
          Add
        </Button>
        {/*<Button onClick={handleClose}>Cancel</Button>*/}
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth="m" sx={{ padding: "0 40px" }}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        gap="15px"
      >
        <Grid item>
          <Avatar
            src={getRandomAvatar()}
            sx={{
              height: 60,
              mr: 2,
              width: 60,
            }}
          />
        </Grid>

        <Grid item flex={1}>
          <Header
            title="Tokens Based on Tasks"
            subtitle="Managing Token's based on tasks and tokens"
            mb={0}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.primary[100],
              "&:hover": {
                backgroundColor: colors.greenAccent[800],
              },
            }}
            onClick={handleClickOpen}
          >
            Add Task
          </Button>
          {AddTaskDialog}
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.primary[100],
              "&:hover": {
                backgroundColor: colors.greenAccent[800],
              },
            }}
            onClick={() => setIsDeleteTaskOpen(true)}
          >
            Delete Task
          </Button>
          {DeleteTaskDialog}
        </Grid>
      </Grid>

      {/* Table tokens based on tasks */}
      <Box
        m="40px 0 0 0"
        height="60vh"
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
          rows={tasks}
          key={(row) => row.id}
          columns={[...gridColumns, actionsCell]}
        />
        {/* Total tokens calculation 
        {/* Headline */}
        <Grid item flex={1}>
          <Header
            title="Check Your Total Tokens"
            subtitle="View your total token's based per a day,week,month"
            mb={3}
          />
        </Grid>
        <Grid item></Grid>

        {/* Sum of one day */}
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box
            width="400px"
            height="400px"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title="Total token per a Day"
              subtitle="Choose Date:"
              progress="0.75"
              increase="+14%"
              icon={
                <TodayIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
                />
              }
            />
          </Box>
          <Box
            width="400px"
            height="400px"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title="Total tokens per a Week"
              subtitle="Choose Date:"
              progress="0.50"
              increase="+21%"
              icon={
                <DateRangeIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
                />
              }
            />
          </Box>
          <Box
            width="400px"
            height="400px"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title="Total token per a Month"
              subtitle="Choose Date:"
              progress="0.90"
              increase="+9%"
              icon={
                <CalendarMonthIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
                />
              }
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default PatientTasks;
