import QRCode from "qrcode";

// =========================================
// Generate QR Code Buffer
// =========================================

const generateQRCode = async (receiptData) => {
  try {
    const qrData = JSON.stringify({
      receiptNo: receiptData.receiptNo,
      transactionId: receiptData.transactionId,
      wizard: receiptData.wizardName,
      vault: receiptData.vaultNumber,
      amount: receiptData.amount,
      currency: receiptData.currency,
      status: receiptData.status,
    });

    const qrBuffer = await QRCode.toBuffer(qrData, {
      type: "png",
      width: 250,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return qrBuffer;
  } catch (error) {
    console.error("QR Generator Error:", error);
    throw error;
  }
};

export default generateQRCode;