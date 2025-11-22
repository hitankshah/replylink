import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { isWorkspaceAdmin } from '@/lib/middleware/workspace'
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
  // Get current session
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Check if user is admin
  // Note: For global admin, we check against a system admin flag
  // For workspace admin, we check workspace membership
  const user = session.user as any
  const isGlobalAdmin = user.role === 'ADMIN' // Assuming user model has role field
  const workspaceId = user.workspaceId // Get workspace from session

  if (!isGlobalAdmin) {
    // Check if user is admin of their workspace
    if (workspaceId) {
      const isAdmin = await isWorkspaceAdmin(workspaceId, user.id)
      if (!isAdmin) {
        redirect('/dashboard')
      }
    } else {
      redirect('/dashboard')
    }
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
}
