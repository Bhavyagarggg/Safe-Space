import { NextResponse } from "next/server"
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileType = searchParams.get("type") as FileType
    const isDecoy = searchParams.get("decoy") === "true"

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Return mock files
    const files = isDecoy ? [] : MOCK_FILES[fileType] || []

    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const fileType = formData.get("fileType") as FileType
    const isDecoy = formData.get("isDecoy") === "true"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Create mock file record
    const newFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      isFolder: false,
      type: fileType,
      size: file.size,
      url: URL.createObjectURL(file),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      file: newFile,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("id")

    if (!fileId) {
      return NextResponse.json({ error: "No file ID provided" }, { status: 400 })
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
