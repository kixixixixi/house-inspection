"use client"
import { type ComponentProps, type FC } from "react"
import { Button } from "."
import { useRouter } from "next/navigation"

export const LinkButton: FC<
  ComponentProps<"button"> & { href: string; selected?: boolean }
> = ({ href, ...props }) => {
  const router = useRouter()
  return (
    <Button
      onClick={() => {
        router.push(href)
      }}
      {...props}
    />
  )
}
