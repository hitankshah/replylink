import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const days = parseInt(searchParams.get('days') || '7')

        // Generate demo data
        const labels = days === 7
            ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            : Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)

        const data = labels.map((name) => ({
            name,
            views: Math.floor(Math.random() * 500) + 100,
        }))

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Page views error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch page views' },
            { status: 500 }
        )
    }
}
