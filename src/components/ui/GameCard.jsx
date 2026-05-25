import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MapPin, Clock, Lock, Heart } from 'lucide-react'
import Flag from '@/components/ui/Flag'

export default function GameCard({ game, prediction, onPredict, showPrediction = true, isFavorite, onToggleFavorite }) {
  const matchDate = new Date(game.match_date)
  const isPast = matchDate < new Date()
  const isFinished = game.status === 'finished' || (game.home_score !== null && game.away_score !== null)
  const isLocked = isPast || game.allow_predictions === false

  const statusBadge = isFinished
    ? <span className="badge bg-gray-100 text-gray-500 border border-gray-200">Encerrado</span>
    : isPast
    ? <span className="badge bg-ruby/10 text-ruby border border-ruby/20">🔴 Ao Vivo</span>
    : <span className="badge bg-ocean/10 text-ocean border border-ocean/20">Em breve</span>

  return (
    <div className="glass-card p-6 hover:shadow-lg transition-all duration-300 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          {onToggleFavorite && (
            <button onClick={onToggleFavorite} className="text-gray-300 hover:text-ruby transition-colors mr-1">
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-ruby" : ""} />
            </button>
          )}
          <span className="font-bold text-ruby uppercase tracking-wider">{game.round}</span>
          {game.group_name && <span>· Grupo {game.group_name}</span>}
        </div>
        {statusBadge}
      </div>

      {/* Teams */}
      <div className="flex items-center gap-4">
        {/* Home */}
        <div className="flex-1 flex flex-col items-center gap-3">
          <Flag team={game.home_team} fallback={game.home_flag} className="w-[52px] h-[35px] text-5xl drop-shadow-md" />
          <span className="text-sm font-bold text-ocean text-center leading-tight">{game.home_team}</span>
        </div>

        {/* Score / VS */}
        <div className="flex flex-col items-center gap-2 min-w-[80px]">
          {isFinished ? (
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl text-ocean">{game.home_score}</span>
              <span className="text-gray-400 font-display text-xl">×</span>
              <span className="font-display text-4xl text-ocean">{game.away_score}</span>
            </div>
          ) : (
            <span className="font-display text-2xl text-gray-400 bg-gray-100 px-3 py-1 rounded-full">VS</span>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
            <Clock size={12} />
            {format(matchDate, "dd/MM · HH'h'mm", { locale: ptBR })}
          </div>
        </div>

        {/* Away */}
        <div className="flex-1 flex flex-col items-center gap-3">
          <Flag team={game.away_team} fallback={game.away_flag} className="w-[52px] h-[35px] text-5xl drop-shadow-md" />
          <span className="text-sm font-bold text-ocean text-center leading-tight">{game.away_team}</span>
        </div>
      </div>

      {/* Stadium */}
      {game.stadium && (
        <div className="flex items-center justify-center gap-1 mt-4 text-xs text-gray-500 font-medium">
          <MapPin size={12} />
          {game.stadium}
        </div>
      )}

      {/* Prediction section */}
      {showPrediction && (
        <div className="mt-6 pt-5 border-t border-gray-100">
          {prediction ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 font-medium">Palpite:</span>
                <span className="font-display text-2xl text-ocean bg-background-gray px-3 py-1 rounded-lg border border-gray-100">
                  {prediction.home_score} × {prediction.away_score}
                </span>
              </div>
              {isFinished && (
                <PointsBadge points={prediction.points} />
              )}
            </div>
          ) : isLocked ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium justify-center bg-gray-50 py-2 rounded-xl border border-gray-100">
              <Lock size={14} />
              <span>Palpites encerrados</span>
            </div>
          ) : (
            <button
              onClick={() => onPredict(game)}
              className="w-full btn-gold py-3 text-base shadow-sm"
            >
              🎯 Fazer Palpite
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function PointsBadge({ points }) {
  if (points === null || points === undefined) return null

  const configs = {
    5: { bg: 'bg-gold/20 border-gold/40', text: 'text-gold', label: '⭐ 5 pts' },
    4: { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-600', label: '✅ 4 pts' },
    3: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-600', label: '✅ 3 pts' },
    0: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-500', label: '❌ 0 pts' },
  }

  const c = configs[points] || configs[0]

  return (
    <span className={`badge border ${c.bg} ${c.text} font-bold px-3 py-1.5`}>
      {c.label}
    </span>
  )
}
