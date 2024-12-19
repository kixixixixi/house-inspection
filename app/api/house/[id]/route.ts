import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/db"
import { House, Prisma } from "@prisma/client"

export const GET = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<NextResponse<{ house: House }>> => {
  const house = await prisma.house.findUniqueOrThrow({
    where: { id: parseInt(id) },
    include: { units: true, versions: true },
  })
  return NextResponse.json({ house })
}

export const PATCH = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<NextResponse<{ house: House } | { message: string }>> => {
  const house = await prisma.house.findUniqueOrThrow({
    where: { id: parseInt(id) },
  })
  if (!house)
    return NextResponse.json({ message: "Not found" }, { status: 404 })
  const body: Prisma.HouseUpdateInput = await request.json()
  const updatedHouse = await prisma.house.update({
    where: { id: parseInt(id) },
    data: body,
    include: { units: true, versions: true },
  })
  return NextResponse.json({ house: updatedHouse })
}

export const DELETE = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<NextResponse<{ message: string }>> => {
  await prisma.house.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ message: "削除しました" })
}
