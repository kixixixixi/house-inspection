import { User } from "@supabase/supabase-js"
import { atom, useAtom, useSetAtom, useAtomValue } from "jotai"

export const accountAtom = atom<User>()
export { useAtom, useAtomValue, useSetAtom }
