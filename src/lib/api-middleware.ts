import { NextResponse } from "next/server"
import { z } from "zod"

export async function validateRequest<T>(
    req: Request,
    schema: z.Schema<T>
): Promise<{ data: T | null; error: NextResponse | null }> {
    try {
        const json = await req.json()
        const result = schema.safeParse(json)

        if (!result.success) {
            return {
                data: null,
                error: NextResponse.json(
                    { error: "Validation Error", details: result.error.flatten() },
                    { status: 400 }
                ),
            }
        }

        return { data: result.data, error: null }
    } catch (error) {
        return {
            data: null,
            error: NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 }
            ),
        }
    }
}
