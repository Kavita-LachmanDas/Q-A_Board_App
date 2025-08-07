import Question from "../model/question.js";

// ✅ POST /api/questions - Add a new question
export const addQuestion = async (req, res) => {
  const { title, description, isPublic } = req.body;
  console.log("🔽 Add Question Request Body:", req.body);
  console.log("🔑 Logged-in User ID:", req.user?.userId);

  try {
    const question = await Question.create({
      title,
      description,
      isPublic,
      userId: req.user.userId,
    });

    console.log("✅ Question created:", question);
    res.status(201).json(question);
  } catch (err) {
    console.error("❌ Error creating question:", err.message);
    res.status(500).json({ error: "Failed to add question", details: err.message });
  }
};

// ✅ GET /api/questions/public - Get all public questions
export const getPublicQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ isPublic: true }).sort({ createdAt: -1 });
    console.log("📥 Public Questions Fetched:", questions.length);
    res.json(questions);
  } catch (err) {
    console.error("❌ Error fetching public questions:", err.message);
    res.status(500).json({ error: "Failed to fetch public questions" });
  }
};

// ✅ GET /api/questions/my - Get logged-in user's own questions
export const getMyQuestions = async (req, res) => {
  try {
    const myQuestions = await Question.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    console.log("📥 My Questions Fetched:", myQuestions.length);
    res.json(myQuestions);
  } catch (err) {
    console.error("❌ Error fetching my questions:", err.message);
    res.status(500).json({ error: "Failed to fetch your questions" });
  }
};

// ✅ PUT /api/questions/:id - Update a question (only own)
export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { title, description, isPublic } = req.body;
  console.log("🔧 Update Request:", { id, body: req.body });

  try {
    const question = await Question.findOne({ _id: id, userId: req.user.userId });

    if (!question) {
      console.warn("⚠️ Question not found or not yours.");
      return res.status(404).json({ error: "Question not found" });
    }

    question.title = title;
    question.description = description;
    question.isPublic = isPublic;
    await question.save();

    console.log("✅ Question updated:", question);
    res.json(question);
  } catch (err) {
    console.error("❌ Error updating question:", err.message);
    res.status(500).json({ error: "Failed to update question" });
  }
};

// ✅ DELETE /api/questions/:id - Delete a question (only own)
export const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  console.log("🗑️ Delete Request for Question ID:", id);

  try {
    const question = await Question.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!question) {
      console.warn("⚠️ Question not found or not yours.");
      return res.status(404).json({ error: "Question not found" });
    }

    console.log("✅ Question deleted:", question._id);
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting question:", err.message);
    res.status(500).json({ error: "Failed to delete question" });
  }
};
