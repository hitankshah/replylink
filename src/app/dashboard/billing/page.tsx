'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PlanSelector } from '@/components/billing/PlanSelector'
import { CreditCard, AlertCircle, CheckCircle2, Clock, Download } from 'lucide-react'

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
      <div className="space-y-8 p-8 min-h-screen bg-[hsl(0,0%,4%)]">
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-8 animate-pulse h-40" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 h-20 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(0,0%,4%)] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Billing & Usage</h1>
          <p className="text-gray-400">Manage your subscription and view usage limits</p>
        </div>

        {/* Current Plan Card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 capitalize">
                {currentPlan?.planType || 'Free'} Plan
              </h2>
              <p className="text-gray-400">
                Your current plan renewal date is{' '}
                <span className="text-white font-medium">
                  {currentPlan ? new Date(currentPlan.renewalDate).toLocaleDateString() : 'N/A'}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {currentPlan?.status === 'active' && (
                <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Active</span>
                </div>
              )}
              {currentPlan?.status === 'pending' && (
                <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
              )}
              {currentPlan?.status === 'cancelled' && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Cancelled</span>
                </div>
              )}
            </div>
          </div>

          {currentPlan?.planType !== 'free' && currentPlan?.status === 'active' && (
            <Button
              onClick={handleCancelSubscription}
              disabled={isCancelling}
              variant="destructive"
              className="bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/50"
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
              <div key={idx} className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2 font-medium">{stat.label}</p>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-white">{stat.used}</span>
                  <span className="text-gray-500">/ {stat.limit}</span>
                </div>
                <div className="w-full bg-white/[0.1] rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${(stat.used / stat.limit) * 100 > 80
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
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg overflow-hidden">
            <div className="p-6 border-b border-white/[0.08]">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" />
                Payment History
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/[0.08]">
                    <th className="text-left py-3 px-6 text-gray-400 font-medium">Date</th>
                    <th className="text-left py-3 px-6 text-gray-400 font-medium">Plan</th>
                    <th className="text-right py-3 px-6 text-gray-400 font-medium">Amount</th>
                    <th className="text-center py-3 px-6 text-gray-400 font-medium">Status</th>
                    <th className="text-center py-3 px-6 text-gray-400 font-medium">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="border-b border-white/[0.08] hover:bg-white/[0.04] transition-colors">
                      <td className="py-4 px-6 text-white font-medium">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-gray-300 capitalize">{payment.plan}</td>
                      <td className="py-4 px-6 text-white text-right font-mono">
                        {payment.currency} {payment.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {payment.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 text-green-400 text-xs font-medium bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Paid
                          </span>
                        )}
                        {payment.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-yellow-400 text-xs font-medium bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                        {payment.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 text-red-400 text-xs font-medium bg-red-400/10 px-2 py-0.5 rounded-full border border-red-400/20">
                            <AlertCircle className="w-3 h-3" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {payment.invoice ? (
                          <a href={payment.invoice} className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            <span className="sr-only">Download</span>
                          </a>
                        ) : (
                          <span className="text-gray-600">-</span>
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
    </div>
  )
}
