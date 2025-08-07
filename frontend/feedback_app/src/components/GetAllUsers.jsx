import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

const GetAllUsers = () => {
  const [users, setusers] = useState([]);

  useEffect(() => {
    const fetchusers = async () => {
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:7000/api/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setusers(res.data);
        console.log("Feedback fetched:", res.data);
      } catch (err) {
        console.error("Failed to fetch feedback", err);
      }
    };

    fetchusers();
  }, []);

  return (
    <div>
      <h2>Feedback List</h2>
      {users.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>#</th>
              <th> Name</th>
              <th>email</th>
              <th>contact</th>
              <th>role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((fb, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{fb.name}</td>
                <td>{fb.email}</td>
                <td>{fb.contact}</td>
                <td>{fb.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GetAllUsers;
