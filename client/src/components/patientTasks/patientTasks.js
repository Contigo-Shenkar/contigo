import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetTasksByPatientIdQuery } from "../../features/apiSlice";
import Task from "../task/task.component";
import { useAddNewPatientTaskMutation } from "../../features/apiSlice";
import { tokens } from "../../theme";
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
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useTheme,
} from "@mui/material";

const PatientTasks = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const [addNewPatientTask] = useAddNewPatientTaskMutation();

  const {
    data: patientTasks,
    refetch: refetchTasks,
    isLoading,
    isError,
  } = useGetTasksByPatientIdQuery({ id: id });

  const [open, setOpen] = useState(false);
  const [task, setTask] = useState("");
  const [tokenType, setTokenType] = useState("regular");
  const [taskType, setTaskType] = useState("type1");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddTask = async () => {
    await addNewPatientTask({
      task: task,
      tokenType: tokenType,
      taskType: taskType,
      id: id,
    });
    refetchTasks();
    handleClose();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching tasks</div>;
  }

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item>
            <Typography variant="h4">Tasks</Typography>
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
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Task"
                  fullWidth
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
                <FormControl fullWidth margin="normal">
                  <Select
                    labelId="token-type-select-label"
                    id="token-type-select"
                    value={tokenType}
                    onChange={(e) => setTokenType(e.target.value)}
                  >
                    <MenuItem value="regular">Regular</MenuItem>
                    <MenuItem value="bonus">Bonus</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <Select
                    labelId="task-type-select-label"
                    id="task-type-select"
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                  >
                    <MenuItem value="type1">type1</MenuItem>
                    <MenuItem value="type2">type2</MenuItem>
                    <MenuItem value="type3">type3</MenuItem>
                    <MenuItem value="type4">type4</MenuItem>
                    <MenuItem value="type5">type5</MenuItem>
                    <MenuItem value="type6">type6</MenuItem>
                    <MenuItem value="type7">type7</MenuItem>
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
          </Grid>
        </Grid>
      </Box>
      <Box>
        {patientTasks.map((patientTask, index) => (
          <Task
            key={index}
            patientTask={patientTask}
            refetchTasks={refetchTasks}
          />
        ))}
      </Box>
    </Container>
  );
};

export default PatientTasks;
