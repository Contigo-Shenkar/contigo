import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import {
  useGetPatientByIdQuery,
  useUpdateTaskStatusMutation,
} from "../../features/apiSlice";
import {
  useUpdateBagMutation,
  useGetBagQuery,
} from "../../features/firebaseApiSlice";
import { useParams } from "react-router-dom";
import { tokens } from "../../theme";
import Header from "../header/Header";
import { analyzeTasks } from "../patientInfo/patientInfo";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { STATUSES } from "../patientTasks/tasks";
import ProgressCircle from "../progressCircle/ProgressCircle";

const Task = ({ patientTask, refetchTasks }) => {
  const { id } = useParams();

  const { data: patient, isLoading } = useGetPatientByIdQuery({ id: id });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const { data: bagData } = useGetBagQuery();
  const [updateBag] = useUpdateBagMutation();

  const handleComplete = async () => {
    if (patientTask.status !== STATUSES.COMPLETED) {
      await updateTaskStatus({
        patientId: id,
        taskId: patientTask._id,
        status: STATUSES.COMPLETED,
      });
      await updateBag({ tokens: 1, currTokens: bagData.tokens });
      refetchTasks();
    }
  };
  const handleIncomplete = async () => {
    if (patientTask.status !== STATUSES.IN_PROGRESS) {
      await updateTaskStatus({
        patientId: id,
        taskId: patientTask._id,
        status: STATUSES.IN_PROGRESS,
      });
      refetchTasks();
    }
  };

  if (isLoading) {
    return <ProgressCircle />;
  }

  return (
    <Card
      sx={{
        marginBottom: 1,
        backgroundColor: colors.primary[400],
        fontSize: "14px",
      }}
    >
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={7}>
            <Typography variant="body1" sx={{ fontSize: "16px" }}>
              <span style={{ textDecoration: "underline", fontWeight: 600 }}>
                Task
              </span>
              :
              <div>
                {patientTask.task} ({patientTask.tokenType} |{" "}
                {patientTask?.taskType})
              </div>
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography
              variant="body2"
              color={
                patientTask.status === STATUSES.COMPLETED
                  ? colors.greenAccent[500]
                  : patientTask.status === STATUSES.IN_PROGRESS
                  ? colors.redAccent[500]
                  : colors.primary[100]
              }
            >
              Status: {patientTask.status}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Box>
              <IconButton onClick={handleComplete}>
                <CheckIcon />
              </IconButton>
              <IconButton onClick={handleIncomplete}>
                <ClearIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Task;
