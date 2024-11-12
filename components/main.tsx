"use client"

import { accountAtom, useAtomValue } from "@/lib/store"
import { ComponentProps, FC } from "react"
import { Container } from "@/components/elements"

export const Main: FC<ComponentProps<"main">> = ({ children, ...props }) => {
  const account = useAtomValue(accountAtom)
  return (
    <main
      style={{
        height: "100%",
        minHeight: "100dvh",
        paddingTop: "3rem",
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
                height: "100%",
                justifyContent: "center",
              }}
            >
              <h1>ログインしてください</h1>
            </div>
          </>
        )}
      </Container>
    </main>
  )
}
