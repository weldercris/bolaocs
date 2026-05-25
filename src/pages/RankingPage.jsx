import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Share2 } from 'lucide-react'

export default function RankingPage() {
  const { profile } = useAuth()
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    fetchRanking()
  }, [])

  async function fetchRanking() {
    setLoading(true)
    const { data } = await supabase.from('ranking').select('*').order('position')
    setRanking(data || [])
    setLoading(false)
  }

  async function shareRanking() {
    const top3 = ranking.slice(0, 3)
    const text = `🏆 Ranking do Bolão CS - Copa 2026!\n${top3.map((p, i) => `${['🥇','🥈','🥉'][i]} ${p.username}: ${p.total_points} pts`).join('\n')}\n\nFaça seus palpites em Bolão Copa 2026!`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Bolão Copa 2026', text })
      } else {
        await navigator.clipboard.writeText(text)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch {}
  }

  return (
    <div className="w-full pb-32">
      {/* Hero Header Ranking Premium Light */}
      <section className="relative pt-32 pb-20 bg-white overflow-hidden border-b border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
        <img 
          src="/brasil.jpg" 
          alt="Banner Ranking" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-10 saturate-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-gray via-white/90 to-white/50"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-4 z-10 text-center animate-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-0.5 bg-ruby"></div>
            <h2 className="text-sm text-ruby font-bold uppercase tracking-widest">Os Melhores Palpiteiros</h2>
            <div className="w-12 h-0.5 bg-ruby"></div>
          </div>
          <h1 className="text-ocean text-5xl lg:text-7xl font-black font-display mb-6 tracking-tight">RANKING OFICIAL</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">Confira o ranking atualizado do nosso bolão e veja quem está liderando os palpites da Copa do Mundo 2026.</p>
          
          <button onClick={shareRanking} className="btn-gold mt-8 inline-flex items-center gap-2 shadow-lg">
            <Share2 size={18} />
            {shared ? 'Copiado!' : 'Compartilhar Ranking'}
          </button>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
        <div className="space-y-4">
          {loading && <div className="text-center py-20 text-ocean font-bold text-xl animate-pulse">Carregando ranking...</div>}
          
          {!loading && ranking.length === 0 && (
            <div className="glass-card p-16 text-center border-dashed border-2 border-gray-300">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-gray-500 font-bold text-xl">O ranking aparecerá quando houver palpites computados.</p>
            </div>
          )}

          {ranking.map((player, idx) => {
            const isMe = player.id === profile?.id
            let borderClass = 'border-transparent'
            if (player.position === 1) borderClass = 'border-gold shadow-[0_0_15px_rgba(218,175,55,0.3)]'
            if (player.position === 2) borderClass = 'border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.3)]'
            if (player.position === 3) borderClass = 'border-[#CD7F32] shadow-[0_0_15px_rgba(205,127,50,0.3)]'

            return (
              <div key={player.id} className="relative z-10 flex items-center gap-4 animate-in">
                <div className="relative flex flex-col items-center">
                  <div className={`flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-white text-xl md:text-2xl font-extrabold text-slate-800 z-10 border-[3px] md:border-[4px] shadow-sm ${borderClass}`}>
                    {player.position}º
                  </div>
                </div>
                
                <div className={`card-hover flex-1 flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 gap-4 ${isMe ? 'ring-2 ring-ocean bg-ocean/5' : ''}`}>
                  <div className="flex items-center gap-4">
                    {player.avatar_url ? (
                      <img src={player.avatar_url} alt="Avatar" className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-4 border-white shadow-sm" />
                    ) : (
                      <span className="text-4xl md:text-5xl bg-white rounded-full p-2 border border-gray-100 shadow-sm">{player.avatar_emoji || '⚽'}</span>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl md:text-2xl text-ocean font-bold leading-tight">{player.username}</h3>
                        {isMe && <span className="badge">você</span>}
                      </div>
                      <div className="text-xs text-gray-500 font-medium flex flex-wrap gap-2 mt-1">
                        <span className="bg-white px-2 py-1 rounded border border-gray-100">{player.total_predictions} palpites</span>
                        <span className="bg-white px-2 py-1 rounded border border-gray-100 text-gold">⭐ {player.exact_scores} exatos</span>
                        <span className="bg-white px-2 py-1 rounded border border-gray-100 text-blue-500">✅ {player.correct_results} certos</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm ml-auto sm:ml-0">
                    <div className="text-lg md:text-xl font-bold text-ocean font-display">{player.total_points}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">pts</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
