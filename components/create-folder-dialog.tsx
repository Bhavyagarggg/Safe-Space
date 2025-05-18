"use client"

import type React from "react"

import { useState } from "react"
import { Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type CreateFolderDialogProps = {
  open: boolean
  onClose: () => void
  onCreate: (name: string) => void
}

export default function CreateFolderDialog({ open, onClose, onCreate }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!folderName.trim()) {
      setError("Folder name is required")
      return
    }

    if (folderName.includes("/") || folderName.includes("\\")) {
      setError("Folder name cannot contain / or \\ characters")
      return
    }

    onCreate(folderName)
    setFolderName("")
    setError("")
  }

  const handleClose = () => {
    setFolderName("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-poppins">Create New Folder</DialogTitle>
          <DialogDescription className="font-inter">Enter a name for your new folder</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Folder className="h-5 w-5 text-[#3A8DFF]" />
              <Input
                placeholder="Folder name"
                value={folderName}
                onChange={(e) => {
                  setFolderName(e.target.value)
                  setError("")
                }}
                className="flex-1 border-[#3A8DFF]/30 focus-visible:ring-[#3A8DFF] transition-all duration-300 rounded-xl font-inter"
                autoFocus
              />
            </div>

            {error && <p className="text-sm text-red-500 font-inter">{error}</p>}
          </div>

          <DialogFooter>
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
              className="bg-gradient-to-r from-[#3A8DFF] to-[#7C3AED] rounded-xl transition-all duration-300 font-poppins"
            >
              Create Folder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
