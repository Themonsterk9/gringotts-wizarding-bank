// =========================================================
// Gringotts Wizarding Bank — Brevo Transactional Email Service
// =========================================================

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Core helper function to send email via Brevo HTTP API
 */
const sendBrevoEmail = async ({ toEmail, toName, subject, htmlContent, textContent }) => {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error("BREVO ERROR: BREVO_API_KEY environment variable is missing.");
    throw new Error("Email service configuration error.");
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@gringottsbank.com";
  const senderName = process.env.BREVO_SENDER_NAME || "Gringotts Wizarding Bank";
  const recipientName = toName || "Wizard";

  const payload = {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: [
      {
        email: toEmail,
        name: recipientName,
      },
    ],
    subject,
    htmlContent,
  };

  if (textContent) {
    payload.textContent = textContent;
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(
        "Brevo API Error:",
        response.status,
        errorData.message || response.statusText
      );
      throw new Error(`Failed to send email (${response.status})`);
    }

    return await response.json().catch(() => ({ success: true }));
  } catch (error) {
    console.error("Email Service Error:", error.message);
    throw new Error(error.message || "Failed to send transactional email.");
  }
};

/**
 * Send Registration Verification OTP Email
 */
export const sendRegistrationOTP = async (email, wizardName, otp) => {
  const recipientName = wizardName || "Wizard";
  const subject = "🏦 Gringotts Wizarding Bank — Verify Your Account";

  const htmlContent = `
    <div style="font-family: 'Cinzel', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #12121c; color: #e0e0e0; border: 1px solid #ffd700; border-radius: 12px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 215, 0, 0.3);">
        <h1 style="color: #ffd700; margin: 0; font-size: 26px;">🏦 Gringotts Wizarding Bank</h1>
        <p style="color: #b8860b; font-size: 14px; margin-top: 5px; font-style: italic;">Fort Knox of the Wizarding World</p>
      </div>
      
      <div style="padding: 25px 0;">
        <h2 style="color: #ffd700; font-size: 20px; margin-top: 0;">Welcome to Gringotts, ${recipientName}! ⚡</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #d1d5db;">
          Thank you for registering your magical vault. Please use the One-Time Password (OTP) code below to verify your email address and activate your Gringotts account:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background: linear-gradient(135deg, #ffd700, #b8860b); color: #111118; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 35px; border-radius: 8px; box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #f59e0b; font-weight: bold; text-align: center;">
          ⏳ This code will expire in 10 minutes.
        </p>

        <div style="background-color: rgba(255, 215, 0, 0.08); border-left: 4px solid #ffd700; padding: 12px 16px; border-radius: 4px; margin-top: 25px;">
          <p style="color: #f3f4f6; font-size: 13px; margin: 0; line-height: 1.5;">
            <strong>Security Notice:</strong> Please do not share this code with anyone. Complete your verification to activate your Gringotts vault.
          </p>
        </div>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255, 215, 0, 0.2); font-size: 12px; color: #9ca3af;">
        <p style="margin: 0;">— Gringotts Wizarding Bank</p>
        <p style="margin-top: 5px; font-size: 11px;">© 2026 Gringotts Wizarding Bank. All rights reserved.</p>
      </div>
    </div>
  `;

  const textContent = `Welcome to Gringotts Wizarding Bank, ${recipientName}!\n\nYour account verification code is:\n\n${otp}\n\nThis code will expire in 10 minutes.\n\nPlease do not share this code with anyone.\n\nComplete your verification to activate your Gringotts account.\n\n— Gringotts Wizarding Bank`;

  return await sendBrevoEmail({
    toEmail: email,
    toName: recipientName,
    subject,
    htmlContent,
    textContent,
  });
};

/**
 * Send Login Verification OTP Email
 */
export const sendLoginOTP = async (email, wizardName, otp) => {
  const recipientName = wizardName || "Wizard";
  const subject = "🔐 Gringotts Wizarding Bank — Your Login OTP";

  const htmlContent = `
    <div style="font-family: 'Cinzel', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #12121c; color: #e0e0e0; border: 1px solid #ffd700; border-radius: 12px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 215, 0, 0.3);">
        <h1 style="color: #ffd700; margin: 0; font-size: 26px;">🏦 Gringotts Wizarding Bank</h1>
        <p style="color: #b8860b; font-size: 14px; margin-top: 5px; font-style: italic;">Fort Knox of the Wizarding World</p>
      </div>
      
      <div style="padding: 25px 0;">
        <h2 style="color: #ffd700; font-size: 20px; margin-top: 0;">Greetings ${recipientName}, 🧙‍♂️</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #d1d5db;">
          A login attempt was made for your Gringotts vault. Please use the One-Time Password (OTP) below to complete your authentication:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background: linear-gradient(135deg, #ffd700, #b8860b); color: #111118; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 35px; border-radius: 8px; box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #f59e0b; font-weight: bold; text-align: center;">
          ⏳ This OTP will expire in 5 minutes.
        </p>

        <div style="background-color: rgba(255, 215, 0, 0.08); border-left: 4px solid #ffd700; padding: 12px 16px; border-radius: 4px; margin-top: 25px;">
          <p style="color: #f3f4f6; font-size: 13px; margin: 0; line-height: 1.5;">
            <strong>Security Notice:</strong> If you did not initiate this login request, please contact Gringotts Security immediately.
          </p>
        </div>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255, 215, 0, 0.2); font-size: 12px; color: #9ca3af;">
        <p style="margin: 0;">— Gringotts Wizarding Bank</p>
        <p style="margin-top: 5px; font-size: 11px;">© 2026 Gringotts Wizarding Bank. All rights reserved.</p>
      </div>
    </div>
  `;

  const textContent = `Greetings ${recipientName},\n\nYour Gringotts login OTP is: ${otp}\n\nThis code will expire in 5 minutes.\n\n— Gringotts Wizarding Bank`;

  return await sendBrevoEmail({
    toEmail: email,
    toName: recipientName,
    subject,
    htmlContent,
    textContent,
  });
};

