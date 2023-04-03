import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useUpdateTaskStatusMutation } from "../../features/apiSlice";
import {
  useUpdateBagMutation,
  useGetBagQuery,
} from "../../features/firebaseApiSlice";
import { useParams } from "react-router-dom";
import { tokens } from "../../theme";

const Task = ({ patientTask, refetchTasks }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const { data: bagData } = useGetBagQuery();
  const [updateBag] = useUpdateBagMutation();
  const handleComplete = async () => {
    if (patientTask.status !== "completed") {
      await updateTaskStatus({
        patientId: id,
        taskId: patientTask._id,
        status: "completed",
      });
      await updateBag({ tokens: 1, currTokens: bagData.tokens });
      refetchTasks();
    }
  };
  const handleIncomplete = async () => {
    if (patientTask.status !== "not-completed") {
      await updateTaskStatus({
        patientId: id,
        taskId: patientTask._id,
        status: "not-completed",
      });
      refetchTasks();
    }
  };

  return (
    <Card sx={{ marginBottom: 1, backgroundColor: colors.primary[400] }}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body1">
              Task: {patientTask.task} ({patientTask.tokenType} |{" "}
              {patientTask?.taskType})
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="body2"
              color={
                patientTask.status === "completed"
                  ? colors.greenAccent[500]
                  : patientTask.status === "not-completed"
                  ? colors.redAccent[500]
                  : colors.primary[100]
              }
            >
              Status: {patientTask.status}
            </Typography>
          </Grid>
          <Grid item>
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
