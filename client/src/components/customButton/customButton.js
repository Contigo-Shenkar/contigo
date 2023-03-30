import React from "react";
import { Button, CircularProgress, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const CustomButton = ({ children, isLoading, ...props }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Button

      variant="contained"
      sx={{
        mt: 3,
        mb: 2,
        backgroundColor: colors.greenAccent[600],
        color: colors.primary[100],
        "&:hover": {
          backgroundColor: colors.greenAccent[800],
        },
      }}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <CircularProgress size={24} color="secondary" /> : children}
    </Button>
  );
};

export default CustomButton;
