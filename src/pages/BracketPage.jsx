import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function BracketPage() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGames()
  }, [])

  async function fetchGames() {
    setLoading(true)
    const { data } = await supabase
      .from('games')
      .select('*')
      .gte('match_number', 73)
      .order('match_number')
    setGames(data || [])
    setLoading(false)
  }

  const getGame = (num) => games.find(g => g.match_number === num)

  const MatchBox = ({ num, colorClass }) => {
    const game = getGame(num)
    if (!game) return <div className="h-16 w-44 bg-gray-100 rounded-xl border border-gray-200 animate-pulse m-1"></div>

    const isDone = game.home_score !== null && game.away_score !== null

    return (
      <div className={`relative w-48 h-[76px] m-2 rounded-xl border-2 ${colorClass} flex flex-col bg-white shadow-sm overflow-hidden shrink-0 transition-transform hover:scale-105`}>
        <div className="bg-background-gray px-2 py-1 text-[10px] font-bold text-center text-gray-500 border-b border-gray-100">
          M{num}
        </div>
        <div className="flex-1 flex flex-col justify-center px-3 py-1">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="truncate pr-1 text-ocean">{game.home_team}</span>
            {isDone && <span className="text-ruby font-display text-sm">{game.home_score}</span>}
          </div>
          <div className="flex items-center justify-between text-xs font-bold mt-1">
            <span className="truncate pr-1 text-ocean">{game.away_team}</span>
            {isDone && <span className="text-ruby font-display text-sm">{game.away_score}</span>}
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
    <div className="max-w-[1500px] mx-auto px-4 pt-32 overflow-x-auto pb-32 relative">
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <img src="/brasil.jpg" alt="Brasil Background" className="w-full h-full object-cover opacity-5 saturate-0 mix-blend-multiply" />
      </div>
      
      <div className="flex items-center gap-3 mb-8">
        <h1 className="section-title !mb-0">CHAVEAMENTO</h1>
      </div>

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
