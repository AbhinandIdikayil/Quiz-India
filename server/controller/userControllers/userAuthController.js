const bcrypt = require('bcrypt');
const  Userdb  = require('../../model/userModel');
const jwt = require("jsonwebtoken");
const { sendOtpMail } = require('../../utils/mailService');
const { validateEmail, validatePassword, validateName } = require('../../utils/validators');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

const cookieConfig = {
  secure: true,
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24,
};


module.exports = {

    //user Registeration
    userRegister: async (req, res) => {
      try {
        const { name, email, password, confirmPassword } = sanitizeInputs(req.body);
        
        const errors = await validateInputs(name, email, password, confirmPassword);
        
        if (Object.keys(errors).length > 0) {
          return res.status(400).json({ errors });
        }
        
        const SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
       req.session.otpUser = {
          name,
          email,
          password: hashedPassword,
          userStatus: true,
        };
  
        req.session.verifyOtpPage = true;
        req.session.verifyEmail = email;
        
        try {
          await sendOtpMail(req);
          return res.status(201).json({ message: 'OTP sent successfully' });
        } catch (otpError) {
          console.error('Error sending OTP:', otpError);
          return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
        }
      } catch (error) {
        console.error('User registration error:', error);
        return res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
      }
    },

    renderOtpPage: async (req, res) => {
      try {
          const email = req.session.verifyEmail;
          if (!email) {
              return res.status(400).json({ error: 'Invalid session. Please register again.' });
          }
          res.status(200).render("otp", { email });
      } catch (error) {
          console.error("Error in renderOtpPage:", error);
          res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
      }
  },

  verifyOtp : async(req, res)=>{
        try {
          const { enteredOtp } = req.body;
          const storedOtp = req.session.otp; 
    
          if (enteredOtp === storedOtp) {

            const userData = req.session.otpUser;
            if(!userData){
              return res.status(400).json({ success: false, message: "User not found" });
            }

            const newUser = new Userdb({
             ...userData
            });
    
           const user = await newUser.save();

            const token = createToken(user._id);

            res.cookie("user_token", token, cookieConfig);

            delete req.session.otp;
            delete req.session.verifyEmail;
            delete req.session.otpUser;

            res.json({ success: true, message: "User registered successfully" });
          } else {
            res.json({ success: false, message: "Invalid OTP" });
          }
        } catch (error) {
          console.log("Verify OTP error", error);
          res.status(500).json({ success: false, message: "Server error" });
        }
      },
    
      resendOtp: async (req, res) => {
        try {
          
          await sendOtpMail(req);
    
          res.json({ success: true, message: "OTP resent successfully" });
        } catch (error) {
          console.log("Resend OTP error", error);
          res.status(500).json({ success: false, message: "Server error" });
        }
    },

    userLogin: async (req, res) =>{
      try {
        const { email, password } = req.body;

        const user = await Userdb.findOne({ email });
        
        if (!user) return res.status(401).json({message: "Invalid email or password"});
   
        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) return res.status(401).json({ message: "Invalid email or password"});

        const token = createToken(user._id);

        res.cookie("user_token", token, cookieConfig);
    
        res.status(200).json(user);

      } catch (error) {
        console.log(error);
        res.status(500).json({message: "server error"});
      }
    }
 

};


//funtions
function sanitizeInputs(body) {
  return {
    name: body.name?.trim(),
    email: body.email?.trim().toLowerCase(),
    password: body.password?.trim(),
    confirmPassword: body.confirmPassword?.trim()
  };
}

async function validateInputs( name, email, password, confirmPassword ) {
  const errors = {};

  if (!validateName(name)) {
    errors.name = "Name must contain only letters and be non-empty";
  }

  if (!validateEmail(email)) {
    errors.email = "Please provide a valid Gmail address";
  } else {
    const existingUser = await Userdb.findOne({ email });
    if (existingUser) {
      errors.email = "This email is already registered";
    }
  }

  if (!validatePassword(password)) {
    errors.password = "Password must be at least 6 characters long, contain an uppercase letter and a special character";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}


