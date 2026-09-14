import Link from 'next/link'
import styles from './Home.module.css'
import GlassBackground from '@/components/GlassBackground'
import {
  IconPencil, IconCards, IconMic, IconRepeat, IconBot, IconTrophy,
  IconEssay, IconWord, IconChart, IconTelegram, IconCheck, IconArrowRight,
} from '@/components/Icons'

const FEATURES = [
  {
    icon: IconPencil, tag: 'Task 2', title: 'Writing Essaylar',
    desc: "Band 6–9 gacha 1000+ real essay. Har biri tahlil qilingan, collocation va idiomlar belgilangan.",
    href: '/essays', tone: 'cBlue',
  },
  {
    icon: IconCards, tag: 'B2 · C1 · C2', title: 'Vocabulary Zone',
    desc: "10,000+ so'z CEFR darajalari bilan. O'zbek tarjimasi, misol jumlalar, word family.",
    href: '/vocabulary', tone: 'cGreen',
  },
  {
    icon: IconMic, tag: 'Part 1 · 2 · 3', title: 'Speaking Tayyorgarlik',
    desc: 'Part 1, 2, 3 uchun namuna javoblar. C1/C2 vocabulary va examiner maslahatlari bilan.',
    href: '/speaking', tone: 'cViolet',
  },
  {
    icon: IconRepeat, tag: 'SM-2 algoritm', title: 'Flashcard & Study',
    desc: "Spaced Repetition usulida so'z yodlash. Cloze test, quiz va writing practice.",
    href: '/study', tone: 'cOrange',
  },
  {
    icon: IconBot, tag: 'Claude + Groq AI', title: 'AI Essay Tahlil',
    desc: "Essayingizni yuboring yoki o'zingiz yozing. AI band skorini va tavsiyalar beradi.",
    href: '/ai-essay', tone: 'cViolet',
  },
  {
    icon: IconTrophy, tag: 'Real sharoit', title: 'Mock Imtihon',
    desc: "Haqiqiy IELTS kabi: vaqt, mavzu, AI baho. Chiqib ketib bo'lmaydi.",
    href: '/mock', tone: 'cOrange',
  },
]

const STEPS = [
  { n: '01', title: "Essay o'qi", desc: "Band 8+ essaylarni o'qi, collocation va C1/C2 so'zlarini yodlab ol" },
  { n: '02', title: "So'z yodla", desc: "Flashcard bilan B2→C1→C2 so'zlarni Spaced Repetition usulida yodla" },
  { n: '03', title: 'Essay yoz', desc: "O'rgangan so'z va strukturalarni ishlatib essay yoz, AI tekshirsin" },
  { n: '04', title: 'Mock sinov', desc: "Mock imtihonda o'zingni sinab ko'r, bandingni bil" },
]

const STATS = [
  { icon: IconEssay, value: '1000+', label: 'Writing Essay', tone: 'blue' },
  { icon: IconWord, value: '10,000+', label: 'Vocabulary', tone: 'green' },
  { icon: IconChart, value: 'B2→C2', label: 'CEFR darajalar', tone: 'orange' },
  { icon: IconBot, value: 'AI', label: 'Essay tahlili', tone: 'violet' },
]

