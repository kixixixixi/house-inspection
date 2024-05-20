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
