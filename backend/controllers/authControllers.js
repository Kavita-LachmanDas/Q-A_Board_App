import userModel from "../model/authModel.js"
import _sendEmail from "../utils/Email.js"
import { signinToken } from "../utils/token.js"
import jwt from 'jsonwebtoken';


export const signup = async (req, res) => {
  try {
    const { password, email, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const isExist = await userModel.findOne({ email });
    if (isExist) {
      return res.status(200).json({
        success: false,
        message: "User Already Registered!"
      });
    }

    const createUser = await userModel.create(req.body);
    const token = signinToken(createUser);

    return res.status(201).json({
      user: createUser,
      token,
      success: true,
      message: "User created successfully!"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "SignUp Failed",
      error: error.message
    });
  }
};

 




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Get user with password
    const user = await userModel.findOne({ email }).select("+password"); // get password for comparison

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials"
      });
    }

    // Step 2: Remove password before sending user data to client
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    const token = signinToken(user);
    res.status(201).json({
      user: userWithoutPassword,
      token,
      success: true,
      message: "user logged in successfully!"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Signin Failed",
      error: error.message
    });
  }
};


export const forgetPassword = async(req,res)=>{
const {email}=req.body
const user = await userModel.findOne({email})
if(!user){
      return res.status(404).json({
      success: false,
      message: "User not found"
    });
}
console.log("JWT secret:", process.env.JWT_SCREATE);
console.log("Website URL:", process.env.WEBSITE_URL);

//reset token 
 const resetToken = jwt.sign({ id: user._id },
    process.env.JWT_SCREATE,
    { expiresIn: "2m" })

  // reset frontend url

  const reseturl = `${process.env.WEBSITE_URL}/reset-password/${resetToken}`

  try {
    await _sendEmail({
           to: user.email,
      subject: "Reset Password",
      html: `
         <div style="margin: 0 auto; width: 90%; height: 500px;">
          <h1 style="color: gold;" >Reset Password</h1>
          <p style="color: gray;">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam maxime vero libero.</p>
          <p>Click here to reset <a href="${reseturl}">Reset </a></p>
        </div>
        `
    })
    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully!"
    });

  } catch (error) {
     res.status(500).json({
        success: false,
      message: "Email send Failed",
      error: error.message

     })
  }

}


///////////// Reset Password

export const ResetPswd = async (req, res) => {
  const {token , password}= req.body
  try {
    
 const decoded = jwt.verify(token , process.env.JWT_SCREATE);

 const user = await userModel.findById(decoded.id);

   if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }


  ///// update user paswd

  user.password = password;

  user.save();


  res.status(200).json({
    success:true,
    message:"Password updated successfully!"
  })

  } catch (error) {
      res.status(500).json({
      success: false,
      message: "Password Reset Failed",
      error: error.message
    });
  }
}




