import api from "./api";

// =========================================
// Get Vault
// =========================================

export const getVault = async () => {
  const { data } = await api.get("/vault");
  return data;
};

// =========================================
// Deposit Money
// =========================================

export const depositMoney = async (depositData) => {
  const { data } = await api.post("/vault/deposit", depositData);
  return data;
};

// =========================================
// Withdraw Money
// =========================================

export const withdrawMoney = async (withdrawData) => {
  const { data } = await api.post("/vault/withdraw", withdrawData);
  return data;
};

// =========================================
// Lookup Vault
// =========================================

export const lookupVault = async (vaultNumber) => {
  const response = await api.get(
    `/vault/lookup/${vaultNumber}`
  );

  return response.data;
};

// =========================================
// Transfer Money
// =========================================

export const transferMoney = async (transferData) => {
  const { data } = await api.post("/vault/transfer", transferData);
  return data;
};