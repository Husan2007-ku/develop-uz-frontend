'use client'
import { useState } from 'react'
import styles from './speaking.module.css'
import GlassBackground from '@/components/GlassBackground'
import { IconMic, IconArrowRight, IconStar, IconTrophy, IconCheck, IconEye, IconChart } from '@/components/Icons'

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
    <div className={styles.wrapper}>
      <GlassBackground />
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}><IconMic size={16} /></span>
            Speaking Tayyorgarlik
          </h1>
          <p className={styles.desc}>Part 1, 2, 3 uchun namuna javoblar — Band 7 va Band 9 darajasida</p>
        </div>

        <div className={styles.partTabs}>
          {[1, 2, 3].map(p => (
            <button
              key={p}
              onClick={() => { setPart(p); setSelectedQ(null) }}
              className={`${styles.partTab} ${part === p ? styles.partTabActive : ''}`}
            >
              Part {p}
              <span className={styles.partTabSub}>
                {p === 1 ? '(Shaxsiy savollar)' : p === 2 ? '(Cue Card)' : '(Munozara)'}
              </span>
            </button>
          ))}
        </div>

        <div className={`${styles.layout} ${selectedQ ? styles.layoutSplit : ''}`}>
          <div className={styles.qList}>
            {!selectedQ && (
              <div className={styles.qListHint}>{questions.length} ta savol — bosing va namuna javob ko&apos;ring</div>
            )}
            {questions.map(q => (
              <div
                key={q.id}
                onClick={() => selectQuestion(q)}
                className={`glassPanel ${styles.qCard} ${selectedQ?.id === q.id ? styles.qCardActive : ''}`}
              >
                <div className={styles.qTopic}>{q.topic}</div>
                <div className={styles.qText}>{q.question}</div>
                {part === 2 && q.cue_card && (
                  <div className={styles.cueList}>
                    {q.cue_card.map((c, i) => <div key={i} className={styles.cueItem}>• {c}</div>)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedQ && (
            <div className={styles.answerPanel}>
              <div className={styles.bandRow}>
                <span className={styles.bandRowLbl}>Band darajasi:</span>
                {['band7', 'band9'].map(b => (
                  <button
                    key={b}
                    onClick={() => { setBandView(b); setShowAnswer(false) }}
                    className={`${styles.bandBtn} ${bandView === b ? (b === 'band7' ? styles.bandBtn7Active : styles.bandBtn9Active) : ''}`}
                  >
                    {b === 'band7' ? <><IconStar size={12} style={{ marginRight: 5, verticalAlign: -1 }} />Band 7</> : <><IconTrophy size={12} style={{ marginRight: 5, verticalAlign: -1 }} />Band 9</>}
                  </button>
                ))}
                <button onClick={() => setSelectedQ(null)} className={styles.backLink}>
                  <IconArrowRight size={13} style={{ transform: 'scaleX(-1)' }} /> Orqaga
                </button>
              </div>

              <div className={`glassPanel ${styles.questionBox}`}>
                <div className={styles.questionLbl}>Part {part} savol:</div>
                <div className={styles.questionText}>{selectedQ.question}</div>
                {part === 2 && selectedQ.cue_card && (
                  <div className={styles.cueBox}>
                    <div className={styles.cueBoxLbl}>Cue card:</div>
                    {selectedQ.cue_card.map((c, i) => <div key={i} className={styles.cueBoxItem}>• {c}</div>)}
                  </div>
                )}
              </div>

              {!practiceMode ? (
                <button onClick={() => { setPracticeMode(true); startTimer() }} className={styles.practiceBtn}>
                  <IconMic size={16} /> O&apos;zim javob beraman (vaqt boshlanadi)
                </button>
              ) : (
                <div className={`glassPanel ${styles.timerBox}`}>
                  <div className={styles.timerNum}>{mins}:{secs.toString().padStart(2, '0')}</div>
                  <div className={styles.timerHint}>
                    {part === 1 ? 'Part 1: 4-5 jumlada javob bering' : part === 2 ? 'Part 2: 1-2 daqiqa gapiring' : 'Part 3: Chuqur tahlil qiling'}
                  </div>
                  <button onClick={() => { stopTimer(); setShowAnswer(true); setPracticeMode(false) }} className={styles.timerFinishBtn}>
                    <IconCheck size={14} /> Tugatdim — javobni ko&apos;rish
                  </button>
                </div>
              )}

              {showAnswer && selectedQ[bandView] && (
                <div className={`glassPanel ${styles.answerBox}`}>
                  <div className={styles.answerBandLbl} style={{ color: bandView === 'band7' ? 'var(--on-orange)' : 'var(--on-green)' }}>
                    {bandView === 'band7' ? 'Band 7 namuna javob:' : 'Band 9 namuna javob:'}
                  </div>
                  <p className={styles.answerText}>{selectedQ[bandView].answer}</p>

                  <div className={styles.vocabLbl}>Muhim iboralar:</div>
                  <div className={styles.vocabRow}>
                    {selectedQ[bandView].vocab.map((v, i) => <span key={i} className={styles.vocabChip}>{v}</span>)}
                  </div>

                  <div className={styles.tipBox}>Examiner maslahati: {selectedQ[bandView].tip}</div>
                </div>
              )}

              {!showAnswer && !practiceMode && (
                <button onClick={() => setShowAnswer(true)} className={styles.showAnswerBtn}>
                  <IconEye /> Namuna javobni ko&apos;rish
                </button>
              )}

              {showAnswer && (
                <div className={`glassPanel ${styles.compareBox}`}>
                  <div className={styles.compareLbl}><IconChart size={14} /> Band 7 vs Band 9 farqi:</div>
                  <div className={styles.compareCols}>
                    <div>
                      <div className={styles.compareColLbl} style={{ color: 'var(--on-orange)' }}>Band 7</div>
                      {selectedQ.band7.vocab.map((v, i) => <div key={i} className={styles.compareItem}>• {v}</div>)}
                    </div>
                    <div>
                      <div className={styles.compareColLbl} style={{ color: 'var(--on-green)' }}>Band 9</div>
                      {selectedQ.band9.vocab.map((v, i) => <div key={i} className={styles.compareItem}>• {v}</div>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
