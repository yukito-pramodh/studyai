"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, ChevronLeft, Clock, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function StudyPlanPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  // This would be fetched from your API in a real application
  const studyPlan = {
    id: params.id,
    title: "Physics Final Exam",
    createdDate: "April 15, 2023",
    examDate: "May 20, 2023",
    progress: 75,
    topics: [
      {
        id: "topic-1",
        name: "Mechanics",
        progress: 90,
        subtopics: [
          { name: "Kinematics", status: "completed" },
          { name: "Newton's Laws", status: "completed" },
          { name: "Work and Energy", status: "completed" },
          { name: "Momentum", status: "in-progress" },
        ],
      },
      {
        id: "topic-2",
        name: "Electricity and Magnetism",
        progress: 60,
        subtopics: [
          { name: "Electric Fields", status: "completed" },
          { name: "Electric Potential", status: "completed" },
          { name: "Circuits", status: "in-progress" },
          { name: "Magnetic Fields", status: "not-started" },
          { name: "Electromagnetic Induction", status: "not-started" },
        ],
      },
      {
        id: "topic-3",
        name: "Waves and Optics",
        progress: 30,
        subtopics: [
          { name: "Wave Properties", status: "completed" },
          { name: "Sound Waves", status: "in-progress" },
          { name: "Electromagnetic Waves", status: "not-started" },
          { name: "Reflection and Refraction", status: "not-started" },
          { name: "Interference and Diffraction", status: "not-started" },
        ],
      },
    ],
    schedule: [
      {
        date: "Today",
        sessions: [
          { time: "4:00 PM - 5:30 PM", topic: "Momentum", subtopic: "Conservation of Momentum" },
          { time: "7:00 PM - 8:00 PM", topic: "Circuits", subtopic: "Kirchhoff's Laws" },
        ],
      },
      {
        date: "Tomorrow",
        sessions: [
          { time: "10:00 AM - 11:30 AM", topic: "Circuits", subtopic: "RC Circuits" },
          { time: "2:00 PM - 3:30 PM", topic: "Sound Waves", subtopic: "Doppler Effect" },
        ],
      },
      {
        date: "Wednesday, April 24",
        sessions: [
          { time: "9:00 AM - 10:30 AM", topic: "Magnetic Fields", subtopic: "Magnetic Force" },
          { time: "3:00 PM - 4:30 PM", topic: "Electromagnetic Waves", subtopic: "Properties of EM Waves" },
        ],
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6 text-emerald-600" />
          <span>StudyAI</span>
        </Link>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center mb-6">
            <Link href="/dashboard?tab=study-plans" className="mr-4">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{studyPlan.title}</h1>
              <p className="text-sm text-muted-foreground">
                Created on {studyPlan.createdDate} • Exam on {studyPlan.examDate}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="text-sm font-medium text-right">
                Overall Progress
                <span className="ml-2">{studyPlan.progress}%</span>
              </div>
              <Progress value={studyPlan.progress} className="w-24" />
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {studyPlan.topics.map((topic) => (
                  <Card key={topic.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>{topic.name}</CardTitle>
                        <span className="text-sm font-medium">{topic.progress}%</span>
                      </div>
                      <Progress value={topic.progress} className="h-2" />
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {topic.subtopics.map((subtopic, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <div
                              className={`mr-2 h-2 w-2 rounded-full ${
                                subtopic.status === "completed"
                                  ? "bg-emerald-500"
                                  : subtopic.status === "in-progress"
                                    ? "bg-amber-500"
                                    : "bg-gray-300 dark:bg-gray-600"
                              }`}
                            />
                            <span
                              className={subtopic.status === "completed" ? "line-through text-muted-foreground" : ""}
                            >
                              {subtopic.name}
                            </span>
                            {subtopic.status === "in-progress" && (
                              <span className="ml-auto text-xs font-medium text-amber-500">In progress</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Today's Study Sessions</CardTitle>
                  <CardDescription>Your scheduled study sessions for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studyPlan.schedule[0].sessions.map((session, index) => (
                      <div key={index} className="flex items-start">
                        <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800/30">
                          <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-medium">{session.time}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.topic}: {session.subtopic}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          Start Session
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Study Schedule</CardTitle>
                  <CardDescription>
                    Your personalized study schedule based on your availability and exam date
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {studyPlan.schedule.map((day, dayIndex) => (
                      <div key={dayIndex} className="space-y-3">
                        <h3 className="font-semibold">{day.date}</h3>
                        <div className="space-y-3">
                          {day.sessions.map((session, sessionIndex) => (
                            <div key={sessionIndex} className="flex items-center rounded-lg border p-3 text-sm">
                              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800/30">
                                <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div>
                                <p className="font-medium">{session.time}</p>
                                <p className="text-muted-foreground">
                                  {session.topic}: {session.subtopic}
                                </p>
                              </div>
                              <Button variant="outline" size="sm" className="ml-auto">
                                {dayIndex === 0 ? "Start" : "View"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Study Resources</CardTitle>
                  <CardDescription>Documents and materials related to your study plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center">
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800/30">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">Physics Syllabus</p>
                          <p className="text-sm text-muted-foreground">PDF • 2.4 MB</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          View
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center">
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800/30">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">Physics Textbook Chapters 1-5</p>
                          <p className="text-sm text-muted-foreground">PDF • 15.7 MB</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          View
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center">
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800/30">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">Physics Lab Notes</p>
                          <p className="text-sm text-muted-foreground">PDF • 3.2 MB</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Generated Study Materials</CardTitle>
                  <CardDescription>AI-generated materials to help you study</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center">
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800/30">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Physics Concept Summary</p>
                          <p className="text-sm text-muted-foreground">Generated on April 16, 2023</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          View
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center">
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800/30">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Physics Practice Questions</p>
                          <p className="text-sm text-muted-foreground">Generated on April 18, 2023</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          View
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center">
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800/30">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Physics Formula Sheet</p>
                          <p className="text-sm text-muted-foreground">Generated on April 20, 2023</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
