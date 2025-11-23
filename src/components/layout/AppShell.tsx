'use client'

import React, { useState, ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MainContent } from './MainContent'
import { TOKENS } from '@/styles/tokens'

interface AppShellProps {
  children: ReactNode
  showSidebar?: boolean
}

export function AppShell({ children, showSidebar = true }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleToggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  return (
    <div
      className="flex h-screen bg-slate-950 overflow-hidden"
      style={{ backgroundColor: TOKENS.colors.neutral['bg-dark'] }}
    >
      {/* Sidebar - Hidden on mobile, togglable via drawer */}
      {showSidebar && (
        <>
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />
          </div>

          {/* Mobile Drawer Overlay */}
          {mobileDrawerOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={handleToggleMobileDrawer}
              style={{ zIndex: TOKENS.zIndex.modal }}
            />
          )}

          {/* Mobile Drawer */}
          {mobileDrawerOpen && (
            <div
              className="fixed left-0 top-0 h-full w-64 z-40 md:hidden"
              style={{ zIndex: TOKENS.zIndex.modal + 10 }}
            >
              <Sidebar isCollapsed={false} onToggle={handleToggleMobileDrawer} />
            </div>
          )}
        </>
      )}

      {/* Main Layout (TopBar + Content) */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Bar */}
        <TopBar
          onMobileMenuClick={handleToggleMobileDrawer}
          showMobileMenu={showSidebar}
        />

        {/* Main Content Area */}
        <MainContent>{children}</MainContent>
      </div>
    </div>
  )
}
