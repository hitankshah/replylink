"use client"

import React from "react"
import Link from "next/link"
import { Plus, Search, MoreVertical, ExternalLink, Edit, Trash2, Eye, MousePointer2 } from "lucide-react"
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

export default function PagesList() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Pages</h1>
          <p className="text-slate-400">Manage your link-in-bio pages and track their performance.</p>
        </div>
        <Link href="/dashboard/pages/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Plus className="w-4 h-4" />
            Create New Page
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search pages..."
            className="pl-10 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-900/50">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-slate-400 font-medium">Page Info</TableHead>
              <TableHead className="text-slate-400 font-medium">Status</TableHead>
              <TableHead className="text-slate-400 font-medium">Views</TableHead>
              <TableHead className="text-slate-400 font-medium">Clicks</TableHead>
              <TableHead className="text-slate-400 font-medium">Last Updated</TableHead>
              <TableHead className="text-right text-slate-400 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PAGES.map((page) => (
              <TableRow key={page.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 border border-white/10 overflow-hidden">
                      <img src={page.thumbnail} alt={page.username} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{page.title}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-1">
                        replylink.to/{page.username}
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${page.status === 'Active'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                    {page.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Eye className="w-4 h-4 text-slate-500" />
                    {page.views.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-300">
                    <MousePointer2 className="w-4 h-4 text-slate-500" />
                    {page.clicks.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="text-slate-400 text-sm">
                  {page.lastUpdated}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                      <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Page
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-slate-800 cursor-pointer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit URL
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-red-900/20 text-red-400 cursor-pointer">
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
