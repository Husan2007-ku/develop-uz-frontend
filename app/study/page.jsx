'use client'
import { useState, useEffect } from 'react'

const C = {
  bg: '#0D1117', bg2: '#0d1f2d', bg3: '#0a1628',
  border: 'rgba(0,245,255,0.15)', border2: 'rgba(0,245,255,0.3)',
  text: '#e2e8f0', text2: '#94a3b8',
  accent: '#00F5FF', amber: '#F59E0B', green: '#93E9BE',
}

export default function StudyPage() {
  const [mode, setMode] = useState(null)
  const [words, setWords] = useState([])
  const [current, setCurrent] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState({ correct: 0, wrong: 0 })
  const [quizOptions, setQuizOptions] = useState([])
  const [selected, setSelected] = useState(null)
  const [writingText, setWritingText] = useState('')
  const [writingResult, setWritingResult] = useState(null)
  const [clozeShown, setClozeShown] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (mode) loadWords() }, [mode])

  async function loadWords() {
    setLoading(true)
    try {
      const res = await fetch('https://develop-uz-api.onrender.com/vocabulary/?limit=10')
      const data = await res.json()
      const w = data.words || []
      setWords(w)
      setCurrent(0)
      setShowAnswer(false)
      setScore({ correct: 0, wrong: 0 })
      setSelected(null)
      setWritingResult(null)
      setClozeShown(false)
      if (w.length > 0) setupQuiz(w, 0)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  function setupQuiz(wordList, idx) {
    const correct = wordList[idx]
    const others = wordList.filter((_, i) => i !== idx).slice(0, 3)
    setQuizOptions([...others, correct].sort(() => Math.random() - 0.5))
    setSelected(null)
  }

  function nextWord(isCorrect) {
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), wrong: s.wrong + (isCorrect ? 0 : 1) }))
    const next = current + 1
    if (next >= words.length) { setCurrent(words.length) }
    else {
      setCurrent(next)
      setShowAnswer(false)
      setSelected(null)
      setClozeShown(false)
      setupQuiz(words, next)
    }
  }

  function checkWriting() {
    const used = words.slice(0, 5).filter(w => writingText.toLowerCase().includes(w.word.toLowerCase()))
    const missing = words.slice(0, 5).filter(w => !writingText.toLowerCase().includes(w.word.toLowerCase()))
    setWritingResult({ used, missing, score: used.length * 20 })
  }

  const word = words[current]
  const finished = current >= words.length && words.length > 0

  const card = {
    background: C.bg2, border: `0.5px solid ${C.border}`,
    borderRadius: 12, padding: 20
  }

  const modes = [
    { id: 'flashcard', icon: '🃏', title: 'Flashcard', desc: "So'zni ko'r, tarjimasini bil", tag: 'SM-2', color: C.accent },
    { id: 'cloze', icon: '📝', title: 'Cloze Test', desc: "Bo'sh joyni to'ldiring", tag: 'Kontekst', color: '#9b5de5' },
    { id: 'quiz', icon: '🔤', title: 'Kontekst Quiz', desc: "To'g'ri so'zni tanlang", tag: "Ko'p tanlov", color: C.green },
    { id: 'writing', icon: '✏️', title: 'Writing Practice', desc: '5 so\'zdan paragraf yozing', tag: 'AI tekshiruv', color: C.amber },
  ]

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      {/* Header */}
      <div style={{ background: C.bg3, borderBottom: `1px solid ${C.border}`, padding: '16px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: C.accent, marginBottom: 3 }}>✍️ Study Zone</h1>
        <p style={{ fontSize: 12, color: C.text2 }}>So'zlarni ilmiy usulda yodlang — Spaced Repetition bilan</p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 24px' }}>

        {/* Mode tanlash */}
        {!mode && (
          <>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16, color: C.text2 }}>Rejim tanlang</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
              {modes.map(m => (
                <div key={m.id} onClick={() => setMode(m.id)} style={{
                  ...card, cursor: 'pointer', transition: 'all 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = m.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ fontSize: 28 }}>{m.icon}</span>
                    <span style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace',
                      background: `${m.color}18`, color: m.color, border: `0.5px solid ${m.color}40`
                    }}>{m.tag}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: C.text2 }}>{m.desc}</div>
                </div>
              ))}
            </div>

            {/* CEFR darajalar */}
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16, color: C.text2 }}>📊 CEFR darajalari</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {[
                { level: 'B2', title: 'Upper-Intermediate', desc: 'Band 5.5–6.5 uchun', color: C.green, words: ['significant', 'contribute', 'establish'] },
                { level: 'C1', title: 'Advanced', desc: 'Band 7–7.5 uchun', color: C.accent, words: ['facilitate', 'exacerbate', 'prevalent'] },
                { level: 'C2', title: 'Proficiency', desc: 'Band 8–9 uchun', color: '#9b5de5', words: ['ubiquitous', 'unprecedented', 'disseminate'] },
              ].map(lv => (
                <div key={lv.level} style={{ ...card }}>
                  <div style={{
                    display: 'inline-block', fontSize: 12, fontWeight: 500,
                    padding: '3px 10px', borderRadius: 4,
                    background: `${lv.color}15`, color: lv.color,
                    border: `0.5px solid ${lv.color}40`, marginBottom: 8
                  }}>{lv.level} — {lv.title}</div>
                  <div style={{ fontSize: 11, color: C.text2, marginBottom: 10 }}>{lv.desc}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {lv.words.map(w => (
                      <span key={w} style={{
                        fontSize: 10, padding: '2px 7px', borderRadius: 4,
                        background: 'rgba(255,255,255,0.05)', color: C.text2,
                        fontFamily: 'monospace'
                      }}>{w}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Loading */}
        {mode && loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: C.text2 }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }}>⏳</div>
            <p style={{ fontSize: 13 }}>So'zlar yuklanmoqda...</p>
          </div>
        )}

        {/* Tugadi */}
        {mode && !loading && finished && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 16 }}>Sessiya tugadi!</h2>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ ...card, padding: '16px 28px', borderColor: `${C.green}40` }}>
                <div style={{ fontSize: 28, fontWeight: 500, color: C.green }}>{score.correct}</div>
                <div style={{ fontSize: 11, color: C.text2 }}>To'g'ri</div>
              </div>
              <div style={{ ...card, padding: '16px 28px', borderColor: 'rgba(239,68,68,0.3)' }}>
                <div style={{ fontSize: 28, fontWeight: 500, color: '#ef4444' }}>{score.wrong}</div>
                <div style={{ fontSize: 11, color: C.text2 }}>Noto'g'ri</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => { setMode(null); setWords([]) }} style={{
                padding: '10px 20px', borderRadius: 8, border: `0.5px solid ${C.border}`,
                background: 'transparent', color: C.text2, fontSize: 13, cursor: 'pointer'
              }}>← Rejim tanlash</button>
              <button onClick={loadWords} style={{
                padding: '10px 20px', borderRadius: 8, border: 'none',
                background: C.accent, color: C.bg, fontSize: 13, fontWeight: 500, cursor: 'pointer'
              }}>🔄 Qayta boshlash</button>
            </div>
          </div>
        )}

        {/* FLASHCARD */}
        {mode === 'flashcard' && !loading && !finished && word && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <button onClick={() => setMode(null)} style={{ background: 'none', border: 'none', color: C.text2, fontSize: 13, cursor: 'pointer' }}>← Orqaga</button>
              <span style={{ fontSize: 12, color: C.text2 }}>{current + 1} / {words.length}</span>
              <span style={{ fontSize: 12 }}>
                <span style={{ color: C.green }}>✅ {score.correct}</span>
                {' · '}
                <span style={{ color: '#ef4444' }}>❌ {score.wrong}</span>
              </span>
            </div>
            <div style={{ ...card, textAlign: 'center', minHeight: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: C.text2, fontFamily: 'monospace', marginBottom: 12 }}>
                {word.cefr_level} · {word.word_type}
              </div>
              <div style={{ fontSize: 36, fontWeight: 500, color: C.accent, marginBottom: 12 }}>{word.word}</div>
              {!showAnswer ? (
                <button onClick={() => setShowAnswer(true)} style={{
                  padding: '8px 20px', borderRadius: 8, border: `0.5px solid ${C.border}`,
                  background: 'transparent', color: C.text2, fontSize: 12, cursor: 'pointer', marginTop: 8
                }}>👁️ Javobni ko'rish</button>
              ) : (
                <div>
                  <div style={{ fontSize: 18, color: C.green, fontWeight: 500, marginBottom: 6 }}>
                    🇺🇿 {word.translation_uz}
                  </div>
                  {word.example_1 && (
                    <div style={{ fontSize: 12, color: C.text2, fontStyle: 'italic', maxWidth: 400 }}>
                      "{word.example_1}"
                    </div>
                  )}
                </div>
              )}
            </div>
            {showAnswer && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => nextWord(false)} style={{
                  flex: 1, padding: 14, borderRadius: 10,
                  background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)',
                  color: '#ef4444', fontSize: 14, fontWeight: 500, cursor: 'pointer'
                }}>❌ Bilmadim</button>
                <button onClick={() => nextWord(true)} style={{
                  flex: 1, padding: 14, borderRadius: 10,
                  background: `${C.green}15`, border: `0.5px solid ${C.green}40`,
                  color: C.green, fontSize: 14, fontWeight: 500, cursor: 'pointer'
                }}>✅ Bildim</button>
              </div>
            )}
          </div>
        )}

        {/* CLOZE */}
        {mode === 'cloze' && !loading && !finished && word && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <button onClick={() => setMode(null)} style={{ background: 'none', border: 'none', color: C.text2, fontSize: 13, cursor: 'pointer' }}>← Orqaga</button>
              <span style={{ fontSize: 12, color: C.text2 }}>{current + 1} / {words.length}</span>
            </div>
            <div style={{ ...card, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: C.text2, fontFamily: 'monospace', marginBottom: 12 }}>
                {word.cefr_level} · Bo'sh joyni to'ldiring
              </div>
              {word.example_1 ? (
                <p style={{ fontSize: 15, color: C.text, lineHeight: 1.8, marginBottom: 16 }}>
                  {word.example_1.replace(new RegExp(word.word, 'gi'), '________')}
                </p>
              ) : (
                <p style={{ fontSize: 13, color: C.text2, fontStyle: 'italic', marginBottom: 16 }}>Misol gap mavjud emas</p>
              )}
              {!clozeShown ? (
                <button onClick={() => setClozeShown(true)} style={{
                  padding: '8px 20px', borderRadius: 8, border: 'none',
                  background: `rgba(149,76,233,0.2)`, color: '#9b5de5',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer'
                }}>💡 Javobni ko'rish</button>
              ) : (
                <div style={{
                  background: 'rgba(149,76,233,0.1)', border: '0.5px solid rgba(149,76,233,0.3)',
                  borderRadius: 8, padding: '10px 14px'
                }}>
                  <div style={{ fontSize: 20, fontWeight: 500, color: '#9b5de5', marginBottom: 3 }}>{word.word}</div>
                  <div style={{ fontSize: 12, color: C.text2 }}>🇺🇿 {word.translation_uz}</div>
                </div>
              )}
            </div>
            {clozeShown && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => nextWord(false)} style={{
                  flex: 1, padding: 14, borderRadius: 10,
                  background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)',
                  color: '#ef4444', fontSize: 14, fontWeight: 500, cursor: 'pointer'
                }}>❌ Bilmadim</button>
                <button onClick={() => nextWord(true)} style={{
                  flex: 1, padding: 14, borderRadius: 10,
                  background: `${C.green}15`, border: `0.5px solid ${C.green}40`,
                  color: C.green, fontSize: 14, fontWeight: 500, cursor: 'pointer'
                }}>✅ Bildim</button>
              </div>
            )}
          </div>
        )}

        {/* QUIZ */}
        {mode === 'quiz' && !loading && !finished && word && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <button onClick={() => setMode(null)} style={{ background: 'none', border: 'none', color: C.text2, fontSize: 13, cursor: 'pointer' }}>← Orqaga</button>
              <span style={{ fontSize: 12, color: C.text2 }}>{current + 1} / {words.length}</span>
              <span style={{ fontSize: 12 }}>
                <span style={{ color: C.green }}>✅ {score.correct}</span>
                {' · '}
                <span style={{ color: '#ef4444' }}>❌ {score.wrong}</span>
              </span>
            </div>
            <div style={{ ...card, textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: C.text2, fontFamily: 'monospace', marginBottom: 12 }}>To'g'ri so'zni tanlang</div>
              <div style={{ fontSize: 20, color: C.green, fontWeight: 500, marginBottom: 6 }}>🇺🇿 {word.translation_uz}</div>
              {word.example_1 && (
                <div style={{ fontSize: 12, color: C.text2, fontStyle: 'italic' }}>
                  {word.example_1.replace(new RegExp(word.word, 'gi'), '________')}
                </div>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {quizOptions.map((opt, i) => (
                <button key={i} onClick={() => {
                  if (selected !== null) return
                  setSelected(opt.word)
                  setTimeout(() => nextWord(opt.word === word.word), 800)
                }} style={{
                  padding: '14px 10px', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  border: `0.5px solid ${selected === null ? C.border : opt.word === word.word ? `${C.green}60` : selected === opt.word ? 'rgba(239,68,68,0.4)' : C.border}`,
                  background: selected === null ? 'transparent' : opt.word === word.word ? `${C.green}15` : selected === opt.word ? 'rgba(239,68,68,0.1)' : 'transparent',
                  color: selected === null ? C.text : opt.word === word.word ? C.green : selected === opt.word ? '#ef4444' : C.text2,
                  opacity: selected !== null && opt.word !== word.word && selected !== opt.word ? 0.4 : 1,
                }}>{opt.word}</button>
              ))}
            </div>
          </div>
        )}

        {/* WRITING */}
        {mode === 'writing' && !loading && words.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <button onClick={() => setMode(null)} style={{ background: 'none', border: 'none', color: C.text2, fontSize: 13, cursor: 'pointer' }}>← Orqaga</button>
              <span style={{ fontSize: 12, color: C.text2 }}>5 so'z ishlatish kerak</span>
            </div>
            <div style={{ ...card, marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: C.text2, marginBottom: 10 }}>📌 Shu so'zlarni ishlating:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {words.slice(0, 5).map((w, i) => (
                  <span key={i} style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 6, fontFamily: 'monospace',
                    background: `${C.accent}10`, color: C.accent, border: `0.5px solid ${C.border2}`
                  }}>
                    {w.word} <span style={{ color: C.text2 }}>— {w.translation_uz}</span>
                  </span>
                ))}
              </div>
            </div>
            <textarea value={writingText} onChange={e => setWritingText(e.target.value)}
              placeholder="Shu 5 ta so'zni ishlatib 1 ta paragraf yozing..."
              style={{
                width: '100%', background: C.bg2, border: `0.5px solid ${C.border}`,
                borderRadius: 10, padding: 14, color: C.text,
                fontSize: 13, resize: 'none', height: 140, outline: 'none',
                fontFamily: 'inherit', lineHeight: 1.7, marginBottom: 12
              }} />
            <button onClick={checkWriting} disabled={writingText.trim().length < 10} style={{
              width: '100%', padding: 14, borderRadius: 10, border: 'none',
              background: writingText.trim().length >= 10 ? C.amber : 'rgba(255,255,255,0.05)',
              color: writingText.trim().length >= 10 ? C.bg : C.text2,
              fontSize: 14, fontWeight: 500, cursor: writingText.trim().length >= 10 ? 'pointer' : 'not-allowed',
              marginBottom: 12
            }}>🤖 Tekshirish</button>
            {writingResult && (
              <div style={{ ...card }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>
                  📊 Natija: <span style={{ color: C.accent }}>{writingResult.score}/100</span>
                </div>
                {writingResult.used.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, color: C.green, marginBottom: 6 }}>✅ Ishlatilgan ({writingResult.used.length}):</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {writingResult.used.map((w, i) => (
                        <span key={i} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: `${C.green}15`, color: C.green, fontFamily: 'monospace' }}>{w.word}</span>
                      ))}
                    </div>
                  </div>
                )}
                {writingResult.missing.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 6 }}>❌ Ishlatilmagan ({writingResult.missing.length}):</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {writingResult.missing.map((w, i) => (
                        <span key={i} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontFamily: 'monospace' }}>{w.word}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{
                  padding: '10px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                  background: writingResult.score === 100 ? `${C.green}15` : writingResult.score >= 60 ? `${C.accent}10` : 'rgba(239,68,68,0.1)',
                  color: writingResult.score === 100 ? C.green : writingResult.score >= 60 ? C.accent : '#ef4444',
                }}>
                  {writingResult.score === 100 ? "🏆 Mukammal! Barcha so'zlarni ishlatdingiz!" : writingResult.score >= 60 ? '👍 Yaxshi! Bir oz mashq qiling.' : '💪 Davom eting! Ko\'proq mashq kerak.'}
                </div>
                <button onClick={() => { setWritingText(''); setWritingResult(null) }} style={{
                  marginTop: 10, padding: '8px 16px', borderRadius: 8,
                  border: `0.5px solid ${C.border}`, background: 'transparent',
                  color: C.text2, fontSize: 12, cursor: 'pointer'
                }}>🔄 Qayta yozish</button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
