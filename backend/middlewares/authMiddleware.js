// import jwt from "jsonwebtoken";
// import userModel from "../model/authModel.js";


// export const middlewareToProtect = async (req, res, next) => {
//   try {

//     const token = req.headers.authorization.split(" ")[1];
//     if (!token) {
//       res.status(401).json({ success: false, message: "Token not provided!" })
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SCREATE);
//     req.user = await userModel.findById(decoded.id).select("-password");


//     next();
//   }

//   catch (error) {
//     res.status(401).json({ success: false, message: "Invalid / Expired token!" })
//   }
// }

import jwt from "jsonwebtoken";
import userModel from "../model/authModel.js";

export const middlewareToProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Token not provided!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SCREATE);

    const user = await userModel.findById(decoded.userId || decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Merge full user and also keep userId for questions
    req.user = {
      ...user.toObject(),               // profile ke liye
      userId: user._id.toString()      // questions ke liye
    };

    next();
  } catch (error) {
    console.error("❌ Auth Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid / Expired token!" });
  }
};


export const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only ${role}s are allowed.`
      });
    }
    next();
  };
};


