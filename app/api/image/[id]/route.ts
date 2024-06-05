import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/db"
import { Prisma, Image } from "@prisma/client"

export const PATCH = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<NextResponse<{ image: Image }>> => {
  const body: Prisma.ImageUpdateInput = await request.json()
  const image = await prisma.image.update({
    where: { id: parseInt(id) },
    data: {
      ...body,
    },
  })
  return NextResponse.json({ image })
}

export const DELETE = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<NextResponse<{ message: string }>> => {
  await prisma.image.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ message: "削除しました" })
}
