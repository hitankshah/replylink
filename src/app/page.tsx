'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, BarChart3, Share2, Lock, Smartphone, Users, MessageCircle, Check } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              ReplyLink
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/functionality" className="text-gray-600 hover:text-gray-900 font-semibold text-sm hidden sm:inline">
              Features
            </Link>
            <Link href="/core-features" className="text-gray-600 hover:text-gray-900 font-semibold text-sm hidden sm:inline">
              About
            </Link>
            <Link
              href="/dashboard"
              className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-emerald-50/40 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-block">
            <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Join 10,000+ creators & businesses
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Your link in bio,
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
              reimagined
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
            Create beautiful link pages. Automate replies. Track everything. One powerful platform for Instagram, Facebook, WhatsApp, and more.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-600/40 transition-all transform hover:-translate-y-1 inline-flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/functionality"
              className="bg-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-colors border-2 border-transparent inline-flex items-center justify-center gap-2"
            >
              Explore Features
            </Link>
          </div>

          {/* Social Proof */}
          <div className="text-gray-600 text-sm font-semibold">
            <p className="mb-3">Trusted by creators on 6+ platforms:</p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <span>📱 Instagram</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>📱 Facebook</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>💬 WhatsApp</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>🐦 Twitter</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>🎵 TikTok</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>💼 LinkedIn</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Everything creators need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A complete suite of tools to manage your link presence, automate engagement, and grow your audience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Share2 className="w-8 h-8" />,
                title: 'Link Pages',
                description: 'Beautiful, customizable link-in-bio pages. Drag-and-drop builder with 10+ templates.',
                color: 'from-emerald-600 to-emerald-600/60'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Auto-Replies',
                description: 'Smart automation for IG, FB & WhatsApp. Set up rules once, save hours daily.',
                color: 'from-blue-600 to-blue-600/60'
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Analytics',
                description: 'Real-time tracking. Views, clicks, CTR, device breakdown, referrer sources.',
                color: 'from-purple-600 to-purple-600/60'
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: 'QR Codes',
                description: 'Generate custom branded QR codes. Drive offline traffic back to your links.',
                color: 'from-pink-600 to-pink-600/60'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Social Integration',
                description: 'Connect 6+ platforms. Unified dashboard. Manage everything in one place.',
                color: 'from-yellow-600 to-yellow-600/60'
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: 'Enterprise Security',
                description: 'Bank-grade encryption. 2FA. Compliance. Your data is completely safe.',
                color: 'from-red-600 to-red-600/60'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all group hover:-translate-y-1"
              >
                <div className={`inline-block p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Active Creators' },
              { number: '5M+', label: 'Links Created' },
              { number: '100M+', label: 'Tracked Events' },
              { number: '99.9%', label: 'Uptime' }
            ].map((stat, idx) => (
              <div key={idx}>
                <p className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-600 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Plans for every creator
            </h2>
            <p className="text-xl text-gray-600">Start free. Upgrade as you grow.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: 'Free',
                price: '$0',
                icon: '🚀',
                features: ['1 Link Page', '1 Social Account', '100 Auto-Replies/mo', 'Basic Analytics', '100K Tracked Events']
              },
              {
                name: 'Starter',
                price: '$9',
                icon: '⭐',
                features: ['5 Link Pages', '3 Social Accounts', '1K Auto-Replies/mo', 'Advanced Analytics', '1M Tracked Events'],
                popular: true
              },
              {
                name: 'Pro',
                price: '$29',
                icon: '🔥',
                features: ['25 Link Pages', '10 Social Accounts', '10K Auto-Replies/mo', 'Full Analytics', 'Custom Domains', '10M Tracked Events']
              },
              {
                name: 'Agency',
                price: 'Custom',
                icon: '👑',
                features: ['Unlimited Pages', 'Unlimited Accounts', 'Unlimited Replies', 'White-Label', 'Priority Support', 'Dedicated Account Manager']
              }
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 border-2 transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-600 shadow-2xl -translate-y-4'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular ⭐
                  </div>
                )}
                <div className="text-4xl mb-3">{plan.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-black text-gray-900 mb-6">
                  {plan.price}
                  {plan.price !== 'Custom' && <span className="text-lg text-gray-600">/mo</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={`block text-center py-3 rounded-xl font-bold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Loved by creators worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: 'ReplyLink saved me 10 hours a week. The auto-reply feature is incredible.',
                author: 'Sarah Chen',
                role: 'Content Creator, 500K followers',
                emoji: '💎'
              },
              {
                quote: 'Best tool for managing multiple social platforms. The analytics are spot-on.',
                author: 'Marcus Rodriguez',
                role: 'E-commerce Founder',
                emoji: '🚀'
              },
              {
                quote: 'Customer support is amazing. The platform keeps improving every month.',
                author: 'Emma Thompson',
                role: 'Digital Marketing Agency',
                emoji: '⭐'
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl border-2 border-gray-100 hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{testimonial.emoji}</span>
                  <div className="text-amber-400 text-lg">★★★★★</div>
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed font-medium">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Ready to transform your presence?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 font-medium">
            Join thousands of creators growing their audience with ReplyLink.
          </p>
          <Link
            href="/dashboard"
            className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 inline-flex items-center gap-2"
          >
            Start Free Today <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-emerald-600" />
                <span className="font-black text-white">ReplyLink</span>
              </div>
              <p className="text-sm">The complete link-in-bio platform for creators and businesses.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/functionality" className="hover:text-white">Features</Link></li>
                <li><Link href="/core-features" className="hover:text-white">Technical Details</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 ReplyLink. All rights reserved. Built for creators, by creators.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
