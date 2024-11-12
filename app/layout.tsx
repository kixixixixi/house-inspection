import type { Metadata } from "next"
import { M_PLUS_1 } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { SignInMenu } from "@/components/modules/sign-in-menu"
import { Main } from "@/components/main"

const font = M_PLUS_1({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "公共住宅点検アプリ",
  description: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body style={{ ...font.style }}>
        <header
          style={{
            background: "#277",
            color: "#eee",
            display: "flex",
            justifyContent: "space-between",
            padding: ".75rem",
            position: "fixed",
            width: "100%",
            zIndex: "2000",
          }}
        >
          <Link href={"/"}>公共住宅点検アプリ</Link>
          <SignInMenu />
        </header>
        <Main>{children}</Main>
      </body>
    </html>
  )
}
