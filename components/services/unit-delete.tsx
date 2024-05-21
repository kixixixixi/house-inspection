"use client"

import { type ComponentProps, type FC } from "react"
import { useRouter } from "next/navigation"
import { DeleteDialog } from "../modules/delete-dialog"
import ky from "ky"

export const UnitDelete: FC<
  ComponentProps<"div"> & { unitId: number; houseId?: number }
> = ({ unitId, houseId, ...props }) => {
  const router = useRouter()
  return (
    <DeleteDialog
      {...props}
      onSubmit={async () => {
        const response = await ky.delete(`/api/unit/${unitId}`)
        if (houseId) {
          router.push(`/house/${houseId}`)
        } else {
          router.push("/")
        }
      }}
    />
  )
}
