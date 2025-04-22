"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ChevronLeft, Download, FileText } from "lucide-react"

export default function DocumentPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("summary")

  // This would be fetched from your API in a real application
  const document = {
    id: params.id,
    title: "Physics Syllabus",
    uploadDate: "April 10, 2023",
    fileType: "PDF",
    fileSize: "2.4 MB",
    summary: `
      This physics syllabus covers the following topics:
      
      1. Mechanics
         - Kinematics
         - Newton's Laws of Motion
         - Work, Energy, and Power
         - Systems of Particles
         - Circular Motion and Rotation
         - Oscillations and Gravitation
      
      2. Electricity and Magnetism
         - Electrostatics
         - Conductors, Capacitors, Dielectrics
         - Electric Circuits
         - Magnetic Fields
         - Electromagnetism
      
      3. Waves and Optics
         - Wave Motion
         - Physical Optics
         - Geometric Optics
      
      4. Thermal Physics
         - Temperature and Heat
         - Kinetic Theory and Thermodynamics
      
      5. Modern Physics
         - Atomic Physics and Quantum Effects
         - Nuclear Physics
         - Particle Physics and Cosmology
      
      The final exam will be on May 20, 2023 and will cover all topics. There will be both multiple-choice and free-response questions.
    `,
    keyTerms: [
      {
        term: "Kinematics",
        definition:
          "The branch of mechanics that describes the motion of points, bodies, and systems without considering the forces that cause them to move.",
      },
      {
        term: "Newton's Laws",
        definition:
          "Three physical laws that form the basis for classical mechanics, describing the relationship between the motion of an object and the forces acting on it.",
      },
      {
        term: "Electromagnetism",
        definition:
          "A branch of physics involving the study of the electromagnetic force, a type of physical interaction that occurs between electrically charged particles.",
      },
      {
        term: "Thermodynamics",
        definition:
          "The branch of physics that deals with heat, work, and temperature, and their relation to energy, radiation, and physical properties of matter.",
      },
      {
        term: "Quantum Physics",
        definition:
          "The theoretical basis of modern physics that explains the nature and behavior of matter and energy on the atomic and subatomic level.",
      },
    ],
    quizQuestions: [
      {
        question: "Which of Newton's laws states that for every action, there is an equal and opposite reaction?",
        options: ["First Law", "Second Law", "Third Law", "Fourth Law"],
        answer: "Third Law",
      },
      {
        question: "What is the SI unit of electric current?",
        options: ["Volt", "Watt", "Ampere", "Ohm"],
        answer: "Ampere",
      },
      {
        question: "Which phenomenon demonstrates the wave nature of light?",
        options: ["Reflection", "Refraction", "Diffraction", "Absorption"],
        answer: "Diffraction",
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
            <Link href="/dashboard?tab=documents" className="mr-4">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{document.title}</h1>
              <p className="text-sm text-muted-foreground">
                Uploaded on {document.uploadDate} • {document.fileType} • {document.fileSize}
              </p>
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                View Original
              </Button>
            </div>
          </div>

          <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="key-terms">Key Terms</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Document Summary</CardTitle>
                  <CardDescription>AI-generated summary of the key points from your document</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-line">{document.summary}</div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="key-terms" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Terms</CardTitle>
                  <CardDescription>Important terms and definitions extracted from your document</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {document.keyTerms.map((item, index) => (
                      <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                        <h3 className="font-semibold">{item.term}</h3>
                        <p className="text-sm text-muted-foreground">{item.definition}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="quiz" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Practice Quiz</CardTitle>
                  <CardDescription>Test your knowledge with these AI-generated questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {document.quizQuestions.map((quiz, index) => (
                      <div key={index} className="space-y-3">
                        <h3 className="font-medium">
                          Question {index + 1}: {quiz.question}
                        </h3>
                        <div className="space-y-2">
                          {quiz.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id={`q${index}-option${optionIndex}`}
                                name={`question-${index}`}
                                className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-600"
                              />
                              <label htmlFor={`q${index}-option${optionIndex}`} className="text-sm">
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Check Answers</Button>
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
