export type FileType = "documents" | "photos" | "videos" | "audios" | "notes"

export interface FileItem {
  id: string
  name: string
  isFolder: boolean
  type: FileType
  size?: number
  url?: string
  createdAt: string
  updatedAt: string
}
