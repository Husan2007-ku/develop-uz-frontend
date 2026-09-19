'use client'
import Link from 'next/link'
import GlassBackground from '@/components/GlassBackground'
import styles from './Home.module.css'
import {
  IconPencil, IconMic, IconCards, IconBook, IconRepeat, IconSearch,
  IconEssay, IconWord, IconLayers, IconBot, IconTelegram, IconCheck,
  IconArrowRight, IconSend,
} from '@/components/Icons'

// Ikki asosiy yo'nalish — har biri BITTA eshik, lekin to'g'ridan-to'g'ri ichki
// sahifaga emas, avval kartochkali hub'ga olib boradi (Writing → /writing,
// Speaking → /speaking'ning o'zi Part 1/2/3 kartochkalari bilan hub vazifasini
// bajaradi). Bosh sahifada faqat shu ikkitasi turadi.
const PILLARS = [
  {
    Icon: IconPencil, tag: 'Essays · Grammar · AI Tahlil · Mock', title: 'Writing',
    desc: 'Band 8+ sample essaylar, AI tahlil, grammar strukturalar va mock imtihon — hammasi bitta joyda.',
    href: '/writing', tone: 'cBlue',
  },
  {
    Icon: IconMic, tag: 'Part 1 · 2 · 3', title: 'Speaking',
    desc: "Savol tanla, AI bilan gaplash, ball ol va o'sha yerdan yangi so'z/struktura yodla.",
    href: '/speaking', tone: 'cOrange',
  },
]

// Vocabulary — alohida hub emas, bor sahifalarning barchasi bosh sahifada
// to'g'ridan-to'g'ri ko'rinadi (nav'dagi dropdown'dan shu yerga ko'chirildi).
const VOCAB_FEATURES = [
  {
    Icon: IconCards, tag: 'B2 · C1 · C2', title: 'Vocabulary Zone',
    desc: "10,000+ so'z CEFR darajalari bilan. O'zbek tarjimasi, misol jumlalar, word family.",
    href: '/vocabulary', tone: 'cGreen',
  },
  {
    Icon: IconBook, tag: 'Shaxsiy', title: 'Mening Vocabularyim',
    desc: "O'zingiz saqlagan so'z va grammatikalar — Writing/Speaking'dan avtomatik tushganlari ham shu yerda.",
    href: '/my-vocab', tone: 'cBlue',
  },
  {
    Icon: IconRepeat, tag: 'SM-2 algoritm', title: 'Flashcard & Study',
    desc: "Spaced Repetition usulida so'z yodlash. Cloze test, quiz va writing practice.",
    href: '/study', tone: 'cOrange',
  },
  {
    Icon: IconSearch, tag: 'Beta', title: 'Sample Collector',
    desc: "Namuna essay/javoblardan so'z va struktura yig'ish vositasi.",
    href: '/sample-collector', tone: 'cViolet',
  },
]

const STEPS = [
  { n: '01', title: "Essay o'qi", desc: "Band 8+ essaylarni o'qi, collocation va C1/C2 so'zlarini yodlab ol" },
  { n: '02', title: "So'z yodla", desc: "Flashcard bilan B2→C1→C2 so'zlarni Spaced Repetition usulida yodla" },
  { n: '03', title: 'Essay yoz', desc: "O'rgangan so'z va strukturalarni ishlatib essay yoz, AI tekshirsin" },
  { n: '04', title: 'Mock sinov', desc: "Mock imtihonda o'zingni sinab ko'r, bandingni bil" },
]

const STATS = [
  { n: '1000+', label: 'Writing Essay', Icon: IconEssay, tone: 'blue' },
  { n: '10,000+', label: 'Vocabulary', Icon: IconWord, tone: 'orange' },
  { n: 'B2→C2', label: 'CEFR darajalar', Icon: IconLayers, tone: 'green' },
  { n: 'AI', label: 'Essay tahlili', Icon: IconBot, tone: 'violet' },
]

