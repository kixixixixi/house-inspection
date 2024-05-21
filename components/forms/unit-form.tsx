"use client"

import { Button, Input } from "components/elements"
import { checkList } from "lib/constant/check-list"
import { ComponentProps, FC, FormEvent, useState } from "react"
import { RankList } from "@/lib/constant/unit"
import { Check, House, Prisma, Unit, Image } from "@prisma/client"
import ky from "ky"
import { useRouter } from "next/navigation"
import { InputFileButton } from "../elements/form"
import { resizeImage } from "@/lib/file"

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
    floor: number
    index: number
    name: string
    unit?: Unit & { checks?: Check[]; images?: Image[] }
  }
> = ({ house, type, floor, index, name, unit }) => {
  const router = useRouter()
  const [createCheckInputList, setCreateCheckInputList] = useState<
    (Omit<Prisma.CheckCreateInput, "unit"> & { id?: number })[]
  >(unit?.checks ?? [])
  const [comment, setComment] = useState<string>(unit?.comment ?? "")
  const [images, setImages] = useState<
    { id?: number; base64: string; comment?: string | null }[]
  >(unit?.images ?? [])
  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (unit) {
      const body: Prisma.UnitUpdateInput = {
        name,
        comment,
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
        images: {
          create: images.filter((image) => !image.id),
          update: images
            .filter((image) => image.id)
            .map((image) => ({
              where: { id: image.id },
              data: { comment: image.comment },
            })),
        },
      }
      const response = await ky.patch(`/api/unit/${unit.id}`, {
        json: body,
      })
    } else {
      const body: Prisma.UnitCreateInput = {
        name,
        type,
        floor,
        index,
        house: { connect: { id: house.id } },
        comment,
        checks: {
          create: createCheckInputList,
        },
        images: {
          create: images,
        },
      }
      const response = await ky.post(`/api/unit`, {
        json: body,
      })
    }
    router.push(`/house/${house.id}`)
  }
  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    const base64 = await resizeImage(file, { type: true })
    if (!base64) return
    setImages([...images, { base64, comment: "" }])
  }
  return (
    <>
      <form onSubmit={handleSave}>
        <div
          style={{
            display: "flex",
            gap: ".5rem",
            padding: ".5rem",
          }}
        >
          <Input
            placeholder="メモ"
            value={comment}
            onChange={({ target: { value } }) => setComment(value)}
          />
          <Button>保存</Button>
        </div>
        <div
          style={{
            alignItems: "end",
            display: "flex",
            gap: ".5rem",
            padding: ".5rem",
          }}
        >
          {images.map((image, i) => (
            <div key={i}>
              <figure
                style={{
                  backgroundImage: `url(${image.base64})`,
                  backgroundSize: "contain",
                  height: "8rem",
                  width: "8rem",
                }}
              ></figure>
            </div>
          ))}
          <InputFileButton
            onFileChange={handleChangeFile}
            inputProps={{ accept: "image/png,image/jpeg,image/gif" }}
          >
            画像追加
          </InputFileButton>
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
