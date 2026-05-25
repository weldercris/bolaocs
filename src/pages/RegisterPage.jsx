import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Eye, EyeOff, UploadCloud, User } from 'lucide-react'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', username: '', fullName: '', avatarFile: null })
  const [preview, setPreview] = useState(null)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, avatarFile: file })
      setPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password.length < 6) { setError('Senha precisa ter pelo menos 6 caracteres'); return }
    if (form.username.length < 3) { setError('Nome de usuário precisa ter pelo menos 3 caracteres'); return }
    setLoading(true)
    setError('')

    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', form.username)
      .maybeSingle()

    if (existingUser) {
      setError('Nome de usuário já está em uso')
      setLoading(false)
      return
    }

    const { error } = await signUp(form)
    setLoading(false)
    if (error) {
      setError(error.message.includes('already') ? 'Email já cadastrado' : 'Erro ao criar conta')
      return
    }
    setSuccess(true)
    setTimeout(() => navigate('/login'), 3000)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white font-mona flex items-center justify-center p-4">
        <div className="glass-card bg-white p-8 max-w-md w-full text-center shadow-xl">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="font-display text-3xl text-ocean mb-4">CONTA CRIADA!</h2>
          <p className="text-gray-500 font-medium">Você já pode fazer login e começar a palpitar. Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-mona flex items-center justify-center overflow-hidden py-12">
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-ocean/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Left Side */}
        <div className="lg:w-1/2 flex flex-col justify-center animate-in hidden lg:flex relative">
          <div className="absolute inset-0 bg-cover bg-center opacity-10 rounded-3xl" style={{ backgroundImage: "url('/post.webp')" }}></div>
          <div className="relative z-10 py-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-0.5 bg-ruby"></div>
              <span className="text-ruby font-semibold uppercase tracking-widest text-sm">Aposte com seus amigos</span>
              <div className="w-12 h-0.5 bg-ruby"></div>
            </div>
            <h1 className="text-ocean text-6xl md:text-8xl font-black font-display leading-[0.9] mb-4">
              CRIAR CONTA
            </h1>
            <p className="text-gray-500 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
              Junte-se à maior competição de palpites da Copa do Mundo 2026. É rápido, fácil e divertido!
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:w-6/12 w-full animate-in" style={{ animationDelay: '100ms' }}>
          <div className="glass-card bg-white/90 p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden">
            <img src="/brazil-thumb.png" alt="Troféu Fundo" className="absolute -right-16 -bottom-16 w-64 h-64 object-contain opacity-5 pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="font-display text-3xl text-ocean mb-2 tracking-wide lg:hidden">Criar Conta</h3>
              <p className="text-gray-500 mb-6 lg:hidden">Bolão Copa 2026</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center justify-center mb-6">
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 hover:border-ocean cursor-pointer flex items-center justify-center overflow-hidden bg-background-gray group transition-colors"
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 group-hover:text-ocean transition-colors">
                        <UploadCloud size={24} className="mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Foto</span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                  />
                  <p className="text-xs text-gray-400 mt-2">Toque para adicionar uma foto (opcional)</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 mb-2 block font-medium">Usuário</label>
                    <input type="text" required value={form.username} onChange={e => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, '') })} className="w-full bg-background-gray border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/10 text-ocean placeholder-gray-400 rounded-xl px-4 py-3 outline-none transition-all duration-200" placeholder="seunome" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-2 block font-medium">Nome completo</label>
                    <input type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="w-full bg-background-gray border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/10 text-ocean placeholder-gray-400 rounded-xl px-4 py-3 outline-none transition-all duration-200" placeholder="Seu nome" />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-2 block font-medium">Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-background-gray border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/10 text-ocean placeholder-gray-400 rounded-xl px-4 py-3 outline-none transition-all duration-200" placeholder="seu@email.com" />
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-2 block font-medium">Senha</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full bg-background-gray border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/10 text-ocean placeholder-gray-400 rounded-xl px-4 py-3 outline-none transition-all duration-200 pr-12" placeholder="Mínimo 6 caracteres" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ocean transition-colors">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-500 text-sm flex items-center justify-center font-medium">{error}</div>}

                <button type="submit" disabled={loading} className="btn-gold w-full py-4 text-lg mt-4 shadow-gold/20 shadow-lg">
                  {loading ? 'Criando Conta...' : 'Participar Agora'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-500">
                  Já tem conta? <Link to="/login" className="text-ocean font-bold hover:text-ruby transition-colors">Entrar</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
