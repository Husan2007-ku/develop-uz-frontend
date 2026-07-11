'use client'
import { useState } from 'react'
import Link from 'next/link'

const C = {
  bg: '#0D1117', bg2: '#0d1f2d', bg3: '#0a1628',
  border: 'rgba(0,245,255,0.15)', border2: 'rgba(0,245,255,0.3)',
  text: '#e2e8f0', text2: '#94a3b8',
  accent: '#00F5FF', amber: '#F59E0B', green: '#93E9BE',
}

const API = 'https://develop-uz-api.onrender.com'
const TELEGRAM_ID = 7311844154

const HL_STYLE = {
  collocation: { bg: 'rgba(245,158,11,0.25)', color: '#F59E0B', label: 'Collocation', border: 'rgba(245,158,11,0.4)' },
  idiom: { bg: 'rgba(147,233,190,0.25)', color: '#93E9BE', label: 'Idiom', border: 'rgba(147,233,190,0.4)' },
  c1_vocab: { bg: 'rgba(0,245,255,0.2)', color: '#00F5FF', label: 'C1 Vocab', border: 'rgba(0,245,255,0.35)' },
  c2_vocab: { bg: 'rgba(149,76,233,0.25)', color: '#9b5de5', label: 'C2 Vocab', border: 'rgba(149,76,233,0.4)' },
}

const SAMPLE_TEXTS = [
  {
    label: 'Academic article',
    text: `A growing body of evidence suggests that social media platforms, despite their ostensible purpose of fostering connectivity, may in fact exacerbate feelings of loneliness and social isolation among young adults. Researchers have consistently found that passive consumption of curated content — scrolling through carefully crafted highlight reels of others' lives — takes a considerable toll on self-esteem and mental wellbeing. What is particularly alarming is the rate at which these platforms are being adopted by increasingly younger demographics, raising profound questions about long-term psychological consequences.`
  },
  {
    label: 'IELTS essay (Band 8)',
    text: `It is widely contended that governments bear primary responsibility for tackling climate change through stringent legislation and international cooperation. While individual behavioural change undoubtedly plays a role, the scale and urgency of the environmental crisis demands systemic intervention that only state actors can provide. Furthermore, multinational corporations, which contribute disproportionately to global carbon emissions, can only be held accountable through robust regulatory frameworks — something that voluntary corporate pledges have demonstrably failed to achieve.`
  },
  {
    label: 'News article',
    text: `The proliferation of artificial intelligence across virtually every sector of the economy has sparked intense debate about the future of work. Proponents argue that AI will ultimately create more jobs than it displaces, pointing to historical precedent from previous waves of technological disruption. Sceptics, however, contend that the pace of this particular transformation is unprecedented, leaving insufficient time for workers and educational institutions to adapt. The socioeconomic ramifications could be particularly acute for middle-income earners whose roles involve routine cognitive tasks.`
  }
]

