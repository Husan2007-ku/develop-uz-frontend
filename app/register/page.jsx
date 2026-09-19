'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GlassBackground from '@/components/GlassBackground'
import { useAuth } from '@/lib/auth-context'
import { IconLock, IconArrowRight } from '@/components/Icons'
import styles from '../auth.module.css'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError("Parol kamida 6 belgidan iborat bo'lishi kerak")
      return
    }
    setLoading(true)
    try {
      await register(name, email, password)
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
          <h1 className={styles.title}>Ro&apos;yxatdan o&apos;ting</h1>
          <p className={styles.subtitle}>Develop UZ&apos;da o&apos;rganishni boshlang</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Ismingiz</label>
              <div className={styles.inputRow}>
                <input
                  className={styles.input}
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Husan"
                  required
                  minLength={2}
                />
              </div>
            </div>

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
                  placeholder="Kamida 6 belgi"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? "Yuklanmoqda..." : <>Ro&apos;yxatdan o&apos;tish <IconArrowRight /></>}
            </button>
          </form>

          <div className={styles.footer}>
            Hisobingiz bormi? <Link href="/login">Kirish</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
