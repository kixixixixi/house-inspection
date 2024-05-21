"use client"
import { type ComponentProps, type FC, useRef } from "react"
import { Button } from "."

export const InputFileButton: FC<
  ComponentProps<"button"> & {
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  }
> = ({ onFileChange, inputProps, ...props }) => {
  const fileRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <Button
        type="button"
        onClick={() => fileRef.current?.click()}
        {...props}
      ></Button>
      <input
        type="file"
        style={{ display: "none" }}
        onChange={onFileChange}
        ref={fileRef}
        {...inputProps}
      />
    </>
  )
}
