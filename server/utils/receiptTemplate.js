import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import generateReceiptNumber from "./receiptNumber.js";
import generateQRCode from "./qrGenerator.js";

import {
  COLORS,
  drawBorder,
  sectionHeader,
  divider,
  label,
  value,
  statusBadge,
  footer,
} from "./pdfStyles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsPath = path.join(__dirname, "../assets");

const logoPath = path.join(assetsPath, "logo.png");
const watermarkPath = path.join(assetsPath, "watermark.png");
const sealPath = path.join(assetsPath, "seal.png");
const signaturePath = path.join(assetsPath, "signature.png");

export const generateReceipt = async (
  doc,
  transaction,
  user,
  vault
) => {

  // ============================================
  // Receipt Number
  // ============================================

  const receiptNo = generateReceiptNumber();

  // ============================================
  // Draw Border
  // ============================================

  drawBorder(doc);

  // ============================================
  // Background
  // ============================================

  doc.rect(25, 25, 545, 792)
     .fillOpacity(1)
     .fill(COLORS.background);

  drawBorder(doc);

  // ============================================
  // Watermark
  // ============================================

  if (fs.existsSync(watermarkPath)) {

    doc.save();

    doc.opacity(0.05);

    doc.image(
      watermarkPath,
      120,
      180,
      {
        width: 340,
      }
    );

    doc.restore();

  }

  // ============================================
  // Logo
  // ============================================

  if (fs.existsSync(logoPath)) {

    doc.image(
      logoPath,
      50,
      45,
      {
        width: 70,
      }
    );

  }

  // ============================================
  // Header
  // ============================================

  doc
    .fillColor(COLORS.darkGold)
    .font("Helvetica-Bold")
    .fontSize(24)
    .text(
      "GRINGOTTS WIZARDING BANK",
      0,
      50,
      {
        align: "center",
      }
    );

  doc.moveDown(0.3);

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(COLORS.gray)
    .text(
      "The Safest Place for Your Gold",
      {
        align: "center",
      }
    );

  divider(doc, 100);

  // ============================================
  // Receipt Title
  // ============================================

  doc.moveDown(1.5);

  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor(COLORS.black)
    .text(
      "TRANSACTION RECEIPT",
      {
        align: "center",
      }
    );

  doc.moveDown();

  // ============================================
  // Receipt Info
  // ============================================

  label(doc, "Receipt No.", 60, 150);
  value(doc, receiptNo, 180, 150);

  label(doc, "Transaction ID", 60, 170);
  value(doc, transaction.transactionId, 180, 170);

  const generated = new Date();

  label(doc, "Generated Date", 340, 150);
  value(
    doc,
    generated.toLocaleDateString(),
    455,
    150
  );

  label(doc, "Generated Time", 340, 170);
  value(
    doc,
    generated.toLocaleTimeString(),
    455,
    170
  );

  divider(doc, 205);

  // ============================================
// Wizard Information
// ============================================

sectionHeader(doc, "WIZARD INFORMATION", 220);

let y = 260;

// Avatar
if (user.avatar) {
  const avatarPath = path.join(
    process.cwd(),
    user.avatar.replace(/^\//, "")
  );

  if (fs.existsSync(avatarPath)) {
    doc.image(avatarPath, 55, y, {
      width: 60,
      height: 60,
    });
  }
}

label(doc, "Wizard Name", 140, y);
value(doc, user.wizardName, 270, y);

label(doc, "Email", 140, y + 22);
value(doc, user.email, 270, y + 22);

label(doc, "Role", 140, y + 44);
value(
  doc,
  (user.role || "wizard").toUpperCase(),
  270,
  y + 44
);

// ============================================
// Vault Information
// ============================================

sectionHeader(doc, "VAULT INFORMATION", 355);

y = 395;

label(doc, "Vault Number", 60, y);
value(doc, vault.vaultNumber, 220, y);

label(doc, "Status", 60, y + 22);
value(doc, vault.status, 220, y + 22);

label(doc, "Currency", 60, y + 44);
value(doc, vault.currency, 220, y + 44);

label(doc, "Current Balance", 60, y + 66);
value(
  doc,
  `${(vault.balance || 0).toLocaleString()} ${vault.currency || ""}`,
  220,
  y + 66
);

// ============================================
// Transaction Details
// ============================================

sectionHeader(doc, "TRANSACTION DETAILS", 500);

y = 540;

label(doc, "Transaction Type", 60, y);
value(doc, transaction.type, 220, y);

label(doc, "Amount", 60, y + 22);
value(
  doc,
  `${(transaction.amount || 0).toLocaleString()} ${vault.currency || ""}`,
  220,
  y + 22
);

label(doc, "Description", 60, y + 44);
value(
  doc,
  transaction.description || "-",
  220,
  y + 44
);

// Status Badge
label(doc, "Status", 60, y + 70);

statusBadge(
  doc,
  transaction.status,
  220,
  y + 66
);

// Transaction Date
const transactionDate = new Date(transaction.createdAt);

label(doc, "Transaction Date", 340, y);

value(
  doc,
  transactionDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }),
  470,
  y
);

label(doc, "Transaction Time", 340, y + 22);

value(
  doc,
  transactionDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }),
  470,
  y + 22
);
if (doc.y > 620) {
  doc.addPage();
  drawBorder(doc);
}
// ============================================
// QR Code Section
// ============================================

const qrBuffer = await generateQRCode({
  receiptNo,
  transactionId: transaction.transactionId,
  wizardName: user.wizardName,
  vaultNumber: vault.vaultNumber,
  amount: transaction.amount,
  currency: vault.currency,
  status: transaction.status,
});

const currentY = doc.y + 20;

sectionHeader(doc, "VERIFICATION", currentY);

doc.image(qrBuffer, 60, 695, {
  width: 90,
});

// ============================================
// QR Information
// ============================================

doc
  .font("Helvetica")
  .fontSize(10)
  .fillColor(COLORS.gray)
  .text(
    "Scan this QR code to verify the authenticity of this receipt.",
    170,
    705,
    {
      width: 250,
    }
  );

doc
  .font("Helvetica-Bold")
  .fillColor(COLORS.darkGold)
  .text(
    "Receipt No.",
    170,
    750
  );

doc
  .font("Helvetica")
  .fillColor(COLORS.black)
  .text(
    receiptNo,
    250,
    750
  );

// ============================================
// Digital Signature
// ============================================

if (fs.existsSync(signaturePath)) {
  doc.image(signaturePath, 420, 700, {
    width: 100,
  });
}

doc
  .font("Helvetica-Bold")
  .fillColor(COLORS.black)
  .fontSize(10)
  .text(
    "Authorized Goblin Banker",
    390,
    760
  );

doc
  .font("Helvetica")
  .fillColor(COLORS.gray)
  .fontSize(9)
  .text(
    "Gringotts Wizarding Bank",
    395,
    775
  );

// ============================================
// Official Seal
// ============================================

if (fs.existsSync(sealPath)) {
  doc.image(sealPath, 445, 640, {
    width: 65,
  });
}

// ============================================
// Authenticity Notice
// ============================================

doc
  .font("Helvetica")
  .fontSize(8)
  .fillColor(COLORS.gray)
  .text(
    "This receipt was digitally generated by Gringotts Wizarding Bank. No handwritten signature is required. Verify using the QR Code.",
    60,
    810,
    {
      width: 470,
      align: "center",
    }
  );

// ============================================
// Footer
// ============================================

footer(doc);

// ============================================
// Return
// ============================================

return {
  receiptNo,
  qrBuffer,
  transactionDate,
};
};