"use client"

import { accountAtom, useAtom } from "@/lib/store"
import { ComponentProps, FC, FormEvent, useState } from "react"
import { Container } from "@/components/elements"
import { Button, Field, Input } from "@/components/elements"
import { supabase } from "@/lib/supabase"

export const Main: FC<ComponentProps<"main">> = ({ children, ...props }) => {
  const [account, setAccount] = useAtom(accountAtom)
  const [params, setParams] = useState<{ email: string }>({
    email: "",
  })
  const [isSigning, setUsSigning] = useState<boolean>(false)

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({
      ...params,
    })
    if (error) return
    setUsSigning(true)
  }
  return (
    <main
      style={{
        height: "100%",
        minHeight: "100dvh",
      }}
      {...props}
    >
      <Container>
        {account ? (
          children
        ) : (
          <>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                flexFlow: "column",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <h1
                style={{
                  padding: "2rem 0",
                }}
              >
                公共住宅点検アプリ
              </h1>
              {isSigning ? (
                <>ログインメールをお送りしました。</>
              ) : (
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
                  <Button>ログインする</Button>
                </form>
              )}
            </div>
          </>
        )}
      </Container>
    </main>
  )
}
