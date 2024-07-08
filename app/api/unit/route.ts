import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/db"
import { Prisma, Unit } from "@prisma/client"

export const POST = async (
  request: NextRequest
): Promise<NextResponse<{ unit: Unit }>> => {
  const body: Prisma.UnitCreateInput & { version: { reason: string } } =
    await request.json()
  const { version, ...unitBody } = body
  const houseId = unitBody.house.connect?.id
  if (!houseId) throw "House is not found"
  const newVersion = await prisma.version.create({
    data: {
      code: `${Date.now()}`,
      reason: version.reason,
      house: { connect: { id: houseId } },
    },
  })
  const unit = await prisma.unit.create({
    data: { ...unitBody, versionId: newVersion.id },
  })
  if (body.house.connect?.id) {
    await prisma.house.update({
      where: { id: body.house.connect.id },
      data: { updatedAt: new Date() },
    })
  }
  return NextResponse.json({ unit })
}
