"use client"

import { ChangeEvent, ComponentProps, FC, useRef } from "react"
import { Button } from "../elements"
import { parseCsvText } from "@/lib/file"

export const CsvImportInput: FC<
  ComponentProps<"button"> & {
    onImport: (data: { [key: string]: string }[]) => void
  }
> = ({ onImport, ...props }) => {
  const fileRef = useRef<HTMLInputElement>(null)
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length == 0) return
    const fileText = await files[0].text()
    const data = parseCsvText(fileText)
    onImport(data)
    event.target.value = ""
  }
  return (
    <>
      <Button onClick={() => fileRef.current?.click()} {...props} />
      <input
        hidden
        ref={fileRef}
        type="file"
        accept="text/csv"
        onChange={handleFileChange}
      />
    </>
  )
}
