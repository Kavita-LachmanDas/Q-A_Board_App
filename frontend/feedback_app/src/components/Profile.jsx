// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { getToken } from "../utils/auth";

// const Profile = () => {
//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     contact: "",
//     image: "",
//   });

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const token =getToken() // assuming you're storing token here
  //       const res = await axios.get("http://localhost:7000/api/auth/profile", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setUser(res.data);
  //     } catch (err) {
  //       console.error("Failed to fetch profile", err);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

//   return (
//     <div>
//       <h2>Profile</h2>
//       <img
//         src={`http://localhost:7000/${user.image}`}
//         alt="Profile"
//         style={{ width: "100px", height: "100px", objectFit: "cover" }}
//       />
//       <p><strong>Name:</strong> {user.name}</p>
//       <p><strong>Email:</strong> {user.email}</p>
//       <p><strong>Contact:</strong> {user.contact}</p>
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";

const Profile = () => {
const [user, setUser] = useState({
  name: "",
  email: "",
  contact: "",
  image: [],   // ✅ empty array rakh do taake consistent rahe
});


  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
   const fetchProfile = async () => {
  try {
    const token = getToken();
    const res = await axios.get("http://localhost:7000/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUser(res.data.user); // ✅ use res.data.user instead of res.data
  } catch (err) {
    console.error("Failed to fetch profile", err);
  }
};


    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("contact", user.contact);
    if (imageFile) formData.append("image", imageFile);

    try {
      const token = getToken();
      const res = await axios.put("http://localhost:7000/api/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);
      setUser(res.data.user);
    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your profile?");
    if (!confirmDelete) return;

    try {
      const token = getToken();
      const res = await axios.delete("http://localhost:7000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message);
      // Optionally: redirect user after deletion
    } catch (err) {
      console.error("Error deleting profile", err);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Profile</h2>
      {user.image?.[0]?.url && (
        <img
        src={user.image[0].url}
          alt="Profile"
          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
        />
      )}
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={user.name} onChange={handleInputChange} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={user.email} onChange={handleInputChange} />
      </div>
      <div>
        <label>Contact:</label>
        <input type="text" name="contact" value={user.contact} onChange={handleInputChange} />
      </div>
      <div>
        <label>Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleUpdate} style={{ marginRight: "10px" }}>
          Update Profile
        </button>
        <button onClick={handleDelete} style={{ backgroundColor: "red", color: "white" }}>
          Delete Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
