const nodemailer = require('nodemailer');
const Mailgen = require('mailgen'); // Assuming Mailgen is installed
const Otpdb = require("../model/otpModel");// Adjust the path according to your project structure

// Function to delete OTP from the database
const deleteOtpFromdb = async (_id) => {
  await Otpdb.deleteOne({ _id });
};

// Function to generate a 4-digit OTP
const otpGenerator = () => {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
};

// Function to send OTP email
const sendOtpMail = async (req, res, getRoute) => {
  const otp = otpGenerator();

  console.log(otp, "-------------------------------------------------");

  // Create the transporter object for sending email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  // Mailgen setup
  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Quiz India",
      link: "https://mailgen.js/",
      logo: "Quiz India", // Replace with your logo link if available
    },
  });

  // Email body content generation
  const response = {
    body: {
      name: req.session.verifyEmail,
      intro: "Your OTP for  Quiz India verification is:",
      table: {
        data: [
          {
            OTP: otp,
          },
        ],
      },
      outro: "Looking forward to doing more business",
    },
  };

  // Generate HTML email
  const mail = MailGenerator.generate(response);

  // Mail options
  const message = {
    from: process.env.AUTH_EMAIL,
    to: req.session.verifyEmail,
    subject: "Threadpool OTP Verification",
    html: mail,
  };

  try {
    // Save the OTP to the database
    const newOtp = new Otpdb({
      email: req.session.verifyEmail,
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000, // OTP expires in 1 minute
    });

    const data = await newOtp.save();

    // Store OTP ID in session
    req.session.otpId = data._id;

    // Send the email
    await transporter.sendMail(message);

    // Redirect to the specified route after sending the email
    res.status(200).redirect(getRoute);

  } catch (err) {
    console.error('Error occurred:', err);
    
    // Render error page in case of failure
  }
};

module.exports = {
  deleteOtpFromdb,
  sendOtpMail,
};
