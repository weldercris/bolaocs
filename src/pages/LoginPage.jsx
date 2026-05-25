import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(form)
    setLoading(false)
    if (error) {
      setError('Email ou senha incorretos')
      return
    }
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-body overflow-hidden">

      {/* ── MOBILE: Banner hero no topo ── */}
      <div className="lg:hidden relative h-52 flex-shrink-0 overflow-hidden">
        <img
          src="/stadium.jpg"
          alt="Estádio Copa 2026"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1d42]/70 via-[#0a1d42]/50 to-[#0a1d42]/80" />
        {/* Conteúdo sobre o banner mobile */}
        <div className="relative z-10 flex flex-col justify-end h-full px-6 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-1.5">
              <img src="/cs.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="text-white font-display text-base tracking-wider leading-none">BOLÃO</div>
              <div className="text-[#ffdf00] font-display text-base tracking-wider leading-none">COPA 2026</div>
            </div>
          </div>
          <h1 className="font-display text-white text-4xl leading-none drop-shadow-lg">
            MOSTRE QUEM MANDA
          </h1>
        </div>
        {/* Troféu decorativo */}
        <div className="absolute bottom-0 right-4 pointer-events-none">
          <img src="/trophy.png" alt="Troféu" className="w-35 object-contain drop-shadow-2xl opacity-60" />
        </div>
      </div>

      {/* ── DESKTOP: Foto lateral esquerda ── */}
      <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden">
        <img
          src="/stadium.jpg"
          alt="Estádio Copa 2026"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1d42]/85 via-[#0a1d42]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1d42]/60 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-center h-full px-16 py-14 gap-12">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl p-2">
              <img src="/cs.png" alt="Logo" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <div className="text-white/90 font-display text-xl tracking-wider leading-none">BOLÃO</div>
              <div className="text-[#ffdf00] font-display text-xl tracking-wider leading-none">COPA 2026</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-[2px] bg-[#009c3b]" />
              <span className="text-[#009c3b] font-bold uppercase tracking-[0.25em] text-xs">O palco dos palpites</span>
            </div>
            <h1 className="font-display text-white text-7xl xl:text-8xl leading-[0.88] mb-5 drop-shadow-lg">
              MOSTRE<br />
              QUEM<br />
              MANDA
            </h1>
            <p className="text-white/70 text-lg max-w-sm leading-relaxed">
              Faça seus palpites, dispute com amigos e conquiste o topo do ranking na Copa 2026.
            </p>
          </div>

          <div className="text-white/40 text-sm font-medium">
            Copa do Mundo 2026 · EUA · CAN · MEX
          </div>
        </div>

        <div className="absolute bottom-0 right-0 pointer-events-none">
          <img src="/trophy.png" alt="Troféu" className="w-48 object-contain drop-shadow-2xl opacity-70" />
        </div>
        <div className="absolute top-1/2 right-[-4rem] -translate-y-1/2 text-white/5 font-display text-[18rem] font-black leading-none select-none pointer-events-none">
          26
        </div>
      </div>

      {/* ── FORMULÁRIO (mobile + desktop) ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f8f8f8] px-6 md:px-14 py-8 lg:py-0 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-[#ffdf00]/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[30rem] h-[30rem] bg-[#0a1d42]/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[400px] relative z-10">
          {/* Cabeçalho do form */}
          <div className="mb-7">
            <div className="w-11 h-11 rounded-2xl bg-ocean flex items-center justify-center mb-4 shadow-lg shadow-ocean/20">
              <img src="/brazil.png" alt="Brasil" className="w-6 h-6 object-contain" />
            </div>
            <h2 className="font-display text-ocean text-3xl lg:text-4xl tracking-wide mb-1">Bem-vindo(a)</h2>
            <p className="text-gray-500 font-medium text-sm lg:text-base">Faça login para acessar o bolão</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                E-mail
              </label>
              <input
                id="login-email"
                type="email"
                required
                inputMode="email"
                autoComplete="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/10 text-ocean placeholder-gray-300 rounded-xl px-4 py-3.5 outline-none transition-all duration-200 shadow-sm text-base"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                Senha
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/10 text-ocean placeholder-gray-300 rounded-xl px-4 py-3.5 outline-none transition-all duration-200 shadow-sm text-base pr-12"
                  placeholder="••••••••"
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
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-ocean hover:brightness-125 text-white font-bold py-4 rounded-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-ocean/25 mt-1 text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Autenticando...
                </span>
              ) : (
                <>
                  Entrar no Bolão
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OU</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Ainda não participa?{' '}
              <Link to="/cadastro" className="text-ocean font-bold hover:text-[#009c3b] transition-colors underline underline-offset-2">
                Criar minha conta
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 opacity-40">
            <img src="/brazil-thumb.png" alt="" className="w-7 h-7 object-contain" />
            <span className="text-xs text-gray-400 font-medium">Copa do Mundo 2026</span>
            <img src="/brazil-thumb.png" alt="" className="w-7 h-7 object-contain" />
          </div>
        </div>
      </div>
    </div>
  )
}
