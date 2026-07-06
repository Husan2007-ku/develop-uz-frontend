'use client'
import { useState, useEffect, useRef } from 'react'

const C = {
  bg: '#0D1117', bg2: '#0d1f2d', bg3: '#0a1628',
  border: 'rgba(0,245,255,0.15)', border2: 'rgba(0,245,255,0.3)',
  text: '#e2e8f0', text2: '#94a3b8',
  accent: '#00F5FF', amber: '#F59E0B', green: '#93E9BE',
}

const API = 'https://develop-uz-api.onrender.com'

export default function AIEssayPage() {
  const [mode, setMode] = useState(null) // 'paste' | 'write'

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      <div style={{ background: C.bg3, borderBottom: `1px solid ${C.border}`, padding: '16px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: C.accent, marginBottom: 3 }}>🤖 AI Essay Tahlil</h1>
        <p style={{ fontSize: 12, color: C.text2 }}>Essayingizni AI yordamida tahlil qiling yoki yangi essay yozing</p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
        {!mode && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
            <div onClick={() => setMode('paste')} style={{
              background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: 14,
              padding: 32, cursor: 'pointer', transition: 'all 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Boshqa essay tashlash</div>
              <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.6 }}>
                Boshqa birovning yoki internetdan topgan essayingizni joylashtiring,
                AI undan vocabulary va grammatika strukturalarini ajratib beradi.
              </div>
            </div>

            <div onClick={() => setMode('write')} style={{
              background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: 14,
              padding: 32, cursor: 'pointer', transition: 'all 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.amber}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✍️</div>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>O'zim yozaman</div>
              <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.6 }}>
                Writing workspace ochiladi: vocabulary qidirish, AI yordam, real-time
                grammatika tekshiruvi va yozish vaqti hisoblanadi.
              </div>
            </div>
          </div>
        )}

        {mode === 'paste' && <PasteMode onBack={() => setMode(null)} />}
        {mode === 'write' && <WriteMode onBack={() => setMode(null)} />}
      </div>
    </main>
  )
}

