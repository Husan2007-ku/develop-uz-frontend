'use client'
import Link from 'next/link'
import { useTheme } from '@/lib/theme-context'

const themes = {
  dark: {
    bg: '#0D1117', bg2: '#0d1f2d', bg3: '#0a1628',
    border: 'rgba(0,245,255,0.15)', border2: 'rgba(0,245,255,0.3)',
    text: '#e2e8f0', text2: '#94a3b8',
    accent: '#00F5FF', amber: '#F59E0B', green: '#93E9BE',
  },
  light: {
    bg: '#f8fafc', bg2: '#ffffff', bg3: '#f1f5f9',
    border: 'rgba(0,35,102,0.12)', border2: 'rgba(0,35,102,0.25)',
    text: '#0f172a', text2: '#64748b',
    accent: '#002366', amber: '#d97706', green: '#059669',
  },
  claude: {
    bg: '#0D1117', bg2: '#0d1f2d', bg3: '#0a1628',
    border: 'rgba(0,245,255,0.15)', border2: 'rgba(0,245,255,0.3)',
    text: '#e2e8f0', text2: '#94a3b8',
    accent: '#00F5FF', amber: '#F59E0B', green: '#93E9BE',
  },
}

export default function Home() {
  const { theme } = useTheme()
  const t = themes[theme] || themes.dark

  const features = [
    {
      icon: '✍️',
      tag: 'Task 2',
      title: 'Writing Essaylar',
      desc: 'Band 6–9 gacha 1000+ real essay. Har biri tahlil qilingan, collocation va idiomlar belgilangan.',
      href: '/essays',
      color: t.accent,
    },
    {
      icon: '🧠',
      tag: 'B2 · C1 · C2',
      title: 'Vocabulary Zone',
      desc: '10,000+ so\'z CEFR darajalari bilan. O\'zbek tarjimasi, misol jumlalar, word family.',
      href: '/vocabulary',
      color: t.green,
    },
    {
      icon: '🎤',
      tag: 'Part 1 · 2 · 3',
      title: 'Speaking Tayyorgarlik',
      desc: 'Part 1, 2, 3 uchun namuna javoblar. C1/C2 vocabulary va examiner maslahatlari bilan.',
      href: '/speaking',
      color: '#9b5de5',
    },
    {
      icon: '🃏',
      tag: 'SM-2 algoritm',
      title: 'Flashcard & Study',
      desc: 'Spaced Repetition usulida so\'z yodlash. Cloze test, quiz va writing practice.',
      href: '/study',
      color: t.amber,
    },
    {
      icon: '🤖',
      tag: 'Claude + Groq AI',
      title: 'AI Essay Tahlil',
      desc: 'Essayingizni yuboring yoki o\'zingiz yozing. AI band skorini va tavsiyalar beradi.',
      href: '/ai-essay',
      color: '#ec4899',
    },
    {
      icon: '🏆',
      tag: 'Real sharoit',
      title: 'Mock Imtihon',
      desc: 'Haqiqiy IELTS kabi: vaqt, mavzu, AI baho. Chiqib ketib bo\'lmaydi.',
      href: '/mock',
      color: '#ef4444',
    },
  ]

  const steps = [
    { n: '01', title: 'Essay o\'qi', desc: 'Band 8+ essaylarni o\'qi, collocation va C1/C2 so\'zlarini yodlab ol' },
    { n: '02', title: 'So\'z yodla', desc: 'Flashcard bilan B2→C1→C2 so\'zlarni Spaced Repetition usulida yodla' },
    { n: '03', title: 'Essay yoz', desc: 'O\'rgangan so\'z va strukturalarni ishlatib essay yoz, AI tekshirsin' },
    { n: '04', title: 'Mock sinov', desc: 'Mock imtihonda o\'zingni sinab ko\'r, bandingni bil' },
  ]

  const stats = [
    { n: '1000+', label: 'Writing Essay', color: t.accent },
    { n: '10,000+', label: 'Vocabulary', color: t.amber },
    { n: 'B2→C2', label: 'CEFR darajalar', color: t.green },
    { n: 'AI', label: 'Essay tahlili', color: '#9b5de5' },
  ]

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ padding: '64px 24px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 300, pointerEvents: 'none',
          background: `radial-gradient(ellipse at center, ${t.accent}0a 0%, transparent 70%)`
        }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 16px', borderRadius: 20,
          border: `0.5px solid ${t.border2}`,
          background: `${t.accent}08`,
          fontSize: 11, color: t.accent,
          marginBottom: 20, fontFamily: 'monospace'
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.accent, display: 'inline-block' }} />
          Writing · Speaking · Vocabulary — O'zbek tilida
        </div>

        <h1 style={{ fontSize: 40, fontWeight: 500, lineHeight: 1.2, marginBottom: 14, letterSpacing: -0.5 }}>
          IELTS <span style={{ color: t.accent }}>Writing</span> va{' '}
          <span style={{ color: t.amber }}>Vocabulary</span>
          <br />uchun yagona platforma
        </h1>

        <p style={{ fontSize: 14, color: t.text2, maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.7 }}>
          Band 8+ essaylar, 10,000+ CEFR darajali so'zlar,
          AI tahlil — hammasi <strong style={{ color: t.text }}>o'zbek tilida</strong>
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/essays" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '11px 28px', borderRadius: 8, border: 'none',
              background: t.accent, color: t.bg,
              fontSize: 13, fontWeight: 500, cursor: 'pointer'
            }}>📝 Essaylarni ko'rish</button>
          </Link>
          <Link href="/vocabulary" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '11px 28px', borderRadius: 8,
              border: `0.5px solid ${t.border2}`,
              background: 'transparent', color: t.accent,
              fontSize: 13, fontWeight: 500, cursor: 'pointer'
            }}>🧠 Vocabulary</button>
          </Link>
          <Link href="/ai-essay" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '11px 28px', borderRadius: 8,
              border: `0.5px solid rgba(245,158,11,0.4)`,
              background: `${t.amber}10`, color: t.amber,
              fontSize: 13, fontWeight: 500, cursor: 'pointer'
            }}>🤖 AI Tahlil</button>
          </Link>
        </div>
      </section>

      {/* STATS */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: 8, padding: '0 24px 40px',
        maxWidth: 800, margin: '0 auto'
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: t.bg2, border: `0.5px solid ${t.border}`,
            borderRadius: 10, padding: '16px', textAlign: 'center'
          }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: s.color, marginBottom: 2 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: t.text2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 6 }}>
            Faqat <span style={{ color: t.accent }}>kerakli narsalar</span>
          </h2>
          <p style={{ fontSize: 13, color: t.text2 }}>
            Writing, Speaking va Vocabulary — ortiqcha hech narsa yo'q
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {features.map((f, i) => (
            <Link key={i} href={f.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: t.bg2, border: `0.5px solid ${t.border}`,
                borderRadius: 10, padding: 18, cursor: 'pointer',
                transition: 'all 0.2s', height: '100%'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = f.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
              >
                <div style={{ fontSize: 26, marginBottom: 10 }}>{f.icon}</div>
                <div style={{
                  display: 'inline-block', fontSize: 10, padding: '2px 8px',
                  borderRadius: 4, marginBottom: 8, fontFamily: 'monospace',
                  background: `${f.color}12`, color: f.color,
                  border: `0.5px solid ${f.color}30`
                }}>{f.tag}</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, color: t.text }}>{f.title}</div>
                <div style={{ fontSize: 11, color: t.text2, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background: t.bg2, borderTop: `0.5px solid ${t.border}`, borderBottom: `0.5px solid ${t.border}`, padding: '40px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontSize: 20, fontWeight: 500, textAlign: 'center', marginBottom: 6 }}>
            Qanday <span style={{ color: t.accent }}>ishlaydi?</span>
          </h2>
          <p style={{ fontSize: 13, color: t.text2, textAlign: 'center', marginBottom: 24 }}>
            4 qadam bilan Band 8+ ga yeting
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                background: t.bg, border: `0.5px solid ${t.border}`,
                borderRadius: 10, padding: 16, textAlign: 'center', position: 'relative'
              }}>
                <div style={{
                  fontSize: 26, fontWeight: 500, marginBottom: 8,
                  background: `linear-gradient(135deg, ${t.accent}, ${t.green})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>{s.n}</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 11, color: t.text2, lineHeight: 1.5 }}>{s.desc}</div>
                {i < 3 && (
                  <span style={{
                    position: 'absolute', right: -10, top: '50%',
                    transform: 'translateY(-50%)',
                    color: t.border2, fontSize: 16, zIndex: 1
                  }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TELEGRAM */}
      <div style={{ maxWidth: 960, margin: '40px auto', padding: '0 24px' }}>
        <div style={{
          background: t.bg2, border: `0.5px solid ${t.border}`,
          borderRadius: 14, padding: '28px 24px',
          display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, color: t.amber,
              border: `0.5px solid ${t.amber}40`,
              background: `${t.amber}08`,
              padding: '4px 12px', borderRadius: 4, marginBottom: 10, fontFamily: 'monospace'
            }}>📱 Telegram Bot</div>
            <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 8 }}>Telegramda ham o'rganing!</div>
            <div style={{ fontSize: 12, color: t.text2, marginBottom: 12, lineHeight: 1.6 }}>
              Kunlik 10 ta yangi so'z, flashcard va eslatmalar — Ebbinghaus Forgetting Curve asosida.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                'Kunlik vocabulary eslatmalar',
                'Ebbinghaus Forgetting Curve asosida',
                'Flashcard va testlar',
                'Bepul foydalanish',
              ].map((item, i) => (
                <span key={i} style={{ fontSize: 11, color: t.text2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: t.green }}>✓</span> {item}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
            <Link href="https://t.me/IeLtsEssay_platfom_bot" target="_blank" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%', padding: '10px 20px', borderRadius: 8,
                background: `${t.accent}15`, border: `0.5px solid ${t.border2}`,
                color: t.accent, fontSize: 12, fontWeight: 500, cursor: 'pointer'
              }}>📱 Botga o'tish →</button>
            </Link>
            <Link href="/essays" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%', padding: '10px 20px', borderRadius: 8,
                background: 'transparent', border: `0.5px solid ${t.border}`,
                color: t.text2, fontSize: 12, cursor: 'pointer'
              }}>Saytda davom etish</button>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '0 24px 48px' }}>
        <div style={{
          background: t.bg2, border: `0.5px solid ${t.border}`,
          borderRadius: 14, padding: '36px 24px',
          maxWidth: 560, margin: '0 auto'
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>Bugun boshlang! 🚀</h2>
          <p style={{ fontSize: 13, color: t.text2, marginBottom: 20 }}>
            O'zbek tilidagi yagona professional IELTS Writing platformasi
          </p>
          <Link href="/essays" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '12px 32px', borderRadius: 8, border: 'none',
              background: t.accent, color: t.bg,
              fontSize: 14, fontWeight: 500, cursor: 'pointer'
            }}>Bepul boshlash →</button>
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{
        borderTop: `1px solid ${t.border}`, padding: '16px 24px',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.accent, display: 'inline-block' }} />
          <span style={{ fontSize: 13, color: t.accent }}>Develop UZ</span>
        </div>
        <span style={{ fontSize: 11, color: t.text2 }}>Writing · Speaking · Vocabulary — O'zbek tilida</span>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { href: '/essays', label: 'Essays' },
            { href: '/vocabulary', label: 'Vocabulary' },
            { href: '/study', label: 'Study' },
            { href: '/ai-essay', label: 'AI Tahlil' },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 11, color: t.text2 }}>{l.label}</span>
            </Link>
          ))}
        </div>
      </footer>
    </div>
  )
}