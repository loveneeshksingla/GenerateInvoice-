import { AXIOS } from "./Setup";

export const createInvoice = (action) => {
  return AXIOS.post("add-invoice", action?.payload);
};

export const fetchInvoices = (action) => {
  const params = {
    page: action?.payload?.page ? action?.payload?.page : 1,
    rows: action?.payload?.row ? action?.payload?.row : 10,
  };

  return AXIOS.get("all-client-invoice", { params });
};

export const removeInvoice = (action) => {
  return AXIOS.delete(`delete-invoice/${action}`);
};

export const fetchInvoice = (action) => {
  return AXIOS.get(`get-invoice/${action}`);
};

export const editInvoice = (action) => {
  return AXIOS.put("update-invoice", action?.payload);
};

export const _downloadPdf = (action) => {
  return AXIOS.get(`generate-pdf/${action}`);
};

export const mark_payment_done = (action) => {
  return AXIOS.put(`update-payment-status/${action}`);
};
