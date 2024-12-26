import { NextRequest, NextResponse } from "next/server"
import { authenticate } from "@/lib/authenticate"
import { User } from "@prisma/client"

export const GET = async (
  request: NextRequest
): Promise<NextResponse<{ user: User } | { message: string }>> => {
  const user = await authenticate(request)
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  return NextResponse.json({
    user,
  })
}
