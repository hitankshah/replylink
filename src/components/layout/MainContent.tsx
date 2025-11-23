'use client'

import React, { ReactNode } from 'react'
import { TOKENS } from '@/styles/tokens'

interface MainContentProps {
  children: ReactNode
  maxWidth?: string
}

export function MainContent({ children, maxWidth = '1400px' }: MainContentProps) {
  return (
    <main
      className="flex-1 overflow-y-auto bg-slate-950"
      style={{
        backgroundColor: TOKENS.colors.neutral['bg-dark'],
      }}
    >
      <div
        className="mx-auto p-6 sm:p-8"
        style={{
          maxWidth,
          padding: `${TOKENS.spacing[6]} ${TOKENS.spacing[6]}`,
        }}
      >
        {children}
      </div>
    </main>
  )
}
