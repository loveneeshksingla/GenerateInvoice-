import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import DownloadIcon from "@mui/icons-material/Download";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box } from "@mui/system";

import { useDispatch, useSelector } from "react-redux";
import {
  DELETE_INVOICE,
  DOWNLOAD_PDF,
  GET_CLIENTS,
  GET_INVOICES,
  MARK_PAYMENT_DONE,
} from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";
import { invoiceCreating, setLoading } from "../../Store/Slices/Invoice";

import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

const columns = [
  { id: "Invoice_Number", label: "Invoice Number ", minWidth: 100 },
  { id: "Client_Name", label: "Client Name ", minWidth: 100 },
  { id: "Due_Date", label: "Due Date ", minWidth: 100 },
  { id: "Submitted_Date", label: "Submitted Date ", minWidth: 100 },
  { id: "Total_Amount", label: "Total Amount", minWidth: 100 },
  { id: "payment_status", label: "Payment Status ", minWidth: 100 },
  { id: "Paid_On", label: "Paid On", minWidth: 100 },
  { id: "actions", label: "ACTIONS", minWidth: 100 },
];

export const RenderInvoiceTable = () => {
  const { loading, invoices, invoiceToUpdate, totalInvoices } = useSelector(
    (state) => state.invoices
  );
  const { clients } = useSelector((state) => state.clients);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [invoicesData, setInvoicesData] = React.useState([]);

  React.useEffect(() => {
    dispatch(setLoading(true));
    dispatch({ type: GET_INVOICES });
    dispatch({ type: GET_CLIENTS });
  }, []);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };

  React.useEffect(() => {
    dispatch(setLoading(true));
    dispatch({ type: GET_INVOICES, payload: { page: page, row: rowsPerPage } });
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(++newPage);
  };

  const deleteInvoice = async (index) => {
    const invoice_id = invoices[index].id;
    const payload = {
      invoiceId: invoice_id,
      page: page,
      row: rowsPerPage,
    };

    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this invoice?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (!willDelete) return;
    dispatch(setLoading(true));
    dispatch({ type: DELETE_INVOICE, payload: payload });
  };

  const editInvoice = (index) => {
    localStorage.setItem("invoicecreating", true);
    const invoice_id = invoices[index].id;
    dispatch(invoiceCreating(true));
    navigate(`/updateInvoice/${invoice_id}`);
  };

  const downloadInvoicePdf = (index) => {
    const invoice_id = invoices[index].id;
    dispatch(setLoading(true));
    dispatch({ type: DOWNLOAD_PDF, payload: invoice_id });
  };

  React.useEffect(() => {
    const _invoices = invoices?.map((invoice, ind) => {
      const paidOn = invoice?.paid_on?.split(" ");
      return {
        Invoice_Number: invoice.id || "-",
        Client_Name: invoice?.client_detail?.name || "-",
        Due_Date: invoice.duedate || "-",
        Submitted_Date: invoice.invoicedate || "-",
        Total_Amount: invoice.invoicetotalvalue || "-",
        payment_status: invoice?.payment_status || "-",
        Paid_On: paidOn?.length > 0 ? paidOn[0] : "- ",
        actions: "",
        currencyType: invoice.currency_type,
      };
    });
    setInvoicesData(_invoices);
  }, [invoices]);

  const handlePaymentStatus = async (index) => {
    const invoice_id = invoices[index].id;
    const willUpdatePaymentStatus = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to mark the payment status done?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (!willUpdatePaymentStatus) return;

    dispatch(setLoading(true));
    const payload = {
      invoiceId: invoice_id,
      page: page,
      row: rowsPerPage,
    };
    dispatch({ type: MARK_PAYMENT_DONE, payload: payload });
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Spinner loading={loading} />
      <TableContainer sx={{ minHeight: 440, maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <b>{column.label}</b>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {invoicesData?.length > 0 ? (
              invoicesData?.map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      let value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === "actions" ? (
                            <Box sx={{ display: "flex" }}>
                              <Tooltip title="Update Invoice">
                                <EditIcon
                                  className="cursor_pointer"
                                  onClick={() => editInvoice(index)}
                                />
                              </Tooltip>
                              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                              <Tooltip title="Delete Invoice">
                                <DeleteForeverIcon
                                  onClick={() => deleteInvoice(index)}
                                  className="cursor_pointer"
                                />
                              </Tooltip>
                              &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;
                              <Tooltip title="Download Invoice">
                                <DownloadIcon
                                  className="cursor_pointer"
                                  onClick={() => downloadInvoicePdf(index)}
                                />
                              </Tooltip>
                            </Box>
                          ) : column.id === "payment_status" ? (
                            <Box sx={{ display: "flex" }}>
                              {value}&nbsp;&nbsp;&nbsp;
                              {value !== "paid" && (
                                <Tooltip title="Mark Payment Done">
                                  <CheckCircleOutlineIcon
                                    sx={{ color: "green" }}
                                    className="cursor_pointer"
                                    onClick={() => handlePaymentStatus(index)}
                                  />
                                </Tooltip>
                              )}
                            </Box>
                          ) : column.id === "Total_Amount" ? (
                            <>
                              {value}&nbsp; &nbsp;
                              {row.currencyType}
                            </>
                          ) : (
                            <>{value}</>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>No Data is available</TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalInvoices}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
