// =========================================
// Generate Professional Receipt Number
// Format:
// RCPT-YYYYMMDD-000001
// =========================================

let receiptCounter = 1;

const pad = (num, size) => {
  return String(num).padStart(size, "0");
};

const formatDate = (date) => {
  const year = date.getFullYear();

  const month = pad(date.getMonth() + 1, 2);

  const day = pad(date.getDate(), 2);

  return `${year}${month}${day}`;
};

const generateReceiptNumber = () => {
  const today = new Date();

  const datePart = formatDate(today);

  const counterPart = pad(receiptCounter++, 6);

  return `RCPT-${datePart}-${counterPart}`;
};

export default generateReceiptNumber;