"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import AuthForm from "@/components/auth-form"
import { FileText, ImageIcon, Film, FileEdit, Shield, Cloud, Lock, Smartphone } from "lucide-react"

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const features = [
    { icon: Shield, title: "Secure Storage", description: "Military-grade encryption for your files" },
    { icon: Cloud, title: "Cloud Access", description: "Access your files from anywhere" },
    { icon: Lock, title: "Decoy Mode", description: "Emergency access with fake dashboard" },
    { icon: Smartphone, title: "Free Up Space", description: "Store files securely in the cloud" },
  ]

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Background with vibrant gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3A8DFF] via-[#7C3AED] to-[#A855F7] opacity-90"></div>

      {/* Decorative elements - floating files and folders */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left decorative elements */}
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-yellow-300 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-20 left-10 w-40 h-40 bg-green-400 rounded-full opacity-20 blur-xl"></div>

        {/* Bottom right decorative elements */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-red-400 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-xl"></div>

        {/* Floating file icons with low opacity */}
        <div className="absolute top-[15%] left-[10%] transform rotate-12 opacity-10 animate-float">
          <FileText size={80} className="text-white" />
        </div>
        <div className="absolute top-[30%] left-[5%] transform -rotate-6 opacity-10 animate-float-slow">
          <ImageIcon size={60} className="text-white" />
        </div>
        <div className="absolute top-[60%] left-[8%] transform rotate-3 opacity-10 animate-float">
          <Film size={70} className="text-white" />
        </div>
        <div className="absolute top-[20%] right-[8%] transform -rotate-12 opacity-10 animate-float-fast">
          <FileEdit size={65} className="text-white" />
        </div>
        <div className="absolute top-[45%] right-[6%] transform rotate-6 opacity-10 animate-float-slow">
          <FileText size={75} className="text-white" />
        </div>
        <div className="absolute top-[70%] right-[10%] transform -rotate-3 opacity-10 animate-float">
          <ImageIcon size={55} className="text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row min-h-screen">
        {/* Left side - Features */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center md:items-start text-white">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center md:text-left font-poppins">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">Safe Space</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-center md:text-left text-blue-100 font-inter">
              Secure, Spacious, Sorted.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:transform hover:scale-105"
                >
                  <div className="bg-white/20 p-2 rounded-full">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white font-poppins">{feature.title}</h3>
                    <p className="text-sm text-blue-100 font-inter">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <div className="flex space-x-4 justify-center md:justify-start">
                <Button
                  size="lg"
                  className={`${!isSignUp ? "bg-white text-[#7C3AED]" : "bg-white/20 text-white hover:bg-white/30"} transition-all duration-300 hover:shadow-lg font-poppins`}
                  onClick={() => setIsSignUp(false)}
                >
                  Sign In
                </Button>
                <Button
                  size="lg"
                  className={`${isSignUp ? "bg-white text-[#7C3AED]" : "bg-white/20 text-white hover:bg-white/30"} transition-all duration-300 hover:shadow-lg font-poppins`}
                  onClick={() => setIsSignUp(true)}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <Card className="overflow-hidden backdrop-blur-sm bg-white/90 border-none shadow-2xl rounded-2xl">
              <div className="relative">
                <div
                  className="transition-all duration-500 ease-in-out"
                  style={{
                    transform: isSignUp ? "translateX(-100%)" : "translateX(0)",
                    opacity: isSignUp ? 0 : 1,
                    position: isSignUp ? "absolute" : "relative",
                    width: "100%",
                  }}
                >
                  <AuthForm type="signin" onSuccess={() => router.push("/dashboard")} />
                </div>

                <div
                  className="transition-all duration-500 ease-in-out"
                  style={{
                    transform: isSignUp ? "translateX(0)" : "translateX(100%)",
                    opacity: isSignUp ? 1 : 0,
                    position: !isSignUp ? "absolute" : "relative",
                    width: "100%",
                  }}
                >
                  <AuthForm
                    type="signup"
                    onSuccess={() => {
                      setIsSignUp(false)
                    }}
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-center mt-6 gap-4 md:hidden">
              <Button
                className={`${!isSignUp ? "bg-white text-[#7C3AED]" : "bg-white/20 text-white"} transition-all duration-300 font-poppins`}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </Button>
              <Button
                className={`${isSignUp ? "bg-white text-[#7C3AED]" : "bg-white/20 text-white"} transition-all duration-300 font-poppins`}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating file cards with low opacity */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl flex justify-center pointer-events-none">
        <div className="flex space-x-4 opacity-30">
          <div className="w-16 h-20 bg-white rounded-lg shadow-lg transform rotate-6 animate-float"></div>
          <div className="w-16 h-20 bg-white rounded-lg shadow-lg transform -rotate-3 animate-float-slow"></div>
          <div className="w-16 h-20 bg-white rounded-lg shadow-lg transform rotate-12 animate-float-fast"></div>
          <div className="w-16 h-20 bg-white rounded-lg shadow-lg transform -rotate-6 animate-float"></div>
          <div className="w-16 h-20 bg-white rounded-lg shadow-lg transform rotate-3 animate-float-slow"></div>
        </div>
      </div>
    </div>
  )
}
