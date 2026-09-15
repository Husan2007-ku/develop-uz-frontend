'use client'
import { useState } from 'react'
import GlassBackground from '@/components/GlassBackground'
import WritingTabs from '@/components/WritingTabs'
import { IconGrammar, IconLock, IconX, IconPlus } from '@/components/Icons'
import styles from './grammar.module.css'

const STRUCTURES = [
  // CONCESSION
  {
    id: 1, category: 'Concession', band: '7', task_type: 'task2', is_premium: false,
    title: 'Although / Even though',
    structure: 'Although + clause, + main clause',
    explanation_uz: 'Qarama-qarshi fikrni bildirish uchun ishlatiladi. Ikki jumlani birlashtiradi.',
    example_1: 'Although technology has improved communication, it has also led to increased social isolation.',
    example_2: 'Even though governments invest heavily in education, skill gaps remain prevalent.',
  },
  {
    id: 2, category: 'Concession', band: '7', task_type: 'task2', is_premium: false,
    title: 'While / Whereas',
    structure: 'While/Whereas + clause, + main clause',
    explanation_uz: 'Ikki fikrni taqqoslash uchun. "While" vaqtni ham bildirishi mumkin.',
    example_1: 'While some argue that globalisation benefits developing nations, others contend it exacerbates inequality.',
    example_2: 'Whereas urban residents enjoy better infrastructure, rural communities often lack basic services.',
  },
  {
    id: 3, category: 'Concession', band: '8', task_type: 'task2', is_premium: false,
    title: 'Despite / In spite of',
    structure: 'Despite/In spite of + noun/gerund, + main clause',
    explanation_uz: 'Biror narsa bo\'lishiga qaramay degan ma\'noni beradi.',
    example_1: 'Despite significant investment in renewable energy, fossil fuels continue to dominate global consumption.',
    example_2: 'In spite of widespread awareness campaigns, obesity rates have continued to rise.',
  },
  {
    id: 4, category: 'Concession', band: '8', task_type: 'task2', is_premium: false,
    title: 'Admittedly / It must be acknowledged that',
    structure: 'Admittedly, + clause. However, + main argument.',
    explanation_uz: 'Qarshi tomonning fikrini tan olish, keyin o\'z fikringizni kuchaytirish.',
    example_1: 'Admittedly, economic growth can generate employment opportunities. However, the environmental cost is often prohibitive.',
    example_2: 'It must be acknowledged that social media fosters connectivity. Nevertheless, its addictive nature poses serious risks.',
  },

  // ADDITION
  {
    id: 5, category: 'Addition', band: '7', task_type: 'both', is_premium: false,
    title: 'Furthermore / Moreover / In addition',
    structure: 'Furthermore/Moreover, + additional point',
    explanation_uz: 'Qo\'shimcha argument yoki misol qo\'shish uchun.',
    example_1: 'Furthermore, research consistently demonstrates a strong correlation between education and economic prosperity.',
    example_2: 'Moreover, the psychological benefits of regular exercise extend well beyond physical health.',
  },
  {
    id: 6, category: 'Addition', band: '8', task_type: 'task2', is_premium: false,
    title: 'Not only... but also',
    structure: 'Not only does/is + subject + verb, but it also + verb',
    explanation_uz: 'Ikkita muhim fikrni kuchaytirish uchun. Inversiya bilan ishlatiladi.',
    example_1: 'Not only does remote working reduce commuting costs, but it also enhances employee productivity and wellbeing.',
    example_2: 'Not only has globalisation accelerated economic growth, but it has also facilitated unprecedented cultural exchange.',
  },

  // CAUSE & EFFECT
  {
    id: 7, category: 'Cause & Effect', band: '7', task_type: 'both', is_premium: false,
    title: 'As a result / Consequently / Therefore',
    structure: 'As a result/Consequently, + effect',
    explanation_uz: 'Sabab-natija bog\'lanishini ifodalash uchun.',
    example_1: 'As a result of rapid urbanisation, many cities are struggling to provide adequate housing.',
    example_2: 'Consequently, millions of people lack access to clean drinking water.',
  },
  {
    id: 8, category: 'Cause & Effect', band: '8', task_type: 'task2', is_premium: false,
    title: 'This inevitably leads to',
    structure: 'This inevitably leads to + noun/gerund',
    explanation_uz: 'Muqarrar natijani ifodalash uchun. "inevitably" so\'zi kuchli ta\'sir qiladi.',
    example_1: 'Excessive screen time among adolescents inevitably leads to sleep deprivation and reduced academic performance.',
    example_2: 'Unchecked deforestation inevitably leads to the collapse of local ecosystems.',
  },

  // COMPARISON
  {
    id: 9, category: 'Comparison', band: '7', task_type: 'task1', is_premium: false,
    title: 'Compared to / In comparison with',
    structure: 'Compared to + noun, + main clause',
    explanation_uz: 'Task 1 da ikki narsani taqqoslash uchun. Juda ko\'p ishlatiladi.',
    example_1: 'Compared to 2010, the proportion of renewable energy users increased dramatically by 2020.',
    example_2: 'In comparison with developed nations, developing countries consume significantly less energy per capita.',
  },
  {
    id: 10, category: 'Comparison', band: '8', task_type: 'task1', is_premium: false,
    title: 'Significantly higher/lower than',
    structure: 'The figure for X was significantly higher/lower than that for Y',
    explanation_uz: 'Task 1 da raqamlarni taqqoslash uchun. "that for" — takrordan qochish.',
    example_1: 'The unemployment rate in urban areas was significantly higher than that in rural regions.',
    example_2: 'Sales figures for product A were considerably lower than those for product B throughout the period.',
  },

  // OPINION
  {
    id: 11, category: 'Opinion', band: '7', task_type: 'task2', is_premium: false,
    title: 'It is widely believed that',
    structure: 'It is widely believed/argued/accepted that + clause',
    explanation_uz: 'Umumiy fikrni bildirish uchun. Shaxsiy fikrdan uzoqlashish imkonini beradi.',
    example_1: 'It is widely believed that access to quality education is a fundamental human right.',
    example_2: 'It is commonly argued that governments bear primary responsibility for environmental protection.',
  },
  {
    id: 12, category: 'Opinion', band: '9', task_type: 'task2', is_premium: false,
    title: 'I would contend that',
    structure: 'I would contend/argue/maintain that + clause',
    explanation_uz: '"I think" ning Band 9 varianti. Qat\'iy pozitsiya bildiradi.',
    example_1: 'I would contend that the benefits of globalisation, while real, are distributed profoundly unevenly.',
    example_2: 'I would maintain that technological unemployment, though inevitable, can be mitigated through proactive policy.',
  },

  // PREMIUM structures
  {
    id: 13, category: 'Advanced', band: '9', task_type: 'task2', is_premium: true,
    title: 'The extent to which',
    structure: 'The extent to which + clause + determines/shapes + noun',
    explanation_uz: 'Akademik darajadagi murakkab struktura. Examinerga kuchli ta\'sir qiladi.',
    example_1: 'The extent to which social media influences political opinion remains a hotly contested question.',
    example_2: 'The extent to which governments prioritise economic growth over environmental sustainability determines long-term prosperity.',
  },
  {
    id: 14, category: 'Advanced', band: '9', task_type: 'task2', is_premium: true,
    title: 'What is particularly striking is',
    structure: 'What is particularly striking/significant/alarming is (that) + clause',
    explanation_uz: 'Diqqatni muhim fikrga jalb qilish uchun. C2 darajasida.',
    example_1: 'What is particularly striking is that despite decades of research, income inequality continues to widen globally.',
    example_2: 'What is especially alarming is the rate at which biodiversity loss is accelerating.',
  },
  {
    id: 15, category: 'Advanced', band: '9', task_type: 'both', is_premium: true,
    title: 'It is no coincidence that',
    structure: 'It is no coincidence that + clause',
    explanation_uz: 'Ikkita hodisa o\'rtasidagi bog\'liqlikni ta\'kidlash uchun.',
    example_1: 'It is no coincidence that the countries with the highest literacy rates also boast the strongest economies.',
    example_2: 'It is no coincidence that urban areas with robust public transport systems report lower pollution levels.',
  },
]

