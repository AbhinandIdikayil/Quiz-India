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

transporter.verify((error, success) => {
    if (error) {
        console.log("Error verifying transporter:", error);
    } else {
        console.log("Transporter is ready to send emails");
        console.log(success); 
    }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpMail(req, res) {
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

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');

  } catch (error) {
    console.error('Error sending OTP email:', error);
    res.status(500).json({ error: 'Failed to send OTP email. Please try again.' });
  }
}

module.exports = {
  sendOtpMail
};