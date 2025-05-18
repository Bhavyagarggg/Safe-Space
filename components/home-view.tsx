"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, Lock, Cloud, Upload, FileText, ImageIcon, Film, FileMusic, FileEdit } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getUserProfile } from "@/lib/auth"
import { fetchStorageStats } from "@/lib/files"

type WelcomeMessage = {
  message: string
  icon: React.ElementType
  color: string
}

const welcomeMessages: WelcomeMessage[] = [
  {
    message: "Welcome back! Your data is safe with us.",
    icon: Shield,
    color: "from-blue-500 to-purple-500",
  },
  {
    message: "Stay hydrated! Your files are secure and protected.",
    icon: Lock,
    color: "from-green-500 to-teal-500",
  },
  {
    message: "Good morning! Start your day knowing your data is safe.",
    icon: Cloud,
    color: "from-orange-500 to-amber-500",
  },
  {
    message: "Hope you're having a great day! Your files are always protected.",
    icon: Shield,
    color: "from-pink-500 to-rose-500",
  },
  {
    message: "Remember to take breaks! We'll keep your data secure.",
    icon: Lock,
    color: "from-indigo-500 to-blue-500",
  },
  {
    message: "Your digital sanctuary awaits. All your files, always secure.",
    icon: Cloud,
    color: "from-purple-500 to-indigo-500",
  },
  {
    message: "Feeling good? So are your files in our secure vault!",
    icon: Shield,
    color: "from-red-500 to-pink-500",
  },
  {
    message: "Take a deep breath. Your data is organized and protected.",
    icon: Lock,
    color: "from-cyan-500 to-blue-500",
  },
  {
    message: "Smile! Your digital life is safe and sound.",
    icon: Cloud,
    color: "from-yellow-500 to-amber-500",
  },
  {
    message: "Keep shining! Your files are safely stored in your vault.",
    icon: Shield,
    color: "from-emerald-500 to-green-500",
  },
]

// Fun greetings that are gender-neutral and motivating
const funGreetings = [
  { title: "Hello, Sunshine!", subtitle: "Ready for a productive day?" },
  { title: "Hey there, Superstar!", subtitle: "Your secure vault awaits." },
  { title: "Welcome, Trailblazer!", subtitle: "Let's organize your digital world." },
  { title: "Hi, Achiever!", subtitle: "Your files are ready when you are." },
  { title: "Greetings, Champion!", subtitle: "Your digital fortress is secure." },
  { title: "Hello, Brilliant Mind!", subtitle: "Your secure space is ready." },
  { title: "Welcome back, Dynamo!", subtitle: "Ready to conquer your day?" },
  { title: "Hey, Inspiration!", subtitle: "Your secure files await your magic." },
  { title: "Hello, Shooting Star!", subtitle: "Shine bright with secure storage." },
  { title: "Welcome, Sweetpea!", subtitle: "Your digital garden is flourishing." },
]

type HomeViewProps = {
  isDecoyMode: boolean
}