const CATEGORIES = ['Barchasi', 'Concession', 'Addition', 'Cause & Effect', 'Comparison', 'Opinion', 'Advanced']
const BANDS = ['Barchasi', '7', '8', '9']
const TASKS = ['Barchasi', 'task1', 'task2', 'both']

const BAND_TONE = {
  '9': { bg: 'var(--t-violet)', fg: 'var(--on-violet)' },
  '8': { bg: 'var(--t-green)', fg: 'var(--on-green)' },
  '7': { bg: 'var(--t-orange)', fg: 'var(--on-orange)' },
}
function bandTone(b) { return BAND_TONE[b] || { bg: 'var(--t-blue)', fg: 'var(--on-blue)' } }

export default function GrammarPage() {
  const [category, setCategory] = useState('Barchasi')
  const [band, setBand] = useState('Barchasi')
  const [task, setTask] = useState('Barchasi')
  const [selected, setSelected] = useState(null)
  const [showPremium, setShowPremium] = useState(false)

  const filtered = STRUCTURES.filter(s => {
    if (category !== 'Barchasi' && s.category !== category) return false
    if (band !== 'Barchasi' && s.band !== band) return false
    if (task !== 'Barchasi' && s.task_type !== task && s.task_type !== 'both') return false
    return true
  })

  const free = filtered.filter(s => !s.is_premium)
  const premium = filtered.filter(s => s.is_premium)

  return (
    <div className={styles.wrapper}>
      <GlassBackground />
      <div className={styles.inner}>

        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}><IconGrammar /></span>
            Grammar & Strukturalar
          </h1>
          <p className={styles.desc}>Task 1 va Task 2 uchun Band 7–9 darajasidagi grammatik strukturalar</p>
        </div>

        <WritingTabs />

        <div className={`glassPanel ${styles.filterBar}`}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <div className={styles.filterLbl}>Kategoriya:</div>
              <div className={styles.filterPills}>
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    className={`${styles.filterPill} ${category === c ? `${styles.filterPillActive} ${styles.pillBlue}` : ''}`}
                    onClick={() => setCategory(c)}
                  >{c}</button>
                ))}
              </div>
            </div>
            <div className={styles.filterGroup}>
              <div className={styles.filterLbl}>Band:</div>
              <div className={styles.filterPills}>
                {BANDS.map(b => {
                  const tone = bandTone(b)
                  const active = band === b
                  return (
                    <button
                      key={b}
                      className={`${styles.filterPill} ${active ? styles.filterPillActive : ''}`}
                      style={active ? { background: tone.bg, color: tone.fg } : undefined}
                      onClick={() => setBand(b)}
                    >{b === 'Barchasi' ? b : `Band ${b}`}</button>
                  )
                })}
              </div>
            </div>
            <div className={styles.filterGroup}>
              <div className={styles.filterLbl}>Task turi:</div>
              <div className={styles.filterPills}>
                {TASKS.map(t => (
                  <button
                    key={t}
                    className={`${styles.filterPill} ${task === t ? `${styles.filterPillActive} ${styles.pillBlue}` : ''}`}
                    onClick={() => setTask(t)}
                  >
                    {t === 'Barchasi' ? t : t === 'both' ? 'Ikkalasi' : t === 'task1' ? 'Task 1' : 'Task 2'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.layout} ${selected ? styles.layoutSplit : ''}`}>

          <div>
            <div className={styles.countLbl}>{free.length} ta bepul struktura</div>

            <div className={styles.list}>
              {free.map(s => {
                const tone = bandTone(s.band)
                return (
                  <div
                    key={s.id}
                    className={`glassPanel ${styles.card} ${selected?.id === s.id ? styles.cardActive : ''}`}
                    onClick={() => setSelected(selected?.id === s.id ? null : s)}
                  >
                    <div className={styles.cardTop}>
                      <div className={styles.badgeRow}>
                        <span className={styles.badge} style={{ background: tone.bg, color: tone.fg }}>Band {s.band}</span>
                        <span className={`${styles.badge} ${styles.badgeCategory}`}>{s.category}</span>
                        <span className={`${styles.badge} ${styles.badgeTask}`}>
                          {s.task_type === 'both' ? 'Task 1 & 2' : s.task_type === 'task1' ? 'Task 1' : 'Task 2'}
                        </span>
                      </div>
                      <div className={styles.cardTitle}>{s.title}</div>
                    </div>
                    <div className={styles.structureBox}>{s.structure}</div>
                  </div>
                )
              })}
            </div>

            {premium.length > 0 && (
              <div className={styles.premiumSection}>
                <div className={styles.premiumHead}>
                  <div className={styles.premiumCount}><IconLock /> Premium strukturalar ({premium.length} ta)</div>
                  <button className={styles.premiumToggle} onClick={() => setShowPremium(!showPremium)}>
                    {showPremium ? 'Yopish' : "Ko'rish"}
                  </button>
                </div>
                {showPremium && premium.map(s => (
                  <div key={s.id} className={`glassPanel ${styles.premiumCard}`}>
                    <div className={styles.premiumOverlay}>
                      <span className={styles.premiumLock}><IconLock /> Premium obunasi kerak</span>
                    </div>
                    <div className={styles.premiumTitle}>{s.title}</div>
                    <div className={styles.premiumStructure}>{s.structure}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selected && (
            <div className={styles.detailPanel}>
              <div className={`glassPanel ${styles.detailCard}`}>
                <div className={styles.detailHead}>
                  <h3 className={styles.detailTitle}>{selected.title}</h3>
                  <button className={styles.closeBtn} onClick={() => setSelected(null)}><IconX /></button>
                </div>

                <div className={styles.detailStructure}>{selected.structure}</div>

                <div className={styles.detailSection}>
                  <div className={styles.detailSectionLbl}>Izoh (o'zbekcha):</div>
                  <div className={styles.detailText}>{selected.explanation_uz}</div>
                </div>

                <div className={styles.detailBadges}>
                  <span className={styles.detailBadge} style={{ background: bandTone(selected.band).bg, color: bandTone(selected.band).fg }}>Band {selected.band}</span>
                  <span className={`${styles.detailBadge} ${styles.badgeCategory}`}>{selected.category}</span>
                  <span className={`${styles.detailBadge} ${styles.badgeTask}`}>
                    {selected.task_type === 'both' ? 'Task 1 & 2' : selected.task_type === 'task1' ? 'Task 1' : 'Task 2'}
                  </span>
                </div>

                <div className={styles.detailSectionLbl}>Misollar:</div>
                {[selected.example_1, selected.example_2].filter(Boolean).map((ex, i) => (
                  <div key={i} className={styles.exampleQuote}>"{ex}"</div>
                ))}

                <button className={styles.addBtn}><IconPlus /> Shaxsiy ro'yxatga qo'shish</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
