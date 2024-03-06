import {
  fetchClients,
  removeClient,
  createClient,
  editClient,
  fetchClient,
} from "../../Services/Clients_Services";
import {
  DELETE_CLIENT,
  GET_CLIENT,
  GET_CLIENTS,
  SAVE_CLIENT,
  UPDATE_CLIENT,
} from "../Action_Constants";
import {
  _saveClients,
  setLoading,
  clientCreated,
  _saveClient,
} from "../Slices/Clients";
import { takeLatest, put, call } from "redux-saga/effects";
import { toast } from "react-toastify";
import { store } from "../Store";

function* getClients(action) {
  try {
    const response = yield call(fetchClients, action);
    yield put(_saveClients(response?.data));
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* getClient(action) {
  try {
    const response = yield call(fetchClient, action.payload);
    yield put(_saveClient(response?.data?.data));
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* deleteClient(action) {
  try {
    const response = yield call(removeClient, action?.payload.clientId);
    if (response.status === 200) {
      store.dispatch({
        type: GET_CLIENTS,
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

function* saveClient(action) {
  try {
    const response = yield call(createClient, action);
    if (response.status === 200) {
      yield put(clientCreated());
      toast.success("client has been saved successfully");
    }
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

function* updateClient(action) {
  try {
    const response = yield call(editClient, action);
    if (response.status === 200) {
      yield put(clientCreated());
      toast.success("client has been updated successfully");
      store.dispatch({
        type: GET_CLIENTS,
      });
    }
  } catch (e) {
    toast.error(e?.response?.data?.error?.[0] || e?.response?.data?.message);
    yield put(setLoading(false));
  }
}

export function* clientsSaga() {
  yield takeLatest(GET_CLIENTS, getClients);
  yield takeLatest(DELETE_CLIENT, deleteClient);
  yield takeLatest(SAVE_CLIENT, saveClient);
  yield takeLatest(UPDATE_CLIENT, updateClient);
  yield takeLatest(GET_CLIENT, getClient);
}
