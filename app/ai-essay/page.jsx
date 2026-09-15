'use client'
import { useState, useEffect, useRef } from 'react'
import GlassBackground from '@/components/GlassBackground'
import WritingTabs from '@/components/WritingTabs'
import {
  IconBot, IconEssay, IconPencil, IconSearch, IconCheck, IconX,
  IconTarget, IconRefresh, IconSend, IconClock, IconArrowRight, IconChart,
} from '@/components/Icons'
import styles from './ai-essay.module.css'

const API = 'https://develop-uz-api.onrender.com'

export default function AIEssayPage() {
  const [mode, setMode] = useState(null) // 'paste' | 'write'

  return (
    <div className={styles.wrapper}>
      <GlassBackground />
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}><IconBot /></span>
            AI Essay Tahlil
          </h1>
          <p className={styles.desc}>Essayingizni AI yordamida tahlil qiling yoki yangi essay yozing</p>
        </div>

        <WritingTabs />

        {!mode && (
          <div className={styles.modeGrid}>
            <div className={`glassPanel ${styles.modeCard}`} onClick={() => setMode('paste')}>
              <span className={styles.modeCardIcon} style={{ background: 'var(--t-blue)', color: 'var(--on-blue)' }}><IconEssay /></span>
              <div className={styles.modeCardTitle}>Boshqa essay tashlash</div>
              <div className={styles.modeCardDesc}>
                Boshqa birovning yoki internetdan topgan essayingizni joylashtiring,
                AI undan vocabulary va grammatika strukturalarini ajratib beradi.
              </div>
            </div>

            <div className={`glassPanel ${styles.modeCard}`} onClick={() => setMode('write')}>
              <span className={styles.modeCardIcon} style={{ background: 'var(--t-orange)', color: 'var(--on-orange)' }}><IconPencil /></span>
              <div className={styles.modeCardTitle}>O'zim yozaman</div>
              <div className={styles.modeCardDesc}>
                Writing workspace ochiladi: vocabulary qidirish, AI yordam, real-time
                grammatika tekshiruvi va yozish vaqti hisoblanadi.
              </div>
            </div>
          </div>
        )}

        {mode === 'paste' && <PasteMode onBack={() => setMode(null)} />}
        {mode === 'write' && <WriteMode onBack={() => setMode(null)} />}
      </div>
    </div>
  )
}

