'use client'

import React from 'react'
import { CreditCard, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PlanComparison } from '@/components/billing/PlanComparison'
import { UsageChart } from '@/components/billing/UsageChart'
import { InvoiceList } from '@/components/billing/InvoiceList'
import { CancelSubscriptionDialog } from '@/components/billing/CancelSubscriptionDialog'

export default function BillingPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[hsl(0,0%,4%)] text-white">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Billing & Subscription</h1>
        <p className="text-gray-400">Manage your plan, payment methods, and view billing history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Current Plan & Usage */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Plan Card */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Current Plan</p>
                <h2 className="text-2xl font-bold text-white">Starter Plan</h2>
              </div>
              <div className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Active
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 bg-white/[0.05] rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Next Billing Date</p>
                <p className="text-lg font-semibold text-white">Nov 23, 2023</p>
              </div>
              <div className="flex-1 bg-white/[0.05] rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Amount</p>
                <p className="text-lg font-semibold text-white">₹220.00</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CreditCard className="w-4 h-4" />
                <span>Visa ending in 4242</span>
              </div>
              <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto">
                Update Payment Method
              </Button>
            </div>
          </div>

          {/* Usage Chart */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Auto-Reply Usage</h3>
              <p className="text-sm text-gray-400">Replies sent per month</p>
            </div>
            <UsageChart />
          </div>

          {/* Invoice History */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
            <InvoiceList />
          </div>
        </div>

        {/* Right Column - Upgrade & Settings */}
        <div className="space-y-8">
          <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Upgrade to Pro</h3>
            <p className="text-sm text-blue-200/70 mb-6">
              Get unlimited auto-replies, advanced analytics, and team collaboration features.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Upgrade Now
            </Button>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Plan Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-400">Auto-renewal</span>
                <span className="text-sm text-green-400 font-medium">On</span>
              </div>
              <div className="pt-4 border-t border-white/[0.08]">
                <CancelSubscriptionDialog />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Comparison */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Available Plans</h2>
        <PlanComparison />
      </div>
    </div>
  )
}
