import { md5 } from "js-md5"

export const hash = (text: string) => md5(text)
