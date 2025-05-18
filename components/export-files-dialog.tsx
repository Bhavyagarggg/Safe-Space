"use client"

import { useState } from "react"
import { Download, Share2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FileType } from "@/types/file"
import { exportFiles, generateShareLink } from "@/lib/files"
import { useToast } from "@/components/ui/use-toast"

type ExportFilesDialogProps = {
  open: boolean
  onClose: () => void
  isDecoyMode: boolean
}

export default function ExportFilesDialog({ open, onClose, isDecoyMode }: ExportFilesDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [shareLink, setShareLink] = useState("")

  const handleExport = async (fileType: FileType | "all") => {
    setIsLoading(true)

    try {
      await exportFiles(fileType, isDecoyMode)

      toast({
        title: "Files Exported",
        description: "Your files have been exported successfully.",
      })
    } catch (error) {
      console.error("Error exporting files:", error)

      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export files. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateLink = async () => {
    setIsLoading(true)

    try {
      const link = await generateShareLink(isDecoyMode)
      setShareLink(link)

      toast({
        title: "Link Generated",
        description: "Share link has been generated successfully.",
      })
    } catch (error) {
      console.error("Error generating share link:", error)

      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate share link. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)

    toast({
      title: "Link Copied",
      description: "Share link has been copied to clipboard.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-poppins">Export Files</DialogTitle>
          <DialogDescription className="font-inter">Download or share your files securely</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="download" className="mt-4">
          <TabsList className="rounded-xl">
            <TabsTrigger
              value="download"
              className="rounded-lg data-[state=active]:bg-[#3A8DFF] data-[state=active]:text-white font-poppins"
            >
              Download
            </TabsTrigger>
            <TabsTrigger
              value="share"
              className="rounded-lg data-[state=active]:bg-[#3A8DFF] data-[state=active]:text-white font-poppins"
            >
              Share
            </TabsTrigger>
          </TabsList>

          <TabsContent value="download" className="py-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium font-poppins">Select what to export</h3>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleExport("all")}
                  disabled={isLoading}
                  className="rounded-xl transition-all duration-300 hover:bg-[#3A8DFF]/10 font-poppins"
                >
                  <Download className="h-4 w-4 mr-2 text-[#3A8DFF]" />
                  All Files
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport("documents")}
                  disabled={isLoading}
                  className="rounded-xl transition-all duration-300 hover:bg-[#3A8DFF]/10 font-poppins"
                >
                  <Download className="h-4 w-4 mr-2 text-[#3A8DFF]" />
                  Documents
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport("photos")}
                  disabled={isLoading}
                  className="rounded-xl transition-all duration-300 hover:bg-[#F472B6]/10 font-poppins"
                >
                  <Download className="h-4 w-4 mr-2 text-[#F472B6]" />
                  Photos
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport("videos")}
                  disabled={isLoading}
                  className="rounded-xl transition-all duration-300 hover:bg-[#7C3AED]/10 font-poppins"
                >
                  <Download className="h-4 w-4 mr-2 text-[#7C3AED]" />
                  Videos
                </Button>
              </div>

              {isDecoyMode && (
                <p className="text-xs text-amber-600 mt-2 font-inter">
                  Note: In decoy mode, only decoy files will be exported.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="share" className="py-4 space-y-4">
            <div className="space-y-4">
              <p className="text-sm font-inter">
                Generate a secure link to share your files with others. The link will expire after 7 days.
              </p>

              {shareLink ? (
                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
                  <p className="text-sm flex-1 truncate font-inter">{shareLink}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyLink}
                    className="rounded-full transition-all duration-300 hover:bg-[#3A8DFF]/10"
                  >
                    <Copy className="h-4 w-4 text-[#3A8DFF]" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleGenerateLink}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#3A8DFF] to-[#7C3AED] rounded-xl transition-all duration-300 font-poppins"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Generate Share Link
                </Button>
              )}

              {isDecoyMode && (
                <p className="text-xs text-amber-600 font-inter">
                  Note: In decoy mode, only decoy files will be shared.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl transition-all duration-300 font-poppins">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
