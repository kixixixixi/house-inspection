"use client"

import { Button } from "components/elements"
import { checkList } from "lib/constant/check-list"
import { ComponentProps, FC, FormEvent, useState } from "react"
import { RankList } from "@/lib/constant/unit"
import { Check, House, Prisma, Unit } from "@prisma/client"
import ky from "ky"
import { useRouter } from "next/navigation"

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

export const UnitForm: FC<
  ComponentProps<"form"> & {
    house: House
    type: string
    floor?: number
    index: number
    name: string
    unit?: Unit & { checks?: Check[] }
  }
> = ({ house, type, floor, index, name, unit }) => {
  const router = useRouter()
  const [createCheckInputList, setCreateCheckInputList] = useState<
    (Omit<Prisma.CheckCreateInput, "unit"> & { id?: number })[]
  >(unit?.checks ?? [])
  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (unit) {
      const body: Prisma.UnitUpdateInput = {
        name,
        checks: {
          upsert: createCheckInputList.map((c) => ({
            where: {
              id: c.id,
              unit_check_unique_key: { checkId: c.checkId, unitId: unit.id },
            },
            create: { checkId: c.checkId, rank: c.rank },
            update: { rank: c.rank },
          })),
        },
      }
      const response = await ky.patch(`/api/unit/${unit.id}`, {
        json: body,
      })
    } else {
      const response = await ky.post(`/api/unit`, {
        json: {
          name,
          type,
          floor,
          index,
          house: { connect: { ...house } },
          checks: {
            create: createCheckInputList,
          },
        },
      })
    }
    router.push(`/house/${house.id}`)
  }
  return (
    <>
      <form onSubmit={handleSave}>
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
                    <select
                      value={
                        createCheckInputList.find((c) => c.checkId == check.id)
                          ?.rank ?? undefined
                      }
                      onChange={({ target: { value } }) => {
                        setCreateCheckInputList([
                          ...createCheckInputList.filter(
                            (c) => c.checkId != check.id
                          ),
                          {
                            id: createCheckInputList.find(
                              (c) => c.checkId == check.id
                            )?.id,
                            checkId: check.id,
                            rank: value,
                          },
                        ])
                      }}
                    >
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
      </form>
    </>
  )
}
