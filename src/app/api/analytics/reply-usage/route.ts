import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const data = [
            { name: 'Instagram', value: 456 },
            { name: 'Facebook', value: 289 },
            { name: 'WhatsApp', value: 178 },
        ]

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Reply usage error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch reply usage' },
            { status: 500 }
        )
    }
}
