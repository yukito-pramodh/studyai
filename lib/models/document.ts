import mongoose from "mongoose"

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileUrl: {
    type: String,
    required: [true, "Please provide a file URL"],
  },
  fileType: {
    type: String,
    required: [true, "Please provide a file type"],
  },
  fileSize: {
    type: Number,
    required: [true, "Please provide a file size"],
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  summary: {
    type: String,
    default: "",
  },
  keyTerms: [
    {
      term: String,
      definition: String,
    },
  ],
  quizQuestions: [
    {
      question: String,
      options: [String],
      answer: String,
    },
  ],
  processed: {
    type: Boolean,
    default: false,
  },
  documentType: {
    type: String,
    enum: ["syllabus", "notes", "textbook", "assignment", "other"],
    default: "other",
  },
  subject: {
    type: String,
    default: "",
  },
})

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema)
