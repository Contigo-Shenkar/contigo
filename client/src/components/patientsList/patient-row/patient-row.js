import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  useTheme,
  Avatar,
  Tooltip,
} from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box } from "@mui/system";
import { tokens } from "../../../theme";
import { Link } from "react-router-dom";
import { useDeletePatientMutation } from "../../../features/apiSlice";

const PatientRow = ({ patient }) => {
  const theme = useTheme();
  const [deletePatient] = useDeletePatientMutation();
  const colors = tokens(theme.palette.mode);

  const handleDeletePatient = () => {
    deletePatient(patient._id);
  };

  return (
    <Card style={{ marginBottom: "20px", background: colors.primary[400] }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            padding: "0 10px",
          }}
        >
          <Avatar
            src={patient.imageUrl || "/assets/avatars/avatar-placeholder.png"}
            sx={{
              height: 50,
              mr: 2,
              width: 50,
            }}
          />

          <Link
            to={`/patients/${patient._id}`}
            style={{ textDecoration: "none" }}
          >
            <Typography
              variant="p"
              component="div"
              flexGrow={1}
              style={{ color: colors.grey[300], fontSize: "18px" }}
            >
              Child name:
            </Typography>
            <Typography
              variant="h6"
              component="div"
              flexGrow={1}
              style={{ color: colors.greenAccent[400], fontSize: "18px" }}
            >
              {patient.fullName}
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          <Link
            to={`/patients/${patient._id}/tasks`}
            style={{ textDecoration: "none" }}
            state={{ patient }}
          >
            <Tooltip title="Add Tokens" placement="top">
              <IconButton edge="end" aria-label="tasks">
                <AddTaskIcon style={{ width: "24px", height: "24px" }} />
              </IconButton>
            </Tooltip>
          </Link>
          <Tooltip title="Delete Patient" placement="top">
            <IconButton edge="end" onClick={handleDeletePatient}>
              <DeleteOutlineIcon style={{ width: "24px", height: "24px" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PatientRow;
