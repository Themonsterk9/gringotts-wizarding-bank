import nodemailer from "nodemailer";

const sendOTPEmail = async (email, wizardName, otp) => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log(
    "EMAIL_PASS exists:",
    !!process.env.EMAIL_PASS
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.verify();

  await transporter.sendMail({
    from: `"Gringotts Wizarding Bank" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Login OTP",
    html: `
      <h2>Hello ${wizardName}</h2>

      <p>Your OTP is</p>

      <h1>${otp}</h1>

      <p>Expires in 5 minutes.</p>
    `,
  });
};

export default sendOTPEmail;