import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '7d'

export interface JWTPayload {
    userId: string
    email: string
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
}

export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
        return null
    }
}

export async function createSession(userId: string, expiresInDays: number = 7) {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    const sessionToken = generateToken({ userId, email: '' })

    const session = await prisma.session.create({
        data: {
            userId,
            sessionToken,
            expires: expiresAt,
        },
    })

    return session
}

export async function getSessionUser(sessionToken: string) {
    const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: {
            user: {
                include: {
                    subscription: true,
                },
            },
        },
    })

    if (!session || session.expires < new Date()) {
        return null
    }

    return session.user
}

export async function deleteSession(sessionToken: string) {
    await prisma.session.delete({
        where: { sessionToken },
    })
}

export async function getCurrentUser(request: Request) {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
        return null
    }

    const payload = verifyToken(token)
    if (!payload) {
        return null
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
            subscription: true,
        },
    })

    return user
}
