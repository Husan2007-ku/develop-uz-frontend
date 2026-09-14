'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme-context'
import styles from './Navbar.module.css'
import {
  IconPencil, IconCards, IconMic, IconGrid, IconChevronDown,
  IconArrowRight, IconSun, IconMoon,
} from '@/components/Icons'

const navGroups = [
  {
    label: 'Writing',
    href: '/essays',
    icon: IconPencil,
    children: [
      { href: '/essays', label: 'Essays' },
      { href: '/grammar', label: 'Grammar & Strukturalar' },
      { href: '/idea-generator', label: 'Idea Generator' },
      { href: '/ai-essay', label: 'AI Essay Tahlil' },
      { href: '/mock', label: 'Mock Imtihon' },
    ],
  },
  {
    label: 'Vocabulary',
    href: '/vocabulary',
    icon: IconCards,
    children: [
      { href: '/vocabulary', label: 'Vocabulary Zone' },
      { href: '/my-vocab', label: 'Mening Vocabularyim' },
      { href: '/sample-collector', label: 'Sample Collector' },
      { href: '/study', label: 'Flashcard & Study' },
    ],
  },
  { label: 'Speaking', href: '/speaking', icon: IconMic, children: null },
  { label: 'Dashboard', href: '/dashboard', icon: IconGrid, children: null },
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
            <div key={group.href} className={styles.navItem}>
              <Link
                href={group.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
              >
                <Icon />
                {group.label}
                {group.children && <IconChevronDown />}
              </Link>
              {group.children && (
                <div className={styles.dropdown}>
                  {group.children.map((child) => (
                    <Link key={child.href} href={child.href} className={styles.dropLink}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
