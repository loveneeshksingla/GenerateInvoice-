import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clients: [],
  loading: false,
  clientCreating: false,
  client: {},
  totalClients: 0,
};

const clients = createSlice({
  name: "clients",
  initialState,
  reducers: {
    _saveClients: (state, action) => {
      return {
        ...state,
        clients: action?.payload?.data,
        totalClients: action?.payload?.count || 0,
        loading: false,
      };
    },
    _saveClient: (state, action) => {
      return {
        ...state,
        client: action?.payload,
        loading: false,
      };
    },
    setLoading: (state, action) => {
      return {
        ...state,
        loading: action?.payload,
      };
    },
    clientCreated: (state, action) => {
      localStorage.setItem("clientcreating", false);
      return {
        ...state,
        loading: false,
        clientCreating: false,
      };
    },
    clientCreating: (state, action) => {
      return {
        ...state,
        clientCreating: action?.payload,
      };
    },
  },
});

export const {
  setLoading,
  _saveClients,
  clientCreated,
  clientCreating,
  _saveClient,
} = clients.actions;
export default clients.reducer;
