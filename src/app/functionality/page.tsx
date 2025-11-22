'use client'

import React, { useState } from 'react'
import { 
  Zap, Link2, Share2, Settings, BarChart3, Users, Lock, Smartphone,
  QrCode, Scissors, MessageCircle, Instagram, Facebook, MessageSquare,
  Globe, Palette, Users2, GitBranch, CreditCard, CheckCircle2, ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
  status: 'active' | 'coming'
  category: string
  action?: {
    label: string
    href: string
  }
}

const FEATURES: Feature[] = [
  // Core Features
  {
    icon: <Link2 className="w-6 h-6" />,
    title: 'Link-in-Bio Pages',
    description: 'Create beautiful, customizable landing pages to share your links with the world',
    features: [
      'Drag-and-drop page builder',
      'Multiple templates and themes',
      'Custom branding and colors',
      'Mobile-responsive design',
      'Real-time preview',
      'Custom domain support'
    ],
    status: 'active',
    category: 'Core',
    action: {
      label: 'Build Page',
      href: '/dashboard/pages'
    }
  },
  {
    icon: <QrCode className="w-6 h-6" />,
    title: 'QR Code Generator',
    description: 'Generate custom QR codes for your link pages with branding options',
    features: [
      'Multiple format outputs',
      'Custom colors and styling',
      'Logo embedding',
      'High-quality resolution',
      '24-hour caching',
      'Instant download'
    ],
    status: 'active',
    category: 'Tools',
    action: {
      label: 'Generate QR',
      href: '/dashboard/qr-code'
    }
  },
  {
    icon: <Scissors className="w-6 h-6" />,
    title: 'Link Shortener',
    description: 'Create short, memorable links with click tracking and analytics',
    features: [
      'Custom short slugs',
      'Click tracking',
      '302 redirects',
      'Real-time analytics',
      'Bulk creation',
      'Link expiration options'
    ],
    status: 'active',
    category: 'Tools',
    action: {
      label: 'Shorten Link',
      href: '/dashboard/short-links'
    }
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Auto-Reply Engine',
    description: 'Intelligent auto-replies for Instagram, Facebook & WhatsApp with AI capabilities',
    features: [
      'Comment auto-replies',
      'DM auto-responses',
      'Keyword-based triggers',
      'Time-based scheduling',
      'Custom message templates',
      'Priority-based rules',
      'Multiple platform support'
    ],
    status: 'active',
    category: 'Automation',
    action: {
      label: 'Setup Rules',
      href: '/dashboard/rules'
    }
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Advanced Analytics',
    description: 'Detailed insights into engagement, performance, and user behavior',
    features: [
      'Real-time page views',
      'Button click tracking',
      'CTR calculations',
      'Device breakdown',
      'Referrer sources',
      'CSV export',
      'Custom date ranges'
    ],
    status: 'active',
    category: 'Analytics',
    action: {
      label: 'View Analytics',
      href: '/dashboard/analytics'
    }
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: 'Social Media Integration',
    description: 'Connect and manage Instagram, Facebook, Twitter, TikTok, LinkedIn & WhatsApp',
    features: [
      'OAuth integration',
      'Multi-platform support',
      'Account management',
      'Unified dashboard',
      'Cross-platform analytics',
      'Webhook support',
      'Token management'
    ],
    status: 'active',
    category: 'Integration',
    action: {
      label: 'Connect Accounts',
      href: '/dashboard/accounts'
    }
  },
  // Advanced Features
  {
    icon: <Palette className="w-6 h-6" />,
    title: 'Advanced Branding',
    description: 'Customize every aspect of your brand with themes and templates',
    features: [
      '4 pre-built templates',
      'Custom CSS support',
      'Color palette generator',
      'Font customization',
      'Logo upload',
      'Dynamic CSS generation',
      'XSS protection'
    ],
    status: 'active',
    category: 'Customization',
    action: {
      label: 'Customize Brand',
      href: '/dashboard/branding'
    }
  },
  {
    icon: <Users2 className="w-6 h-6" />,
    title: 'Team Collaboration',
    description: 'Work together with role-based access and activity tracking',
    features: [
      'Role-based permissions',
      'Collaborator management',
      'Activity logging',
      'Page comments',
      'Notification system',
      'Audit trail',
      'Bulk invitations'
    ],
    status: 'active',
    category: 'Collaboration',
    action: {
      label: 'Manage Team',
      href: '/dashboard/collaborators'
    }
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: 'Advanced Rules Engine',
    description: 'Create complex rules for conditional routing and A/B testing',
    features: [
      'Conditional redirects',
      'A/B testing',
      'Personalization rules',
      'Time-based routing',
      'Device detection',
      'Referrer targeting',
      'Multi-condition support'
    ],
    status: 'active',
    category: 'Automation',
    action: {
      label: 'Create Rules',
      href: '/dashboard/advanced-rules'
    }
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Custom Domains',
    description: 'Use your own domain instead of ReplyLink branding',
    features: [
      'Custom domain setup',
      'DNS configuration',
      'SSL certificates',
      'Domain verification',
      'HTTPS redirects',
      'Multi-domain support',
      'Wildcard support'
    ],
    status: 'active',
    category: 'Customization',
    action: {
      label: 'Setup Domain',
      href: '/dashboard/domains'
    }
  },
  // Billing & Security
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: 'Subscription Plans',
    description: 'Choose the perfect plan for your needs with flexible billing',
    features: [
      'FREE tier available',
      'STARTER plan',
      'PRO plan',
      'AGENCY plan',
      'Razorpay & PayPal',
      'Monthly & yearly billing',
      'Upgrade/downgrade anytime'
    ],
    status: 'active',
    category: 'Billing',
    action: {
      label: 'View Plans',
      href: '/dashboard/billing'
    }
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Security Features',
    description: 'Enterprise-grade security with encryption and compliance',
    features: [
      'JWT authentication',
      'CSRF protection',
      'Rate limiting',
      'Input validation',
      'Token encryption',
      'HTTP-only cookies',
      'Sentry monitoring'
    ],
    status: 'active',
    category: 'Security',
    action: {
      label: 'Security Settings',
      href: '/dashboard/settings/security'
    }
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Real-Time Dashboard',
    description: 'Live updates and metrics with WebSocket integration',
    features: [
      'Live activity feed',
      'Real-time statistics',
      'WebSocket updates',
      'Pusher integration',
      'Instant notifications',
      'Custom alerts',
      'Performance metrics'
    ],
    status: 'active',
    category: 'Dashboard',
    action: {
      label: 'View Dashboard',
      href: '/dashboard'
    }
  }
]