const HL_COLOR = {
  collocation: { bg: 'var(--t-orange)', color: 'var(--on-orange)', label: 'Collocation' },
  idiom: { bg: 'var(--t-green)', color: 'var(--on-green)', label: 'Idiom' },
  c1_vocab: { bg: 'var(--t-blue)', color: 'var(--on-blue)', label: 'C1' },
  c2_vocab: { bg: 'var(--t-violet)', color: 'var(--on-violet)', label: 'C2' },
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

  return (
    <div>
      <button className={styles.backLink} onClick={onBack}><IconArrowRight style={{ transform: 'scaleX(-1)' }} /> Orqaga</button>

      {!result ? (
        <div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Essay matnini shu yerga joylashtiring (kamida 50 ta belgi)..."
            className={styles.textareaBox}
          />
          <div className={styles.textareaFooter}>
            <span className={styles.charCount}>{text.length} belgi</span>
            <button className={styles.primaryBtn} onClick={analyze} disabled={text.trim().length < 50 || loading}>
              <IconSend /> {loading ? 'Tahlil qilinmoqda...' : 'Tahlil qilish'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.tabRow}>
            {[
              { id: 'analysis', label: 'Tahlil', Icon: IconChart },
              { id: 'text', label: 'Matn + Highlights', Icon: IconEssay },
            ].map(t => (
              <button
                key={t.id}
                className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
                onClick={() => setTab(t.id)}
              ><t.Icon /> {t.label}</button>
            ))}
            <button className={styles.newBtn} onClick={() => { setResult(null); setText('') }}>
              <IconRefresh /> Yangi essay
            </button>
          </div>

          {tab === 'analysis' && (
            <div className={styles.analysisGrid}>
              <div className={`glassPanel ${styles.bandCard}`}>
                <div className={styles.bandLbl}>Umumiy Band</div>
                <div className={styles.bandVal}>{result.overall_band || '—'}</div>
                <div className={styles.criteriaGrid}>
                  {[
                    { label: 'Task Achievement', value: result.task_achievement },
                    { label: 'Coherence', value: result.coherence_cohesion },
                    { label: 'Lexical Resource', value: result.lexical_resource },
                    { label: 'Grammar Range', value: result.grammatical_range },
                  ].map((s, i) => (
                    <div key={i} className={styles.criteriaItem}>
                      <div className={styles.criteriaLbl}>{s.label}</div>
                      <div className={styles.criteriaVal}>{s.value || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.sideCol}>
                {result.strengths?.length > 0 && (
                  <div className={`${styles.noteBox} ${styles.strengthBox}`}>
                    <div className={`${styles.noteLbl} ${styles.strengthLbl}`}><IconCheck /> Kuchli tomonlar</div>
                    {result.strengths.map((s, i) => (
                      <div key={i} className={styles.noteItem}>• {s}</div>
                    ))}
                  </div>
                )}
                {result.weaknesses?.length > 0 && (
                  <div className={`${styles.noteBox} ${styles.weaknessBox}`}>
                    <div className={`${styles.noteLbl} ${styles.weaknessLbl}`}><IconX /> Zaif tomonlar</div>
                    {result.weaknesses.map((s, i) => (
                      <div key={i} className={styles.noteItem}>• {s}</div>
                    ))}
                  </div>
                )}
                {result.suggestions?.length > 0 && (
                  <div className={`${styles.noteBox} ${styles.suggestionBox}`}>
                    <div className={`${styles.noteLbl} ${styles.suggestionLbl}`}><IconTarget /> Tavsiyalar</div>
                    {result.suggestions.map((s, i) => (
                      <div key={i} className={styles.noteItem}>• {s}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'text' && (
            <div className={styles.textGrid}>
              <div className={`glassPanel ${styles.textPanel}`}>
                <div className={styles.legendRow}>
                  {Object.entries(HL_COLOR).map(([type, style]) => (
                    <span key={type} className={styles.legendItem}>
                      <span className={styles.legendDot} style={{ background: style.bg }} />
                      {style.label}
                    </span>
                  ))}
                </div>
                <div className={styles.highlightedText}>
                  {renderHighlighted(text, highlights, HL_COLOR)}
                </div>
              </div>
              <div className={`glassPanel ${styles.phraseList}`}>
                <div className={styles.phraseListLbl}>Topilgan iboralar ({highlights?.length || 0})</div>
                {highlights?.map((h, i) => (
                  <div key={i} className={styles.phraseItem}>
                    <div className={styles.phraseWord} style={{ color: HL_COLOR[h.type]?.color || 'var(--text)' }}>{h.text}</div>
                    <div className={styles.phraseExpl}>{h.explanation_uz}</div>
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
    const style = colors[h.type] || { bg: 'var(--glass)', color: 'var(--text)' }
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
  const [grammarLoading, setGrammarLoading] = useState(false)
  const [grammarErrors, setGrammarErrors] = useState([])
  const [grammarChecked, setGrammarChecked] = useState(false)
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

  async function checkGrammar() {
    setGrammarLoading(true)
    try {
      const res = await fetch(`${API}/ai/essay/check-grammar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      const data = await res.json()
      setGrammarErrors(data.errors || [])
      setGrammarChecked(true)
    } catch (e) { console.error(e) }
    setGrammarLoading(false)
  }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  if (feedback) {
    return (
      <div>
        <button className={styles.backLink} onClick={onBack}><IconArrowRight style={{ transform: 'scaleX(-1)' }} /> Orqaga</button>
        <div className={`glassPanel ${styles.feedbackCard}`}>
          <div className={styles.feedbackTop}>
            <div>
              <div className={styles.feedbackMetaLbl}>Sizning bandingiz</div>
              <div className={styles.feedbackBandVal}>{feedback.band || '—'}</div>
            </div>
            <div>
              <div className={styles.feedbackMetaLbl}>Yozish vaqti</div>
              <div className={styles.feedbackTimeVal}>{mins}:{secs.toString().padStart(2, '0')}</div>
            </div>
            <div>
              <div className={styles.feedbackMetaLbl}>So'zlar soni</div>
              <div className={styles.feedbackWordsVal}>{wordCount}</div>
            </div>
          </div>

          {feedback.feedback_uz && (
            <div className={styles.feedbackAiBox}>
              <div className={styles.feedbackAiLbl}>Umumiy baholash</div>
              <div className={styles.feedbackAiText}>{feedback.feedback_uz}</div>
            </div>
          )}

          {feedback.good_phrases?.length > 0 && (
            <div className={styles.feedbackSection}>
              <div className={styles.feedbackGoodLbl}><IconCheck size={13} /> Yaxshi ishlatilgan</div>
              {feedback.good_phrases.map((p, i) => (
                <div key={i} className={styles.feedbackItem}>• {p}</div>
              ))}
            </div>
          )}

          {feedback.improve_suggestions?.length > 0 && (
            <div className={styles.feedbackSection}>
              <div className={styles.feedbackImproveLbl}><IconTarget size={13} /> Yaxshilash kerak</div>
              {feedback.improve_suggestions.map((p, i) => (
                <div key={i} className={styles.feedbackItem}>• {p}</div>
              ))}
            </div>
          )}

          <button className={styles.newEssayBtn} onClick={() => { setFeedback(null); setText(''); setSeconds(0); setRunning(true); setGrammarChecked(false); setGrammarErrors([]) }}>
            <IconRefresh /> Yangi essay yozish
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.writeHeader}>
        <button className={styles.backLink} style={{ marginBottom: 0 }} onClick={onBack}><IconArrowRight style={{ transform: 'scaleX(-1)' }} /> Orqaga</button>
        <div className={styles.writeMeta}>
          <span className={styles.metaItem}><IconClock /> {mins}:{secs.toString().padStart(2, '0')}</span>
          <span className={styles.metaItem}>{wordCount} so'z</span>
        </div>
      </div>

      <div className={styles.writeGrid}>
        <div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Essayingizni shu yerga yozing..."
            className={styles.essayTextarea}
          />
          <div className={styles.essayActions}>
            <button className={styles.submitEssayBtn} onClick={submitEssay} disabled={wordCount < 30 || loading}>
              <IconSend /> {loading ? 'Tekshirilmoqda...' : 'Topshirish va feedback olish'}
            </button>
            <button className={styles.grammarBtn} onClick={checkGrammar} disabled={wordCount < 5 || grammarLoading}>
              <IconPencil /> {grammarLoading ? 'Tekshirilmoqda...' : 'Grammatikani tekshirish'}
            </button>
          </div>

          {grammarChecked && (
            <div className={`glassPanel ${styles.grammarResultBox}`}>
              <div className={styles.grammarResultHead}>
                <span><IconPencil size={14} /> Grammatika natijasi</span>
                <span className={styles.grammarCount}>{grammarErrors.length} ta xato</span>
              </div>
              {grammarErrors.length === 0 ? (
                <div className={styles.grammarEmpty}><IconCheck size={14} /> Xatolar topilmadi!</div>
              ) : (
                grammarErrors.map((err, i) => (
                  <div key={i} className={styles.grammarItem}>
                    <div>
                      <span className={styles.grammarWrong}>{err.wrong}</span>
                      <span className={styles.grammarArrow}>→</span>
                      <span className={styles.grammarCorrect}>{err.correct}</span>
                    </div>
                    {err.explanation_uz && <div className={styles.grammarExpl}>{err.explanation_uz}</div>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className={styles.sidebarCol}>
          <div className={`glassPanel ${styles.vocabBox}`}>
            <div className={styles.vocabBoxLbl}><IconSearch /> Vocabulary qidirish</div>
            <input
              value={vocabSearch}
              onChange={e => searchVocab(e.target.value)}
              placeholder="So'z qidiring..."
              className={styles.vocabInput}
            />
            <div className={styles.vocabResults}>
              {vocabResults.map(w => (
                <div key={w.id} className={styles.vocabItem}>
                  <div className={styles.vocabWord}>{w.word}</div>
                  <div className={styles.vocabTranslation}>{w.translation_uz}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`glassPanel ${styles.tipBox}`}>
            <div className={styles.tipLbl}>Maslahat</div>
            <div className={styles.tipText}>
              Kamida 250 so'z yozing. Har bir paragrafda bitta asosiy fikr bo'lsin.
              Topshirgandan keyin AI sizga band va batafsil feedback beradi.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
