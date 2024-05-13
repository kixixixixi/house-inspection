import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/db"

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const houseList = await prisma.house.findMany()
  return NextResponse.json({
    houseList,
  })
}

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const body = await request.json()
  const house = await prisma.house.create({
    data: {
      ...body,
    },
  })
  return NextResponse.json({
    house,
  })
}
