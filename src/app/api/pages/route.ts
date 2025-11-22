import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth"
import { createPageSchema } from "@/lib/validators/pages"
import { z } from "zod"

export async function GET(req: NextRequest) {
  try {
    const sessionToken = cookies().get("sessionToken")?.value
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionToken)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const pages = await prisma.linkPage.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { views: true, buttons: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    // Transform data for frontend
    const formattedPages = pages.map(page => ({
      id: page.id,
      username: page.username,
      title: page.title,
      views: page._count.views,
      clicks: 0, // TODO: Aggregate button clicks
      status: page.isActive ? "Active" : "Draft",
      lastUpdated: page.updatedAt.toISOString(), // Frontend will format this
      thumbnail: page.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${page.username}`
    }))

    return NextResponse.json(formattedPages)
  } catch (error) {
    console.error("Error fetching pages:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionToken = cookies().get("sessionToken")?.value
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getSessionUser(sessionToken)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate input
    const validatedData = createPageSchema.parse(body)

    // Check username uniqueness
    const existingPage = await prisma.linkPage.findUnique({
      where: { username: validatedData.username }
    })

    if (existingPage) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 })
    }

    // Create page
    const newPage = await prisma.linkPage.create({
      data: {
        userId: user.id,
        username: validatedData.username,
        title: validatedData.title,
        bio: validatedData.bio,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${validatedData.username}`,
        theme: {
          mode: 'dark',
          primaryColor: '#6366f1', // Indigo-500
          backgroundColor: '#0f172a', // Slate-900
          fontFamily: 'Inter'
        }
      }
    })

    return NextResponse.json(newPage, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating page:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
