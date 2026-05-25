import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function TopScorersPage() {
  const [scorers, setScorers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data } = await supabase
      .from('players')
      .select('*')
      .gt('goals', 0)
      .order('goals', { ascending: false })
    
    setScorers(data || [])
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-32 pb-32">
      <h1 className="section-title">Artilheiros</h1>
      
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="text-center text-gray-500 py-12">Carregando...</div>
        ) : scorers.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Nenhum gol registrado ainda.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {scorers.map((player, index) => (
              <div key={player.id} className="p-6 flex items-center gap-6 hover:bg-white/50 transition-colors">
                <div className="text-2xl font-black text-gray-300 w-8 text-center">{index + 1}º</div>
                <div className="flex-1">
                  <div className="font-bold text-ocean text-lg">{player.name}</div>
                  <div className="text-sm text-gray-500 font-medium">{player.team}</div>
                </div>
                <div className="text-center bg-gold/10 px-4 py-2 rounded-xl border border-gold/20">
                  <div className="font-display text-2xl text-ocean leading-none">{player.goals}</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Gols</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
