import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const data = [
            { name: 'Instagram', clicks: 245 },
            { name: 'Website', clicks: 189 },
            { name: 'WhatsApp', clicks: 167 },
            { name: 'Email', clicks: 134 },
            { name: 'Other', clicks: 98 },
        ]

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Button clicks error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch button clicks' },
            { status: 500 }
        )
    }
}
