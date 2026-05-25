import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import GameCard from '../components/ui/GameCard'
import PredictionModal from '../components/ui/PredictionModal'
import { Calendar } from 'lucide-react'

const ROUNDS = ['Todos', 'Fase de Grupos', 'Oitavas', 'Quartas', 'Semi', 'Final']

export default function GamesPage() {
  const { user } = useAuth()
  const [games, setGames] = useState([])
  const [predictions, setPredictions] = useState({})
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRound, setSelectedRound] = useState('Todos')
  const [modalGame, setModalGame] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const [gamesRes, predsRes, favsRes] = await Promise.all([
      supabase.from('games').select('*').order('match_date'),
      supabase.from('predictions').select('*').eq('user_id', user.id),
      supabase.from('favorites').select('item_id').eq('user_id', user.id).eq('item_type', 'game')
    ])
    setGames(gamesRes.data || [])
    const predsMap = {}
    for (const p of (predsRes.data || [])) predsMap[p.game_id] = p
    setPredictions(predsMap)
    setFavorites(favsRes.data?.map(f => f.item_id) || [])
    setLoading(false)
  }

  async function toggleFavorite(gameId) {
    const isFav = favorites.includes(gameId)
    if (isFav) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('item_type', 'game').eq('item_id', gameId)
      setFavorites(favorites.filter(id => id !== gameId))
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, item_type: 'game', item_id: gameId })
      setFavorites([...favorites, gameId])
    }
  }

  const filtered = selectedRound === 'Todos'
    ? games
    : games.filter(g => g.round === selectedRound)

  // Group by round
  const grouped = filtered.reduce((acc, game) => {
    const key = game.round
    if (!acc[key]) acc[key] = []
    acc[key].push(game)
    return acc
  }, {})

  const pending = games.filter(g => !predictions[g.id] && new Date(g.match_date) > new Date()).length

  return (
    <div className="max-w-5xl mx-auto px-4 pt-32 pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title text-left !mb-2">Jogos</h1>
          {pending > 0 && (
            <p className="text-sm font-bold text-ruby bg-ruby/10 inline-flex px-3 py-1 rounded-full mt-1">
              🎯 {pending} jogo(s) sem palpite
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 text-gray-500 font-bold bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
          <Calendar size={18} className="text-ocean" />
          <span className="text-sm text-ocean">{games.length} jogos</span>
        </div>
      </div>

      {/* Filtros em Pílula */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide snap-x">
        {ROUNDS.map(round => (
          <button
            key={round}
            onClick={() => setSelectedRound(round)}
            className={`snap-start whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
              selectedRound === round
                ? 'bg-ocean text-white scale-105 shadow-md'
                : 'bg-white text-gray-500 hover:text-ocean hover:bg-ocean/5 border border-gray-200'
            }`}
          >
            {round}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-20 text-ocean font-bold text-xl animate-pulse">Carregando jogos...</div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="glass-card p-16 text-center shadow-lg border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4 drop-shadow-md">📅</div>
          <p className="text-gray-500 font-bold text-xl">Nenhum jogo encontrado</p>
        </div>
      )}

      <div className="space-y-12">
        {Object.entries(grouped).map(([round, roundGames]) => (
          <div key={round}>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-display text-3xl text-ocean tracking-wide">
                {round}
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {roundGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  prediction={predictions[game.id]}
                  onPredict={setModalGame}
                  isFavorite={favorites.includes(game.id)}
                  onToggleFavorite={() => toggleFavorite(game.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {modalGame && (
        <PredictionModal
          game={modalGame}
          existing={predictions[modalGame.id]}
          onClose={() => setModalGame(null)}
          onSaved={fetchData}
        />
      )}
    </div>
  )
}
