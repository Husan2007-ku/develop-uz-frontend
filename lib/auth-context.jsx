'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { API_URL } from './api'

const AuthContext = createContext()

const TOKEN_KEY = 'develop-uz-token'

// Web foydalanuvchisi login qilganda backend unga JWT + "sinthetic" telegram_id
// beradi (haqiqiy Telegram ID emas, lekin barcha eski /essays, /vocabulary/user/*
// kabi endpointlar shu ID bilan ishlayveradi — backend tomonda ham shunday
// ishlab chiqilgan). Shu tufayli frontendda ikkita auth manbasi bor:
// 1) Telegram Mini App ichida — window.Telegram.WebApp.initData (avtomatik)
// 2) Oddiy veb-brauzer — bu context orqali saqlangan JWT
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(TOKEN_KEY)
      if (stored) {
        setToken(stored)
        fetchMe(stored)
        return
      }
    } catch {}
    setLoading(false)
  }, [])

  async function fetchMe(activeToken) {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      })
      if (res.ok) {
        setUser(await res.json())
      } else {
        // Token yaroqsiz/muddati tugagan — tozalab tashlaymiz
        clearSession()
      }
    } catch {
      // Tarmoq xatosi — tokenni saqlab qolamiz, keyingi urinishda qayta tekshiramiz
    }
    setLoading(false)
  }

  function persistSession(authResponse) {
    setUser(authResponse)
    setToken(authResponse.access_token)
    try { window.localStorage.setItem(TOKEN_KEY, authResponse.access_token) } catch {}
  }

  function clearSession() {
    setUser(null)
    setToken(null)
    try { window.localStorage.removeItem(TOKEN_KEY) } catch {}
  }

  async function register(name, email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || "Ro'yxatdan o'tishda xato")
    persistSession(data)
    return data
  }

  async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Email yoki parol noto\'g\'ri')
    persistSession(data)
    return data
  }

  function logout() {
    clearSession()
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      telegramId: user?.telegram_id || null,
      loading,
      isAuthenticated: !!user,
      register,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
