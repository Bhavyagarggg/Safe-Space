"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Folder,
  Upload,
  Plus,
  Search,
  Trash2,
  SortAsc,
  Grid,
  List,
  Film,
  FileEdit,
  ImageIcon,
  FileMusic,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FileType, FileItem } from "@/types/file"
import { fetchFiles, uploadFile, createFolder, deleteFile } from "@/lib/files"
import { useToast } from "@/components/ui/use-toast"
import FileUploadDialog from "@/components/file-upload-dialog"
import CreateFolderDialog from "@/components/create-folder-dialog"

type FileExplorerProps = {
  fileType: FileType
  onFileTypeChange: (fileType: FileType) => void
  isDecoyMode: boolean
}

export default function FileExplorer({ fileType, onFileTypeChange, isDecoyMode }: FileExplorerProps) {
  const { toast } = useToast()
  const [files, setFiles] = useState<FileItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isUploading, setIsUploading] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFiles(fileType, isDecoyMode)
        setFiles(data)
      } catch (error) {
        console.error("Error loading files:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load files. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadFiles()
  }, [fileType, isDecoyMode, toast])

  const handleUpload = async (file: File) => {
    setIsUploading(false)

    try {
      const newFile = await uploadFile(file, fileType, isDecoyMode)
      setFiles((prev) => [...prev, newFile])
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
      })
    }
  }

  const handleCreateFolder = async (name: string) => {
    setIsCreatingFolder(false)

    try {
      const newFolder = await createFolder(name, fileType, isDecoyMode)
      setFiles((prev) => [...prev, newFolder])
      toast({
        title: "Folder Created",
        description: `Folder "${name}" has been created.`,
      })
    } catch (error) {
      console.error("Error creating folder:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create folder. Please try again.",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteFile(id, isDecoyMode)
      setFiles((prev) => prev.filter((file) => file.id !== id))
      toast({
        title: "Deleted",
        description: "The item has been deleted.",
      })
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete item. Please try again.",
      })
    }
  }

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    // Folders first
    if (a.isFolder && !b.isFolder) return -1
    if (!a.isFolder && b.isFolder) return 1

    // Then alphabetically
    return a.name.localeCompare(b.name)
  })

  const getFileIcon = (file: FileItem) => {
    if (file.isFolder) return <Folder className="h-6 w-6 text-[#60A5FA]" />

    switch (fileType) {
      case "photos":
        return <ImageIcon className="h-6 w-6 text-[#F472B6]" />
      case "videos":
        return <Film className="h-6 w-6 text-[#7C3AED]" />
      case "audios":
        return <FileMusic className="h-6 w-6 text-amber-500" />
      case "notes":
        return <FileEdit className="h-6 w-6 text-green-500" />
      default:
        return <FileText className="h-6 w-6 text-[#60A5FA]" />
    }
  }

  const fileTypeConfig = {
    documents: { color: "blue", icon: FileText, bgColor: "[#60A5FA]" },
    photos: { color: "pink", icon: ImageIcon, bgColor: "[#F472B6]" },
    videos: { color: "purple", icon: Film, bgColor: "[#7C3AED]" },
    audios: { color: "amber", icon: FileMusic, bgColor: "amber-500" },
    notes: { color: "green", icon: FileEdit, bgColor: "green-500" },
  }

  const renderFileTypeIcon = (type: FileType) => {
    const config = fileTypeConfig[type]
    const IconComponent = config.icon

    if (type === fileType) {
      return <IconComponent className="h-5 w-5 text-white" />
    }

    return <IconComponent className={`h-5 w-5 text-${config.color}-600`} />
  }

  return (
    <div className="space-y-6">
      {/* File Type Selector */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {(["documents", "photos", "videos", "audios", "notes"] as FileType[]).map((type) => {
            const config = fileTypeConfig[type]
            const isActive = fileType === type
            const IconComponent = config.icon

            return (
              <Button
                key={type}
                variant={isActive ? "default" : "outline"}
                className={`h-auto py-3 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? `bg-${config.bgColor} hover:bg-${config.bgColor} text-white`
                    : `bg-${config.color}-50 border-${config.color}-200 hover:bg-${config.color}-100`
                }`}
                onClick={() => onFileTypeChange(type)}
              >
                <IconComponent className={isActive ? "h-5 w-5 text-white" : `h-5 w-5 text-${config.bgColor}`} />
                <span
                  className={
                    isActive ? "text-sm text-white font-poppins" : `text-sm text-${config.bgColor} font-poppins`
                  }
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              </Button>
            )
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2">
            <Button
              onClick={() => setIsUploading(true)}
              className={`bg-${fileTypeConfig[fileType].bgColor} hover:bg-${fileTypeConfig[fileType].bgColor} hover:opacity-90 transition-all duration-300 rounded-xl`}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsCreatingFolder(true)}
              className={`border-${fileTypeConfig[fileType].color}-200 hover:bg-${fileTypeConfig[fileType].color}-50 transition-all duration-300 rounded-xl`}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                className="pl-8 border-gray-200 focus-visible:ring-[#7C3AED] transition-all duration-300 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl transition-all duration-300 hover:bg-gray-100"
                >
                  <SortAsc className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
                <DropdownMenuItem>Date (Newest)</DropdownMenuItem>
                <DropdownMenuItem>Date (Oldest)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="rounded-xl transition-all duration-300 hover:bg-gray-100"
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="all" className="rounded-xl">
          <TabsList className="rounded-xl">
            <TabsTrigger
              value="all"
              className="rounded-lg data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="folders"
              className="rounded-lg data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white"
            >
              Folders
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="rounded-lg data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white"
            >
              Files
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse rounded-xl">
                    <CardContent className="p-4 h-32 flex items-center justify-center">
                      <div className="w-full h-full bg-gray-200 rounded-md"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedFiles.length === 0 ? (
              <div className="text-center py-12">
                <div
                  className={`mx-auto w-12 h-12 rounded-full bg-${fileTypeConfig[fileType].color}-100 flex items-center justify-center mb-4`}
                >
                  {(() => {
                    const IconComponent = fileTypeConfig[fileType].icon
                    return <IconComponent className={`h-6 w-6 text-${fileTypeConfig[fileType].bgColor}`} />
                  })()}
                </div>
                <h3 className="text-lg font-medium font-poppins">No files found</h3>
                <p className="text-muted-foreground mt-1 font-inter">Upload files or create a folder to get started</p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "space-y-2"
                }
              >
                {sortedFiles.map((file) => (
                  <motion.div key={file.id} whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
                    <Card
                      className={`${viewMode === "list" ? "overflow-hidden" : ""} group hover:shadow-md transition-shadow border-${fileTypeConfig[fileType].color}-100 rounded-xl`}
                    >
                      <CardContent
                        className={
                          viewMode === "grid"
                            ? "p-4 flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-50 transition-colors"
                            : "p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                        }
                      >
                        <div
                          className={
                            viewMode === "grid" ? "flex flex-col items-center text-center" : "flex items-center gap-3"
                          }
                        >
                          {getFileIcon(file)}
                          <div className={viewMode === "grid" ? "mt-2" : ""}>
                            <p className="font-medium truncate max-w-[150px] font-poppins">{file.name}</p>
                            {viewMode === "list" && (
                              <p className="text-xs text-muted-foreground font-inter">
                                {new Date(file.createdAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className={`${viewMode === "grid" ? "absolute top-1 right-1 opacity-0 group-hover:opacity-100" : ""} text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-300`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(file.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="folders" className="mt-4">
            {/* Similar to "all" but filtered for folders */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "space-y-2"
              }
            >
              {sortedFiles
                .filter((file) => file.isFolder)
                .map((file) => (
                  <motion.div key={file.id} whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
                    <Card
                      className={`${viewMode === "list" ? "overflow-hidden" : ""} group hover:shadow-md transition-shadow border-${fileTypeConfig[fileType].color}-100 rounded-xl`}
                    >
                      <CardContent
                        className={
                          viewMode === "grid"
                            ? "p-4 flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-50 transition-colors"
                            : "p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                        }
                      >
                        <div
                          className={
                            viewMode === "grid" ? "flex flex-col items-center text-center" : "flex items-center gap-3"
                          }
                        >
                          <Folder className="h-6 w-6 text-[#60A5FA]" />
                          <div className={viewMode === "grid" ? "mt-2" : ""}>
                            <p className="font-medium truncate max-w-[150px] font-poppins">{file.name}</p>
                            {viewMode === "list" && (
                              <p className="text-xs text-muted-foreground font-inter">
                                {new Date(file.createdAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className={`${viewMode === "grid" ? "absolute top-1 right-1 opacity-0 group-hover:opacity-100" : ""} text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-300`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(file.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-4">
            {/* Similar to "all" but filtered for files */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "space-y-2"
              }
            >
              {sortedFiles
                .filter((file) => !file.isFolder)
                .map((file) => (
                  <motion.div key={file.id} whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
                    <Card
                      className={`${viewMode === "list" ? "overflow-hidden" : ""} group hover:shadow-md transition-shadow border-${fileTypeConfig[fileType].color}-100 rounded-xl`}
                    >
                      <CardContent
                        className={
                          viewMode === "grid"
                            ? "p-4 flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-50 transition-colors"
                            : "p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                        }
                      >
                        <div
                          className={
                            viewMode === "grid" ? "flex flex-col items-center text-center" : "flex items-center gap-3"
                          }
                        >
                          {getFileIcon(file)}
                          <div className={viewMode === "grid" ? "mt-2" : ""}>
                            <p className="font-medium truncate max-w-[150px] font-poppins">{file.name}</p>
                            {viewMode === "list" && (
                              <p className="text-xs text-muted-foreground font-inter">
                                {new Date(file.createdAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className={`${viewMode === "grid" ? "absolute top-1 right-1 opacity-0 group-hover:opacity-100" : ""} text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-300`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(file.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      <FileUploadDialog
        open={isUploading}
        onClose={() => setIsUploading(false)}
        onUpload={handleUpload}
        fileType={fileType}
      />

      <CreateFolderDialog
        open={isCreatingFolder}
        onClose={() => setIsCreatingFolder(false)}
        onCreate={handleCreateFolder}
      />
    </div>
  )
}
