"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
    ArrowRight,
    Check,
    Star,
    TrendingUp,
    MessageCircle,
    Zap,
    Shield,
    Users,
    Clock,
    X,
    PlayCircle,
    ChevronDown,
    Instagram,
    Facebook,
    Smartphone,
    BarChart3,
    Globe,
    Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// --- Components ---

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">R</div>
                    <span className="text-xl font-bold text-white tracking-tight">ReplyLink</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
                    <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="#case-study" className="hover:text-white transition-colors">Results</Link>
                    <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/auth/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
                        Log in
                    </Link>
                    <Link href="/auth/signup">
                        <Button className="bg-white text-slate-950 hover:bg-slate-200 font-semibold rounded-full px-6">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

const Hero = () => (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8 animate-fade-in">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    New: WhatsApp Automation is now live
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-8 leading-tight">
                    Turn your comments into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">revenue</span>.
                </h1>
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Stop manually replying to "link please". ReplyLink automates your DMs and comments, turning casual scrollers into paying customers while you sleep.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/auth/signup">
                        <Button size="lg" className="h-14 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:scale-105">
                            Start Free Trial
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4 text-slate-400 text-sm">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800" />
                            ))}
                        </div>
                        <p>Trusted by 1,000+ creators</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Abstract Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
    </section>
)

const SocialProof = () => (
    <section className="py-10 border-y border-white/5 bg-slate-950/50">
        <div className="container mx-auto px-6 text-center">
            <p className="text-sm text-slate-500 mb-6 font-medium uppercase tracking-wider">Powering growth for modern brands</p>
            <div className="flex flex-wrap justify-center gap-8 lg:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholders for brand logos */}
                {['Acme Corp', 'TechFlow', 'CreatorLabs', 'Growth.io', 'ViralScale'].map((brand) => (
                    <div key={brand} className="text-xl font-bold text-white flex items-center gap-2">
                        <div className="w-6 h-6 bg-white/20 rounded-full" />
                        {brand}
                    </div>
                ))}
            </div>
        </div>
    </section>
)

const ProblemSolution = () => (
    <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-6">The "Link in Bio" Problem</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4 p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                                <X className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-red-200 mb-1">Friction Kills Sales</h3>
                                <p className="text-slate-400">Asking users to "go to bio", find a link, and browse is too much work. You lose 60% of traffic at every step.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                                <Clock className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-red-200 mb-1">Manual Replies are Impossible</h3>
                                <p className="text-slate-400">You can't reply to 500 comments manually. It's tedious, time-consuming, and you'll miss opportunities.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-3xl" />
                    <div className="relative bg-slate-950 border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-6">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <div className="ml-auto text-xs text-slate-500 font-mono">ReplyLink Automation</div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start animate-pulse-glow">
                                <div className="w-10 h-10 rounded-full bg-slate-800" />
                                <div className="flex-1">
                                    <div className="h-4 w-24 bg-slate-800 rounded mb-2" />
                                    <div className="h-16 bg-slate-800/50 rounded-xl p-3 text-sm text-slate-400">
                                        "Link please! 😍"
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start justify-end">
                                <div className="flex-1 text-right">
                                    <div className="h-4 w-24 bg-indigo-900/50 rounded mb-2 ml-auto" />
                                    <div className="bg-indigo-600 text-white rounded-xl rounded-tr-none p-3 text-sm inline-block text-left shadow-lg shadow-indigo-500/20">
                                        Hey! Sent you the link in DM 💌
                                        <br />
                                        <span className="text-indigo-200 text-xs mt-1 block">Sent automatically by ReplyLink</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">R</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
)

