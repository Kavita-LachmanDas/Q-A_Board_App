import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:7000/api/auth/feedback", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFeedback(res.data);
        console.log("Feedback fetched:", res.data);
      } catch (err) {
        console.error("Failed to fetch feedback", err);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div>
      <h2>Feedback List</h2>
      {feedback.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>#</th>
              <th>Teacher Name</th>
              <th>Subject</th>
              <th>Rating</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((fb, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{fb.teacherName}</td>
                <td>{fb.subject}</td>
                <td>{fb.rating}</td>
                <td>{fb.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Feedback;
