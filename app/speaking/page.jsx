'use client'
import { useState } from 'react'

const C = {
  bg: '#0D1117', bg2: '#0d1f2d', bg3: '#0a1628',
  border: 'rgba(0,245,255,0.15)', border2: 'rgba(0,245,255,0.3)',
  text: '#e2e8f0', text2: '#94a3b8',
  accent: '#00F5FF', amber: '#F59E0B', green: '#93E9BE',
}

const SPEAKING_DATA = {
  1: [
    {
      id: 1,
      topic: 'Technology',
      question: 'Do you use social media regularly?',
      band7: {
        answer: "Yes, I'd say I'm a fairly avid user. I check platforms like Instagram and Twitter daily, primarily to keep abreast of current trends and stay in touch with friends. However, I try to be mindful of the time I spend on them.",
        vocab: ['fairly avid', 'keep abreast of', 'mindful of'],
        tip: '"fairly avid" va "keep abreast of" — examinerga ta\'sir qiladi',
      },
      band9: {
        answer: "I'd say I use it quite extensively, though I've become increasingly selective about which platforms I engage with. Instagram and LinkedIn are my go-to apps — the former for creative inspiration and the latter for professional networking. I'm acutely aware of the addictive nature of these platforms, so I deliberately set screen time limits.",
        vocab: ['extensively', 'selective', 'go-to', 'acutely aware', 'deliberately'],
        tip: '"acutely aware" va "deliberately" — C2 darajasi',
      },
    },
    {
      id: 2,
      topic: 'Technology',
      question: 'How has technology changed the way people communicate?',
      band7: {
        answer: "Technology has fundamentally transformed communication. People now rely heavily on messaging apps and video calls instead of face-to-face meetings. While this makes communication more convenient, it can sometimes feel impersonal.",
        vocab: ['fundamentally transformed', 'rely heavily on', 'face-to-face'],
        tip: '"fundamentally transformed" — kuchli akademik ibora',
      },
      band9: {
        answer: "Technology has wrought a seismic shift in human communication. The advent of smartphones and social media has not only made interaction instantaneous but has also blurred geographical boundaries. That said, there's a compelling argument that we've sacrificed depth for breadth — we communicate more frequently but perhaps less meaningfully.",
        vocab: ['wrought a seismic shift', 'advent', 'instantaneous', 'blurred boundaries', 'sacrificed depth for breadth'],
        tip: '"wrought a seismic shift" — Band 9 darajasidagi ibora',
      },
    },
    {
      id: 3,
      topic: 'Education',
      question: 'Did you enjoy studying at school?',
      band7: {
        answer: "Yes, for the most part I did. I particularly enjoyed subjects like science and mathematics because they challenged me to think critically. However, I found some lessons rather tedious, especially when the teaching method was purely lecture-based.",
        vocab: ['for the most part', 'think critically', 'tedious', 'lecture-based'],
        tip: '"for the most part" — fikrni nozik ifodalash uchun',
      },
      band9: {
        answer: "It was a mixed experience, to be honest. I thrived in subjects that fostered analytical thinking, like physics and literature, where the curriculum encouraged us to question assumptions rather than merely memorise facts. Conversely, rote-learning-heavy subjects left me feeling intellectually stifled.",
        vocab: ['thrived', 'fostered', 'curriculum', 'question assumptions', 'rote-learning', 'intellectually stifled'],
        tip: '"intellectually stifled" — juda kuchli C2 ibora',
      },
    },
    {
      id: 4,
      topic: 'Environment',
      question: 'Do you think people care enough about the environment?',
      band7: {
        answer: "Honestly, I think there's a growing awareness, but actions don't always match the concern. Many people recycle and try to reduce their carbon footprint, but large-scale change requires government intervention and corporate responsibility.",
        vocab: ['growing awareness', 'carbon footprint', 'government intervention', 'corporate responsibility'],
        tip: '"carbon footprint" — muhim IELTS kalit so\'z',
      },
      band9: {
        answer: "There's a profound disconnect between stated concern and actual behaviour. While surveys consistently reveal widespread environmental anxiety, consumption patterns tell a starkly different story. I think the issue is that individual guilt has been weaponised to deflect attention from systemic corporate negligence.",
        vocab: ['profound disconnect', 'widespread', 'consumption patterns', 'starkly', 'weaponised', 'systemic negligence'],
        tip: '"profound disconnect" — Band 9 darajasidagi boshlanish',
      },
    },
  ],
  2: [
    {
      id: 5,
      topic: 'Places',
      question: 'Describe a place you have visited that you found particularly interesting.',
      cue_card: [
        'Qayerda joylashgan',
        'Qachon bordingiz',
        'Nima ko\'rdingiz',
        'Nega qiziqarli deb hisoblaysiz',
      ],
      band7: {
        answer: "I'd like to talk about Samarkand, a city in Uzbekistan that I visited last summer. It's located in the heart of Central Asia and is famous for its magnificent Islamic architecture, particularly the Registan Square. When I visited, I was immediately struck by the sheer scale and beauty of the buildings. The intricate tile work and imposing domes left a lasting impression on me. I found it particularly fascinating because it connects the present to the ancient Silk Road era.",
        vocab: ['magnificent', 'immediately struck by', 'sheer scale', 'intricate tile work', 'imposing', 'lasting impression'],
        tip: '"immediately struck by" — Part 2 da kuchli boshlanish',
      },
      band9: {
        answer: "The place that springs to mind is Samarkand, an ancient city in Uzbekistan that I had the privilege of visiting two years ago. What makes it truly extraordinary is its status as a living testament to the Timurid Renaissance — the Registan complex, in particular, left me utterly awestruck. The geometric precision of the tilework, combined with the almost otherworldly scale of the structures, created an overwhelming sense of standing at the crossroads of civilisations. It profoundly altered my understanding of Islamic artistry and Central Asian history.",
        vocab: ['springs to mind', 'privilege', 'living testament', 'utterly awestruck', 'geometric precision', 'otherworldly', 'crossroads of civilisations'],
        tip: '"springs to mind" — Part 2 uchun eng yaxshi boshlanish iborasi',
      },
    },
    {
      id: 6,
      topic: 'People',
      question: 'Describe a person who has had a great influence on you.',
      cue_card: [
        'Kim bu odam',
        'Qachon tanishgansiz',
        'U qanday inson',
        'Nima uchun ta\'sirchan',
      ],
      band7: {
        answer: "I'd like to describe my secondary school English teacher, Mr. Karimov. I met him when I was fifteen, and he completely changed my attitude towards learning. He was incredibly passionate about literature and had a unique ability to make even complex texts accessible and enjoyable. What I admired most was his patience and dedication. He instilled in me a love of reading that has stayed with me ever since.",
        vocab: ['completely changed my attitude', 'incredibly passionate', 'accessible', 'instilled in me', 'dedication'],
        tip: '"instilled in me" — ta\'sir haqida gapirishning eng kuchli usuli',
      },
      band9: {
        answer: "The person who has most profoundly shaped my worldview is my former mentor, a professor I encountered during my undergraduate years. What set him apart wasn't merely his encyclopaedic knowledge, but his intellectual humility — he approached every topic with genuine curiosity rather than dogmatic certainty. He taught me that the most dangerous thing a person can do is stop questioning their own assumptions. That philosophy has permeated every aspect of my thinking since.",
        vocab: ['profoundly shaped', 'worldview', 'encyclopaedic', 'intellectual humility', 'dogmatic certainty', 'permeated'],
        tip: '"intellectual humility" va "permeated" — Band 9 leksikasi',
      },
    },
  ],
  3: [
    {
      id: 7,
      topic: 'Technology & Society',
      question: 'Do you think artificial intelligence will replace human workers in the future?',
      band7: {
        answer: "I think AI will definitely replace some jobs, particularly routine and repetitive tasks. However, roles requiring creativity, emotional intelligence, and critical thinking are likely to remain human-dominated. The key challenge will be retraining workers for new roles that emerge alongside AI development.",
        vocab: ['routine and repetitive', 'emotional intelligence', 'critical thinking', 'human-dominated', 'retraining'],
        tip: '"emotional intelligence" — texnologiya mavzusida kuchli argument',
      },
      band9: {
        answer: "The question isn't whether AI will displace workers — it demonstrably will — but rather at what pace and whether societies can adapt swiftly enough. Historical precedent, such as the Industrial Revolution, suggests that technological disruption ultimately creates more jobs than it destroys, though the transitional period can be enormously painful for affected communities. The real danger lies not in the technology itself but in policymakers' failure to anticipate and mitigate its socioeconomic consequences.",
        vocab: ['demonstrably', 'swiftly', 'historical precedent', 'technological disruption', 'transitional period', 'socioeconomic consequences', 'mitigate'],
        tip: '"demonstrably" — fikrni qat\'iy ifodalash uchun Band 9 so\'zi',
      },
    },
    {
      id: 8,
      topic: 'Environment & Policy',
      question: 'What can governments do to encourage people to be more environmentally friendly?',
      band7: {
        answer: "Governments have several effective tools at their disposal. They could introduce tax incentives for eco-friendly purchases, invest heavily in public transport to reduce car dependency, and implement stricter regulations on industrial pollution. Education campaigns also play a vital role in shifting public attitudes.",
        vocab: ['at their disposal', 'tax incentives', 'eco-friendly', 'car dependency', 'implement regulations', 'shifting attitudes'],
        tip: '"at their disposal" — Part 3 da kuchli boshlanish',
      },
      band9: {
        answer: "Governments wield a formidable arsenal of policy tools, though the most effective interventions tend to combine carrots and sticks simultaneously. Carbon pricing mechanisms, for instance, create genuine financial incentives to reduce emissions, while robust investment in renewable infrastructure makes sustainable choices more accessible. Crucially, however, behavioural change at scale requires more than legislation — it demands a fundamental reframing of how societies conceptualise consumption and prosperity.",
        vocab: ['wield', 'formidable arsenal', 'carrots and sticks', 'carbon pricing', 'robust', 'reframing', 'conceptualise', 'prosperity'],
        tip: '"carrots and sticks" idiomi — examinerga ajoyib ta\'sir qoldiradi',
      },
    },
  ],
}

