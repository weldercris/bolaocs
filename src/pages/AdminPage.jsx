import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Edit2, Check, X, Trash2, Users, Calendar, Shield, Lock, Unlock } from 'lucide-react'
import { format } from 'date-fns'

const ROUNDS = ['Fase de Grupos', 'Oitavas', 'Quartas', 'Semi', 'Final']
const FLAGS = { 'Brasil': '🇧🇷', 'Argentina': '🇦🇷', 'França': '🇫🇷', 'Espanha': '🇪🇸', 'Alemanha': '🇩🇪', 'Portugal': '🇵🇹', 'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Itália': '🇮🇹', 'Holanda': '🇳🇱', 'Bélgica': '🇧🇪', 'Uruguai': '🇺🇾', 'Marrocos': '🇲🇦' }

export default function AdminPage() {
  const [tab, setTab] = useState('games')
  const [games, setGames] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingResult, setEditingResult] = useState(null)
  const [resultForm, setResultForm] = useState({ home_score: '', away_score: '', penalty_home_score: '', penalty_away_score: '' })
  const [newGame, setNewGame] = useState({ home_team: '', away_team: '', home_flag: '', away_flag: '', match_date: '', stadium: '', round: 'Fase de Grupos', group_name: '' })
  const [showNewGame, setShowNewGame] = useState(false)
  const [savingResult, setSavingResult] = useState(false)
  const [savingGame, setSavingGame] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [gamesRes, usersRes] = await Promise.all([
      supabase.from('games').select('*').order('match_date'),
      supabase.from('profiles').select('*').order('created_at'),
    ])
    setGames(gamesRes.data || [])
    setUsers(usersRes.data || [])
    setLoading(false)
  }

  async function saveResult(gameId) {
    setSavingResult(true)
    const payload = { 
      home_score: parseInt(resultForm.home_score), 
      away_score: parseInt(resultForm.away_score), 
      status: 'finished',
      penalty_home_score: resultForm.penalty_home_score !== '' ? parseInt(resultForm.penalty_home_score) : null,
      penalty_away_score: resultForm.penalty_away_score !== '' ? parseInt(resultForm.penalty_away_score) : null
    }
    const { error } = await supabase.from('games')
      .update(payload)
      .eq('id', gameId)
    setSavingResult(false)
    if (!error) {
      setEditingResult(null)
      setFeedback('Resultado salvo e pontos atualizados!')
      setTimeout(() => setFeedback(''), 3000)
      fetchAll()
    }
  }

  async function addGame() {
    setSavingGame(true)
    const { error } = await supabase.from('games').insert({
      ...newGame,
      home_flag: newGame.home_flag || FLAGS[newGame.home_team] || '🏳️',
      away_flag: newGame.away_flag || FLAGS[newGame.away_team] || '🏳️',
    })
    setSavingGame(false)
    if (!error) {
      setShowNewGame(false)
      setNewGame({ home_team: '', away_team: '', home_flag: '', away_flag: '', match_date: '', stadium: '', round: 'Fase de Grupos', group_name: '' })
      setFeedback('Jogo adicionado!')
      setTimeout(() => setFeedback(''), 3000)
      fetchAll()
    }
  }

  async function deleteGame(id) {
    if (!confirm('Excluir este jogo? Todos os palpites serão deletados.')) return
    await supabase.from('games').delete().eq('id', id)
    fetchAll()
  }

  async function togglePredictions(id, current) {
    const newValue = current === false ? true : false;
    await supabase.from('games').update({ allow_predictions: newValue }).eq('id', id)
    fetchAll()
  }

  async function toggleAdmin(userId, current) {
    await supabase.from('profiles').update({ is_admin: !current }).eq('id', userId)
    fetchAll()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-32 pb-32">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="text-ruby" size={28} />
        <h1 className="section-title !mb-0 text-left">Painel Admin</h1>
      </div>

      {feedback && (
        <div className="bg-copa-green/20 border border-copa-green/40 rounded-xl p-3 mb-4 text-green-400 text-sm flex items-center gap-2">
          <Check size={16} /> {feedback}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-hide">
        {[
          { key: 'games', label: '⚽ Jogos', count: games.length },
          { key: 'results', label: '🎯 Resultados' },
          { key: 'users', label: '👥 Usuários', count: users.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
              tab === t.key 
                ? 'bg-ruby text-white scale-105 shadow-md' 
                : 'bg-white text-gray-500 hover:text-ruby hover:bg-ruby/5 border border-gray-200'
            }`}
          >
            {t.label}{t.count !== undefined && ` (${t.count})`}
          </button>
        ))}
      </div>

      {loading && <div className="text-center py-12 text-gray-500">Carregando...</div>}

      {/* GAMES TAB */}
      {!loading && tab === 'games' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowNewGame(!showNewGame)} className="btn-primary">
              <Plus size={16} />
              Novo Jogo
            </button>
          </div>

          {showNewGame && (
            <div className="glass-card p-8 border-ruby/30 mt-6">
              <h3 className="font-display text-xl text-ruby mb-6">Adicionar Jogo</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Time Casa</label>
                  <input value={newGame.home_team} onChange={e => setNewGame({...newGame, home_team: e.target.value})} className="input-field" placeholder="Brasil" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Time Visitante</label>
                  <input value={newGame.away_team} onChange={e => setNewGame({...newGame, away_team: e.target.value})} className="input-field" placeholder="Argentina" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Bandeira Casa (emoji)</label>
                  <input value={newGame.home_flag} onChange={e => setNewGame({...newGame, home_flag: e.target.value})} className="input-field" placeholder="🇧🇷 (auto se deixar vazio)" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Bandeira Visitante (emoji)</label>
                  <input value={newGame.away_flag} onChange={e => setNewGame({...newGame, away_flag: e.target.value})} className="input-field" placeholder="🇦🇷 (auto se deixar vazio)" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Data e Hora</label>
                  <input type="datetime-local" value={newGame.match_date} onChange={e => setNewGame({...newGame, match_date: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Fase</label>
                  <select value={newGame.round} onChange={e => setNewGame({...newGame, round: e.target.value})} className="input-field">
                    {ROUNDS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Grupo (opcional)</label>
                  <input value={newGame.group_name} onChange={e => setNewGame({...newGame, group_name: e.target.value})} className="input-field" placeholder="A, B, C..." />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Estádio (opcional)</label>
                  <input value={newGame.stadium} onChange={e => setNewGame({...newGame, stadium: e.target.value})} className="input-field" placeholder="Nome do estádio" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={addGame} disabled={savingGame || !newGame.home_team || !newGame.away_team || !newGame.match_date} className="btn-primary">
                  <Check size={16} /> {savingGame ? 'Salvando...' : 'Adicionar'}
                </button>
                <button onClick={() => setShowNewGame(false)} className="btn-ghost">Cancelar</button>
              </div>
            </div>
          )}

          <div className="space-y-4 mt-6">
            {games.map(game => (
              <div key={game.id} className="glass-card p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl drop-shadow-sm">{game.home_flag}</span>
                  <span className="text-sm font-bold text-ocean">{game.home_team}</span>
                  <span className="text-gray-400 text-xs font-bold bg-gray-100 px-2 py-1 rounded-full">VS</span>
                  <span className="text-sm font-bold text-ocean">{game.away_team}</span>
                  <span className="text-2xl drop-shadow-sm">{game.away_flag}</span>
                </div>
                <div className="text-xs text-gray-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                  {format(new Date(game.match_date), 'dd/MM HH:mm')}
                </div>
                <div className="text-xs text-gray-500 font-bold uppercase">{game.round}</div>
                {game.home_score !== null && (
                  <span className="badge bg-green-50 text-green-600 border border-green-200">{game.home_score}×{game.away_score}</span>
                )}
                <div className="flex gap-2 ml-4">
                  <button onClick={() => togglePredictions(game.id, game.allow_predictions)} className={`p-2 rounded-lg transition-colors ${game.allow_predictions !== false ? 'text-gray-400 hover:text-ocean hover:bg-ocean/10' : 'text-ruby hover:bg-ruby/10 bg-ruby/5'}`} title={game.allow_predictions !== false ? 'Bloquear palpites' : 'Liberar palpites'}>
                    {game.allow_predictions !== false ? <Unlock size={16} /> : <Lock size={16} />}
                  </button>
                  <button onClick={() => deleteGame(game.id)} className="p-2 rounded-lg text-gray-400 hover:text-ruby hover:bg-ruby/10 transition-colors" title="Excluir Jogo">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESULTS TAB */}
      {!loading && tab === 'results' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-6 font-medium bg-white px-4 py-3 rounded-xl border border-gray-200 inline-block">Lance os resultados oficiais. Os pontos são calculados automaticamente.</p>
          {games.map(game => (
            <div key={game.id} className="glass-card p-5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-3xl drop-shadow-sm">{game.home_flag}</span>
                  <span className="font-bold text-ocean">{game.home_team}</span>
                  <span className="text-gray-400 font-bold bg-gray-100 px-2 py-1 rounded-full text-xs">VS</span>
                  <span className="font-bold text-ocean">{game.away_team}</span>
                  <span className="text-3xl drop-shadow-sm">{game.away_flag}</span>
                </div>

                {editingResult === game.id ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="number" min="0" max="20"
                      value={resultForm.home_score}
                      onChange={e => setResultForm({...resultForm, home_score: e.target.value})}
                      className="w-14 h-12 text-center bg-white border-2 border-ocean/10 focus:border-ocean rounded-xl text-ocean font-display text-xl outline-none shadow-sm transition-colors"
                      placeholder="0"
                    />
                    <span className="text-gray-400 font-display text-xl">×</span>
                    <input
                      type="number" min="0" max="20"
                      value={resultForm.away_score}
                      onChange={e => setResultForm({...resultForm, away_score: e.target.value})}
                      className="w-14 h-12 text-center bg-white border-2 border-ocean/10 focus:border-ocean rounded-xl text-ocean font-display text-xl outline-none shadow-sm transition-colors"
                      placeholder="0"

                    />
                    <button onClick={() => saveResult(game.id)} disabled={savingResult} className="p-3 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-sm transition-colors ml-2">
                      <Check size={18} />
                    </button>
                    <button onClick={() => setEditingResult(null)} className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 shadow-sm transition-colors">
                      <X size={18} />
                    </button>
                    {game.round !== 'Fase de Grupos' && resultForm.home_score !== '' && resultForm.home_score === resultForm.away_score && (
                      <div className="flex items-center gap-2 ml-4 border-l-2 border-gray-100 pl-4">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pênaltis:</span>
                        <input
                          type="number" min="0" max="20"
                          value={resultForm.penalty_home_score}
                          onChange={e => setResultForm({...resultForm, penalty_home_score: e.target.value})}
                          className="w-10 h-10 text-center bg-orange-50 border-2 border-orange-200 focus:border-orange-400 rounded-lg text-orange-700 font-display text-base outline-none transition-colors"
                          placeholder="0"
                        />
                        <span className="text-gray-400 text-sm font-bold">×</span>
                        <input
                          type="number" min="0" max="20"
                          value={resultForm.penalty_away_score}
                          onChange={e => setResultForm({...resultForm, penalty_away_score: e.target.value})}
                          className="w-10 h-10 text-center bg-orange-50 border-2 border-orange-200 focus:border-orange-400 rounded-lg text-orange-700 font-display text-base outline-none transition-colors"
                          placeholder="0"

                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {game.home_score !== null ? (
                      <div className="flex items-center gap-3">
                        <span className="font-display text-3xl text-ocean bg-gray-50 px-4 py-1 rounded-xl border border-gray-100">{game.home_score} × {game.away_score}</span>
                        {game.penalty_home_score !== null && (
                          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
                            Pênaltis: {game.penalty_home_score}x{game.penalty_away_score}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">Sem resultado</span>
                    )}
                    <button
                      onClick={() => {
                        setEditingResult(game.id)
                        setResultForm({ 
                          home_score: game.home_score ?? '', 
                          away_score: game.away_score ?? '',
                          penalty_home_score: game.penalty_home_score ?? '',
                          penalty_away_score: game.penalty_away_score ?? ''
                        })
                      }}
                      className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-ruby hover:text-ruby text-gray-400 shadow-sm transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* USERS TAB */}
      {!loading && tab === 'users' && (
        <div className="space-y-4">
          {users.map(u => (
            <div key={u.id} className="glass-card p-5 flex items-center gap-5 hover:shadow-md transition-shadow">
              <span className="text-4xl bg-white rounded-full p-2 border border-gray-100 shadow-sm">{u.avatar_emoji}</span>
              <div className="flex-1">
                <div className="font-bold text-ocean text-lg">{u.username}</div>
                <div className="text-xs text-gray-500 font-medium">{u.full_name}</div>
              </div>
              {u.is_admin && <span className="badge bg-ruby/10 text-ruby border border-ruby/20">Administrador</span>}
              <button
                onClick={() => toggleAdmin(u.id, u.is_admin)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${
                  u.is_admin
                    ? 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                    : 'bg-ruby text-white hover:brightness-110'
                }`}
              >
                {u.is_admin ? 'Remover Admin' : 'Tornar Admin'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
