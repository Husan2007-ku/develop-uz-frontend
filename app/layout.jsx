import { Rubik, Roboto, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/lib/theme-context'
import { AuthProvider } from '@/lib/auth-context'

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-rubik',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata = {
  title: 'Develop UZ',
  description: "O'zbek tilidagi eng yaxshi IELTS Writing platformasi",
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="uz"
      data-theme="dark"
      className={`${rubik.variable} ${roboto.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
