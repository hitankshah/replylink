'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Zap,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
} from 'lucide-react'
import { TOKENS } from '@/styles/tokens'

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Pages', href: '/dashboard/pages', icon: FileText },
  { label: 'Rules', href: '/dashboard/rules', icon: Zap },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Accounts', href: '/dashboard/accounts', icon: Users },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Help', href: '/dashboard/help', icon: HelpCircle },
]

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="h-full bg-slate-900 border-r border-white/10 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out"
      style={{
        width: isCollapsed ? '80px' : '300px',
        backgroundColor: TOKENS.colors.neutral['bg-card'],
        borderColor: TOKENS.surfaces['border-light'],
      }}
    >
      {/* Header with Logo / Collapse Button */}
      <div
        className="flex items-center justify-between p-4 border-b border-white/10"
        style={{
          padding: TOKENS.spacing[4],
          borderColor: TOKENS.surfaces['border-light'],
        }}
      >
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div
              className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center"
              style={{
                width: TOKENS.spacing[8],
                height: TOKENS.spacing[8],
              }}
            >
              <span
                className="text-white font-black text-sm"
                style={{ fontSize: TOKENS.typography.sizes.label }}
              >
                RL
              </span>
            </div>
            <span
              className="font-black text-white hidden lg:inline"
              style={{ fontSize: TOKENS.typography.sizes.label }}
            >
              ReplyLink
            </span>
          </Link>
        )}

        {onToggle && (
          <button
            onClick={onToggle}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
            style={{
              padding: TOKENS.spacing[1],
              backgroundColor: 'transparent',
            }}
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5 text-slate-300" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-slate-300" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2" style={{ padding: TOKENS.spacing[4] }}>
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              style={{
                padding: `${TOKENS.spacing[3]} ${TOKENS.spacing[4]}`,
              }}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className="w-5 h-5 flex-shrink-0"
                style={{ width: TOKENS.spacing[5], height: TOKENS.spacing[5] }}
              />
              {!isCollapsed && (
                <span
                  className="text-sm font-medium whitespace-nowrap"
                  style={{ fontSize: TOKENS.typography.sizes.label }}
                >
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer - Logout */}
      <div
        className="border-t border-white/10 p-4"
        style={{
          padding: TOKENS.spacing[4],
          borderColor: TOKENS.surfaces['border-light'],
        }}
      >
        <button
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          style={{
            padding: `${TOKENS.spacing[3]} ${TOKENS.spacing[4]}`,
          }}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut
            className="w-5 h-5 flex-shrink-0"
            style={{ width: TOKENS.spacing[5], height: TOKENS.spacing[5] }}
          />
          {!isCollapsed && (
            <span
              className="text-sm font-medium"
              style={{ fontSize: TOKENS.typography.sizes.label }}
            >
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}
