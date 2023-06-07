import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useGetPatientsQuery,
  useTokenLoginQuery,
} from "../../features/apiSlice";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";

// import icons

import { Box, useTheme } from "@mui/material";

import Header from "../../components/header/Header";
import ProgressCircle from "../../components/progressCircle/ProgressCircle";

export const Reviews = () => {
  const { data, isLoading, isError } = useGetPatientsQuery();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const patients = data?.data;
  const { data: userData } = useTokenLoginQuery();
  const user = userData?.user;
  //////////////////////////////////////////////////

  const rows = useMemo(() => {
    if (!patients) return [];
    return patients
      .filter((p) => String(p.id).includes(user.childId))
      .map((patient) => {
        // console.log(patient.reviews);
        const lastReview = patient.reviews[patient.reviews.length - 1];
        // console.log("lastReview", lastReview);
        const lastReviewDate =
          lastReview?.createdAt || lastReview?.date || null;
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
              style={{ borderRadius: "50px", height: "40px" }}
            />
            <Link
              to={`/patients/${params.row._id}/review-and-meds`}
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
    return <ProgressCircle />;
  }

  if (isError) {
    return <div>Error fetching tasks</div>;
  }

  return (
    <Box m="20px">
      <Header
        title="Children Reviews"
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