const TONE_VARS = {
  blue: { bg: 'var(--t-blue)', on: 'var(--on-blue)' },
  orange: { bg: 'var(--t-orange)', on: 'var(--on-orange)' },
  violet: { bg: 'var(--t-violet)', on: 'var(--on-violet)' },
  green: { bg: 'var(--t-green)', on: 'var(--on-green)' },
}

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <GlassBackground />

      <div className={styles.inner}>
        {/* HERO */}
        <section className={styles.hero}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} />
            Writing · Speaking · Vocabulary — O&apos;zbek tilida
          </span>

          <h1 className={styles.h1}>
            IELTS <span className={styles.h1Gradient}>Writing va Vocabulary</span>
            <br />uchun yagona platforma
          </h1>

          <p className={styles.lead}>
            Band 8+ essaylar, 10,000+ CEFR darajali so&apos;zlar, AI tahlil — hammasi{' '}
            <b>o&apos;zbek tilida</b>
          </p>

          <div className={styles.ctaRow}>
            <Link href="/essays" className={styles.btnPrimary}>
              <IconPencil size={16} /> Essaylarni ko&apos;rish
            </Link>
            <Link href="/vocabulary" className={styles.btnGhost}>
              <IconCards size={16} /> Vocabulary
            </Link>
            <Link href="/ai-essay" className={styles.btnGhost}>
              <IconBot size={16} /> AI Tahlil
            </Link>
          </div>
        </section>

        {/* STATS */}
        <div className={styles.statRow}>
          {STATS.map((s) => {
            const Icon = s.icon
            const tone = TONE_VARS[s.tone]
            return (
              <div key={s.label} className={`glassPanel ${styles.statChip}`}>
                <span className={styles.statIcon} style={{ background: tone.bg, color: tone.on }}>
                  <Icon size={16} />
                </span>
                <div className={styles.statV} style={{ color: tone.on }}>{s.value}</div>
                <div className={styles.statLbl}>{s.label}</div>
              </div>
            )
          })}
        </div>

        {/* FEATURES */}
        <section className={styles.features}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Faqat <span>kerakli narsalar</span></h2>
            <p className={styles.sectionDesc}>Writing, Speaking va Vocabulary — ortiqcha hech narsa yo&apos;q</p>
          </div>
          <div className={styles.featureGrid}>
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <Link key={f.title} href={f.href} className={`glassPanel ${styles.tile} ${styles[f.tone]}`}>
                  <span className={styles.tileIcon}><Icon size={20} /></span>
                  <span className={styles.tileTag}>{f.tag}</span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className={styles.stepsSection}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Qanday <span>ishlaydi?</span></h2>
            <p className={styles.sectionDesc}>4 qadam bilan Band 8+ ga yeting</p>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map((s, i) => (
              <div key={s.n} className={`glassPanel ${styles.step}`}>
                <div className={styles.stepN}>{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <span className={styles.stepArrow}><IconArrowRight /></span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* TELEGRAM */}
        <section className={styles.telegram}>
          <div className={`glassPanel ${styles.telegramCard}`}>
            <div className={styles.telegramText}>
              <span className={styles.telegramBadge}><IconTelegram /> Telegram Bot</span>
              <div className={styles.telegramTitle}>Telegramda ham o&apos;rganing!</div>
              <p className={styles.telegramDesc}>
                Kunlik 10 ta yangi so&apos;z, flashcard va eslatmalar — Ebbinghaus Forgetting Curve asosida.
              </p>
              <div className={styles.checkList}>
                {[
                  'Kunlik vocabulary eslatmalar',
                  'Ebbinghaus Forgetting Curve asosida',
                  'Flashcard va testlar',
                  'Bepul foydalanish',
                ].map((item) => (
                  <span key={item} className={styles.checkItem}>
                    <IconCheck /> {item}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.telegramActions}>
              <Link href="https://t.me/IeLtsEssay_platfom_bot" target="_blank" className={styles.btnPrimary}>
                <IconTelegram size={16} /> Botga o&apos;tish
              </Link>
              <Link href="/essays" className={styles.btnGhost}>Saytda davom etish</Link>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className={styles.finalCta}>
          <div className={`glassPanel ${styles.finalCtaCard}`}>
            <h2>Bugun boshlang!</h2>
            <p>O&apos;zbek tilidagi yagona professional IELTS Writing platformasi</p>
            <Link href="/essays" className={styles.btnPrimary}>
              Bepul boshlash <IconArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <span className={styles.footerBrand}>
            <span className={styles.footerDot} /> Develop UZ
          </span>
          <span>Writing · Speaking · Vocabulary — O&apos;zbek tilida</span>
          <div className={styles.footerLinks}>
            <Link href="/essays">Essays</Link>
            <Link href="/vocabulary">Vocabulary</Link>
            <Link href="/study">Study</Link>
            <Link href="/ai-essay">AI Tahlil</Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
