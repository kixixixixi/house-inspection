import ky from "ky"

export const searchAddress = async ({
  address,
}: {
  address: string
}): Promise<
  | {
      fullname: string[]
      id: number
      level: number
      name: string
      note: string
      priority: number
      x: number
      y: number
    }
  | undefined
> => {
  const response = await ky.post("https://geonlp.ex.nii.ac.jp/api/geonlp/v2", {
    json: {
      id: 1,
      jsonrpc: "2.0",
      method: "geonlp.addressGeocoding",
      params: { address },
    },
  })
  if (response.ok) {
    const { result } = await response.json<{
      id: 1
      jsonrpc: "2.0"
      result: {
        candidates: {
          fullname: string[]
          id: number
          level: number
          name: string
          note: string
          priority: number
          x: number
          y: number
        }[]
        matched: string
      }
    }>()

    if (result.candidates.length > 0) {
      return result.candidates[0]
    }
  }
}
