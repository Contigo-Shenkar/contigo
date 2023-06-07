import React from "react";
import { CircularProgress } from "@mui/material";

const ProgressCircle = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <CircularProgress color="secondary" />
        </div>
    );
};

export default ProgressCircle;
