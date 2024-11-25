import { NextPage } from "next"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { UnitForm } from "@/components/forms/unit-form"
import { UnitDelete } from "@/components/services/unit-delete"

const HouseIdUnitPage: NextPage<{
  params: { id: string; unitId: string }
}> = async ({ params: { id, unitId } }) => {
  const unit = await prisma.unit.findUniqueOrThrow({
    where: { id: parseInt(unitId) },
    include: { house: true, images: true },
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
        <div style={{ padding: ".5rem" }}>
          <UnitDelete unitId={unit.id} houseId={unit.houseId} />
        </div>
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
