import type React from "react"
import type { Metadata, Viewport } from "next"
import { Suspense } from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
// import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  viewportFit: "cover",
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <link href="https://fonts.cdnfonts.com/css/perfect-dos-vga-437" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <Suspense fallback={null}>{children}</Suspense>
        <SpeedInsights />
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
