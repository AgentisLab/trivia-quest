import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Canadian Trivia Quest | Quête trivia canadienne",
  description: "A bilingual trivia quiz game with 500+ Canadian-themed questions across 10 categories. Un jeu-questionnaire bilingue avec 500+ questions sur le Canada.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f2f2f7",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased" style={{ background: "var(--ios-bg)" }}>
        {children}
      </body>
    </html>
  )
}
