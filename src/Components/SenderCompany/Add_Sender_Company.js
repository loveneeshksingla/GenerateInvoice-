import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProtectedRoute from "../../Routes/ProtectedRoute";
import { checkAllfieldsFilled } from "../../CommonComponents/checkAllFieldsFilled";
import { getsenderCompanyPayload } from "../../CommonComponents/senderCompanyPayload";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../Store/Slices/SenderCompanyInfo";
import {
  GET_SENDER_COMPANY,
  SAVE_SENDER_COMPANY,
  UPDATE_SENDER_COMPANY,
} from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";
import { Footer } from "../Footer/Footer";
import { Navbar } from "../Navbar/Navbar";

const theme = createTheme();
let sender_company;
export default function Add_Sender_Company() {
  const dispatch = useDispatch();
  const [senderCompany, setSenderCompany] = React.useState({
    name: "",
    location: "",
    phone: "",
    pan: "",
    bank_name: "",
    bank_account_holder_name: "",
    bank_account_no: "",
    bank_ifsc_code: "",
    email: "",
  });
  const [isSenderExist, setIsSenderExist] = React.useState(false);
  const { loading } = useSelector((state) => state.senderCompanyInfo);
  const [error, setError] = React.useState({ email: "", phone: "" });

  React.useEffect(() => {
    sender_company = JSON.parse(localStorage.getItem("sender"));
    {
      sender_company && setSenderCompany(sender_company);
      setIsSenderExist(true);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = getsenderCompanyPayload(data);
    const isValidPayload = checkAllfieldsFilled(payload);
    if (!isValidPayload) {
      toast.error("Please fill all the fields", {
        toastId: "sender_form",
      });
      return;
    }
    dispatch(setLoading(true));

    if (isSenderExist) {
      payload.id = sender_company.id;
      dispatch({
        type: UPDATE_SENDER_COMPANY,
        payload,
      });
      return;
    }

    dispatch({
      type: SAVE_SENDER_COMPANY,
      payload,
    });
  };

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleInput = (e) => {
    if (e.target.name === "email") {
      if (e.target.value !== "" && !isValidEmail(e.target.value)) {
        setError({ ...error, email: "Email is invalid" });
      } else {
        setError({ ...error, email: "" });
      }
    }
    if (e.target.name === "phone") {
      if (
        e.target.value !== "" &&
        (e.target.value.length > 10 || e.target.value.length < 10)
      ) {
        setError({
          ...error,
          phone: "Phone number must be atleast 10 numbers",
        });
      } else {
        setError({ ...error, phone: "" });
      }
    }
    setSenderCompany({ ...senderCompany, [e.target.name]: e.target.value });
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <Spinner loading={loading} />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs" className="minHeight">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 11,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              {isSenderExist ? "Update Company Info" : "Add Company Info"}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="companyName"
                    label="Company Name"
                    name="name"
                    autoComplete="companyName"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    value={senderCompany.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    value={senderCompany.email}
                  />
                  <Typography className="errorStyle">{error.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="address"
                    label="Address"
                    name="location"
                    autoComplete="address"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    value={senderCompany.location}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="phone"
                    label="Phone"
                    name="phone"
                    autoComplete="phone"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    value={senderCompany.phone}
                  />
                  <Typography className="errorStyle">{error.phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="pan"
                    label="PAN NUMBER"
                    name="pan"
                    autoComplete="pan"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    value={senderCompany.pan}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="acc_no"
                    label="ACCOUNT NUMBER"
                    name="bank_account_no"
                    autoComplete="acc_no"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    value={senderCompany.bank_account_no}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="accHolderName"
                    label="ACCOUNT HOLDER NAME"
                    name="bank_account_holder_name"
                    autoComplete="accHolderName"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    value={senderCompany.bank_account_holder_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="bankName"
                    label="BANK NAME"
                    name="bank_name"
                    autoComplete="bankName"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    value={senderCompany.bank_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="ifsc"
                    label="IFSC"
                    name="bank_ifsc_code"
                    autoComplete="ifsc"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    value={senderCompany.bank_ifsc_code}
                  />
                </Grid>
              </Grid>
              <Box mt={3}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mb: 2 }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
      <Footer />
    </ProtectedRoute>
  );
}
