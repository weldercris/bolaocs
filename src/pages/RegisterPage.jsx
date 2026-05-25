import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Eye, EyeOff, UploadCloud, ArrowRight, CheckCircle } from 'lucide-react'

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

    const { data: existingUser } = await supabase
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
      <div className="min-h-screen flex flex-col lg:flex-row font-body overflow-hidden">
        <div className="hidden lg:block lg:w-[58%] relative overflow-hidden">
          <img src="/brasil.jpg" alt="Copa 2026" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#009c3b]/80 via-[#009c3b]/50 to-transparent" />
        </div>
        <div className="flex-1 flex items-center justify-center bg-[#f8f8f8] px-6 py-16">
          <div className="text-center animate-in">
            <div className="w-20 h-20 rounded-full bg-[#009c3b] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#009c3b]/30">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl text-ocean mb-3 tracking-wide">CONTA CRIADA!</h2>
            <p className="text-gray-500 font-medium text-lg">Bem-vindo ao Bolão Copa 2026 🎉</p>
            <p className="text-gray-400 text-sm mt-2">Redirecionando para o login...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-body overflow-hidden">

      {/* ── MOBILE: Banner hero no topo ── */}
      <div className="lg:hidden relative h-44 flex-shrink-0 overflow-hidden">
        <img
          src="/brasil.jpg"
          alt="Torcida Copa 2026"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1d42]/60 via-[#0a1d42]/40 to-[#0a1d42]/80" />
        <div className="relative z-10 flex flex-col justify-end h-full px-6 pb-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-1.5">
              <img src="/cs.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="text-white font-display text-base tracking-wider leading-none">BOLÃO</div>
              <div className="text-[#ffdf00] font-display text-base tracking-wider leading-none">COPA 2026</div>
            </div>
          </div>
          <h1 className="font-display text-white text-3xl leading-none drop-shadow-lg">
            JUNTE-SE AO MAIOR BOLÃO
          </h1>
        </div>
        <div className="absolute bottom-0 right-4 pointer-events-none">
          <img src="/TROFEU.png" alt="Troféu" className="w-20 object-contain drop-shadow-2xl opacity-60" />
        </div>
      </div>

      {/* ── DESKTOP: Foto lateral esquerda ── */}
      <div className="hidden lg:block lg:w-[58%] relative overflow-hidden">
        <img
          src="/brasil.jpg"
          alt="Torcida Copa 2026"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#f8f8f8]/20" />
      </div>

      {/* ── FORMULÁRIO (mobile + desktop) ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f8f8f8] px-5 md:px-12 py-8 lg:py-0 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-[#ffdf00]/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[30rem] h-[30rem] bg-[#0a1d42]/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[420px] relative z-10">
          <div className="mb-5">
            <h2 className="font-display text-ocean text-3xl lg:text-4xl tracking-wide mb-1">Criar Conta</h2>
            <p className="text-gray-500 font-medium text-sm lg:text-base">Junte-se ao Bolão Copa 2026</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Avatar Upload */}
            <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
              <div
                onClick={() => fileInputRef.current.click()}
                className="relative w-14 h-14 rounded-full border-2 border-dashed border-gray-300 active:border-ocean cursor-pointer flex items-center justify-center overflow-hidden bg-[#f8f8f8] group transition-colors flex-shrink-0"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400 group-hover:text-ocean transition-colors">
                    <UploadCloud size={18} className="mb-0.5" />
                    <span className="text-[8px] font-bold uppercase tracking-wider">Foto</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <div>
                <div className="font-semibold text-ocean text-sm">Foto de perfil</div>
                <div className="text-xs text-gray-400 mt-0.5">Toque para adicionar (opcional)</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Usuário</label>
                <input
                  id="register-username"
                  type="text"
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                  className="w-full bg-white border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/10 text-ocean placeholder-gray-300 rounded-xl px-3 py-3 outline-none transition-all duration-200 shadow-sm text-base"
                  placeholder="seunome"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Nome</label>
                <input
                  id="register-fullname"
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  className="w-full bg-white border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/10 text-ocean placeholder-gray-300 rounded-xl px-3 py-3 outline-none transition-all duration-200 shadow-sm text-base"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">E-mail</label>
              <input
                id="register-email"
                type="email"
                required
                inputMode="email"
                autoComplete="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/10 text-ocean placeholder-gray-300 rounded-xl px-4 py-3 outline-none transition-all duration-200 shadow-sm text-base"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Senha</label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/10 text-ocean placeholder-gray-300 rounded-xl px-4 py-3 outline-none transition-all duration-200 shadow-sm text-base pr-12"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ocean transition-colors p-1"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-500 text-sm flex items-center justify-center font-medium">
                {error}
              </div>
            )}

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-[#009c3b] hover:brightness-110 active:brightness-90 text-white font-bold py-4 rounded-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#009c3b]/25 mt-1 text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Criando Conta...
                </span>
              ) : (
                <>
                  Participar Agora
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OU</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Já tem conta?{' '}
              <Link to="/login" className="text-ocean font-bold hover:text-[#009c3b] transition-colors underline underline-offset-2">
                Entrar
              </Link>
            </p>
          </div>

          <div className="mt-6 mb-2 flex items-center justify-center gap-3 opacity-40">
            <img src="/brazil-thumb.png" alt="" className="w-7 h-7 object-contain" />
            <span className="text-xs text-gray-400 font-medium">Copa do Mundo 2026</span>
            <img src="/brazil-thumb.png" alt="" className="w-7 h-7 object-contain" />
          </div>
        </div>
      </div>
    </div>
  )
}
