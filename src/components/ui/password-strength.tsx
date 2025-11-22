"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: "No password", color: "bg-gray-300" }

    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" }
    if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-500" }
    if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-500" }
    if (score <= 4) return { score: 4, label: "Strong", color: "bg-lime-500" }
    return { score: 5, label: "Very Strong", color: "bg-green-500" }
  }

  const strength = calculateStrength(password)

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">Password strength:</span>
        <span className={`text-xs font-semibold ${strength.color === "bg-red-500" ? "text-red-400" : strength.color === "bg-orange-500" ? "text-orange-400" : strength.color === "bg-yellow-500" ? "text-yellow-400" : strength.color === "bg-lime-500" ? "text-lime-400" : "text-green-400"}`}>
          {strength.label}
        </span>
      </div>
      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${strength.color}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
    </div>
  )
}
