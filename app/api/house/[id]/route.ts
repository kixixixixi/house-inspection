import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/db"
import { House } from "@prisma/client"

export const GET = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<NextResponse<{ house: House }>> => {
  const house = await prisma.house.findUniqueOrThrow({
    where: { id: parseInt(id) },
    include: { units: true },
  })
  return NextResponse.json({ house })
}

export const DELETE = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<NextResponse<{ message: string }>> => {
  await prisma.house.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ message: "削除しました" })
}
