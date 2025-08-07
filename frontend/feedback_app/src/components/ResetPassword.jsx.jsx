import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');

  const handleReset = async () => {
    try {
      const res = await axios.post('http://localhost:7000/api/auth/reset-password', {
        token,
        password,
      });
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <h2>Reset Your Password</h2>
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
};

export default ResetPassword;
