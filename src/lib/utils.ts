import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date))
}

export function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount)
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
}

export function truncate(str: string, length: number): string {
    if (str.length <= length) return str
    return str.slice(0, length) + '...'
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

export function generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

export function getPlanLimits(planType: string) {
    const limits = {
        FREE: {
            pages: 1,
            accounts: 1,
            replies: 200,
            customDomain: false,
            whiteLabel: false,
        },
        STARTER: {
            pages: 3,
            accounts: 3,
            replies: 3000,
            customDomain: false,
            whiteLabel: false,
        },
        PRO: {
            pages: 10,
            accounts: 10,
            replies: 15000,
            customDomain: true,
            whiteLabel: false,
        },
        AGENCY: {
            pages: 50,
            accounts: 30,
            replies: 60000,
            customDomain: true,
            whiteLabel: true,
        },
    }

    return limits[planType as keyof typeof limits] || limits.FREE
}

export async function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
