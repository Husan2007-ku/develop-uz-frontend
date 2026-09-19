'use client'
import { useState, useEffect } from 'react'
import styles from './essays.module.css'
import GlassBackground from '@/components/GlassBackground'
import WritingTabs from '@/components/WritingTabs'
import { useAuth } from '@/lib/auth-context'
import { authHeaders } from '@/lib/api'
import { IconEssay, IconSearch, IconX, IconSave, IconCheck } from '@/components/Icons'

const API = 'https://develop-uz-api.onrender.com'

const TONE = {
  green: { bg: 'var(--t-green)', on: 'var(--on-green)' },
  blue: { bg: 'var(--t-blue)', on: 'var(--on-blue)' },
  orange: { bg: 'var(--t-orange)', on: 'var(--on-orange)' },
  violet: { bg: 'var(--t-violet)', on: 'var(--on-violet)' },
}

const bandTone = (score) => {
  if (score >= 8) return TONE.green
  if (score >= 7) return TONE.blue
  return TONE.orange
}

const TYPE_LABELS = {
  evaluation: 'Evaluation',
  comparison: 'Comparison',
  cause_effect: 'Cause & Effect',
  speculation: 'Speculation',
  reasoning: 'Reasoning',
}

const HL_COLORS = {
  collocation: { ...TONE.orange, label: 'Collocation' },
  idiom: { ...TONE.green, label: 'Idiom' },
  c1_vocab: { ...TONE.blue, label: 'C1' },
  c2_vocab: { ...TONE.violet, label: 'C2' },
}

