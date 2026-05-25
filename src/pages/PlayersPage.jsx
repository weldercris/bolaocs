import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function PlayersPage() {
  const { user } = useAuth()
  const [players, setPlayers] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterTeam, setFilterTeam] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data: pData } = await supabase.from('players').select('*').order('name')
    const { data: fData } = await supabase
      .from('favorites')
      .select('item_id')
      .eq('user_id', user.id)
      .eq('item_type', 'player')

    setPlayers(pData || [])
    setFavorites(fData?.map(f => f.item_id) || [])
    setLoading(false)
  }

  async function toggleFavorite(playerId) {
    const isFav = favorites.includes(playerId)
    if (isFav) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', 'player')
        .eq('item_id', playerId)
      setFavorites(favorites.filter(id => id !== playerId))
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, item_type: 'player', item_id: playerId })
      setFavorites([...favorites, playerId])
    }
  }

  const teams = [...new Set(players.map(p => p.team))]
  const filteredPlayers = filterTeam ? players.filter(p => p.team === filterTeam) : players

  return (
    <div className="max-w-6xl mx-auto px-4 pt-32 pb-32">
      <h1 className="section-title">Jogadores por Seleção</h1>
      
      <div className="mb-8 flex flex-wrap gap-2">
        <button 
          onClick={() => setFilterTeam('')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${!filterTeam ? 'bg-ocean text-white' : 'bg-white text-ocean hover:bg-gray-100'}`}
        >
          Todos
        </button>
        {teams.map(team => (
          <button
            key={team}
            onClick={() => setFilterTeam(team)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${filterTeam === team ? 'bg-ocean text-white' : 'bg-white text-ocean hover:bg-gray-100'}`}
          >
            {team}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Carregando...</div>
      ) : filteredPlayers.length === 0 ? (
        <div className="text-center text-gray-500 py-12 glass-card">Nenhum jogador encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlayers.map(player => (
            <div key={player.id} className="glass-card p-6 flex flex-col items-center relative animate-in">
              <button 
                onClick={() => toggleFavorite(player.id)}
                className="absolute top-4 right-4 text-gray-300 hover:text-ruby transition-colors"
              >
                <Heart size={24} fill={favorites.includes(player.id) ? "currentColor" : "none"} className={favorites.includes(player.id) ? "text-ruby" : ""} />
              </button>
              <div className="w-20 h-20 bg-ocean/10 rounded-full flex items-center justify-center mb-4 border-2 border-ocean/20 text-ocean font-black text-2xl font-display">
                {player.number || '?'}
              </div>
              <h3 className="text-lg font-bold text-ocean text-center">{player.name}</h3>
              <p className="text-sm text-gray-500 font-medium">{player.team}</p>
              <p className="text-xs text-gray-400 mt-2">{player.position}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
