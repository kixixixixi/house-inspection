import type { Metadata } from "next"
import { M_PLUS_1 } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Container } from "@/components/elements"

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
            padding: ".5rem",
            position: "fixed",
            width: "100%",
            zIndex: "2000",
          }}
        >
          <Link href={"/"}>公共住宅点検アプリ</Link>
        </header>
        <main
          style={{
            height: "100%",
            minHeight: "100dvh",
            paddingTop: "2rem",
          }}
        >
          <Container>{children}</Container>
        </main>
      </body>
    </html>
  )
}
