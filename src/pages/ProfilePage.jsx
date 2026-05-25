import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { AVATAR_EMOJIS } from '../lib/scoring'
import { Save, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { profile, updateProfile, signOut } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: profile?.full_name || '', avatar_emoji: profile?.avatar_emoji || '⚽' })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setLoading(true)
    await updateProfile(form)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="section-title mb-6">MEU PERFIL</h1>

      <div className="card p-6 space-y-6">
        {/* Current avatar */}
        <div className="text-center">
          <div className="text-7xl mb-2">{form.avatar_emoji}</div>
          <div className="font-display text-2xl text-white">{profile?.username}</div>
          <div className="text-sm text-gray-500">{profile?.is_admin && <span className="badge bg-copa-gold/20 text-copa-gold">Admin</span>}</div>
        </div>

        {/* Avatar picker */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Escolha seu avatar</label>
          <div className="flex flex-wrap gap-2">
            {AVATAR_EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => setForm({ ...form, avatar_emoji: emoji })}
                className={`w-10 h-10 rounded-lg text-xl transition-all ${
                  form.avatar_emoji === emoji
                    ? 'bg-copa-gold/30 border-2 border-copa-gold scale-110'
                    : 'bg-copa-dark-3 border-2 border-transparent hover:border-copa-dark-3'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm text-gray-400 mb-1.5 block">Nome completo</label>
          <input
            type="text"
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
            className="input-field"
            placeholder="Seu nome"
          />
        </div>

        {/* Username (readonly) */}
        <div>
          <label className="text-sm text-gray-400 mb-1.5 block">Usuário (não editável)</label>
          <input value={profile?.username} disabled className="input-field opacity-50 cursor-not-allowed" />
        </div>

        <button onClick={handleSave} disabled={loading} className="btn-primary w-full">
          <Save size={16} />
          {saved ? '✅ Salvo!' : loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>

        <button onClick={handleLogout} className="w-full btn-ghost text-red-400 hover:text-red-300 hover:border-red-400/30 flex items-center justify-center gap-2">
          <LogOut size={16} />
          Sair da conta
        </button>
      </div>
    </div>
  )
}
