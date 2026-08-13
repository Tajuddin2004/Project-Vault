import nodemailer from 'nodemailer';

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }, // Supports Gmail TLS handshake
  });
}

export async function sendOtpEmail(email, otpCode) {
  const subject = 'Project Vault - Your Sign Up Verification Code';
  const html = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0b192c; margin: 0 0 8px; font-size: 24px; font-weight: 800;">PROJECT VAULT</h2>
        <p style="color: #64748b; margin: 0; font-size: 14px;">Sign Up Verification Code</p>
      </div>
      <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #059669;">${otpCode}</span>
      </div>
      <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
        Use this 6-digit code to complete your registration. This code will expire in 10 minutes.
      </p>
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">
        If you didn't request this code, please ignore this email.
      </p>
    </div>
  `;

  const transporter = getTransporter();

  if (transporter) {
    try {
      const fromAddr = process.env.SMTP_FROM || `"${process.env.SMTP_FROM_NAME || 'Project Vault'}" <${process.env.SMTP_USER}>`;
      await transporter.sendMail({
        from: fromAddr,
        to: email,
        subject,
        html,
      });
      console.log(`[SMTP EMAIL SUCCESS] Sent Sign Up OTP ${otpCode} to ${email}`);
    } catch (err) {
      console.error(`[SMTP EMAIL FAILED] Could not send OTP to ${email}:`, err.message);
    }
  } else {
    console.log(`\n========================================`);
    console.log(`[DEV OTP EMAIL SINK] Email: ${email} | OTP: ${otpCode}`);
    console.log(`========================================\n`);
  }
}

export async function sendPasswordResetLinkEmail(email, resetUrl) {
  const subject = 'Project Vault - Secure Password Reset Link (Valid for 30 min)';
  const html = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 36px; background: #ffffff; border-radius: 20px; border: 1.5px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 28px;">
        <h2 style="color: #0b192c; margin: 0 0 6px; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">PROJECT VAULT</h2>
        <span style="display: inline-block; background: #ecfdf5; color: #059669; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; border: 1px solid rgba(16,185,129,0.3);">SECURE PASSWORD RESET</span>
      </div>

      <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
        We received a request to reset the password for your Project Vault account (<strong>${email}</strong>).
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 15px; display: inline-block; box-shadow: 0 4px 16px rgba(5,150,105,0.3);">
          Reset Password Now →
        </a>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 13px; color: #475569; line-height: 1.5;">
        <strong>⏳ Security Notice:</strong> This link is single-use and will expire in <strong>30 minutes</strong> (timestamp verified via online IST time).
      </div>

      <p style="color: #94a3b8; font-size: 12px; word-break: break-all; margin: 0 0 16px;">
        If the button above does not work, copy and paste this secure link into your browser:<br/>
        <a href="${resetUrl}" style="color: #059669; text-decoration: underline;">${resetUrl}</a>
      </p>

      <p style="color: #94a3b8; font-size: 12px; margin: 0; border-top: 1px solid #f1f5f9; padding-top: 16px;">
        If you did not request a password reset, please ignore this email or contact support.
      </p>
    </div>
  `;

  const transporter = getTransporter();

  if (transporter) {
    try {
      const fromAddr = process.env.SMTP_FROM || `"${process.env.SMTP_FROM_NAME || 'Project Vault'}" <${process.env.SMTP_USER}>`;
      await transporter.sendMail({
        from: fromAddr,
        to: email,
        subject,
        html,
      });
      console.log(`[SMTP EMAIL SUCCESS] Sent password reset link to ${email}`);
    } catch (err) {
      console.error(`[SMTP EMAIL FAILED] Could not send reset link to ${email}:`, err.message);
    }
  } else {
    console.log(`\n========================================`);
    console.log(`[DEV RESET LINK EMAIL SINK] Email: ${email} | Link: ${resetUrl}`);
    console.log(`========================================\n`);
  }
}

export async function sendWelcomeEmail(email, name) {
  const subject = 'Welcome to Project Vault!';
  const html = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
      <h2 style="color: #0b192c; margin: 0 0 12px; font-size: 22px; font-weight: 800;">Welcome, ${name}! 🎉</h2>
      <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
        Your email has been verified. You can now import your engineering projects, get automated AI analysis, and showcase your verified builds to recruiters and faculty.
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5174'}" style="background: #059669; color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px;">Go to Dashboard →</a>
      </div>
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">
        You're receiving this because you signed up for Project Vault.
      </p>
    </div>
  `;

  const transporter = getTransporter();

  if (transporter) {
    try {
      const fromAddr = process.env.SMTP_FROM || `"${process.env.SMTP_FROM_NAME || 'Project Vault'}" <${process.env.SMTP_USER}>`;
      await transporter.sendMail({
        from: fromAddr,
        to: email,
        subject,
        html,
      });
      console.log(`[SMTP EMAIL SUCCESS] Sent welcome email to ${email}`);
    } catch (err) {
      console.error(`[SMTP EMAIL FAILED] Could not send welcome email to ${email}:`, err.message);
    }
  } else {
    console.log(`[DEV EMAIL SINK] Welcome email sent to ${email}`);
  }
}
