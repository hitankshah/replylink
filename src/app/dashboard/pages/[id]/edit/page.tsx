"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageBuilder } from "@/components/pages/PageBuilder"
import { Loader2 } from "lucide-react"

interface PageData {
  id: string
  username: string
  title: string
  bio?: string
  theme?: any
}

export default function PageEditPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [page, setPage] = useState<PageData | null>(null)
  const [buttons, setButtons] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPage()
  }, [params.id])

  const fetchPage = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/pages/${params.id}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to fetch page")
        return
      }

      setPage(data.page)
      setButtons(data.buttons || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (data: any) => {
    try {
      // Update page
      const pageResponse = await fetch(`/api/pages/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          title: data.title,
          bio: data.bio,
          theme: data.theme,
        }),
      })

      if (!pageResponse.ok) {
        throw new Error("Failed to save page")
      }

      // Save buttons (this would be a separate call per button)
      // For now, just show success
      alert("Page saved successfully!")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save page")
      throw err
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-slate-400">Loading page...</p>
        </div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Page not found"}</p>
          <button
            onClick={() => router.back()}
            className="text-blue-400 hover:text-blue-300"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <PageBuilder
      pageId={page.id}
      initialUsername={page.username}
      initialTitle={page.title}
      initialBio={page.bio}
      initialTheme={page.theme}
      initialButtons={buttons}
      onSave={handleSave}
      isLoading={isLoading}
    />
  )
}
