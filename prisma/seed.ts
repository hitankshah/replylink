import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  
  try {
    const admin = await prisma.user.create({
      data: {
        id: 'admin-user-001',
        email: 'admin@replylink.local',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
        subscription: {
          create: {
            plan: 'ENTERPRISE',
            status: 'active',
            gatewayId: 'seed-gateway-001',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          },
        },
      },
    })

    console.log('✅ Admin user created:')
    console.log(`   Email: ${admin.email}`)
    console.log(`   Password: admin123`)
    console.log(`   Role: ADMIN`)
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('⚠️  Admin user already exists')
    } else {
      throw error
    }
  }

  console.log('✨ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