// ═══════════════════ PASTE MODE ═══════════════════
function PasteMode({ onBack }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [highlights, setHighlights] = useState(null)
  const [tab, setTab] = useState('analysis')

  async function analyze() {
    if (text.trim().length < 50) return
    setLoading(true)
    setResult(null)
    setHighlights(null)
    try {
      const [analysisRes, highlightRes] = await Promise.all([
        fetch(`${API}/ai/essay/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        }),
        fetch(`${API}/ai/sample/highlight`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        })
      ])
      const analysis = await analysisRes.json()
      const hl = await highlightRes.json()
      setResult(analysis)
      setHighlights(hl.highlights || [])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const HL_COLOR = {
    collocation: { bg: 'rgba(245,158,11,0.2)', color: C.amber },
    idiom: { bg: 'rgba(147,233,190,0.2)', color: C.green },
    c1_vocab: { bg: 'rgba(0,245,255,0.2)', color: C.accent },
    c2_vocab: { bg: 'rgba(149,76,233,0.2)', color: '#9b5de5' },
  }

  return (
    <div>
      <button onClick={onBack} style={{
        background: 'none', border: 'none', color: C.text2,
        fontSize: 13, cursor: 'pointer', marginBottom: 16
      }}>← Orqaga</button>

      {!result ? (
        <div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Essay matnini shu yerga joylashtiring (kamida 50 ta belgi)..."
            style={{
              width: '100%', height: 280, background: C.bg2,
              border: `0.5px solid ${C.border}`, borderRadius: 12,
              padding: 16, color: C.text, fontSize: 13, lineHeight: 1.7,
              resize: 'vertical', outline: 'none', fontFamily: 'inherit'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <span style={{ fontSize: 11, color: C.text2 }}>{text.length} belgi</span>
            <button onClick={analyze} disabled={text.trim().length < 50 || loading} style={{
              padding: '10px 24px', borderRadius: 8, border: 'none',
              background: text.trim().length >= 50 ? C.accent : 'rgba(255,255,255,0.05)',
              color: text.trim().length >= 50 ? C.bg : C.text2,
              fontSize: 13, fontWeight: 500,
              cursor: text.trim().length >= 50 ? 'pointer' : 'not-allowed'
            }}>
              {loading ? '⏳ Tahlil qilinmoqda...' : '🤖 Tahlil qilish'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {[
              { id: 'analysis', label: '📊 Tahlil' },
              { id: 'text', label: '📝 Matn + Highlights' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '7px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                border: `0.5px solid ${tab === t.id ? C.accent : C.border}`,
                background: tab === t.id ? `${C.accent}12` : 'transparent',
                color: tab === t.id ? C.accent : C.text2,
              }}>{t.label}</button>
            ))}
            <button onClick={() => { setResult(null); setText('') }} style={{
              marginLeft: 'auto', padding: '7px 16px', borderRadius: 8, fontSize: 12,
              border: `0.5px solid ${C.border}`, background: 'transparent',
              color: C.text2, cursor: 'pointer'
            }}>🔄 Yangi essay</button>
          </div>

          {tab === 'analysis' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 13, color: C.text2, marginBottom: 8 }}>Umumiy Band</div>
                <div style={{ fontSize: 40, fontWeight: 500, color: C.accent, marginBottom: 16 }}>
                  {result.overall_band || '—'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { label: 'Task Achievement', value: result.task_achievement },
                    { label: 'Coherence', value: result.coherence_cohesion },
                    { label: 'Lexical Resource', value: result.lexical_resource },
                    { label: 'Grammar Range', value: result.grammatical_range },
                  ].map((s, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 12px' }}>
                      <div style={{ fontSize: 10, color: C.text2 }}>{s.label}</div>
                      <div style={{ fontSize: 16, color: C.green, fontWeight: 500 }}>{s.value || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {result.strengths?.length > 0 && (
                  <div style={{ background: C.bg2, border: `0.5px solid rgba(147,233,190,0.3)`, borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 12, color: C.green, marginBottom: 8, fontWeight: 500 }}>✅ Kuchli tomonlar</div>
                    {result.strengths.map((s, i) => (
                      <div key={i} style={{ fontSize: 12, color: C.text, marginBottom: 4, paddingLeft: 12 }}>• {s}</div>
                    ))}
                  </div>
                )}
                {result.weaknesses?.length > 0 && (
                  <div style={{ background: C.bg2, border: `0.5px solid rgba(239,68,68,0.3)`, borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 8, fontWeight: 500 }}>⚠️ Zaif tomonlar</div>
                    {result.weaknesses.map((s, i) => (
                      <div key={i} style={{ fontSize: 12, color: C.text, marginBottom: 4, paddingLeft: 12 }}>• {s}</div>
                    ))}
                  </div>
                )}
                {result.suggestions?.length > 0 && (
                  <div style={{ background: C.bg2, border: `0.5px solid ${C.border2}`, borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 12, color: C.accent, marginBottom: 8, fontWeight: 500 }}>💡 Tavsiyalar</div>
                    {result.suggestions.map((s, i) => (
                      <div key={i} style={{ fontSize: 12, color: C.text, marginBottom: 4, paddingLeft: 12 }}>• {s}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'text' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
              <div style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap', fontSize: 10 }}>
                  {Object.entries(HL_COLOR).map(([type, style]) => (
                    <span key={type} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: style.bg, display: 'inline-block' }} />
                      {type === 'collocation' ? 'Collocation' : type === 'idiom' ? 'Idiom' : type === 'c1_vocab' ? 'C1' : 'C2'}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.9, color: C.text }}>
                  {renderHighlighted(text, highlights, HL_COLOR)}
                </div>
              </div>
              <div style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 16, maxHeight: 500, overflowY: 'auto' }}>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12, color: C.text2 }}>Topilgan iboralar ({highlights?.length || 0})</div>
                {highlights?.map((h, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: 8,
                    padding: 10, marginBottom: 8
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: HL_COLOR[h.type]?.color || C.text }}>{h.text}</div>
                    <div style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>{h.explanation_uz}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function renderHighlighted(text, highlights, colors) {
  if (!highlights || highlights.length === 0) return text
  let result = []
  let lastIdx = 0
  highlights.forEach((h, i) => {
    const idx = text.indexOf(h.text, lastIdx)
    if (idx === -1) return
    if (idx > lastIdx) result.push(<span key={`t${i}`}>{text.slice(lastIdx, idx)}</span>)
    const style = colors[h.type] || { bg: 'rgba(255,255,255,0.1)', color: '#fff' }
    result.push(
      <span key={`h${i}`} style={{ background: style.bg, color: style.color, padding: '1px 3px', borderRadius: 3 }}
        title={h.explanation_uz}>{h.text}</span>
    )
    lastIdx = idx + h.text.length
  })
  if (lastIdx < text.length) result.push(<span key="last">{text.slice(lastIdx)}</span>)
  return result
}

// ═══════════════════ WRITE MODE ═══════════════════
function WriteMode({ onBack }) {
  const [text, setText] = useState('')
  const [vocabSearch, setVocabSearch] = useState('')
  const [vocabResults, setVocabResults] = useState([])
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(true)
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  async function searchVocab(q) {
    setVocabSearch(q)
    if (q.length < 2) { setVocabResults([]); return }
    try {
      const res = await fetch(`${API}/vocabulary/search/${q}`)
      const data = await res.json()
      setVocabResults(data.results || [])
    } catch (e) { console.error(e) }
  }

  async function submitEssay() {
    setRunning(false)
    setLoading(true)
    try {
      const res = await fetch(`${API}/ai/writing/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ essay: text })
      })
      const data = await res.json()
      setFeedback(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  if (feedback) {
    return (
      <div>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.text2, fontSize: 13, cursor: 'pointer', marginBottom: 16 }}>← Orqaga</button>
        <div style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: C.text2 }}>Sizning bandingiz</div>
              <div style={{ fontSize: 40, fontWeight: 500, color: C.accent }}>{feedback.band || '—'}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: C.text2 }}>Yozish vaqti</div>
              <div style={{ fontSize: 20, color: C.green }}>{mins}:{secs.toString().padStart(2, '0')}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.text2 }}>So'zlar soni</div>
              <div style={{ fontSize: 20, color: C.text }}>{wordCount}</div>
            </div>
          </div>

          {feedback.feedback_uz && (
            <div style={{ background: 'rgba(0,245,255,0.05)', borderRadius: 10, padding: 14, marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: C.accent, fontWeight: 500, marginBottom: 6 }}>Umumiy baholash</div>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{feedback.feedback_uz}</div>
            </div>
          )}

          {feedback.good_phrases?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: C.green, fontWeight: 500, marginBottom: 6 }}>✅ Yaxshi ishlatilgan</div>
              {feedback.good_phrases.map((p, i) => (
                <div key={i} style={{ fontSize: 12, color: C.text, paddingLeft: 12 }}>• {p}</div>
              ))}
            </div>
          )}

          {feedback.improve_suggestions?.length > 0 && (
            <div>
              <div style={{ fontSize: 12, color: C.amber, fontWeight: 500, marginBottom: 6 }}>💡 Yaxshilash kerak</div>
              {feedback.improve_suggestions.map((p, i) => (
                <div key={i} style={{ fontSize: 12, color: C.text, paddingLeft: 12 }}>• {p}</div>
              ))}
            </div>
          )}

          <button onClick={() => { setFeedback(null); setText(''); setSeconds(0); setRunning(true) }} style={{
            marginTop: 16, padding: '10px 20px', borderRadius: 8, border: 'none',
            background: C.accent, color: C.bg, fontSize: 13, fontWeight: 500, cursor: 'pointer'
          }}>🔄 Yangi essay yozish</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.text2, fontSize: 13, cursor: 'pointer' }}>← Orqaga</button>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: C.text2 }}>⏱ {mins}:{secs.toString().padStart(2, '0')}</span>
          <span style={{ fontSize: 13, color: C.text2 }}>{wordCount} so'z</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Essayingizni shu yerga yozing..."
            style={{
              width: '100%', height: 420, background: C.bg2,
              border: `0.5px solid ${C.border}`, borderRadius: 12,
              padding: 16, color: C.text, fontSize: 13, lineHeight: 1.8,
              resize: 'vertical', outline: 'none', fontFamily: 'inherit'
            }}
          />
          <button onClick={submitEssay} disabled={wordCount < 30 || loading} style={{
            marginTop: 12, width: '100%', padding: 14, borderRadius: 10, border: 'none',
            background: wordCount >= 30 ? C.amber : 'rgba(255,255,255,0.05)',
            color: wordCount >= 30 ? C.bg : C.text2,
            fontSize: 14, fontWeight: 500,
            cursor: wordCount >= 30 ? 'pointer' : 'not-allowed'
          }}>
            {loading ? '⏳ Tekshirilmoqda...' : '✅ Topshirish va feedback olish'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 10, color: C.text2 }}>🔍 Vocabulary qidirish</div>
            <input
              value={vocabSearch}
              onChange={e => searchVocab(e.target.value)}
              placeholder="So'z qidiring..."
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 8,
                border: `0.5px solid ${C.border}`, background: C.bg,
                color: C.text, fontSize: 12, outline: 'none', marginBottom: 10
              }}
            />
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {vocabResults.map(w => (
                <div key={w.id} style={{
                  background: 'rgba(255,255,255,0.03)', borderRadius: 6,
                  padding: '6px 10px', marginBottom: 6
                }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: C.accent }}>{w.word}</div>
                  <div style={{ fontSize: 11, color: C.text2 }}>{w.translation_uz}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 8, color: C.text2 }}>💡 Maslahat</div>
            <div style={{ fontSize: 11, color: C.text2, lineHeight: 1.6 }}>
              Kamida 250 so'z yozing. Har bir paragrafda bitta asosiy fikr bo'lsin.
              Topshirgandan keyin AI sizga band va batafsil feedback beradi.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
