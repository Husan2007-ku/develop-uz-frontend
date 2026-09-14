'use client'
import { useState, useEffect } from 'react'
import GlassBackground from '@/components/GlassBackground'
import {
  IconCards, IconEssay, IconWord, IconPencil, IconRepeat, IconEye,
  IconCheck, IconX, IconRefresh, IconArrowRight, IconSend,
} from '@/components/Icons'
import styles from './study.module.css'

const MODE_TONE = {
  flashcard: { bg: 'var(--t-blue)', fg: 'var(--on-blue)' },
  cloze: { bg: 'var(--t-violet)', fg: 'var(--on-violet)' },
  quiz: { bg: 'var(--t-green)', fg: 'var(--on-green)' },
  writing: { bg: 'var(--t-orange)', fg: 'var(--on-orange)' },
}

const LEVEL_TONE = {
  B2: { bg: 'var(--t-green)', fg: 'var(--on-green)' },
  C1: { bg: 'var(--t-blue)', fg: 'var(--on-blue)' },
  C2: { bg: 'var(--t-violet)', fg: 'var(--on-violet)' },
}

const MODES = [
  { id: 'flashcard', Icon: IconCards, title: 'Flashcard', desc: "So'zni ko'r, tarjimasini bil", tag: 'SM-2' },
  { id: 'cloze', Icon: IconEssay, title: 'Cloze Test', desc: "Bo'sh joyni to'ldiring", tag: 'Kontekst' },
  { id: 'quiz', Icon: IconWord, title: 'Kontekst Quiz', desc: "To'g'ri so'zni tanlang", tag: "Ko'p tanlov" },
  { id: 'writing', Icon: IconPencil, title: 'Writing Practice', desc: "5 so'zdan paragraf yozing", tag: 'AI tekshiruv' },
]

