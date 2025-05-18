// This is a mock implementation for the frontend
// In a real app, these functions would make API calls to the backend

import type { FileType, FileItem } from "@/types/file"

// Mock data for files
const MOCK_FILES: Record<FileType, FileItem[]> = {
  documents: [
    {
      id: "doc1",
      name: "Project Proposal.pdf",
      isFolder: false,
      type: "documents",
      size: 2500000,
      createdAt: "2023-05-15T10:30:00Z",
      updatedAt: "2023-05-15T10:30:00Z",
    },
    {
      id: "doc2",
      name: "Meeting Notes",
      isFolder: true,
      type: "documents",
      createdAt: "2023-06-20T14:45:00Z",
      updatedAt: "2023-06-20T14:45:00Z",
    },
    {
      id: "doc3",
      name: "Resume.docx",
      isFolder: false,
      type: "documents",
      size: 350000,
      createdAt: "2023-07-05T09:15:00Z",
      updatedAt: "2023-07-05T09:15:00Z",
    },
  ],
  photos: [
    {
      id: "photo1",
      name: "Vacation Photos",
      isFolder: true,
      type: "photos",
      createdAt: "2023-04-10T16:20:00Z",
      updatedAt: "2023-04-10T16:20:00Z",
    },
    {
      id: "photo2",
      name: "profile.jpg",
      isFolder: false,
      type: "photos",
      size: 1200000,
      createdAt: "2023-05-22T11:40:00Z",
      updatedAt: "2023-05-22T11:40:00Z",
    },
  ],
  videos: [
    {
      id: "video1",
      name: "Presentation.mp4",
      isFolder: false,
      type: "videos",
      size: 15000000,
      createdAt: "2023-06-15T13:25:00Z",
      updatedAt: "2023-06-15T13:25:00Z",
    },
  ],
  notes: [
    {
      id: "note1",
      name: "Shopping List",
      isFolder: false,
      type: "notes",
      size: 5000,
      createdAt: "2023-07-01T08:50:00Z",
      updatedAt: "2023-07-01T08:50:00Z",
    },
    {
      id: "note2",
      name: "Ideas",
      isFolder: true,
      type: "notes",
      createdAt: "2023-07-10T17:30:00Z",
      updatedAt: "2023-07-10T17:30:00Z",
    },
  ],
  audios: [
    {
      id: "audio1",
      name: "Interview.mp3",
      isFolder: false,
      type: "audios",
      size: 8500000,
      createdAt: "2023-08-05T14:25:00Z",
      updatedAt: "2023-08-05T14:25:00Z",
    },
  ],
}

// Mock function to fetch files
export async function fetchFiles(fileType: FileType, isDecoyMode: boolean): Promise<FileItem[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // In decoy mode, return empty array or minimal fake data
  if (isDecoyMode) {
    return []
  }

  return MOCK_FILES[fileType] || []
}

// Mock function to upload a file
export async function uploadFile(file: File, fileType: FileType, isDecoyMode: boolean): Promise<FileItem> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const newFile: FileItem = {
    id: `new-${Date.now()}`,
    name: file.name,
    isFolder: false,
    type: fileType,
    size: file.size,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return newFile
}

// Mock function to create a folder
export async function createFolder(name: string, fileType: FileType, isDecoyMode: boolean): Promise<FileItem> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const newFolder: FileItem = {
    id: `folder-${Date.now()}`,
    name,
    isFolder: true,
    type: fileType,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return newFolder
}

// Mock function to delete a file
export async function deleteFile(id: string, isDecoyMode: boolean): Promise<void> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // In a real app, this would make an API call to delete the file
  return
}

// Mock function to export files
export async function exportFiles(fileType: FileType | "all", isDecoyMode: boolean): Promise<void> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In a real app, this would trigger a download of the files
  return
}

// Mock function to generate a share link
export async function generateShareLink(isDecoyMode: boolean): Promise<string> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate a fake share link
  return `https://safespace.example.com/share/${Math.random().toString(36).substring(2, 15)}`
}

// Mock function to fetch storage statistics
export async function fetchStorageStats(isDecoyMode: boolean) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Calculate total size from mock files
  let totalSize = 0
  const fileCount = {
    documents: 0,
    photos: 0,
    videos: 0,
    audios: 0,
    notes: 0,
  }

  if (!isDecoyMode) {
    Object.entries(MOCK_FILES).forEach(([type, files]) => {
      files.forEach((file) => {
        if (!file.isFolder && file.size) {
          totalSize += file.size
        }
        if (!file.isFolder) {
          fileCount[type as FileType] += 1
        }
      })
    })
  }

  return {
    used: totalSize,
    total: 10 * 1024 * 1024 * 1024, // 10GB
    fileCount,
  }
}
