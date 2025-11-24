"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search, MoreVertical, ExternalLink, Edit, Trash2, Eye, MousePointer2, FileText, Loader2, QrCode, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PageCreationDialog } from "@/components/pages/PageCreationDialog"

interface Page {
  id: string
  username: string
  title: string
  views: number
  clicks: number
  status: string
  lastUpdated: string
  thumbnail: string
}

export default function PagesList() {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pageToDelete, setPageToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/pages')
      if (!response.ok) throw new Error('Failed to fetch pages')
      const data = await response.json()
      setPages(data)
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!pageToDelete) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/pages/${pageToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete page')

      // Remove from local state
      setPages(pages.filter(p => p.id !== pageToDelete))
      setDeleteDialogOpen(false)
      setPageToDelete(null)
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('Failed to delete page')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownloadQR = async (pageId: string, username: string) => {
    try {
      const response = await fetch(`/api/qr-code?pageId=${pageId}`)
      if (!response.ok) throw new Error('Failed to generate QR code')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${username}-qrcode.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading QR code:', error)
      alert('Failed to download QR code')
    }
  }

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[hsl(0,0%,4%)] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-500" />
          <p className="text-gray-400">Loading your pages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[hsl(0,0%,4%)] text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Pages</h1>
          <p className="text-gray-400">Manage your link-in-bio pages and track their performance.</p>
        </div>
        <PageCreationDialog />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/[0.05] border-white/[0.12] text-white placeholder:text-gray-500 focus:border-white/[0.24] focus:ring-0"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredPages.length === 0 && !isLoading && (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchQuery ? 'No pages found' : 'No pages yet'}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Create your first link-in-bio page to get started'}
          </p>
          {!searchQuery && <PageCreationDialog />}
        </div>
      )}

      {/* Table */}
      {filteredPages.length > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-white/[0.02] border-b border-white/[0.08]">
              <TableRow className="border-white/[0.08] hover:bg-transparent">
                <TableHead className="text-gray-400 font-medium">Page Info</TableHead>
                <TableHead className="text-gray-400 font-medium">Status</TableHead>
                <TableHead className="text-gray-400 font-medium">Views</TableHead>
                <TableHead className="text-gray-400 font-medium">Clicks</TableHead>
                <TableHead className="text-gray-400 font-medium">Last Updated</TableHead>
                <TableHead className="text-right text-gray-400 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map((page) => (
                <TableRow key={page.id} className="border-white/[0.08] hover:bg-white/[0.04] transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-white/[0.05] border border-white/[0.1] overflow-hidden flex items-center justify-center">
                        {page.thumbnail ? (
                          <img src={page.thumbnail} alt={page.title} className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">{page.title}</div>
                        <a
                          href={`/${page.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-300 transition-colors"
                        >
                          replylink.to/{page.username}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${page.status === 'Active'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                      {page.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Eye className="w-4 h-4 text-gray-500" />
                      {page.views.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MousePointer2 className="w-4 h-4 text-gray-500" />
                      {page.clicks.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {page.lastUpdated}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/[0.1]">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#111] border-white/[0.12] text-gray-200">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/pages/${page.id}/edit`)}
                          className="hover:bg-white/[0.08] cursor-pointer focus:bg-white/[0.08] focus:text-white"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Page
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => window.open(`/${page.username}`, '_blank')}
                          className="hover:bg-white/[0.08] cursor-pointer focus:bg-white/[0.08] focus:text-white"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit URL
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDownloadQR(page.id, page.username)}
                          className="hover:bg-white/[0.08] cursor-pointer focus:bg-white/[0.08] focus:text-white"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Download QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setPageToDelete(page.id)
                            setDeleteDialogOpen(true)
                          }}
                          className="hover:bg-red-900/20 text-red-400 cursor-pointer focus:bg-red-900/20 focus:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#111] border-white/[0.12] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete your page
              and all associated data including buttons, analytics, and QR codes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/[0.05] border-white/[0.12] text-white hover:bg-white/[0.1]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Page'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
