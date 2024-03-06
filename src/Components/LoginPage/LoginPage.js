import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../Store/Slices/Auth";
import { GET_SENDER_COMPANY, LOGIN_USER } from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";

const theme = createTheme();

export default function LoginPage() {
  const { user, token, loading, success } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (success) {
      localStorage.setItem("token", "Bearer " + token);
      dispatch({ type: GET_SENDER_COMPANY });
      navigate("/invoices");
    }
  }, [success, user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.removeItem("sender");
    const data = new FormData(event.currentTarget);
    const credentials = {
      email: data.get("email"),
      password: data.get("password"),
    };

    if (!credentials.email || !credentials.password) {
      toast.error("Please enter email and password", {
        toastId: "LOGIN",
      });
      return;
    }

    dispatch(setLoading(true));
    dispatch({
      type: LOGIN_USER,
      payload: credentials,
    });
  };

  return (
    <>
      <Spinner loading={loading} />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs" className="minHeight">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}
