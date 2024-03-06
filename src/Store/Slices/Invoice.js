import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: [],
  loading: false,
  invoiceCreating: false,
  invoiceToUpdate: {},
  pdfUrl: "",
  totalInvoices: 0,
};

const invoices = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    _saveInvoice: (state, action) => {
      return {
        ...state,
        invoices: action?.payload?.data,
        totalInvoices: action?.payload?.count,
        loading: false,
      };
    },
    setLoading: (state, action) => {
      return {
        ...state,
        loading: action?.payload,
      };
    },
    invoiceCreated: (state, action) => {
      localStorage.setItem("invoicecreating", false);
      return {
        ...state,
        loading: false,
        invoiceCreating: false,
      };
    },
    invoiceCreating: (state, action) => {
      return {
        ...state,
        invoiceCreating: action?.payload,
      };
    },
    setInvoiceToUpdate: (state, action) => {
      return {
        ...state,
        invoiceToUpdate: action?.payload,
        loading: false,
      };
    },
    setPDFUrl: (state, action) => {
      return {
        ...state,
        pdfUrl: action?.payload,
      };
    },
  },
});

export const {
  setLoading,
  _saveInvoice,
  invoiceCreated,
  invoiceCreating,
  setInvoiceToUpdate,
  setPDFUrl,
} = invoices.actions;
export default invoices.reducer;
