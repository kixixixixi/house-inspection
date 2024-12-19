import { parse } from "csv-parse/sync"

export const resizeImage = async (
  file: File,
  option?: { type?: boolean; maxWidth?: number }
): Promise<string | null> =>
  new Promise<string | null>((resolve) => {
    const image = new Image()
    const reader = new FileReader()
    reader.onload = () => {
      image.onload = () => {
        const width = Math.min(option?.maxWidth ?? 600, image.naturalWidth)
        const height = image.naturalHeight * (width / image.width)
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(image, 0, 0, width, height)
        resolve(parseBase64(canvas.toDataURL(), option?.type))
      }

      if (reader.result) image.src = `${reader.result}`
    }
    reader.readAsDataURL(file)
  })

export const parseBase64 = (base64: string, type?: boolean) =>
  type ? base64 : base64.replace("data:", "").replace(/^.+,/, "")

export const parseCsvText = (fileText: string) => {
  const fileData: string[][] = parse(fileText)
  const header = fileData[0]
  return fileData.slice(1).map((row) => rowToDic(row, header))
}

const rowToDic = (row: string[], header: string[]): { [key: string]: string } =>
  header.reduce((d, h, i) => ({ ...d, [h]: row[i] }), {})
