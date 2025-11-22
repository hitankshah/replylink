"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, Loader2, Zap, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
})

type LoginFormData = {
  email: string
  password: string
  rememberMe: boolean
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
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

      // Store remember me preference
      if (data.rememberMe) {
        localStorage.setItem("rememberMe", "true")
        localStorage.setItem("rememberedEmail", data.email)
      } else {
        localStorage.removeItem("rememberMe")
        localStorage.removeItem("rememberedEmail")
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-950">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 relative z-10">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 h-11"
                {...register("email")}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 h-11 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-400 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  {...register("rememberMe")}
                  className="border-slate-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
                <label htmlFor="rememberMe" className="text-sm text-slate-400 cursor-pointer select-none hover:text-slate-300">
                  Remember me
                </label>
              </div>
              <Link href="/auth/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 rounded-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <p className="text-center text-slate-500 text-sm">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign up for free
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-lg">
          <div className="glass-card p-8 rounded-3xl border-white/10 bg-slate-950/50 backdrop-blur-xl shadow-2xl">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500">★</div>
              ))}
            </div>
            <p className="text-xl text-slate-200 leading-relaxed mb-8 font-medium">
              "ReplyLink has completely transformed how we handle social media. It's like having a 24/7 social media manager that never sleeps."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
              <div>
                <div className="font-bold text-white">Alex Rivera</div>
                <div className="text-sm text-slate-400">Marketing Director, TechFlow</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
