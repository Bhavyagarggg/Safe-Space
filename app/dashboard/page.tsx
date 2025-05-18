"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import FileExplorer from "@/components/file-explorer"
import type { FileType } from "@/types/file"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const isDecoyMode = searchParams.get("mode") === "decoy"
  const [activeSection, setActiveSection] = useState<FileType>("documents")

  useEffect(() => {
    // If in decoy mode, we could potentially add some visual indicators
    // or log this information for the user's awareness later
    if (isDecoyMode) {
      console.log("Running in decoy mode - no real files will be shown")
    }
  }, [isDecoyMode])

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection} isDecoyMode={isDecoyMode}>
      <FileExplorer fileType={activeSection} onFileTypeChange={setActiveSection} isDecoyMode={isDecoyMode} />
    </DashboardLayout>
  )
}
