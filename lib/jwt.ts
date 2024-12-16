import { JwtPayload, verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

export const verifyJwt = (token: string) => {
  try {
    const decoded = verify(token, JWT_SECRET!) as JwtPayload
    return decoded
  } catch (e: unknown) {
    console.error(e)
  }
}
