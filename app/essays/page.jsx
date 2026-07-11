'use client'
import { useState, useEffect } from 'react'

const C = {
  bg: '#0D1117', bg2: '#0d1f2d', bg3: '#0a1628',
  border: 'rgba(0,245,255,0.15)', border2: 'rgba(0,245,255,0.3)',
  text: '#e2e8f0', text2: '#94a3b8',
  accent: '#00F5FF', amber: '#F59E0B', green: '#93E9BE',
}

const API = 'https://develop-uz-api.onrender.com'
const TELEGRAM_ID = 7311844154

const BAND_COLOR = (score) => {
  if (score >= 8) return 'rgba(147,233,190,0.2)'
  if (score >= 7) return 'rgba(0,245,255,0.15)'
  return 'rgba(245,158,11,0.2)'
}

const BAND_TEXT = (score) => {
  if (score >= 8) return '#93E9BE'
  if (score >= 7) return '#00F5FF'
  return '#F59E0B'
}

const TYPE_LABELS = {
  evaluation: 'Evaluation',
  comparison: 'Comparison',
  cause_effect: 'Cause & Effect',
  speculation: 'Speculation',
  reasoning: 'Reasoning',
}

const HL_COLORS = {
  collocation: { bg: 'rgba(245,158,11,0.25)', color: '#F59E0B', label: 'Collocation' },
  idiom: { bg: 'rgba(147,233,190,0.25)', color: '#93E9BE', label: 'Idiom' },
  c1_vocab: { bg: 'rgba(0,245,255,0.2)', color: '#00F5FF', label: 'C1' },
  c2_vocab: { bg: 'rgba(149,76,233,0.25)', color: '#9b5de5', label: 'C2' },
}

