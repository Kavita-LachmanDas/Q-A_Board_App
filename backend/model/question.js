import mongoose from "mongoose";

// const questionSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   isPublic: {
//     type: Boolean,
//     default: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // ✅ Use PascalCase for model name
// const Question = mongoose.model("Question", questionSchema);
// export default Question;
const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  isPublic: Boolean,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  answer: {
    type: String,
    default: "",  // <-- Add this
  },
  replies: [{
    message: String,
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

const Question = mongoose.model("Question", questionSchema);
export default Question;
