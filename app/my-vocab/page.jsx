'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import GlassBackground from '@/components/GlassBackground'
import { useAuth } from '@/lib/auth-context'
import { authHeaders } from '@/lib/api'
import {
  IconBook, IconRepeat, IconSearch, IconTarget, IconEye, IconCheck,
  IconX, IconPlus, IconArrowRight, IconRefresh,
} from '@/components/Icons'
import styles from './my-vocab.module.css'

const API = 'https://develop-uz-api.onrender.com'

const STATUS_TONE = {
  new: { label: 'Yangi', bg: 'var(--t-blue)', fg: 'var(--on-blue)' },
  learning: { label: "O'rganmoqda", bg: 'var(--t-orange)', fg: 'var(--on-orange)' },
  review: { label: 'Takrorlash', bg: 'var(--t-violet)', fg: 'var(--on-violet)' },
  mastered: { label: 'Yodlangan', bg: 'var(--t-green)', fg: 'var(--on-green)' },
}

const LEVEL_TONE = {
  B2: { bg: 'var(--t-green)', fg: 'var(--on-green)' },
  C1: { bg: 'var(--t-blue)', fg: 'var(--on-blue)' },
  C2: { bg: 'var(--t-violet)', fg: 'var(--on-violet)' },
}
function levelTone(l) { return LEVEL_TONE[l] || LEVEL_TONE.B2 }

