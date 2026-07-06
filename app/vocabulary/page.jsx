'use client'
import { useState, useEffect } from 'react'

const C = {
  bg: '#0D1117', bg2: '#0d1f2d', bg3: '#0a1628',
  border: 'rgba(0,245,255,0.15)', border2: 'rgba(0,245,255,0.3)',
  text: '#e2e8f0', text2: '#94a3b8',
  accent: '#00F5FF', amber: '#F59E0B', green: '#93E9BE',
}

const LEVEL_STYLE = {
  B2: { bg: 'rgba(147,233,190,0.12)', color: '#93E9BE', border: 'rgba(147,233,190,0.3)' },
  C1: { bg: 'rgba(0,245,255,0.1)', color: '#00F5FF', border: 'rgba(0,245,255,0.3)' },
  C2: { bg: 'rgba(149,76,233,0.12)', color: '#9b5de5', border: 'rgba(149,76,233,0.3)' },
}

const TYPE_STYLE = {
  Noun: { bg: 'rgba(0,245,255,0.08)', color: '#00F5FF' },
  Verb: { bg: 'rgba(147,233,190,0.08)', color: '#93E9BE' },
  Adj: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  Phrase: { bg: 'rgba(236,72,153,0.1)', color: '#ec4899' },
  Idiom: { bg: 'rgba(149,76,233,0.1)', color: '#9b5de5' },
  Collocation: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
}