const STATS = [
  { label: 'Total Features', value: '12+' },
  { label: 'Supported Platforms', value: '6' },
  { label: 'Integration Types', value: '10+' },
  { label: 'Uptime', value: '99.9%' }
]

const PLATFORMS = [
  { name: 'Instagram', icon: <Instagram className="w-5 h-5" /> },
  { name: 'Facebook', icon: <Facebook className="w-5 h-5" /> },
  { name: 'WhatsApp', icon: <MessageSquare className="w-5 h-5" /> },
  { name: 'Twitter/X', icon: <Share2 className="w-5 h-5" /> },
  { name: 'TikTok', icon: <Smartphone className="w-5 h-5" /> },
  { name: 'LinkedIn', icon: <Users className="w-5 h-5" /> }
]

export default function FunctionalityPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', 'Core', 'Tools', 'Automation', 'Analytics', 'Integration', 'Customization', 'Collaboration', 'Billing', 'Security', 'Dashboard']
  
  const filteredFeatures = selectedCategory === 'All' 
    ? FEATURES 
    : FEATURES.filter(f => f.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Complete Feature Set
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Everything you need to manage links, automate replies, and grow your audience
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-white/5 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-emerald-400">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Supported Platforms */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Supported Platforms</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {PLATFORMS.map((platform, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center hover:border-emerald-500/50 transition-colors">
                <div className="text-emerald-400 mb-2">{platform.icon}</div>
                <p className="text-white text-sm font-semibold text-center">{platform.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Browse Features</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800/50 text-slate-300 border border-white/5 hover:border-emerald-500/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {filteredFeatures.map((feature, idx) => (
            <div
              key={idx}
              className={`rounded-xl border transition-all ${
                feature.status === 'active'
                  ? 'bg-slate-900/50 border-white/5 hover:border-emerald-500/50 hover:bg-slate-900/70'
                  : 'bg-slate-900/30 border-white/5'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    feature.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-slate-800/50 text-slate-400'
                  }`}>
                    {feature.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {feature.status === 'active' && (
                      <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{feature.description}</p>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {feature.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                {feature.action && (
                  <Link
                    href={feature.action.href}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    {feature.action.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600/20 via-emerald-600/10 to-emerald-600/20 border border-emerald-500/30 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users managing their links and automating replies with ReplyLink
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/dashboard/billing"
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold border border-white/10 transition-colors"
            >
              View Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
