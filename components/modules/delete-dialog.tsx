"use client"
import { useState, type ComponentProps, type FC } from "react"
import { Button } from "components/elements"

export const DeleteDialog: FC<ComponentProps<"div">> = ({ ...props }) => {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false)

  return (
    <>
      <div {...props}>
        <Button onClick={() => setIsOpenDeleteDialog(true)}>削除</Button>
        <dialog
          open={isOpenDeleteDialog}
          style={{
            border: "none",
            boxShadow: "0 0 0 100vmax rgba(0, 0, 0, 0.3)",
            blockSize: "12rem",
            inlineSize: "min(42rem, 90vw)",
            inset: 0,
            margin: "auto",
            padding: "2rem",
            placeContent: "center",
          }}
        >
          <h3
            style={{
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            削除しますか？
          </h3>
          <div
            style={{
              display: "flex",
              gap: ".5rem",
              justifyContent: "center",
            }}
          >
            <Button>削除</Button>
            <Button onClick={() => setIsOpenDeleteDialog(false)}>
              キャンセル
            </Button>
          </div>
        </dialog>
      </div>
    </>
  )
}
