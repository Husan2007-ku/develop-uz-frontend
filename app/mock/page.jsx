'use client'
import { useState, useEffect, useRef } from 'react'

const C = {
  bg: '#0D1117', bg2: '#0d1f2d', bg3: '#0a1628',
  border: 'rgba(0,245,255,0.15)', border2: 'rgba(0,245,255,0.3)',
  text: '#e2e8f0', text2: '#94a3b8',
  accent: '#00F5FF', amber: '#F59E0B', green: '#93E9BE',
}

const API = 'http://localhost:8001'

const MOCK_QUESTIONS = [
  {
    id: 1,
    type: 'Task 2',
    topic: 'Technology',
    question: "Some people believe that technology has made our lives more complicated. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience.",
  },
  {
    id: 2,
    type: 'Task 2',
    topic: 'Education',
    question: "Some people think that universities should focus on providing academic knowledge, while others believe they should also prepare students for the world of work. Discuss both views and give your own opinion.",
  },
  {
    id: 3,
    type: 'Task 2',
    topic: 'Environment',
    question: "The government should make laws to reduce the amount of packaging used by shops and manufacturers. To what extent do you agree or disagree?",
  },
  {
    id: 4,
    type: 'Task 2',
    topic: 'Society',
    question: "In many countries, the gap between the rich and the poor is increasing. What problems might this cause? What solutions can you suggest?",
  },
  {
    id: 5,
    type: 'Task 2',
    topic: 'Health',
    question: "Some people think that the best way to stay healthy is to exercise regularly, while others think diet is more important. Discuss both views and give your opinion.",
  },
]

const TIME_LIMIT = 40 * 60 // 40 daqiqa

