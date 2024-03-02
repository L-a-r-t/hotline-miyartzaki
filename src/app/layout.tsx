import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import AuthContextProvider from "../context/auth"
import ModalContextProvider from "../context/modal"
import Background from "@/components/background"

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Hotline Miyartzaki",
  description: "Pour les crêpes ça se passe ici !",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthContextProvider>
      <ModalContextProvider>
        <html lang="en">
          <Background />
          <body className={`${font.className} relative`}>{children}</body>
        </html>
      </ModalContextProvider>
    </AuthContextProvider>
  )
}
