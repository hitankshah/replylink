export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        if (process.env.NODE_ENV === 'production') {
            console.log('Server starting...')

            // Graceful shutdown hooks
            const cleanup = async () => {
                console.log('Cleaning up resources...')
                const { prisma } = await import('@/lib/prisma')
                await prisma.$disconnect()
                console.log('Prisma disconnected')
                process.exit(0)
            }

            process.on('SIGTERM', cleanup)
            process.on('SIGINT', cleanup)
        }
    }
}
