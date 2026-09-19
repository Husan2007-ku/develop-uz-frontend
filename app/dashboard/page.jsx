'use client'

import Link from 'next/link'
import styles from './dashboard.module.css'
import GlassBackground from '@/components/GlassBackground'
import { useTheme } from '@/lib/theme-context'
import {
  IconPencil, IconMic, IconCards, IconBook, IconGrammar, IconTrophy,
  IconFlame, IconWord, IconEssay, IconLock, IconSun, IconMoon, IconArrowRight,
} from '@/components/Icons'

// TODO: Telegram initData orqali backenddan haqiqiy statistikani olish
// (bot allaqachon shu ma'lumotlarni saqlaydi — /users/{id}/stats endpoint kerak).
// Hozircha namunaviy ma'lumotlar bilan ishlaymiz.
const STATS = [
  { key: 'streak', label: 'Kunlik seriya', value: '12 kun', icon: IconFlame, tone: 'orange' },
  { key: 'words', label: "Yodlangan so'z", value: '184', icon: IconWord, tone: 'blue' },
  { key: 'essays', label: 'Tahlil qilingan insho', value: '9', icon: IconEssay, tone: 'violet' },
]

const MODULES = [
  {
    key: 'writing', title: 'Yozish', desc: "Insholaringizni AI orqali Band 6-9 mezonida tahlil qiling.",
    href: '/writing', icon: IconPencil, tone: 'cBlue', progress: 68, status: '17/25 dars',
  },
  {
    key: 'speaking', title: 'Gapirish', desc: 'Speaking mavzulari bo’yicha ovozli mashqlar va fikr-mulohaza.',
    href: '/speaking', icon: IconMic, tone: 'cOrange', progress: 42, status: '8/19 mavzu',
  },
  {
    key: 'vocabulary', title: "Lug'at", desc: 'Ebbinghaus egri chizig’i asosida so’z yodlash tizimi.',
    href: '/vocabulary', icon: IconCards, tone: 'cGreen', progress: 55, status: '184/335 so‘z',
  },
  {
    key: 'reading', title: "O'qish", desc: 'Reading matnlari va tushunish mashqlari tez orada qo’shiladi.',
    href: '#', icon: IconBook, tone: 'locked', locked: true, status: 'Tez orada',
  },
  {
    key: 'grammar', title: 'Grammatika', desc: 'Grammatik tuzilmalar bo’yicha interaktiv qo’llanma va testlar.',
    href: '#', icon: IconGrammar, tone: 'locked', locked: true, status: 'Tez orada',
  },
  {
    key: 'mock', title: 'Sinov imtihoni', desc: 'To’liq formatdagi mock IELTS imtihonini his qiling.',
    href: '#', icon: IconTrophy, tone: 'locked', locked: true, status: 'Tez orada',
  },
]

const TONE_VARS = {
  blue: { bg: 'var(--t-blue)', on: 'var(--on-blue)' },
  orange: { bg: 'var(--t-orange)', on: 'var(--on-orange)' },
  violet: { bg: 'var(--t-violet)', on: 'var(--on-violet)' },
  green: { bg: 'var(--t-green)', on: 'var(--on-green)' },
}

const RING_R = 58
const RING_C = 2 * Math.PI * RING_R
const GOAL_PCT = 0.72

export default function DashboardPage() {
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const dashOffset = RING_C * (1 - GOAL_PCT)

  return (
    <div className={styles.wrapper}>
      <GlassBackground />

      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="dashRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--gem-blue)" />
            <stop offset="45%" stopColor="var(--gem-violet)" />
            <stop offset="75%" stopColor="var(--gem-pink)" />
            <stop offset="100%" stopColor="var(--gem-orange)" />
          </linearGradient>
        </defs>
      </svg>

      <div className={styles.page}>
        <header className={styles.topbar}>
          <div className={styles.brand}>
            <Link href="/" className={styles.backBtn} aria-label="Bosh sahifaga qaytish">
              <IconArrowRight style={{ transform: 'scaleX(-1)' }} size={16} />
            </Link>
            <Link href="/" className={styles.brandName} style={{ textDecoration: 'none' }}>
              Develop UZ
            </Link>
          </div>
          <div className={styles.topbarRight}>
            <button
              type="button"
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label="Mavzuni almashtirish"
            >
              <IconMoon hidden={theme === 'light'} />
              <IconSun hidden={theme === 'dark'} />
            </button>
            <div className={styles.profileChip}>
              <span className={styles.avatar}>A</span>
              <span className={styles.profileName}>Maqsad <b>7.0</b></span>
            </div>
          </div>
        </header>

        <h1 className={styles.greet}>
          Xayrli kun! Bugun ham <span className={styles.greetGradient}>maqsadga bir qadam</span> yaqinroqsiz.
        </h1>

        <section className={`glassPanel ${styles.hero}`}>
          <div className={styles.heroRing}>
            <svg className={styles.heroRingSvg} viewBox="0 0 140 140">
              <circle className={styles.ringTrack} cx="70" cy="70" r={RING_R} />
              <circle
                className={styles.ringVal}
                cx="70" cy="70" r={RING_R}
                strokeDasharray={RING_C}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <div className={styles.heroRingCenter}>
              <span className={styles.heroRingNum}>6.5</span>
              <span className={styles.heroRingLbl}>Band / 9.0</span>
            </div>
          </div>

          <div>
            <p className={styles.goal}>
              Maqsadli ball <b>7.0</b> ga yetishga <b>{Math.round(GOAL_PCT * 100)}%</b> qoldi.
            </p>
            <span className={styles.heroPill}>
              <span className={styles.heroPillDot} />
              Kundalik maqsad: 30 daqiqa mashq
            </span>

            <div className={styles.statRow}>
              {STATS.map((s) => {
                const Icon = s.icon
                const tone = TONE_VARS[s.tone]
                return (
                  <div key={s.key} className={`glassPanel ${styles.statChip}`}>
                    <span className={styles.statIcon} style={{ background: tone.bg, color: tone.on }}>
                      <Icon size={18} />
                    </span>
                    <div>
                      <div className={styles.statV}>{s.value}</div>
                      <div className={styles.statLbl}>{s.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <h2 className={styles.sectionLbl}>Modullar</h2>
        <div className={styles.moduleGrid}>
          {MODULES.map((m) => {
            const Icon = m.icon
            const tileClass = m.locked
              ? `${styles.tile} ${styles.tileLocked}`
              : `${styles.tile} ${styles[m.tone]}`
            const content = (
              <>
                <span className={styles.tileIcon}>
                  <Icon size={19} />
                </span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
                {!m.locked && (
                  <div className={styles.progressTrack}>
                    <span style={{ width: `${m.progress}%` }} />
                  </div>
                )}
                <div className={styles.status}>
                  <span>{m.status}</span>
                  {m.locked ? <IconLock size={13} /> : <span className={styles.pct}>{m.progress}%</span>}
                </div>
              </>
            )
            return m.locked ? (
              <div key={m.key} className={`glassPanel ${tileClass}`} aria-disabled="true">
                {content}
              </div>
            ) : (
              <Link key={m.key} href={m.href} className={`glassPanel ${tileClass}`}>
                {content}
              </Link>
            )
          })}
        </div>
      </div>

      <div className={styles.askBar}>
        <div className={styles.askInner}>
          <input
            type="text"
            className={styles.askTxt}
            placeholder="AI'dan insho tahlilini so'rang..."
            readOnly
          />
          <button type="button" className={styles.askMic} aria-label="Ovozli buyruq">
            <IconMic size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
