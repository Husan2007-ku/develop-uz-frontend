'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme-context'
import { useAuth } from '@/lib/auth-context'
import styles from './Navbar.module.css'
import {
  IconPencil, IconCards, IconMic, IconGrid,
  IconArrowRight, IconSun, IconMoon,
} from '@/components/Icons'

// Har biri BITTA kirish eshigi. "Writing" bosilganda to'g'ridan-to'g'ri biror
// ichki sahifa (masalan /essays) ochilib ketmasin deb, avval kartochkali hub
// sahifa (/writing) ko'rsatiladi — foydalanuvchi o'zi kerakli bo'limni tanlaydi.
// Vocabulary'ning barcha sahifalari esa bosh sahifada (/) kartochka sifatida
// ko'rsatiladi — bu yerda faqat bitta link.
const navGroups = [
  { label: 'Writing', href: '/writing', icon: IconPencil, matches: ['/writing', '/essays', '/grammar', '/idea-generator', '/ai-essay', '/mock'] },
  { label: 'Speaking', href: '/speaking', icon: IconMic, matches: ['/speaking'] },
  { label: 'Vocabulary', href: '/vocabulary', icon: IconCards, matches: ['/vocabulary'] },
  { label: 'Dashboard', href: '/dashboard', icon: IconGrid, matches: ['/dashboard'] },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const isHome = pathname === '/'

  // Dashboard o'zining mustaqil (glass) header'iga ega, shuning uchun
  // global navbar u yerda ko'rsatilmaydi.
  if (pathname === '/dashboard') return null

  return (
    <nav className={styles.bar}>
      <div className={styles.left}>
        {!isHome && (
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => router.back()}
            aria-label="Orqaga"
          >
            <IconArrowRight style={{ transform: 'scaleX(-1)' }} />
          </button>
        )}
        <Link href="/" className={styles.brand}>
          <span className={styles.brandName}>Develop UZ</span>
        </Link>
        {!isHome && (
          <Link href="/" className={styles.homeChip}>Bosh sahifa</Link>
        )}
      </div>

      <div className={styles.center}>
        {navGroups.map((group) => {
          const Icon = group.icon
          const active = group.matches.some((m) => pathname.startsWith(m))
          return (
            <Link
              key={group.href}
              href={group.href}
              className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
            >
              <Icon />
              {group.label}
            </Link>
          )
        })}
      </div>

      <div className={styles.right}>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          aria-label="Mavzuni almashtirish"
        >
          <IconMoon hidden={theme === 'light'} />
          <IconSun hidden={theme === 'dark'} />
        </button>
        {user ? (
          <button type="button" onClick={() => { logout(); router.push('/') }} className={styles.homeChip}>
            {user.name} · Chiqish
          </button>
        ) : (
          <Link href="/login" className={styles.homeChip}>Kirish</Link>
        )}
      </div>
    </nav>
  )
}
