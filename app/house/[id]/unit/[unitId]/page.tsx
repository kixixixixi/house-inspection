import { NextPage } from "next"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { UnitForm } from "@/components/forms/unit-form"
import { UnitDelete } from "@/components/services/unit-delete"
import { Button } from "@/components/elements"

const HouseIdUnitPage: NextPage<{
  params: Promise<{ id: string; unitId: string }>
}> = async (props) => {
  const params = await props.params

  const { id, unitId } = params

  const unit = await prisma.unit.findUniqueOrThrow({
    where: { id: parseInt(unitId) },
    include: { house: true, images: true },
  })
  const handleDownload = async () => {
    if (!unit.checkList) return
    const csv = [
      ["大項目", "中項目", "小項目", "各部位", "部所", "ランク"].join(","),
      ...unit.checkList.map((row) =>
        [
          row.largeCategory,
          row.mediumCategory,
          row.smallCategory,
          row.part,
          row.detail,
          row.rank,
        ].join(",")
      ),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${unit.name}-チェックリスト.csv`)
    link.click()
  }
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
        <div>
          <Button onClick={handleDownload}>ダウンロード</Button>
        </div>
      </section>
    </>
  )
}

export default HouseIdUnitPage
