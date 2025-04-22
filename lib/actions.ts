"use server"

import { revalidatePath } from "next/cache"
import dbConnect from "./db"
import User from "./models/user"
import Document from "./models/document"
import StudyPlan from "./models/study-plan"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Helper function to set JWT token in cookies
const setTokenCookie = (token: string) => {
  cookies().set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

// Helper function to get user from token
export async function getUserFromToken() {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    await dbConnect()
    const user = await User.findById(decoded.id).select("-password")
    return user
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

export async function createUser(email: string, password: string) {
  await dbConnect()

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Create new user
  const user = await User.create({
    email,
    password,
  })

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "7d",
  })

  // Set token in cookies
  setTokenCookie(token)

  return {
    id: user._id,
    email: user.email,
  }
}

export async function loginUser(email: string, password: string) {
  await dbConnect()

  // Find user by email
  const user = await User.findOne({ email }).select("+password")
  if (!user) {
    throw new Error("Invalid credentials")
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    throw new Error("Invalid credentials")
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "7d",
  })

  // Set token in cookies
  setTokenCookie(token)

  return {
    id: user._id,
    email: user.email,
  }
}

export async function logoutUser() {
  cookies().delete("token")
  return { success: true }
}

export async function createStudyPlan(formData: FormData, files: File[]) {
  await dbConnect()

  const user = await getUserFromToken()
  if (!user) {
    throw new Error("Not authenticated")
  }

  const planName = formData.get("planName") as string
  const examDate = formData.get("examDate") as string
  const studyHours = Number.parseInt(formData.get("studyHours") as string)
  const difficulty = formData.get("difficulty") as string
  const notes = formData.get("notes") as string

  // Upload files and process them
  const documentIds = []
  for (const file of files) {
    const document = await processDocument(file)
    documentIds.push(document._id)
  }

  // Create study plan
  const studyPlan = await StudyPlan.create({
    title: planName,
    user: user._id,
    examDate: new Date(examDate),
    studyHoursPerWeek: studyHours,
    difficulty,
    notes,
    documents: documentIds,
  })

  // Generate topics and schedule based on documents
  await generateStudyPlanContent(studyPlan._id)

  revalidatePath("/dashboard")

  return {
    id: studyPlan._id,
    title: studyPlan.title,
  }
}

export async function processDocument(file: File) {
  await dbConnect()

  const user = await getUserFromToken()
  if (!user) {
    throw new Error("Not authenticated")
  }

  // In a real application, you would upload the file to a storage service
  // For this example, we'll simulate the file URL
  const fileUrl = `https://storage.example.com/${Date.now()}-${file.name}`

  // Create document record
  const document = await Document.create({
    title: file.name,
    user: user._id,
    fileUrl,
    fileType: file.type,
    fileSize: file.size,
    uploadDate: new Date(),
  })

  // Process document with AI (in a real app, this would be a background job)
  await processDocumentWithAI(document._id)

  revalidatePath("/dashboard")

  return document
}

