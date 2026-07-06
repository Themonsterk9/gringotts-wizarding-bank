const generateTransactionId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let transactionId = "TXN-";

  for (let i = 0; i < 10; i++) {
    transactionId += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return transactionId;
};

export default generateTransactionId;