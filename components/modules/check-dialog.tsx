"use client"
import { useState, type ComponentProps, type FC } from "react"
import { Button } from "components/elements"
import Map from "./map"
import { Image } from "@prisma/client"

export const CheckDialog: FC<
  ComponentProps<"div"> & {
    defaultPosition: {
      latitude: number
      longitude: number
    }
    check: PrismaJson.Check
    images?: Image[]
    onChangeCheck: (props: {
      position: { latitude: number; longitude: number }
      check: PrismaJson.Check
    }) => void
    onClose: () => void
  }
> = ({ check, images, defaultPosition, onChangeCheck, onClose, ...props }) => {
  const [position, setPosition] = useState<{
    latitude: number
    longitude: number
  }>({
    latitude: check.latitude ?? defaultPosition.latitude,
    longitude: check.longitude ?? defaultPosition.longitude,
  })
  const [isActiveEditImage, setIsActiveEditImage] = useState<boolean>(false)
  const [editedCheck, setEditedCheck] = useState<PrismaJson.Check>(check)
  return (
    <>
      <div {...props}>
        <dialog
          open={true}
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
          <div
            style={{
              display: "flex",
              flexFlow: "column",
              height: "100%",
              justifyContent: "space-between",
            }}
          >
            <h2>画像</h2>
            <div
              style={{
                display: "flex",
                gap: ".5rem",
                flexWrap: "wrap",
                padding: ".5rem",
              }}
            >
              {editedCheck.imageIds
                ?.map((id) => images?.find((i) => i.id == id))
                .filter((i) => !!i)
                .map((image, i) => (
                  <figure
                    key={i}
                    style={{
                      backgroundImage: `url(${image.base64})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      height: "9rem",
                      width: "12rem",
                    }}
                    onClick={() =>
                      setEditedCheck({
                        ...editedCheck,
                        imageIds: [...(editedCheck.imageIds ?? []), image.id],
                      })
                    }
                  />
                ))}
            </div>
            <div>
              <Button onClick={() => setIsActiveEditImage(!isActiveEditImage)}>
                画像追加
              </Button>
            </div>
            {isActiveEditImage && (
              <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                {images?.map((image, i) => (
                  <figure
                    key={i}
                    style={{
                      backgroundImage: `url(${image.base64})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      height: "3rem",
                      width: "4rem",
                    }}
                    onClick={() =>
                      setEditedCheck({
                        ...editedCheck,
                        imageIds: [
                          ...new Set([
                            ...(editedCheck.imageIds ?? []),
                            image.id,
                          ]),
                        ],
                      })
                    }
                  />
                ))}
              </div>
            )}
            <h2>位置情報</h2>
            <Map
              latitude={position.latitude}
              longitude={position.longitude}
              name={`${check.largeCategory}\n${check.mediumCategory}\n${check.smallCategory}\n${check.part}`}
              onChangePosition={(position) => {
                setPosition({ latitude: position.lat, longitude: position.lng })
              }}
            />

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
                  onChangeCheck({ check: editedCheck, position })
                  onClose()
                }}
              >
                保存
              </Button>
              <Button type="button" onClick={() => onClose()}>
                閉じる
              </Button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}
