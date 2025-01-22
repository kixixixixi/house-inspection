"use client"

import { type ComponentProps, type FC } from "react"
import { Button } from "../elements"
import { supabase } from "@/lib/supabase"
import { useEffect } from "react"
import { accountAtom, useAtom } from "@/lib/store"

export const SignInMenu: FC<ComponentProps<"div"> & {}> = ({
  style,
  ...props
}) => {
  const [account, setAccount] = useAtom(accountAtom)
  useEffect(() => {
    const signIn = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (user) setAccount(user)
    }

    if (!account) signIn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        gap: ".5rem",
        justifyContent: "right",
        ...style,
      }}
      {...props}
    >
      {account ? (
        <>
          <Button
            onClick={async () => {
              await supabase.auth.signOut()
              setAccount(undefined)
            }}
            style={{
              fontSize: ".8rem",
              padding: "0 1rem",
            }}
          >
            ログアウト
          </Button>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}
