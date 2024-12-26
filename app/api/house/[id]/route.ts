import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/db"
import { House, Prisma } from "@prisma/client"
import { authenticate } from "@/lib/authenticate"

export const GET = async (
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ house: House } | { message: string }>> => {
  const params = await props.params

  const user = await authenticate(request)
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  const house = await prisma.house.findUniqueOrThrow({
    where: { id: parseInt(params.id) },
    include: { units: true, versions: true },
  })
  if (house.teamId !== user.teamId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  return NextResponse.json({ house })
}

export const PATCH = async (
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ house: House } | { message: string }>> => {
  const params = await props.params
  const user = await authenticate(request)
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  const house = await prisma.house.findUniqueOrThrow({
    where: { id: parseInt(params.id) },
  })
  if (!house)
    return NextResponse.json({ message: "Not found" }, { status: 404 })
  if (house.teamId !== user.teamId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  const body: Prisma.HouseUpdateInput = await request.json()
  const updatedHouse = await prisma.house.update({
    where: { id: parseInt(params.id) },
    data: body,
    include: { units: true, versions: true },
  })
  return NextResponse.json({ house: updatedHouse })
}

export const DELETE = async (
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ message: string }>> => {
  const params = await props.params
  const user = await authenticate(request)
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  await prisma.house.delete({
    where: { id: parseInt(params.id), teamId: user.teamId },
  })
  return NextResponse.json({ message: "削除しました" })
}
