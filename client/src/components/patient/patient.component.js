import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { Box } from "@mui/system";
import { tokens } from "../../theme";

const Patient = ({ patient }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Card style={{ marginBottom: "16px", background: colors.primary[400]}}>
      <CardContent>
        <Box display="flex" alignItems="center">
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
