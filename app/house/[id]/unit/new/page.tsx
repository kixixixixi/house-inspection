import { NextPage } from "next"
import { prisma } from "lib/db"
import Link from "next/link"
import { OuteriorUnits, UnitType, UnitTypes } from "@/lib/constant/unit"
import { UnitForm } from "@/components/forms/unit-form"

const HouseIdUnitNewPage: NextPage<{
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}> = async (props) => {
  const searchParams = await props.searchParams
  const params = await props.params

  const { id } = params

  const { type, floor, index } = searchParams

  if (
    !type ||
    typeof type !== "string" ||
    !UnitTypes.includes(type as UnitType)
  )
    throw "Type error"

  if (!floor || typeof floor !== "string" || parseInt(floor) < 0)
    throw "Floor Error"

  if (!index || typeof index !== "string" || parseInt(index) < 0)
    throw "Index Error"
  const house = await prisma.house.findUniqueOrThrow({
    where: { id: parseInt(id) },
  })

  const name =
    type == "outerior"
      ? OuteriorUnits.find((u) => u.index == parseInt(index))?.name
      : type == "room"
      ? `部屋 ${index}`
      : `階段 ${index}`
  return (
    <>
      <section
        style={{
          padding: ".5rem",
        }}
      >
        <hgroup>
          <p>
            <Link href={`/house/${house.id}`}>{house.name}</Link>
          </p>
          <h1>{name}</h1>
        </hgroup>
        <UnitForm
          type={type}
          floor={parseInt(floor)}
          index={parseInt(index)}
          house={house}
          name={name ?? "未設定"}
        />
      </section>
    </>
  )
}

export default HouseIdUnitNewPage
