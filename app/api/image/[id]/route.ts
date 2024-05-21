import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/db"

export const DELETE = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<NextResponse<{ message: string }>> => {
  await prisma.image.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ message: "削除しました" })
}
