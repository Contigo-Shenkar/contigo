import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  useTheme,
  Avatar,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Box } from "@mui/system";
import { tokens } from "../../theme";
import { Link } from "react-router-dom";

const avatarUrls = [
  "../../assets/avatars/avatar-miron-vitold.png",
  "../../assets/avatars/avatar-marcus-finn.png",
  "../../assets/avatars/avatar-iulia-albu.png",
  "../../assets/avatars/avatar-alcides-antonio.png",
  "../../assets/avatars/avatar-neha-punita.png",
  "../../assets/avatars/avatar-carson-darrin.png",
  "../../assets/avatars/avatar-seo-hyeon-ji.png",
  "../../assets/avatars/avatar-jie-yan-song.png",
  "../../assets/avatars/avatar-chinasa-neo.png",
];

const Patient = ({ patient }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Card style={{ marginBottom: "20px", background: colors.primary[400] }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={avatarUrls[Math.floor(Math.random() * avatarUrls.length)]}
            sx={{
              height: 40,
              mr: 2,
              width: 40,
            }}
          />

          <Link
            to={`/patients/${patient._id}`}
            style={{ textDecoration: "none" }}
          >
            <Typography
              variant="h6"
              component="div"
              flexGrow={1}
              style={{ color: colors.greenAccent[400] }}
            >
              {patient.fullName}
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          <Link to={`/patients/${patient._id}/tasks`} style={{textDecoration:'none'}}>
            <IconButton edge="end" aria-label="tasks">
              <ListAltIcon />
            </IconButton>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Patient;
