import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { invoiceCreating } from "../../Store/Slices/Invoice";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { RenderInvoiceTable } from "./RenderInvoiceTable";
import ProtectedRoute from "../../Routes/ProtectedRoute";
export const Invoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  localStorage.setItem("invoicecreating", false);

  const addInvoice = () => {
    localStorage.setItem("invoicecreating", true);
    dispatch(invoiceCreating(true));
    navigate("/createInvoice");
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <Box mt={10} ml={2} mr={2} className="minHeight">
        <Box className="client_table_upper">
          <Typography variant="h5">ALL INVOICES</Typography>
          <Button sx={{ border: "1px solid" }} onClick={addInvoice}>
            Create Invoice
          </Button>
        </Box>
        <Box mt={2}>{<RenderInvoiceTable />}</Box>
      </Box>
      <Footer />
    </ProtectedRoute>
  );
};
