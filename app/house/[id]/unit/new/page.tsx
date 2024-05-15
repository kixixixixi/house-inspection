import { NextPage } from "next"
import { useSearchParams } from "next/navigation"
import { prisma } from "lib/db"
import { Button } from "components/elements"
import { checkList } from "lib/constant/check-list"
import { ComponentProps, FC } from "react"
import Link from "next/link"

const UnitTypes = ["outerior", "room", "step"] as const
type UnitType = (typeof UnitTypes)[number]
const OuteriorUnits = [
  {
    index: 1,
    name: "屋根",
  },
  {
    index: 2,
    name: "外壁南面",
  },
  { index: 3, name: "外壁北面" },
  { index: 4, name: "東妻面" },
  { index: 5, name: "西妻面" },
  { index: 6, name: "塗装・設備・外構" },
] as const

const RankList = ["A", "B", "C", "D1", "D2"] as const

export const CheckListTD: FC<ComponentProps<"td">> = ({ style, ...props }) => (
  <td
    style={{
      fontSize: ".9rem",
      padding: ".25rem",
      textWrap: "nowrap",
      ...style,
    }}
    {...props}
  ></td>
)

const HouseIdUnitNewPage: NextPage<{
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}> = async ({ params: { id }, searchParams }) => {
  const { type, floor, index } = searchParams

  if (
    !type ||
    typeof type !== "string" ||
    !UnitTypes.includes(type as UnitType)
  )
    throw "Type error"

  if (
    type !== "outerior" &&
    (!floor || typeof floor !== "string" || parseInt(floor) < 0)
  )
    throw "Floor Error"

  if (!index || typeof index !== "string" || parseInt(index) < 0)
    throw "Index Error"
  const house = await prisma.house.findUniqueOrThrow({
    where: { id: parseInt(id) },
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
            <Link href={`/house/${house.id}`}>{house.name}</Link>
          </p>
          <h1>
            {type == "outerior"
              ? OuteriorUnits.find((u) => u.index == parseInt(index))?.name
              : type == "room"
              ? `部屋 ${floor}階 ${index}`
              : `階段 ${floor}階 ${index}`}
          </h1>
        </hgroup>
        <div
          style={{
            padding: ".5rem",
          }}
        >
          <Button>保存</Button>
        </div>
        <div
          style={{
            overflowX: "scroll",
          }}
        >
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <thead>
              <tr>
                <td>大項目</td>
                <td>中項目</td>
                <td>小項目</td>
                <td>各部位</td>
                <td>部所</td>
                <td>ランク</td>
              </tr>
            </thead>
            <tbody>
              {checkList.map((check) => (
                <tr
                  key={check.id}
                  style={{
                    borderBottom: "solid 1px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CheckListTD>{check.largeCategory}</CheckListTD>
                  <CheckListTD>{check.mediumCategory}</CheckListTD>
                  <CheckListTD>{check.smallCategory}</CheckListTD>
                  <CheckListTD>{check.part}</CheckListTD>
                  <CheckListTD>{check.detail}</CheckListTD>
                  <CheckListTD>
                    <select>
                      <option />
                      {RankList.map((rank) => (
                        <option key={rank} value={rank}>
                          {rank}
                        </option>
                      ))}
                    </select>
                  </CheckListTD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default HouseIdUnitNewPage
