'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GlassBackground from '@/components/GlassBackground'
import { useAuth } from '@/lib/auth-context'
import { IconLock, IconArrowRight } from '@/components/Icons'
import styles from '../auth.module.css'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className={styles.wrapper}>
      <GlassBackground />
      <div className={styles.inner}>
        <div className={`glassPanel ${styles.card}`}>
          <h1 className={styles.title}>Xush kelibsiz</h1>
          <p className={styles.subtitle}>Hisobingizga kiring</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <div className={styles.inputRow}>
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="siz@misol.com"
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Parol</label>
              <div className={styles.inputRow}>
                <IconLock />
                <input
                  className={styles.input}
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Parolingiz"
                  required
                />
              </div>
            </div>

            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? "Yuklanmoqda..." : <>Kirish <IconArrowRight /></>}
            </button>
          </form>

          <div className={styles.footer}>
            Hisobingiz yo&apos;qmi? <Link href="/register">Ro&apos;yxatdan o&apos;tish</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
