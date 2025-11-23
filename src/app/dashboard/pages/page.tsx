"use client"

import React from "react"
import Link from "next/link"
import { Plus, Search, MoreVertical, ExternalLink, Edit, Trash2, Eye, MousePointer2, FileText } from "lucide-react"
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

// Mock data for now
const PAGES = [
  {
    id: "1",
    username: "sarahbakes",
    title: "Sarah's Bakery Links",
    views: 1250,
    clicks: 450,
    status: "Active",
    lastUpdated: "2 hours ago",
    thumbnail: "https://api.dicebear.com/7.x/initials/svg?seed=SB"
  },
  {
    id: "2",
    username: "techflow_official",
    title: "TechFlow Resources",
    views: 890,
    clicks: 320,
    status: "Active",
    lastUpdated: "1 day ago",
    thumbnail: "https://api.dicebear.com/7.x/initials/svg?seed=TF"
  },
  {
    id: "3",
    username: "campaign_summer",
    title: "Summer Sale Landing",
    views: 0,
    clicks: 0,
    status: "Draft",
    lastUpdated: "3 days ago",
    thumbnail: "https://api.dicebear.com/7.x/initials/svg?seed=CS"
  }
]

import { PageCreationDialog } from "@/components/pages/PageCreationDialog"

export default function PagesList() {
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
            className="pl-10 bg-white/[0.05] border-white/[0.12] text-white placeholder:text-gray-500 focus:border-white/[0.24] focus:ring-0"
          />
        </div>
      </div>

      {/* Table */}
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
            {PAGES.map((page) => (
              <TableRow key={page.id} className="border-white/[0.08] hover:bg-white/[0.04] transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-white/[0.05] border border-white/[0.1] overflow-hidden flex items-center justify-center">
                      {/* Placeholder icon if thumbnail fails or just consistent style */}
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{page.title}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-300 transition-colors cursor-pointer">
                        replylink.to/{page.username}
                        <ExternalLink className="w-3 h-3" />
                      </div>
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
                      <DropdownMenuItem className="hover:bg-white/[0.08] cursor-pointer focus:bg-white/[0.08] focus:text-white">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Page
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/[0.08] cursor-pointer focus:bg-white/[0.08] focus:text-white">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit URL
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-red-900/20 text-red-400 cursor-pointer focus:bg-red-900/20 focus:text-red-400">
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
    </div>
  )
}
