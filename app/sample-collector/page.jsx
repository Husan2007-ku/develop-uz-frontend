'use client'
import { useState } from 'react'
import Link from 'next/link'
import GlassBackground from '@/components/GlassBackground'
import { useAuth } from '@/lib/auth-context'
import { authHeaders } from '@/lib/api'
import {
  IconSearch, IconSend, IconCheck, IconX, IconArrowRight, IconBook,
} from '@/components/Icons'
import styles from './sample-collector.module.css'

const API = 'https://develop-uz-api.onrender.com'

const HL_TONE = {
  collocation: { bg: 'var(--t-orange)', fg: 'var(--on-orange)', label: 'Collocation' },
  idiom: { bg: 'var(--t-green)', fg: 'var(--on-green)', label: 'Idiom' },
  c1_vocab: { bg: 'var(--t-blue)', fg: 'var(--on-blue)', label: 'C1 Vocab' },
  c2_vocab: { bg: 'var(--t-violet)', fg: 'var(--on-violet)', label: 'C2 Vocab' },
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
  const { telegramId } = useAuth()
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

    // Tizimga kirmagan bo'lsa — tahlil hammaga ochiq qoladi, faqat
    // vocabularyga doimiy saqlash uchun login kerak. Backend so'rovini
    // yubormaymiz, lekin ekranda "saqlangan" ko'rinishini beramiz va
    // login taklif qilamiz.
    if (!telegramId) {
      setSavedWords(prev => [...prev, { ...hl, saved: false, needsLogin: true }])
      setSavingId(null)
      return
    }

    try {
      // 1. Vocabulary da qidirish
      const searchRes = await fetch(`${API}/vocabulary/search/${encodeURIComponent(hl.text)}`)
      const searchData = await searchRes.json()

      if (searchData.results && searchData.results.length > 0) {
        // Topilsa — user vocabulary ga qo'shish
        const word = searchData.results[0]
        await fetch(`${API}/vocabulary/user/add`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            telegram_id: telegramId,
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
      const tone = HL_TONE[hl.type] || HL_TONE.c1_vocab
      const isSaved = savedWords.find(w => w.text === hl.text)
      result.push(
        <span key={`h${i}`}
          onClick={() => setSelectedHL(selectedHL?.text === hl.text ? null : hl)}
          style={{
            background: tone.bg,
            color: tone.fg,
            padding: '1px 4px',
            borderRadius: 4,
            cursor: 'pointer',
            border: `1px solid ${selectedHL?.text === hl.text ? tone.fg : isSaved ? tone.fg : 'transparent'}`,
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

    return <p style={{ lineHeight: 1.9, fontSize: '0.86rem' }}>{result}</p>
  }

  const filteredHL = activeFilter === 'all'
    ? highlights
    : highlights.filter(h => h.type === activeFilter)

  return (
    <div className={styles.wrapper}>
      <GlassBackground />
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}><IconSearch /></span>
            Sample Collector
          </h1>
          <p className={styles.desc}>Istalgan matn yoki essayni joylashtiring — AI collocations, idiomlar va C1/C2 so'zlarni ajratadi</p>
        </div>

        {!analyzed ? (
          <div>
            <div className={styles.sampleWrap}>
              <div className={styles.sampleLbl}>Namuna matnlardan birini tanlang yoki o'z matnizni yozing:</div>
              <div className={styles.samplePills}>
                {SAMPLE_TEXTS.map((s, i) => (
                  <button
                    key={i}
                    className={`${styles.samplePill} ${text === s.text ? styles.samplePillActive : ''}`}
                    onClick={() => setText(s.text)}
                  >{s.label}</button>
                ))}
              </div>
            </div>

            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Matnni bu yerga joylashtiring (kamida 50 ta belgi)..."
              className={styles.textareaBox}
            />

            <div className={styles.footerRow}>
              <div className={styles.legendRow}>
                {Object.entries(HL_TONE).map(([type, tone]) => (
                  <span key={type} className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: tone.bg }} />
                    {tone.label}
                  </span>
                ))}
              </div>
              <button className={styles.primaryBtn} onClick={analyzeText} disabled={text.trim().length < 50 || loading}>
                <IconSend /> {loading ? 'Tahlil qilinmoqda...' : 'Tahlil qilish'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className={styles.resultHeadRow}>
              <div className={styles.filterPills}>
                <button
                  className={`${styles.filterPill} ${activeFilter === 'all' ? styles.filterPillActive : ''}`}
                  style={activeFilter === 'all' ? { background: 'var(--t-blue)', color: 'var(--on-blue)' } : undefined}
                  onClick={() => setActiveFilter('all')}
                >Barchasi ({highlights.length})</button>
                {Object.entries(HL_TONE).map(([type, tone]) => {
                  const count = highlights.filter(h => h.type === type).length
                  if (count === 0) return null
                  return (
                    <button
                      key={type}
                      className={`${styles.filterPill} ${activeFilter === type ? styles.filterPillActive : ''}`}
                      style={activeFilter === type ? { background: tone.bg, color: tone.fg } : undefined}
                      onClick={() => setActiveFilter(type)}
                    >{tone.label} ({count})</button>
                  )
                })}
              </div>
              <button className={styles.newTextBtn} onClick={() => { setAnalyzed(false); setHighlights([]); setSelectedHL(null); setSavedWords([]) }}>
                <IconArrowRight style={{ transform: 'scaleX(-1)' }} /> Yangi matn
              </button>
            </div>

            <div className={styles.resultGrid}>
              <div className={`glassPanel ${styles.textPanel}`}>
                <div className={styles.legendRowSmall}>
                  {Object.entries(HL_TONE).map(([type, tone]) => (
                    <span key={type} className={styles.legendItem}>
                      <span className={styles.legendDotSmall} style={{ background: tone.bg }} />
                      {tone.label}
                    </span>
                  ))}
                </div>
                <div className={styles.highlightedBody}>
                  {renderHighlighted()}
                </div>
                <div className={styles.hintText}>Belgilangan so'z/iborani bosing — batafsil ma'lumot chiqadi</div>
              </div>

              <div className={styles.sidebarCol}>
                {selectedHL && (
                  <div className={`glassPanel ${styles.detailCard}`}>
                    <div className={styles.detailTop}>
                      <span
                        className={styles.detailTypeBadge}
                        style={{ background: HL_TONE[selectedHL.type]?.bg, color: HL_TONE[selectedHL.type]?.fg }}
                      >{HL_TONE[selectedHL.type]?.label}</span>
                      <button className={styles.closeBtn} onClick={() => setSelectedHL(null)}><IconX /></button>
                    </div>
                    <div className={styles.detailWord}>{selectedHL.text}</div>
                    {selectedHL.explanation_uz && (
                      <div className={styles.detailExpl}>{selectedHL.explanation_uz}</div>
                    )}
                    {selectedHL.how_to_use && (
                      <div className={styles.detailUsage}>{selectedHL.how_to_use}</div>
                    )}
                    <button
                      className={`${styles.detailSaveBtn} ${savedWords.find(w => w.text === selectedHL.text) ? styles.detailSaveBtnSaved : ''}`}
                      onClick={() => saveToVocab(selectedHL)}
                      disabled={!!savedWords.find(w => w.text === selectedHL.text) || savingId === selectedHL.text}
                    >
                      {savingId === selectedHL.text ? 'Saqlanmoqda...' :
                        savedWords.find(w => w.text === selectedHL.text) ? <><IconCheck /> Saqlandi</> :
                          "Vocabularyga qo'shish"}
                    </button>
                  </div>
                )}

                <div className={`glassPanel ${styles.listCard}`}>
                  <div className={styles.listHead}>Topilgan iboralar ({filteredHL.length})</div>
                  <div className={styles.listBody}>
                    {filteredHL.map((hl, i) => {
                      const tone = HL_TONE[hl.type] || HL_TONE.c1_vocab
                      const isSaved = !!savedWords.find(w => w.text === hl.text)
                      return (
                        <div
                          key={i}
                          className={`${styles.listItem} ${selectedHL?.text === hl.text ? styles.listItemActive : ''}`}
                          onClick={() => setSelectedHL(selectedHL?.text === hl.text ? null : hl)}
                        >
                          <div className={styles.listItemTop}>
                            <span className={styles.listItemWord} style={{ color: tone.fg }}>{hl.text}</span>
                            <div className={styles.listItemMeta}>
                              {isSaved && <IconCheck className={styles.listItemSavedIcon} />}
                              <span className={styles.listItemTypeBadge} style={{ background: tone.bg, color: tone.fg }}>{tone.label}</span>
                            </div>
                          </div>
                          <div className={styles.listItemExpl}>{hl.explanation_uz}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className={`glassPanel ${styles.savedCard}`}>
                  <div className={styles.savedHead}>
                    <span>Saqlangan ({savedWords.length} ta)</span>
                    {savedWords.length > 0 && (
                      <Link href="/my-vocab" className={styles.savedViewLink}>
                        Ko'rish <IconArrowRight />
                      </Link>
                    )}
                  </div>

                  {savedWords.length === 0 ? (
                    <div className={styles.savedEmpty}>Iborani bosib saqlang</div>
                  ) : (
                    <>
                      <div className={styles.savedChipsRow}>
                        {savedWords.map((w, i) => (
                          <span key={i} className={styles.savedChip}>{w.text}</span>
                        ))}
                      </div>
                      {!telegramId && (
                        <div className={styles.savedEmpty} style={{ marginTop: 8 }}>
                          Doimiy saqlash uchun <Link href="/login">tizimga kiring</Link> — hozircha faqat shu sahifada ko'rinadi
                        </div>
                      )}
                      <button
                        className={`${styles.saveAllBtn} ${saveSuccess ? styles.saveAllBtnSuccess : ''}`}
                        onClick={saveAllToVocab}
                      >
                        {saveSuccess ? <><IconCheck /> Hammasi saqlandi!</> : <><IconBook /> Barchasini vocabularyga qo'shish</>}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
