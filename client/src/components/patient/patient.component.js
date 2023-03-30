import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  useTheme,
  Avatar
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Box } from "@mui/system";
import { tokens } from "../../theme";

const avatarUrls = [
  '../../assets/avatars/avatar-miron-vitold.png',
  '../../assets/avatars/avatar-marcus-finn.png',
  '../../assets/avatars/avatar-iulia-albu.png',
  '../../assets/avatars/avatar-alcides-antonio.png',
  '../../assets/avatars/avatar-neha-punita.png',
  '../../assets/avatars/avatar-carson-darrin.png',
  '../../assets/avatars/avatar-seo-hyeon-ji.png',
  '../../assets/avatars/avatar-jie-yan-song.png',
  '../../assets/avatars/avatar-chinasa-neo.png',
  
];

const Patient = ({ patient }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <Card style={{ marginBottom: "20px", background: colors.primary[400]}}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Avatar 
            src={avatarUrls[Math.floor(Math.random() * avatarUrls.length)]}
            sx={{
              height: 60,
              mb: 1,
              width: 60
            }}
          />
          <Typography variant="h6" component="div" flexGrow={1} style={{color:colors.greenAccent[400]}}>
            {patient.fullName}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="tasks"
            href={`/patients/${patient._id}/tasks`}
          >
            <ListAltIcon />
          </IconButton>
          
        </Box>
      </CardContent>
    </Card>
  );
};

export default Patient;
