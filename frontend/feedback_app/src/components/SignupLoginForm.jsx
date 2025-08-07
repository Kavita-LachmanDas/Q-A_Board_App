import axios from 'axios';
import React, { useState } from 'react'
import { setToken, setUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const SignupLoginForm = () => {
   const navigate = useNavigate()
   const [isLogin, setIsLogin] = useState(true);
   const [formData,setFormData]= useState({
   name: "",
 email:"",
 password:"",
 contact:""
   })


   const handleChange = (e)=>{
  setFormData(
    {
      ...formData,
      [e.target.name]:e.target.value
    }
  )
}

 



 const handleSignup = async (e) => {
  e.preventDefault();


  try {
    console.log("Sending formData:", formData);
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
      formData
    );

    console.log("Response:", data.message);
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      setFormData({
        name: "",
        email: "",
        password: "",
        contact: ""
      });
      navigate("/");
    } else {
      console.log("Signup Fail ", data.message);
    }
  } catch (error) {
    console.log("Signup Failed: ", error.message);
  }
};


 const handleLogin = async (e) => {
  e.preventDefault();


  try {
    console.log("Sending formData:", formData);
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
      {email:formData.email,password:formData.password}
    );

    console.log("Response login>>>>:", data.message);
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      setFormData({
        name: "",
        email: "",
        password: "",
        contact: ""
      });
      navigate("/");
    } else {
      console.log("login Fail ", data.message);
    }
  } catch (error) {
    console.log("login Failed: ", error.message);
  }
};

// const handleForgetPassword = async()=>{
//   const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/forget-password`,{email:formData.email})
//   if(data.success){
//       setToken(data.token);
//       setUser(data.user);
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         contact: ""
//       });
//       navigate("/");
//     } else {
//       console.log("forget password Fail ", data.message);
//     }
//   } catch (error) {
//     console.log("forget password failed: ", error.message);
//   }
// };

const handleForgetPassword = async () => {
  try {
    const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/forget-password`, {
      email: formData.email
    });

    if (data.success) {
      alert("Reset password email sent!");

      // Optional: clear form and/or redirect to login
      setFormData({
        // name: "",
        email: "",
        // password: "",
        // contact: ""
      });
      navigate("/auth"); // or just show success message

    } else {
      console.log("Forget password failed>>>>>>>>>:", data.message);
    }
  } catch (error) {
    console.log("Forget password failed:", error.message);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form  onSubmit={isLogin ? handleLogin : handleSignup} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        {!isLogin && (
          <>
            <input
            name='name'
            value={formData.name}
            onChange={handleChange}
              type="text"
              placeholder="Name"
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
            <input
            name='contact'
            value={formData.contact}
            onChange={handleChange}
              type="text"
              placeholder="Contact"
              className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
          </>
        )}

        <input
                    name='email'
            value={formData.email}
            onChange={handleChange}
     
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        />
        <input
                    name='password'
            value={formData.password}
            onChange={handleChange}
           
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border border-gray-300 rounded"
        />

        {isLogin && (
          <div className="text-right mb-4">
            <button
              type="button"
              className="text-sm text-blue-500 hover:underline"
              onClick={handleForgetPassword}
            >
              Forgot Password?
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>

        <p className="mt-4 text-sm text-center">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            className="text-blue-500 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  );
};


export default SignupLoginForm
