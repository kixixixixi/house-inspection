"use client"
import { useEffect, useRef, type ComponentProps, type FC } from "react"

export const Dialog: FC<ComponentProps<"dialog">> = ({
  style,
  open,
  ...props
}) => {
  const ref = useRef<HTMLDialogElement | null>(null)
  useEffect(() => {
    if (open) {
      ref.current?.showModal()
    } else {
      ref.current?.close()
    }
  }, [open])
  return (
    <>
      <dialog
        ref={ref}
        style={{
          border: "none",
          borderRadius: ".3rem",
          boxShadow: "0 0 0 100vmax rgba(0, 0, 0, 0.3)",
          inlineSize: "min(64rem, 90vw)",
          inset: 0,
          margin: "auto",
          minBlockSize: "12rem",
          padding: "1rem",
          placeContent: "center",
          ...style,
        }}
        {...props}
      ></dialog>
    </>
  )
}
