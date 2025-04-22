"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, Calendar, FileText, Home } from "lucide-react"
import { getUserStudyPlans, getUserDocuments, logoutUser } from "@/lib/actions"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam || "overview")
  const [studyPlans, setStudyPlans] = useState([])
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const [plansData, docsData] = await Promise.all([
          getUserStudyPlans(),
          getUserDocuments()
        ])
        setStudyPlans(plansData)
        setDocuments(docsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load your data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.push('/login')
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1">
        <motion.aside 
          className="w-64 border-r bg-muted/40"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <BookOpen className="h-6 w-6 text-primary" />
              <span>StudyAI</span>
            </Link>
          </div>
          <nav className="flex flex-col gap-2 p-4">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                activeTab === "overview"
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <Home className="h-5 w-5" />
              Overview
            </Link>
            <Link
              href="/dashboard?tab=study-plans"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                activeTab === "study-plans"
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => setActiveTab("study-plans")}
            >
              <Calendar className="h-5 w-5" />
              Study Plans
            </Link>
            <Link
              href="/dashboard?tab=documents"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                activeTab === "documents"
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => setActiveTab("documents")}
            >
              <FileText className="h-5 w-5" />
              Documents
            </Link>
            <Link
              href="/dashboard?tab=profile"
              className={`flex items-center gap-2 rounded-
