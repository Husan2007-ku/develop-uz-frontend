'use client'
import { useState } from 'react'

const C = {
  bg: '#0D1117', bg2: '#0d1f2d', bg3: '#0a1628',
  border: 'rgba(0,245,255,0.15)', border2: 'rgba(0,245,255,0.3)',
  text: '#e2e8f0', text2: '#94a3b8',
  accent: '#00F5FF', amber: '#F59E0B', green: '#93E9BE',
}

const STRUCTURES = [
  // CONCESSION
  {
    id: 1, category: 'Concession', band: '7', task_type: 'task2', is_premium: false,
    title: 'Although / Even though',
    structure: 'Although + clause, + main clause',
    explanation_uz: 'Qarama-qarshi fikrni bildirish uchun ishlatiladi. Ikki jumlani birlashtiradi.',
    example_1: 'Although technology has improved communication, it has also led to increased social isolation.',
    example_2: 'Even though governments invest heavily in education, skill gaps remain prevalent.',
  },
  {
    id: 2, category: 'Concession', band: '7', task_type: 'task2', is_premium: false,
    title: 'While / Whereas',
    structure: 'While/Whereas + clause, + main clause',
    explanation_uz: 'Ikki fikrni taqqoslash uchun. "While" vaqtni ham bildirishi mumkin.',
    example_1: 'While some argue that globalisation benefits developing nations, others contend it exacerbates inequality.',
    example_2: 'Whereas urban residents enjoy better infrastructure, rural communities often lack basic services.',
  },
  {
    id: 3, category: 'Concession', band: '8', task_type: 'task2', is_premium: false,
    title: 'Despite / In spite of',
    structure: 'Despite/In spite of + noun/gerund, + main clause',
    explanation_uz: 'Biror narsa bo\'lishiga qaramay degan ma\'noni beradi.',
    example_1: 'Despite significant investment in renewable energy, fossil fuels continue to dominate global consumption.',
    example_2: 'In spite of widespread awareness campaigns, obesity rates have continued to rise.',
  },
  {
    id: 4, category: 'Concession', band: '8', task_type: 'task2', is_premium: false,
    title: 'Admittedly / It must be acknowledged that',
    structure: 'Admittedly, + clause. However, + main argument.',
    explanation_uz: 'Qarshi tomonning fikrini tan olish, keyin o\'z fikringizni kuchaytirish.',
    example_1: 'Admittedly, economic growth can generate employment opportunities. However, the environmental cost is often prohibitive.',
    example_2: 'It must be acknowledged that social media fosters connectivity. Nevertheless, its addictive nature poses serious risks.',
  },

  // ADDITION
  {
    id: 5, category: 'Addition', band: '7', task_type: 'both', is_premium: false,
    title: 'Furthermore / Moreover / In addition',
    structure: 'Furthermore/Moreover, + additional point',
    explanation_uz: 'Qo\'shimcha argument yoki misol qo\'shish uchun.',
    example_1: 'Furthermore, research consistently demonstrates a strong correlation between education and economic prosperity.',
    example_2: 'Moreover, the psychological benefits of regular exercise extend well beyond physical health.',
  },
  {
    id: 6, category: 'Addition', band: '8', task_type: 'task2', is_premium: false,
    title: 'Not only... but also',
    structure: 'Not only does/is + subject + verb, but it also + verb',
    explanation_uz: 'Ikkita muhim fikrni kuchaytirish uchun. Inversiya bilan ishlatiladi.',
    example_1: 'Not only does remote working reduce commuting costs, but it also enhances employee productivity and wellbeing.',
    example_2: 'Not only has globalisation accelerated economic growth, but it has also facilitated unprecedented cultural exchange.',
  },

  // CAUSE & EFFECT
  {
    id: 7, category: 'Cause & Effect', band: '7', task_type: 'both', is_premium: false,
    title: 'As a result / Consequently / Therefore',
    structure: 'As a result/Consequently, + effect',
    explanation_uz: 'Sabab-natija bog\'lanishini ifodalash uchun.',
    example_1: 'As a result of rapid urbanisation, many cities are struggling to provide adequate housing.',
    example_2: 'Consequently, millions of people lack access to clean drinking water.',
  },
  {
    id: 8, category: 'Cause & Effect', band: '8', task_type: 'task2', is_premium: false,
    title: 'This inevitably leads to',
    structure: 'This inevitably leads to + noun/gerund',
    explanation_uz: 'Muqarrar natijani ifodalash uchun. "inevitably" so\'zi kuchli ta\'sir qiladi.',
    example_1: 'Excessive screen time among adolescents inevitably leads to sleep deprivation and reduced academic performance.',
    example_2: 'Unchecked deforestation inevitably leads to the collapse of local ecosystems.',
  },

  // COMPARISON
  {
    id: 9, category: 'Comparison', band: '7', task_type: 'task1', is_premium: false,
    title: 'Compared to / In comparison with',
    structure: 'Compared to + noun, + main clause',
    explanation_uz: 'Task 1 da ikki narsani taqqoslash uchun. Juda ko\'p ishlatiladi.',
    example_1: 'Compared to 2010, the proportion of renewable energy users increased dramatically by 2020.',
    example_2: 'In comparison with developed nations, developing countries consume significantly less energy per capita.',
  },
  {
    id: 10, category: 'Comparison', band: '8', task_type: 'task1', is_premium: false,
    title: 'Significantly higher/lower than',
    structure: 'The figure for X was significantly higher/lower than that for Y',
    explanation_uz: 'Task 1 da raqamlarni taqqoslash uchun. "that for" — takrordan qochish.',
    example_1: 'The unemployment rate in urban areas was significantly higher than that in rural regions.',
    example_2: 'Sales figures for product A were considerably lower than those for product B throughout the period.',
  },

  // OPINION
  {
    id: 11, category: 'Opinion', band: '7', task_type: 'task2', is_premium: false,
    title: 'It is widely believed that',
    structure: 'It is widely believed/argued/accepted that + clause',
    explanation_uz: 'Umumiy fikrni bildirish uchun. Shaxsiy fikrdan uzoqlashish imkonini beradi.',
    example_1: 'It is widely believed that access to quality education is a fundamental human right.',
    example_2: 'It is commonly argued that governments bear primary responsibility for environmental protection.',
  },
  {
    id: 12, category: 'Opinion', band: '9', task_type: 'task2', is_premium: false,
    title: 'I would contend that',
    structure: 'I would contend/argue/maintain that + clause',
    explanation_uz: '"I think" ning Band 9 varianti. Qat\'iy pozitsiya bildiradi.',
    example_1: 'I would contend that the benefits of globalisation, while real, are distributed profoundly unevenly.',
    example_2: 'I would maintain that technological unemployment, though inevitable, can be mitigated through proactive policy.',
  },

  // PREMIUM structures
  {
    id: 13, category: 'Advanced', band: '9', task_type: 'task2', is_premium: true,
    title: 'The extent to which',
    structure: 'The extent to which + clause + determines/shapes + noun',
    explanation_uz: 'Akademik darajadagi murakkab struktura. Examinerga kuchli ta\'sir qiladi.',
    example_1: 'The extent to which social media influences political opinion remains a hotly contested question.',
    example_2: 'The extent to which governments prioritise economic growth over environmental sustainability determines long-term prosperity.',
  },
  {
    id: 14, category: 'Advanced', band: '9', task_type: 'task2', is_premium: true,
    title: 'What is particularly striking is',
    structure: 'What is particularly striking/significant/alarming is (that) + clause',
    explanation_uz: 'Diqqatni muhim fikrga jalb qilish uchun. C2 darajasida.',
    example_1: 'What is particularly striking is that despite decades of research, income inequality continues to widen globally.',
    example_2: 'What is especially alarming is the rate at which biodiversity loss is accelerating.',
  },
  {
    id: 15, category: 'Advanced', band: '9', task_type: 'both', is_premium: true,
    title: 'It is no coincidence that',
    structure: 'It is no coincidence that + clause',
    explanation_uz: 'Ikkita hodisa o\'rtasidagi bog\'liqlikni ta\'kidlash uchun.',
    example_1: 'It is no coincidence that the countries with the highest literacy rates also boast the strongest economies.',
    example_2: 'It is no coincidence that urban areas with robust public transport systems report lower pollution levels.',
  },
]

