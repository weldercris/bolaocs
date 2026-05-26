import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useDemo, DEMO_RANKING } from '../contexts/DemoContext'

const MEDAL = ['🥇', '🥈', '🥉']
const POSITION_COLORS = {
  1: { border: 'border-gold shadow-[0_0_20px_rgba(218,175,55,0.35)]', bg: 'bg-gold/5', badge: 'bg-gold/15 text-amber-700' },
  2: { border: 'border-slate-300 shadow-[0_0_20px_rgba(203,213,225,0.35)]', bg: 'bg-slate-50', badge: 'bg-slate-100 text-slate-600' },
  3: { border: 'border-[#CD7F32] shadow-[0_0_20px_rgba(205,127,50,0.3)]', bg: 'bg-orange-50/60', badge: 'bg-orange-100/70 text-orange-700' },
}

export default function RankingPage() {
  const { profile } = useAuth()
  const { isDemo } = useDemo()
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemo) {
      setRanking(DEMO_RANKING)
      setLoading(false)
      return
    }
    fetchRanking()
  }, [isDemo])

  async function fetchRanking() {
    setLoading(true)
    const { data } = await supabase.from('ranking').select('*').order('position')
    setRanking(data || [])
    setLoading(false)
  }

  return (
    <div className="w-full pb-32">

      {/* ── Hero Header ── */}
      <section className="relative pt-6 lg:pt-28 pb-28 overflow-hidden border-b border-gray-100">
        <img
          src="/post.webp"
          alt="Banner Ranking"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-20 saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/75 to-background-gray" />
        <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-gold/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Texto */}
            <div className="text-center md:text-left animate-in">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <div className="w-10 h-[2px] bg-ruby" />
                <span className="text-ruby font-bold uppercase tracking-[0.2em] text-xs">Os Melhores Palpiteiros</span>
                <div className="w-10 h-[2px] bg-ruby" />
              </div>
              <h1 className="text-ocean text-5xl lg:text-7xl font-black font-display mb-4 tracking-tight leading-none">
                RANKING<br />OFICIAL
              </h1>
              <p className="text-gray-500 text-base max-w-md font-medium leading-relaxed">
                Confira o ranking atualizado do nosso bolão. Quem lidera os palpites da Copa 2026?
              </p>
            </div>

            {/* Troféu */}
            <div className="hidden md:flex flex-shrink-0 items-end justify-center relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-gold/30 rounded-full blur-xl pointer-events-none" />
              <img
                src="/TROFEU.png"
                alt="Troféu"
                className="h-72 w-auto object-contain drop-shadow-2xl opacity-90 float -translate-y-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Lista do Ranking ── */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
        <div className="space-y-3">

          {loading && (
            <div className="text-center py-20 text-ocean font-bold text-xl animate-pulse">
              Carregando ranking...
            </div>
          )}

          {!loading && ranking.length === 0 && (
            <div className="glass-card p-16 text-center border-dashed border-2 border-gray-300">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-gray-500 font-bold text-xl">
                O ranking aparecerá quando houver palpites computados.
              </p>
            </div>
          )}

          {ranking.map((player) => {
            const isMe = player.id === profile?.id
            const style = POSITION_COLORS[player.position] || {
              border: 'border-transparent',
              bg: '',
              badge: 'bg-gray-100 text-gray-500',
            }
            const isTop3 = player.position <= 3

            return (
              <div
                key={player.id}
                className={`relative flex items-center gap-3 md:gap-4 animate-in rounded-2xl border-[2.5px] ${style.border} ${style.bg} ${isMe ? 'ring-2 ring-ocean ring-offset-1' : ''} transition-all duration-300 hover:scale-[1.01] shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm`}
              >
                {/* Posição */}
                <div className="flex flex-col items-center justify-center pl-4 py-4 min-w-[52px]">
                  {isTop3 ? (
                    <span className="text-3xl leading-none">{MEDAL[player.position - 1]}</span>
                  ) : (
                    <span className="text-xl font-extrabold text-slate-400">{player.position}º</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="py-4">
                  {player.avatar_url ? (
                    <img
                      src={player.avatar_url}
                      alt="Avatar"
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-4 border-white shadow"
                    />
                  ) : (
                    <span className="text-3xl md:text-4xl bg-white rounded-full p-2 border border-gray-100 shadow-sm block">
                      ⚽
                    </span>
                  )}
                </div>

                {/* Nome + Estatísticas */}
                <div className="flex-1 py-4 pr-2">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base md:text-lg text-ocean font-bold leading-tight">{player.full_name || player.username}</h3>
                    {isMe && <span className="badge text-[10px]">você</span>}
                  </div>

                  {/* Stats agrupadas */}
                  <div className="flex flex-wrap gap-1.5">
                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1">
                      <span className="text-gray-400 text-xs">🎯</span>
                      <span className="text-xs font-semibold text-gray-600">{player.total_predictions}</span>
                      <span className="text-[10px] text-gray-400 font-medium">palpites</span>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1">
                      <span className="text-xs">⭐</span>
                      <span className="text-xs font-semibold text-amber-600">{player.exact_scores}</span>
                      <span className="text-[10px] text-amber-400 font-medium">exatos</span>
                    </div>
                    <div className="flex items-center gap-1 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1">
                      <span className="text-xs">✅</span>
                      <span className="text-xs font-semibold text-blue-600">{player.correct_results}</span>
                      <span className="text-[10px] text-blue-400 font-medium">certos</span>
                    </div>
                  </div>
                </div>

                {/* Pontuação */}
                <div className="flex flex-col items-center justify-center px-4 py-4 min-w-[64px]">
                  <div className={`text-xl md:text-2xl font-black font-display ${isTop3 ? 'text-ocean' : 'text-slate-500'}`}>
                    {player.total_points}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">pts</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
