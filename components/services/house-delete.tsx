"use client"

import { type ComponentProps, type FC } from "react"
import { useRouter } from "next/navigation"
import { DeleteDialog } from "../modules/delete-dialog"
import ky from "ky"

export const HouseDelete: FC<ComponentProps<"div"> & { houseId: number }> = ({
  houseId,
  ...props
}) => {
  const router = useRouter()
  return (
    <DeleteDialog
      {...props}
      onSubmit={async () => {
        const response = await ky.delete(`/api/house/${houseId}`)
        router.push("/")
      }}
    />
  )
}
