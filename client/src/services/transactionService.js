import api from "./api";

// Get all transactions
export const getTransactions = async () => {
  const response = await api.get("/transactions");
  return response.data;
};

// Get transaction by ID
export const getTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};