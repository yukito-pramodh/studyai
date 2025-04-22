"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, ChevronLeft, FileText, Upload } from "lucide-react"
import { processDocument } from "@/lib/actions"

export default function UploadDocumentPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) return

    setIsLoading(true)
    setUploadProgress(0)
    setProcessingStatus("Uploading files...")

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 5
      })
    }, 200)

    try {
      // Simulate file upload and processing
      await new Promise((resolve) => setTimeout(resolve, 3000))
      clearInterval(progressInterval)
      setUploadProgress(100)

      setProcessingStatus("Processing documents...")

      // Process each file
      for (const file of files) {
        await processDocument(file)
      }

      setProcessingStatus("Processing complete!")

      // Redirect to documents page after a short delay
      setTimeout(() => {
        window.location.href = "/dashboard?tab=documents"
      }, 1500)
    } catch (error) {
      console.error("Error uploading documents:", error)
      setProcessingStatus("Error processing documents. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center mb-6">
            <Link href="/dashboard?tab=documents" className="mr-4">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Upload Documents</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload Study Materials</CardTitle>
              <CardDescription>
                Upload your syllabus, notes, or any other study materials in PDF format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoading ? (
                  <>
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
                            <li key={index} className="flex items-center text-sm">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="document-type">Document Type</Label>
                      <select
                        id="document-type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select document type</option>
                        <option value="syllabus">Syllabus</option>
                        <option value="notes">Notes</option>
                        <option value="textbook">Textbook</option>
                        <option value="assignment">Assignment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject (Optional)</Label>
                      <Input id="subject" placeholder="e.g., Physics, Mathematics, History" />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={files.length === 0}
                    >
                      Upload and Process
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2 text-center">
                      <h3 className="font-medium">{processingStatus}</h3>
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-emerald-600 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : "Processing your documents..."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Files:</h4>
                      <ul className="space-y-1">
                        {files.map((file, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            {file.name}
                            {uploadProgress === 100 && (
                              <svg
                                className="ml-2 h-4 w-4 text-emerald-500"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-sm text-center text-muted-foreground">
                      Please don't close this window while we process your documents.
                    </p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
