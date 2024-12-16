import ky from "ky"
import { supabase } from "./supabase"

export const api = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return ky.extend({
    headers: {
      authorization: `${session?.access_token}`,
    },
  })
}
