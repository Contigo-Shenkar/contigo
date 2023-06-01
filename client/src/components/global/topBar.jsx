import {
  Box,
  IconButton,
  useTheme,
  InputBase,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import {
  useGetPatientsQuery,
  useTokenLoginQuery,
} from "../../features/apiSlice";

const Topbar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { data: patients, isLoading, isError } = useGetPatientsQuery();
  const { data: userData } = useTokenLoginQuery();
  const user = userData?.user;

  console.log("user", user);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    handleMenuClose();
    navigate("/login");
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" p={2}>
        {/* SEARCH BAR */}
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
        >
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
        {/* ICONS */}
        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          <IconButton onClick={() => setOpen(true)}>
            <NotificationsOutlinedIcon sx={{ fill: "red" }} />
          </IconButton>
          <IconButton onClick={handleMenuOpen}>
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton>
            <PersonOutlinedIcon />
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box sx={{ minWidth: "500px" }}>
          <DialogTitle>Latest insights</DialogTitle>
          <DialogContent>
            {patients?.data &&
              patients.data.length > 0 &&
              patients.data
                .filter((p) => String(p.id).includes(user.childId))
                .map((patient, index) => (
                  <Box key={index} sx={{ padding: "10px" }}>
                    <Typography variant="h3">{patient.fullName}</Typography>
                    <Typography variant="h6">
                      {new Date(patient.insights[0].when).toLocaleString(
                        "en-GB"
                      )}
                    </Typography>
                    <Box>
                      {patient.insights.map((insight, index) => {
                        return (
                          <Typography
                            sx={{
                              color: insight.bad === true ? "red" : "green",
                            }}
                          >
                            {insight.text}
                          </Typography>
                        );
                      })}
                    </Box>
                  </Box>
                ))}
            <Typography>:</Typography>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default Topbar;
