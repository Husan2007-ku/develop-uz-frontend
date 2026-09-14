'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

const STORAGE_KEY = 'develop-uz-theme'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')

  // Sahifa ochilganda saqlangan mavzuni o'qish (localStorage), yo'q bo'lsa qorong'i.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === 'light' || stored === 'dark') setTheme(stored)
    } catch {}
  }, [])

  // <html data-theme> ni yangilash — barcha sahifalar (navbar, landing,
  // dashboard) shu bitta atributdan CSS token orqali rang oladi.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { window.localStorage.setItem(STORAGE_KEY, theme) } catch {}
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
