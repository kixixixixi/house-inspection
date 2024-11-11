"use client"

import { FormEvent, useState, type ComponentProps, type FC } from "react"
import { Button, Field, Input } from "../elements"
import { supabase } from "@/lib/supabase"
import { useEffect } from "react"
import { accountAtom, useAtom } from "@/lib/store"
import { Dialog } from "../elements/dialog"

export const SignInMenu: FC<ComponentProps<"div"> & {}> = ({
  style,
  ...props
}) => {
  const [account, setAccount] = useAtom(accountAtom)
  const [isOpenSignInModal, setIsOpenSignInModal] = useState<boolean>(false)
  const [params, setParams] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  })
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
  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      ...params,
    })
  }

  return (
    <div
      style={{
        display: "flex",
        ...style,
      }}
      {...props}
    >
      {account ? (
        <>{account.email}</>
      ) : (
        <>
          <Button onClick={() => setIsOpenSignInModal(true)}>ログイン</Button>
          <Dialog
            onClose={() => setIsOpenSignInModal(false)}
            open={isOpenSignInModal}
          >
            <form onSubmit={handleSignIn}>
              <Field>
                <label>Email</label>
                <Input
                  type="email"
                  value={params.email}
                  onChange={({ target: { value } }) =>
                    setParams({ ...params, email: value })
                  }
                />
              </Field>
              <Field>
                <label>Password</label>
                <Input
                  type="password"
                  value={params.password}
                  onChange={({ target: { value } }) =>
                    setParams({ ...params, password: value })
                  }
                />
              </Field>
              <Button>ログインする</Button>
            </form>
          </Dialog>
        </>
      )}
    </div>
  )
}
