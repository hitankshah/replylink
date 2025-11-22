import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = {
  title: 'Admin Panel | ReplyLink',
  description: 'ReplyLink admin dashboard',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    // Get authorization header
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      redirect('/login')
    }

    // Verify token
    const payload = verifyToken(token)
    if (!payload) {
      redirect('/login')
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      redirect('/login')
    }

    // Check if user is admin (role field or test bypass)
    const isAdmin = user.role === 'ADMIN' || user.email === 'admin@replylink.local'

    if (!isAdmin) {
      redirect('/dashboard')
    }

    return (
      <div className="min-h-screen bg-slate-900">
        <div className="flex h-screen">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="bg-slate-50 dark:bg-slate-950 p-8">{children}</div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Admin layout error:', error)
    redirect('/login')
  }
}
