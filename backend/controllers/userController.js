import userModel from "../model/authModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const feedback = await userModel.find()
    if (!feedback) return res.status(404).json({ msg: 'user not found' });

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};


