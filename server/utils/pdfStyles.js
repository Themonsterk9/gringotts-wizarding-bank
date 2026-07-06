// =========================================
// PDF Theme Configuration
// =========================================

export const COLORS = {
  gold: "#B8860B",
  darkGold: "#8B7500",
  lightGold: "#D4AF37",

  black: "#1F2937",
  gray: "#6B7280",
  lightGray: "#E5E7EB",

  white: "#FFFFFF",

  success: "#16A34A",
  danger: "#DC2626",

  background: "#FFFDF7",
};

// =========================================
// Draw Gold Border
// =========================================

export const drawBorder = (doc) => {
  doc
    .lineWidth(2)
    .strokeColor(COLORS.gold)
    .rect(25, 25, 545, 792)
    .stroke();

  doc
    .lineWidth(0.5)
    .strokeColor(COLORS.lightGold)
    .rect(35, 35, 525, 772)
    .stroke();
};

// =========================================
// Section Header
// =========================================

export const sectionHeader = (
  doc,
  title,
  y
) => {

  doc
    .fillColor(COLORS.darkGold)
    .roundedRect(50, y, 500, 28, 5)
    .fill();

  doc
    .fillColor(COLORS.white)
    .font("Helvetica-Bold")
    .fontSize(13)
    .text(title, 65, y + 8);
};

// =========================================
// Divider
// =========================================

export const divider = (
  doc,
  y
) => {

  doc
    .moveTo(50, y)
    .lineTo(550, y)
    .strokeColor(COLORS.lightGold)
    .lineWidth(1)
    .stroke();

};

// =========================================
// Label
// =========================================

export const label = (
  doc,
  text,
  x,
  y
) => {

  doc
    .font("Helvetica-Bold")
    .fillColor(COLORS.black)
    .fontSize(11)
    .text(text, x, y);

};

// =========================================
// Value
// =========================================

export const value = (
  doc,
  text,
  x,
  y
) => {

  doc
    .font("Helvetica")
    .fillColor(COLORS.gray)
    .fontSize(11)
    .text(String(text ?? ""), x, y);

};

// =========================================
// Status Badge
// =========================================

export const statusBadge = (
  doc,
  status,
  x,
  y
) => {

  const color =
    status === "Success"
      ? COLORS.success
      : COLORS.danger;

  doc
    .fillColor(color)
    .roundedRect(x, y, 90, 22, 10)
    .fill();

  doc
    .fillColor("white")
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(
      status.toUpperCase(),
      x + 18,
      y + 6
    );

};

// =========================================
// Footer
// =========================================

export const footer = (
  doc
) => {

  divider(doc, 740);

  doc
    .font("Helvetica")
    .fillColor(COLORS.gray)
    .fontSize(10)
    .text(
      "Thank you for banking with",
      {
        align: "center",
      }
    );

  doc.moveDown(0.3);

  doc
    .font("Helvetica-Bold")
    .fillColor(COLORS.darkGold)
    .fontSize(13)
    .text(
      "GRINGOTTS WIZARDING BANK",
      {
        align: "center",
      }
    );

  doc.moveDown(0.3);

  doc
    .fontSize(10)
    .fillColor(COLORS.gray)
    .text(
      "Security • Integrity • Trust",
      {
        align: "center",
      }
    );

  doc.moveDown(0.2);

  doc.text(
    "www.gringottswizardingbank.com",
    {
      align: "center",
    }
  );

};