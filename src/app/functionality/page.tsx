'use client'

import React, { useState } from 'react'
import {
  Zap, Link2, Share2, Settings, BarChart3, Users, Lock, Smartphone,
  QrCode, Scissors, MessageCircle, Instagram, Facebook, MessageSquare,
  Globe, Palette, Users2, GitBranch, CreditCard, CheckCircle2, ArrowRight,
  Target, Rocket
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
    <div className="min-h-screen bg-[hsl(0,0%,4%)] text-white">
      {/* Hero Section */}
      <div className="relative border-b border-white/[0.08] bg-[hsl(0,0%,4%)]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Header Content */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-white/[0.05] border border-white/[0.12] text-gray-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                <Zap className="w-3 h-3 text-blue-500" />
                POWERFUL FEATURES
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              Everything You Need to <br />
              <span className="text-gray-400">Grow Your Audience</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Powerful link-in-bio pages, intelligent auto-replies, and comprehensive analytics all in one platform
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {STATS.map((stat, idx) => (
              <div key={idx} className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6 text-center">
                <p className="text-gray-500 text-sm mb-2 font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Supported Platforms */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-white/[0.05] rounded-lg">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Supported Platforms</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {PLATFORMS.map((platform, idx) => (
              <div key={idx} className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6 flex flex-col items-center justify-center hover:bg-white/[0.05] transition-all group cursor-pointer">
                <div className="text-gray-400 group-hover:text-white mb-3 transition-colors">{platform.icon}</div>
                <p className="text-gray-400 group-hover:text-white text-sm font-medium text-center transition-colors">{platform.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-white/[0.05] rounded-lg">
              <Rocket className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Browse All Features</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedCategory === cat
                    ? 'bg-white text-black'
                    : 'bg-white/[0.03] text-gray-400 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {filteredFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-lg border bg-white/[0.03] border-white/[0.08] hover:border-white/[0.16] transition-all group overflow-hidden"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 rounded-lg bg-white/[0.05] text-blue-500 group-hover:bg-white/[0.08] transition-colors">
                    {feature.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {feature.status === 'active' && (
                      <span className="flex items-center gap-1 text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">{feature.description}</p>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {feature.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                {feature.action && (
                  <Link
                    href={feature.action.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors group/link"
                  >
                    {feature.action.label}
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.03] p-12 text-center">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands of creators managing their links and automating replies with ReplyLink
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-all"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/dashboard/billing"
                className="bg-transparent text-white border border-white/[0.12] px-8 py-3 rounded-md font-medium hover:bg-white/[0.05] transition-all"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
