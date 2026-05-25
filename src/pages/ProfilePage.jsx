import { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Save, LogOut, UploadCloud } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { profile, updateProfile, signOut } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: profile?.full_name || '', avatarFile: null })
  const [preview, setPreview] = useState(profile?.avatar_url || null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, avatarFile: file })
      setPreview(URL.createObjectURL(file))
    }
  }

  async function handleSave() {
    setLoading(true)
    
    let updates = { full_name: form.full_name }

    if (form.avatarFile) {
      const fileExt = form.avatarFile.name.split('.').pop()
      const fileName = `${profile.id}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, form.avatarFile, { upsert: true })

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)
        updates.avatar_url = publicUrl
      }
    }

    await updateProfile(updates)
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
        {/* Current avatar & picker */}
        <div className="text-center flex flex-col items-center">
          <div 
            onClick={() => fileInputRef.current.click()}
            className="relative w-32 h-32 mb-4 rounded-full border-4 border-white shadow-md hover:border-ocean cursor-pointer flex items-center justify-center overflow-hidden bg-background-gray group transition-colors mx-auto"
          >
            {preview ? (
              <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl text-center">⚽</span>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <UploadCloud className="text-white" size={32} />
            </div>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          <p className="text-xs text-gray-400 mb-2">Toque para alterar a foto</p>

          <div className="font-display text-2xl text-ocean">{profile?.username}</div>
          <div className="text-sm text-gray-500">{profile?.is_admin && <span className="badge bg-gold/20 text-gold border border-gold/40">Admin</span>}</div>
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