export default function SampleCollectorPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [highlights, setHighlights] = useState([])
  const [analyzed, setAnalyzed] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedHL, setSelectedHL] = useState(null)
  const [savedWords, setSavedWords] = useState([])
  const [savingId, setSavingId] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  async function analyzeText() {
    if (text.trim().length < 50) return
    setLoading(true)
    setHighlights([])
    setAnalyzed(false)
    setSelectedHL(null)
    setSavedWords([])
    try {
      const res = await fetch(`${API}/ai/sample/highlight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      const data = await res.json()
      setHighlights(data.highlights || [])
      setAnalyzed(true)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function saveToVocab(hl) {
    const key = hl.text
    if (savedWords.find(w => w.text === key)) return
    setSavingId(key)

    try {
      // 1. Vocabulary da qidirish
      const searchRes = await fetch(`${API}/vocabulary/search/${encodeURIComponent(hl.text)}`)
      const searchData = await searchRes.json()

      if (searchData.results && searchData.results.length > 0) {
        // Topilsa — user vocabulary ga qo'shish
        const word = searchData.results[0]
        await fetch(`${API}/vocabulary/user/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telegram_id: TELEGRAM_ID,
            vocab_id: word.id,
            source: 'sample'
          })
        })
      }
      // Topilmasa ham — local state ga qo'shamiz
      setSavedWords(prev => [...prev, { ...hl, saved: true }])
    } catch (e) {
      console.error(e)
      setSavedWords(prev => [...prev, { ...hl, saved: false }])
    }
    setSavingId(null)
  }

  async function saveAllToVocab() {
    if (savedWords.length === 0) return
    setSaveSuccess(false)

    for (const hl of highlights) {
      if (!savedWords.find(w => w.text === hl.text)) {
        await saveToVocab(hl)
      }
    }
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  function renderHighlighted() {
    if (!analyzed || highlights.length === 0) {
      return text.split('\n').map((line, i) => (
        <p key={i} style={{ marginBottom: 10, lineHeight: 1.9 }}>{line}</p>
      ))
    }

    let result = []
    let lastIdx = 0
    const sorted = [...highlights].sort((a, b) => {
      const ai = text.indexOf(a.text)
      const bi = text.indexOf(b.text)
      return ai - bi
    })

    sorted.forEach((hl, i) => {
      const idx = text.indexOf(hl.text, lastIdx)
      if (idx === -1) return
      if (idx > lastIdx) {
        result.push(<span key={`t${i}`}>{text.slice(lastIdx, idx)}</span>)
      }
      const style = HL_STYLE[hl.type] || HL_STYLE.c1_vocab
      const isSaved = savedWords.find(w => w.text === hl.text)
      result.push(
        <span key={`h${i}`}
          onClick={() => setSelectedHL(selectedHL?.text === hl.text ? null : hl)}
          style={{
            background: style.bg,
            color: style.color,
            padding: '1px 4px',
            borderRadius: 4,
            cursor: 'pointer',
            border: `0.5px solid ${selectedHL?.text === hl.text ? style.color : isSaved ? style.color : 'transparent'}`,
            textDecoration: isSaved ? 'underline' : 'none',
            transition: 'all 0.15s'
          }}
          title={hl.explanation_uz}>
          {hl.text}
        </span>
      )
      lastIdx = idx + hl.text.length
    })

    if (lastIdx < text.length) {
      result.push(<span key="last">{text.slice(lastIdx)}</span>)
    }

    return <p style={{ lineHeight: 1.9, fontSize: 14 }}>{result}</p>
  }

  const filteredHL = activeFilter === 'all'
    ? highlights
    : highlights.filter(h => h.type === activeFilter)

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      <div style={{ background: C.bg3, borderBottom: `1px solid ${C.border}`, padding: '16px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: C.accent, marginBottom: 3 }}>
          🔬 Sample Collector
        </h1>
        <p style={{ fontSize: 12, color: C.text2 }}>
          Istalgan matn yoki essayni joylashtiring — AI collocations, idiomlar va C1/C2 so'zlarni ajratadi
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

        {/* Input bosqichi */}
        {!analyzed ? (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: C.text2, marginBottom: 8 }}>
                Namuna matnlardan birini tanlang yoki o'z matnizni yozing:
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {SAMPLE_TEXTS.map((s, i) => (
                  <button key={i} onClick={() => setText(s.text)} style={{
                    fontSize: 11, padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
                    border: `0.5px solid ${text === s.text ? C.accent : C.border}`,
                    background: text === s.text ? `${C.accent}12` : 'transparent',
                    color: text === s.text ? C.accent : C.text2,
                  }}>{s.label}</button>
                ))}
              </div>
            </div>

            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Matnni bu yerga joylashtiring (kamida 50 ta belgi)..."
              style={{
                width: '100%', height: 260, background: C.bg2,
                border: `0.5px solid ${C.border}`, borderRadius: 12,
                padding: 16, color: C.text, fontSize: 13, lineHeight: 1.8,
                resize: 'vertical', outline: 'none', fontFamily: 'inherit', marginBottom: 12
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                {Object.entries(HL_STYLE).map(([type, style]) => (
                  <span key={type} style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, color: C.text2 }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, background: style.bg, borderRadius: 2, border: `0.5px solid ${style.border}` }} />
                    {style.label}
                  </span>
                ))}
              </div>
              <button onClick={analyzeText} disabled={text.trim().length < 50 || loading} style={{
                padding: '11px 28px', borderRadius: 8, border: 'none',
                background: text.trim().length >= 50 ? C.accent : 'rgba(255,255,255,0.05)',
                color: text.trim().length >= 50 ? C.bg : C.text2,
                fontSize: 13, fontWeight: 500,
                cursor: text.trim().length >= 50 ? 'pointer' : 'not-allowed'
              }}>
                {loading ? '⏳ Tahlil qilinmoqda...' : '🔬 Tahlil qilish'}
              </button>
            </div>
          </div>
        ) : (
          /* Natija */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button onClick={() => setActiveFilter('all')} style={{
                  fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                  border: `0.5px solid ${activeFilter === 'all' ? C.accent : C.border}`,
                  background: activeFilter === 'all' ? `${C.accent}12` : 'transparent',
                  color: activeFilter === 'all' ? C.accent : C.text2,
                }}>Barchasi ({highlights.length})</button>
                {Object.entries(HL_STYLE).map(([type, style]) => {
                  const count = highlights.filter(h => h.type === type).length
                  if (count === 0) return null
                  return (
                    <button key={type} onClick={() => setActiveFilter(type)} style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                      border: `0.5px solid ${activeFilter === type ? style.color : C.border}`,
                      background: activeFilter === type ? style.bg : 'transparent',
                      color: activeFilter === type ? style.color : C.text2,
                    }}>{style.label} ({count})</button>
                  )
                })}
              </div>
              <button onClick={() => { setAnalyzed(false); setHighlights([]); setSelectedHL(null); setSavedWords([]) }} style={{
                fontSize: 11, padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
                border: `0.5px solid ${C.border}`, background: 'transparent', color: C.text2,
              }}>← Yangi matn</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>

              {/* Matn + highlights */}
              <div style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                  {Object.entries(HL_STYLE).map(([type, style]) => (
                    <span key={type} style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4, color: C.text2 }}>
                      <span style={{ display: 'inline-block', width: 8, height: 8, background: style.bg, borderRadius: 2, border: `0.5px solid ${style.border}` }} />
                      {style.label}
                    </span>
                  ))}
                </div>
                <div style={{ color: C.text }}>
                  {renderHighlighted()}
                </div>
                <div style={{ marginTop: 12, fontSize: 11, color: C.text2 }}>
                  💡 Belgilangan so'z/iborani bosing — batafsil ma'lumot chiqadi
                </div>
              </div>

              {/* Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Selected highlight detail */}
                {selectedHL && (
                  <div style={{
                    background: C.bg2,
                    border: `0.5px solid ${HL_STYLE[selectedHL.type]?.color || C.accent}40`,
                    borderRadius: 12, padding: 16
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{
                        fontSize: 10, padding: '3px 8px', borderRadius: 4,
                        background: HL_STYLE[selectedHL.type]?.bg,
                        color: HL_STYLE[selectedHL.type]?.color,
                        border: `0.5px solid ${HL_STYLE[selectedHL.type]?.border}`
                      }}>{HL_STYLE[selectedHL.type]?.label}</span>
                      <button onClick={() => setSelectedHL(null)} style={{ background: 'none', border: 'none', color: C.text2, fontSize: 16, cursor: 'pointer' }}>×</button>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 500, color: C.text, marginBottom: 6 }}>{selectedHL.text}</div>
                    {selectedHL.explanation_uz && (
                      <div style={{ fontSize: 13, color: C.text2, marginBottom: 10, lineHeight: 1.6 }}>
                        🇺🇿 {selectedHL.explanation_uz}
                      </div>
                    )}
                    {selectedHL.how_to_use && (
                      <div style={{
                        fontSize: 12, color: C.accent, padding: '8px 12px',
                        background: `${C.accent}08`, borderRadius: 8, marginBottom: 12,
                        fontFamily: 'monospace'
                      }}>{selectedHL.how_to_use}</div>
                    )}
                    <button
                      onClick={() => saveToVocab(selectedHL)}
                      disabled={!!savedWords.find(w => w.text === selectedHL.text) || savingId === selectedHL.text}
                      style={{
                        width: '100%', padding: '8px', borderRadius: 8, cursor: 'pointer',
                        background: savedWords.find(w => w.text === selectedHL.text) ? `${C.green}15` : `${C.accent}12`,
                        border: `0.5px solid ${savedWords.find(w => w.text === selectedHL.text) ? `${C.green}40` : C.border2}`,
                        color: savedWords.find(w => w.text === selectedHL.text) ? C.green : C.accent,
                        fontSize: 12,
                      }}>
                      {savingId === selectedHL.text ? '⏳ Saqlanmoqda...' :
                        savedWords.find(w => w.text === selectedHL.text) ? '✅ Saqlandi' :
                          "+ Vocabularyga qo'shish"}
                    </button>
                  </div>
                )}

                {/* Highlights list */}
                <div style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', flex: 1 }}>
                  <div style={{ padding: '10px 14px', borderBottom: `0.5px solid ${C.border}`, fontSize: 12, fontWeight: 500, color: C.text2 }}>
                    Topilgan iboralar ({filteredHL.length})
                  </div>
                  <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                    {filteredHL.map((hl, i) => {
                      const style = HL_STYLE[hl.type] || HL_STYLE.c1_vocab
                      const isSaved = !!savedWords.find(w => w.text === hl.text)
                      return (
                        <div key={i}
                          onClick={() => setSelectedHL(selectedHL?.text === hl.text ? null : hl)}
                          style={{
                            padding: '10px 14px', cursor: 'pointer',
                            borderBottom: `0.5px solid ${C.border}`,
                            background: selectedHL?.text === hl.text ? `${style.color}08` : 'transparent',
                            transition: 'all 0.15s'
                          }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: style.color }}>{hl.text}</span>
                            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                              {isSaved && <span style={{ fontSize: 10, color: C.green }}>✅</span>}
                              <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: style.bg, color: style.color }}>{style.label}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: 11, color: C.text2 }}>{hl.explanation_uz}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Saqlangan words panel */}
                <div style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 12, color: C.text2, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>💾 Saqlangan ({savedWords.length} ta)</span>
                    {savedWords.length > 0 && (
                      <Link href="/my-vocab" style={{ fontSize: 11, color: C.accent, textDecoration: 'none' }}>
                        Ko'rish →
                      </Link>
                    )}
                  </div>

                  {savedWords.length === 0 ? (
                    <div style={{ fontSize: 11, color: C.text2, textAlign: 'center', padding: '12px 0' }}>
                      Iborani bosib saqlang
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                        {savedWords.map((w, i) => (
                          <span key={i} style={{
                            fontSize: 11, padding: '3px 8px', borderRadius: 4,
                            background: `${C.green}12`, color: C.green,
                            border: `0.5px solid ${C.green}30`, fontFamily: 'monospace'
                          }}>{w.text}</span>
                        ))}
                      </div>
                      <button
                        onClick={saveAllToVocab}
                        style={{
                          width: '100%', padding: '9px', borderRadius: 8,
                          background: saveSuccess ? `${C.green}15` : `${C.accent}12`,
                          border: `0.5px solid ${saveSuccess ? `${C.green}40` : C.border2}`,
                          color: saveSuccess ? C.green : C.accent,
                          fontSize: 12, fontWeight: 500, cursor: 'pointer'
                        }}>
                        {saveSuccess ? '✅ Hammasi saqlandi!' : '📚 Barchasini vocabularyga qo\'shish'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}