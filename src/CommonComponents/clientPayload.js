export const getClientPayload = (data) => {
  return {
    name: data.get("name"),
    address: data.get("address"),
    phone: data.get("phone"),
    pan: data.get("pan"),
    tan: data.get("tan"),
    gstin: data.get("gstin"),
    email: data.get("email"),
    companyname: data.get("companyname"),
    pin: data.get("pin"),
  };
};
