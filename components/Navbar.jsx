'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from '@/lib/theme-context'

const themes = {
  dark: {
    bg: '#0a1628', border: 'rgba(0,245,255,0.15)', accent: '#00F5FF',
    text: '#e2e8f0', text2: '#94a3b8', activeBg: 'rgba(0,245,255,0.12)',
    themeBtnBorder: 'rgba(0,245,255,0.2)', backBg: 'rgba(0,245,255,0.08)',
    dropBg: '#0d1f2d',
  },
  light: {
    bg: '#f1f5f9', border: 'rgba(0,35,102,0.12)', accent: '#002366',
    text: '#0f172a', text2: '#64748b', activeBg: 'rgba(0,35,102,0.1)',
    themeBtnBorder: 'rgba(0,35,102,0.2)', backBg: 'rgba(0,35,102,0.06)',
    dropBg: '#ffffff',
  },
  claude: {
    bg: '#0a1628', border: 'rgba(0,245,255,0.15)', accent: '#00F5FF',
    text: '#e2e8f0', text2: '#94a3b8', activeBg: 'rgba(0,245,255,0.12)',
    themeBtnBorder: 'rgba(0,245,255,0.2)', backBg: 'rgba(0,245,255,0.08)',
    dropBg: '#0d1f2d',
  },
}

const themeLabels = { dark: '🌙 Qora', light: '☀️ Oq', claude: '🤖 Claude' }

const navGroups = [
  {
    label: '📝 Writing',
    href: '/essays',
    children: [
      { href: '/essays', label: '📄 Essays' },
      { href: '/grammar', label: '📐 Grammar & Strukturalar' },
      { href: '/idea-generator', label: '💡 Idea Generator' },
      { href: '/ai-essay', label: '🤖 AI Essay Tahlil' },
      { href: '/mock', label: '🏆 Mock Imtihon' },
    ]
  },
  {
    label: '🧠 Vocabulary',
    href: '/vocabulary',
    children: [
      { href: '/vocabulary', label: '🧠 Vocabulary Zone' },
      { href: '/my-vocab', label: '📚 Mening Vocabularyim' },
      { href: '/sample-collector', label: '🔬 Sample Collector' },
      { href: '/study', label: '🃏 Flashcard & Study' },
    ]
  },
  {
    label: '🎤 Speaking',
    href: '/speaking',
    children: null,
  },
  {
    label: '📊 Dashboard',
    href: '/dashboard',
    children: null,
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const t = themes[theme] || themes.dark
  const isHome = pathname === '/'

  return (
    <nav style={{
      background: t.bg, borderBottom: `1px solid ${t.border}`,
      padding: '10px 24px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', position: 'sticky', top: 0,
      zIndex: 50, backdropFilter: 'blur(8px)', gap: 8,
    }}>

      {/* Left: back + logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {!isHome && (
          <button onClick={() => router.back()} style={{
            padding: '4px 10px', borderRadius: 6,
            border: `0.5px solid ${t.border}`,
            background: t.backBg, color: t.text2, fontSize: 14, cursor: 'pointer'
          }}>←</button>
        )}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: t.accent,
            display: 'inline-block', boxShadow: `0 0 6px ${t.accent}`
          }} />
          <span style={{ fontSize: 15, fontWeight: 500, color: t.accent, letterSpacing: 0.5 }}>
            Develop UZ
          </span>
        </Link>
        {!isHome && (
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontSize: 11, color: t.text2, padding: '4px 10px', borderRadius: 6,
              border: `0.5px solid ${t.border}`, background: t.backBg
            }}>🏠 Bosh sahifa</span>
          </Link>
        )}
      </div>

      {/* Center: nav groups */}
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {navGroups.map(group => (
          <div key={group.href} style={{ position: 'relative' }}
            onMouseEnter={e => {
              if (group.children) {
                const drop = e.currentTarget.querySelector('.nav-drop')
                if (drop) drop.style.display = 'block'
              }
            }}
            onMouseLeave={e => {
              if (group.children) {
                const drop = e.currentTarget.querySelector('.nav-drop')
                if (drop) drop.style.display = 'none'
              }
            }}>
            <Link href={group.href} style={{ textDecoration: 'none' }}>
              <span style={{
                fontSize: 12, padding: '6px 12px', borderRadius: 6,
                display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
                color: pathname.startsWith(group.href) ? t.accent : t.text2,
                background: pathname.startsWith(group.href) ? t.activeBg : 'transparent',
                border: pathname.startsWith(group.href)
                  ? `0.5px solid ${t.border}` : '0.5px solid transparent',
              }}>
                {group.label}
                {group.children && (
                  <span style={{ fontSize: 9, opacity: 0.5 }}>▾</span>
                )}
              </span>
            </Link>

            {group.children && (
              <div className="nav-drop" style={{
                display: 'none', position: 'absolute', top: '100%', left: 0,
                background: t.dropBg, border: `0.5px solid ${t.border}`,
                borderRadius: 10, padding: 6, minWidth: 220,
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 100, marginTop: 4,
              }}>
                {group.children.map(child => (
                  <Link key={child.href} href={child.href} style={{ textDecoration: 'none' }}>
                    <div style={{
                      fontSize: 12, padding: '8px 12px', borderRadius: 6, cursor: 'pointer',
                      color: pathname === child.href ? t.accent : t.text2,
                      background: pathname === child.href ? t.activeBg : 'transparent',
                      transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => {
                        if (pathname !== child.href) {
                          e.currentTarget.style.background = t.backBg
                          e.currentTarget.style.color = t.text
                        }
                      }}
                      onMouseLeave={e => {
                        if (pathname !== child.href) {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = t.text2
                        }
                      }}>
                      {child.label}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right: theme switcher */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        {Object.keys(themeLabels).map(th => (
          <button key={th} onClick={() => setTheme(th)} style={{
            fontSize: 11, padding: '4px 10px', borderRadius: 6,
            border: `0.5px solid ${theme === th ? t.accent : t.themeBtnBorder}`,
            background: theme === th ? t.accent : 'transparent',
            color: theme === th ? t.bg : t.text2,
            cursor: 'pointer', transition: 'all 0.2s'
          }}>{themeLabels[th]}</button>
        ))}
      </div>
    </nav>
  )
}