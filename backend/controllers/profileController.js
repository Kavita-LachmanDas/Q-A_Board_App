import userModel from "../model/authModel.js";
import cloudinary from "../utils/cloudinary.js";

export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get profile", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    // Update text fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // If file uploaded, set image path
    if (req.file) {
      // ✅ Delete previous image from Cloudinary (if exists)
      if (user.image[0]?.public_id) {
        await cloudinary.uploader.destroy(user.image[0].public_id);
      }

      // ✅ Upload new image
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "users" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer); // send buffer to cloudinary
      });

      user.image = [
        {
          url: result.secure_url,
          public_id: result.public_id,
        },
      ];
    }

    await user.save();

    res.status(200).json({ success: true, message: "Profile updated successfully!", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating profile", error: error.message });
  }
};



export const deleteProfile = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
   // ❌ delete image from Cloudinary
    if (user.image[0]?.public_id) {
      await cloudinary.uploader.destroy(user.image[0].public_id);
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};


