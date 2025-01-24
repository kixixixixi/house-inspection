import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/db"
import { Prisma, Image } from "@prisma/client"

export const POST = async (
  request: NextRequest
): Promise<NextResponse<{ image: Image }>> => {
  const body: Prisma.ImageCreateInput = await request.json()
  const {
    base64,
    latitude,
    longitude,
    unit: { connect: unitConnect },
  } = body
  if (!unitConnect || !unitConnect.id) throw "Unit is not found"
  const image = await prisma.image.create({
    data: {
      base64,
      latitude,
      longitude,
      unit: { connect: { id: unitConnect.id } },
    },
  })
  return NextResponse.json({ image })
}
