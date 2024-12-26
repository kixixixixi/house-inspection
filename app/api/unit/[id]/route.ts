import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/db"
import { Prisma, Unit } from "@prisma/client"

export const PATCH = async (
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ unit: Unit }>> => {
  const params = await props.params

  const { id } = params

  const body: Prisma.UnitUpdateInput = await request.json()
  const unit = await prisma.unit.update({
    where: { id: parseInt(id) },
    data: { ...body, house: { update: { updatedAt: new Date() } } },
  })
  return NextResponse.json({ unit })
}

export const DELETE = async (
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ message: string }>> => {
  const params = await props.params
  const unit = await prisma.unit.delete({ where: { id: parseInt(params.id) } })
  await prisma.house.update({
    where: { id: unit.houseId },
    data: { updatedAt: new Date() },
  })
  return NextResponse.json({ message: "削除しました" })
}
