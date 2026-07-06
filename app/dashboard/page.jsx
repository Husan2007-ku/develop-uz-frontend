'use client'
import Link from 'next/link'

const C = {
  bg: '#0D1117', bg2: '#0d1f2d', bg3: '#0a1628',
  border: 'rgba(0,245,255,0.15)', border2: 'rgba(0,245,255,0.3)',
  text: '#e2e8f0', text2: '#94a3b8',
  accent: '#00F5FF', amber: '#F59E0B', green: '#93E9BE',
}

export default function DashboardPage() {
  const stats = [
    { icon: '🔥', label: 'Streak', value: '0 kun', color: C.amber, bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
    { icon: '⭐', label: 'XP ball', value: '0', color: '#9b5de5', bg: 'rgba(149,76,233,0.1)', border: 'rgba(149,76,233,0.25)' },
    { icon: '🧠', label: 'Yodlangan', value: "0 so'z", color: C.accent, bg: 'rgba(0,245,255,0.08)', border: C.border },
    { icon: '📝', label: "O'qilgan", value: '0 essay', color: C.green, bg: 'rgba(147,233,190,0.08)', border: 'rgba(147,233,190,0.25)' },
  ]

  const quickLinks = [
    { icon: '✍️', title: 'Writing Essays', desc: '1000+ Band 6-9 essay', href: '/essays', color: C.accent },
    { icon: '🧠', title: 'Vocabulary', desc: "10,000+ so'z", href: '/vocabulary', color: C.green },
    { icon: '✏️', title: 'Study Zone', desc: 'Flashcard va testlar', href: '/study', color: '#9b5de5' },
    { icon: '📱', title: 'Telegram Bot', desc: 'Botda davom et', href: 'https://t.me/IeLtsEssay_platfom_bot', color: C.amber },
  ]

  const card = {
    background: C.bg2,
    border: `0.5px solid ${C.border}`,
    borderRadius: 10,
  }

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      {/* Header */}
      <div style={{ background: C.bg3, borderBottom: `1px solid ${C.border}`, padding: '16px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: C.accent, marginBottom: 3 }}>📊 Dashboard</h1>
        <p style={{ fontSize: 12, color: C.text2 }}>Progressingizni kuzating va o'rganishni davom eting</p>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ ...card, padding: 20, textAlign: 'center', background: s.bg, borderColor: s.border }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: s.color, marginBottom: 3 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.text2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Telegram notice */}
        <div style={{
          ...card, padding: 20, marginBottom: 24,
          background: 'rgba(0,245,255,0.04)',
          borderColor: C.border2
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ fontSize: 32, flexShrink: 0 }}>📱</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: C.accent }}>
                Telegram bot orqali kirish
              </div>
              <p style={{ fontSize: 12, color: C.text2, marginBottom: 14, lineHeight: 1.6 }}>
                To'liq progress, streak va XP ballarni ko'rish uchun Telegram botimizga kiring.
                Barcha ma'lumotlar bot orqali saqlanadi va Ebbinghaus Forgetting Curve asosida eslatiladi.
              </p>
              <Link href="https://t.me/IeLtsEssay_platfom_bot" target="_blank">
                <button style={{
                  padding: '8px 20px', borderRadius: 8,
                  background: `${C.accent}15`, border: `0.5px solid ${C.border2}`,
                  color: C.accent, fontSize: 12, fontWeight: 500, cursor: 'pointer'
                }}>📱 Botga o'tish →</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Progress bars (placeholder) */}
        <div style={{ ...card, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, color: C.text }}>📈 Haftalik progress</div>
          {[
            { label: 'Essays o\'qildi', value: 0, max: 10, color: C.accent },
            { label: "So'z yodlandi", value: 0, max: 50, color: C.green },
            { label: 'Flashcard sessiyalar', value: 0, max: 7, color: '#9b5de5' },
          ].map((p, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: C.text2 }}>{p.label}</span>
                <span style={{ fontSize: 12, color: p.color, fontFamily: 'monospace' }}>{p.value}/{p.max}</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                <div style={{
                  height: 4, borderRadius: 2,
                  width: `${(p.value / p.max) * 100}%`,
                  background: p.color, minWidth: p.value > 0 ? 8 : 0
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: C.text2 }}>🚀 Tezkor kirish</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {quickLinks.map((l, i) => (
            <Link key={i} href={l.href} style={{ textDecoration: 'none' }}>
              <div style={{
                ...card, padding: 16,
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = l.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <span style={{
                  fontSize: 24, width: 44, height: 44, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${l.color}12`, flexShrink: 0
                }}>{l.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 2 }}>{l.title}</div>
                  <div style={{ fontSize: 11, color: C.text2 }}>{l.desc}</div>
                </div>
                <span style={{ color: C.text2, fontSize: 16, opacity: 0.4 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