export default function SpeakingPage() {
  const [part, setPart] = useState(1)
  const [selectedQ, setSelectedQ] = useState(null)
  const [bandView, setBandView] = useState('band7')
  const [showAnswer, setShowAnswer] = useState(false)
  const [practiceMode, setPracticeMode] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerRef, setTimerRef] = useState(null)

  function startTimer() {
    setTimer(0)
    setTimerRunning(true)
    const ref = setInterval(() => setTimer(t => t + 1), 1000)
    setTimerRef(ref)
  }

  function stopTimer() {
    setTimerRunning(false)
    clearInterval(timerRef)
  }

  function selectQuestion(q) {
    setSelectedQ(q)
    setShowAnswer(false)
    setPracticeMode(false)
    stopTimer()
    setTimer(0)
  }

  const mins = Math.floor(timer / 60)
  const secs = timer % 60

  const questions = SPEAKING_DATA[part] || []

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      <div style={{ background: C.bg3, borderBottom: `1px solid ${C.border}`, padding: '16px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: C.accent, marginBottom: 3 }}>🎤 Speaking Tayyorgarlik</h1>
        <p style={{ fontSize: 12, color: C.text2 }}>Part 1, 2, 3 uchun namuna javoblar — Band 7 va Band 9 darajasida</p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

        {/* Part tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[1, 2, 3].map(p => (
            <button key={p} onClick={() => { setPart(p); setSelectedQ(null) }} style={{
              padding: '8px 20px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
              border: `0.5px solid ${part === p ? C.accent : C.border}`,
              background: part === p ? `${C.accent}15` : 'transparent',
              color: part === p ? C.accent : C.text2, fontWeight: part === p ? 500 : 400,
            }}>
              Part {p}
              <span style={{ fontSize: 10, marginLeft: 6, color: C.text2 }}>
                {p === 1 ? '(Shaxsiy savollar)' : p === 2 ? '(Cue Card)' : '(Munozara)'}
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedQ ? '280px 1fr' : '1fr', gap: 16 }}>

          {/* Question list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {!selectedQ && (
              <div style={{ fontSize: 12, color: C.text2, marginBottom: 4 }}>
                {questions.length} ta savol — bosing va namuna javob ko'ring
              </div>
            )}
            {questions.map(q => (
              <div key={q.id} onClick={() => selectQuestion(q)} style={{
                background: selectedQ?.id === q.id ? `${C.accent}10` : C.bg2,
                border: `0.5px solid ${selectedQ?.id === q.id ? C.accent : C.border}`,
                borderRadius: 10, padding: 14, cursor: 'pointer', transition: 'all 0.15s'
              }}
                onMouseEnter={e => { if (selectedQ?.id !== q.id) e.currentTarget.style.borderColor = C.border2 }}
                onMouseLeave={e => { if (selectedQ?.id !== q.id) e.currentTarget.style.borderColor = C.border }}>
                <div style={{
                  display: 'inline-block', fontSize: 10, padding: '2px 8px',
                  borderRadius: 4, background: `${C.accent}10`, color: C.accent,
                  fontFamily: 'monospace', marginBottom: 8
                }}>{q.topic}</div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{q.question}</div>
                {part === 2 && q.cue_card && (
                  <div style={{ marginTop: 8 }}>
                    {q.cue_card.map((c, i) => (
                      <div key={i} style={{ fontSize: 11, color: C.text2, paddingLeft: 10 }}>• {c}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Answer panel */}
          {selectedQ && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Band selector */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: C.text2 }}>Band darajasi:</span>
                {['band7', 'band9'].map(b => (
                  <button key={b} onClick={() => { setBandView(b); setShowAnswer(false) }} style={{
                    padding: '6px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                    border: `0.5px solid ${bandView === b ? (b === 'band7' ? C.amber : C.green) : C.border}`,
                    background: bandView === b ? (b === 'band7' ? `${C.amber}15` : `${C.green}15`) : 'transparent',
                    color: bandView === b ? (b === 'band7' ? C.amber : C.green) : C.text2,
                  }}>
                    {b === 'band7' ? '⭐ Band 7' : '🏆 Band 9'}
                  </button>
                ))}
                <button onClick={() => setSelectedQ(null)} style={{
                  marginLeft: 'auto', background: 'none', border: 'none',
                  color: C.text2, fontSize: 12, cursor: 'pointer'
                }}>← Orqaga</button>
              </div>

              {/* Question */}
              <div style={{
                background: C.bg2, border: `0.5px solid ${C.border}`,
                borderRadius: 10, padding: 16
              }}>
                <div style={{ fontSize: 11, color: C.text2, marginBottom: 6 }}>
                  Part {part} savol:
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, color: C.text }}>{selectedQ.question}</div>
                {part === 2 && selectedQ.cue_card && (
                  <div style={{ marginTop: 10, padding: 10, background: 'rgba(0,245,255,0.04)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: C.accent, marginBottom: 6 }}>Cue card:</div>
                    {selectedQ.cue_card.map((c, i) => (
                      <div key={i} style={{ fontSize: 12, color: C.text2, paddingLeft: 10 }}>• {c}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Practice mode */}
              {!practiceMode ? (
                <button onClick={() => { setPracticeMode(true); startTimer() }} style={{
                  padding: '10px', borderRadius: 8,
                  border: `0.5px solid ${C.amber}40`,
                  background: `${C.amber}08`, color: C.amber,
                  fontSize: 12, cursor: 'pointer'
                }}>
                  🎙️ O'zim javob beraman (vaqt boshlanadi)
                </button>
              ) : (
                <div style={{
                  background: C.bg2, border: `0.5px solid ${C.amber}40`,
                  borderRadius: 10, padding: 14, textAlign: 'center'
                }}>
                  <div style={{ fontSize: 28, fontWeight: 500, color: C.amber, marginBottom: 6 }}>
                    {mins}:{secs.toString().padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: 11, color: C.text2, marginBottom: 12 }}>
                    {part === 1 ? 'Part 1: 4-5 jumlada javob bering' : part === 2 ? 'Part 2: 1-2 daqiqa gapiring' : 'Part 3: Chuqur tahlil qiling'}
                  </div>
                  <button onClick={() => { stopTimer(); setShowAnswer(true); setPracticeMode(false) }} style={{
                    padding: '8px 20px', borderRadius: 8, border: 'none',
                    background: C.amber, color: C.bg,
                    fontSize: 12, fontWeight: 500, cursor: 'pointer'
                  }}>✅ Tugatdim — javobni ko'rish</button>
                </div>
              )}

              {/* Sample answer */}
              {showAnswer && selectedQ[bandView] && (
                <div style={{ background: C.bg2, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: 18 }}>
                  <div style={{ fontSize: 12, color: bandView === 'band7' ? C.amber : C.green, fontWeight: 500, marginBottom: 12 }}>
                    {bandView === 'band7' ? '⭐ Band 7 namuna javob:' : '🏆 Band 9 namuna javob:'}
                  </div>
                  <p style={{ fontSize: 13, color: C.text, lineHeight: 1.8, marginBottom: 16 }}>
                    {selectedQ[bandView].answer}
                  </p>

                  {/* Vocab */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: C.text2, marginBottom: 8 }}>📌 Muhim iboralar:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selectedQ[bandView].vocab.map((v, i) => (
                        <span key={i} style={{
                          fontSize: 11, padding: '3px 10px', borderRadius: 4,
                          background: `${C.accent}10`, color: C.accent,
                          border: `0.5px solid ${C.border2}`, fontFamily: 'monospace'
                        }}>{v}</span>
                      ))}
                    </div>
                  </div>

                  {/* Tip */}
                  <div style={{
                    padding: '10px 14px', borderRadius: 8,
                    background: `${C.green}08`, border: `0.5px solid ${C.green}30`,
                    fontSize: 12, color: C.green
                  }}>
                    💡 Examiner maslahati: {selectedQ[bandView].tip}
                  </div>
                </div>
              )}

              {/* Show answer button */}
              {!showAnswer && !practiceMode && (
                <button onClick={() => setShowAnswer(true)} style={{
                  padding: '10px', borderRadius: 8,
                  border: `0.5px solid ${C.border2}`,
                  background: `${C.accent}08`, color: C.accent,
                  fontSize: 12, cursor: 'pointer'
                }}>👁️ Namuna javobni ko'rish</button>
              )}

              {/* Compare bands */}
              {showAnswer && (
                <div style={{
                  background: C.bg2, border: `0.5px solid ${C.border}`,
                  borderRadius: 10, padding: 14
                }}>
                  <div style={{ fontSize: 12, color: C.text2, marginBottom: 10 }}>
                    📊 Band 7 vs Band 9 farqi:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: C.amber, marginBottom: 6 }}>⭐ Band 7</div>
                      {selectedQ.band7.vocab.map((v, i) => (
                        <div key={i} style={{ fontSize: 11, color: C.text2, paddingLeft: 10, marginBottom: 3 }}>• {v}</div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: C.green, marginBottom: 6 }}>🏆 Band 9</div>
                      {selectedQ.band9.vocab.map((v, i) => (
                        <div key={i} style={{ fontSize: 11, color: C.text2, paddingLeft: 10, marginBottom: 3 }}>• {v}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
