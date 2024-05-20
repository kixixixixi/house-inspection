import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/db"
import { Prisma, Unit } from "@prisma/client"

export const POST = async (
  request: NextRequest
): Promise<NextResponse<{ unit: Unit }>> => {
  const body: Prisma.UnitCreateInput = await request.json()
  const unit = await prisma.unit.create({
    data: body,
  })
  return NextResponse.json({ unit })
}
