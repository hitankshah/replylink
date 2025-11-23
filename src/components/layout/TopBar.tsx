'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, Bell, User, LogOut, Settings, Moon, Sun } from 'lucide-react'
import { TOKENS } from '@/styles/tokens'

interface TopBarProps {
  onMobileMenuClick?: () => void
  showMobileMenu?: boolean
}

export function TopBar({ onMobileMenuClick, showMobileMenu = true }: TopBarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <header
      className="h-16 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-white/10 flex items-center justify-between px-4 sticky top-0 z-30"
      style={{
        height: TOKENS.spacing[16],
        padding: `0 ${TOKENS.spacing[4]}`,
        borderColor: TOKENS.surfaces['border-light'],
        background: `linear-gradient(to right, ${TOKENS.colors.neutral['bg-card']}, ${TOKENS.colors.neutral['bg-dark']})`,
        zIndex: TOKENS.zIndex.sticky,
      }}
    >
      {/* Left Section - Logo + Mobile Menu */}
      <div className="flex items-center gap-4">
        {showMobileMenu && (
          <button
            onClick={onMobileMenuClick}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
            style={{ padding: TOKENS.spacing[2] }}
          >
            <Menu className="w-5 h-5 text-slate-300" />
          </button>
        )}

        <Link href="/dashboard" className="hidden sm:flex items-center gap-2">
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
      </div>

      {/* Center Section - Search (optional for future) */}
      <div className="hidden lg:block flex-1 max-w-md mx-4">
        {/* Placeholder for future search functionality */}
      </div>

      {/* Right Section - Notifications, Theme, User Menu */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative"
            style={{ padding: TOKENS.spacing[2] }}
          >
            <Bell className="w-5 h-5 text-slate-300" />
            <span
              className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"
              style={{
                width: TOKENS.spacing[1],
                height: TOKENS.spacing[1],
              }}
            />
          </button>

          {notificationsOpen && (
            <div
              className="absolute right-0 mt-2 w-80 bg-slate-900 border border-white/10 rounded-lg shadow-lg p-4 z-40"
              style={{
                marginTop: TOKENS.spacing[2],
                padding: TOKENS.spacing[4],
                backgroundColor: TOKENS.colors.neutral['bg-card'],
                borderColor: TOKENS.surfaces['border-light'],
                zIndex: TOKENS.zIndex.dropdown,
              }}
            >
              <h3
                className="font-semibold text-white mb-3"
                style={{
                  fontSize: TOKENS.typography.sizes.label,
                  marginBottom: TOKENS.spacing[3],
                }}
              >
                Notifications
              </h3>
              <p
                className="text-slate-400 text-sm"
                style={{ fontSize: TOKENS.typography.sizes.caption }}
              >
                No new notifications
              </p>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          style={{ padding: TOKENS.spacing[2] }}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-slate-300" />
          ) : (
            <Moon className="w-5 h-5 text-slate-300" />
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg transition-colors"
            style={{ padding: TOKENS.spacing[2] }}
          >
            <div
              className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center"
              style={{
                width: TOKENS.spacing[8],
                height: TOKENS.spacing[8],
              }}
            >
              <User className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-sm text-slate-300 hidden sm:inline"
              style={{ fontSize: TOKENS.typography.sizes.caption }}
            >
              Account
            </span>
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-lg shadow-lg overflow-hidden z-40"
              style={{
                marginTop: TOKENS.spacing[2],
                backgroundColor: TOKENS.colors.neutral['bg-card'],
                borderColor: TOKENS.surfaces['border-light'],
                zIndex: TOKENS.zIndex.dropdown,
              }}
            >
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 transition-colors border-b border-white/10"
                style={{
                  padding: `${TOKENS.spacing[3]} ${TOKENS.spacing[4]}`,
                  borderColor: TOKENS.surfaces['border-light'],
                }}
              >
                <Settings className="w-4 h-4" />
                <span
                  className="text-sm"
                  style={{ fontSize: TOKENS.typography.sizes.label }}
                >
                  Settings
                </span>
              </Link>
              <button
                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 transition-colors w-full text-left"
                style={{
                  padding: `${TOKENS.spacing[3]} ${TOKENS.spacing[4]}`,
                }}
              >
                <LogOut className="w-4 h-4" />
                <span
                  className="text-sm"
                  style={{ fontSize: TOKENS.typography.sizes.label }}
                >
                  Logout
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
