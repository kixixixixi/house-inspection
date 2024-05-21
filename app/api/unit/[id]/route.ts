import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/db"
import { Prisma, Unit } from "@prisma/client"

export const PATCH = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<NextResponse<{ unit: Unit }>> => {
  const body: Prisma.UnitUpdateInput = await request.json()
  const unit = await prisma.unit.update({
    where: { id: parseInt(id) },
    data: body,
  })
  return NextResponse.json({ unit })
}

export const DELETE = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<NextResponse<{ message: string }>> => {
  await prisma.unit.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ message: "削除しました" })
}
