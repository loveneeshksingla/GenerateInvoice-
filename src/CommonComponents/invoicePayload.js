export const getInvoicePayload = (data) => {
  return {
    duedate: data.duedate,
    client_id: data?.clientId,
    invoicedate: data?.invoicedate,
    shareInvoiceWithEmail: data?.shareInvoiceWithEmail,
    invoicetotalvalue: data?.total_amount,
    tasks: JSON.stringify(data?.allTasks),
    show_sender_bank_details: data?.show_sender_bank_details ? 1 : 0,
    currency_type: data?.currencyType.slice(0, 3),
    currency_symbol: data?.currency_symbol,
  };
};
