// const bcrypt = require('bcrypt');
// const { Userdb } = require('../../model/userModel');
// const { sendOtpMail } = require('../../utils/mailService');
// const { validateEmail, validatePassword, validateName } = require('../../utils/validators');

// module.exports = {

//     //user Registeration
//   userRegister: async (req, res) => {
//     try {
//       const { fullName, email, password, confirmPassword } = sanitizeInputs(req.body);
      
//       const errors = await validateInputs({ fullName, email, password, confirmPassword });
      
//       if (Object.keys(errors).length > 0) {
//         return res.status(400).json({ errors });
//       }

//       const SALT_ROUNDS = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      
//       const newUser = new Userdb({
//         fullName,
//         email,
//         password: hashedPassword,
//         userStatus: true,
//       });
      
//       await newUser.save();
      
//       req.session.verifyOtpPage = true;
//       req.session.verifyEmail = email;
      
//       await sendOtpMail(req, res);
      
//       res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
//     } catch (error) {
//       console.error('User registration error:', error);
//       res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
//     }
//   }
// };


// //funtions
// function sanitizeInputs(body) {
//   return {
//     fullName: body.fullName?.trim(),
//     email: body.email?.trim().toLowerCase(),
//     password: body.password?.trim(),
//     confirmPassword: body.confirmPassword?.trim()
//   };
// }

// async function validateInputs({ fullName, email, password, confirmPassword }) {
//   const errors = {};

//   if (!validateName(fullName)) {
//     errors.fullName = "Name must contain only letters and be non-empty";
//   }

//   if (!validateEmail(email)) {
//     errors.email = "Please provide a valid Gmail address";
//   } else {
//     const existingUser = await Userdb.findOne({ email });
//     if (existingUser) {
//       errors.email = "This email is already registered";
//     }
//   }

//   if (!validatePassword(password)) {
//     errors.password = "Password must be at least 6 characters long, contain an uppercase letter and a special character";
//   }

//   if (password !== confirmPassword) {
//     errors.confirmPassword = "Passwords do not match";
//   }

//   return errors;
// }