export default function MockPage() {
  const [stage, setStage] = useState('intro') // intro | exam | result
  const [question, setQuestion] = useState(null)
  const [text, setText] = useState('')
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (stage === 'exam') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current)
            submitExam()
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [stage])

  // Sahifadan chiqishni oldini olish
  useEffect(() => {
    if (stage === 'exam') {
      const handleBeforeUnload = (e) => {
        e.preventDefault()
        e.returnValue = ''
      }
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [stage])

  function startExam() {
    const q = MOCK_QUESTIONS[Math.floor(Math.random() * MOCK_QUESTIONS.length)]
    setQuestion(q)
    setText('')
    setTimeLeft(TIME_LIMIT)
    setStage('exam')
  }

  async function submitExam() {
    clearInterval(timerRef.current)
    setLoading(true)
    try {
      const res = await fetch(`${API}/ai/writing/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          essay: text,
          task_question: question?.question || ''
        })
      })
      const data = await res.json()
      setFeedback(data)
    } catch (e) {
      setFeedback({
        band: '—',
        feedback_uz: 'Feedback olishda xato yuz berdi. Qayta urinib ko\'ring.',
        good_phrases: [],
        improve_suggestions: [],
        grammar_issues: []
      })
    }
    setLoading(false)
    setStage('result')
  }

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const timePercent = (timeLeft / TIME_LIMIT) * 100
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const spentMins = Math.floor((TIME_LIMIT - timeLeft) / 60)
  const spentSecs = (TIME_LIMIT - timeLeft) % 60

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text }}>

      {/* INTRO */}
      {stage === 'intro' && (
        <>
          <div style={{ background: C.bg3, borderBottom: `1px solid ${C.border}`, padding: '16px 24px' }}>
            <h1 style={{ fontSize: 22, fontWeight: 500, color: C.accent, marginBottom: 3 }}>🏆 Mock Imtihon</h1>
            <p style={{ fontSize: 12, color: C.text2 }}>Haqiqiy IELTS sharoitida yozing — vaqt, mavzu, AI baho</p>
          </div>

          <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 24px' }}>
            <div style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 20, color: C.text }}>
                Imtihon boshlamishdan oldin
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                {[
                  { icon: '⏱️', title: '40 daqiqa', desc: 'Vaqtni to\'xtatib bo\'lmaydi' },
                  { icon: '📝', title: 'Kamida 250 so\'z', desc: 'Task 2 talabi' },
                  { icon: '🔒', title: 'Chiqib bo\'lmaydi', desc: 'Sahifadan ketsa, imtihon tugaydi' },
                  { icon: '🤖', title: 'AI baho', desc: 'Topshirgach band va feedback' },
                ].map((r, i) => (
                  <div key={i} style={{
                    background: C.bg, border: `0.5px solid ${C.border}`,
                    borderRadius: 10, padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start'
                  }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{r.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: C.text2 }}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.3)',
                borderRadius: 10, padding: 14, marginBottom: 24
              }}>
                <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 500, marginBottom: 6 }}>
                  ⚠️ Diqqat
                </div>
                <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.6 }}>
                  Mavzuni siz tanlay olmaysiz — tizim tasodifiy tanlaydi.
                  Vaqt tugasa, yozganingiz avtomatik topshiriladi.
                  Imtihon davomida boshqa sahifaga o'tishga urinmang.
                </div>
              </div>

              <button onClick={startExam} style={{
                width: '100%', padding: 14, borderRadius: 10, border: 'none',
                background: C.accent, color: C.bg,
                fontSize: 15, fontWeight: 500, cursor: 'pointer'
              }}>
                🏆 Imtihonni boshlash
              </button>
            </div>
          </div>
        </>
      )}

      {/* EXAM */}
      {stage === 'exam' && (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

          {/* Exam header */}
          <div style={{
            background: C.bg3, borderBottom: `1px solid ${C.border}`,
            padding: '12px 24px', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
          }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>
              🏆 Mock Imtihon — {question?.topic}
            </div>

            {/* Timer */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 28, fontWeight: 500,
                color: timeLeft < 300 ? '#ef4444' : timeLeft < 600 ? C.amber : C.accent,
              }}>
                {mins}:{secs.toString().padStart(2, '0')}
              </div>
              <div style={{ height: 4, width: 120, background: 'rgba(255,255,255,0.1)', borderRadius: 2, margin: '4px auto 0' }}>
                <div style={{
                  height: 4, borderRadius: 2,
                  width: `${timePercent}%`,
                  background: timeLeft < 300 ? '#ef4444' : timeLeft < 600 ? C.amber : C.accent,
                  transition: 'width 1s linear'
                }} />
              </div>
            </div>

            <div style={{ fontSize: 12, color: C.text2 }}>
              {wordCount} so'z
            </div>
          </div>

          {/* Exam body */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>

            {/* Question */}
            <div style={{
              borderRight: `1px solid ${C.border}`,
              padding: 24, overflowY: 'auto',
              background: C.bg
            }}>
              <div style={{
                display: 'inline-block', fontSize: 11, padding: '3px 10px',
                borderRadius: 4, background: `${C.accent}10`, color: C.accent,
                fontFamily: 'monospace', marginBottom: 16
              }}>Writing {question?.type} — {question?.topic}</div>

              <div style={{
                fontSize: 13, color: C.text, lineHeight: 1.9,
                padding: 16, background: C.bg2,
                border: `0.5px solid ${C.border}`, borderRadius: 10
              }}>
                {question?.question}
              </div>

              <div style={{ marginTop: 16, padding: 14, background: 'rgba(0,245,255,0.04)', borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: C.accent, marginBottom: 8 }}>📋 Eslatma</div>
                <div style={{ fontSize: 11, color: C.text2, lineHeight: 1.7 }}>
                  • Kamida 250 so'z yozing<br />
                  • Fikringizni aniq va mantiqiy ifodalang<br />
                  • Misollar keltiring<br />
                  • Xulosa yozishni unutmang
                </div>
              </div>
            </div>

            {/* Writing area */}
            <div style={{ display: 'flex', flexDirection: 'column', background: C.bg }}>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Essayingizni shu yerga yozing..."
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  padding: 24, color: C.text, fontSize: 14, lineHeight: 1.9,
                  resize: 'none', fontFamily: 'inherit'
                }}
              />
              <div style={{
                padding: '12px 24px', borderTop: `1px solid ${C.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span style={{ fontSize: 11, color: wordCount >= 250 ? C.green : C.text2 }}>
                  {wordCount} / 250 so'z {wordCount >= 250 ? '✅' : ''}
                </span>
                <button onClick={submitExam} disabled={wordCount < 30 || loading} style={{
                  padding: '10px 24px', borderRadius: 8, border: 'none',
                  background: wordCount >= 30 ? '#ef4444' : 'rgba(255,255,255,0.05)',
                  color: '#fff', fontSize: 13, fontWeight: 500,
                  cursor: wordCount >= 30 ? 'pointer' : 'not-allowed'
                }}>
                  {loading ? '⏳ Baholanmoqda...' : '✅ Topshirish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULT */}
      {stage === 'result' && (
        <>
          <div style={{ background: C.bg3, borderBottom: `1px solid ${C.border}`, padding: '16px 24px' }}>
            <h1 style={{ fontSize: 22, fontWeight: 500, color: C.accent, marginBottom: 3 }}>📊 Natijalar</h1>
            <p style={{ fontSize: 12, color: C.text2 }}>AI baholash yakunlandi</p>
          </div>

          <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 24px' }}>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: C.text2 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
                <p>AI baholamoqda...</p>
              </div>
            ) : (
              <>
                {/* Scores */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
                  <div style={{
                    background: C.bg2, border: `0.5px solid ${C.accent}40`,
                    borderRadius: 12, padding: 20, textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 11, color: C.text2, marginBottom: 4 }}>Band</div>
                    <div style={{ fontSize: 40, fontWeight: 500, color: C.accent }}>
                      {feedback?.band || '—'}
                    </div>
                  </div>
                  <div style={{
                    background: C.bg2, border: `0.5px solid ${C.green}40`,
                    borderRadius: 12, padding: 20, textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 11, color: C.text2, marginBottom: 4 }}>Yozish vaqti</div>
                    <div style={{ fontSize: 28, fontWeight: 500, color: C.green }}>
                      {spentMins}:{spentSecs.toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div style={{
                    background: C.bg2, border: `0.5px solid ${C.amber}40`,
                    borderRadius: 12, padding: 20, textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 11, color: C.text2, marginBottom: 4 }}>So'zlar soni</div>
                    <div style={{ fontSize: 28, fontWeight: 500, color: C.amber }}>{wordCount}</div>
                  </div>
                </div>

                {/* Savol */}
                <div style={{
                  background: C.bg2, border: `0.5px solid ${C.border}`,
                  borderRadius: 10, padding: 16, marginBottom: 16
                }}>
                  <div style={{ fontSize: 11, color: C.text2, marginBottom: 6 }}>Savol:</div>
                  <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{question?.question}</div>
                </div>

                {/* Feedback */}
                {feedback?.feedback_uz && (
                  <div style={{
                    background: `${C.accent}05`, border: `0.5px solid ${C.border2}`,
                    borderRadius: 10, padding: 16, marginBottom: 16
                  }}>
                    <div style={{ fontSize: 12, color: C.accent, fontWeight: 500, marginBottom: 8 }}>
                      🤖 AI umumiy baholash:
                    </div>
                    <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>{feedback.feedback_uz}</div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  {feedback?.good_phrases?.length > 0 && (
                    <div style={{
                      background: C.bg2, border: `0.5px solid ${C.green}30`,
                      borderRadius: 10, padding: 14
                    }}>
                      <div style={{ fontSize: 12, color: C.green, fontWeight: 500, marginBottom: 8 }}>
                        ✅ Kuchli tomonlar:
                      </div>
                      {feedback.good_phrases.map((p, i) => (
                        <div key={i} style={{ fontSize: 12, color: C.text, paddingLeft: 10, marginBottom: 4 }}>• {p}</div>
                      ))}
                    </div>
                  )}
                  {feedback?.improve_suggestions?.length > 0 && (
                    <div style={{
                      background: C.bg2, border: `0.5px solid ${C.amber}30`,
                      borderRadius: 10, padding: 14
                    }}>
                      <div style={{ fontSize: 12, color: C.amber, fontWeight: 500, marginBottom: 8 }}>
                        💡 Yaxshilash kerak:
                      </div>
                      {feedback.improve_suggestions.map((p, i) => (
                        <div key={i} style={{ fontSize: 12, color: C.text, paddingLeft: 10, marginBottom: 4 }}>• {p}</div>
                      ))}
                    </div>
                  )}
                </div>

                {feedback?.grammar_issues?.length > 0 && (
                  <div style={{
                    background: C.bg2, border: `0.5px solid rgba(239,68,68,0.3)`,
                    borderRadius: 10, padding: 14, marginBottom: 16
                  }}>
                    <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 500, marginBottom: 8 }}>
                      ⚠️ Grammatika xatolari:
                    </div>
                    {feedback.grammar_issues.map((p, i) => (
                      <div key={i} style={{ fontSize: 12, color: C.text, paddingLeft: 10, marginBottom: 4 }}>• {p}</div>
                    ))}
                  </div>
                )}

                {/* Yozilgan essay */}
                <div style={{
                  background: C.bg2, border: `0.5px solid ${C.border}`,
                  borderRadius: 10, padding: 16, marginBottom: 20
                }}>
                  <div style={{ fontSize: 12, color: C.text2, marginBottom: 10 }}>Sizning essayingiz:</div>
                  <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{text}</div>
                </div>

                <button onClick={() => { setStage('intro'); setFeedback(null); setText('') }} style={{
                  width: '100%', padding: 14, borderRadius: 10, border: 'none',
                  background: C.accent, color: C.bg,
                  fontSize: 14, fontWeight: 500, cursor: 'pointer'
                }}>
                  🔄 Yangi Mock Imtihon
                </button>
              </>
            )}
          </div>
        </>
      )}
    </main>
  )
}