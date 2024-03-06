import {
  createInvoice,
  editInvoice,
  fetchInvoice,
  fetchInvoices,
  mark_payment_done,
  removeInvoice,
  _downloadPdf,
} from "../../Services/Invoice_Services";
import {
  ADD_INVOICE,
  DELETE_INVOICE,
  DOWNLOAD_PDF,
  GET_INVOICE,
  GET_INVOICES,
  MARK_PAYMENT_DONE,
  UPDATE_INVOICE,
} from "../Action_Constants";
import { takeLatest, put, call } from "redux-saga/effects";
import { toast } from "react-toastify";
import {
  invoiceCreated,
  setInvoiceToUpdate,
  setLoading,
  setPDFUrl,
  _saveInvoice,
} from "../Slices/Invoice";
import { store } from "../Store";

function* addInvoice(action) {
  try {
    const response = yield call(createInvoice, action);
    if (response.status === 200) {
      yield put(invoiceCreated());
      toast.success("Invoice has been created successfully");
    }
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* deleteInvoice(action) {
  try {
    const response = yield call(removeInvoice, action?.payload.invoiceId);
    if (response.status === 200) {
      store.dispatch({
        type: GET_INVOICES,
        payload: {
          page: action?.payload.page,
          rows: action?.payload.row,
        },
      });
    }
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* getInvoices(action) {
  try {
    const response = yield call(fetchInvoices, action);
    yield put(_saveInvoice(response?.data));
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* getInvoice(action) {
  try {
    const response = yield call(fetchInvoice, action?.payload);
    yield put(setInvoiceToUpdate(response?.data?.data[0]));
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* updateInvoice(action) {
  try {
    const response = yield call(editInvoice, action);
    if (response.status === 200) {
      yield put(invoiceCreated());
      yield put(setInvoiceToUpdate(false));
      toast.success("Invoice has been updated successfully");
      store.dispatch({
        type: GET_INVOICES,
      });
    }
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* downloadPdf(action) {
  try {
    const response = yield call(_downloadPdf, action?.payload);
    window.open(response?.data?.url);
    yield put(setPDFUrl(response?.data?.url));
    yield put(setLoading(false));
  } catch (e) {
    toast.error(e?.response?.error?.[0] || e?.response?.message);
    yield put(setLoading(false));
  }
}

function* markPaymentDone(action) {
  try {
    const response = yield call(mark_payment_done, action?.payload?.invoiceId);
    if (response.status === 200) {
      toast.success("Invoice has been updated successfully");
      store.dispatch({
        type: GET_INVOICES,
        payload: action,
      });
    }
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

export function* invoiceSaga() {
  yield takeLatest(ADD_INVOICE, addInvoice);
  yield takeLatest(GET_INVOICES, getInvoices);
  yield takeLatest(DELETE_INVOICE, deleteInvoice);
  yield takeLatest(GET_INVOICE, getInvoice);
  yield takeLatest(UPDATE_INVOICE, updateInvoice);
  yield takeLatest(DOWNLOAD_PDF, downloadPdf);
  yield takeLatest(MARK_PAYMENT_DONE, markPaymentDone);
}
