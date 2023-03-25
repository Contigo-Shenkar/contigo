import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useUpdateTaskStatusMutation } from "../../features/apiSlice";
import {
  useUpdateBagMutation,
  useGetBagQuery,
} from "../../features/firebaseApiSlice";
import { useParams } from "react-router-dom";

const Task = ({ patientTask, refetchTasks }) => {
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
    <>
      <p>{`task: ${patientTask.task} (${patientTask.type})   status: ${patientTask.status}`}</p>
      <CheckIcon onClick={handleComplete} style={{ cursor: "pointer" }} />
      <ClearIcon onClick={handleIncomplete} style={{ cursor: "pointer" }} />
    </>
  );
};

export default Task;
