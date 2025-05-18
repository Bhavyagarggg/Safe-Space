"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { changePassword } from "@/lib/auth"

type ChangePasswordDialogProps = {
  open: boolean
  onClose: () => void
}

export default function ChangePasswordDialog({ open, onClose }: ChangePasswordDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Current password validation
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await changePassword(formData.currentPassword, formData.newPassword)

      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      })

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      onClose()
    } catch (error) {
      console.error("Error changing password:", error)

      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to change password. Please check your current password and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    // Reset form
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-poppins">Change Password</DialogTitle>
          <DialogDescription className="font-inter">Update your password to keep your account secure</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="font-poppins">
              Current Password
            </Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="••••••••"
              value={formData.currentPassword}
              onChange={handleChange}
              className="border-[#3A8DFF]/30 focus-visible:ring-[#3A8DFF] transition-all duration-300 rounded-xl font-inter"
            />
            {errors.currentPassword && <p className="text-sm text-red-500 font-inter">{errors.currentPassword}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="font-poppins">
              New Password
            </Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={handleChange}
              className="border-[#3A8DFF]/30 focus-visible:ring-[#3A8DFF] transition-all duration-300 rounded-xl font-inter"
            />
            {errors.newPassword && <p className="text-sm text-red-500 font-inter">{errors.newPassword}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-poppins">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border-[#3A8DFF]/30 focus-visible:ring-[#3A8DFF] transition-all duration-300 rounded-xl font-inter"
            />
            {errors.confirmPassword && <p className="text-sm text-red-500 font-inter">{errors.confirmPassword}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-xl transition-all duration-300 font-poppins"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#3A8DFF] to-[#7C3AED] rounded-xl transition-all duration-300 font-poppins"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