const LEVELS = [
  { level: 'B2', title: 'Upper-Intermediate', desc: 'Band 5.5–6.5 uchun', words: ['significant', 'contribute', 'establish'] },
  { level: 'C1', title: 'Advanced', desc: 'Band 7–7.5 uchun', words: ['facilitate', 'exacerbate', 'prevalent'] },
  { level: 'C2', title: 'Proficiency', desc: 'Band 8–9 uchun', words: ['ubiquitous', 'unprecedented', 'disseminate'] },
]

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

  return (
    <div className={styles.wrapper}>
      <GlassBackground />
      <div className={styles.inner}>

        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}><IconRepeat /></span>
            Study Zone
          </h1>
          <p className={styles.desc}>So'zlarni ilmiy usulda yodlang — Spaced Repetition bilan</p>
        </div>

        {/* Mode tanlash */}
        {!mode && (
          <>
            <div className={styles.sectionLbl}>Rejim tanlang</div>
            <div className={styles.modeGrid}>
              {MODES.map(m => {
                const tone = MODE_TONE[m.id]
                return (
                  <div key={m.id} className={`glassPanel ${styles.modeCard}`} onClick={() => setMode(m.id)}>
                    <div className={styles.modeTop}>
                      <span className={styles.modeIcon} style={{ background: tone.bg, color: tone.fg }}><m.Icon /></span>
                      <span className={styles.modeTag} style={{ background: tone.bg, color: tone.fg }}>{m.tag}</span>
                    </div>
                    <div className={styles.modeTitle}>{m.title}</div>
                    <div className={styles.modeDesc}>{m.desc}</div>
                  </div>
                )
              })}
            </div>

            <div className={styles.sectionLbl}>CEFR darajalari</div>
            <div className={styles.levelGrid}>
              {LEVELS.map(lv => {
                const tone = LEVEL_TONE[lv.level]
                return (
                  <div key={lv.level} className={`glassPanel ${styles.levelCard}`}>
                    <span className={styles.levelBadge} style={{ background: tone.bg, color: tone.fg }}>{lv.level} — {lv.title}</span>
                    <div className={styles.levelDesc}>{lv.desc}</div>
                    <div className={styles.levelWords}>
                      {lv.words.map(w => <span key={w} className={styles.levelWord}>{w}</span>)}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Loading */}
        {mode && loading && (
          <div className={styles.centerBox}>So'zlar yuklanmoqda...</div>
        )}

        {/* Tugadi */}
        {mode && !loading && finished && (
          <div className={styles.centerBox}>
            <h2 className={styles.finishedTitle}>Sessiya tugadi!</h2>
            <div className={styles.scoreRow}>
              <div className={`glassPanel ${styles.scoreCard}`}>
                <div className={styles.scoreNum} style={{ color: 'var(--on-green)' }}>{score.correct}</div>
                <div className={styles.scoreLbl}>To'g'ri</div>
              </div>
              <div className={`glassPanel ${styles.scoreCard}`}>
                <div className={styles.scoreNum} style={{ color: 'var(--on-red)' }}>{score.wrong}</div>
                <div className={styles.scoreLbl}>Noto'g'ri</div>
              </div>
            </div>
            <div className={styles.finishedActions}>
              <button className={styles.ghostBtn} onClick={() => { setMode(null); setWords([]) }}>
                <IconArrowRight style={{ transform: 'scaleX(-1)' }} /> Rejim tanlash
              </button>
              <button className={styles.primaryBtn} onClick={loadWords}>
                <IconRefresh /> Qayta boshlash
              </button>
            </div>
          </div>
        )}

        {/* FLASHCARD */}
        {mode === 'flashcard' && !loading && !finished && word && (
          <div>
            <div className={styles.sessionHead}>
              <button className={styles.backLink} onClick={() => setMode(null)}><IconArrowRight style={{ transform: 'scaleX(-1)' }} /> Orqaga</button>
              <span className={styles.counter}>{current + 1} / {words.length}</span>
              <span className={styles.scoreInline}>
                <span className={styles.scoreInlineGood}><IconCheck size={12} /> {score.correct}</span>
                <span className={styles.scoreInlineBad}><IconX size={12} /> {score.wrong}</span>
              </span>
            </div>
            <div className={`glassPanel ${styles.bigCard}`}>
              <div className={styles.bigMeta}>{word.cefr_level} · {word.word_type}</div>
              <div className={styles.bigWord}>{word.word}</div>
              {!showAnswer ? (
                <button className={styles.revealBtn} onClick={() => setShowAnswer(true)}><IconEye /> Javobni ko'rish</button>
              ) : (
                <div>
                  <div className={styles.answerTranslation}>{word.translation_uz}</div>
                  {word.example_1 && <div className={styles.answerExample}>"{word.example_1}"</div>}
                </div>
              )}
            </div>
            {showAnswer && (
              <div className={styles.judgeRow}>
                <button className={`${styles.judgeBtn} ${styles.judgeBad}`} onClick={() => nextWord(false)}><IconX /> Bilmadim</button>
                <button className={`${styles.judgeBtn} ${styles.judgeGood}`} onClick={() => nextWord(true)}><IconCheck /> Bildim</button>
              </div>
            )}
          </div>
        )}

        {/* CLOZE TEST */}
        {mode === 'cloze' && !loading && !finished && word && (
          <div>
            <div className={styles.sessionHead}>
              <button className={styles.backLink} onClick={() => setMode(null)}><IconArrowRight style={{ transform: 'scaleX(-1)' }} /> Orqaga</button>
              <span className={styles.counter}>{current + 1} / {words.length}</span>
            </div>

            <div className={`glassPanel ${styles.clozeCard}`}>
              <div className={styles.bigMeta}>{word.cefr_level} · Bo'sh joyni to'ldiring</div>

              {word.example_1 ? (
                <p className={styles.clozeSentence}>{word.example_1.replace(new RegExp(word.word, 'gi'), '________')}</p>
              ) : (
                <p className={styles.clozeSentenceMuted}>Misol gap mavjud emas</p>
              )}

              {!clozeShown && (
                <div className={styles.clozeInputRow}>
                  <input
                    type="text"
                    placeholder="Javobingizni yozing..."
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const val = e.target.value.trim().toLowerCase()
                        const correct = word.word.toLowerCase()
                        setClozeShown(true)
                        if (val === correct) {
                          nextWord(true)
                        }
                      }
                    }}
                    className={styles.clozeInput}
                    autoFocus
                  />
                  <div className={styles.clozeInputHint}>Enter bosing — javobni tekshirish</div>
                </div>
              )}

              {!clozeShown ? (
                <button className={styles.revealBtn} onClick={() => setClozeShown(true)}><IconEye /> Javobni ko'rish</button>
              ) : (
                <div className={styles.clozeAnswerBox}>
                  <p className={styles.clozeAnswerWord}>{word.word}</p>
                  <p className={styles.clozeAnswerTranslation}>{word.translation_uz}</p>
                </div>
              )}
            </div>

            {clozeShown && (
              <div className={styles.judgeRow}>
                <button className={`${styles.judgeBtn} ${styles.judgeBad}`} onClick={() => nextWord(false)}><IconX /> Noto'g'ri</button>
                <button className={`${styles.judgeBtn} ${styles.judgeGood}`} onClick={() => nextWord(true)}><IconCheck /> To'g'ri</button>
              </div>
            )}
          </div>
        )}

        {/* QUIZ */}
        {mode === 'quiz' && !loading && !finished && word && (
          <div>
            <div className={styles.sessionHead}>
              <button className={styles.backLink} onClick={() => setMode(null)}><IconArrowRight style={{ transform: 'scaleX(-1)' }} /> Orqaga</button>
              <span className={styles.counter}>{current + 1} / {words.length}</span>
              <span className={styles.scoreInline}>
                <span className={styles.scoreInlineGood}><IconCheck size={12} /> {score.correct}</span>
                <span className={styles.scoreInlineBad}><IconX size={12} /> {score.wrong}</span>
              </span>
            </div>
            <div className={`glassPanel ${styles.bigCard}`}>
              <div className={styles.bigMeta}>To'g'ri so'zni tanlang</div>
              <div className={styles.answerTranslation}>{word.translation_uz}</div>
              {word.example_1 && (
                <div className={styles.answerExample}>{word.example_1.replace(new RegExp(word.word, 'gi'), '________')}</div>
              )}
            </div>
            <div className={styles.quizOptions}>
              {quizOptions.map((opt, i) => {
                let cls = styles.quizOption
                if (selected !== null) {
                  if (opt.word === word.word) cls = `${styles.quizOption} ${styles.quizOptionCorrect}`
                  else if (selected === opt.word) cls = `${styles.quizOption} ${styles.quizOptionWrong}`
                  else cls = `${styles.quizOption} ${styles.quizOptionDim}`
                }
                return (
                  <button key={i} className={cls} onClick={() => {
                    if (selected !== null) return
                    setSelected(opt.word)
                    setTimeout(() => nextWord(opt.word === word.word), 800)
                  }}>{opt.word}</button>
                )
              })}
            </div>
          </div>
        )}

        {/* WRITING */}
        {mode === 'writing' && !loading && words.length > 0 && (
          <div>
            <div className={styles.sessionHead}>
              <button className={styles.backLink} onClick={() => setMode(null)}><IconArrowRight style={{ transform: 'scaleX(-1)' }} /> Orqaga</button>
              <span className={styles.counter}>5 so'z ishlatish kerak</span>
            </div>
            <div className={`glassPanel ${styles.wordChipsCard}`}>
              <div className={styles.wordChipsLbl}>Shu so'zlarni ishlating:</div>
              <div className={styles.wordChipsRow}>
                {words.slice(0, 5).map((w, i) => (
                  <span key={i} className={styles.wordChip}>{w.word} <span>— {w.translation_uz}</span></span>
                ))}
              </div>
            </div>
            <textarea
              value={writingText}
              onChange={e => setWritingText(e.target.value)}
              placeholder="Shu 5 ta so'zni ishlatib 1 ta paragraf yozing..."
              className={styles.writeTextarea}
            />
            <button className={styles.checkBtn} onClick={checkWriting} disabled={writingText.trim().length < 10}>
              <IconSend /> Tekshirish
            </button>
            {writingResult && (
              <div className={`glassPanel ${styles.resultCard}`}>
                <div className={styles.resultScoreLbl}>
                  Natija: <b>{writingResult.score}/100</b>
                </div>
                {writingResult.used.length > 0 && (
                  <div className={styles.resultSection}>
                    <div className={`${styles.resultSectionLbl} ${styles.resultUsedLbl}`}>Ishlatilgan ({writingResult.used.length}):</div>
                    <div className={styles.wordChipsRow}>
                      {writingResult.used.map((w, i) => (
                        <span key={i} className={`${styles.resultChip} ${styles.resultChipUsed}`}>{w.word}</span>
                      ))}
                    </div>
                  </div>
                )}
                {writingResult.missing.length > 0 && (
                  <div className={styles.resultSection}>
                    <div className={`${styles.resultSectionLbl} ${styles.resultMissingLbl}`}>Ishlatilmagan ({writingResult.missing.length}):</div>
                    <div className={styles.wordChipsRow}>
                      {writingResult.missing.map((w, i) => (
                        <span key={i} className={`${styles.resultChip} ${styles.resultChipMissing}`}>{w.word}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className={styles.resultFeedback} style={{
                  background: writingResult.score === 100 ? 'var(--t-green)' : writingResult.score >= 60 ? 'var(--t-blue)' : 'var(--t-red)',
                  color: writingResult.score === 100 ? 'var(--on-green)' : writingResult.score >= 60 ? 'var(--on-blue)' : 'var(--on-red)',
                }}>
                  {writingResult.score === 100 ? "Mukammal! Barcha so'zlarni ishlatdingiz!" : writingResult.score >= 60 ? 'Yaxshi! Bir oz mashq qiling.' : "Davom eting! Ko'proq mashq kerak."}
                </div>
                <button className={styles.retryBtn} onClick={() => { setWritingText(''); setWritingResult(null) }}>
                  <IconRefresh /> Qayta yozish
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