async function processDocumentWithAI(documentId: string) {
  await dbConnect()

  const document = await Document.findById(documentId)
  if (!document) {
    throw new Error("Document not found")
  }

  try {
    // In a real application, you would extract text from the document
    // For this example, we'll simulate the content
    const documentContent = "This is a sample document content that would be extracted from the PDF."

    // Generate summary using AI
    const { text: summary } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Summarize the following document content in a concise way: ${documentContent}`,
    })

    // Generate key terms using AI
    const { text: keyTermsText } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Extract 5 key terms and their definitions from the following document content. Format as JSON array with "term" and "definition" properties: ${documentContent}`,
    })
    const keyTerms = JSON.parse(keyTermsText)

    // Generate quiz questions using AI
    const { text: quizQuestionsText } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Create 3 multiple-choice quiz questions based on the following document content. Format as JSON array with "question", "options" (array of 4 choices), and "answer" (the correct option) properties: ${documentContent}`,
    })
    const quizQuestions = JSON.parse(quizQuestionsText)

    // Update document with processed content
    document.summary = summary
    document.keyTerms = keyTerms
    document.quizQuestions = quizQuestions
    document.processed = true
    await document.save()

    return document
  } catch (error) {
    console.error("Error processing document with AI:", error)
    throw error
  }
}

async function generateStudyPlanContent(studyPlanId: string) {
  await dbConnect()

  const studyPlan = await StudyPlan.findById(studyPlanId).populate("documents")
  if (!studyPlan) {
    throw new Error("Study plan not found")
  }

  try {
    // Combine all document content
    const documents = studyPlan.documents
    let combinedContent = ""

    for (const doc of documents) {
      combinedContent += doc.summary + "\n\n"
    }

    // Generate topics using AI
    const { text: topicsText } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Based on the following content, identify the main topics and subtopics for a study plan. Format as JSON array with "name" (topic name) and "subtopics" (array of objects with "name" property): ${combinedContent}`,
    })
    const topics = JSON.parse(topicsText)

    // Format topics for our schema
    const formattedTopics = topics.map((topic: any) => ({
      name: topic.name,
      progress: 0,
      subtopics: topic.subtopics.map((subtopic: any) => ({
        name: subtopic.name,
        status: "not-started",
      })),
    }))

    // Generate schedule using AI
    const examDate = new Date(studyPlan.examDate)
    const today = new Date()
    const daysUntilExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const studyHoursPerWeek = studyPlan.studyHoursPerWeek

    const { text: scheduleText } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Create a study schedule for the next 7 days based on the following parameters:
      - Topics: ${JSON.stringify(formattedTopics)}
      - Days until exam: ${daysUntilExam}
      - Study hours per week: ${studyHoursPerWeek}
      - Difficulty: ${studyPlan.difficulty}
      
      Format as JSON array with "date" (YYYY-MM-DD format) and "sessions" (array of objects with "startTime", "endTime", "topic", and "subtopic" properties):`,
    })
    const scheduleData = JSON.parse(scheduleText)

    // Format schedule for our schema
    const formattedSchedule = scheduleData.map((day: any) => ({
      date: new Date(day.date),
      sessions: day.sessions.map((session: any) => ({
        startTime: session.startTime,
        endTime: session.endTime,
        topic: session.topic,
        subtopic: session.subtopic,
        completed: false,
      })),
    }))

    // Update study plan with generated content
    studyPlan.topics = formattedTopics
    studyPlan.schedule = formattedSchedule
    await studyPlan.save()

    return studyPlan
  } catch (error) {
    console.error("Error generating study plan content with AI:", error)
    throw error
  }
}

export async function updateStudyProgress(studyPlanId: string, topicId: string, subtopicId: string, status: string) {
  await dbConnect()

  const user = await getUserFromToken()
  if (!user) {
    throw new Error("Not authenticated")
  }

  const studyPlan = await StudyPlan.findOne({ _id: studyPlanId, user: user._id })
  if (!studyPlan) {
    throw new Error("Study plan not found")
  }

  // Update subtopic status
  const topic = studyPlan.topics.id(topicId)
  if (!topic) {
    throw new Error("Topic not found")
  }

  const subtopic = topic.subtopics.id(subtopicId)
  if (!subtopic) {
    throw new Error("Subtopic not found")
  }

  subtopic.status = status

  // Calculate topic progress
  const completedSubtopics = topic.subtopics.filter((st) => st.status === "completed").length
  topic.progress = Math.round((completedSubtopics / topic.subtopics.length) * 100)

  // Calculate overall progress
  let totalSubtopics = 0
  let totalCompleted = 0

  studyPlan.topics.forEach((t) => {
    totalSubtopics += t.subtopics.length
    totalCompleted += t.subtopics.filter((st) => st.status === "completed").length
  })

  studyPlan.overallProgress = Math.round((totalCompleted / totalSubtopics) * 100)

  await studyPlan.save()
  revalidatePath("/dashboard")

  return studyPlan
}

export async function markSessionComplete(studyPlanId: string, scheduleId: string, sessionId: string) {
  await dbConnect()

  const user = await getUserFromToken()
  if (!user) {
    throw new Error("Not authenticated")
  }

  const studyPlan = await StudyPlan.findOne({ _id: studyPlanId, user: user._id })
  if (!studyPlan) {
    throw new Error("Study plan not found")
  }

  // Update session status
  const schedule = studyPlan.schedule.id(scheduleId)
  if (!schedule) {
    throw new Error("Schedule not found")
  }

  const session = schedule.sessions.id(sessionId)
  if (!session) {
    throw new Error("Session not found")
  }

  session.completed = true
  await studyPlan.save()

  revalidatePath("/dashboard")

  return studyPlan
}

export async function getUserStudyPlans() {
  await dbConnect()

  const user = await getUserFromToken()
  if (!user) {
    throw new Error("Not authenticated")
  }

  const studyPlans = await StudyPlan.find({ user: user._id }).sort({ createdAt: -1 })
  return studyPlans
}

export async function getUserDocuments() {
  await dbConnect()

  const user = await getUserFromToken()
  if (!user) {
    throw new Error("Not authenticated")
  }

  const documents = await Document.find({ user: user._id }).sort({ uploadDate: -1 })
  return documents
}

export async function getStudyPlan(id: string) {
  await dbConnect()

  const user = await getUserFromToken()
  if (!user) {
    throw new Error("Not authenticated")
  }

  const studyPlan = await StudyPlan.findOne({ _id: id, user: user._id }).populate("documents")
  if (!studyPlan) {
    throw new Error("Study plan not found")
  }

  return studyPlan
}

export async function getDocument(id: string) {
  await dbConnect()

  const user = await getUserFromToken()
  if (!user) {
    throw new Error("Not authenticated")
  }

  const document = await Document.findOne({ _id: id, user: user._id })
  if (!document) {
    throw new Error("Document not found")
  }

  return document
}

export async function updateUserProfile(formData: FormData) {
  await dbConnect()

  const user = await getUserFromToken()
  if (!user) {
    throw new Error("Not authenticated")
  }

  const name = formData.get("name") as string
  const learningPreference = formData.get("learningPreference") as string

  user.name = name
  user.learningPreference = learningPreference
  await user.save()

  revalidatePath("/dashboard")

  return user
}
