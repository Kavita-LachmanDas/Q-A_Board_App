import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  teacherName: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    required: true,
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const studentFeedbackSchmea = mongoose.model('studentFeedback',feedbackSchema)
export default studentFeedbackSchmea