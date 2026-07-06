'use client'
import { useState, useEffect } from 'react'

const BAND_COLOR = (score) => {
  if (score >= 8) return 'bg-green-500/20 text-green-400 border-green-500/30'
  if (score >= 7) return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
}

const TYPE_LABELS = {
  evaluation: 'Evaluation',
  comparison: 'Comparison',
  cause_effect: 'Cause & Effect',
  speculation: 'Speculation',
  reasoning: 'Reasoning',
}

export default function EssaysPage() {
  const [essays, setEssays] = useState([])
  const [selected, setSelected] = useState(null)
  const [highlights, setHighlights] = useState([])
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [vocabNotes, setVocabNotes] = useState('')
  const [grammarNotes, setGrammarNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const TELEGRAM_ID = 7311844154

  useEffect(() => {
    fetch('https://develop-uz-api.onrender.com/essays/?limit=20')
      .then(r => r.json())
      .then(d => { setEssays(d.essays || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function selectEssay(essay) {
    if (!essay.id) return
    setSelected(null)
    setShowAnalysis(false)
    setHighlights([])
    try {
      const res = await fetch(`https://develop-uz-api.onrender.com/essays/${essay.id}`)
      const data = await res.json()
      setSelected(data)
      setHighlights(data.highlights || [])
      const notesRes = await fetch(
        `https://develop-uz-api.onrender.com/essays/${essay.id}/notes/${TELEGRAM_ID}`
      )
      const notes = await notesRes.json()
      setVocabNotes(notes.vocab_notes || '')
      setGrammarNotes(notes.grammar_notes || '')
      setSaved(false)
    } catch (e) {
      console.error(e)
    }
  }

  async function saveNotes() {
    if (!selected) return
    try {
      await fetch(
        `https://develop-uz-api.onrender.com/essays/${selected.id}/notes/${TELEGRAM_ID}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vocab_notes: vocabNotes,
            grammar_notes: grammarNotes
          })
        }
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error(e)
    }
  }

  const HL_COLORS = {
    collocation: 'bg-yellow-200 text-yellow-900',
    idiom: 'bg-green-200 text-green-900',
    c1_vocab: 'bg-blue-200 text-blue-900',
    c2_vocab: 'bg-purple-200 text-purple-900',
  }

  function renderContent(content) {
    if (!showAnalysis || highlights.length === 0) {
      return content.split('\n\n').map((p, i) => (
        <p key={i} className="text-gray-200 leading-relaxed mb-5">{p}</p>
      ))
    }
    let result = []
    let lastIdx = 0
    const sorted = [...highlights].sort((a, b) => a.start_index - b.start_index)
    sorted.forEach((h, i) => {
      if (h.start_index > lastIdx) {
        result.push(<span key={`t${i}`}>{content.slice(lastIdx, h.start_index)}</span>)
      }
      result.push(
        <span key={`h${i}`}
          className={`${HL_COLORS[h.highlight_type] || 'bg-gray-200'} px-1 rounded cursor-pointer`}
          title={h.explanation_uz || ''}>
          {content.slice(h.start_index, h.end_index)}
        </span>
      )
      lastIdx = h.end_index
    })
    if (lastIdx < content.length) {
      result.push(<span key="last">{content.slice(lastIdx)}</span>)
    }
    return <p className="text-gray-200 leading-relaxed">{result}</p>
  }

  const filtered = filter === 'all'
    ? essays
    : essays.filter(e => e.question_type === filter)

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <h1 className="text-3xl font-black mb-1">Writing Essays</h1>
          <p className="text-gray-400 text-sm">
            Band 6-9 gacha real IELTS Writing Task 2 essaylar
          </p>
        </div>
      </div>

      <div
        className="max-w-[1400px] mx-auto px-6 py-6 flex gap-4"
        style={{ height: 'calc(100vh - 120px)' }}
      >
        {/* PANEL 1 */}
        <div className="w-72 flex-shrink-0 bg-gray-900 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <div className="text-sm font-bold mb-3">Essay kutubxonasi</div>
            <div className="flex gap-1 flex-wrap">
              {['all', 'evaluation', 'reasoning', 'comparison'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`text-xs px-2 py-1 rounded-lg transition ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}>
                  {f === 'all' ? 'Barchasi' : TYPE_LABELS[f] || f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              <div className="text-center py-10 text-gray-500 text-sm">Yuklanmoqda...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">Essay topilmadi</div>
            ) : filtered.map(essay => (
              <div key={essay.id} onClick={() => selectEssay(essay)}
                className={`p-3 rounded-xl cursor-pointer transition border ${
                  selected?.id === essay.id
                    ? 'bg-blue-600/20 border-blue-500/50'
                    : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                }`}>
                <div className="flex gap-1 mb-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${BAND_COLOR(essay.band_score)}`}>
                    {essay.band_score}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                    {TYPE_LABELS[essay.question_type] || essay.question_type}
                  </span>
                </div>
                <p className="text-sm font-medium leading-snug line-clamp-2">{essay.title}</p>
                <p className="text-xs text-gray-500 mt-1">{essay.word_count} so'z</p>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/10">
            <span className="text-xs text-gray-500">Bepul: 10 ta</span>
          </div>
        </div>

        {/* PANEL 2 */}
        <div className="flex-1 bg-gray-900 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-5xl mb-4">📝</div>
                <p>Chap tomondagi essayni bosing</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-white/10 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold text-lg leading-snug mb-2">{selected.title}</h2>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full border font-mono ${BAND_COLOR(selected.band_score)}`}>
                      Band {selected.band_score}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">
                      {TYPE_LABELS[selected.question_type] || selected.question_type}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">
                      {selected.word_count} so'z
                    </span>
                  </div>
                </div>
                <button onClick={() => setShowAnalysis(!showAnalysis)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition ${
                    showAnalysis
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-gray-300'
                  }`}>
                  {showAnalysis ? '✅ Tahlil ON' : '🔍 Tahlil'}
                </button>
              </div>

              {showAnalysis && highlights.length > 0 && (
                <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex gap-4 flex-wrap text-xs">
                  <span className="flex items-center gap-1">
                    <span className="bg-yellow-200 text-yellow-900 px-1 rounded">■</span> Collocation
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="bg-green-200 text-green-900 px-1 rounded">■</span> Idiom
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="bg-blue-200 text-blue-900 px-1 rounded">■</span> C1 Vocab
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="bg-purple-200 text-purple-900 px-1 rounded">■</span> C2 Vocab
                  </span>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-6">
                {renderContent(selected.content)}
              </div>
            </>
          )}
        </div>

        {/* PANEL 3 */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-3">
          <div className="flex-1 bg-gray-900 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/10">
              <div className="text-sm font-bold">📌 Qaydlarim — Vocabulary</div>
              <div className="text-xs text-gray-500 mt-0.5">
                O'zingizga yoqqan so'zlarni yozing
              </div>
            </div>
            <textarea
              value={vocabNotes}
              onChange={e => { setVocabNotes(e.target.value); setSaved(false) }}
              placeholder={selected ? "Masalan:\nexacerbate — yomonlashtirmoq\nfoster — rivojlantirmoq" : "Essay tanlang..."}
              disabled={!selected}
              className="flex-1 bg-transparent p-3 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none"
            />
          </div>

          <div className="flex-1 bg-gray-900 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/10">
              <div className="text-sm font-bold">📐 Qaydlarim — Grammatika</div>
              <div className="text-xs text-gray-500 mt-0.5">
                Yoqqan strukturalarni yozing
              </div>
            </div>
            <textarea
              value={grammarNotes}
              onChange={e => { setGrammarNotes(e.target.value); setSaved(false) }}
              placeholder={selected ? "Masalan:\nWhile... , critics argue...\nNot only... but also..." : "Essay tanlang..."}
              disabled={!selected}
              className="flex-1 bg-transparent p-3 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none"
            />
          </div>

          <button onClick={saveNotes} disabled={!selected}
            className={`py-3 rounded-xl font-bold text-sm transition ${
              saved
                ? 'bg-green-600 text-white'
                : selected
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-white/5 text-gray-600 cursor-not-allowed'
            }`}>
            {saved ? '✅ Saqlandi!' : '💾 Saqlash'}
          </button>

          <div className="text-xs text-gray-600 text-center">
            Saqlangan qaydlar bot orqali eslatiladi
          </div>
        </div>
      </div>
    </main>
  )
}
