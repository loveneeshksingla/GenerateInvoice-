import axios from "axios";

export const AXIOS = axios.create({
  baseURL: "https://dev.zestgeek.com/invoiceGenrate/api/",
});

AXIOS.interceptors.request.use(
  (request) => {
    const AUTH_TOKEN = localStorage.getItem("token");
    if (AUTH_TOKEN) {
      request.headers.Authorization = AUTH_TOKEN;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AXIOS.interceptors.response.use(
  (response) => {
    if (response.status === 200) return response;
  },
  (error) => {
    if (error?.response?.status === 498) {
      localStorage.clear();
      return "token expired";
    }
    return Promise.reject(error);
  }
);
