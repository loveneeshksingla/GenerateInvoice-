import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  senderCompany: {
    name: "",
    location: "",
    phone: "",
    pan: "",
    bank_name: "",
    bank_account_holder_name: "",
    bank_account_no: "",
    bank_ifsc_code: "",
    email: "",
  },
  loading: false,
};

const senderCompanyInfo = createSlice({
  name: "senderCompanyInfo",
  initialState,
  reducers: {
    _saveSenderCompany: (state, action) => {
      localStorage.setItem("sender", JSON.stringify(action?.payload));
      return {
        ...state,
        senderCompany: { ...action?.payload },
        loading: false,
      };
    },

    setLoading: (state, action) => {
      return {
        ...state,
        loading: action?.payload,
      };
    },
  },
});

export const { setLoading, _saveSenderCompany } = senderCompanyInfo.actions;
export default senderCompanyInfo.reducer;
