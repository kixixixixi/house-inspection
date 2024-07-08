"use client"
import { useState, type ComponentProps, type FC } from "react"
import { Button, Input } from "components/elements"
import ky from "ky"
import { Image } from "@prisma/client"
import Map from "./map"

export const ImageDialog: FC<
  ComponentProps<"div"> & {
    image: {
      id?: number
      base64: string
      comment?: string | null
      latitude: number
      longitude: number
    }
    onDelete: () => Promise<void>
  }
> = ({ image, onDelete, ...props }) => {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
  const [comment, setComment] = useState<string>(image.comment ?? "")
  const [position, setPosition] = useState<{
    latitude: number
    longitude: number
  }>({ ...image })
  return (
    <>
      <div {...props}>
        <figure
          style={{
            backgroundImage: `url(${image.base64})`,
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            height: "8rem",
            width: "8rem",
          }}
          onClick={() => setIsOpenDialog(true)}
        ></figure>
        {isOpenDialog && (
          <dialog
            open={isOpenDialog}
            style={{
              border: "none",
              boxShadow: "0 0 0 100vmax rgba(0, 0, 0, 0.3)",
              blockSize: "min(42rem, 80vh)",
              inlineSize: "min(42rem, 90vw)",
              inset: 0,
              margin: "auto",
              overflow: "scroll",
              padding: "1rem",
              placeContent: "center",
            }}
          >
            <figure
              style={{
                backgroundImage: `url(${image.base64})`,
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                height: "80%",
                width: "100%",
              }}
            ></figure>
            <Map
              latitude={image.latitude}
              longitude={image.longitude}
              name={comment}
              onChangePosition={(position) => {
                setPosition({ latitude: position.lat, longitude: position.lng })
              }}
            />
            <div style={{ padding: ".5rem" }}>
              <Input
                placeholder="コメント"
                style={{ width: "100%" }}
                value={comment}
                onChange={({ target: { value } }) => setComment(value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: ".5rem",
                justifyContent: "center",
              }}
            >
              <Button
                type="button"
                onClick={async () => {
                  if (image.id) await ky.delete(`/api/image/${image.id}`)
                  await onDelete()
                }}
              >
                削除
              </Button>
              {image.id && (
                <Button
                  type="button"
                  onClick={async () => {
                    if (image.id) {
                      const response = await ky.patch(
                        `/api/image/${image.id}`,
                        {
                          json: { comment, ...position },
                        }
                      )
                      await response.json<{ image: Image }>()
                      setIsOpenDialog(false)
                    }
                  }}
                >
                  更新
                </Button>
              )}
              <Button type="button" onClick={() => setIsOpenDialog(false)}>
                閉じる
              </Button>
            </div>
          </dialog>
        )}
      </div>
    </>
  )
}