const HowItWorks = () => (
    <section id="how-it-works" className="py-24 bg-slate-950">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">How it Works</h2>
                <p className="text-slate-400">Set it up once, and it runs forever.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0" />

                {[
                    {
                        step: "01",
                        title: "Connect Account",
                        desc: "Securely link your Instagram or Facebook account with one click."
                    },
                    {
                        step: "02",
                        title: "Set Keywords",
                        desc: "Choose trigger words like 'LINK', 'GUIDE', or 'RECIPE'."
                    },
                    {
                        step: "03",
                        title: "Watch Sales Grow",
                        desc: "We automatically reply and DM your link to everyone who comments."
                    }
                ].map((item, i) => (
                    <div key={i} className="relative text-center">
                        <div className="w-24 h-24 mx-auto bg-slate-900 border-4 border-slate-950 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-400 mb-6 relative z-10 shadow-xl">
                            {item.step}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                        <p className="text-slate-400">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
)

const DeepDive = () => (
    <section className="py-24 bg-slate-900/30">
        <div className="container mx-auto px-6 space-y-32">

            {/* Feature 1 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full" />
                    <div className="relative bg-slate-950 border border-white/10 rounded-2xl p-2 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="bg-slate-900 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center">
                            <div className="text-slate-500">[UI Screenshot: Rule Builder Interface]</div>
                        </div>
                    </div>
                </div>
                <div className="order-1 lg:order-2">
                    <div className="w-12 h-12 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-6">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-6">Precision Targeting</h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                        Don't just spam everyone. Set specific rules for specific posts.
                        Send a recipe link for your cooking video, and a course link for your tutorial.
                    </p>
                    <ul className="space-y-4">
                        {[
                            "Filter by specific post or reel",
                            "Randomize replies to avoid spam detection",
                            "Track which keywords perform best"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-300">
                                <Check className="w-5 h-5 text-indigo-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Feature 2 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400 mb-6">
                        <Smartphone className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-6">Beautiful Link Pages</h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                        Your link-in-bio shouldn't be ugly. Build a stunning, mobile-optimized page that matches your brand in seconds.
                    </p>
                    <ul className="space-y-4">
                        {[
                            "Zero-latency loading speed",
                            "Custom domains (yourname.com)",
                            "Capture emails directly on the page"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-300">
                                <Check className="w-5 h-5 text-purple-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full" />
                    <div className="relative bg-slate-950 border border-white/10 rounded-3xl p-2 shadow-2xl -rotate-3 hover:rotate-0 transition-transform duration-500 w-[300px] mx-auto">
                        <div className="bg-slate-900 rounded-2xl overflow-hidden h-[600px] flex items-center justify-center">
                            <div className="text-slate-500">[Mobile Preview]</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
)

const CaseStudy = () => (
    <section id="case-study" className="py-24 bg-slate-950">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Real Results, Real Humans</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">See how creators are actually using ReplyLink to grow their business.</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/10 rounded-3xl overflow-hidden">
                <div className="grid lg:grid-cols-2">
                    <div className="p-10 lg:p-16 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 text-indigo-400 font-semibold mb-6">
                            <TrendingUp className="w-5 h-5" />
                            Case Study: Sarah's Bakery
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-6">"I went from answering DMs for 2 hours a day to 0."</h3>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            Sarah runs a popular baking instagram. Every time she posted a recipe reel, she'd get hundreds of "recipe please" comments. She was overwhelmed.
                        </p>
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <div className="text-4xl font-bold text-white mb-1">312%</div>
                                <div className="text-sm text-slate-500">Increase in Website Traffic</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-white mb-1">15hrs</div>
                                <div className="text-sm text-slate-500">Saved per Week</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-700" />
                            <div>
                                <div className="font-bold text-white">Sarah Jenkins</div>
                                <div className="text-sm text-slate-500">Founder, SweetTreats</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-800/50 relative min-h-[400px] flex items-center justify-center border-l border-white/5">
                        <div className="text-center p-8">
                            <div className="text-6xl mb-4">📈</div>
                            <p className="text-slate-400">Visual: Traffic Graph Spike</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
)

const Comparison = () => (
    <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">Why switch to ReplyLink?</h2>
            </div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                {/* The Old Way */}
                <div className="p-8 rounded-2xl bg-slate-950/50 border border-red-500/20 opacity-70">
                    <h3 className="text-xl font-bold text-red-400 mb-6">The Old Way</h3>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-slate-400">
                            <X className="w-5 h-5 text-red-500" />
                            Manually replying to every comment
                        </li>
                        <li className="flex items-center gap-3 text-slate-400">
                            <X className="w-5 h-5 text-red-500" />
                            Generic "Link in Bio" text
                        </li>
                        <li className="flex items-center gap-3 text-slate-400">
                            <X className="w-5 h-5 text-red-500" />
                            Missed DMs and lost sales
                        </li>
                        <li className="flex items-center gap-3 text-slate-400">
                            <X className="w-5 h-5 text-red-500" />
                            No analytics or tracking
                        </li>
                    </ul>
                </div>

                {/* The ReplyLink Way */}
                <div className="p-8 rounded-2xl bg-indigo-900/10 border border-indigo-500/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
                    <h3 className="text-xl font-bold text-indigo-400 mb-6">The ReplyLink Way</h3>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-white">
                            <Check className="w-5 h-5 text-indigo-500" />
                            Instant, 24/7 Auto-Replies
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <Check className="w-5 h-5 text-indigo-500" />
                            Direct Links sent to DMs
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <Check className="w-5 h-5 text-indigo-500" />
                            Capture 100% of leads
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <Check className="w-5 h-5 text-indigo-500" />
                            Real-time ROI Dashboard
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
)

const Pricing = () => (
    <section id="pricing" className="py-24 bg-slate-950">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">Simple, transparent pricing</h2>
                <p className="text-slate-400">Start for free, upgrade as you grow.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Free Plan */}
                <div className="p-8 rounded-2xl bg-slate-900 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="text-xl font-bold text-white mb-2">Starter</div>
                    <div className="text-4xl font-bold text-white mb-6">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                    <p className="text-slate-400 mb-8 text-sm">Perfect for trying out automation.</p>
                    <Link href="/auth/signup">
                        <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white mb-8">Start Free</Button>
                    </Link>
                    <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> 100 Auto-Replies/mo</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> 1 Social Account</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Basic Analytics</li>
                    </ul>
                </div>

                {/* Pro Plan */}
                <div className="p-8 rounded-2xl bg-indigo-900/10 border border-indigo-500/50 relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                    <div className="text-xl font-bold text-white mb-2">Pro</div>
                    <div className="text-4xl font-bold text-white mb-6">$29<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                    <p className="text-slate-400 mb-8 text-sm">For serious creators growing fast.</p>
                    <Link href="/auth/signup">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mb-8">Get Started</Button>
                    </Link>
                    <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Unlimited Auto-Replies</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> 3 Social Accounts</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Remove Branding</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Priority Support</li>
                    </ul>
                </div>

                {/* Agency Plan */}
                <div className="p-8 rounded-2xl bg-slate-900 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="text-xl font-bold text-white mb-2">Agency</div>
                    <div className="text-4xl font-bold text-white mb-6">$99<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                    <p className="text-slate-400 mb-8 text-sm">Manage multiple clients easily.</p>
                    <Link href="/auth/signup">
                        <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white mb-8">Contact Sales</Button>
                    </Link>
                    <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Everything in Pro</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> 10 Social Accounts</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> Team Members</li>
                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-500" /> API Access</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
)

const Features = () => (
    <section id="features" className="py-24 bg-slate-950 relative border-t border-white/5">
        <div className="container mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Everything you need to automate growth</h2>
                <p className="text-slate-400">Powerful tools wrapped in a simple, human-friendly interface.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        icon: MessageCircle,
                        title: "Smart Auto-Replies",
                        desc: "Set keywords like 'LINK' or 'GUIDE'. We'll reply to the comment and send a DM instantly."
                    },
                    {
                        icon: Zap,
                        title: "Link-in-Bio 2.0",
                        desc: "Build beautiful, mobile-first pages that load instantly. No design skills needed."
                    },
                    {
                        icon: TrendingUp,
                        title: "Real-time Analytics",
                        desc: "Track exactly which posts are driving sales. Measure ROI on every piece of content."
                    },
                    {
                        icon: Shield,
                        title: "Meta Compliant",
                        desc: "100% safe to use. We use official APIs and respect platform rate limits to keep your account safe."
                    },
                    {
                        icon: Users,
                        title: "Team Collaboration",
                        desc: "Invite your team to manage replies and pages without sharing Instagram passwords."
                    },
                    {
                        icon: Star,
                        title: "Custom Branding",
                        desc: "Remove our logo, use your own domain, and match your brand colors perfectly."
                    }
                ].map((feature, i) => (
                    <div key={i} className="p-8 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 transition-colors group">
                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                            <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
)

const FAQ = () => (
    <section id="faq" className="py-24 bg-slate-900/30">
        <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">Common Questions</h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
                {[
                    { q: "Is this safe for my Instagram account?", a: "Yes, absolutely. We use the official Meta Graph API and adhere strictly to all rate limits and policies. We never ask for your password." },
                    { q: "Can I use my own domain?", a: "Yes! On the Pro plan and above, you can connect your own custom domain (e.g., links.yourbrand.com)." },
                    { q: "Do you offer a free trial?", a: "Yes, we offer a 14-day free trial on all plans. No credit card required to start." },
                    { q: "What happens if I get too many comments?", a: "Our system queues replies and sends them out at a safe, natural pace to ensure delivery without triggering spam filters." }
                ].map((item, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 bg-slate-900/50 rounded-xl px-6">
                        <AccordionTrigger className="text-white hover:no-underline py-6">{item.q}</AccordionTrigger>
                        <AccordionContent className="text-slate-400 pb-6">
                            {item.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </section>
)

const CTA = () => (
    <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 tracking-tight">
                Ready to automate your growth?
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                Join thousands of creators who are saving time and making more money with ReplyLink.
            </p>
            <Link href="/auth/signup">
                <Button size="lg" className="h-14 px-10 rounded-full bg-white text-slate-950 hover:bg-slate-200 text-lg font-bold">
                    Get Started for Free
                </Button>
            </Link>
            <p className="mt-6 text-sm text-slate-500">No credit card required • Cancel anytime</p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950 pointer-events-none" />
    </section>
)

const Footer = () => (
    <footer className="py-12 border-t border-white/5 bg-slate-950 text-slate-400 text-sm">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-2">
                    <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
                        <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-xs">R</div>
                        ReplyLink
                    </div>
                    <p className="max-w-xs">The all-in-one automation platform for modern creators. Built with ❤️ for the community.</p>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Product</h4>
                    <ul className="space-y-2">
                        <li><Link href="#" className="hover:text-indigo-400">Features</Link></li>
                        <li><Link href="#" className="hover:text-indigo-400">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-indigo-400">Case Studies</Link></li>
                        <li><Link href="#" className="hover:text-indigo-400">Changelog</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Legal</h4>
                    <ul className="space-y-2">
                        <li><Link href="#" className="hover:text-indigo-400">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-indigo-400">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-indigo-400">Cookie Policy</Link></li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
                <p>© 2024 ReplyLink Inc. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    {/* Social icons would go here */}
                </div>
            </div>
        </div>
    </footer>
)

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
            <Navbar />
            <Hero />
            <SocialProof />
            <ProblemSolution />
            <HowItWorks />
            <DeepDive />
            <CaseStudy />
            <Comparison />
            <Pricing />
            <Features />
            <FAQ />
            <CTA />
            <Footer />
        </div>
    )
}