/**
 * Send Password Reset OTP Email
 */
export const sendPasswordResetOTP = async (email, wizardName, otp) => {
  const recipientName = wizardName || "Wizard";
  const subject = "🔑 Gringotts Wizarding Bank — Password Reset OTP";

  const htmlContent = `
    <div style="font-family: 'Cinzel', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #12121c; color: #e0e0e0; border: 1px solid #ffd700; border-radius: 12px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 215, 0, 0.3);">
        <h1 style="color: #ffd700; margin: 0; font-size: 26px;">🏦 Gringotts Wizarding Bank</h1>
        <p style="color: #b8860b; font-size: 14px; margin-top: 5px; font-style: italic;">Fort Knox of the Wizarding World</p>
      </div>
      
      <div style="padding: 25px 0;">
        <h2 style="color: #ffd700; font-size: 20px; margin-top: 0;">Greetings ${recipientName},</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #d1d5db;">
          We received a request to reset the password for your Gringotts vault account. Please use the One-Time Password (OTP) below to verify your request:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background: linear-gradient(135deg, #ffd700, #b8860b); color: #111118; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 35px; border-radius: 8px; box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #f59e0b; font-weight: bold; text-align: center;">
          ⏳ This OTP will expire in 5 minutes.
        </p>

        <div style="background-color: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 4px; margin-top: 25px;">
          <p style="color: #fca5a5; font-size: 13px; margin: 0; line-height: 1.5;">
            <strong>Security Alert:</strong> If you did not request a password reset, please ignore this email or notify the Gringotts Goblins immediately. Do not share this OTP with anyone.
          </p>
        </div>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255, 215, 0, 0.2); font-size: 12px; color: #9ca3af;">
        <p style="margin: 0;">© 2026 Gringotts Wizarding Bank. All rights reserved.</p>
      </div>
    </div>
  `;

  const textContent = `Greetings ${recipientName},\n\nYour password reset OTP is: ${otp}\n\nThis code will expire in 5 minutes.\n\nIf you did not request a password reset, please ignore this email.\n\n— Gringotts Wizarding Bank`;

  return await sendBrevoEmail({
    toEmail: email,
    toName: recipientName,
    subject,
    htmlContent,
    textContent,
  });
};

/**
 * Send Welcome Email
 */
export const sendWelcomeEmail = async (email, wizardName) => {
  const recipientName = wizardName || "Wizard";
  const subject = "🏦 Welcome to Gringotts Wizarding Bank! ✨";

  const htmlContent = `
    <div style="font-family: 'Cinzel', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #12121c; color: #e0e0e0; border: 1px solid #ffd700; border-radius: 12px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid rgba(255, 215, 0, 0.3);">
        <h1 style="color: #ffd700; margin: 0; font-size: 26px;">🏦 Gringotts Wizarding Bank</h1>
        <p style="color: #b8860b; font-size: 14px; margin-top: 5px; font-style: italic;">Fort Knox of the Wizarding World</p>
      </div>
      
      <div style="padding: 25px 0;">
        <h2 style="color: #ffd700; font-size: 22px; margin-top: 0;">Welcome to Gringotts, ${recipientName}! 🏦✨</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #d1d5db;">
          Your account has been successfully verified. Your magical vault is now ready.
        </p>
        
        <div style="background-color: rgba(255, 215, 0, 0.05); border: 1px solid rgba(255, 215, 0, 0.2); padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #ffd700; font-size: 16px; margin-top: 0; margin-bottom: 12px;">🔑 You can now access features such as:</h3>
          <ul style="padding-left: 20px; margin: 0; color: #e5e7eb; font-size: 14px; line-height: 1.8; list-style-type: none;">
            <li>💰 <strong>Manage your vault:</strong> Deposit and withdraw Galleons</li>
            <li>⚡ <strong>Transfer funds:</strong> Send Galleons to other wizards</li>
            <li>📜 <strong>View transaction history:</strong> Track all your vault activity</li>
            <li>🧾 <strong>Download transaction receipts:</strong> Get official PDF receipts</li>
            <li>⚙️ <strong>Manage account preferences:</strong> Customize alerts and settings</li>
            <li>🔐 <strong>Manage account security:</strong> Protect your vault</li>
          </ul>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #ffd700; text-align: center; font-weight: bold;">
          Thank you for choosing Gringotts Wizarding Bank.<br/><br/>
          Your vault awaits.
        </p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255, 215, 0, 0.2); font-size: 12px; color: #9ca3af;">
        <p style="margin: 0;">— Gringotts Wizarding Bank</p>
        <p style="margin-top: 5px; font-size: 11px;">© 2026 Gringotts Wizarding Bank. All rights reserved.</p>
      </div>
    </div>
  `;

  const textContent = `Welcome to Gringotts Wizarding Bank, ${recipientName}! 🏦✨\n\nYour account has been successfully verified.\n\nYour magical vault is now ready.\n\nYou can now access features such as:\n\n💰 Manage your vault\n⚡ Transfer funds\n📜 View transaction history\n🧾 Download transaction receipts\n⚙️ Manage account preferences\n🔐 Manage account security\n\nThank you for choosing Gringotts Wizarding Bank.\n\nYour vault awaits.\n\n— Gringotts Wizarding Bank`;

  return await sendBrevoEmail({
    toEmail: email,
    toName: recipientName,
    subject,
    htmlContent,
    textContent,
  });
};
