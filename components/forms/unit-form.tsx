"use client"

import { Button, MultiLineInput, SmallInput } from "components/elements"
import { defaultCheckList } from "lib/constant/check-list"
import {
  ComponentProps,
  FC,
  FormEvent,
  useEffect,
  useState,
  Fragment,
} from "react"
import { RankList } from "@/lib/constant/unit"
import { House, Prisma, Unit, Image } from "@prisma/client"
import { useRouter } from "next/navigation"
import { InputFileButton } from "../elements/form"
import { resizeImage } from "@/lib/file"
import { ImageDialog } from "../modules/image-dialog"
import { generateIdFromCheck } from "@/lib/text"
import { CheckDialog } from "../modules/check-dialog"
import { api } from "@/lib/api"

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
    unit?: Unit & { images?: Image[] }
  }
> = ({ house, type, floor, index, name, unit }) => {
  const router = useRouter()
  const [checkInputList, setCheckInputList] = useState<PrismaJson.Check[]>([])
  const [comment, setComment] = useState<string>(unit?.comment ?? "")
  const [editedCheck, setEditedCheck] = useState<PrismaJson.Check>()
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
    const newCheckList = checkInputList.map((c) => ({
      ...c,
      id: generateIdFromCheck(c),
    }))
    if (
      [...new Set(newCheckList.map((c) => c.id))].length != newCheckList.length
    ) {
      alert("重複した項目があります")
      return
    }
    if (unit) {
      const body: Prisma.UnitUpdateInput = {
        name,
        comment,
        checkList: newCheckList,
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
      const response = await (
        await api()
      ).patch(`/api/unit/${unit.id}`, {
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
        checkList: newCheckList,
        images: {
          create: images,
        },
      }
      const response = await (
        await api()
      ).post(`/api/unit`, {
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

  useEffect(() => {
    setCheckInputList(
      unit?.checkList ?? house.checkListTemplate ?? defaultCheckList ?? []
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit])
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
              {(checkInputList ?? []).map((check, checkIndex) => (
                <Fragment key={check.id}>
                  <tr
                    key={check.id}
                    style={{
                      borderBottom: "solid 1px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <CheckListTD>
                      <SmallInput
                        value={check.largeCategory}
                        onChange={({ target: { value } }) => {
                          setCheckInputList([
                            ...checkInputList.map((c) =>
                              c.id == check.id && checkIndex == checkIndex
                                ? { ...c, largeCategory: value }
                                : c
                            ),
                          ])
                        }}
                      />
                    </CheckListTD>
                    <CheckListTD>
                      <SmallInput
                        value={check.mediumCategory}
                        onChange={({ target: { value } }) => {
                          setCheckInputList([
                            ...checkInputList.map((c, i) =>
                              c.id == check.id && i == checkIndex
                                ? { ...c, mediumCategory: value }
                                : c
                            ),
                          ])
                        }}
                      />
                    </CheckListTD>
                    <CheckListTD>
                      <SmallInput
                        value={check.smallCategory}
                        onChange={({ target: { value } }) => {
                          setCheckInputList([
                            ...checkInputList.map((c, i) =>
                              c.id == check.id && i == checkIndex
                                ? { ...c, smallCategory: value }
                                : c
                            ),
                          ])
                        }}
                      />
                    </CheckListTD>
                    <CheckListTD>
                      <SmallInput
                        value={check.part}
                        onChange={({ target: { value } }) => {
                          setCheckInputList([
                            ...checkInputList.map((c, i) =>
                              c.id == check.id && i == checkIndex
                                ? { ...c, part: value }
                                : c
                            ),
                          ])
                        }}
                      />
                    </CheckListTD>
                    <CheckListTD>
                      <SmallInput
                        value={check.detail}
                        onChange={({ target: { value } }) => {
                          setCheckInputList([
                            ...checkInputList.map((c, i) =>
                              c.id == check.id && i == checkIndex
                                ? { ...c, detail: value }
                                : c
                            ),
                          ])
                        }}
                      />
                    </CheckListTD>
                    <CheckListTD>
                      <select
                        value={check.rank}
                        onChange={({ target: { value } }) => {
                          setCheckInputList([
                            ...checkInputList.map((c, i) =>
                              c.id == check.id && i == checkIndex
                                ? { ...c, rank: value }
                                : c
                            ),
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
                    <CheckListTD>
                      <p
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => setEditedCheck(check)}
                      >
                        &#x1f4cd;
                      </p>
                    </CheckListTD>
                    <CheckListTD>
                      <p
                        style={{
                          color: "#277",
                          cursor: "pointer",
                          fontWeight: "bolder",
                        }}
                        onClick={() =>
                          setCheckInputList([
                            ...checkInputList.slice(0, checkIndex + 1),
                            {
                              ...check,
                              id: generateIdFromCheck({
                                ...check,
                              }),
                              rank: undefined,
                              imageIds: undefined,
                            },
                            ...checkInputList.slice(checkIndex + 1),
                          ])
                        }
                      >
                        &#043;
                      </p>
                    </CheckListTD>
                  </tr>
                  <tr>
                    <td colSpan={7}>
                      <div
                        style={{
                          display: "flex",
                          gap: ".5rem",
                        }}
                      >
                        {check.imageIds
                          ?.map((id) => images.find((i) => i.id == id))
                          .map((image) => (
                            <img
                              src={image?.base64}
                              key={image?.id}
                              style={{ height: "2rem" }}
                            />
                          ))}
                      </div>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </form>
      {editedCheck && (
        <CheckDialog
          check={editedCheck}
          images={unit?.images}
          defaultPosition={{ ...house }}
          onChangeCheck={({ position, check }) => {
            setCheckInputList([
              ...checkInputList.map((c) =>
                c.id == check.id ? { ...c, ...position } : c
              ),
            ])
            setCheckInputList(
              checkInputList.map((c) => (c.id == check.id ? check : c))
            )
          }}
          onClose={() => setEditedCheck(undefined)}
        />
      )}
    </>
  )
}
