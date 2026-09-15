'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme-context'
import styles from './Navbar.module.css'
import {
  IconPencil, IconCards, IconMic, IconGrid,
  IconArrowRight, IconSun, IconMoon,
} from '@/components/Icons'

// Har biri BITTA kirish eshigi — ichki sahifalar (Grammar, Mock, Idea
// Generator, AI Tahlil...) endi /essays sahifasining o'zi ichida ochiladi,
// nav'da dropdown shart emas. Vocabulary'ning barcha sahifalari esa bosh
// sahifada (/) kartochka sifatida ko'rsatiladi — bu yerda faqat bitta link.
const navGroups = [
  { label: 'Writing', href: '/essays', icon: IconPencil },
  { label: 'Speaking', href: '/speaking', icon: IconMic },
  { label: 'Vocabulary', href: '/vocabulary', icon: IconCards },
  { label: 'Dashboard', href: '/dashboard', icon: IconGrid },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
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
          const active = pathname.startsWith(group.href)
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
      </div>
    </nav>
  )
}
