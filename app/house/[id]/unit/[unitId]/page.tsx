import { useSearchParams } from "next/navigation"

import { NextPage } from "next"
import { prisma } from "@/lib/db"
import { Button } from "@/components/elements"

const UnitTypes = ["outerior", "room", "step"] as const

const HouseIdUnitPage: NextPage<{
  params: { id: string; unitId: string }
}> = async ({ params: { id, unitId } }) => {
  const house = await prisma.house.findUniqueOrThrow({
    where: { id: parseInt(id) },
  })
  return (
    <>
      <section></section>
    </>
  )
}

export default HouseIdUnitPage
