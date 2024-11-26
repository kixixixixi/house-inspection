export {}

declare global {
  namespace PrismaJson {
    type CheckTemplate = {
      id: number | string
      largeCategory: string
      mediumCategory: string
      smallCategory: string
      part: string
      detail: string
    }
    type CheckTemplateList = CheckTemplate[]

    type Check = CheckTemplate & {
      rank?: string
      latitude?: number
      longitude?: number
    }
    type CheckList = Check[]
  }
}
