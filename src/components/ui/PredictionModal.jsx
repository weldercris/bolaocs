import { useState } from 'react'
import { X, Target, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useEffect } from 'react'
import Flag from './Flag'

export default function PredictionModal({ game, existing, onClose, onSaved }) {
  const { user } = useAuth()
  const [homeScore, setHomeScore] = useState(existing?.home_score ?? '')
  const [awayScore, setAwayScore] = useState(existing?.away_score ?? '')
  const [predictedScorers, setPredictedScorers] = useState(existing?.predicted_scorers ?? [])
  const [players, setPlayers] = useState({ home: [], away: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchPlayers() {
      const { data } = await supabase
        .from('players')
        .select('*')
        .in('team', [game.home_team, game.away_team])
      
      const homeP = data?.filter(p => p.team === game.home_team) || []
      const awayP = data?.filter(p => p.team === game.away_team) || []
      setPlayers({ home: homeP, away: awayP })
    }
    fetchPlayers()
  }, [game.home_team, game.away_team])

  async function handleSave() {
    if (homeScore === '' || awayScore === '') {
      setError('Preencha o placar dos dois times')
      return
    }
    setLoading(true)
    setError('')

    const historyEntry = {
      date: new Date().toISOString(),
      home_score: parseInt(homeScore),
      away_score: parseInt(awayScore)
    }

    const newHistory = [...(existing?.history || []), historyEntry]

    const payload = {
      user_id: user.id,
      game_id: game.id,
      home_score: parseInt(homeScore),
      away_score: parseInt(awayScore),
      predicted_scorers: predictedScorers,
      history: newHistory
    }

    const { error: err } = existing
      ? await supabase.from('predictions').update({ home_score: payload.home_score, away_score: payload.away_score, predicted_scorers: payload.predicted_scorers, history: payload.history }).eq('id', existing.id)
      : await supabase.from('predictions').insert(payload)

    setLoading(false)
    if (err) {
      setError('Erro ao salvar. Tente novamente.')
      return
    }
    onSaved()
    onClose()
  }

  const getWinner = () => {
    const h = parseInt(homeScore)
    const a = parseInt(awayScore)
    if (isNaN(h) || isNaN(a)) return null
    if (h > a) return `${game.home_team} vence`
    if (a > h) return `${game.away_team} vence`
    return 'Empate'
  }

  const winner = getWinner()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean/40 backdrop-blur-sm animate-fade-in">
      <div className="glass-card bg-white/95 w-full max-w-sm p-6 animate-slide-up shadow-2xl border-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-ruby" />
            <h2 className="font-display text-2xl text-ocean tracking-wide">Palpite</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-ruby transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="text-center flex-1 flex flex-col items-center">
            <Flag team={game.home_team} fallback={game.home_flag} className="w-[48px] h-[32px] text-4xl mb-2 drop-shadow-sm" />
            <div className="text-xs text-ocean font-bold">{game.home_team}</div>
          </div>
          <div className="text-gray-400 font-display text-xl bg-gray-50 px-3 py-1 rounded-full border border-gray-100">VS</div>
          <div className="text-center flex-1 flex flex-col items-center">
            <Flag team={game.away_team} fallback={game.away_flag} className="w-[48px] h-[32px] text-4xl mb-2 drop-shadow-sm" />
            <div className="text-xs text-ocean font-bold">{game.away_team}</div>
          </div>
        </div>

        {/* Score inputs */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <input
            type="number"
            min="0"
            max="20"
            value={homeScore}
            onChange={e => setHomeScore(e.target.value)}
            className="score-input"
            placeholder="0"
          />
          <span className="font-display text-2xl text-gray-300">×</span>
          <input
            type="number"
            min="0"
            max="20"
            value={awayScore}
            onChange={e => setAwayScore(e.target.value)}
            className="score-input"
            placeholder="0"
          />
        </div>

        {/* Preview */}
        {winner && (
          <div className="text-center text-sm text-ocean bg-ocean/5 border border-ocean/10 font-bold rounded-xl py-3 mb-6 shadow-sm">
            {winner}
          </div>
        )}

        {/* Goal Scorers */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 space-y-3 max-h-48 overflow-y-auto">
          <div className="text-xs font-bold text-ocean flex items-center gap-1.5 mb-2 border-b border-gray-200 pb-2">
            ⚽ Autores dos Gols (Opcional, +2 pts cada)
          </div>
          <p className="text-xs text-gray-500 mb-2">Selecione quem você acha que fará gol (pode selecionar vários):</p>
          <div className="flex flex-col gap-2">
            {[...players.home, ...players.away].map(p => {
              const isSelected = predictedScorers.includes(p.id)
              return (
                <label key={p.id} className={`flex items-center gap-2 text-sm p-2 rounded border cursor-pointer transition-colors ${isSelected ? 'bg-gold/10 border-gold/40 text-ocean' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isSelected}
                    onChange={() => {
                      if (isSelected) setPredictedScorers(predictedScorers.filter(id => id !== p.id))
                      else setPredictedScorers([...predictedScorers, p.id])
                    }}
                  />
                  <span className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-gold border-gold text-white' : 'border-gray-300'}`}>
                    {isSelected && "✓"}
                  </span>
                  <span className="font-bold">{p.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">{p.team}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Scoring guide */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 space-y-2 text-xs text-gray-500 font-medium">
          <div className="flex justify-between items-center"><span className="flex items-center gap-1">⭐ Placar exato</span><span className="text-gold font-bold text-sm">5 pts</span></div>
          <div className="flex justify-between items-center"><span className="flex items-center gap-1">✅ Vencedor/empate</span><span className="text-blue-500 font-bold text-sm">3 pts</span></div>
          <div className="flex justify-between items-center"><span className="flex items-center gap-1">➕ Saldo de gols correto</span><span className="text-green-500 font-bold text-sm">+1 pt</span></div>
        </div>

        {/* Prediction History */}
        {existing?.history && existing.history.length > 0 && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 space-y-3">
            <div className="text-xs font-bold text-ocean flex items-center gap-1.5 mb-3 border-b border-gray-200 pb-2">
              <Clock size={14} className="text-ocean" />
              Histórico de Alterações
            </div>
            {existing.history.map((h, i) => (
              <div key={i} className="flex justify-between text-xs text-gray-500 font-medium items-center">
                <span>{format(new Date(h.date), "dd/MM 'às' HH:mm", { locale: ptBR })}</span>
                <span className="font-display text-ocean text-lg bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">{h.home_score} × {h.away_score}</span>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-ruby font-bold text-sm mb-4 text-center bg-ruby/10 py-2 rounded-lg">{error}</p>}

        <button onClick={handleSave} disabled={loading} className="btn-gold w-full py-4 text-lg">
          {loading ? 'Salvando...' : existing ? '✏️ Atualizar Palpite' : '🎯 Confirmar Palpite'}
        </button>
      </div>
    </div>
  )
}
