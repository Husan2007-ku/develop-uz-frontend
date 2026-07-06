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

const SAMPLE_TOPICS = [
  'Social media has a negative impact on young people',
  'Governments should invest more in public transport',
  'Technology is making people less sociable',
  'University education should be free for everyone',
  'Climate change is the biggest threat facing humanity',
  'Working from home has more advantages than disadvantages',
]

export default function IdeaGeneratorPage() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('arguments')

  async function generateIdeas() {
    if (topic.trim().length < 10) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`${API}/ai/idea-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })
      const data = await res.json()
      setResult(data)
      setActiveTab('arguments')
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: C.bg, color: C.text }}>
      <div style={{ background: C.bg3, borderBottom: `1px solid ${C.border}`, padding: '16px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: C.accent, marginBottom: 3 }}>💡 Idea Generator</h1>
        <p style={{ fontSize: 12, color: C.text2 }}>
          Writing Task 2 mavzusini kiriting — AI argumentlar, vocabulary va outline beradi
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>

        {/* Input */}
        <div style={{
          background: C.bg2, border: `0.5px solid ${C.border}`,
          borderRadius: 12, padding: 20, marginBottom: 20
        }}>
          <div style={{ fontSize: 12, color: C.text2, marginBottom: 10 }}>
            Writing Task 2 mavzusini yozing:
          </div>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Masalan: Social media has a negative impact on young people's mental health. Discuss both views and give your opinion."
            rows={3}
            style={{
              width: '100%', background: C.bg, border: `0.5px solid ${C.border}`,
              borderRadius: 8, padding: 12, color: C.text, fontSize: 13,
              lineHeight: 1.6, resize: 'vertical', outline: 'none',
              fontFamily: 'inherit', marginBottom: 12
            }}
          />

          {/* Sample topics */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.text2, marginBottom: 8 }}>
              Yoki tayyor mavzulardan birini tanlang:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SAMPLE_TOPICS.map((t, i) => (
                <button key={i} onClick={() => setTopic(t)} style={{
                  fontSize: 11, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                  border: `0.5px solid ${C.border}`,
                  background: topic === t ? `${C.accent}15` : 'transparent',
                  color: topic === t ? C.accent : C.text2,
                }}>{t.length > 40 ? t.slice(0, 40) + '...' : t}</button>
              ))}
            </div>
          </div>

          <button onClick={generateIdeas} disabled={topic.trim().length < 10 || loading} style={{
            width: '100%', padding: 12, borderRadius: 8, border: 'none',
            background: topic.trim().length >= 10 ? C.accent : 'rgba(255,255,255,0.05)',
            color: topic.trim().length >= 10 ? C.bg : C.text2,
            fontSize: 13, fontWeight: 500,
            cursor: topic.trim().length >= 10 ? 'pointer' : 'not-allowed'
          }}>
            {loading ? '⏳ AI fikrlamoqda...' : '💡 Idea Generation'}
          </button>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {[
                { id: 'arguments', label: '⚖️ Argumentlar' },
                { id: 'vocabulary', label: '🧠 Vocabulary' },
                { id: 'outline', label: '📋 Outline' },
                { id: 'thesis', label: '✍️ Thesis' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  padding: '7px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                  border: `0.5px solid ${activeTab === tab.id ? C.accent : C.border}`,
                  background: activeTab === tab.id ? `${C.accent}12` : 'transparent',
                  color: activeTab === tab.id ? C.accent : C.text2,
                }}>{tab.label}</button>
              ))}
              <Link href="/ai-essay" style={{ textDecoration: 'none', marginLeft: 'auto' }}>
                <button style={{
                  padding: '7px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                  border: `0.5px solid ${C.amber}40`,
                  background: `${C.amber}10`, color: C.amber,
                }}>✍️ Essay yozish →</button>
              </Link>
            </div>

            {/* Arguments */}
            {activeTab === 'arguments' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{
                  background: C.bg2, border: `0.5px solid ${C.green}30`,
                  borderRadius: 12, padding: 18
                }}>
                  <div style={{ fontSize: 13, color: C.green, fontWeight: 500, marginBottom: 14 }}>
                    ✅ Tarafdor argumentlar (Pro)
                  </div>
                  {result.pro_arguments?.map((arg, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.03)', borderRadius: 8,
                      padding: 12, marginBottom: 10
                    }}>
                      <div style={{ fontSize: 13, color: C.text, marginBottom: 6, fontWeight: 500 }}>
                        {i + 1}. {arg.argument}
                      </div>
                      {arg.example && (
                        <div style={{
                          fontSize: 12, color: C.text2, fontStyle: 'italic',
                          borderLeft: `2px solid ${C.green}40`, paddingLeft: 10, marginBottom: 8
                        }}>
                          Misol: {arg.example}
                        </div>
                      )}
                      {arg.vocabulary?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {arg.vocabulary.map((v, j) => (
                            <span key={j} style={{
                              fontSize: 10, padding: '2px 7px', borderRadius: 4,
                              background: `${C.green}10`, color: C.green,
                              fontFamily: 'monospace'
                            }}>{v}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{
                  background: C.bg2, border: `0.5px solid rgba(239,68,68,0.3)`,
                  borderRadius: 12, padding: 18
                }}>
                  <div style={{ fontSize: 13, color: '#ef4444', fontWeight: 500, marginBottom: 14 }}>
                    ❌ Qarshi argumentlar (Con)
                  </div>
                  {result.con_arguments?.map((arg, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.03)', borderRadius: 8,
                      padding: 12, marginBottom: 10
                    }}>
                      <div style={{ fontSize: 13, color: C.text, marginBottom: 6, fontWeight: 500 }}>
                        {i + 1}. {arg.argument}
                      </div>
                      {arg.example && (
                        <div style={{
                          fontSize: 12, color: C.text2, fontStyle: 'italic',
                          borderLeft: '2px solid rgba(239,68,68,0.4)', paddingLeft: 10, marginBottom: 8
                        }}>
                          Misol: {arg.example}
                        </div>
                      )}
                      {arg.vocabulary?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {arg.vocabulary.map((v, j) => (
                            <span key={j} style={{
                              fontSize: 10, padding: '2px 7px', borderRadius: 4,
                              background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                              fontFamily: 'monospace'
                            }}>{v}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vocabulary */}
            {activeTab === 'vocabulary' && (
              <div style={{
                background: C.bg2, border: `0.5px solid ${C.border}`,
                borderRadius: 12, padding: 20
              }}>
                <div style={{ fontSize: 13, color: C.text2, marginBottom: 16 }}>
                  Bu mavzu uchun tavsiya etilgan C1/C2 vocabulary:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 10 }}>
                  {result.key_vocabulary?.map((v, i) => {
                    const lvColor = v.level === 'C2' ? '#9b5de5' : v.level === 'C1' ? C.accent : C.green
                    return (
                      <div key={i} style={{
                        background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12,
                        border: `0.5px solid ${C.border}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{v.word}</span>
                          <span style={{
                            fontSize: 10, padding: '2px 6px', borderRadius: 4,
                            background: `${lvColor}15`, color: lvColor, fontFamily: 'monospace'
                          }}>{v.level}</span>
                        </div>
                        <div style={{ fontSize: 12, color: C.text2 }}>🇺🇿 {v.translation}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Outline */}
            {activeTab === 'outline' && result.outline && (
              <div style={{
                background: C.bg2, border: `0.5px solid ${C.border}`,
                borderRadius: 12, padding: 20
              }}>
                <div style={{ fontSize: 13, color: C.text2, marginBottom: 16 }}>
                  Essay strukturasi (outline):
                </div>
                {[
                  { key: 'introduction', label: '📖 Kirish (Introduction)', color: C.accent },
                  { key: 'body_1', label: '📝 1-paragraf (Body 1)', color: C.green },
                  { key: 'body_2', label: '📝 2-paragraf (Body 2)', color: C.green },
                  { key: 'conclusion', label: '🎯 Xulosa (Conclusion)', color: C.amber },
                ].map(section => (
                  <div key={section.key} style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: 8,
                    padding: 14, marginBottom: 10,
                    borderLeft: `3px solid ${section.color}40`
                  }}>
                    <div style={{ fontSize: 12, color: section.color, fontWeight: 500, marginBottom: 8 }}>
                      {section.label}
                    </div>
                    <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>
                      {result.outline[section.key]}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Thesis */}
            {activeTab === 'thesis' && (
              <div style={{
                background: C.bg2, border: `0.5px solid ${C.border}`,
                borderRadius: 12, padding: 24
              }}>
                <div style={{ fontSize: 13, color: C.text2, marginBottom: 16 }}>
                  Tavsiya etilgan thesis statement:
                </div>
                <div style={{
                  background: `${C.accent}06`, border: `0.5px solid ${C.border2}`,
                  borderRadius: 10, padding: 18
                }}>
                  <div style={{ fontSize: 15, color: C.text, lineHeight: 1.8, fontStyle: 'italic' }}>
                    "{result.thesis_statement}"
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, color: C.text2, marginBottom: 8 }}>
                    💡 Yaxshi thesis statement qanday bo'lishi kerak:
                  </div>
                  {[
                    'Savolga to\'g\'ridan-to\'g\'ri javob berishi kerak',
                    'Sizning pozitsiyangizni aniq ifodalashi kerak',
                    'Ikkita asosiy argumentni ko\'rsatishi kerak',
                    'Bir jumlada to\'liq fikr berilishi kerak',
                  ].map((tip, i) => (
                    <div key={i} style={{ fontSize: 12, color: C.text2, paddingLeft: 10, marginBottom: 4 }}>
                      <span style={{ color: C.green }}>✓</span> {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {result?.error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)',
            borderRadius: 10, padding: 16, color: '#ef4444', fontSize: 13
          }}>
            ❌ Xatolik: {result.error}. Backend ishlab turganiga ishonch hosil qiling.
          </div>
        )}
      </div>
    </main>
  )
}
