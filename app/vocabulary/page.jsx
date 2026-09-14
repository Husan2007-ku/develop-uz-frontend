'use client'
import { useState, useEffect } from 'react'
import styles from './vocabulary.module.css'
import GlassBackground from '@/components/GlassBackground'
import { IconCards, IconSearch, IconX, IconPlus } from '@/components/Icons'

const LEVEL_CLASS = { B2: styles.lvB2, C1: styles.lvC1, C2: styles.lvC2 }
const PILL_CLASS = { all: styles.pAll, B2: styles.pB2, C1: styles.pC1, C2: styles.pC2 }

export default function VocabularyPage() {
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch('https://develop-uz-api.onrender.com/vocabulary/?limit=50')
      .then(r => r.json())
      .then(d => { setWords(d.words || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = words.filter(w => {
    const matchLevel = filter === 'all' || w.cefr_level === filter
    const matchSearch = w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.translation_uz.toLowerCase().includes(search.toLowerCase())
    return matchLevel && matchSearch
  })

  return (
    <div className={styles.wrapper}>
      <GlassBackground />
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}><IconCards size={17} /></span>
            Vocabulary
          </h1>
          <p className={styles.desc}>B2, C1, C2 darajali so&apos;zlar — O&apos;zbek tarjimasi bilan</p>
        </div>

        <div className={styles.toolbar}>
          <label className={styles.search}>
            <IconSearch />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="So'z qidirish..."
            />
          </label>
          <div className={styles.pills}>
            {['all', 'B2', 'C1', 'C2'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`${styles.pill} ${filter === f ? `${styles.pillActive} ${PILL_CLASS[f]}` : ''}`}
              >
                {f === 'all' ? 'Barchasi' : f}
              </button>
            ))}
          </div>
          <span className={styles.count}>{filtered.length} ta so&apos;z</span>
        </div>

        <div className={`${styles.layout} ${selected ? styles.layoutSplit : ''}`}>
          <div className={styles.grid}>
            {loading ? (
              <div className={styles.empty}>Yuklanmoqda...</div>
            ) : filtered.length === 0 ? (
              <div className={styles.empty}>So&apos;z topilmadi</div>
            ) : filtered.map(w => {
              const isSelected = selected?.id === w.id
              return (
                <div
                  key={w.id}
                  onClick={() => setSelected(isSelected ? null : w)}
                  className={`glassPanel ${styles.card} ${isSelected ? styles.cardActive : ''}`}
                >
                  <div className={styles.cardTop}>
                    <span className={styles.cardWord}>{w.word}</span>
                    <span className={`${styles.badge} ${LEVEL_CLASS[w.cefr_level] || styles.lvB2}`}>{w.cefr_level}</span>
                  </div>
                  <div className={styles.cardTranslation}>{w.translation_uz}</div>
                  <span className={styles.typeBadge}>{w.word_type}</span>
                  {w.example_1 && <div className={styles.cardExample}>&quot;{w.example_1}&quot;</div>}
                </div>
              )
            })}
          </div>

          {selected && (
            <div className={`glassPanel ${styles.detail}`}>
              <div className={styles.detailTop}>
                <div>
                  <div className={styles.detailWord}>{selected.word}</div>
                  <div className={styles.detailTranslation}>{selected.translation_uz}</div>
                </div>
                <button onClick={() => setSelected(null)} className={styles.closeBtn} aria-label="Yopish">
                  <IconX size={13} />
                </button>
              </div>

              <div className={styles.badgeRow}>
                <span className={`${styles.badge} ${LEVEL_CLASS[selected.cefr_level] || styles.lvB2}`}>{selected.cefr_level}</span>
                <span className={styles.typeBadge}>{selected.word_type}</span>
              </div>

              {selected.definition_uz && (
                <div className={styles.section}>
                  <div className={styles.sectionLbl}>Ta&apos;rif</div>
                  <div className={styles.sectionText}>{selected.definition_uz}</div>
                </div>
              )}

              {(selected.example_1 || selected.example_2 || selected.example_3) && (
                <div className={styles.section}>
                  <div className={styles.sectionLbl}>Misollar</div>
                  {[selected.example_1, selected.example_2, selected.example_3].filter(Boolean).map((ex, i) => (
                    <div key={i} className={styles.exampleQuote}>&quot;{ex}&quot;</div>
                  ))}
                </div>
              )}

              {selected.collocations && selected.collocations.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionLbl}>Collocations</div>
                  <div className={styles.chipRow}>
                    {selected.collocations.map((c, i) => (
                      <span key={i} className={styles.chip}>{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {selected.word_family && Object.keys(selected.word_family).length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionLbl}>So&apos;z oilasi</div>
                  <div className={styles.chipRow}>
                    {Object.entries(selected.word_family).map(([type, word], i) => (
                      <span key={i} className={styles.chipNeutral}><b>{type}:</b>{word}</span>
                    ))}
                  </div>
                </div>
              )}

              <button className={styles.addBtn}>
                <IconPlus size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                Shaxsiy vocabularyga qo&apos;shish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
