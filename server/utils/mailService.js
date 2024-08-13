const nodemailer = require('nodemailer');
require('dotenv').config();

const { AUTH_EMAIL, AUTH_PASS } = process.env;

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: AUTH_EMAIL,  
        pass: AUTH_PASS,
    },
    tls: {
        rejectUnauthorized: false, 
    },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpMail(req) {
  const { verifyEmail } = req.session;
  const otp = generateOTP();

  // Save OTP to session 
  req.session.otp = otp;

  const mailOptions = {
    from: AUTH_EMAIL,
    to: verifyEmail,
    subject: 'Your OTP for Account Verification',
    html: `
      <h1>Account Verification</h1>
      <p>Your OTP for account verification is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  await transporter.sendMail(mailOptions);
  console.log('OTP email sent successfully to', verifyEmail, "otp", otp);
}

module.exports = {
  sendOtpMail
};