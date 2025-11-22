'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PlanSelector } from '@/components/billing/PlanSelector'
import { CreditCard, AlertCircle, CheckCircle2, Clock } from 'lucide-react'

interface UserPlan {
  planType: string
  status: 'active' | 'cancelled' | 'pending'
  startDate: string
  renewalDate: string
  amount: number
  currency: string
}

interface UsageStats {
  pages: { used: number; limit: number }
  accounts: { used: number; limit: number }
  replies: { used: number; limit: number }
}

interface PaymentHistory {
  id: string
  date: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  plan: string
  invoice?: string
}

export default function BillingPage() {
  const router = useRouter()
  const [currentPlan, setCurrentPlan] = useState<UserPlan | null>(null)
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  // Fetch billing information
  useEffect(() => {
    const fetchBillingInfo = async () => {
      try {
        const response = await fetch('/api/billing/info')
        if (!response.ok) throw new Error('Failed to fetch billing info')

        const data = await response.json()
        setCurrentPlan(data.currentPlan)
        setUsageStats(data.usageStats)
        setPaymentHistory(data.paymentHistory || [])
      } catch (error) {
        console.error('Error fetching billing info:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBillingInfo()
  }, [])

  const handleSelectPlan = async (planId: string, gateway: 'razorpay' | 'paypal') => {
    if (planId === 'free') {
      // Downgrade to free
      try {
        const response = await fetch('/api/billing/downgrade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId: 'free' }),
        })

        if (!response.ok) throw new Error('Failed to downgrade')

        setCurrentPlan((prev) =>
          prev ? { ...prev, planType: 'free', status: 'active' } : null
        )
      } catch (error) {
        console.error('Error downgrading:', error)
        alert('Failed to downgrade plan')
      }
    } else {
      // Create subscription
      try {
        const response = await fetch('/api/billing/create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planType: planId, gateway }),
        })

        if (!response.ok) throw new Error('Failed to create subscription')

        const data = await response.json()

        // Redirect to payment gateway
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl
        }
      } catch (error) {
        console.error('Error creating subscription:', error)
        alert('Failed to create subscription')
      }
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) {
      return
    }

    try {
      setIsCancelling(true)
      const response = await fetch('/api/billing/cancel-subscription', {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to cancel subscription')

      setCurrentPlan((prev) =>
        prev ? { ...prev, status: 'cancelled' } : null
      )
      alert('Subscription cancelled successfully')
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      alert('Failed to cancel subscription')
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-8 animate-pulse h-40" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-900/50 border border-white/5 rounded-xl p-4 h-20 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Current Plan Card */}
      <div className="bg-gradient-to-br from-blue-600/20 to-slate-900 border border-blue-500/30 rounded-xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentPlan?.planType.charAt(0).toUpperCase()}
              {currentPlan?.planType.slice(1)}
            </h2>
            <p className="text-slate-400">
              Your current plan renewal date is{' '}
              <span className="text-white font-medium">
                {currentPlan ? new Date(currentPlan.renewalDate).toLocaleDateString() : 'N/A'}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {currentPlan?.status === 'active' && (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Active</span>
              </div>
            )}
            {currentPlan?.status === 'pending' && (
              <div className="flex items-center gap-2 text-yellow-400">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Pending</span>
              </div>
            )}
            {currentPlan?.status === 'cancelled' && (
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Cancelled</span>
              </div>
            )}
          </div>
        </div>

        {currentPlan?.planType !== 'free' && currentPlan?.status === 'active' && (
          <Button
            onClick={handleCancelSubscription}
            disabled={isCancelling}
            className="bg-red-600 hover:bg-red-700"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
          </Button>
        )}
      </div>

      {/* Usage Stats */}
      {usageStats && (
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: 'Link Pages', ...usageStats.pages },
            { label: 'Social Accounts', ...usageStats.accounts },
            { label: 'Monthly Replies', ...usageStats.replies },
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
              <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold text-white">{stat.used}</span>
                <span className="text-slate-500">/ {stat.limit}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    (stat.used / stat.limit) * 100 > 80
                      ? 'bg-red-500'
                      : (stat.used / stat.limit) * 100 > 50
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min((stat.used / stat.limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan Selector */}
      <PlanSelector
        currentPlan={currentPlan?.planType || 'free'}
        onSelectPlan={handleSelectPlan}
      />

      {/* Payment History */}
      {paymentHistory.length > 0 && (
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Plan</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Amount</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-white capitalize">{payment.plan}</td>
                    <td className="py-3 px-4 text-white text-right">
                      {payment.currency} {payment.amount}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {payment.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 text-green-400 text-xs font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          Completed
                        </span>
                      )}
                      {payment.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-yellow-400 text-xs font-medium">
                          <Clock className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                      {payment.status === 'failed' && (
                        <span className="inline-flex items-center gap-1 text-red-400 text-xs font-medium">
                          <AlertCircle className="w-4 h-4" />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {payment.invoice ? (
                        <a href={payment.invoice} className="text-blue-400 hover:text-blue-300">
                          Download
                        </a>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
