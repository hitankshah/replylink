import { z } from "zod"

export const createPageSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be less than 30 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username must only contain letters, numbers, underscores, and dashes"),
    title: z.string().min(1, "Title is required").max(50, "Title must be less than 50 characters"),
    bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
})

export const updatePageSchema = z.object({
    title: z.string().min(1).max(50).optional(),
    bio: z.string().max(160).optional(),
    avatar: z.string().url().optional(),
    theme: z.any().optional(),
    isActive: z.boolean().optional(),
    customDomain: z.string().optional(),
})
