import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Canadian Trivia Quest | Quête trivia canadienne",
  description:
    "A bilingual trivia quiz game with 600+ Canadian-themed questions across 12 categories. Un jeu-questionnaire bilingue avec 600+ questions sur le Canada.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
  colorScheme: "dark",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased" style={{ background: "var(--bg-1)" }}>
        {children}
      </body>
    </html>
  )
}
