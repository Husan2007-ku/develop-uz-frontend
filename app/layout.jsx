import './globals.css'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/lib/theme-context'

export const metadata = {
  title: 'Develop UZ',
  description: "O'zbek tilidagi eng yaxshi IELTS Writing platformasi",
}

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body className="bg-gray-950 text-white min-h-screen">
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
