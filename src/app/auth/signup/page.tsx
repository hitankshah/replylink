"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, Loader2, Zap, ArrowLeft, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PasswordStrength } from "@/components/ui/password-strength"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// List of timezones
const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Asia/Singapore",
  "Australia/Sydney",
  "Australia/Melbourne",
]

// Form validation schema
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  brandName: z.string().min(1, "Brand name is required"),
  timezone: z.string().min(1, "Please select a timezone"),
  termsAccepted: z.boolean().refine((val) => val === true, "You must accept the terms"),
  privacyAccepted: z.boolean().refine((val) => val === true, "You must accept the privacy policy"),
})

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      brandName: "",
      timezone: "UTC",
      termsAccepted: false,
      privacyAccepted: false,
    },
  })

  const password = watch("password")

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Signup failed")
        return
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during signup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-950">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 relative z-10">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="max-w-md w-full mx-auto mt-12 lg:mt-0">
          <div className="mb-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-slate-400">Start your 14-day free trial. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 h-11"
                  {...register("name")}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandName" className="text-slate-300">Brand Name</Label>
                <Input
                  id="brandName"
                  type="text"
                  placeholder="Acme Inc"
                  className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 h-11"
                  {...register("brandName")}
                />
                {errors.brandName && <p className="text-red-400 text-xs mt-1">{errors.brandName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20 h-11"
                {...register("email")}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
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
              <PasswordStrength password={password} className="mt-2" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-slate-300">Timezone</Label>
              <Select defaultValue="UTC" onValueChange={(val) => setValue("timezone", val)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-800 text-white h-11">
                  <SelectValue placeholder="Select a timezone" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz} className="text-slate-200 focus:bg-slate-800 focus:text-white cursor-pointer">
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timezone && <p className="text-red-400 text-xs mt-1">{errors.timezone.message}</p>}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-400 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="termsAccepted"
                  {...register("termsAccepted")}
                  className="mt-1 border-slate-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
                <label htmlFor="termsAccepted" className="text-sm text-slate-400 cursor-pointer leading-tight pt-0.5 hover:text-slate-300">
                  I agree to the <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">Terms of Service</Link>
                </label>
              </div>
              {errors.termsAccepted && <p className="text-red-400 text-xs">{errors.termsAccepted.message}</p>}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="privacyAccepted"
                  {...register("privacyAccepted")}
                  className="mt-1 border-slate-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
                <label htmlFor="privacyAccepted" className="text-sm text-slate-400 cursor-pointer leading-tight pt-0.5 hover:text-slate-300">
                  I agree to the <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</Link>
                </label>
              </div>
              {errors.privacyAccepted && <p className="text-red-400 text-xs">{errors.privacyAccepted.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 rounded-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-slate-500 text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign in
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
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Join thousands of creators automating their growth</h2>
            <div className="space-y-4">
              {[
                "Auto-reply to comments & DMs",
                "Build beautiful link-in-bio pages",
                "Track analytics in real-time",
                "Secure & compliant with Meta"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Floating Cards Animation */}
          <div className="relative h-64 w-full">
            <div className="absolute top-0 right-0 glass-card p-4 rounded-xl animate-float" style={{ animationDelay: '0s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Reply Sent</div>
                  <div className="text-xs text-slate-400">Just now via Instagram</div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-10 glass-card p-4 rounded-xl animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">New Page View</div>
                  <div className="text-xs text-slate-400">From United States</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
