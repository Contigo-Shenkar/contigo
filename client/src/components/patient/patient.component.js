import React from "react";

const Patient = ({patient}) => {
  return (
    <div>
      <p>{patient.fullName}</p>
        <a href={`/patients/${patient._id}/tasks`}>tasks</a>
    </div>
  );
};

export default Patient;
