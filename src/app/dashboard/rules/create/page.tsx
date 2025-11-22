'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import RuleBuilder, { RuleFormData } from '@/components/rules/RuleBuilder'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Account {
  id: string
  platformUsername: string
  platform: string
}

export default function CreateRulePage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch('/api/accounts')
        if (!res.ok) throw new Error('Failed to fetch accounts')
        const data = await res.json()
        setAccounts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching accounts')
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  const handleSubmit = async (formData: RuleFormData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create rule')
      }

      const rule = await res.json()
      router.push(`/dashboard/rules?success=Rule created: ${rule.name}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 flex items-center justify-center">
        <p className="text-slate-400">Loading connected accounts...</p>
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard/rules" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6">
            <ArrowLeft size={18} />
            Back to Rules
          </Link>
          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6 text-yellow-200 text-center">
            <p className="mb-4">
              You need to connect a social media account before creating a rule.
            </p>
            <Link
              href="/dashboard"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Go to dashboard to connect an account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/rules" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6">
          <ArrowLeft size={18} />
          Back to Rules
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Auto-Reply Rule</h1>
          <p className="text-slate-400">
            Set up an automatic reply to engage with your audience
          </p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 text-red-200">
            {error}
          </div>
        )}

        <RuleBuilder
          accounts={accounts}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  )
}
