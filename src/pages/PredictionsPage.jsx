import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import GameCard from '../components/ui/GameCard'
import PredictionModal from '../components/ui/PredictionModal'

export default function PredictionsPage() {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')
  const [modalGame, setModalGame] = useState(null)
  const [modalPred, setModalPred] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data: games } = await supabase.from('games').select('*').order('match_date')
    const { data: preds } = await supabase.from('predictions').select('*').eq('user_id', user.id)

    const predsMap = {}
    for (const p of (preds || [])) predsMap[p.game_id] = p

    const merged = (games || []).map(g => ({ game: g, prediction: predsMap[g.id] || null }))
    setData(merged)
    setLoading(false)
  }

  const now = new Date()
  const filtered = data.filter(({ game, prediction }) => {
    if (filter === 'feitos') return !!prediction
    if (filter === 'pendentes') return !prediction && new Date(game.match_date) > now
    if (filter === 'finalizados') return game.home_score !== null
    return true
  })

  const total = data.length
  const done = data.filter(d => d.prediction).length
  const pending = data.filter(d => !d.prediction && new Date(d.game.match_date) > now).length
  const totalPts = data.reduce((acc, d) => acc + (d.prediction?.points || 0), 0)

  function openPredict(game) {
    const pred = data.find(d => d.game.id === game.id)?.prediction
    setModalGame(game)
    setModalPred(pred || null)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-6 lg:pt-32 pb-8">
      <div className="mb-8">
        <h1 className="section-title text-left !mb-2">Meus Palpites</h1>
        <p className="text-gray-500 font-medium">Gerencie seus palpites e acompanhe sua pontuação</p>
      </div>

      {/* Stats Premium */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '📋', label: 'Total de jogos', value: total },
          { icon: '✅', label: 'Palpites feitos', value: done },
          { icon: '⏳', label: 'Pendentes', value: pending },
          { icon: '⭐', label: 'Pontos ganhos', value: totalPts },
        ].map((s, i) => (
          <div key={i} className="glass-card p-5 text-center transition-transform hover:scale-105">
            <div className="text-3xl mb-2 drop-shadow-sm">{s.icon}</div>
            <div className="font-display text-4xl text-ocean leading-none mb-1">{s.value}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide snap-x">
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'pendentes', label: '⏳ Pendentes' },
          { key: 'feitos', label: '✅ Feitos' },
          { key: 'finalizados', label: '🏁 Finalizados' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`snap-start whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
              filter === f.key
                ? 'bg-ocean text-white scale-105 shadow-md'
                : 'bg-white text-gray-500 hover:text-ocean hover:bg-ocean/5 border border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-20 text-ocean font-bold text-xl animate-pulse">Carregando palpites...</div>}

      {!loading && filtered.length === 0 && (
        <div className="glass-card p-16 text-center border-dashed border-2 border-gray-300">
          <div className="text-6xl mb-4 drop-shadow-md">🎯</div>
          <p className="text-gray-500 font-bold text-xl">Nenhum palpite aqui ainda</p>
          {filter === 'pendentes' && <p className="text-sm text-gray-400 font-medium mt-2">Todos os jogos já foram palpitados!</p>}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map(({ game, prediction }) => (
          <GameCard
            key={game.id}
            game={game}
            prediction={prediction}
            onPredict={openPredict}
          />
        ))}
      </div>

      {modalGame && (
        <PredictionModal
          game={modalGame}
          existing={modalPred}
          onClose={() => { setModalGame(null); setModalPred(null) }}
          onSaved={fetchData}
        />
      )}
    </div>
  )
}
