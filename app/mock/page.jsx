'use client'
import { useState, useEffect, useRef } from 'react'
import GlassBackground from '@/components/GlassBackground'
import WritingTabs from '@/components/WritingTabs'
import {
  IconTrophy, IconClock, IconEssay, IconLock, IconBot, IconSend,
  IconCheck, IconTarget, IconX, IconRefresh,
} from '@/components/Icons'
import styles from './mock.module.css'

const API = 'https://develop-uz-api.onrender.com'

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

const RULES = [
  { Icon: IconClock, title: '40 daqiqa', desc: "Vaqtni to'xtatib bo'lmaydi" },
  { Icon: IconEssay, title: "Kamida 250 so'z", desc: 'Task 2 talabi' },
  { Icon: IconLock, title: "Chiqib bo'lmaydi", desc: 'Sahifadan ketsa, imtihon tugaydi' },
  { Icon: IconBot, title: 'AI baho', desc: 'Topshirgach band va feedback' },
]

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
  const timerColor = timeLeft < 300 ? 'var(--on-red)' : timeLeft < 600 ? 'var(--gem-orange)' : 'var(--gem-blue)'

  return (
    <div className={styles.wrapper}>
      <GlassBackground />

      {/* INTRO */}
      {stage === 'intro' && (
        <div className={styles.introInner}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              <span className={styles.titleIcon}><IconTrophy /></span>
              Mock Imtihon
            </h1>
            <p className={styles.desc}>Haqiqiy IELTS sharoitida yozing — vaqt, mavzu, AI baho</p>
          </div>

          <WritingTabs />

          <div className={`glassPanel ${styles.introCard}`}>
            <h2 className={styles.introHeading}>Imtihon boshlamishdan oldin</h2>

            <div className={styles.ruleGrid}>
              {RULES.map((r, i) => (
                <div key={i} className={`glassPanel ${styles.ruleCard}`}>
                  <span className={styles.ruleIcon}><r.Icon /></span>
                  <div>
                    <div className={styles.ruleTitle}>{r.title}</div>
                    <div className={styles.ruleDesc}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.warningBox}>
              <div className={styles.warningTitle}>Diqqat</div>
              <div className={styles.warningText}>
                Mavzuni siz tanlay olmaysiz — tizim tasodifiy tanlaydi.
                Vaqt tugasa, yozganingiz avtomatik topshiriladi.
                Imtihon davomida boshqa sahifaga o'tishga urinmang.
              </div>
            </div>

            <button className={styles.startBtn} onClick={startExam}>
              <IconTrophy /> Imtihonni boshlash
            </button>
          </div>
        </div>
      )}

      {/* EXAM */}
      {stage === 'exam' && (
        <div className={styles.examWrapper}>
          <div className={styles.examHeader}>
            <div className={styles.examTitle}>Mock Imtihon — {question?.topic}</div>

            <div className={styles.timerWrap}>
              <div className={styles.timerNum} style={{ color: timerColor }}>
                {mins}:{secs.toString().padStart(2, '0')}
              </div>
              <div className={styles.timerTrack}>
                <div className={styles.timerFill} style={{ width: `${timePercent}%`, background: timerColor }} />
              </div>
            </div>

            <div className={styles.wordCountTag}>{wordCount} so'z</div>
          </div>

          <div className={styles.examBody}>
            <div className={styles.questionPane}>
              <div className={styles.questionTag}>Writing {question?.type} — {question?.topic}</div>

              <div className={`glassPanel ${styles.questionBox}`}>{question?.question}</div>

              <div className={styles.noteBox}>
                <div className={styles.noteLbl}>Eslatma</div>
                <div className={styles.noteText}>
                  • Kamida 250 so'z yozing<br />
                  • Fikringizni aniq va mantiqiy ifodalang<br />
                  • Misollar keltiring<br />
                  • Xulosa yozishni unutmang
                </div>
              </div>
            </div>

            <div className={styles.writingPane}>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Essayingizni shu yerga yozing..."
                className={styles.writeArea}
              />
              <div className={styles.writeFooter}>
                <span className={`${styles.wordCountLbl} ${wordCount >= 250 ? styles.wordCountLblDone : ''}`}>
                  {wordCount} / 250 so'z
                </span>
                <button className={styles.submitBtn} onClick={submitExam} disabled={wordCount < 30 || loading}>
                  <IconSend /> {loading ? 'Baholanmoqda...' : 'Topshirish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULT */}
      {stage === 'result' && (
        <div className={styles.resultInner}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              <span className={styles.titleIcon}><IconTrophy /></span>
              Natijalar
            </h1>
            <p className={styles.desc}>AI baholash yakunlandi</p>
          </div>

          <WritingTabs />

          {loading ? (
            <div className={styles.centerBox}>AI baholamoqda...</div>
          ) : (
            <>
              <div className={styles.scoreGrid}>
                <div className={`glassPanel ${styles.scoreCard}`}>
                  <div className={styles.scoreCardLbl}>Band</div>
                  <div className={styles.scoreCardVal} style={{ color: 'var(--gem-blue)' }}>{feedback?.band || '—'}</div>
                </div>
                <div className={`glassPanel ${styles.scoreCard}`}>
                  <div className={styles.scoreCardLbl}>Yozish vaqti</div>
                  <div className={styles.scoreCardValSm} style={{ color: 'var(--on-green)' }}>
                    {spentMins}:{spentSecs.toString().padStart(2, '0')}
                  </div>
                </div>
                <div className={`glassPanel ${styles.scoreCard}`}>
                  <div className={styles.scoreCardLbl}>So'zlar soni</div>
                  <div className={styles.scoreCardValSm} style={{ color: 'var(--on-orange)' }}>{wordCount}</div>
                </div>
              </div>

              <div className={`glassPanel ${styles.qaBox}`}>
                <div className={styles.qaLbl}>Savol:</div>
                <div className={styles.qaText}>{question?.question}</div>
              </div>

              {feedback?.feedback_uz && (
                <div className={styles.aiBox}>
                  <div className={styles.aiLbl}><IconBot /> AI umumiy baholash:</div>
                  <div className={styles.aiText}>{feedback.feedback_uz}</div>
                </div>
              )}

              <div className={styles.dualGrid}>
                {feedback?.good_phrases?.length > 0 && (
                  <div className={styles.goodBox}>
                    <div className={`${styles.boxLbl} ${styles.goodLbl}`}><IconCheck /> Kuchli tomonlar:</div>
                    {feedback.good_phrases.map((p, i) => (
                      <div key={i} className={styles.listItem}>• {p}</div>
                    ))}
                  </div>
                )}
                {feedback?.improve_suggestions?.length > 0 && (
                  <div className={styles.improveBox}>
                    <div className={`${styles.boxLbl} ${styles.improveLbl}`}><IconTarget /> Yaxshilash kerak:</div>
                    {feedback.improve_suggestions.map((p, i) => (
                      <div key={i} className={styles.listItem}>• {p}</div>
                    ))}
                  </div>
                )}
              </div>

              {feedback?.grammar_issues?.length > 0 && (
                <div className={styles.grammarBox}>
                  <div className={styles.grammarLbl}><IconX /> Grammatika xatolari:</div>
                  {feedback.grammar_issues.map((p, i) => (
                    <div key={i} className={styles.listItem}>• {p}</div>
                  ))}
                </div>
              )}

              <div className={`glassPanel ${styles.essayBox}`}>
                <div className={styles.essayLbl}>Sizning essayingiz:</div>
                <div className={styles.essayText}>{text}</div>
              </div>

              <button className={styles.retryBtn} onClick={() => { setStage('intro'); setFeedback(null); setText('') }}>
                <IconRefresh /> Yangi Mock Imtihon
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
