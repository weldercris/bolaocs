import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useDemo, DEMO_BRACKET_GAMES } from '../contexts/DemoContext'
import { Crown, Trophy, Star } from 'lucide-react'
import Flag from '../components/ui/Flag'

export default function BracketPage() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const { isDemo } = useDemo()

  useEffect(() => {
    fetchGames()
  }, [isDemo])

  async function fetchGames() {
    setLoading(true)
    
    if (isDemo) {
      // Simulate network delay for realism
      setTimeout(() => {
        setGames(DEMO_BRACKET_GAMES)
        setLoading(false)
      }, 500)
      return
    }

    const { data } = await supabase
      .from('games')
      .select('*')
      .gte('match_number', 73)
      .order('match_number')
    setGames(data || [])
    setLoading(false)
  }

  const getGame = (num) => games.find(g => g.match_number === num)

  // Detect champion from final game (match 104)
  const finalGame = getGame(104)
  const champion = finalGame && finalGame.home_score !== null && finalGame.away_score !== null
    ? (finalGame.home_score > finalGame.away_score ? finalGame.home_team : finalGame.away_team)
    : null

  const MatchBox = ({ num, colorClass }) => {
    const game = getGame(num)
    if (!game) return <div className="h-16 w-44 bg-gray-100 rounded-xl border border-gray-200 animate-pulse m-1"></div>

    const isDone = game.home_score !== null && game.away_score !== null
    const isFinal = num === 104
    const isChampionGame = isFinal && isDone
    
    // Determine winner
    const homeWon = isDone && game.home_score > game.away_score
    const awayWon = isDone && game.home_score < game.away_score
    const isChampionTeam = (team) => champion && team === champion

    return (
      <div className={`relative w-48 h-[76px] m-2 rounded-xl border-2 ${isChampionGame ? 'border-[#ffdf00] shadow-[0_0_25px_rgba(255,223,0,0.4)]' : colorClass} flex flex-col bg-white shadow-sm overflow-hidden shrink-0 transition-transform hover:scale-105`}>
        {/* Champion glow effect */}
        {isChampionGame && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffdf00]/10 to-[#009c3b]/10 pointer-events-none" />
        )}
        <div className={`px-2 py-1 text-[10px] font-bold text-center border-b ${isChampionGame ? 'bg-[#ffdf00]/20 text-[#0a1d42] border-[#ffdf00]/30' : 'bg-background-gray text-gray-500 border-gray-100'}`}>
          {isChampionGame ? (
            <span className="flex items-center justify-center gap-1">
              <Crown size={10} className="text-[#ffdf00]" /> M{num} · FINAL
            </span>
          ) : (
            `M${num}`
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center px-3 py-1 relative z-10">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={`truncate pr-1 ${isChampionTeam(game.home_team) ? 'text-[#009c3b] font-black' : 'text-ocean'}`}>
              {isChampionTeam(game.home_team) && '🏆 '}{game.home_team}
            </span>
            {isDone && <span className={`font-display text-sm ${homeWon ? 'text-[#009c3b] font-black' : 'text-ruby'}`}>{game.home_score}</span>}
          </div>
          <div className="flex items-center justify-between text-xs font-bold mt-1">
            <span className={`truncate pr-1 ${isChampionTeam(game.away_team) ? 'text-[#009c3b] font-black' : 'text-ocean'}`}>
              {isChampionTeam(game.away_team) && '🏆 '}{game.away_team}
            </span>
            {isDone && <span className={`font-display text-sm ${awayWon ? 'text-[#009c3b] font-black' : 'text-ruby'}`}>{game.away_score}</span>}
          </div>
        </div>
      </div>
    )
  }

  const Column = ({ matches, color }) => (
    <div className="flex flex-col justify-around h-full">
      {matches.map((m, i) => <MatchBox key={i} num={m} colorClass={color} />)}
    </div>
  )

  if (loading) return <div className="text-center py-20 text-ocean font-bold text-xl animate-pulse">Carregando chaveamento...</div>

  return (
    <div className="max-w-[1500px] mx-auto px-4 pt-6 lg:pt-32 overflow-x-auto pb-8 relative">
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <img src="/brasil.jpg" alt="Brasil Background" className="w-full h-full object-cover opacity-5 saturate-0 mix-blend-multiply" />
      </div>
      
      <div className="flex items-center gap-3 mb-8">
        <h1 className="section-title !mb-0">CHAVEAMENTO</h1>
      </div>

      {/* ══════════ CHAMPION HIGHLIGHT ══════════ */}
      {champion && (
        <div className="relative overflow-hidden rounded-2xl mb-8 border-2 border-[#ffdf00]/30">
          <div className="absolute inset-0 bg-gradient-to-r from-[#009c3b] via-[#006b28] to-[#009c3b]" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-[#ffdf00]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 5}s ${Math.random() * 2}s ease-in-out infinite`,
                  opacity: 0.5 + Math.random() * 0.5,
                }}
              />
            ))}
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 px-6 py-5">
            <div className="flex items-center gap-3">
              <Trophy size={28} className="text-[#ffdf00]" />
              <Flag team={champion} className="w-12 h-8 drop-shadow-lg" />
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Crown size={16} className="text-[#ffdf00]" />
                <span className="text-[#ffdf00] text-xs font-black uppercase tracking-[0.3em]">Campeão do Mundo 2026</span>
              </div>
              <h2 className="font-display text-white text-3xl md:text-4xl tracking-wider" style={{ textShadow: '0 0 20px rgba(255,223,0,0.3)' }}>
                {champion.toUpperCase()}
              </h2>
            </div>
            <div className="flex items-center gap-1 ml-0 md:ml-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-[#ffdf00] fill-[#ffdf00]" style={{ animation: `float ${1.5 + i * 0.3}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="w-max min-w-full min-h-[850px] flex justify-between items-stretch glass-card p-6 border border-white">
        
        {/* LADO ESQUERDO */}
        <div className="flex gap-4 h-full">
          {/* Round of 32 */}
          <Column matches={[74, 77, 73, 75, 83, 84, 81, 82]} color="border-ocean/20" />
          {/* Round of 16 */}
          <Column matches={[89, 90, 93, 94]} color="border-ocean/40" />
          {/* Quartas */}
          <Column matches={[97, 98]} color="border-ocean/60" />
          {/* Semi */}
          <Column matches={[101]} color="border-ocean" />
        </div>

        {/* CENTRO (FINAIS) */}
        <div className="flex flex-col justify-center items-center gap-12 w-72 h-full">
          <div className="text-center w-full">
            <h2 className="font-display text-gold mb-3 text-2xl tracking-widest">FINAL</h2>
            {champion && (
              <div className="flex items-center justify-center gap-1 mb-2 text-[#009c3b]">
                <Crown size={14} />
                <span className="text-xs font-black uppercase tracking-wider">🏆 {champion}</span>
              </div>
            )}
            <div className="flex justify-center">
              <MatchBox num={104} colorClass="border-gold shadow-[0_0_20px_rgba(218,175,55,0.4)]" />
            </div>
          </div>
          <div className="text-center w-full mt-8">
            <h3 className="font-display text-gray-400 mb-3 text-lg tracking-widest">3º LUGAR</h3>
            <div className="flex justify-center">
              <MatchBox num={103} colorClass="border-gray-300" />
            </div>
          </div>
        </div>

        {/* LADO DIREITO */}
        <div className="flex gap-4 h-full flex-row-reverse">
          {/* Round of 32 */}
          <Column matches={[76, 78, 79, 80, 86, 88, 85, 87]} color="border-ruby/20" />
          {/* Round of 16 */}
          <Column matches={[91, 92, 95, 96]} color="border-ruby/40" />
          {/* Quartas */}
          <Column matches={[99, 100]} color="border-ruby/60" />
          {/* Semi */}
          <Column matches={[102]} color="border-ruby" />
        </div>

      </div>
    </div>
  )
}
