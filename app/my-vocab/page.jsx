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

const STATUS_STYLE = {
  new: { label: 'Yangi', color: C.accent, bg: 'rgba(0,245,255,0.1)' },
  learning: { label: "O'rganmoqda", color: C.amber, bg: 'rgba(245,158,11,0.1)' },
  review: { label: 'Takrorlash', color: '#9b5de5', bg: 'rgba(149,76,233,0.1)' },
  mastered: { label: 'Yodlangan', color: C.green, bg: 'rgba(147,233,190,0.1)' },
}

const LEVEL_STYLE = {
  B2: { color: C.green, bg: 'rgba(147,233,190,0.12)', border: 'rgba(147,233,190,0.3)' },
  C1: { color: C.accent, bg: 'rgba(0,245,255,0.1)', border: 'rgba(0,245,255,0.3)' },
  C2: { color: '#9b5de5', bg: 'rgba(149,76,233,0.12)', border: 'rgba(149,76,233,0.3)' },
}

export default function MyVocabPage() {
  const [tab, setTab] = useState('my_vocab')
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const [savedIds, setSavedIds] = useState(new Set())

  // Review mode
  const [reviewIdx, setReviewIdx] = useState(0)
  const [showReviewAnswer, setShowReviewAnswer] = useState(false)
  const [reviewDone, setReviewDone] = useState(false)
  const [reviewScore, setReviewScore] = useState({ correct: 0, wrong: 0 })

  useEffect(() => { loadMyVocab() }, [])

  async function loadMyVocab() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/vocabulary/user/${TELEGRAM_ID}`)
      const data = await res.json()
      setWords(data.words || [])
      setSavedIds(new Set((data.words || []).map(w => w.id)))
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function saveWord(word) {
    if (savedIds.has(word.id)) return
    setSavingId(word.id)
    try {
      const res = await fetch(`${API}/vocabulary/user/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_id: TELEGRAM_ID,
          vocab_id: word.id,
          source: 'manual'
        })
      })
      const data = await res.json()
      if (data.status === 'saved' || data.status === 'already_exists') {
        setSavedIds(prev => new Set([...prev, word.id]))
        await loadMyVocab()
      }
    } catch (e) {
      console.error(e)
    }
    setSavingId(null)
  }

  async function searchVocab(q) {
    setSearchQuery(q)
    if (q.length < 2) { setSearchResults([]); return }
    setSearching(true)
    try {
      const res = await fetch(`${API}/vocabulary/search/${q}`)
      const data = await res.json()
      setSearchResults(data.results || [])
    } catch (e) { console.error(e) }
    setSearching(false)
  }

  const dueWords = words.slice(0, 5)

  function startReview() {
    setReviewIdx(0)
    setShowReviewAnswer(false)
    setReviewDone(false)
    setReviewScore({ correct: 0, wrong: 0 })
    setTab('review')
  }

  function nextReview(isCorrect) {
    setReviewScore(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      wrong: s.wrong + (isCorrect ? 0 : 1)
    }))
    const next = reviewIdx + 1
    if (next >= dueWords.length) {
      setReviewDone(true)
    } else {
      setReviewIdx(next)
      setShowReviewAnswer(false)
    }
  }

  const filtered = words.filter(w => {
    if (filterStatus === 'all') return true
    return (w.status || 'new') === filterStatus
  })

  const card = { background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: 10 }

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      <div style={{ background: C.bg3, borderBottom: `1px solid ${C.border}`, padding: '16px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: C.accent, marginBottom: 3 }}>📚 Mening Vocabularyim</h1>
        <p style={{ fontSize: 12, color: C.text2 }}>Saqlagan so'zlaringiz, takrorlash jadvali va yangi so'z qidirish</p>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[
            { id: 'my_vocab', label: `📖 Mening so'zlarim (${words.length})` },
            { id: 'review', label: `🔄 Takrorlash (${dueWords.length})` },
            { id: 'search', label: "🔍 So'z qidirish" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
              border: `0.5px solid ${tab === t.id ? C.accent : C.border}`,
              background: tab === t.id ? `${C.accent}12` : 'transparent',
              color: tab === t.id ? C.accent : C.text2, fontWeight: tab === t.id ? 500 : 400,
            }}>{t.label}</button>
          ))}
        </div>

        {/* MY VOCAB */}
        {tab === 'my_vocab' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20 }}>
              {Object.entries(STATUS_STYLE).map(([status, style]) => {
                const count = words.filter(w => (w.status || 'new') === status).length
                return (
                  <div key={status} style={{ ...card, padding: 14, textAlign: 'center', background: style.bg, borderColor: `${style.color}30` }}>
                    <div style={{ fontSize: 20, fontWeight: 500, color: style.color }}>{count}</div>
                    <div style={{ fontSize: 11, color: C.text2 }}>{style.label}</div>
                  </div>
                )
              })}
            </div>

            {dueWords.length > 0 && (
              <div style={{ ...card, padding: 16, marginBottom: 20, background: `${C.amber}08`, borderColor: `${C.amber}30`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.amber, marginBottom: 4 }}>
                    🔔 Bugun takrorlanishi kerak: {dueWords.length} ta so'z
                  </div>
                  <div style={{ fontSize: 12, color: C.text2 }}>Ebbinghaus Forgetting Curve — takrorlamasangiz unutasiz</div>
                </div>
                <button onClick={startReview} style={{
                  padding: '10px 20px', borderRadius: 8, border: 'none',
                  background: C.amber, color: C.bg, fontSize: 12, fontWeight: 500, cursor: 'pointer', flexShrink: 0
                }}>Takrorlashni boshlash →</button>
              </div>
            )}

            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {[
                { id: 'all', label: 'Barchasi' },
                ...Object.entries(STATUS_STYLE).map(([id, s]) => ({ id, label: s.label }))
              ].map(f => (
                <button key={f.id} onClick={() => setFilterStatus(f.id)} style={{
                  fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                  border: `0.5px solid ${filterStatus === f.id ? C.accent : C.border}`,
                  background: filterStatus === f.id ? `${C.accent}12` : 'transparent',
                  color: filterStatus === f.id ? C.accent : C.text2,
                }}>{f.label}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 320px' : '1fr', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 8, alignContent: 'start' }}>
                {loading ? (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: C.text2 }}>Yuklanmoqda...</div>
                ) : filtered.length === 0 ? (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.3 }}>📚</div>
                    <div style={{ fontSize: 13, color: C.text2 }}>
                      Hali so'z saqlanmagan.<br />
                      <button onClick={() => setTab('search')} style={{ color: C.accent, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                        So'z qidirish →
                      </button>
                    </div>
                  </div>
                ) : filtered.map(w => {
                  const lvStyle = LEVEL_STYLE[w.cefr_level] || LEVEL_STYLE.B2
                  const stStyle = STATUS_STYLE[w.status || 'new'] || STATUS_STYLE.new
                  return (
                    <div key={w.id} onClick={() => setSelected(selected?.id === w.id ? null : w)} style={{
                      ...card, padding: 14, cursor: 'pointer', transition: 'all 0.15s',
                      borderColor: selected?.id === w.id ? C.accent : C.border,
                      background: selected?.id === w.id ? `${C.accent}05` : C.bg2,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 16, fontWeight: 500, color: C.text }}>{w.word}</span>
                        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontFamily: 'monospace', background: lvStyle.bg, color: lvStyle.color, border: `0.5px solid ${lvStyle.border}` }}>{w.cefr_level}</span>
                      </div>
                      <div style={{ fontSize: 12, color: C.text2, marginBottom: 8 }}>🇺🇿 {w.translation_uz}</div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: stStyle.bg, color: stStyle.color }}>{stStyle.label}</span>
                        {w.word_type && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: C.text2 }}>{w.word_type}</span>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {selected && (
                <div style={{ position: 'sticky', top: 80, alignSelf: 'start' }}>
                  <div style={{ ...card, padding: 20, borderColor: `${C.accent}40` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 500, color: C.accent }}>{selected.word}</div>
                        <div style={{ fontSize: 13, color: C.text2 }}>🇺🇿 {selected.translation_uz}</div>
                      </div>
                      <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: C.text2, fontSize: 18, cursor: 'pointer' }}>×</button>
                    </div>
                    {selected.example_1 && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 11, color: C.text2, marginBottom: 6 }}>Misol:</div>
                        <div style={{ fontSize: 12, color: C.text, fontStyle: 'italic', lineHeight: 1.6, padding: '6px 10px', borderLeft: `2px solid ${C.accent}20`, background: 'rgba(0,245,255,0.02)', borderRadius: '0 6px 6px 0' }}>"{selected.example_1}"</div>
                      </div>
                    )}
                    {selected.collocations?.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 11, color: C.text2, marginBottom: 6 }}>Collocations:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {selected.collocations.map((c, i) => (
                            <span key={i} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: `${C.amber}12`, color: C.amber, fontFamily: 'monospace' }}>{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12, marginBottom: 14 }}>
                      <div style={{ fontSize: 11, color: C.text2, marginBottom: 8 }}>Progress:</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 18, fontWeight: 500, color: C.green }}>{selected.correct_count || 0}</div>
                          <div style={{ fontSize: 10, color: C.text2 }}>To'g'ri</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 18, fontWeight: 500, color: '#ef4444' }}>{selected.wrong_count || 0}</div>
                          <div style={{ fontSize: 10, color: C.text2 }}>Xato</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REVIEW */}
        {tab === 'review' && (
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            {words.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: C.text2 }}>
                <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.3 }}>📚</div>
                <div style={{ fontSize: 13 }}>Hali so'z saqlanmagan</div>
              </div>
            ) : reviewDone ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 16 }}>Takrorlash tugadi!</h2>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
                  <div style={{ ...card, padding: '16px 28px', borderColor: `${C.green}40`, background: `${C.green}08` }}>
                    <div style={{ fontSize: 28, fontWeight: 500, color: C.green }}>{reviewScore.correct}</div>
                    <div style={{ fontSize: 11, color: C.text2 }}>To'g'ri</div>
                  </div>
                  <div style={{ ...card, padding: '16px 28px', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' }}>
                    <div style={{ fontSize: 28, fontWeight: 500, color: '#ef4444' }}>{reviewScore.wrong}</div>
                    <div style={{ fontSize: 11, color: C.text2 }}>Noto'g'ri</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button onClick={() => setTab('my_vocab')} style={{ padding: '10px 20px', borderRadius: 8, border: `0.5px solid ${C.border}`, background: 'transparent', color: C.text2, fontSize: 12, cursor: 'pointer' }}>← Orqaga</button>
                  <button onClick={startReview} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: C.accent, color: C.bg, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>🔄 Qayta boshlash</button>
                </div>
              </div>
            ) : dueWords[reviewIdx] && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <button onClick={() => setTab('my_vocab')} style={{ background: 'none', border: 'none', color: C.text2, fontSize: 12, cursor: 'pointer' }}>← Orqaga</button>
                  <span style={{ fontSize: 12, color: C.text2 }}>{reviewIdx + 1} / {dueWords.length}</span>
                  <span style={{ fontSize: 12 }}>
                    <span style={{ color: C.green }}>✅ {reviewScore.correct}</span>
                    {' · '}
                    <span style={{ color: '#ef4444' }}>❌ {reviewScore.wrong}</span>
                  </span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginBottom: 20 }}>
                  <div style={{ height: 3, borderRadius: 2, background: C.accent, width: `${(reviewIdx / dueWords.length) * 100}%` }} />
                </div>
                <div style={{ ...card, textAlign: 'center', padding: 32, marginBottom: 16, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 11, color: C.text2, fontFamily: 'monospace', marginBottom: 12 }}>
                    {dueWords[reviewIdx].cefr_level} · {dueWords[reviewIdx].word_type}
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 500, color: C.accent, marginBottom: 8 }}>{dueWords[reviewIdx].word}</div>
                  {!showReviewAnswer ? (
                    <button onClick={() => setShowReviewAnswer(true)} style={{ marginTop: 16, padding: '8px 20px', borderRadius: 8, border: `0.5px solid ${C.border}`, background: 'transparent', color: C.text2, fontSize: 12, cursor: 'pointer' }}>👁️ Javobni ko'rish</button>
                  ) : (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 20, color: C.green, fontWeight: 500, marginBottom: 6 }}>🇺🇿 {dueWords[reviewIdx].translation_uz}</div>
                      {dueWords[reviewIdx].example_1 && (
                        <div style={{ fontSize: 12, color: C.text2, fontStyle: 'italic', maxWidth: 400, lineHeight: 1.6, marginTop: 8 }}>"{dueWords[reviewIdx].example_1}"</div>
                      )}
                    </div>
                  )}
                </div>
                {showReviewAnswer && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => nextReview(false)} style={{ flex: 1, padding: 14, borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>❌ Unutdim</button>
                    <button onClick={() => nextReview(true)} style={{ flex: 1, padding: 14, borderRadius: 10, background: `${C.green}15`, border: `0.5px solid ${C.green}40`, color: C.green, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>✅ Esladim</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SEARCH */}
        {tab === 'search' && (
          <div>
            <div style={{ ...card, padding: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: C.text2, marginBottom: 10 }}>So'z qidiring va vocabularyga qo'shing:</div>
              <input
                value={searchQuery}
                onChange={e => searchVocab(e.target.value)}
                placeholder="Masalan: exacerbate, unprecedented, facilitate..."
                autoFocus
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: `0.5px solid ${C.border2}`, background: C.bg, color: C.text, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
              />
            </div>

            {searching && <div style={{ textAlign: 'center', padding: '20px 0', color: C.text2, fontSize: 13 }}>Qidirilmoqda...</div>}

            {searchResults.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 10 }}>
                {searchResults.map(w => {
                  const lvStyle = LEVEL_STYLE[w.cefr_level] || LEVEL_STYLE.B2
                  const isSaved = savedIds.has(w.id)
                  return (
                    <div key={w.id} style={{ ...card, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 16, fontWeight: 500, color: C.text }}>{w.word}</span>
                        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontFamily: 'monospace', background: lvStyle.bg, color: lvStyle.color, border: `0.5px solid ${lvStyle.border}` }}>{w.cefr_level}</span>
                      </div>
                      <div style={{ fontSize: 13, color: C.text2, marginBottom: 10 }}>🇺🇿 {w.translation_uz}</div>
                      {w.example_1 && (
                        <div style={{ fontSize: 12, color: C.text2, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 12, borderLeft: `2px solid ${C.accent}20`, paddingLeft: 8 }}>"{w.example_1}"</div>
                      )}
                      {w.collocations?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 12 }}>
                          {w.collocations.map((c, i) => (
                            <span key={i} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, background: `${C.amber}10`, color: C.amber, fontFamily: 'monospace' }}>{c}</span>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => saveWord(w)}
                        disabled={isSaved || savingId === w.id}
                        style={{
                          width: '100%', padding: '8px', borderRadius: 6, cursor: isSaved ? 'default' : 'pointer',
                          background: isSaved ? `${C.green}15` : `${C.accent}10`,
                          border: `0.5px solid ${isSaved ? `${C.green}40` : C.border2}`,
                          color: isSaved ? C.green : C.accent, fontSize: 11,
                        }}>
                        {savingId === w.id ? '⏳ Saqlanmoqda...' : isSaved ? '✅ Saqlandi' : '+ Vocabularyga qo\'shish'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: C.text2 }}>
                <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.3 }}>🔍</div>
                <div style={{ fontSize: 13 }}>"{searchQuery}" topilmadi</div>
              </div>
            )}

            {searchQuery.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: C.text2 }}>
                <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.2 }}>🔍</div>
                <div style={{ fontSize: 13 }}>So'z yozing — avtomatik qidiriladi</div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}