import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useDeletePatientTaskMutation,
  useGetPatientByIdQuery,
  useGetPatientsQuery,
  useUpdateTaskStatusMutation,
} from "../../features/apiSlice";
import { useAddNewPatientTaskMutation } from "../../features/apiSlice";
import { tokens } from "../../theme";
import DoneIcon from "@mui/icons-material/Done";
import { DataGrid } from "@mui/x-data-grid";
import StatBox from "../../components/statBox/StatBox";

// import icons
import TodayIcon from "@mui/icons-material/Today";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";

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
  InputLabel,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  OutlinedInput,
} from "@mui/material";

import { toast } from "react-toastify";
import Header from "../../components/header/Header";
import {
  STATUSES,
  regularTasks,
  taskCategories,
} from "../../components/patientTasks/tasks";
import { analyzeTasksCompletion } from "../../helpers/analyze-tasks";

const ALL_STATUSES = "all-statuses";

export const Reviews = () => {
  const { data, isLoading, isError } = useGetPatientsQuery();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const patients = data?.data;
  //////////////////////////////////////////////////

  const rows = useMemo(() => {
    if (!patients) return [];
    return patients.map((patient) => {
      // console.log(patient.reviews);
      const lastReview = patient.reviews[patient.reviews.length - 1];
      // console.log("lastReview", lastReview);
      const lastReviewDate = lastReview?.createdAt || lastReview?.date || null;
      return {
        ...patient,
        lastReviewDate: lastReviewDate
          ? new Date(lastReviewDate).toLocaleDateString()
          : "-",
        lastReviewContent: lastReview?.content || "-",
      };
    });
  }, [patients]);

  //////////////////////////////////////////////////

  const columns = [
    {
      field: "fullName",
      headerName: "Name",
      cellClassName: "name-column--cell",
      minWidth: 200,
      renderCell: (params) => {
        return (
          <Box display={"flex"} alignItems={"center"} gap={1}>
            <img
              height={40}
              width={40}
              src={params.row.imageUrl}
              alt={params.value}
              style={{ borderRadius: "50px" }}
            />
            <Link
              to={`/patients/${params.row._id}`}
              style={{ color: colors.greenAccent[300], textDecoration: "none" }}
            >
              {params.value}
            </Link>
          </Box>
        );
      },
    },
    {
      field: "lastReviewDate",
      headerName: "Last review date",
      type: "number",
      align: "center",
    },
    {
      field: "lastReviewContent",
      headerName: "Last review Content",
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching tasks</div>;
  }

  return (
    <Box m="20px">
      <Header
        title="Patients Tasks Monitoring"
        subtitle="Managing a tokens calculation system for the Children’s Psychiatric Unit "
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
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
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};
