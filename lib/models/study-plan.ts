import mongoose from "mongoose"

const StudyPlanSchema = new mongoose.Schema({
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
  examDate: {
    type: Date,
    required: [true, "Please provide an exam date"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  studyHoursPerWeek: {
    type: Number,
    required: [true, "Please provide study hours per week"],
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  notes: {
    type: String,
    default: "",
  },
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
  ],
  topics: [
    {
      name: String,
      progress: {
        type: Number,
        default: 0,
      },
      subtopics: [
        {
          name: String,
          status: {
            type: String,
            enum: ["not-started", "in-progress", "completed"],
            default: "not-started",
          },
        },
      ],
    },
  ],
  schedule: [
    {
      date: Date,
      sessions: [
        {
          startTime: String,
          endTime: String,
          topic: String,
          subtopic: String,
          completed: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
  overallProgress: {
    type: Number,
    default: 0,
  },
})

export default mongoose.models.StudyPlan || mongoose.model("StudyPlan", StudyPlanSchema)