export default function VocabularyPage() {
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/vocabulary/?limit=50')
      .then(r => r.json())
      .then(d => { setWords(d.words || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = words.filter(w => {
    const matchLevel = filter === 'all' || w.cefr_level === filter
    const matchSearch = w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.translation_uz.toLowerCase().includes(search.toLowerCase())
    return matchLevel && matchSearch
  })

  const card = {
    background: C.bg2, border: `0.5px solid ${C.border}`,
    borderRadius: 10, padding: 14
  }

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      {/* Header */}
      <div style={{ background: C.bg3, borderBottom: `1px solid ${C.border}`, padding: '16px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: C.accent, marginBottom: 3 }}>🧠 Vocabulary</h1>
        <p style={{ fontSize: 12, color: C.text2 }}>B2, C1, C2 darajali so'zlar — O'zbek tarjimasi bilan</p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="So'z qidirish..."
            style={{
              flex: 1, minWidth: 200, padding: '8px 14px', borderRadius: 8,
              border: `0.5px solid ${C.border}`, background: C.bg2,
              color: C.text, fontSize: 13, outline: 'none', fontFamily: 'inherit'
            }}
          />
          <div style={{ display: 'flex', gap: 4 }}>
            {['all', 'B2', 'C1', 'C2'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                border: `0.5px solid ${filter === f ? (f === 'B2' ? C.green : f === 'C1' ? C.accent : f === 'C2' ? '#9b5de5' : C.accent) : C.border}`,
                background: filter === f ? (f === 'B2' ? `${C.green}15` : f === 'C1' ? `${C.accent}12` : f === 'C2' ? 'rgba(149,76,233,0.12)' : `${C.accent}12`) : 'transparent',
                color: filter === f ? (f === 'B2' ? C.green : f === 'C1' ? C.accent : f === 'C2' ? '#9b5de5' : C.accent) : C.text2,
              }}>
                {f === 'all' ? 'Barchasi' : f}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 12, color: C.text2 }}>{filtered.length} ta so'z</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 320px' : '1fr', gap: 16 }}>
          {/* Word list */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10, alignContent: 'start' }}>
            {loading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: C.text2 }}>
                Yuklanmoqda...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: C.text2 }}>
                So'z topilmadi
              </div>
            ) : filtered.map(w => {
              const lvStyle = LEVEL_STYLE[w.cefr_level] || LEVEL_STYLE.B2
              const tyStyle = TYPE_STYLE[w.word_type] || TYPE_STYLE.Noun
              const isSelected = selected?.id === w.id
              return (
                <div key={w.id} onClick={() => setSelected(isSelected ? null : w)}
                  style={{
                    ...card,
                    cursor: 'pointer',
                    borderColor: isSelected ? C.accent : C.border,
                    background: isSelected ? 'rgba(0,245,255,0.05)' : C.bg2,
                    transition: 'all 0.15s'
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 500, color: C.text }}>{w.word}</span>
                    <span style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 4, fontFamily: 'monospace', fontWeight: 500,
                      background: lvStyle.bg, color: lvStyle.color, border: `0.5px solid ${lvStyle.border}`
                    }}>{w.cefr_level}</span>
                  </div>
                  <div style={{ fontSize: 13, color: C.text2, marginBottom: 8 }}>🇺🇿 {w.translation_uz}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 4,
                      background: tyStyle.bg, color: tyStyle.color
                    }}>{w.word_type}</span>
                  </div>
                  {w.example_1 && (
                    <div style={{
                      fontSize: 11, color: C.text2, fontStyle: 'italic',
                      borderTop: `0.5px solid ${C.border}`, paddingTop: 8, marginTop: 8,
                      lineHeight: 1.5
                    }}>"{w.example_1}"</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Word detail panel */}
          {selected && (
            <div style={{ position: 'sticky', top: 80, alignSelf: 'start' }}>
              <div style={{ ...card, borderColor: C.accent }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 500, color: C.accent, marginBottom: 2 }}>{selected.word}</div>
                    <div style={{ fontSize: 12, color: C.text2 }}>🇺🇿 {selected.translation_uz}</div>
                  </div>
                  <button onClick={() => setSelected(null)} style={{
                    background: 'none', border: 'none', color: C.text2, fontSize: 18, cursor: 'pointer'
                  }}>×</button>
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
                  {[
                    { label: selected.cefr_level, style: LEVEL_STYLE[selected.cefr_level] },
                    { label: selected.word_type, style: TYPE_STYLE[selected.word_type] || TYPE_STYLE.Noun },
                  ].map((b, i) => (
                    <span key={i} style={{
                      fontSize: 11, padding: '3px 9px', borderRadius: 4, fontFamily: 'monospace',
                      background: b.style?.bg, color: b.style?.color,
                      border: b.style?.border ? `0.5px solid ${b.style.border}` : 'none'
                    }}>{b.label}</span>
                  ))}
                </div>

                {/* Definition */}
                {selected.definition_uz && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: C.text2, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Ta'rif</div>
                    <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{selected.definition_uz}</div>
                  </div>
                )}

                {/* Examples */}
                {(selected.example_1 || selected.example_2 || selected.example_3) && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: C.text2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Misollar</div>
                    {[selected.example_1, selected.example_2, selected.example_3].filter(Boolean).map((ex, i) => (
                      <div key={i} style={{
                        fontSize: 12, color: C.text, fontStyle: 'italic', lineHeight: 1.6,
                        padding: '6px 10px', borderLeft: `2px solid ${C.accent}20`,
                        marginBottom: 6, background: 'rgba(0,245,255,0.03)', borderRadius: '0 6px 6px 0'
                      }}>"{ex}"</div>
                    ))}
                  </div>
                )}

                {/* Collocations */}
                {selected.collocations && selected.collocations.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: C.text2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Collocations</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {selected.collocations.map((c, i) => (
                        <span key={i} style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace',
                          background: `${C.amber}12`, color: C.amber, border: `0.5px solid ${C.amber}30`
                        }}>{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Word family */}
                {selected.word_family && Object.keys(selected.word_family).length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, color: C.text2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>So'z oilasi</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {Object.entries(selected.word_family).map(([type, word], i) => (
                        <span key={i} style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 4,
                          background: 'rgba(255,255,255,0.05)', color: C.text2,
                          fontFamily: 'monospace'
                        }}><span style={{ color: C.text2, opacity: 0.6 }}>{type}:</span> {word}</span>
                      ))}
                    </div>
                  </div>
                )}

                <button style={{
                  width: '100%', marginTop: 16, padding: '10px', borderRadius: 8,
                  background: `${C.accent}15`, border: `0.5px solid ${C.border2}`,
                  color: C.accent, fontSize: 12, fontWeight: 500, cursor: 'pointer'
                }}>+ Shaxsiy vocabularyga qo'shish</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
