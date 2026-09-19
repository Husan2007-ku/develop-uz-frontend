'use client'
import Link from 'next/link'
import GlassBackground from '@/components/GlassBackground'
import {
  IconPencil, IconEssay, IconGrammar, IconFlame, IconBot, IconTrophy,
} from '@/components/Icons'
import styles from './writing.module.css'

// Writing bo'limining kirish eshigi (hub). Navbar'dagi "Writing" endi
// to'g'ridan-to'g'ri /essays'ga emas, shu sahifaga olib keladi — foydalanuvchi
// avval kerakli bo'limni kartochkadan tanlaydi.
const SECTIONS = [
  {
    href: '/essays',
    Icon: IconEssay,
    title: 'Essays',
    desc: 'Band 6-9 gacha real IELTS Writing Task 2 essaylar',
    tone: 'var(--t-blue)', on: 'var(--on-blue)',
  },
  {
    href: '/grammar',
    Icon: IconGrammar,
    title: 'Grammar',
    desc: "Task 1 va Task 2 uchun Band 7–9 darajasidagi grammatik strukturalar",
    tone: 'var(--t-green)', on: 'var(--on-green)',
  },
  {
    href: '/idea-generator',
    Icon: IconFlame,
    title: 'Idea Generator',
    desc: 'Mavzu kiriting — AI argumentlar, vocabulary va outline beradi',
    tone: 'var(--t-orange)', on: 'var(--on-orange)',
  },
  {
    href: '/ai-essay',
    Icon: IconBot,
    title: 'AI Tahlil',
    desc: 'Essayingizni AI yordamida tahlil qiling yoki yangi essay yozing',
    tone: 'var(--t-violet)', on: 'var(--on-violet)',
  },
  {
    href: '/mock',
    Icon: IconTrophy,
    title: 'Mock Imtihon',
    desc: 'Haqiqiy IELTS sharoitida yozing — vaqt, mavzu, AI baho',
    tone: 'var(--t-blue)', on: 'var(--on-blue)',
  },
]

export default function WritingHubPage() {
  return (
    <div className={styles.wrapper}>
      <GlassBackground />
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}><IconPencil /></span>
            Writing
          </h1>
          <p className={styles.desc}>Qaysi bo&apos;limga o&apos;tmoqchisiz?</p>
        </div>

        <div className={styles.grid}>
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className={`glassPanel ${styles.card}`}>
              <span className={styles.cardIcon} style={{ background: s.tone, color: s.on }}>
                <s.Icon />
              </span>
              <div className={styles.cardTitle}>{s.title}</div>
              <div className={styles.cardDesc}>{s.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
