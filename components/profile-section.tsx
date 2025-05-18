"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock, Download, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { getUserProfile, signOut } from "@/lib/auth"
import ChangePasswordDialog from "@/components/change-password-dialog"
import ExportFilesDialog from "@/components/export-files-dialog"

type ProfileSectionProps = {
  onBack: () => void
  isDecoyMode: boolean
}

export default function ProfileSection({ onBack, isDecoyMode }: ProfileSectionProps) {
  const router = useRouter()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // In a real app, this would be fetched from the backend
  const profile = getUserProfile()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <div className="max-w-md mx-auto">
      <Button variant="ghost" className="mb-4" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatarUrl || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-medium">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              {profile.phone && <p className="text-sm text-muted-foreground">{profile.phone}</p>}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Account Security</h3>
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsChangingPassword(true)}>
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Data Management</h3>
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsExporting(true)}>
              <Download className="h-4 w-4 mr-2" />
              Export Files
            </Button>
          </div>

          {isDecoyMode && (
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Decoy Mode Active:</strong> You are currently viewing the decoy dashboard. No real files are
                being displayed.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button variant="destructive" className="w-full" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardFooter>
      </Card>

      <ChangePasswordDialog open={isChangingPassword} onClose={() => setIsChangingPassword(false)} />

      <ExportFilesDialog open={isExporting} onClose={() => setIsExporting(false)} isDecoyMode={isDecoyMode} />
    </div>
  )
}
