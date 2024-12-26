import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/db"
import { House, Unit, Version } from "@prisma/client"

export const GET = async (request: NextRequest, props: { params: Promise<{ id: string }> }): Promise<
  NextResponse<{ version: Version & { house: House }; units?: Unit[] }>
> => {
  const params = await props.params;

  const {
    id
  } = params;

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
