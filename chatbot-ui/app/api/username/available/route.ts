import { api } from "@/lib/api/client"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { username } = json as {
    username: string
  }

  try {
    const usernames = await api.get(
      `/v1/profiles?username=${encodeURIComponent(username)}&select=username`
    )

    return new Response(JSON.stringify({ isAvailable: !usernames.length }), {
      status: 200
    })
  } catch (error: any) {
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
