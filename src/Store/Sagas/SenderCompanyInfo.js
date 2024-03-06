import { takeLatest, put, call } from "redux-saga/effects";
import { toast } from "react-toastify";

import {
  SAVE_SENDER_COMPANY,
  GET_SENDER_COMPANY,
  UPDATE_SENDER_COMPANY,
} from "../Action_Constants";
import { _saveSenderCompany, setLoading } from "../Slices/SenderCompanyInfo";
import {
  createSenderCompany,
  fetchSenderCompany,
  modifySenderCompany,
} from "../../Services/Sender_Company_Info";

function* saveSenderCompany(action) {
  try {
    const response = yield call(createSenderCompany, action);
    if (response?.data.success) yield put(_saveSenderCompany(action?.payload));
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* getSenderCompany(action) {
  try {
    const response = yield call(fetchSenderCompany);
    yield put(_saveSenderCompany(response?.data?.data));
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* updateSenderCompany(action) {
  try {
    const response = yield call(modifySenderCompany, action);
    toast.success("Company info has been updated successfully");
    if (response?.data.success) yield put(_saveSenderCompany(action?.payload));
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

export function* senderComPanyInfoSaga() {
  yield takeLatest(SAVE_SENDER_COMPANY, saveSenderCompany);
  yield takeLatest(GET_SENDER_COMPANY, getSenderCompany);
  yield takeLatest(UPDATE_SENDER_COMPANY, updateSenderCompany);
}
