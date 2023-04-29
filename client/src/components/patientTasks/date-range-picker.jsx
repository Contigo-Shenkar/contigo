import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, InputLabel } from "@mui/material";

export default function DateRangePicker({ setDateRange }) {
  const handleChange = (date, i) => {
    setDateRange((prev) => {
      const dates = [...prev];
      dates[i] = date.$d;
      return dates;
    });
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      dateFormats={{ keyboardDate: "DD/MM/YYYY" }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <InputLabel htmlFor="from-date">From</InputLabel>
        <DatePicker
          id="from-date"
          onChange={(value) => handleChange(value, 0)}
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <InputLabel htmlFor="to-date">To</InputLabel>
        <DatePicker id="to-date" onChange={(value) => handleChange(value, 1)} />
      </Box>
    </LocalizationProvider>
  );
}
