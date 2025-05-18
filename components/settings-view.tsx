"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, Lock, LogOut, Shield, Bell, Moon, Trash2, Download, HelpCircle, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { getUserProfile, signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import ChangePasswordDialog from "@/components/change-password-dialog"
import ExportFilesDialog from "@/components/export-files-dialog"

type SettingsViewProps = {
  isDecoyMode: boolean
}

export default function SettingsView({ isDecoyMode }: SettingsViewProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const profile = getUserProfile()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.01 }}
      >
        <Card className="overflow-hidden border-[#3A8DFF]/20 dark:border-[#3A8DFF]/10 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <div className="bg-gradient-to-r from-[#3A8DFF] to-[#A855F7] h-32 relative">
            <div className="absolute -bottom-12 left-6">
              <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800">
                <AvatarImage src={profile.avatarUrl || "/placeholder.svg"} alt={profile.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-[#3A8DFF] to-[#A855F7] text-white font-poppins">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <CardContent className="pt-16 pb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 font-poppins">{profile.name}</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-gray-600 dark:text-gray-400 font-inter">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-[#3A8DFF] dark:text-[#93C5FD]" />
                <span>{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-[#3A8DFF] dark:text-[#93C5FD]" />
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>

            {isDecoyMode && (
              <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                <div className="flex gap-2">
                  <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300 font-poppins">
                      Decoy Mode Active
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-inter">
                      You are currently viewing the decoy dashboard. No real files are being displayed.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white font-poppins">Account Settings</h3>
        <Card className="border-[#3A8DFF]/20 dark:border-[#3A8DFF]/10 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                  <Lock className="h-5 w-5 text-[#3A8DFF] dark:text-[#93C5FD]" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white font-poppins">Password</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">Change your password</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsChangingPassword(true)}
                className="border-[#3A8DFF]/30 dark:border-[#3A8DFF]/20 hover:bg-[#3A8DFF]/10 dark:hover:bg-[#3A8DFF]/10 rounded-xl transition-all duration-300 font-poppins"
              >
                Change
              </Button>
            </div>

            <Separator className="dark:bg-gray-700" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
                  <Download className="h-5 w-5 text-[#7C3AED] dark:text-[#A78BFA]" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white font-poppins">Export Data</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">Download or share your files</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsExporting(true)}
                className="border-[#7C3AED]/30 dark:border-[#7C3AED]/20 hover:bg-[#7C3AED]/10 dark:hover:bg-[#7C3AED]/10 rounded-xl transition-all duration-300 font-poppins"
              >
                Export
              </Button>
            </div>

            <Separator className="dark:bg-gray-700" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                  <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white font-poppins">Delete Account</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">
                    Permanently delete your account and data
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-red-200 dark:border-red-800/30 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-xl transition-all duration-300 font-poppins"
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white font-poppins">Preferences</h3>
        <Card className="border-[#3A8DFF]/20 dark:border-[#3A8DFF]/10 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                  <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white font-poppins">Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">
                    Receive security alerts and updates
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
                className="data-[state=checked]:bg-[#7C3AED]"
              />
            </div>

            <Separator className="dark:bg-gray-700" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full">
                  <Moon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white font-poppins">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">
                    Switch between light and dark themes
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-[#7C3AED]"
              />
            </div>

            <Separator className="dark:bg-gray-700" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 dark:bg-pink-900/50 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-[#F472B6] dark:text-[#F9A8D4]" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white font-poppins">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">Add an extra layer of security</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-[#F472B6]/30 dark:border-[#F472B6]/20 hover:bg-[#F472B6]/10 dark:hover:bg-[#F472B6]/10 rounded-xl transition-all duration-300 font-poppins"
              >
                Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Help & Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white font-poppins">Help & Support</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-[#3A8DFF]/20 dark:border-[#3A8DFF]/10 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                  <HelpCircle className="h-5 w-5 text-[#3A8DFF] dark:text-[#93C5FD]" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white font-poppins">Help Center</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">Get answers to your questions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#3A8DFF]/20 dark:border-[#3A8DFF]/10 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
                  <Info className="h-5 w-5 text-[#7C3AED] dark:text-[#A78BFA]" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white font-poppins">About Safe Space</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">Learn more about our service</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Sign Out Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.03 }}
      >
        <Button
          variant="destructive"
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-poppins"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </motion.div>

      <ChangePasswordDialog open={isChangingPassword} onClose={() => setIsChangingPassword(false)} />
      <ExportFilesDialog open={isExporting} onClose={() => setIsExporting(false)} isDecoyMode={isDecoyMode} />
    </div>
  )
}
