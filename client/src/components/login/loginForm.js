import { useState, useEffect } from "react";
import { useLoginMutation } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import jwtDecode from "jwt-decode";

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp && decoded.exp < currentTime) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

export default function LoginForm() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [
    login,
    { data, isLoading, error: loginError, isSuccess: isLoginSuccess },
  ] = useLoginMutation({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (email && password) {
        await login({ email, password });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isLoginSuccess && data) {
      console.log(data);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    }
  }, [isLoginSuccess, data, navigate]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: colors.primary[200] }}
        >
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {loginError && (
            <Typography color="error" sx={{ mb: 1 }}>
              {loginError.message}
            </Typography>
          )}
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              style: { color: colors.grey[200] },
            }}
            sx={{
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary[200],
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: colors.primary[200],
                },
            }}
          />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              style: { color: colors.grey[200] },
            }}
            sx={{
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary[200],
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: colors.primary[200],
                },
            }}
          />
          <Button
            type="submit"
            fullWidth
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
          >
            {isLoading ? (
              <CircularProgress size={24} color="secondary" />
            ) : (
              "Login"
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