export default function EssaysPage() {
  const [essays, setEssays] = useState([])
  const [selected, setSelected] = useState(null)
  const [highlights, setHighlights] = useState([])
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analyzingHL, setAnalyzingHL] = useState(false)
  const [vocabNotes, setVocabNotes] = useState('')
  const [grammarNotes, setGrammarNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedHL, setSelectedHL] = useState(null)

  useEffect(() => {
    fetch(`${API}/essays/?limit=20`)
      .then(r => r.json())
      .then(d => { setEssays(d.essays || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function selectEssay(essay) {
    if (!essay.id) return
    setSelected(null)
    setShowAnalysis(false)
    setHighlights([])
    setSelectedHL(null)
    try {
      const res = await fetch(`${API}/essays/${essay.id}`)
      const data = await res.json()
      setSelected(data)
      setHighlights(data.highlights || [])
      const notesRes = await fetch(`${API}/essays/${essay.id}/notes/${TELEGRAM_ID}`)
      const notes = await notesRes.json()
      setVocabNotes(notes.vocab_notes || '')
      setGrammarNotes(notes.grammar_notes || '')
      setSaved(false)
    } catch (e) {
      console.error(e)
    }
  }

  async function toggleAnalysis() {
    if (showAnalysis) {
      setShowAnalysis(false)
      return
    }

    // Highlights yo'q bo'lsa AI dan olamiz
    if (highlights.length === 0 && selected) {
      setAnalyzingHL(true)
      try {
        const res = await fetch(`${API}/ai/highlights/detect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: selected.content })
        })
        const data = await res.json()
        setHighlights(data.highlights || [])
      } catch (e) {
        console.error(e)
      }
      setAnalyzingHL(false)
    }
    setShowAnalysis(true)
  }

  async function saveNotes() {
    if (!selected) return
    try {
      await fetch(`${API}/essays/${selected.id}/notes/${TELEGRAM_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vocab_notes: vocabNotes, grammar_notes: grammarNotes })
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) { console.error(e) }
  }

  function renderContent(content) {
    if (!showAnalysis || highlights.length === 0) {
      return content.split('\n\n').map((p, i) => (
        <p key={i} style={{ marginBottom: 16, lineHeight: 1.9, color: C.text }}>{p}</p>
      ))
    }

    let result = []
    let lastIdx = 0
    const sorted = [...highlights].sort((a, b) => (a.start_index || 0) - (b.start_index || 0))

    sorted.forEach((h, i) => {
      const idx = h.start_index !== undefined
        ? h.start_index
        : content.indexOf(h.text, lastIdx)

      if (idx === -1 || idx < lastIdx) return

      if (idx > lastIdx) {
        result.push(<span key={`t${i}`}>{content.slice(lastIdx, idx)}</span>)
      }

      const hl = HL_COLORS[h.highlight_type || h.type] || HL_COLORS.c1_vocab
      const end = h.end_index !== undefined ? h.end_index : idx + h.text.length

      result.push(
        <span key={`h${i}`}
          onClick={() => setSelectedHL(selectedHL?.text === h.text ? null : h)}
          style={{
            background: hl.bg, color: hl.color,
            padding: '1px 3px', borderRadius: 3, cursor: 'pointer',
            border: `0.5px solid ${selectedHL?.text === h.text ? hl.color : 'transparent'}`,
          }}
          title={h.explanation_uz || h.how_to_use || ''}>
          {content.slice(idx, end)}
        </span>
      )
      lastIdx = end
    })

    if (lastIdx < content.length) {
      result.push(<span key="last">{content.slice(lastIdx)}</span>)
    }

    return <p style={{ lineHeight: 1.9, fontSize: 14, color: C.text }}>{result}</p>
  }

  const filtered = filter === 'all' ? essays : essays.filter(e => e.question_type === filter)

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      <div style={{ background: C.bg3, borderBottom: `1px solid ${C.border}`, padding: '14px 24px' }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: C.accent, marginBottom: 2 }}>Writing Essays</h1>
        <p style={{ fontSize: 12, color: C.text2 }}>Band 6-9 gacha real IELTS Writing Task 2 essaylar</p>
      </div>

      <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 110px)' }}>

        {/* PANEL 1 — Essay ro'yxati */}
        <div style={{
          width: 260, flexShrink: 0, borderRight: `1px solid ${C.border}`,
          display: 'flex', flexDirection: 'column', background: C.bg
        }}>
          <div style={{ padding: '12px 14px', borderBottom: `0.5px solid ${C.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: C.text, marginBottom: 8 }}>Essay kutubxonasi</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {['all', 'evaluation', 'reasoning', 'comparison'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 6, cursor: 'pointer',
                  border: `0.5px solid ${filter === f ? C.accent : C.border}`,
                  background: filter === f ? `${C.accent}12` : 'transparent',
                  color: filter === f ? C.accent : C.text2,
                }}>{f === 'all' ? 'Barchasi' : TYPE_LABELS[f] || f}</button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: C.text2, fontSize: 12 }}>Yuklanmoqda...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: C.text2, fontSize: 12 }}>Essay topilmadi</div>
            ) : filtered.map(essay => (
              <div key={essay.id} onClick={() => selectEssay(essay)} style={{
                padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                marginBottom: 6, transition: 'all 0.15s',
                background: selected?.id === essay.id ? `${C.accent}10` : 'transparent',
                border: `0.5px solid ${selected?.id === essay.id ? C.accent : C.border}`,
              }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 5, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 10, padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace',
                    background: BAND_COLOR(essay.band_score), color: BAND_TEXT(essay.band_score)
                  }}>{essay.band_score}</span>
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: C.text2 }}>
                    {TYPE_LABELS[essay.question_type] || essay.question_type}
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.text, lineHeight: 1.4, marginBottom: 3 }}>
                  {essay.title}
                </div>
                <div style={{ fontSize: 10, color: C.text2 }}>{essay.word_count} so'z</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '8px 14px', borderTop: `0.5px solid ${C.border}`, fontSize: 10, color: C.text2 }}>
            Bepul: 10 ta · 🔒 Premium: ko'proq
          </div>
        </div>

        {/* PANEL 2 — Essay matni */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.bg }}>
          {!selected ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.text2 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.2 }}>📝</div>
                <div style={{ fontSize: 13 }}>Chap tomondagi essayni bosing</div>
              </div>
            </div>
          ) : (
            <>
              {/* Essay header */}
              <div style={{ padding: '12px 20px', borderBottom: `0.5px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: C.text, marginBottom: 6, lineHeight: 1.4 }}>{selected.title}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: BAND_COLOR(selected.band_score), color: BAND_TEXT(selected.band_score), fontFamily: 'monospace' }}>Band {selected.band_score}</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: C.text2 }}>{TYPE_LABELS[selected.question_type] || selected.question_type}</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: C.text2 }}>{selected.word_count} so'z</span>
                  </div>
                </div>
                <button onClick={toggleAnalysis} disabled={analyzingHL} style={{
                  flexShrink: 0, padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  border: `0.5px solid ${showAnalysis ? C.accent : C.border}`,
                  background: showAnalysis ? `${C.accent}15` : 'transparent',
                  color: showAnalysis ? C.accent : C.text2,
                }}>
                  {analyzingHL ? '⏳ Tahlil...' : showAnalysis ? '✅ Tahlil ON' : '🔍 Tahlil'}
                </button>
              </div>

              {/* Highlights legend */}
              {showAnalysis && highlights.length > 0 && (
                <div style={{ padding: '6px 20px', borderBottom: `0.5px solid ${C.border}`, display: 'flex', gap: 12, flexWrap: 'wrap', background: 'rgba(0,245,255,0.02)', flexShrink: 0 }}>
                  {Object.entries(HL_COLORS).map(([type, style]) => (
                    <span key={type} style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4, color: C.text2 }}>
                      <span style={{ display: 'inline-block', width: 8, height: 8, background: style.bg, borderRadius: 2 }} />
                      {style.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Selected highlight tooltip */}
              {selectedHL && showAnalysis && (
                <div style={{ padding: '8px 20px', borderBottom: `0.5px solid ${C.border}`, background: `${HL_COLORS[selectedHL.highlight_type || selectedHL.type]?.color || C.accent}08`, flexShrink: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: HL_COLORS[selectedHL.highlight_type || selectedHL.type]?.color || C.accent }}>
                        {selectedHL.text}
                      </span>
                      {selectedHL.explanation_uz && (
                        <span style={{ fontSize: 12, color: C.text2, marginLeft: 10 }}>🇺🇿 {selectedHL.explanation_uz}</span>
                      )}
                    </div>
                    <button onClick={() => setSelectedHL(null)} style={{ background: 'none', border: 'none', color: C.text2, cursor: 'pointer', fontSize: 16 }}>×</button>
                  </div>
                  {selectedHL.how_to_use && (
                    <div style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', marginTop: 4 }}>{selectedHL.how_to_use}</div>
                  )}
                </div>
              )}

              {/* Essay content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                {renderContent(selected.content)}
              </div>
            </>
          )}
        </div>

        {/* PANEL 3 — Qaydlar */}
        <div style={{ width: 240, flexShrink: 0, borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', background: C.bg }}>

          {/* Vocab notes */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderBottom: `0.5px solid ${C.border}` }}>
            <div style={{ padding: '10px 12px', borderBottom: `0.5px solid ${C.border}`, flexShrink: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: C.amber }}>📌 Qaydlarim — Vocabulary</div>
              <div style={{ fontSize: 10, color: C.text2, marginTop: 2 }}>Yoqqan so'zlarni yozing</div>
            </div>
            <textarea
              value={vocabNotes}
              onChange={e => { setVocabNotes(e.target.value); setSaved(false) }}
              placeholder={selected ? "Masalan:\nexacerbate — yomonlashtirmoq\nfoster — rivojlantirmoq" : "Essay tanlang..."}
              disabled={!selected}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                padding: '10px 12px', color: C.text, fontSize: 12,
                resize: 'none', fontFamily: 'inherit', lineHeight: 1.6
              }}
            />
          </div>

          {/* Grammar notes */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 12px', borderBottom: `0.5px solid ${C.border}`, flexShrink: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: C.accent }}>📐 Qaydlarim — Grammatika</div>
              <div style={{ fontSize: 10, color: C.text2, marginTop: 2 }}>Yoqqan strukturalarni yozing</div>
            </div>
            <textarea
              value={grammarNotes}
              onChange={e => { setGrammarNotes(e.target.value); setSaved(false) }}
              placeholder={selected ? "Masalan:\nWhile... , critics argue...\nNot only... but also..." : "Essay tanlang..."}
              disabled={!selected}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                padding: '10px 12px', color: C.text, fontSize: 12,
                resize: 'none', fontFamily: 'inherit', lineHeight: 1.6
              }}
            />
          </div>

          {/* Save button */}
          <div style={{ padding: '10px 12px', borderTop: `0.5px solid ${C.border}`, flexShrink: 0 }}>
            <button onClick={saveNotes} disabled={!selected} style={{
              width: '100%', padding: '9px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: selected ? 'pointer' : 'not-allowed',
              border: `0.5px solid ${saved ? `${C.green}40` : selected ? C.border2 : C.border}`,
              background: saved ? `${C.green}15` : selected ? `${C.accent}10` : 'rgba(255,255,255,0.02)',
              color: saved ? C.green : selected ? C.accent : C.text2,
            }}>
              {saved ? '✅ Saqlandi!' : '💾 Saqlash'}
            </button>
            <div style={{ fontSize: 10, color: C.text2, textAlign: 'center', marginTop: 6 }}>
              Bot orqali eslatiladi
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}