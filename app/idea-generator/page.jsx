'use client'
import { useState } from 'react'
import Link from 'next/link'
import GlassBackground from '@/components/GlassBackground'
import {
  IconFlame, IconCheck, IconX, IconTarget, IconWord, IconLayers,
  IconPencil, IconArrowRight, IconSend,
} from '@/components/Icons'
import styles from './idea-generator.module.css'

const API = 'https://develop-uz-api.onrender.com'

const SAMPLE_TOPICS = [
  'Social media has a negative impact on young people',
  'Governments should invest more in public transport',
  'Technology is making people less sociable',
  'University education should be free for everyone',
  'Climate change is the biggest threat facing humanity',
  'Working from home has more advantages than disadvantages',
]

const OUTLINE_SECTIONS = [
  { key: 'introduction', label: 'Kirish (Introduction)', tone: 'var(--gem-blue)' },
  { key: 'body_1', label: '1-paragraf (Body 1)', tone: 'var(--gem-violet)' },
  { key: 'body_2', label: '2-paragraf (Body 2)', tone: 'var(--gem-violet)' },
  { key: 'conclusion', label: "Xulosa (Conclusion)", tone: 'var(--gem-orange)' },
]

const THESIS_TIPS = [
  "Savolga to'g'ridan-to'g'ri javob berishi kerak",
  'Sizning pozitsiyangizni aniq ifodalashi kerak',
  'Ikkita asosiy argumentni ko\'rsatishi kerak',
  "Bir jumlada to'liq fikr berilishi kerak",
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
    <div className={styles.wrapper}>
      <GlassBackground />
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}><IconFlame /></span>
            Idea Generator
          </h1>
          <p className={styles.desc}>Writing Task 2 mavzusini kiriting — AI argumentlar, vocabulary va outline beradi</p>
        </div>

        <div className={`glassPanel ${styles.inputCard}`}>
          <div className={styles.inputLbl}>Writing Task 2 mavzusini yozing:</div>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Masalan: Social media has a negative impact on young people's mental health. Discuss both views and give your opinion."
            rows={3}
            className={styles.topicTextarea}
          />

          <div className={styles.sampleWrap}>
            <div className={styles.sampleLbl}>Yoki tayyor mavzulardan birini tanlang:</div>
            <div className={styles.samplePills}>
              {SAMPLE_TOPICS.map((t, i) => (
                <button
                  key={i}
                  className={`${styles.samplePill} ${topic === t ? styles.samplePillActive : ''}`}
                  onClick={() => setTopic(t)}
                >{t.length > 40 ? t.slice(0, 40) + '...' : t}</button>
              ))}
            </div>
          </div>

          <button className={styles.generateBtn} onClick={generateIdeas} disabled={topic.trim().length < 10 || loading}>
            <IconSend /> {loading ? 'AI fikrlamoqda...' : 'Idea Generation'}
          </button>
        </div>

        {result && !result.error && (
          <div>
            <div className={styles.tabRow}>
              {[
                { id: 'arguments', label: 'Argumentlar', Icon: IconTarget },
                { id: 'vocabulary', label: 'Vocabulary', Icon: IconWord },
                { id: 'outline', label: 'Outline', Icon: IconLayers },
                { id: 'thesis', label: 'Thesis', Icon: IconPencil },
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                ><tab.Icon /> {tab.label}</button>
              ))}
              <Link href="/ai-essay" className={styles.essayLink}>
                <span className={styles.essayLinkBtn}>Essay yozish <IconArrowRight /></span>
              </Link>
            </div>

            {activeTab === 'arguments' && (
              <div className={styles.argGrid}>
                <div className={`glassPanel ${styles.argCol}`}>
                  <div className={`${styles.argColHead} ${styles.proHead}`}><IconCheck /> Tarafdor argumentlar (Pro)</div>
                  {result.pro_arguments?.map((arg, i) => (
                    <div key={i} className={styles.argItem}>
                      <div className={styles.argText}>{i + 1}. {arg.argument}</div>
                      {arg.example && (
                        <div className={`${styles.argExample} ${styles.proExample}`}>Misol: {arg.example}</div>
                      )}
                      {arg.vocabulary?.length > 0 && (
                        <div className={styles.argVocabRow}>
                          {arg.vocabulary.map((v, j) => (
                            <span key={j} className={`${styles.argVocabChip} ${styles.proChip}`}>{v}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className={`glassPanel ${styles.argCol}`}>
                  <div className={`${styles.argColHead} ${styles.conHead}`}><IconX /> Qarshi argumentlar (Con)</div>
                  {result.con_arguments?.map((arg, i) => (
                    <div key={i} className={styles.argItem}>
                      <div className={styles.argText}>{i + 1}. {arg.argument}</div>
                      {arg.example && (
                        <div className={`${styles.argExample} ${styles.conExample}`}>Misol: {arg.example}</div>
                      )}
                      {arg.vocabulary?.length > 0 && (
                        <div className={styles.argVocabRow}>
                          {arg.vocabulary.map((v, j) => (
                            <span key={j} className={`${styles.argVocabChip} ${styles.conChip}`}>{v}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'vocabulary' && (
              <div className={`glassPanel ${styles.vocabCard}`}>
                <div className={styles.vocabIntro}>Bu mavzu uchun tavsiya etilgan C1/C2 vocabulary:</div>
                <div className={styles.vocabGrid}>
                  {result.key_vocabulary?.map((v, i) => {
                    const tone = v.level === 'C2'
                      ? { bg: 'var(--t-violet)', fg: 'var(--on-violet)' }
                      : v.level === 'C1'
                        ? { bg: 'var(--t-blue)', fg: 'var(--on-blue)' }
                        : { bg: 'var(--t-green)', fg: 'var(--on-green)' }
                    return (
                      <div key={i} className={styles.vocabItem}>
                        <div className={styles.vocabTop}>
                          <span className={styles.vocabWordTxt}>{v.word}</span>
                          <span className={styles.vocabLevelTag} style={{ background: tone.bg, color: tone.fg }}>{v.level}</span>
                        </div>
                        <div className={styles.vocabTranslationTxt}>{v.translation}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === 'outline' && result.outline && (
              <div className={`glassPanel ${styles.outlineCard}`}>
                <div className={styles.outlineIntro}>Essay strukturasi (outline):</div>
                {OUTLINE_SECTIONS.map(section => (
                  <div key={section.key} className={styles.outlineSection} style={{ borderLeftColor: section.tone }}>
                    <div className={styles.outlineSectionLbl} style={{ color: section.tone }}>{section.label}</div>
                    <div className={styles.outlineSectionText}>{result.outline[section.key]}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'thesis' && (
              <div className={`glassPanel ${styles.thesisCard}`}>
                <div className={styles.thesisIntro}>Tavsiya etilgan thesis statement:</div>
                <div className={styles.thesisBox}>
                  <div className={styles.thesisText}>"{result.thesis_statement}"</div>
                </div>
                <div className={styles.thesisTipsWrap}>
                  <div className={styles.thesisTipsLbl}>Yaxshi thesis statement qanday bo'lishi kerak:</div>
                  {THESIS_TIPS.map((tip, i) => (
                    <div key={i} className={styles.thesisTipItem}><IconCheck /> {tip}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {result?.error && (
          <div className={styles.errorBox}>
            <IconX /> Xatolik: {result.error}. Backend ishlab turganiga ishonch hosil qiling.
          </div>
        )}
      </div>
    </div>
  )
}
