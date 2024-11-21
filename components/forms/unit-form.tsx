"use client"

import { Button, Input, MultiLineInput } from "components/elements"
import { defaultCheckList } from "lib/constant/check-list"
import { ComponentProps, FC, FormEvent, useState } from "react"
import { RankList } from "@/lib/constant/unit"
import { Check, House, Prisma, Unit, Image } from "@prisma/client"
import ky from "ky"
import { useRouter } from "next/navigation"
import { InputFileButton } from "../elements/form"
import { resizeImage } from "@/lib/file"
import { ImageDialog } from "../modules/image-dialog"

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
    {
      id?: number
      base64: string
      comment?: string | null
      latitude: number
      longitude: number
    }[]
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
      const body: Omit<Prisma.UnitCreateInput, "versionId"> = {
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
        json: { ...body, version: { reason: "ユニット追加" } },
      })
    }
    router.push(`/house/${house.id}`)
  }
  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    const base64 = await resizeImage(file, { type: true })
    if (!base64) return
    setImages([
      ...images,
      {
        base64,
        comment: "",
        latitude: house.latitude,
        longitude: house.longitude,
      },
    ])
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
          <MultiLineInput
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
              <ImageDialog
                image={image}
                onDelete={async () => {
                  setImages(images.filter((i) => i.base64 !== image.base64))
                }}
                onChange={(props) => {
                  setImages(
                    images.map((i) =>
                      i.base64 == image.base64 ? { ...i, ...props } : i
                    )
                  )
                }}
              />
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
              {defaultCheckList.map((check) => (
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