export default function EssaysPage() {
  const { telegramId } = useAuth()
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
      if (telegramId) {
        const notesRes = await fetch(`${API}/essays/${essay.id}/notes/${telegramId}`, {
          headers: authHeaders(),
        })
        const notes = await notesRes.json()
        setVocabNotes(notes.vocab_notes || '')
        setGrammarNotes(notes.grammar_notes || '')
      } else {
        setVocabNotes('')
        setGrammarNotes('')
      }
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
    if (!selected || !telegramId) return
    try {
      await fetch(`${API}/essays/${selected.id}/notes/${telegramId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ vocab_notes: vocabNotes, grammar_notes: grammarNotes })
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) { console.error(e) }
  }

  function renderContent(content) {
    if (!showAnalysis || highlights.length === 0) {
      return content.split('\n\n').map((p, i) => <p key={i}>{p}</p>)
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
          className={styles.hlSpan}
          style={{
            background: hl.bg, color: hl.on,
            border: `1px solid ${selectedHL?.text === h.text ? hl.on : 'transparent'}`,
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

    return <p>{result}</p>
  }

  const filtered = filter === 'all' ? essays : essays.filter(e => e.question_type === filter)
  const selHL = selectedHL && HL_COLORS[selectedHL.highlight_type || selectedHL.type]

  return (
    <div className={styles.wrapper}>
      <GlassBackground />
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}><IconEssay size={15} /></span>
            Writing Essays
          </h1>
          <p className={styles.desc}>Band 6-9 gacha real IELTS Writing Task 2 essaylar</p>
        </div>

        <WritingTabs />

        <div className={styles.columns}>
          {/* PANEL 1 — Essay ro'yxati */}
          <div className={`glassPanel ${styles.listPanel}`}>
            <div className={styles.listHead}>
              <div className={styles.listHeadLbl}>Essay kutubxonasi</div>
              <div className={styles.filterPills}>
                {['all', 'evaluation', 'reasoning', 'comparison'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`${styles.filterPill} ${filter === f ? styles.filterPillActive : ''}`}
                  >
                    {f === 'all' ? 'Barchasi' : TYPE_LABELS[f] || f}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.listScroll}>
              {loading ? (
                <div className={styles.listState}>Yuklanmoqda...</div>
              ) : filtered.length === 0 ? (
                <div className={styles.listState}>Essay topilmadi</div>
              ) : filtered.map(essay => {
                const bt = bandTone(essay.band_score)
                return (
                  <div
                    key={essay.id}
                    onClick={() => selectEssay(essay)}
                    className={`${styles.essayItem} ${selected?.id === essay.id ? styles.essayItemActive : ''}`}
                  >
                    <div className={styles.essayTop}>
                      <span className={styles.bandChip} style={{ background: bt.bg, color: bt.on }}>{essay.band_score}</span>
                      <span className={styles.typeChip}>{TYPE_LABELS[essay.question_type] || essay.question_type}</span>
                    </div>
                    <div className={styles.essayTitle}>{essay.title}</div>
                    <div className={styles.essayMeta}>{essay.word_count} so&apos;z</div>
                  </div>
                )
              })}
            </div>

            <div className={styles.listFoot}>Bepul: 10 ta · Premium: ko&apos;proq</div>
          </div>

          {/* PANEL 2 — Essay matni */}
          <div className={`glassPanel ${styles.contentPanel}`}>
            {!selected ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateInner}>
                  <IconEssay />
                  <p>Chap tomondagi essayni bosing</p>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.contentHead}>
                  <div>
                    <div className={styles.contentTitle}>{selected.title}</div>
                    <div className={styles.chipRow}>
                      <span
                        className={styles.metaChip}
                        style={{ background: bandTone(selected.band_score).bg, color: bandTone(selected.band_score).on }}
                      >Band {selected.band_score}</span>
                      <span className={styles.metaChip}>{TYPE_LABELS[selected.question_type] || selected.question_type}</span>
                      <span className={styles.metaChip}>{selected.word_count} so&apos;z</span>
                    </div>
                  </div>
                  <button
                    onClick={toggleAnalysis}
                    disabled={analyzingHL}
                    className={`${styles.analyzeBtn} ${showAnalysis ? styles.analyzeBtnActive : ''}`}
                  >
                    {showAnalysis ? <IconCheck /> : <IconSearch />}
                    {analyzingHL ? 'Tahlil...' : showAnalysis ? 'Tahlil ON' : 'Tahlil'}
                  </button>
                </div>

                {showAnalysis && highlights.length > 0 && (
                  <div className={styles.legend}>
                    {Object.entries(HL_COLORS).map(([type, style]) => (
                      <span key={type} className={styles.legendItem}>
                        <span className={styles.legendDot} style={{ background: style.bg }} />
                        {style.label}
                      </span>
                    ))}
                  </div>
                )}

                {selectedHL && showAnalysis && (
                  <div className={styles.hlTooltip}>
                    <div className={styles.hlTooltipRow}>
                      <div>
                        <span className={styles.hlTooltipWord} style={{ color: selHL?.on }}>{selectedHL.text}</span>
                        {selectedHL.explanation_uz && (
                          <span className={styles.hlTooltipExpl}>{selectedHL.explanation_uz}</span>
                        )}
                      </div>
                      <button onClick={() => setSelectedHL(null)} className={styles.hlTooltipClose}>
                        <IconX size={14} />
                      </button>
                    </div>
                    {selectedHL.how_to_use && (
                      <div className={styles.hlTooltipUsage} style={{ color: selHL?.on }}>{selectedHL.how_to_use}</div>
                    )}
                  </div>
                )}

                <div className={styles.contentScroll}>
                  {renderContent(selected.content)}
                </div>
              </>
            )}
          </div>

          {/* PANEL 3 — Qaydlar */}
          <div className={`glassPanel ${styles.notesPanel}`}>
            <div className={styles.notesSection}>
              <div className={styles.notesHead}>
                <div className={styles.notesTitle}>Qaydlarim — Vocabulary</div>
                <div className={styles.notesSub}>Yoqqan so&apos;zlarni yozing</div>
              </div>
              <textarea
                value={vocabNotes}
                onChange={e => { setVocabNotes(e.target.value); setSaved(false) }}
                placeholder={selected ? "Masalan:\nexacerbate — yomonlashtirmoq\nfoster — rivojlantirmoq" : "Essay tanlang..."}
                disabled={!selected}
                className={styles.notesTextarea}
              />
            </div>

            <div className={styles.notesSection}>
              <div className={styles.notesHead}>
                <div className={styles.notesTitle}>Qaydlarim — Grammatika</div>
                <div className={styles.notesSub}>Yoqqan strukturalarni yozing</div>
              </div>
              <textarea
                value={grammarNotes}
                onChange={e => { setGrammarNotes(e.target.value); setSaved(false) }}
                placeholder={selected ? "Masalan:\nWhile... , critics argue...\nNot only... but also..." : "Essay tanlang..."}
                disabled={!selected}
                className={styles.notesTextarea}
              />
            </div>

            <div className={styles.notesFoot}>
              <button
                onClick={saveNotes}
                disabled={!selected || !telegramId}
                className={`${styles.saveBtn} ${saved ? styles.saveBtnSaved : ''}`}
              >
                {saved ? <IconCheck size={14} /> : <IconSave size={14} />}
                {saved ? 'Saqlandi!' : 'Saqlash'}
              </button>
              <div className={styles.saveHint}>
                {telegramId ? 'Bot orqali eslatiladi' : 'Saqlash uchun tizimga kiring'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
