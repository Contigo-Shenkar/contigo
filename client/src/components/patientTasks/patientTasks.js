import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetTasksByPatientIdQuery } from "../../features/apiSlice";
import Task from "../task/task.component";
import { useAddNewPatientTaskMutation } from "../../features/apiSlice";
const PatientTasks = () => {
  const { id } = useParams();
  const [addNewPatientTask] = useAddNewPatientTaskMutation();

  const {
    data: patientTasks,
    refetch: refetchTasks,
    isLoading,
    isError,
  } = useGetTasksByPatientIdQuery({ id: id });
  const [taskType, setTaskType] = useState("regular");
  const [task, setTask] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addNewPatientTask({ task: task, type: taskType, id: id });
    setTask("");
    refetchTasks();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching tasks</div>;
  }
  return (
    <div>
      {patientTasks.map((patientTask, index) => (
        <Task
          key={index}
          patientTask={patientTask}
          refetchTasks={refetchTasks}
        />
        // <p key={index}>{patientTask.task}</p>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <select
          id="task-type-select"
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
        >
          <option value="" disabled>
            Select a task type
          </option>
          <option value="regular">Regular</option>
          <option value="bonus">Bonus</option>
        </select>
        <button type={"submit"}>add task</button>
      </form>
    </div>
  );
};

export default PatientTasks;
