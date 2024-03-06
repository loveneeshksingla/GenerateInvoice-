import { AXIOS } from "./Setup";

export const createSenderCompany = (action) => {
  return AXIOS.post("add-sender-party", action?.payload);
};

export const fetchSenderCompany = () => {
  return AXIOS.get("sender-party/1");
};

export const modifySenderCompany = (action) => {
  return AXIOS.post("update-sender-party", action?.payload);
};
