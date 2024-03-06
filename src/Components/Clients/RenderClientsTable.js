import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import { Box } from "@mui/system";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { useDispatch, useSelector } from "react-redux";
import { DELETE_CLIENT, GET_CLIENTS } from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";
import { clientCreating, setLoading } from "../../Store/Slices/Clients";

import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

const columns = [
  { id: "name", label: "Name", minWidth: 180 },
  { id: "company_name", label: "Company", minWidth: 180 },
  { id: "address", label: "Address", minWidth: 180 },
  { id: "pan", label: "PAN", minWidth: 100 },
  { id: "tan", label: "TAN", minWidth: 100 },
  { id: "gstin", label: "GSTIN", minWidth: 100 },
  { id: "actions", label: "ACTIONS", minWidth: 100 },
];

export const RenderClientsTable = () => {
  const { loading, clients, totalClients } = useSelector(
    (state) => state.clients
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [clientsData, setClientsData] = React.useState([]);

  React.useEffect(() => {
    dispatch(setLoading(true));
    dispatch({ type: GET_CLIENTS });
  }, []);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };

  React.useEffect(() => {
    dispatch(setLoading(true));
    dispatch({ type: GET_CLIENTS, payload: { page: page, row: rowsPerPage } });
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(++newPage);
  };

  const deleteClient = async (index) => {
    const client_id = clients[index].id;
    const payload = {
      clientId: client_id,
      page: page,
      row: rowsPerPage,
    };

    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this client?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (!willDelete) return;
    dispatch(setLoading(true));
    dispatch({ type: DELETE_CLIENT, payload: payload });
  };

  const editClient = (index) => {
    localStorage.setItem("clientcreating", true);
    const client = clients[index];
    dispatch(clientCreating(true));
    navigate(`/update_client/${client.id}`);
  };

  React.useEffect(() => {
    const _clients = clients?.map((client, ind) => {
      return {
        name: client.name || "-",
        company_name: client.companyname || "-",
        address: client.address || "-",
        pan: client.pan || "-",
        tan: client.tan || "-",
        gstin: client.gstin || "-",
        actions: "",
      };
    });
    setClientsData(_clients);
  }, [clients]);

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
            {clientsData?.length > 0
              ? clientsData?.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        let value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "actions" ? (
                              <Box sx={{ display: "flex" }}>
                                <EditIcon
                                  className="cursor_pointer"
                                  onClick={() => editClient(index)}
                                />
                                &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;
                                &nbsp; &nbsp;
                                <DeleteForeverIcon
                                  onClick={() => deleteClient(index)}
                                  className="cursor_pointer"
                                />
                              </Box>
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              : "No Data is available"}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalClients}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
