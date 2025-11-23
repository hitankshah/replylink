"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Login failed")
        return
      }

      if (data.rememberMe) {
        localStorage.setItem("rememberMe", "true")
        localStorage.setItem("rememberedEmail", data.email)
      } else {
        localStorage.removeItem("rememberMe")
        localStorage.removeItem("rememberedEmail")
      }

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[hsl(0,0%,4%)] text-white flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">RL</span>
              </div>
              <span className="font-bold text-white">ReplyLink</span>
            </Link>
            <h1 className="text-3xl font-bold mt-8 mb-2">Welcome back</h1>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="bg-white/[0.05] border-white/[0.12] text-white placeholder:text-gray-500 focus:border-white/[0.24]"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="bg-white/[0.05] border-white/[0.12] text-white placeholder:text-gray-500 focus:border-white/[0.24] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" {...register("rememberMe")} />
                <Label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link href="/auth/forgot-password" className="text-sm text-gray-400 hover:text-white">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-gray-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-white hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:block flex-1 bg-white/[0.02] border-l border-white/[0.08] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-subtle"></div>
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="max-w-md space-y-6">
            <h2 className="text-4xl font-bold">
              Professional link-in-bio platform
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Create custom link pages, automate replies, and track everything from one dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
