import { NextPage } from "next"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { UnitForm } from "@/components/forms/unit-form"

const HouseIdUnitPage: NextPage<{
  params: { id: string; unitId: string }
}> = async ({ params: { id, unitId } }) => {
  const unit = await prisma.unit.findUniqueOrThrow({
    where: { id: parseInt(unitId) },
    include: { house: true, checks: true, images: true },
  })
  return (
    <>
      <section
        style={{
          padding: ".5rem",
        }}
      >
        <hgroup>
          <p>
            <Link href={`/house/${unit.house.id}`}>{unit.house.name}</Link>
          </p>
          <h1>{unit.name}</h1>
        </hgroup>
        <UnitForm
          house={unit.house}
          type={unit.type}
          floor={unit.floor}
          index={unit.index}
          name={unit.name}
          unit={unit}
        />
      </section>
    </>
  )
}

export default HouseIdUnitPage
