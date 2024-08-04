import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/db"
import { House, Unit, Version } from "@prisma/client"

export const GET = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<
  NextResponse<{ version: Version & { house: House }; units?: Unit[] }>
> => {
  const version = await prisma.version.findUniqueOrThrow({
    where: { id: parseInt(id) },
    include: { house: true },
  })
  const units = await prisma.unit.findMany({
    where: {
      houseId: version.houseId,
      versionId: { lte: version.id },
    },
  })
  return NextResponse.json({ version, units })
}
