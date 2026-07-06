import api from "./api";

// =========================================
// Download Receipt PDF
// =========================================
export const downloadReceipt = async (transactionId) => {
  const response = await api.get(
    `/receipt/${transactionId}`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};