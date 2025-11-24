import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ButtonLink } from "@/components/pages/PublicButtonLink"

interface PageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: PageProps) {
  const page = await prisma.linkPage.findUnique({
    where: { username: params.username },
  })

  if (!page) {
    return {
      title: "Page Not Found",
    }
  }

  return {
    title: page.title,
    description: page.bio,
    openGraph: {
      title: page.title,
      description: page.bio,
      type: "website",
    },
  }
}

export default async function PublicLinkPage({ params }: PageProps) {
  // Fetch page with buttons
  const page = await prisma.linkPage.findUnique({
    where: { username: params.username },
    include: {
      buttons: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!page || !page.isActive) {
    notFound()
  }

  // Track page view
  const clientIp =
    process.env.NODE_ENV === "production"
      ? "unknown" // Would come from headers in production
      : "localhost"

  await prisma.pageView.create({
    data: {
      pageId: page.id,
      ipAddress: clientIp,
      userAgent: "server-side",
    },
  })

  // Update monthly usage
  const now = new Date()
  await prisma.monthlyUsage.upsert({
    where: {
      userId_year_month: {
        userId: page.userId,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      },
    },
    create: {
      userId: page.userId,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      pageViews: 1,
    },
    update: {
      pageViews: {
        increment: 1,
      },
    },
  })

  const theme = (page.theme as any) || {
    backgroundColor: "#1f2937",
    textColor: "#ffffff",
    buttonColor: "#3b82f6",
    buttonTextColor: "#ffffff",
    fontSize: "16px",
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: theme.backgroundColor as string,
        color: theme.textColor as string,
        fontSize: theme.fontSize as string,
      }}
    >
      <div className="w-full max-w-md text-center space-y-6">
        {/* Avatar */}
        {page.avatar && (
          <img
            src={page.avatar}
            alt={page.title}
            className="w-24 h-24 rounded-full mx-auto object-cover"
          />
        )}

        {/* Title and Bio */}
        <div>
          <h1 className="text-3xl font-bold">{page.title}</h1>
          {page.bio && (
            <p className="mt-3 opacity-80">{page.bio}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {page.buttons.map((button) => (
            <ButtonLink key={button.id} button={button} theme={theme} />
          ))}
        </div>

        {page.buttons.length === 0 && (
          <p className="opacity-60">No links available yet</p>
        )}
      </div>
    </div>
  )
}
