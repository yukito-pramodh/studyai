"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Calendar, ChevronLeft, Upload } from "lucide-react"
import { createStudyPlan } from "@/lib/actions"

export default function CreatePlanPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [step, setStep] = useState(1)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)

    try {
      await createStudyPlan(formData, files)
      window.location.href = "/dashboard?tab=study-plans"
    } catch (error) {
      console.error("Error creating study plan:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6 text-emerald-600" />
          <span>StudyAI</span>
        </Link>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center mb-6">
            <Link href="/dashboard" className="mr-4">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Create New Study Plan</h1>
          </div>
          <div className="mb-8">
            <div className="flex justify-between">
              <div className={`flex flex-col items-center ${step >= 1 ? "text-emerald-600" : "text-gray-400"}`}>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-emerald-100 dark:bg-emerald-800/30" : "bg-gray-100 dark:bg-gray-800"}`}
                >
                  1
                </div>
                <span className="mt-1 text-xs">Upload</span>
              </div>
              <div
                className={`flex-1 h-0.5 self-center ${step >= 2 ? "bg-emerald-600" : "bg-gray-200 dark:bg-gray-700"}`}
              ></div>
              <div className={`flex flex-col items-center ${step >= 2 ? "text-emerald-600" : "text-gray-400"}`}>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-emerald-100 dark:bg-emerald-800/30" : "bg-gray-100 dark:bg-gray-800"}`}
                >
                  2
                </div>
                <span className="mt-1 text-xs">Details</span>
              </div>
              <div
                className={`flex-1 h-0.5 self-center ${step >= 3 ? "bg-emerald-600" : "bg-gray-200 dark:bg-gray-700"}`}
              ></div>
              <div className={`flex flex-col items-center ${step >= 3 ? "text-emerald-600" : "text-gray-400"}`}>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? "bg-emerald-100 dark:bg-emerald-800/30" : "bg-gray-100 dark:bg-gray-800"}`}
                >
                  3
                </div>
                <span className="mt-1 text-xs">Review</span>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Study Materials</CardTitle>
                  <CardDescription>
                    Upload your syllabus, notes, or any other study materials in PDF format.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Drag and drop your files here</h3>
                      <p className="text-sm text-muted-foreground">
                        or click to browse (PDF, DOCX, TXT up to 10MB each)
                      </p>
                    </div>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileChange}
                    />
                    <Label htmlFor="file-upload" className="mt-4">
                      <Button type="button" variant="outline">
                        Browse Files
                      </Button>
                    </Label>
                  </div>
                  {files.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Selected Files:</h4>
                      <ul className="space-y-1">
                        {files.map((file, index) => (
                          <li key={index} className="text-sm">
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => setStep(2)}
                      disabled={files.length === 0}
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Study Plan Details</CardTitle>
                  <CardDescription>Provide information about your study goals and timeline.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan-name">Study Plan Name</Label>
                    <Input id="plan-name" name="planName" placeholder="e.g., Physics Final Exam" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exam-date">Exam Date</Label>
                    <Input id="exam-date" name="examDate" type="date" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="study-hours">Available Study Hours (per week)</Label>
                      <Input
                        id="study-hours"
                        name="studyHours"
                        type="number"
                        min="1"
                        max="168"
                        placeholder="10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Subject Difficulty</Label>
                      <select
                        id="difficulty"
                        name="difficulty"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select difficulty</option>
                        <option value="easy">Easy - I grasp concepts quickly</option>
                        <option value="medium">Medium - Some concepts are challenging</option>
                        <option value="hard">Hard - I need extra time with this subject</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any specific topics you want to focus on or additional information"
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button type="button" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setStep(3)}>
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review and Create</CardTitle>
                  <CardDescription>Review your study plan details before creating it.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Study Plan Name</h4>
                        <p className="font-medium">Physics Final Exam</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Exam Date</h4>
                        <p className="font-medium">May 20, 2023</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Study Hours (per week)</h4>
                        <p className="font-medium">10 hours</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Difficulty</h4>
                        <p className="font-medium">Medium</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Uploaded Files</h4>
                      <ul className="list-disc list-inside text-sm">
                        {files.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                      <p className="font-medium">Your study plan will be ready in a few minutes</p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Our AI will analyze your materials and create a personalized study plan based on your preferences.
                      You'll receive a notification when it's ready.
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                      {isLoading ? "Creating..." : "Create Study Plan"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}
