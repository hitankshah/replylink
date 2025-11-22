import Link from 'next/link'
import { ArrowRight, BarChart3, Link2, MessageSquare, Zap } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link2 className="w-8 h-8 text-purple-600" />
                        <span className="text-2xl font-bold gradient-text">ReplyLink</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="#features" className="text-gray-600 hover:text-purple-600 transition">
                            Features
                        </Link>
                        <Link href="#pricing" className="text-gray-600 hover:text-purple-600 transition">
                            Pricing
                        </Link>
                        <Link href="/auth/login" className="text-gray-600 hover:text-purple-600 transition">
                            Login
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition"
                        >
                            Get Started
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-4xl mx-auto animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Your Link-in-Bio +<br />
                        <span className="gradient-text">Auto-Reply Powerhouse</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        Create stunning bio pages and automate Instagram, Facebook & WhatsApp replies.
                        All in one powerful platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/signup"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            Start Free Trial
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/dashboard"
                            className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition flex items-center justify-center gap-2"
                        >
                            View Demo
                        </Link>
                    </div>
                </div>

                {/* Hero Image/Stats */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                        <Zap className="w-12 h-12 text-yellow-500 mb-4 mx-auto" />
                        <h3 className="text-3xl font-bold mb-2">60K+</h3>
                        <p className="text-gray-600">Auto-Replies/Month</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                        <BarChart3 className="w-12 h-12 text-blue-500 mb-4 mx-auto" />
                        <h3 className="text-3xl font-bold mb-2">99.9%</h3>
                        <p className="text-gray-600">Uptime SLA</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                        <MessageSquare className="w-12 h-12 text-green-500 mb-4 mx-auto" />
                        <h3 className="text-3xl font-bold mb-2">10K+</h3>
                        <p className="text-gray-600">Active Users</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-white py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                        Everything You Need, <span className="gradient-text">One Platform</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-xl transition transform hover:-translate-y-2"
                            >
                                <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20">
                <div className="container mx-auto px-4 text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Transform Your Social Media?
                    </h2>
                    <p className="text-xl mb-10 opacity-90">
                        Join thousands of creators and businesses using ReplyLink
                    </p>
                    <Link
                        href="/auth/signup"
                        className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105 inline-flex items-center gap-2"
                    >
                        Start Your Free Trial
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Link2 className="w-6 h-6" />
                        <span className="text-xl font-bold">ReplyLink</span>
                    </div>
                    <p className="text-gray-400 mb-4">
                        © 2024 ReplyLink. All rights reserved.
                    </p>
                    <div className="flex justify-center gap-6">
                        <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                            Privacy
                        </Link>
                        <Link href="/terms" className="text-gray-400 hover:text-white transition">
                            Terms
                        </Link>
                        <Link href="/contact" className="text-gray-400 hover:text-white transition">
                            Contact
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

const features = [
    {
        icon: Link2,
        title: 'Beautiful Link Pages',
        description: 'Create stunning, customizable link-in-bio pages that convert visitors into customers.',
    },
    {
        icon: MessageSquare,
        title: 'Auto-Reply Rules',
        description: 'Set up intelligent auto-replies for Instagram, Facebook, and WhatsApp messages.',
    },
    {
        icon: BarChart3,
        title: 'Real-Time Analytics',
        description: 'Track page views, clicks, and engagement with live analytics dashboard.',
    },
    {
        icon: Zap,
        title: 'Instant Responses',
        description: 'Never miss a customer inquiry with lightning-fast automated responses.',
    },
    {
        icon: Link2,
        title: 'Multi-Platform',
        description: 'Manage all your social accounts from one unified dashboard.',
    },
    {
        icon: BarChart3,
        title: 'Advanced Insights',
        description: 'Understand your audience with detailed performance metrics and trends.',
    },
]
