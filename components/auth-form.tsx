"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { Shield, Key, Mail, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { signUp } from "@/lib/auth"

type AuthFormProps = {
  type: "signin" | "signup"
  onSuccess: () => void
}

export default function AuthForm({ type, onSuccess }: AuthFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showSecurityKey, setShowSecurityKey] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    securityKey: "",
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

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (type === "signup" && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    // Name validation (signup only)
    if (type === "signup" && !formData.name) {
      newErrors.name = "Name is required"
    }

    // Security key validation (signup only)
    if (type === "signup" && (!formData.securityKey || formData.securityKey.length < 4)) {
      newErrors.securityKey = "Security key must be at least 4 characters"
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
      if (type === "signin") {
        // For demo purposes, accept "test" as the password
        if (formData.password === "test") {
          toast({
            title: "Success",
            description: "You've been signed in successfully.",
          })
          onSuccess()
        } else if (formData.securityKey === "1234") {
          toast({
            title: "Decoy Mode Activated",
            description: "You've entered the decoy dashboard.",
          })
          // Redirect to fake dashboard
          window.location.href = "/dashboard?mode=decoy"
        } else {
          const newAttempts = failedAttempts + 1
          setFailedAttempts(newAttempts)

          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: `Invalid credentials. ${3 - newAttempts} attempts remaining.`,
            duration: 5000, // Show for 5 seconds
          })

          if (!showSecurityKey && newAttempts >= 2) {
            setShowSecurityKey(true)
          }

          if (newAttempts >= 3) {
            try {
              // Send email alert via backend
              await fetch("/api/auth/alert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
              })

              toast({
                variant: "destructive",
                title: "Access Blocked",
                description: "Too many failed attempts. An alert has been sent.",
              })
            } catch (alertError) {
              console.error("Failed to send alert:", alertError)

              toast({
                variant: "destructive",
                title: "Access Blocked",
                description: "Too many failed attempts.",
              })
            }
          }
        }
      } else {
        // Sign up
        const result = await signUp({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          securityKey: formData.securityKey,
        })

        if (result.success) {
          toast({
            title: "Account Created",
            description: "Your account has been created successfully. Please sign in.",
          })
          onSuccess()
        } else {
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description: result.message || "Failed to create account. Please try again.",
          })
        }
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-gradient-to-r from-[#3A8DFF] to-[#A855F7] p-3 rounded-full">
          <Shield className="h-6 w-6 text-white" />
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-center mb-2 text-gray-800 dark:text-white font-poppins">
        {type === "signin" ? "Welcome Back" : "Create Account"}
      </h2>
      <p className="text-center text-gray-500 dark:text-gray-200 mb-6 font-inter">
        {type === "signin" ? "Your digital sanctuary awaits you" : "Join us for secure, spacious storage"}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 font-poppins">
              <User className="h-4 w-4 text-[#7C3AED] dark:text-[#A78BFA]" />
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Bhavya Garg"
              value={formData.name}
              onChange={handleChange}
              className="border-[#7C3AED]/30 focus-visible:ring-[#7C3AED] dark:border-[#A78BFA]/30 dark:focus-visible:ring-[#A78BFA] transition-all duration-300 font-inter rounded-xl"
            />
            {errors.name && <p className="text-sm text-red-500 dark:text-red-400">{errors.name}</p>}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2 font-poppins">
            <Mail className="h-4 w-4 text-[#7C3AED] dark:text-[#A78BFA]" />
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className="border-[#7C3AED]/30 focus-visible:ring-[#7C3AED] dark:border-[#A78BFA]/30 dark:focus-visible:ring-[#A78BFA] transition-all duration-300 font-inter rounded-xl"
          />
          {errors.email && <p className="text-sm text-red-500 dark:text-red-400">{errors.email}</p>}
        </div>

        {type === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 font-poppins">
              <Phone className="h-4 w-4 text-[#7C3AED] dark:text-[#A78BFA]" />
              Phone (Optional)
            </Label>
            <Input
              id="phone"
              name="phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              className="border-[#7C3AED]/30 focus-visible:ring-[#7C3AED] dark:border-[#A78BFA]/30 dark:focus-visible:ring-[#A78BFA] transition-all duration-300 font-inter rounded-xl"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2 font-poppins">
            <Key className="h-4 w-4 text-[#7C3AED] dark:text-[#A78BFA]" />
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="border-[#7C3AED]/30 focus-visible:ring-[#7C3AED] dark:border-[#A78BFA]/30 dark:focus-visible:ring-[#A78BFA] transition-all duration-300 font-inter rounded-xl"
          />
          {errors.password && <p className="text-sm text-red-500 dark:text-red-400">{errors.password}</p>}
        </div>

        {(type === "signup" || showSecurityKey) && (
          <div className="space-y-2">
            <Label htmlFor="securityKey" className="flex items-center gap-2 font-poppins">
              <Shield className="h-4 w-4 text-[#7C3AED] dark:text-[#A78BFA]" />
              Security Key
              {type === "signin" && <span className="text-xs text-muted-foreground ml-2">(For emergency access)</span>}
            </Label>
            <Input
              id="securityKey"
              name="securityKey"
              type="password"
              placeholder="Your security key"
              value={formData.securityKey}
              onChange={handleChange}
              className="border-[#7C3AED]/30 focus-visible:ring-[#7C3AED] dark:border-[#A78BFA]/30 dark:focus-visible:ring-[#A78BFA] transition-all duration-300 font-inter rounded-xl"
            />
            {errors.securityKey && <p className="text-sm text-red-500 dark:text-red-400">{errors.securityKey}</p>}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#3A8DFF] to-[#A855F7] hover:from-[#3A8DFF] hover:to-[#A855F7] hover:shadow-lg transition-all duration-300 font-poppins rounded-xl"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : type === "signin" ? "Sign In" : "Create Account"}
        </Button>
      </form>
    </div>
  )
}
