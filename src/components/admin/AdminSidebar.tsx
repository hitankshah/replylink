'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Users,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  AlertCircle,
} from 'lucide-react'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  const navItems = [
    {
      label: 'Users',
      href: '/admin/users',
      icon: Users,
      description: 'Manage users and subscriptions',
    },
    {
      label: 'System',
      href: '/admin/system',
      icon: BarChart3,
      description: 'System metrics and health',
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      description: 'Admin configuration',
    },
    {
      label: 'Alerts',
      href: '/admin/alerts',
      icon: AlertCircle,
      description: 'System alerts and logs',
    },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 lg:hidden"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 text-white transition-all duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">RL</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">ReplyLink</h1>
                <p className="text-xs text-slate-400">Admin</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                        active
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs text-slate-400">{item.description}</div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
              onClick={() => setIsOpen(false)}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

function ArrowLeft({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  )
}
