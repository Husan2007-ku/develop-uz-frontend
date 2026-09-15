'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './WritingTabs.module.css'

// Writing hub ichidagi 5 sahifa orasida sakrash uchun — navbar'dagi dropdown
// olib tashlangach, bu sahifalarga yagona yo'l shu bo'lib qoldi.
const TABS = [
  { href: '/essays', label: 'Essays' },
  { href: '/grammar', label: 'Grammar' },
  { href: '/idea-generator', label: 'Idea Generator' },
  { href: '/ai-essay', label: 'AI Tahlil' },
  { href: '/mock', label: 'Mock Imtihon' },
]

export default function WritingTabs() {
  const pathname = usePathname()
  return (
    <div className={styles.tabs}>
      {TABS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`${styles.tab} ${pathname === t.href ? styles.tabActive : ''}`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  )
}
