import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const data = [
            {
                id: '1',
                type: 'reply_sent',
                message: 'Auto-replied to Instagram comment',
                platform: 'INSTAGRAM',
                timestamp: new Date(Date.now() - 2 * 60 * 1000),
            },
            {
                id: '2',
                type: 'button_click',
                message: 'Visitor clicked "WhatsApp" button',
                timestamp: new Date(Date.now() - 5 * 60 * 1000),
            },
            {
                id: '3',
                type: 'page_view',
                message: 'New visitor viewed your link page',
                timestamp: new Date(Date.now() - 8 * 60 * 1000),
            },
            {
                id: '4',
                type: 'rule_triggered',
                message: 'Rule "DM Keywords" triggered',
                platform: 'FACEBOOK',
                timestamp: new Date(Date.now() - 12 * 60 * 1000),
            },
            {
                id: '5',
                type: 'reply_sent',
                message: 'Auto-replied to WhatsApp message',
                platform: 'WHATSAPP',
                timestamp: new Date(Date.now() - 15 * 60 * 1000),
            },
        ]

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Activity feed error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch activity feed' },
            { status: 500 }
        )
    }
}
