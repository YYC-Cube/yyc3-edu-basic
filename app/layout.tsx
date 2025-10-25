import type { Metadata } from "next"
import { type ReactNode } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    template: "%s - YYC³ AI",
    default: "首页 - YYC³ AI",
  },
  description: "言启智云丨语枢万象 - 中国教育2023-2025年小学、初中多学科全智能AI智能体",
  generator: "YYC³ AI",
  icons: {
    icon: "/logo.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
