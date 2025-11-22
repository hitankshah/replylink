import Link from 'next/link'
import { ArrowRight, BarChart3, CheckCircle2, Globe, Layout, MessageSquare, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden selection:bg-indigo-500/30">
            {/* Background Elements */}
            <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Navbar */}
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white fill-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            ReplyLink
                        </span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</Link>
                        <Link href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</Link>
                        <Link href="/auth/login" className="text-sm text-slate-400 hover:text-white transition-colors">Login</Link>
                        <Link href="/auth/signup">
                            <Button size="sm" className="bg-white text-slate-950 hover:bg-slate-200 font-medium">
                                Get Started
                            </Button>
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="pt-32 pb-20">
                {/* Hero Section */}
                <section className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        New: WhatsApp Integration Live
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight animate-slide-up">
                        Automate your <br />
                        <span className="gradient-text">Social Growth</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
                        The all-in-one link in bio tool that automatically replies to comments and DMs.
                        Turn engagement into revenue while you sleep.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-200">
                        <Link href="/auth/signup">
                            <button className="shimmer-button relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-8 font-medium text-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                                Start Free Trial
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline" size="lg" className="rounded-full border-slate-800 bg-slate-950/50 hover:bg-slate-900 text-slate-300 hover:text-white h-12 px-8">
                                View Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="mt-20 relative max-w-5xl mx-auto animate-slide-up delay-300">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-20"></div>
                        <div className="relative rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm shadow-2xl overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-slate-900/80">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                </div>
                                <div className="ml-4 h-6 w-64 rounded-md bg-slate-800/50 border border-white/5" />
                            </div>
                            {/* Mock UI Content */}
                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="col-span-2 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-lg bg-slate-800/30 border border-white/5">
                                            <div className="text-slate-400 text-sm mb-1">Total Replies</div>
                                            <div className="text-2xl font-bold text-white">12,450</div>
                                            <div className="text-green-400 text-xs mt-2 flex items-center gap-1">
                                                <Zap className="w-3 h-3" /> +12% this week
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-lg bg-slate-800/30 border border-white/5">
                                            <div className="text-slate-400 text-sm mb-1">Link Clicks</div>
                                            <div className="text-2xl font-bold text-white">45.2k</div>
                                            <div className="text-indigo-400 text-xs mt-2 flex items-center gap-1">
                                                <BarChart3 className="w-3 h-3" /> +8% this week
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-48 rounded-lg bg-slate-800/30 border border-white/5 p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-sm font-medium text-slate-300">Activity Feed</div>
                                            <div className="text-xs text-slate-500">Live</div>
                                        </div>
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm">
                                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                                    <span className="text-slate-400">New comment reply sent to</span>
                                                    <span className="text-white font-medium">@user_{i}92</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block rounded-lg bg-slate-800/30 border border-white/5 p-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-4" />
                                    <div className="h-4 w-32 bg-slate-700/50 rounded mx-auto mb-2" />
                                    <div className="h-3 w-24 bg-slate-800/50 rounded mx-auto mb-6" />
                                    <div className="space-y-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="h-10 rounded bg-slate-700/30 w-full" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trusted By */}
                <section className="py-20 border-y border-white/5 bg-slate-900/30 mt-20">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-sm text-slate-500 font-medium mb-8 uppercase tracking-wider">Trusted by 10,000+ creators</p>
                        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
                            {/* Placeholders for logos */}
                            {['Acme Inc', 'Globex', 'Soylent', 'Initech', 'Umbrella'].map((name) => (
                                <span key={name} className="text-xl font-bold text-white">{name}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Bento Grid */}
                <section id="features" className="py-32 container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Everything you need to <br />
                            <span className="gradient-text">dominate social</span>
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Stop manually replying to comments. Let our AI handle your engagement while you focus on creating content.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {/* Large Card */}
                        <div className="md:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <MessageSquare className="w-64 h-64 text-indigo-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Smart Auto-Replies</h3>
                                <p className="text-slate-400 text-lg max-w-md">
                                    Automatically reply to comments and DMs on Instagram, Facebook, and WhatsApp based on keywords. Send links directly to interested users.
                                </p>
                            </div>
                        </div>

                        {/* Tall Card */}
                        <div className="md:row-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Layout className="w-64 h-64 text-pink-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6 text-pink-400">
                                    <Layout className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Link-in-Bio Builder</h3>
                                <p className="text-slate-400 text-lg mb-8">
                                    Create beautiful, mobile-optimized landing pages that convert. No coding required.
                                </p>
                                <div className="space-y-3">
                                    {['Custom Themes', 'Analytics', 'SEO Optimized', 'Fast Loading'].map((item) => (
                                        <div key={item} className="flex items-center gap-2 text-slate-300">
                                            <CheckCircle2 className="w-4 h-4 text-pink-500" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Small Card 1 */}
                        <div className="glass-card rounded-3xl p-8 group hover:bg-slate-800/50 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
                            <p className="text-slate-400">Track every click, view, and reply as it happens.</p>
                        </div>

                        {/* Small Card 2 */}
                        <div className="glass-card rounded-3xl p-8 group hover:bg-slate-800/50 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 text-green-400">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Custom Domains</h3>
                            <p className="text-slate-400">Connect your own domain for full brand control.</p>
                        </div>

                        {/* Wide Card */}
                        <div className="md:col-span-2 glass-card rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Enterprise Security</h3>
                                <p className="text-slate-400">
                                    Bank-grade encryption for your data and tokens. We never store your social media passwords.
                                </p>
                            </div>
                            <div className="flex-1 w-full bg-slate-950/50 rounded-xl border border-white/5 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-sm text-slate-300">System Status</span>
                                    </div>
                                    <span className="text-xs text-green-400 font-mono">OPERATIONAL</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[99%]" />
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Uptime</span>
                                        <span>99.99%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 container mx-auto px-4">
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 p-12 md:p-24 text-center">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
                                Ready to automate your growth?
                            </h2>
                            <p className="text-xl text-indigo-100 mb-10">
                                Join thousands of creators who are saving hours every day with ReplyLink.
                            </p>
                            <Link href="/auth/signup">
                                <button className="bg-white text-indigo-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-indigo-50 transition-colors shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                                    Get Started for Free
                                </button>
                            </Link>
                            <p className="mt-6 text-sm text-indigo-200">No credit card required • Cancel anytime</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-slate-950 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center">
                                    <Zap className="w-3 h-3 text-white fill-white" />
                                </div>
                                <span className="text-lg font-bold text-white">ReplyLink</span>
                            </div>
                            <p className="text-slate-500 text-sm">
                                Automating social engagement for the next generation of creators.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Features</Link></li>
                                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
                                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Integrations</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="#" className="hover:text-indigo-400 transition-colors">About</Link></li>
                                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
                                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Careers</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Privacy</Link></li>
                                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
                        © 2024 ReplyLink. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}
