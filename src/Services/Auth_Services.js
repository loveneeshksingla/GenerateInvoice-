import { AXIOS } from "./Setup";

export const loginRequest = (action) => {
  return AXIOS.post("login", action?.payload);
};
