import { Router } from "express";
import {  forgetPassword, login, ResetPswd, signup,  } from "../controllers/authControllers.js";
import { authorize, middlewareToProtect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerimage.js";
import { deleteProfile, getProfile, updateProfile } from "../controllers/profileController.js";
import { deleteUser, getAllUsers } from "../controllers/userController.js";
import { addQuestion, deleteQuestion, getMyQuestions, getPublicQuestions, updateQuestion } from "../controllers/questionController.js";
import Question from "../model/question.js";

const router = Router()

router.post('/signup',signup)
router.post('/login',login)
router.post('/forget-password',forgetPassword)
router.post('/reset-password',ResetPswd)
router.get("/users", middlewareToProtect,authorize("admin") , getAllUsers)
router.delete("/users/:id", middlewareToProtect,authorize("admin") , deleteUser)
router.get('/profile',middlewareToProtect , getProfile);
router.put('/profile', middlewareToProtect, upload.single('image'), updateProfile);
router.delete("/profile", middlewareToProtect, deleteProfile);
router.post("/questions", middlewareToProtect, addQuestion);           // Add new question
router.get("/questions/public", getPublicQuestions);                   // All public questions
router.get("/questions/my", middlewareToProtect, getMyQuestions);      // Logged-in user's own questions
router.put("/questions/:id", middlewareToProtect, updateQuestion);     // Edit own question
router.delete("/questions/:id", middlewareToProtect, deleteQuestion);  // Delete own question

// Add this route to handle admin answers
// Final working answer route for your schema
router.post("/questions/:id/answer", middlewareToProtect, async (req, res) => {
  try {
    console.log("User making request:", req.user);
    console.log("Question ID:", req.params.id);
    console.log("Answer:", req.body.answer);

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Only admins can answer questions" });
    }

    const { id } = req.params;
    const { answer } = req.body;

    // Validate input
    if (!answer || answer.trim() === '') {
      return res.status(400).json({ message: "Answer cannot be empty" });
    }

    // Check if question exists first
    const existingQuestion = await Question.findById(id);
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Update question with answer
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { answer: answer.trim() },
      { new: true }
    ).populate('userId', 'name email'); // This matches your schema

    console.log("Answer added successfully:", updatedQuestion);

    res.status(200).json({ 
      message: "Answer added successfully", 
      question: updatedQuestion 
    });
  } catch (error) {
    console.error("Error adding answer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router

