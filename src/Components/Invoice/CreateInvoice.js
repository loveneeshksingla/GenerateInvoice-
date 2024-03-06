import { Button, Container, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import InputLabel from "@mui/material/InputLabel";

import ProtectedRoute from "../../Routes/ProtectedRoute";
import Spinner from "../Spinner/Spinner";
import { CreateInvoiceRight } from "./CreateInvoiceRight";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../Store/Slices/Invoice";
import { GET_CLIENTS, GET_INVOICE } from "../../Store/Action_Constants";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import moment from "moment";

const theme = createTheme();

export const CreateInvoice = () => {
  let currentDate = moment(new Date()).format("MMM DD YYYY");
  const dispatch = useDispatch();
  const [invoiceDate, setInvoiceDate] = React.useState(currentDate);
  const [dueDate, setDueDate] = React.useState("");
  const [isTaskToUpdate, setIsTaskToUpdate] = useState(false);
  const [shareInvoiceWith, setShareInvoiceWith] = useState("");
  const [indexOfTaskToUpdate, setIndexOfTaskToUpdate] = useState();
  const [show_sender_bank_details, set_show_sender_bank_details] =
    useState(true);
  const [error, setError] = React.useState({ email: "" });
  const { clients } = useSelector((state) => state.clients);
  const { invoiceCreating, invoiceToUpdate } = useSelector(
    (state) => state.invoices
  );
  const [selectedClient, setSelectedClient] = React.useState({
    id: "",
    index: "",
    name: "",
    companyName: "",
  });
  const [taskInfo, setTaskInfo] = React.useState({
    taskName: "",
    hourly_units_worked: "",
    totalPrice: "",
    type: "",
  });
  const [tasks, setTasks] = React.useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currencyType, setCurrencyType] = useState("");
  const [currency_symbol, set_currency_symbol] = useState("");
  const navigate = useNavigate();
  const handleDateChange = (newValue) => {
    setInvoiceDate(newValue);
  };
  const { invoiceId } = useParams();
  const handleDueDateChange = (newValue) => {
    setDueDate(newValue);
  };
  const isInvoiceCreating = JSON.parse(localStorage.getItem("invoicecreating"));

  React.useEffect(() => {
    if (invoiceId) {
      dispatch(setLoading(true));
      dispatch({ type: GET_INVOICE, payload: invoiceId });
    }
  }, []);

  React.useEffect(() => {
    if (invoiceToUpdate && invoiceId) {
      setShareInvoiceWith(invoiceToUpdate.shareInvoiceWithEmail);
      setTasks(invoiceToUpdate.task_detail);
      setTotalAmount(Number(invoiceToUpdate.invoicetotalvalue));
      setInvoiceDate(invoiceToUpdate.invoicedate);
      setDueDate(invoiceToUpdate.duedate);
      setSelectedClient({
        id: invoiceToUpdate?.client_detail?.id,
        index: invoiceToUpdate?.client_detail?.id,
        name: invoiceToUpdate?.client_detail?.name,
        companyName: invoiceToUpdate?.client_detail?.companyname,
      });

      set_show_sender_bank_details(
        invoiceToUpdate.show_sender_bank_details === "0" ? false : true
      );
      setCurrencyType(
        invoiceToUpdate.currency_type + " " + invoiceToUpdate.currency_symbol
      );
      set_currency_symbol(invoiceToUpdate.currency_symbol);
    }
  }, [invoiceToUpdate]);

  React.useEffect(() => {
    if (
      !invoiceCreating &&
      (!isInvoiceCreating || isInvoiceCreating === "false")
    ) {
      navigate("/invoices");
    }
  }, [invoiceCreating]);

  React.useEffect(() => {
    dispatch({ type: GET_CLIENTS });
  }, []);

  const handleChange = (event) => {
    const sel_client = clients.find(
      (client) => client.id === event.target.value
    );

    setSelectedClient({
      id: sel_client.id,
      name: sel_client.name,
      index: event.target.value,
      companyName: sel_client.companyname,
    });
  };

  const renderClients = () => {
    return clients.map((client, ind) => {
      return (
        <MenuItem value={client.id} key={ind}>
          {client.name}
        </MenuItem>
      );
    });
  };

  const handleInput = (event) => {
    const re = /[0-9]+/g;
    if (
      event.target.name === "totalPrice" ||
      event.target.name === "hourly_units_worked"
    ) {
      if (event.target.value === "" || re.test(event.target.value)) {
        setTaskInfo({ ...taskInfo, [event.target.name]: event.target.value });
      } else {
        return;
      }
    }
    setTaskInfo({ ...taskInfo, [event.target.name]: event.target.value });
  };

  const handleTaskType = (event) => {
    setTaskInfo({ ...taskInfo, type: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isTaskToUpdate) {
      setTasks([...tasks, taskInfo]);
      let amount = totalAmount;
      amount += Number(taskInfo.totalPrice);
      setTotalAmount(amount);
    } else {
      const all_tasks = [...tasks];
      const taskToUpdate = all_tasks[indexOfTaskToUpdate];
      all_tasks[indexOfTaskToUpdate] = taskInfo;
      let amount = totalAmount;
      amount += Number(taskInfo.totalPrice) - Number(taskToUpdate.totalPrice);
      setTotalAmount(amount);
      setIsTaskToUpdate(false);
      setTasks(all_tasks);
    }
    setTaskInfo({
      taskName: "",
      hourly_units_worked: "",
      totalPrice: "",
      type: "",
    });
  };

  const editTask = (index) => {
    const taskToUpdate = tasks[index];
    setTaskInfo(taskToUpdate);
    setIsTaskToUpdate(true);
    setIndexOfTaskToUpdate(index);
  };

  const deleteTask = async (index) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this task?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (!willDelete) return;
    const allTasks = [...tasks];
    const taskToDelete = tasks[index];
    const total_amount = Number(totalAmount) - Number(taskToDelete.totalPrice);
    allTasks.splice(index, 1);
    setTasks(allTasks);
    setTotalAmount(total_amount);
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleCurrencyType = (event) => {
    set_currency_symbol(event.target.value.slice(4));
    setCurrencyType(event.target.value);
  };

  const handle_show_sender_bank_details = () => {
    set_show_sender_bank_details(!show_sender_bank_details);
  };

  const handleEmail = (event) => {
    if (event.target.value !== "" && !isValidEmail(event.target.value)) {
      setError({ ...error, email: "Email is invalid" });
    } else {
      setError({ ...error, email: "" });
    }
    setShareInvoiceWith(event.target.value);
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <Spinner loading={false} />
      <ThemeProvider theme={theme}>
        <Container
          component="main"
          sx={{ marginTop: 8 }}
          className="min_height create_invoice"
        >
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "40%",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select client
                  </InputLabel>
                  <Select
                    labelId="selected_client"
                    id="selected_client"
                    value={selectedClient.index}
                    label="selected_client"
                    onChange={handleChange}
                  >
                    {renderClients()}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <TextField
              fullWidth
              id="shareInvoiceWith"
              label="Share Invoice To Email"
              name="shareInvoiceWith"
              autoComplete="shareInvoiceWith"
              sx={{ marginTop: 2, width: "87%" }}
              inputProps={{ sx: { height: 10, marginTop: 1 } }}
              onChange={handleEmail}
              value={shareInvoiceWith}
            />
            <Typography className="emailError">{error.email}</Typography>
            <Box className="date_picker" mt={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3}>
                  <DesktopDatePicker
                    label="Invoice Date"
                    inputFormat="MM/DD/YYYY"
                    value={invoiceDate}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3}>
                  <DesktopDatePicker
                    label="Due Date"
                    inputFormat="MM/DD/YYYY"
                    value={dueDate}
                    onChange={handleDueDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </Box>
            <FormControl sx={{ width: "87%", marginTop: 2 }}>
              <InputLabel id="demo-simple-select-label">
                Currency Type
              </InputLabel>
              <Select
                labelId="currency_type"
                id="currency_type"
                value={currencyType}
                label="currency_type"
                onChange={handleCurrencyType}
              >
                <MenuItem value={"IND ₹"}>IND</MenuItem>
                <MenuItem value={"USD $"}>USD</MenuItem>
                <MenuItem value={"EUR €"}>EUR</MenuItem>
                <MenuItem value={"GBP R"}>GBP</MenuItem>
                <MenuItem value={"ZAR £"}>ZAR</MenuItem>
              </Select>
            </FormControl>
            <Box
              sx={{
                display: "flex",
                width: "87%",
                justifyContent: "space-between",
              }}
              mt={1}
            >
              <Typography sx={{ fontWeight: 500 }}>
                Add Sender Bank Details on Invoice
              </Typography>
              <Checkbox
                checked={show_sender_bank_details}
                onChange={handle_show_sender_bank_details}
                inputProps={{ "aria-label": "controlled" }}
                sx={{ padding: 0 }}
              />
            </Box>
            <Box className="task_form" component="form" onSubmit={handleSubmit}>
              <Typography
                component="h1"
                variant="h5"
                sx={{ fontWeight: 600 }}
                mt={1}
              >
                {isTaskToUpdate ? "Update Task " : "Add Task"}
              </Typography>
              <TextField
                required
                id="taskName"
                label="Task Name"
                name="taskName"
                autoComplete="taskName"
                sx={{ width: "87%", marginTop: 2 }}
                inputProps={{ sx: { height: 15, marginTop: 1 } }}
                onChange={handleInput}
                value={taskInfo.taskName}
              />
              <FormControl sx={{ width: "87%", marginTop: 2 }}>
                <InputLabel id="demo-simple-select-label">Task Type</InputLabel>
                <Select
                  labelId="selected_client"
                  id="selected_client"
                  value={taskInfo.type}
                  label="selected_client"
                  onChange={handleTaskType}
                >
                  <MenuItem value={"Fixed"}>Fixed</MenuItem>
                  <MenuItem value={"hourly"}>Hourly</MenuItem>
                </Select>
              </FormControl>
              <TextField
                required
                id="hourly_units_worked"
                label="Hours/Units to charge"
                name="hourly_units_worked"
                autoComplete="hourly_units_worked"
                sx={{ width: "87%", marginTop: 2 }}
                inputProps={{ sx: { height: 15, marginTop: 1 } }}
                onChange={handleInput}
                value={taskInfo.hourly_units_worked}
              />
              <Box
                sx={{
                  width: "87%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <TextField
                  required
                  id="totalPrice"
                  label="Total Price"
                  name="totalPrice"
                  autoComplete="totalPrice"
                  sx={{ width: "100%", marginTop: 2 }}
                  inputProps={{ sx: { height: 15, marginTop: 1 } }}
                  onChange={handleInput}
                  value={taskInfo.totalPrice}
                />
              </Box>
              <Box mt={2} sx={{ width: "87%" }}>
                <Button
                  type="submit"
                  sx={{ width: "100%", marginBottom: 1.5 }}
                  variant="contained"
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Box>
          <CreateInvoiceRight
            selectedClient={selectedClient}
            tasks={tasks}
            totalAmount={totalAmount}
            invoiceDate={invoiceDate}
            dueDate={dueDate}
            deleteTask={deleteTask}
            editTask={editTask}
            shareInvoiceWith={shareInvoiceWith}
            show_sender_bank_details={show_sender_bank_details}
            currencyType={currencyType}
            currency_symbol={currency_symbol}
          />
        </Container>
      </ThemeProvider>
      <Footer />
    </ProtectedRoute>
  );
};
