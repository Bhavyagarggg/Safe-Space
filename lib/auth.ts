// Mock user data
const MOCK_USER = {
  id: "123",
  name: "Bhavya Garg",
  email: "bhavya@gmail.com",
  phone: "+91 98765 43210",
  avatarUrl: "",
}

// Mock function to simulate sign in
export async function signIn({
  email,
  password,
  securityKey,
}: {
  email: string
  password: string
  securityKey?: string
}) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // For demo purposes, we'll accept any email with "test" password
  if (password === "test") {
    return { success: true }
  }

  // If password is wrong but security key is "1234", activate decoy mode
  if (securityKey === "1234") {
    return { success: false, usedSecurityKey: true }
  }

  return { success: false }
}

// Mock function to simulate sign up
export async function signUp({
  name,
  email,
  phone,
  password,
  securityKey,
}: {
  name: string
  email: string
  phone?: string
  password: string
  securityKey: string
}) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // For demo purposes, we'll accept any valid input
  return { success: true }
}

// Mock function to simulate sign out
export async function signOut() {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true }
}

// Mock function to get user profile
export function getUserProfile() {
  return MOCK_USER
}

// Mock function to change password
export async function changePassword(currentPassword: string, newPassword: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // For demo purposes, we'll accept any valid input
  if (currentPassword === "wrong") {
    throw new Error("Current password is incorrect")
  }

  return { success: true }
}
