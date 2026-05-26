import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useDemo, DEMO_STATS, DEMO_GAMES, DEMO_RANKING, DEMO_CHAMPION } from '../contexts/DemoContext'
import { supabase } from '../lib/supabase'
import { Trophy, Target, Calendar, ChevronRight, Crown, Star } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Countdown } from '../components/ui/Countdown'
import Flag from '../components/ui/Flag'

export default function HomePage() {
  const { profile } = useAuth()
  const { isDemo } = useDemo()
  const [stats, setStats] = useState({ total_points: 0, total_predictions: 0, exact_scores: 0, position: '-' })
  const [nextGames, setNextGames] = useState([])
  const [recentGames, setRecentGames] = useState([])
  const [topRanking, setTopRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [champion, setChampion] = useState(null)

  useEffect(() => {
    if (isDemo) {
      // Dados fictícios — nenhuma query ao Supabase
      setStats(DEMO_STATS)
      // No demo a copa já acabou, não há próximos jogos
      const now = new Date()
      const futureGames = DEMO_GAMES.filter(g => new Date(g.match_date) > now)
      setNextGames(futureGames.slice(0, 3))
      // Jogos recentes (últimos finalizados)
      const pastGames = DEMO_GAMES.filter(g => g.home_score !== null).sort((a, b) => new Date(b.match_date) - new Date(a.match_date))
      setRecentGames(pastGames.slice(0, 3))
      setTopRanking(DEMO_RANKING.slice(0, 3))
      setChampion(DEMO_CHAMPION)
      setLoading(false)
      return
    }
    fetchData()
  }, [profile, isDemo])

  async function fetchData() {
    if (!profile) return
    setLoading(true)

    const [rankData, gamesData, predData, finalData] = await Promise.all([
      supabase.from('ranking').select('*').order('position').limit(3),
      supabase.from('games').select('*').order('match_date'),
      supabase.from('ranking').select('*').eq('id', profile.id).single(),
      supabase.from('games').select('*').eq('round', 'Final').limit(1).single(),
    ])

    setTopRanking(rankData.data || [])

    const allGames = gamesData.data || []
    const now = new Date()
    const futureGames = allGames.filter(g => new Date(g.match_date) > now)
    setNextGames(futureGames.slice(0, 3))

    // Jogos recentes
    const pastGames = allGames.filter(g => g.home_score !== null).sort((a, b) => new Date(b.match_date) - new Date(a.match_date))
    setRecentGames(pastGames.slice(0, 3))

    if (predData.data) setStats(predData.data)

    // Check if there's a champion (final game with scores)
    if (finalData.data && finalData.data.home_score !== null && finalData.data.away_score !== null) {
      const final = finalData.data
      const isHomeWinner = final.home_score > final.away_score
      setChampion({
        team: isHomeWinner ? final.home_team : final.away_team,
        flag: isHomeWinner ? (final.home_flag || '🏆') : (final.away_flag || '🏆'),
        finalScore: `${final.home_score} × ${final.away_score}`,
        opponent: isHomeWinner ? final.away_team : final.home_team,
        opponentFlag: isHomeWinner ? (final.away_flag || '🏳️') : (final.home_flag || '🏳️'),
      })
    }

    setLoading(false)
  }


  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4 lg:pt-32 pb-8 space-y-8">
      {/* Countdown Cup 2026 */}
      <Countdown targetDate="2026-06-11T00:00:00Z" champion={champion} />

      {/* ══════════ CHAMPION BANNER ══════════ */}
      {champion && (
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-premium border-2 border-[#ffdf00]/30 mb-8">
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#009c3b] via-[#006b28] to-[#004d1a]" />
          <div className="absolute inset-0 bg-[url('/stadium.jpg')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#009c3b]/90 via-transparent to-[#ffdf00]/20" />

          {/* Golden particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: 'rgba(255,223,0,0.6)',
                  animation: `float ${4 + Math.random() * 8}s ${Math.random() * 3}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 px-8 md:px-12 py-10">
            {/* Trophy + Flag */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-[#ffdf00]/30 rounded-full blur-[30px] scale-150" />
                <img src="/TROFEU.png" alt="Troféu" className="w-28 md:w-36 object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(255,223,0,0.5)] float" />
              </div>
              <Flag team={champion.team} fallback={champion.flag} className="w-20 h-14 md:w-24 md:h-16 drop-shadow-xl" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Crown size={20} className="text-[#ffdf00]" />
                <span className="text-[#ffdf00] text-xs font-bold uppercase tracking-[0.3em]">Campeão do Mundo 2026</span>
              </div>
              <h2 className="font-display text-white text-5xl md:text-6xl lg:text-7xl tracking-wider mb-3 drop-shadow-lg" style={{ textShadow: '0 0 40px rgba(255,223,0,0.3)' }}>
                {champion.team.toUpperCase()}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-2 border border-white/20">
                  <span className="text-white/60 text-xs font-medium block">Final</span>
                  <span className="text-white font-display text-2xl">{champion.finalScore}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/60 text-sm font-medium">vs</span>
                  <Flag team={champion.opponent} fallback={champion.opponentFlag} className="w-8 h-6" />
                  <span className="text-white/80 font-bold">{champion.opponent}</span>
                </div>
              </div>
            </div>

            {/* Stars decoration */}
            <div className="hidden lg:flex flex-col items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} className="text-[#ffdf00] fill-[#ffdf00] drop-shadow-lg" style={{ animation: `float ${2 + i * 0.5}s ease-in-out infinite`, opacity: 1 - i * 0.12 }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner Premium */}
      <div className="relative overflow-hidden rounded-[2.5rem] h-[30rem] md:h-[36rem] flex items-center shadow-premium border border-gray-100 mb-16">
        {/* Foto de fundo: estádio */}
        <img src="/post.webp" alt="Estádio" className="absolute inset-0 w-full h-full object-cover opacity-20 saturate-50" />
        {/* Toque de cor do Brasil */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/80 to-[#009c3b]/10" />
        <div className="absolute top-[-20%] left-[-10%] w-[30rem] h-[30rem] bg-gold/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col w-full md:w-3/5 px-8 md:px-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-[2px] bg-ruby" />
            <h2 className="text-sm text-ruby font-bold uppercase tracking-[0.2em]">{greeting},</h2>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md" />
            ) : (
              <span className="text-5xl bg-white rounded-full p-2 border border-gray-100 shadow-sm">⚽</span>
            )}
            <h1 className="text-ocean text-4xl md:text-5xl lg:text-6xl font-black font-display leading-[1.1]">
              {(profile?.full_name || profile?.username || '').toUpperCase()}
            </h1>
          </div>
          <p className="text-gray-500 text-lg mb-8 max-w-md leading-relaxed">
            {champion
              ? 'A Copa acabou! Confira seu desempenho final no ranking e reviva os melhores momentos.'
              : 'O palco é seu! Faça seus palpites para os próximos jogos e mostre quem manda no ranking da Copa 2026.'
            }
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/palpites" className="btn-gold px-8 py-4 text-lg shadow-lg">
              <Target size={20} /> {champion ? 'Ver Palpites' : 'Fazer Palpites'}
            </Link>
            <Link to="/ranking" className="btn-ghost px-8 py-4 text-lg bg-white/80 backdrop-blur-md">
              <Trophy size={20} /> Ver Ranking
            </Link>
          </div>
        </div>

        {/* Troféu decorativo */}
        <div className="absolute right-0 bottom-0 h-full w-2/5 hidden md:flex items-end justify-end pointer-events-none pr-6">
          <img 
            src="/TROFEU.png" 
            alt="Troféu Copa" 
            className="h-[90%] object-contain object-bottom translate-y-2 translate-x-4 drop-shadow-2xl opacity-80 float"
          />
        </div>


      </div>

      {/* Meus Stats (Cards Redondos Estilo Premium) */}
      <div className="relative z-20 -mt-16 mx-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Minha Posição', value: stats.position === 1 ? '🥇' : stats.position === 2 ? '🥈' : stats.position === 3 ? '🥉' : `#${stats.position}`, sub: 'no ranking' },
            { label: 'Total de Pontos', value: stats.total_points || 0, sub: 'acumulados' },
            { label: 'Palpites Feitos', value: stats.total_predictions || 0, sub: 'jogos' },
            { label: 'Placares Exatos', value: stats.exact_scores || 0, sub: '⭐ 5 pts' },
          ].map((s, i) => (
            <div key={i} className="glass-card p-6 text-center animate-in hover:scale-105 transition-transform duration-300">
              <div className="font-display text-4xl md:text-5xl text-ocean mb-1 drop-shadow-sm">{s.value}</div>
              <div className="text-sm md:text-base font-bold text-ocean">{s.label}</div>
              <div className="text-xs text-gray-500 font-medium">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-12">
        {/* Next Games or Recent Games */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title !mb-0 text-left">{nextGames.length > 0 ? 'Próximos Jogos' : 'Últimos Resultados'}</h2>
            <Link to="/jogos" className="text-sm font-bold text-ocean hover:text-ruby flex items-center gap-1 transition-colors">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {nextGames.length === 0 && recentGames.length === 0 && !loading && (
              <div className="card p-8 text-center text-gray-500 font-medium">Nenhum jogo agendado</div>
            )}
            {(nextGames.length > 0 ? nextGames : recentGames).map(game => (
              <div key={game.id} className="card-hover p-5 flex items-center gap-4 animate-in">
                <div className="flex items-center gap-4 flex-1">
                  <Flag team={game.home_team} fallback={game.home_flag} className="w-[48px] h-[32px] text-4xl drop-shadow-md" />
                  <div className="text-sm text-gray-400 text-center font-display flex-1">
                    {game.home_score !== null ? (
                      <span className="bg-ocean/10 px-4 py-1.5 rounded-full text-base font-bold text-ocean border border-ocean/20">
                        {game.home_score} × {game.away_score}
                      </span>
                    ) : (
                      <span className="bg-background-gray px-3 py-1 rounded-full text-xs font-bold border border-gray-200">VS</span>
                    )}
                  </div>
                  <Flag team={game.away_team} fallback={game.away_flag} className="w-[48px] h-[32px] text-4xl drop-shadow-md" />
                  <div className="ml-4 flex-1 text-right">
                    <div className="text-base font-bold text-ocean">{game.home_team} × {game.away_team}</div>
                    <div className="text-xs text-gray-500 flex items-center justify-end gap-1 font-medium mt-1">
                      <Calendar size={12} />
                      {format(new Date(game.match_date), "dd/MM · HH'h'mm", { locale: ptBR })}
                    </div>
                    {game.round === 'Final' && game.home_score !== null && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#ffdf00] bg-[#009c3b] px-2 py-0.5 rounded-full mt-1">
                        <Crown size={10} /> FINAL
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Ranking */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title !mb-0 text-left">Liderança</h2>
            <Link to="/ranking" className="text-sm font-bold text-ocean hover:text-ruby flex items-center gap-1 transition-colors">
              Ranking completo <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {topRanking.length === 0 && !loading && (
              <div className="card p-8 text-center text-gray-500 font-medium">Sem dados ainda</div>
            )}
            {topRanking.map((player, i) => {
              const borderColors = ['border-gold', 'border-slate-300', 'border-[#CD7F32]']
              return (
                <div key={player.id} className="relative z-10 flex items-center gap-4 animate-in">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-extrabold text-slate-800 z-10 border-[3px] shadow-sm ${borderColors[i]}`}>
                    {i + 1}º
                  </div>
                  <div className="card-hover flex-1 p-5 flex items-center gap-4">
                    {player.avatar_url ? (
                      <img src={player.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                      <span className="text-3xl bg-background-gray rounded-full p-2 border border-gray-100">⚽</span>
                    )}
                    <div className="flex-1">
                      <div className="font-bold text-ocean text-lg">{player.full_name || player.username}</div>
                      <div className="text-xs text-gray-500 font-medium">{player.total_predictions} palpites</div>
                    </div>
                    <div className="text-right bg-ocean/5 px-4 py-2 rounded-xl">
                      <div className="font-display text-2xl text-ocean leading-none">{player.total_points}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">pontos</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Regras (Glass) */}
      <div className="glass-card p-8 mt-12 bg-white/60">
        <h2 className="section-title mb-6">Regras de Pontuação</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { emoji: '⭐', pts: '5 pts', rule: 'Placar Exato', desc: 'Acertou o resultado exato da partida!' },
            { emoji: '✅', pts: '3 pts', rule: 'Vencedor / Empate', desc: 'Acertou quem venceu ou o empate.' },
            { emoji: '➕', pts: '+1 pt', rule: 'Saldo de Gols', desc: 'Acertou a diferença de gols (Bônus).' },
          ].map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center animate-in shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3 drop-shadow-sm">{r.emoji}</div>
              <div className="font-display text-3xl text-ruby mb-1">{r.pts}</div>
              <div className="font-bold text-ocean text-base">{r.rule}</div>
              <div className="text-sm text-gray-500 mt-2 font-medium">{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
