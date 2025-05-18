"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, ImageIcon, Film, FileEdit, Home, Settings, FileMusic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import type { FileType } from "@/types/file"
import HomeView from "@/components/home-view"
import SettingsView from "@/components/settings-view"
import { signOut } from "@/lib/auth"

type DashboardLayoutProps = {
  children: React.ReactNode
  activeSection: FileType
  onSectionChange: (section: FileType) => void
  isDecoyMode: boolean
}

type NavSection = "home" | "files" | "settings"

export default function DashboardLayout({
  children,
  activeSection,
  onSectionChange,
  isDecoyMode,
}: DashboardLayoutProps) {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState<NavSection>("home")

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const fileTypes: { type: FileType; label: string; icon: React.ElementType }[] = [
    { type: "documents", label: "Documents", icon: FileText },
    { type: "photos", label: "Photos", icon: ImageIcon },
    { type: "videos", label: "Videos", icon: Film },
    { type: "audios", label: "Audios", icon: FileMusic },
    { type: "notes", label: "Notes", icon: FileEdit },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-indigo-950">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3A8DFF] to-[#A855F7] font-poppins">
                Safe Space
              </h1>
              {isDecoyMode && (
                <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-inter">
                  Decoy Mode
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <nav className="hidden md:flex space-x-4">
                <Button
                  variant={currentSection === "home" ? "default" : "ghost"}
                  onClick={() => setCurrentSection("home")}
                  className={`flex items-center gap-2 rounded-xl transition-all duration-300 ${currentSection === "home" ? "bg-gradient-to-r from-[#3A8DFF] to-[#7C3AED]" : ""} font-poppins`}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
                <Button
                  variant={currentSection === "files" ? "default" : "ghost"}
                  onClick={() => {
                    setCurrentSection("files")
                    onSectionChange(activeSection)
                  }}
                  className={`flex items-center gap-2 rounded-xl transition-all duration-300 ${currentSection === "files" ? "bg-gradient-to-r from-[#3A8DFF] to-[#7C3AED]" : ""} font-poppins`}
                >
                  <FileText className="h-4 w-4" />
                  Files
                </Button>
                <Button
                  variant={currentSection === "settings" ? "default" : "ghost"}
                  onClick={() => setCurrentSection("settings")}
                  className={`flex items-center gap-2 rounded-xl transition-all duration-300 ${currentSection === "settings" ? "bg-gradient-to-r from-[#3A8DFF] to-[#7C3AED]" : ""} font-poppins`}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* File Type Navigation (only visible when in files section) */}
      {currentSection === "files" && (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-2 overflow-x-auto">
            <div className="flex space-x-2">
              {fileTypes.map((fileType) => (
                <Button
                  key={fileType.type}
                  variant={activeSection === fileType.type ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onSectionChange(fileType.type as FileType)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl transition-all duration-300 ${activeSection === fileType.type ? "bg-gradient-to-r from-[#3A8DFF] to-[#7C3AED]" : ""} font-poppins`}
                >
                  <fileType.icon className="h-4 w-4" />
                  {fileType.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {currentSection === "home" ? (
          <HomeView isDecoyMode={isDecoyMode} />
        ) : currentSection === "settings" ? (
          <SettingsView isDecoyMode={isDecoyMode} />
        ) : (
          children
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <footer className="bg-white dark:bg-gray-900 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.2)] border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto">
          <div className="flex justify-around py-3">
            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center text-xs transition-all duration-300 ${
                currentSection === "home" ? "text-[#3A8DFF]" : "text-gray-600 dark:text-gray-400"
              } font-poppins`}
              onClick={() => setCurrentSection("home")}
            >
              <Home className="h-5 w-5 mb-1" />
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center text-xs transition-all duration-300 ${
                currentSection === "files" ? "text-[#3A8DFF]" : "text-gray-600 dark:text-gray-400"
              } font-poppins`}
              onClick={() => {
                setCurrentSection("files")
                onSectionChange(activeSection)
              }}
            >
              <FileText className="h-5 w-5 mb-1" />
              Files
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center text-xs transition-all duration-300 ${
                currentSection === "settings" ? "text-[#3A8DFF]" : "text-gray-600 dark:text-gray-400"
              } font-poppins`}
              onClick={() => setCurrentSection("settings")}
            >
              <Settings className="h-5 w-5 mb-1" />
              Settings
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
