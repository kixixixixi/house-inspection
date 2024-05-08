import type { Metadata } from "next"
import { M_PLUS_1 } from "next/font/google"
import "./globals.css"

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
      <body style={{ ...font.style }}>{children}</body>
    </html>
  )
}
