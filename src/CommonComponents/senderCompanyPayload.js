export const getsenderCompanyPayload = (data) => {
  return {
    name: data.get("name"),
    location: data.get("location"),
    phone: data.get("phone"),
    pan: data.get("pan"),
    bank_name: data.get("bank_name"),
    bank_account_holder_name: data.get("bank_account_holder_name"),
    bank_account_no: data.get("bank_account_no"),
    bank_ifsc_code: data.get("bank_ifsc_code"),
    email: data.get("email"),
  };
};