const CATEGORIES = ['Barchasi', 'Concession', 'Addition', 'Cause & Effect', 'Comparison', 'Opinion', 'Advanced']
const BANDS = ['Barchasi', '7', '8', '9']
const TASKS = ['Barchasi', 'task1', 'task2', 'both']

export default function GrammarPage() {
  const [category, setCategory] = useState('Barchasi')
  const [band, setBand] = useState('Barchasi')
  const [task, setTask] = useState('Barchasi')
  const [selected, setSelected] = useState(null)
  const [showPremium, setShowPremium] = useState(false)

  const filtered = STRUCTURES.filter(s => {
    if (category !== 'Barchasi' && s.category !== category) return false
    if (band !== 'Barchasi' && s.band !== band) return false
    if (task !== 'Barchasi' && s.task_type !== task && s.task_type !== 'both') return false
    return true
  })

  const free = filtered.filter(s => !s.is_premium)
  const premium = filtered.filter(s => s.is_premium)

  const bandColor = (b) => {
    if (b === '9') return C.accent
    if (b === '8') return C.green
    return C.amber
  }

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      <div style={{ background: C.bg3, borderBottom: `1px solid ${C.border}`, padding: '16px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: C.accent, marginBottom: 3 }}>📐 Grammar & Strukturalar</h1>
        <p style={{ fontSize: 12, color: C.text2 }}>
          Task 1 va Task 2 uchun Band 7–9 darajasidagi grammatik strukturalar
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

        {/* Filters */}
        <div style={{
          background: C.bg2, border: `0.5px solid ${C.border}`,
          borderRadius: 10, padding: 16, marginBottom: 20
        }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11, color: C.text2, marginBottom: 6 }}>Kategoriya:</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)} style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                    border: `0.5px solid ${category === c ? C.accent : C.border}`,
                    background: category === c ? `${C.accent}12` : 'transparent',
                    color: category === c ? C.accent : C.text2,
                  }}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.text2, marginBottom: 6 }}>Band:</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {BANDS.map(b => (
                  <button key={b} onClick={() => setBand(b)} style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                    border: `0.5px solid ${band === b ? bandColor(b) : C.border}`,
                    background: band === b ? `${bandColor(b)}12` : 'transparent',
                    color: band === b ? bandColor(b) : C.text2,
                  }}>{b === 'Barchasi' ? b : `Band ${b}`}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.text2, marginBottom: 6 }}>Task turi:</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {TASKS.map(t => (
                  <button key={t} onClick={() => setTask(t)} style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                    border: `0.5px solid ${task === t ? C.accent : C.border}`,
                    background: task === t ? `${C.accent}12` : 'transparent',
                    color: task === t ? C.accent : C.text2,
                  }}>
                    {t === 'Barchasi' ? t : t === 'both' ? 'Ikkalasi' : t === 'task1' ? 'Task 1' : 'Task 2'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 16 }}>

          {/* Structure list */}
          <div>
            <div style={{ fontSize: 12, color: C.text2, marginBottom: 10 }}>
              {free.length} ta bepul struktura
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {free.map(s => (
                <div key={s.id} onClick={() => setSelected(selected?.id === s.id ? null : s)} style={{
                  background: selected?.id === s.id ? `${C.accent}08` : C.bg2,
                  border: `0.5px solid ${selected?.id === s.id ? C.accent : C.border}`,
                  borderRadius: 10, padding: 14, cursor: 'pointer', transition: 'all 0.15s'
                }}
                  onMouseEnter={e => { if (selected?.id !== s.id) e.currentTarget.style.borderColor = C.border2 }}
                  onMouseLeave={e => { if (selected?.id !== s.id) e.currentTarget.style.borderColor = C.border }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 10, padding: '2px 7px', borderRadius: 4, fontFamily: 'monospace',
                          background: `${bandColor(s.band)}12`, color: bandColor(s.band),
                          border: `0.5px solid ${bandColor(s.band)}30`
                        }}>Band {s.band}</span>
                        <span style={{
                          fontSize: 10, padding: '2px 7px', borderRadius: 4,
                          background: `${C.accent}10`, color: C.accent, fontFamily: 'monospace'
                        }}>{s.category}</span>
                        <span style={{
                          fontSize: 10, padding: '2px 7px', borderRadius: 4,
                          background: 'rgba(255,255,255,0.05)', color: C.text2
                        }}>{s.task_type === 'both' ? 'Task 1 & 2' : s.task_type === 'task1' ? 'Task 1' : 'Task 2'}</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{s.title}</div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: 12, color: C.accent, fontFamily: 'monospace',
                    background: `${C.accent}06`, borderRadius: 6, padding: '6px 10px'
                  }}>{s.structure}</div>
                </div>
              ))}
            </div>

            {/* Premium locked */}
            {premium.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 10
                }}>
                  <div style={{ fontSize: 12, color: C.text2 }}>🔒 Premium strukturalar ({premium.length} ta)</div>
                  <button onClick={() => setShowPremium(!showPremium)} style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                    border: `0.5px solid ${C.amber}40`, background: `${C.amber}08`, color: C.amber
                  }}>{showPremium ? 'Yopish' : 'Ko\'rish'}</button>
                </div>
                {showPremium && premium.map(s => (
                  <div key={s.id} style={{
                    background: C.bg2, border: `0.5px solid ${C.amber}20`,
                    borderRadius: 10, padding: 14, marginBottom: 8,
                    opacity: 0.7, position: 'relative', overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 10, zIndex: 1
                    }}>
                      <span style={{
                        fontSize: 12, color: C.amber,
                        background: C.bg2, padding: '8px 20px',
                        borderRadius: 8, border: `0.5px solid ${C.amber}40`
                      }}>🔒 Premium obunasi kerak</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: C.accent, marginTop: 6, fontFamily: 'monospace' }}>{s.structure}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ position: 'sticky', top: 80, alignSelf: 'start' }}>
              <div style={{
                background: C.bg2, border: `0.5px solid ${C.accent}40`,
                borderRadius: 12, padding: 20
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 500, color: C.text }}>{selected.title}</h3>
                  <button onClick={() => setSelected(null)} style={{
                    background: 'none', border: 'none', color: C.text2, fontSize: 18, cursor: 'pointer'
                  }}>×</button>
                </div>

                {/* Structure */}
                <div style={{
                  background: `${C.accent}08`, border: `0.5px solid ${C.border2}`,
                  borderRadius: 8, padding: 12, marginBottom: 14, fontFamily: 'monospace',
                  fontSize: 13, color: C.accent
                }}>{selected.structure}</div>

                {/* Explanation */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: C.text2, marginBottom: 6 }}>Izoh (o'zbekcha):</div>
                  <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{selected.explanation_uz}</div>
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                  <span style={{
                    fontSize: 11, padding: '3px 9px', borderRadius: 4, fontFamily: 'monospace',
                    background: `${bandColor(selected.band)}12`, color: bandColor(selected.band)
                  }}>Band {selected.band}</span>
                  <span style={{
                    fontSize: 11, padding: '3px 9px', borderRadius: 4,
                    background: `${C.accent}10`, color: C.accent
                  }}>{selected.category}</span>
                  <span style={{
                    fontSize: 11, padding: '3px 9px', borderRadius: 4,
                    background: 'rgba(255,255,255,0.05)', color: C.text2
                  }}>
                    {selected.task_type === 'both' ? 'Task 1 & 2' : selected.task_type === 'task1' ? 'Task 1' : 'Task 2'}
                  </span>
                </div>

                {/* Examples */}
                <div style={{ fontSize: 11, color: C.text2, marginBottom: 10 }}>Misollar:</div>
                {[selected.example_1, selected.example_2].filter(Boolean).map((ex, i) => (
                  <div key={i} style={{
                    fontSize: 12, color: C.text, fontStyle: 'italic', lineHeight: 1.7,
                    padding: '8px 12px', marginBottom: 10,
                    borderLeft: `2px solid ${C.accent}30`,
                    background: 'rgba(0,245,255,0.03)', borderRadius: '0 6px 6px 0'
                  }}>"{ex}"</div>
                ))}

                <button style={{
                  width: '100%', padding: '10px', borderRadius: 8,
                  background: `${C.accent}12`, border: `0.5px solid ${C.border2}`,
                  color: C.accent, fontSize: 12, fontWeight: 500, cursor: 'pointer'
                }}>+ Shaxsiy ro'yxatga qo'shish</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}