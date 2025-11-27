import type React from "react"
import type { Metadata, Viewport } from "next"
import { Orbitron, Space_Grotesk } from 'next/font/google'
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/context/auth-context"

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400','700'], variable: '--font-heading' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300','400','700'], variable: '--font-body' })

export const metadata: Metadata = {
  title: "ProU-EMS | Employee & Task Management",
  description: "Premium Employee and Task Management System with stunning 3D visuals",
  generator: 'v0.app',
    icons: {
      // include `favicon.ico` as the first icon so clients that prefer .ico files can pick it
      icon: [
        { url: '/favicon.ico', type: 'image/x-icon' },
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      // Use the generated apple-touch PNG
      apple: '/apple-icon.png',
    },
}

export const viewport: Viewport = {
  themeColor: "#0a0a12",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="en" className="dark">
        <body className={`${spaceGrotesk.variable} ${orbitron.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  )
}
