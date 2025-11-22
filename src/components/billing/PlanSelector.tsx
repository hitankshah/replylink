'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, Zap } from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number
  interval: 'monthly' | 'yearly'
  description: string
  features: {
    pages: number
    accounts: number
    monthlyReplies: number
  }
  isPopular?: boolean
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'monthly',
    description: 'Perfect for getting started',
    features: {
      pages: 1,
      accounts: 1,
      monthlyReplies: 50,
    },
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 299,
    interval: 'monthly',
    description: 'For growing creators',
    features: {
      pages: 3,
      accounts: 2,
      monthlyReplies: 500,
    },
    isPopular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 799,
    interval: 'monthly',
    description: 'For established creators',
    features: {
      pages: 10,
      accounts: 5,
      monthlyReplies: 2000,
    },
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 1999,
    interval: 'monthly',
    description: 'For agencies & teams',
    features: {
      pages: 50,
      accounts: 20,
      monthlyReplies: 10000,
    },
  },
]

interface PlanSelectorProps {
  currentPlan?: string
  onSelectPlan: (planId: string, gateway: 'razorpay' | 'paypal') => void
  isLoading?: boolean
}

export function PlanSelector({ currentPlan = 'free', onSelectPlan, isLoading = false }: PlanSelectorProps) {
  const [selectedGateway, setSelectedGateway] = useState<'razorpay' | 'paypal'>('razorpay')
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly')

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      // Downgrade to free doesn't need payment
      onSelectPlan(planId, selectedGateway)
    } else {
      onSelectPlan(planId, selectedGateway)
    }
  }

  return (
    <div className="space-y-8">
      {/* Gateway Selection */}
      <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Choose Payment Method</h3>
        <div className="flex gap-4">
          {(['razorpay', 'paypal'] as const).map((gateway) => (
            <button
              key={gateway}
              onClick={() => setSelectedGateway(gateway)}
              className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                selectedGateway === gateway
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-white/10 bg-slate-800 text-slate-400 hover:border-white/20'
              }`}
            >
              <span className="capitalize font-medium">{gateway}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interval Toggle */}
      <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Billing Period</h3>
        <div className="flex gap-4">
          {(['monthly', 'yearly'] as const).map((bill) => (
            <button
              key={bill}
              onClick={() => setInterval(bill)}
              className={`flex-1 px-4 py-3 rounded-lg border transition-all ${
                interval === bill
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-white/10 bg-slate-800 text-slate-400 hover:border-white/20'
              }`}
            >
              <span className="capitalize font-medium">{bill}</span>
              {bill === 'yearly' && <span className="text-xs text-green-400 block mt-1">Save 20%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-xl border transition-all ${
              plan.isPopular
                ? 'border-blue-500 bg-gradient-to-br from-blue-500/10 to-slate-900'
                : 'border-white/10 bg-slate-900/50'
            } p-6 ${currentPlan === plan.id ? 'ring-2 ring-green-500' : ''}`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            {currentPlan === plan.id && (
              <div className="absolute top-4 right-4">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
            )}

            {/* Plan Header */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{plan.description}</p>

              {plan.price > 0 ? (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">₹{plan.price}</span>
                    <span className="text-slate-400">/{interval === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                  {interval === 'yearly' && (
                    <p className="text-xs text-green-400">
                      ₹{Math.floor(plan.price * 12 * 0.8)}/year (Save ₹{Math.floor(plan.price * 12 * 0.2)})
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-3xl font-bold text-white">Free</div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">{plan.features.pages} Link Pages</p>
                  <p className="text-xs text-slate-400">Create multiple link pages</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">{plan.features.accounts} Social Accounts</p>
                  <p className="text-xs text-slate-400">Connect and manage accounts</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Circle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">{plan.features.monthlyReplies.toLocaleString()} Replies/Month</p>
                  <p className="text-xs text-slate-400">Auto-reply to comments and messages</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => handleSelectPlan(plan.id)}
              disabled={isLoading || currentPlan === plan.id}
              className={`w-full ${
                plan.isPopular
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              {currentPlan === plan.id ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Current Plan
                </>
              ) : isLoading ? (
                'Processing...'
              ) : plan.price > 0 ? (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade Now
                </>
              ) : (
                'Start Free'
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-white mb-6">Feature Comparison</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Feature</th>
              {PLANS.map((plan) => (
                <th key={plan.id} className="text-center py-3 px-4 text-white font-medium">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5 hover:bg-white/5">
              <td className="py-3 px-4 text-slate-300">Link Pages</td>
              {PLANS.map((plan) => (
                <td key={plan.id} className="text-center py-3 px-4 text-white">
                  {plan.features.pages}
                </td>
              ))}
            </tr>
            <tr className="border-b border-white/5 hover:bg-white/5">
              <td className="py-3 px-4 text-slate-300">Social Accounts</td>
              {PLANS.map((plan) => (
                <td key={plan.id} className="text-center py-3 px-4 text-white">
                  {plan.features.accounts}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-white/5">
              <td className="py-3 px-4 text-slate-300">Monthly Replies</td>
              {PLANS.map((plan) => (
                <td key={plan.id} className="text-center py-3 px-4 text-white">
                  {plan.features.monthlyReplies.toLocaleString()}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
