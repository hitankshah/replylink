'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, BarChart3, Shield, Users, Check, ChevronRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[hsl(0,0%,4%)] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[hsl(0,0%,4%)]/80 backdrop-blur-xl border-b border-white/[0.08] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">RL</span>
            </div>
            <span className="font-bold text-white">ReplyLink</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/functionality" className="text-gray-400 hover:text-white text-sm font-medium hidden sm:inline transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white text-sm font-medium hidden sm:inline transition-colors">
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="bg-white text-black px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-flex">
            <div className="bg-white/[0.08] border border-white/[0.12] text-gray-300 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Trusted by 10,000+ professionals
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Link-in-bio platform
            <br />
            <span className="text-gray-400">for professionals</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create custom link pages, automate social media replies, and track everything.
            Built for teams that need reliability and scale.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/dashboard"
              className="bg-white text-black px-8 py-3.5 rounded-md font-medium hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/functionality"
              className="bg-white/[0.05] border border-white/[0.12] text-white px-8 py-3.5 rounded-md font-medium hover:bg-white/[0.08] transition-all inline-flex items-center justify-center gap-2"
            >
              View Features
            </Link>
          </div>

          {/* Social Proof */}
          <div className="text-gray-500 text-sm">
            <p className="mb-3">Integrated with</p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <span className="text-gray-400">Instagram</span>
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <span className="text-gray-400">Facebook</span>
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <span className="text-gray-400">WhatsApp</span>
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <span className="text-gray-400">Twitter</span>
              <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
              <span className="text-gray-400">LinkedIn</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Professional tools for link management, automation, and analytics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Link Pages',
                description: 'Customizable link-in-bio pages with drag-and-drop builder and analytics tracking.',
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Auto-Replies',
                description: 'Smart automation for Instagram, Facebook, and WhatsApp to save hours daily.',
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Analytics',
                description: 'Real-time tracking with views, clicks, CTR, device breakdown, and referrers.',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Team Collaboration',
                description: 'Invite team members, assign roles, and manage workspaces efficiently.',
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Enterprise Security',
                description: 'Bank-grade encryption, 2FA, and compliance. Your data is completely safe.',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'API Access',
                description: 'Integrate ReplyLink with your existing tools via our RESTful API.',
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-lg hover:border-white/[0.16] hover:bg-white/[0.05] transition-all group"
              >
                <div className="inline-flex p-2 rounded-md bg-white/[0.05] text-blue-500 mb-4 group-hover:bg-white/[0.08] transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Active Users' },
              { number: '5M+', label: 'Links Created' },
              { number: '100M+', label: 'Tracked Events' },
              { number: '99.9%', label: 'Uptime' }
            ].map((stat, idx) => (
              <div key={idx}>
                <p className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-400">Start free. Upgrade as you grow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: '$9',
                features: ['5 Link Pages', '3 Social Accounts', '1K Auto-Replies/mo', 'Advanced Analytics']
              },
              {
                name: 'Pro',
                price: '$29',
                features: ['25 Link Pages', '10 Social Accounts', '10K Auto-Replies/mo', 'Custom Domains', 'Priority Support'],
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                features: ['Unlimited Pages', 'Unlimited Accounts', 'White-Label', 'Dedicated Support', 'SLA Guarantee']
              }
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-8 border transition-all ${plan.popular
                    ? 'bg-white/[0.05] border-white/[0.16] scale-105'
                    : 'bg-white/[0.03] border-white/[0.08]'
                  }`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-white mb-6">
                  {plan.price}
                  {plan.price !== 'Custom' && <span className="text-lg text-gray-500">/mo</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard
"
                  className={`block text-center py-2.5 rounded-md font-medium transition-all ${plan.popular
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-white/[0.05] border border-white/[0.12] text-white hover:bg-white/[0.08]'
                    }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of professionals using ReplyLink.
          </p>
          <Link
            href="/dashboard"
            className="bg-white text-black px-8 py-3.5 rounded-md font-medium hover:bg-gray-100 transition-all inline-flex items-center gap-2"
          >
            Start Free Today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-md"></div>
                <span className="font-bold text-white">ReplyLink</span>
              </div>
              <p className="text-sm text-gray-500">Professional link-in-bio platform.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/functionality" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.08] pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2024 ReplyLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