const CHECKLIST = [
  'Kunlik vocabulary eslatmalar',
  'Ebbinghaus Forgetting Curve asosida',
  'Flashcard va testlar',
  'Bepul foydalanish',
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
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Writing · Speaking · Vocabulary — O&apos;zbek tilida
          </div>

          <h1 className={styles.h1}>
            IELTS <span className={styles.h1Gradient}>Writing</span> va Vocabulary
            <br />uchun yagona platforma
          </h1>

          <p className={styles.lead}>
            Band 8+ essaylar, 10,000+ CEFR darajali so&apos;zlar,
            AI tahlil — hammasi <b>o&apos;zbek tilida</b>
          </p>

          <div className={styles.ctaRow}>
            <Link href="/essays" className={styles.btnPrimary}>
              <IconEssay /> Essaylarni ko&apos;rish
            </Link>
            <Link href="/vocabulary" className={styles.btnGhost}>
              <IconCards /> Vocabulary
            </Link>
            <Link href="/ai-essay" className={styles.btnGhost}>
              <IconBot /> AI Tahlil
            </Link>
          </div>
        </section>

        {/* STATS */}
        <div className={styles.statRow}>
          {STATS.map((s, i) => {
            const tone = TONE_VARS[s.tone]
            return (
              <div key={i} className={`glassPanel ${styles.statChip}`}>
                <span className={styles.statIcon} style={{ background: tone.bg, color: tone.on }}>
                  <s.Icon size={17} />
                </span>
                <div className={styles.statV}>{s.n}</div>
                <div className={styles.statLbl}>{s.label}</div>
              </div>
            )
          })}
        </div>

        {/* ASOSIY YO'NALISHLAR — Writing va Speaking, har biri bitta eshik */}
        <div className={styles.features}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              Faqat <span>kerakli narsalar</span>
            </h2>
            <p className={styles.sectionDesc}>Writing va Speaking — ortiqcha hech narsa yo&apos;q</p>
          </div>
          <div className={styles.pillarGrid}>
            {PILLARS.map((f, i) => (
              <Link key={i} href={f.href} className={`glassPanel ${styles.tile} ${styles.tileLg} ${styles[f.tone]}`}>
                <span className={styles.tileIcon}><f.Icon /></span>
                <span className={styles.tileTag}>{f.tag}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* VOCABULARY — nav dropdown'dan bosh sahifaga ko'chirildi, hammasi ochiq */}
        <div className={styles.features}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              <span>Vocabulary</span>
            </h2>
            <p className={styles.sectionDesc}>Writing va Speaking&apos;dan chiqqan so&apos;zlar ham avtomatik shu yerga tushadi</p>
          </div>
          <div className={styles.vocabGrid}>
            {VOCAB_FEATURES.map((f, i) => (
              <Link key={i} href={f.href} className={`glassPanel ${styles.tile} ${styles[f.tone]}`}>
                <span className={styles.tileIcon}><f.Icon size={18} /></span>
                <span className={styles.tileTag}>{f.tag}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className={styles.stepsSection}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              Qanday <span>ishlaydi?</span>
            </h2>
            <p className={styles.sectionDesc}>4 qadam bilan Band 8+ ga yeting</p>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map((s, i) => (
              <div key={i} className={`glassPanel ${styles.step}`}>
                <div className={styles.stepN}>{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <span className={styles.stepArrow}><IconArrowRight /></span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* TELEGRAM */}
        <div className={styles.telegram}>
          <div className={`glassPanel ${styles.telegramCard}`}>
            <div className={styles.telegramText}>
              <div className={styles.telegramBadge}><IconTelegram /> Telegram Bot</div>
              <div className={styles.telegramTitle}>Telegramda ham o&apos;rganing!</div>
              <div className={styles.telegramDesc}>
                Kunlik 10 ta yangi so&apos;z, flashcard va eslatmalar — Ebbinghaus Forgetting Curve asosida.
              </div>
              <div className={styles.checkList}>
                {CHECKLIST.map((item, i) => (
                  <span key={i} className={styles.checkItem}><IconCheck /> {item}</span>
                ))}
              </div>
            </div>
            <div className={styles.telegramActions}>
              <Link href="https://t.me/IeLtsEssay_platfom_bot" target="_blank" className={styles.btnGhost}>
                <IconTelegram /> Botga o&apos;tish <IconArrowRight />
              </Link>
              <Link href="/essays" className={styles.btnGhost}>
                Saytda davom etish
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.finalCta}>
          <div className={`glassPanel ${styles.finalCtaCard}`}>
            <h2>Bugun boshlang! 🚀</h2>
            <p>O&apos;zbek tilidagi yagona professional IELTS Writing platformasi</p>
            <Link href="/essays" className={styles.btnPrimary}>
              <IconSend /> Bepul boshlash
            </Link>
          </div>
        </div>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <div className={styles.footerBrand}>
            <span className={styles.footerDot} />
            Develop UZ
          </div>
          <span>Writing · Speaking · Vocabulary — O&apos;zbek tilida</span>
          <div className={styles.footerLinks}>
            {[
              { href: '/essays', label: 'Essays' },
              { href: '/vocabulary', label: 'Vocabulary' },
              { href: '/study', label: 'Study' },
              { href: '/ai-essay', label: 'AI Tahlil' },
            ].map(l => (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}