export default function HomeView({ isDecoyMode }: HomeViewProps) {
  const [welcomeMessage, setWelcomeMessage] = useState<WelcomeMessage>(welcomeMessages[0])
  const [greeting, setGreeting] = useState(funGreetings[0])
  const [storageStats, setStorageStats] = useState({
    used: 0,
    total: 10 * 1024 * 1024 * 1024, // 10GB
    fileCount: {
      documents: 0,
      photos: 0,
      videos: 0,
      audios: 0,
      notes: 0,
    },
  })
  const profile = getUserProfile()

  // Get time of day for greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "morning"
    if (hour < 18) return "afternoon"
    return "evening"
  }

  useEffect(() => {
    // Select a random welcome message
    const randomIndex = Math.floor(Math.random() * welcomeMessages.length)
    setWelcomeMessage(welcomeMessages[randomIndex])

    // Select a random fun greeting
    const randomGreetingIndex = Math.floor(Math.random() * funGreetings.length)
    setGreeting(funGreetings[randomGreetingIndex])

    // Fetch storage stats
    const getStats = async () => {
      const stats = await fetchStorageStats(isDecoyMode)
      setStorageStats(stats)
    }
    getStats()
  }, [isDecoyMode])

  // Format bytes to human readable format
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Calculate storage usage percentage
  const storagePercentage = (storageStats.used / storageStats.total) * 100

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        className="transition-all duration-300"
      >
        <Card className="overflow-hidden border-none shadow-lg rounded-2xl">
          <CardContent className="p-0">
            <div className={`bg-gradient-to-r ${welcomeMessage.color} p-6 text-white`}>
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <welcomeMessage.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-1 font-poppins">{greeting.title}</h2>
                  <p className="text-white/90 font-inter">{greeting.subtitle}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white font-poppins">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/70 dark:to-blue-800/70 border-blue-300 dark:border-blue-600 hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-800 dark:hover:to-blue-700 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105 font-inter"
          >
            <Upload className="h-5 w-5 text-[#60A5FA] dark:text-[#93C5FD]" />
            <span className="text-sm text-[#60A5FA] dark:text-[#93C5FD]">Upload Files</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/70 dark:to-purple-800/70 border-purple-300 dark:border-purple-600 hover:from-purple-200 hover:to-purple-300 dark:hover:from-purple-800 dark:hover:to-purple-700 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105 font-inter"
          >
            <FileText className="h-5 w-5 text-[#7C3AED] dark:text-[#A78BFA]" />
            <span className="text-sm text-[#7C3AED] dark:text-[#A78BFA]">New Document</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/70 dark:to-pink-800/70 border-pink-300 dark:border-pink-600 hover:from-pink-200 hover:to-pink-300 dark:hover:from-pink-800 dark:hover:to-pink-700 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105 font-inter"
          >
            <ImageIcon className="h-5 w-5 text-[#F472B6] dark:text-[#F9A8D4]" />
            <span className="text-sm text-[#F472B6] dark:text-[#F9A8D4]">View Photos</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/70 dark:to-green-800/70 border-green-300 dark:border-green-600 hover:from-green-200 hover:to-green-300 dark:hover:from-green-800 dark:hover:to-green-700 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105 font-inter"
          >
            <FileEdit className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-700 dark:text-green-400">New Note</span>
          </Button>
        </div>
      </motion.div>

      {/* Storage Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white font-poppins">Storage</h3>
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-inter">
                {formatBytes(storageStats.used)} of {formatBytes(storageStats.total)} used
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-inter">
                {storagePercentage.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={storagePercentage}
              className="h-2 bg-gray-100 dark:bg-gray-700"
              indicatorClassName="bg-gradient-to-r from-[#3A8DFF] to-[#A855F7]"
            />

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6">
              <div className="flex flex-col items-center p-3 bg-blue-100 dark:bg-blue-900/60 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/80 transition-colors duration-300">
                <FileText className="h-5 w-5 text-[#60A5FA] dark:text-[#93C5FD] mb-1" />
                <span className="text-xs font-medium text-[#60A5FA] dark:text-[#93C5FD] font-poppins">Documents</span>
                <span className="text-xs text-[#60A5FA] dark:text-[#93C5FD] font-inter">
                  {storageStats.fileCount.documents}
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-pink-100 dark:bg-pink-900/60 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-800/80 transition-colors duration-300">
                <ImageIcon className="h-5 w-5 text-[#F472B6] dark:text-[#F9A8D4] mb-1" />
                <span className="text-xs font-medium text-[#F472B6] dark:text-[#F9A8D4] font-poppins">Photos</span>
                <span className="text-xs text-[#F472B6] dark:text-[#F9A8D4] font-inter">
                  {storageStats.fileCount.photos}
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-purple-100 dark:bg-purple-900/60 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/80 transition-colors duration-300">
                <Film className="h-5 w-5 text-[#7C3AED] dark:text-[#A78BFA] mb-1" />
                <span className="text-xs font-medium text-[#7C3AED] dark:text-[#A78BFA] font-poppins">Videos</span>
                <span className="text-xs text-[#7C3AED] dark:text-[#A78BFA] font-inter">
                  {storageStats.fileCount.videos}
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-amber-100 dark:bg-amber-900/60 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800/80 transition-colors duration-300">
                <FileMusic className="h-5 w-5 text-amber-600 dark:text-amber-400 mb-1" />
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400 font-poppins">Audios</span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-inter">
                  {storageStats.fileCount.audios}
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-green-100 dark:bg-green-900/60 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/80 transition-colors duration-300">
                <FileEdit className="h-5 w-5 text-green-600 dark:text-green-400 mb-1" />
                <span className="text-xs font-medium text-green-700 dark:text-green-400 font-poppins">Notes</span>
                <span className="text-xs text-green-600 dark:text-green-400 font-inter">
                  {storageStats.fileCount.notes}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white font-poppins">Recent Activity</h3>
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            {isDecoyMode || Math.random() > 0.5 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-3">
                  <Cloud className="h-6 w-6 text-[#60A5FA] dark:text-[#93C5FD]" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white font-poppins">All caught up!</h3>
                <p className="text-gray-500 dark:text-gray-200 mt-1 font-inter">No recent activity to show</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                    <Upload className="h-4 w-4 text-[#60A5FA] dark:text-[#93C5FD]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 font-poppins">
                      You uploaded a document
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">Today, 10:42 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
                  <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                    <FileEdit className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 font-poppins">
                      You created a new note
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">Yesterday, 3:15 PM</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
