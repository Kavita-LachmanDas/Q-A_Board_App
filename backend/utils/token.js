import jwt from "jsonwebtoken";

export const signinToken = (user)=>{
return jwt.sign({userId: user._id,password:user.password,email:user.email},
    process.env.JWT_SCREATE,
    {expiresIn:"1h"}
)
}