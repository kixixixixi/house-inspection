import { verifyJwt } from "./jwt"
import { prisma } from "lib/db"
import type { NextRequest } from "next/server"

export const authenticate = async (request: NextRequest) => {
  const token = request.headers.get("Authorization")
  if (!token) return

  const decoded = verifyJwt(token)
  if (!decoded) return

  const { sub } = decoded
  if (!sub) return

  const user = await prisma.user.findUnique({
    where: { authId: sub },
  })
  if (!user) return

  return user
}
