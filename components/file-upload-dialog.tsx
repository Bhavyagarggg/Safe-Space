"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { FileType } from "@/types/file"

type FileUploadDialogProps = {
  open: boolean
  onClose: () => void
  onUpload: (file: File) => void
  fileType: FileType
}

export default function FileUploadDialog({ open, onClose, onUpload, fileType }: FileUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAcceptedFileTypes = () => {
    switch (fileType) {
      case "documents":
        return ".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
      case "photos":
        return ".jpg,.jpeg,.png,.gif,.webp"
      case "videos":
        return ".mp4,.mov,.avi,.webm"
      case "notes":
        return ".txt,.md"
      case "audios":
        return ".mp3,.wav,.ogg,.m4a"
      default:
        return "*"
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-poppins">Upload File</DialogTitle>
          <DialogDescription className="font-inter">Upload a file to your {fileType} storage</DialogDescription>
        </DialogHeader>

        <div
          className={`mt-4 border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
            isDragging ? "border-[#3A8DFF] bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={getAcceptedFileTypes()}
            onChange={handleFileSelect}
          />

          {selectedFile ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <div className="bg-blue-100 rounded-full p-2">
                  <Upload className="h-6 w-6 text-[#3A8DFF]" />
                </div>
              </div>
              <p className="text-sm font-medium font-poppins">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground font-inter">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFile(null)}
                className="rounded-xl transition-all duration-300 font-poppins"
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center">
                <div className="bg-gray-100 rounded-full p-2">
                  <Upload className="h-6 w-6 text-gray-600" />
                </div>
              </div>
              <p className="mt-2 text-sm font-medium font-poppins">Drag and drop a file here, or click to select</p>
              <p className="mt-1 text-xs text-muted-foreground font-inter">
                Supports{" "}
                {fileType === "documents"
                  ? "PDF, DOC, TXT, etc."
                  : fileType === "photos"
                    ? "JPG, PNG, GIF, etc."
                    : fileType === "videos"
                      ? "MP4, MOV, AVI, etc."
                      : fileType === "audios"
                        ? "MP3, WAV, OGG, etc."
                        : "TXT, MD"}
              </p>
              <Button
                variant="outline"
                className="mt-4 rounded-xl transition-all duration-300 font-poppins"
                onClick={() => fileInputRef.current?.click()}
              >
                Select File
              </Button>
            </>
          )}
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            className="rounded-xl transition-all duration-300 font-poppins"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile}
            className="bg-gradient-to-r from-[#3A8DFF] to-[#7C3AED] rounded-xl transition-all duration-300 font-poppins"
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
