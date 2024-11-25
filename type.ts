export {}

declare global {
  namespace PrismaJson {
    // Insert your types here!

    type Check = {
      largeCategory: string
      mediumCategory: string
      smallCategory: string
      part: string
      detail: string
    }
    type CheckList = Check[]
  }
}
