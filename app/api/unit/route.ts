import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/db"
import { Prisma, Unit } from "@prisma/client"

export const POST = async (
  request: NextRequest
): Promise<NextResponse<{ unit: Unit }>> => {
  const body: Prisma.UnitCreateInput = await request.json()
  const unit = await prisma.unit.create({
    data: { ...body },
  })
  if (body.house.connect?.id) {
    await prisma.house.update({
      where: { id: body.house.connect.id },
      data: { updatedAt: new Date() },
    })
  }
  return NextResponse.json({ unit })
}
