const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailTemplate = (title, bodyHTML) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#0d0d14;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0"
        style="background:#1c1b2e;border:1px solid rgba(255,255,255,0.08);
               border-radius:20px;overflow:hidden">

        <tr>
          <td style="background:linear-gradient(135deg,#6c5ce7,#4ecdc4);
                     padding:32px;text-align:center">
            <div style="font-size:26px;font-weight:700;color:#fff">🎓 EduStream</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.8);margin-top:4px;
                        text-transform:uppercase;letter-spacing:0.08em">Learning Platform</div>
          </td>
        </tr>

        <tr>
          <td style="padding:36px 40px 40px">${bodyHTML}</td>
        </tr>

        <tr>
          <td style="padding:20px 40px 28px;border-top:1px solid rgba(255,255,255,0.07);
                     text-align:center">
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3)">
              If you didn't request this, you can safely ignore this email.<br>
              © ${new Date().getFullYear()} EduStream. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`;

// ── Send OTP email ──

const sendOTPEmail = async (email, name, otp, type) => {

  const isVerify   = type === 'verify';
  const heading    = isVerify ? 'Verify Your Account' : 'Reset Your Password';
  const subheading = isVerify
    ? 'Thanks for signing up! Use the OTP below to verify your email.'
    : 'We received a password reset request. Use the OTP below.';

  const bodyHTML = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f8f7ff">${heading}</h2>
    <p style="margin:0 0 28px;font-size:14px;color:rgba(255,255,255,0.6);line-height:1.6">
      Hi ${name}, ${subheading}
    </p>
    <div style="background:rgba(108,92,231,0.12);border:1px solid rgba(108,92,231,0.35);
                border-radius:14px;padding:28px;text-align:center;margin-bottom:28px">
      <p style="margin:0 0 10px;font-size:12px;color:rgba(255,255,255,0.45);
                text-transform:uppercase;letter-spacing:0.1em">Your One-Time Password</p>
      <div style="font-size:44px;font-weight:700;color:#a89eff;letter-spacing:12px;
                  font-family:'Courier New',monospace">${otp}</div>
      <p style="margin:12px 0 0;font-size:12px;color:rgba(255,255,255,0.35)">
        ⏱ Expires in <strong style="color:rgba(255,255,255,0.55)">10 minutes</strong>
      </p>
    </div>
    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.4)">
      If you didn't ${isVerify ? 'create an account' : 'request a password reset'},
      please ignore this email.
    </p>
  `;

  await transporter.sendMail({
    from:    `"EduStream" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: isVerify
      ? `🎓 Verify your EduStream account — OTP: ${otp}`
      : `🔐 Reset your EduStream password — OTP: ${otp}`,
    html: emailTemplate(heading, bodyHTML),
  });
};

// ── Send welcome email ──

const sendWelcomeEmail = async (email, name, role) => {

  const bodyHTML = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f8f7ff">
      Welcome to EduStream! 🎉
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.6);line-height:1.6">
      Hi ${name}, your account has been verified successfully.
      You're registered as a <strong style="color:#a89eff">${role}</strong>.
    </p>
    <div style="background:rgba(78,205,196,0.1);border:1px solid rgba(78,205,196,0.3);
                border-radius:12px;padding:20px 24px;margin-bottom:24px">
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7);line-height:1.9">
        ✅ Account verified<br>
        📚 Access all lectures<br>
        ${role === 'professor'
          ? '🎥 Upload lectures & create quizzes'
          : '📝 Take quizzes & track your scores'}
      </p>
    </div>
  `;

  await transporter.sendMail({
    from:    `"EduStream" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: '🎓 Welcome to EduStream — Account Verified!',
    html:    emailTemplate('Welcome', bodyHTML),
  });
};

module.exports = { sendOTPEmail, sendWelcomeEmail };