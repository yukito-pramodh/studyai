"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Calendar, CheckCircle, Clock } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { useTheme } from "next-themes"

export default function Home() {
  const { theme } = useTheme()

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b z-10 bg-background/80 backdrop-blur-sm">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <BookOpen className="h-6 w-6 text-primary" />
          <span>StudyAI</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 relative">
        <BackgroundGradientAnimation />
        <section className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    AI-Powered Study Plans Tailored to You
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Upload your syllabus, set your exam dates, and let our AI create a personalized study plan that
                    adapts to your learning pace.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Image
                  src="/placeholder.svg?height=550&width=550"
                  width={550}
                  height={550}
                  alt="Study Plan Dashboard"
                  className="rounded-lg object-cover shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-primary">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything You Need to Ace Your Exams
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered platform analyzes your materials and creates personalized study resources to maximize
                  your learning efficiency.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3"
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: <BookOpen className="h-6 w-6" />,
                  title: "Smart Summarization",
                  description: "Upload your notes and syllabus PDFs to get concise, easy-to-understand summaries.",
                },
                {
                  icon: <Calendar className="h-6 w-6" />,
                  title: "Personalized Schedules",
                  description: "Get a custom study schedule based on your exam dates and personal learning pace.",
                },
                {
                  icon: <CheckCircle className="h-6 w-6" />,
                  title: "Quiz Generation",
                  description: "Practice with auto-generated quizzes tailored to your study materials and progress.",
                },
                {
                  icon: <Clock className="h-6 w-6" />,
                  title: "Adaptive Learning",
                  description: "Our system adapts to your progress, focusing more time on challenging topics.",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  ),
                  title: "PDF Processing",
                  description: "Upload any PDF document and our AI will extract and organize the key information.",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m2 12 5.45 5.45" />
                      <path d="m15.55 17.45 2.9-2.9" />
                      <path d="m18.45 5.55-2.9 2.9" />
                      <path d="m5.55 8.45-3.05-3.05" />
                      <path d="m12 2v4" />
                      <path d="m12 18v4" />
                    </svg>
                  ),
                  title: "Progress Tracking",
                  description: "Monitor your study progress and identify areas that need more attention.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-card hover:shadow-md transition-shadow"
                  variants={fadeIn}
                >
                  <div className="rounded-full bg-primary/20 p-3 text-primary">{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-center text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-primary">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Simple Steps to Study Success</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes it easy to create and follow a personalized study plan.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3"
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  step: 1,
                  title: "Upload Your Materials",
                  description: "Upload your syllabus, notes, and any other study materials in PDF format.",
                },
                {
                  step: 2,
                  title: "Set Your Parameters",
                  description: "Enter your exam dates, available study time, and learning preferences.",
                },
                {
                  step: 3,
                  title: "Follow Your Plan",
                  description: "Get your personalized study plan, summaries, and quizzes to optimize your learning.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-card hover:shadow-md transition-shadow"
                  variants={fadeIn}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-center text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Start Your Study Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2023 StudyAI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
