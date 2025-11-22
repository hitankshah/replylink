import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const data = [
            {
                platform: 'Instagram',
                accounts: 3,
                replies: 456,
                topRule: 'DM Auto-Reply',
            },
            {
                platform: 'Facebook',
                accounts: 2,
                replies: 289,
                topRule: 'Comment Keywords',
            },
            {
                platform: 'WhatsApp',
                accounts: 1,
                replies: 178,
                topRule: 'Out of Hours',
            },
        ]

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Platform stats error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch platform stats' },
            { status: 500 }
        )
    }
}