export default function MyVocabPage() {
  const { telegramId } = useAuth()
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

  useEffect(() => {
    if (telegramId) loadMyVocab()
    else setLoading(false)
  }, [telegramId])

  async function loadMyVocab() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/vocabulary/user/${telegramId}`, { headers: authHeaders() })
      const data = await res.json()
      setWords(data.words || [])
      setSavedIds(new Set((data.words || []).map(w => w.id)))
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function saveWord(word) {
    if (savedIds.has(word.id) || !telegramId) return
    setSavingId(word.id)
    try {
      const res = await fetch(`${API}/vocabulary/user/add`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          telegram_id: telegramId,
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

  return (
    <div className={styles.wrapper}>
      <GlassBackground />
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}><IconBook /></span>
            Mening Vocabularyim
          </h1>
          <p className={styles.desc}>Saqlagan so'zlaringiz, takrorlash jadvali va yangi so'z qidirish</p>
        </div>

        {!telegramId ? (
          <div className={`glassPanel ${styles.emptyState || ''}`} style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ marginBottom: 16 }}>Shaxsiy vocabularyingizni ko&apos;rish uchun tizimga kiring</p>
            <Link href="/login" className={styles.tab}>Kirish</Link>
          </div>
        ) : (
        <>
        <div className={styles.tabRow}>
          {[
            { id: 'my_vocab', label: `Mening so'zlarim (${words.length})` },
            { id: 'review', label: `Takrorlash (${dueWords.length})` },
            { id: 'search', label: "So'z qidirish" },
          ].map(t => (
            <button key={t.id} className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* MY VOCAB */}
        {tab === 'my_vocab' && (
          <div>
            <div className={styles.statsGrid}>
              {Object.entries(STATUS_TONE).map(([status, tone]) => {
                const count = words.filter(w => (w.status || 'new') === status).length
                return (
                  <div key={status} className={styles.statCard} style={{ background: tone.bg }}>
                    <div className={styles.statNum} style={{ color: tone.fg }}>{count}</div>
                    <div className={styles.statLbl}>{tone.label}</div>
                  </div>
                )
              })}
            </div>

            {dueWords.length > 0 && (
              <div className={styles.dueBanner}>
                <div>
                  <div className={styles.dueBannerTitle}><IconTarget /> Bugun takrorlanishi kerak: {dueWords.length} ta so'z</div>
                  <div className={styles.dueBannerDesc}>Ebbinghaus Forgetting Curve — takrorlamasangiz unutasiz</div>
                </div>
                <button className={styles.dueBannerBtn} onClick={startReview}>
                  Takrorlashni boshlash <IconArrowRight />
                </button>
              </div>
            )}

            <div className={styles.filterPills}>
              {[
                { id: 'all', label: 'Barchasi' },
                ...Object.entries(STATUS_TONE).map(([id, s]) => ({ id, label: s.label }))
              ].map(f => (
                <button
                  key={f.id}
                  className={`${styles.filterPill} ${filterStatus === f.id ? styles.filterPillActive : ''}`}
                  onClick={() => setFilterStatus(f.id)}
                >{f.label}</button>
              ))}
            </div>

            <div className={`${styles.layout} ${selected ? styles.layoutSplit : ''}`}>
              <div className={styles.wordGrid}>
                {loading ? (
                  <div className={styles.loadingMsg}>Yuklanmoqda...</div>
                ) : filtered.length === 0 ? (
                  <div className={styles.emptyMsg}>
                    <IconBook className={styles.emptyIcon} />
                    Hali so'z saqlanmagan.<br />
                    <button className={styles.emptyLink} onClick={() => setTab('search')}>
                      So'z qidirish →
                    </button>
                  </div>
                ) : filtered.map(w => {
                  const lvTone = levelTone(w.cefr_level)
                  const stTone = STATUS_TONE[w.status || 'new'] || STATUS_TONE.new
                  return (
                    <div
                      key={w.id}
                      className={`glassPanel ${styles.wordCard} ${selected?.id === w.id ? styles.wordCardActive : ''}`}
                      onClick={() => setSelected(selected?.id === w.id ? null : w)}
                    >
                      <div className={styles.wordCardTop}>
                        <span className={styles.wordCardWord}>{w.word}</span>
                        <span className={styles.badge} style={{ background: lvTone.bg, color: lvTone.fg }}>{w.cefr_level}</span>
                      </div>
                      <div className={styles.wordCardTranslation}>{w.translation_uz}</div>
                      <div className={styles.wordCardBadges}>
                        <span className={styles.badge} style={{ background: stTone.bg, color: stTone.fg }}>{stTone.label}</span>
                        {w.word_type && <span className={`${styles.badge} ${styles.badgeGray}`}>{w.word_type}</span>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {selected && (
                <div className={styles.detailPanel}>
                  <div className={`glassPanel ${styles.detailCard}`}>
                    <div className={styles.detailTop}>
                      <div>
                        <div className={styles.detailWord}>{selected.word}</div>
                        <div className={styles.detailTranslation}>{selected.translation_uz}</div>
                      </div>
                      <button className={styles.closeBtn} onClick={() => setSelected(null)}><IconX /></button>
                    </div>
                    {selected.example_1 && (
                      <div className={styles.detailSection}>
                        <div className={styles.detailSectionLbl}>Misol:</div>
                        <div className={styles.exampleQuote}>"{selected.example_1}"</div>
                      </div>
                    )}
                    {selected.collocations?.length > 0 && (
                      <div className={styles.detailSection}>
                        <div className={styles.detailSectionLbl}>Collocations:</div>
                        <div className={styles.collocRow}>
                          {selected.collocations.map((c, i) => (
                            <span key={i} className={styles.collocChip}>{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className={styles.progressBox}>
                      <div className={styles.progressLbl}>Progress:</div>
                      <div className={styles.progressGrid}>
                        <div className={styles.progressItem}>
                          <div className={styles.progressNum} style={{ color: 'var(--on-green)' }}>{selected.correct_count || 0}</div>
                          <div className={styles.progressItemLbl}>To'g'ri</div>
                        </div>
                        <div className={styles.progressItem}>
                          <div className={styles.progressNum} style={{ color: 'var(--on-red)' }}>{selected.wrong_count || 0}</div>
                          <div className={styles.progressItemLbl}>Xato</div>
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
          <div className={styles.reviewWrap}>
            {words.length === 0 ? (
              <div className={styles.centerBox}>
                <IconBook className={styles.emptyIconBig} />
                Hali so'z saqlanmagan
              </div>
            ) : reviewDone ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <h2 className={styles.finishedTitle}>Takrorlash tugadi!</h2>
                <div className={styles.scoreRow}>
                  <div className={`glassPanel ${styles.scoreCard}`}>
                    <div className={styles.scoreNum} style={{ color: 'var(--on-green)' }}>{reviewScore.correct}</div>
                    <div className={styles.scoreLbl}>To'g'ri</div>
                  </div>
                  <div className={`glassPanel ${styles.scoreCard}`}>
                    <div className={styles.scoreNum} style={{ color: 'var(--on-red)' }}>{reviewScore.wrong}</div>
                    <div className={styles.scoreLbl}>Noto'g'ri</div>
                  </div>
                </div>
                <div className={styles.finishedActions}>
                  <button className={styles.ghostBtn} onClick={() => setTab('my_vocab')}>
                    <IconArrowRight style={{ transform: 'scaleX(-1)' }} /> Orqaga
                  </button>
                  <button className={styles.primaryBtn} onClick={startReview}>
                    <IconRefresh /> Qayta boshlash
                  </button>
                </div>
              </div>
            ) : dueWords[reviewIdx] && (
              <div>
                <div className={styles.reviewHead}>
                  <button className={styles.reviewBackBtn} onClick={() => setTab('my_vocab')}>
                    <IconArrowRight style={{ transform: 'scaleX(-1)' }} /> Orqaga
                  </button>
                  <span className={styles.reviewCounter}>{reviewIdx + 1} / {dueWords.length}</span>
                  <span className={styles.reviewScoreInline}>
                    <span className={styles.reviewScoreGood}><IconCheck /> {reviewScore.correct}</span>
                    <span className={styles.reviewScoreBad}><IconX /> {reviewScore.wrong}</span>
                  </span>
                </div>
                <div className={styles.reviewProgressTrack}>
                  <div className={styles.reviewProgressFill} style={{ width: `${(reviewIdx / dueWords.length) * 100}%` }} />
                </div>
                <div className={`glassPanel ${styles.reviewCard}`}>
                  <div className={styles.reviewMeta}>
                    {dueWords[reviewIdx].cefr_level} · {dueWords[reviewIdx].word_type}
                  </div>
                  <div className={styles.reviewWord}>{dueWords[reviewIdx].word}</div>
                  {!showReviewAnswer ? (
                    <button className={styles.reviewRevealBtn} onClick={() => setShowReviewAnswer(true)}>
                      <IconEye /> Javobni ko'rish
                    </button>
                  ) : (
                    <div className={styles.reviewAnswerWrap}>
                      <div className={styles.reviewAnswerTranslation}>{dueWords[reviewIdx].translation_uz}</div>
                      {dueWords[reviewIdx].example_1 && (
                        <div className={styles.reviewAnswerExample}>"{dueWords[reviewIdx].example_1}"</div>
                      )}
                    </div>
                  )}
                </div>
                {showReviewAnswer && (
                  <div className={styles.reviewJudgeRow}>
                    <button className={`${styles.reviewJudgeBtn} ${styles.judgeBad}`} onClick={() => nextReview(false)}>
                      <IconX /> Unutdim
                    </button>
                    <button className={`${styles.reviewJudgeBtn} ${styles.judgeGood}`} onClick={() => nextReview(true)}>
                      <IconCheck /> Esladim
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SEARCH */}
        {tab === 'search' && (
          <div>
            <div className={`glassPanel ${styles.searchBox}`}>
              <div className={styles.searchLbl}>So'z qidiring va vocabularyga qo'shing:</div>
              <input
                value={searchQuery}
                onChange={e => searchVocab(e.target.value)}
                placeholder="Masalan: exacerbate, unprecedented, facilitate..."
                autoFocus
                className={styles.searchInput}
              />
            </div>

            {searching && <div className={styles.searchingMsg}>Qidirilmoqda...</div>}

            {searchResults.length > 0 && (
              <div className={styles.resultsGrid}>
                {searchResults.map(w => {
                  const lvTone = levelTone(w.cefr_level)
                  const isSaved = savedIds.has(w.id)
                  return (
                    <div key={w.id} className={`glassPanel ${styles.resultCard}`}>
                      <div className={styles.resultTop}>
                        <span className={styles.resultWord}>{w.word}</span>
                        <span className={styles.badge} style={{ background: lvTone.bg, color: lvTone.fg }}>{w.cefr_level}</span>
                      </div>
                      <div className={styles.resultTranslation}>{w.translation_uz}</div>
                      {w.example_1 && (
                        <div className={styles.resultExample}>"{w.example_1}"</div>
                      )}
                      {w.collocations?.length > 0 && (
                        <div className={styles.resultCollocRow}>
                          {w.collocations.map((c, i) => (
                            <span key={i} className={styles.resultCollocChip}>{c}</span>
                          ))}
                        </div>
                      )}
                      <button
                        className={`${styles.saveBtn} ${isSaved ? styles.saveBtnSaved : ''}`}
                        onClick={() => saveWord(w)}
                        disabled={isSaved || savingId === w.id}
                      >
                        {savingId === w.id ? 'Saqlanmoqda...' : isSaved ? <><IconCheck /> Saqlandi</> : <><IconPlus /> Vocabularyga qo'shish</>}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
              <div className={styles.noResultsMsg}>
                <IconSearch className={styles.searchIconBig} />
                "{searchQuery}" topilmadi
              </div>
            )}

            {searchQuery.length === 0 && (
              <div className={styles.emptyPromptMsg}>
                <IconSearch className={styles.searchIconBig} />
                So'z yozing — avtomatik qidiriladi
              </div>
            )}
          </div>
        )}
        </>
        )}
      </div>
    </div>
  )
}
