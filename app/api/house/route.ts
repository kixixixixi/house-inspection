import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/db"
import { Prisma } from "@prisma/client"
import { fetchAltitude } from "@/lib/request"
import { authenticate } from "@/lib/authenticate"

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const user = await authenticate(request)
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  const houseList = await prisma.house.findMany({
    where: { teamId: user.teamId },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json({
    houseList,
  })
}

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const user = await authenticate(request)
  if (!user || !user.teamId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  const body: Prisma.HouseCreateInput = await request.json()
  const altitude = (await fetchAltitude({ ...body })) ?? 0
  const house = await prisma.house.create({
    data: {
      ...body,
      altitude,
      uid: `${Math.floor(body.latitude)}${
        body.latitude.toPrecision(8).split(".")[1]
      }${Math.floor(body.longitude)}${
        body.longitude.toPrecision(9).split(".")[1]
      }${("000" + Math.floor(altitude)).slice(-4)}${(
        altitude.toPrecision(6) + "00"
      )
        .split(".")[1]
        .slice(0, 2)}`,
      team: { connect: { id: user.teamId } },
    },
  })
  const version = await prisma.version.create({
    data: {
      code: `${Date.now()}`,
      reason: "作成",
      house: { connect: { id: house.id } },
    },
  })
  return NextResponse.json({
    house,
  })
}
