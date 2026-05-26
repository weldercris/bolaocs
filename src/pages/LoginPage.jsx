import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useDemo } from '../contexts/DemoContext'
import { supabase } from '../lib/supabase'
import { Eye, EyeOff, ArrowRight, Zap, UploadCloud, CheckCircle, Trophy, Star, Clock, QrCode, AlertTriangle } from 'lucide-react'

/* ── Animated floating particles ── */
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? 'rgba(255,223,0,0.5)' : i % 3 === 1 ? 'rgba(0,156,59,0.4)' : 'rgba(255,255,255,0.3)',
            animation: `floatParticle ${6 + Math.random() * 10}s ${Math.random() * 5}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const { enterDemo } = useDemo()
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState(location.pathname === '/cadastro' ? 'register' : 'login')
  const [isAnimating, setIsAnimating] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', username: '', fullName: '', avatarFile: null })
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingDemo, setLoadingDemo] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)

  // ── Prank states ──
  // null -> 'pix' -> 'meme' -> done (opens register)
  const [prankStage, setPrankStage] = useState(null)
  const [prankTimer, setPrankTimer] = useState(60)
  const [prankHasRun, setPrankHasRun] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 100)
  }, [])

  useEffect(() => {
    const targetMode = location.pathname === '/cadastro' ? 'register' : 'login'
    if (targetMode !== mode) setMode(targetMode)
  }, [location.pathname])

  function switchMode(targetMode) {
    if (isAnimating || mode === targetMode) return
    setIsAnimating(true)
    setError('')
    setShowPass(false)
    setTimeout(() => {
      setMode(targetMode)
      window.history.pushState({}, '', targetMode === 'register' ? '/cadastro' : '/login')
      setIsAnimating(false)
    }, 200)
  }

  // ── Prank: intercept switch to register ──
  function handleRegisterClick() {
    if (prankHasRun) {
      // Prank already ran once, go straight to register
      switchMode('register')
      return
    }
    // Start the prank!
    setPrankStage('pix')
    setPrankTimer(60)
  }

  // Countdown timer for PIX prank
  useEffect(() => {
    if (prankStage !== 'pix') return
    if (prankTimer <= 0) {
      // Timer ended -> show meme
      setPrankStage('meme')
      // After 3 seconds on meme, open register
      setTimeout(() => {
        setPrankStage(null)
        setPrankHasRun(true)
        switchMode('register')
      }, 3000)
      return
    }
    const interval = setInterval(() => {
      setPrankTimer(prev => prev - 1)
    }, 166) // Visual timer fast-forwards: 60 ticks at 166ms = ~10 seconds
    return () => clearInterval(interval)
  }, [prankStage, prankTimer])

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      setRegisterForm({ ...registerForm, avatarFile: file })
      setPreview(URL.createObjectURL(file))
    }
  }

  async function handleLoginSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(loginForm)
    setLoading(false)
    if (error) {
      setError('E-mail ou senha incorretos')
      return
    }
    navigate('/')
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault()
    if (registerForm.password.length < 6) { setError('Senha precisa ter pelo menos 6 caracteres'); return }
    if (registerForm.username.length < 3) { setError('Nome de usuário precisa ter pelo menos 3 caracteres'); return }

    const allowedDomains = ['suri.ai', 'chatbotmaker.io']
    const emailDomain = registerForm.email.split('@')[1]?.toLowerCase()
    if (!allowedDomains.includes(emailDomain)) {
      setError('Acesso restrito. Apenas e-mails @suri.ai e @chatbotmaker.io podem se cadastrar.')
      return
    }

    setLoading(true)
    setError('')

    const { data: existingUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', registerForm.username)
      .maybeSingle()

    if (existingUser) {
      setError('Nome de usuário já está em uso')
      setLoading(false)
      return
    }

    const { error } = await signUp(registerForm)
    setLoading(false)
    if (error) {
      setError(error.message.includes('already') ? 'E-mail já cadastrado' : 'Erro ao criar conta')
      return
    }

    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      switchMode('login')
    }, 2500)
  }

  async function handleDemoLogin() {
    setLoadingDemo(true)
    enterDemo()
    navigate('/')
    setLoadingDemo(false)
  }

  /* ── Success Screen ── */
  if (success) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <img src="/stadium.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0a1d42]/80 backdrop-blur-sm" />
        <div className="relative z-10 text-center animate-in">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#009c3b] to-[#006b28] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#009c3b]/40 animate-bounce">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h2 className="font-display text-5xl lg:text-6xl text-white mb-4 tracking-wide">CONTA CRIADA!</h2>
          <p className="text-white/70 font-medium text-lg">Bem-vindo ao Bolão Copa 2026 🎉</p>
          <p className="text-white/40 text-sm mt-3">Redirecionando para o login...</p>
        </div>
      </div>
    )
  }

  const inputClasses = "w-full bg-white/[0.07] backdrop-blur-sm border border-white/[0.12] focus:border-[#ffdf00]/50 focus:bg-white/[0.12] text-white placeholder-white/30 rounded-xl px-4 py-3 outline-none transition-all duration-300 text-[15px] focus:ring-2 focus:ring-[#ffdf00]/10 focus:shadow-[0_0_20px_rgba(255,223,0,0.05)]"
  const labelClasses = "text-[11px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1.5 block"

  return (
    <>
      {/* ── Injected Keyframes ── */}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(15px, -30px) scale(1.5); opacity: 0.7; }
          50% { transform: translate(-10px, -60px) scale(1); opacity: 0.4; }
          75% { transform: translate(20px, -30px) scale(1.3); opacity: 0.6; }
        }
        @keyframes kenBurns {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.08) translate(-1%, -0.5%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        @keyframes trophyFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(1deg); }
          66% { transform: translateY(-6px) rotate(-0.5deg); }
        }
        @keyframes goldenPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(255,223,0,0.15), 0 0 60px rgba(255,223,0,0.05); }
          50% { box-shadow: 0 0 50px rgba(255,223,0,0.3), 0 0 100px rgba(255,223,0,0.1); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(40px) scale(0.96); filter: blur(8px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes shimmerLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(255,223,0,0.08); }
          50% { border-color: rgba(255,223,0,0.2); }
        }
        .login-card-reveal {
          animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .login-card-reveal.delay-1 { animation-delay: 0.1s; }
        .login-card-reveal.delay-2 { animation-delay: 0.2s; }
        .login-card-reveal.delay-3 { animation-delay: 0.3s; }
        .login-card-reveal.delay-4 { animation-delay: 0.4s; }
      `}</style>

      <div className="min-h-screen min-h-[100dvh] relative overflow-hidden flex flex-col lg:flex-row">

        {/* ══════════ BACKGROUND LAYER ══════════ */}
        <div className="absolute inset-0 z-0">
          <img
            src="/stadium.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ animation: 'kenBurns 30s ease-in-out infinite' }}
          />
          {/* Multi-layer cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1d42]/92 via-[#0a1d42]/80 to-[#001a0e]/88" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1d42]/60 via-transparent to-[#0a1d42]/40" />
          {/* Ambient green/gold light spots */}
          <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-[#009c3b]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[#ffdf00]/6 rounded-full blur-[100px]" />
          <Particles />
        </div>

        {/* ══════════ LEFT: BRANDING PANEL (Desktop) ══════════ */}
        <div className="hidden lg:flex lg:w-[50%] xl:w-[48%] relative z-10 flex-col justify-between px-16 xl:px-20 py-14">

          {/* Top: Logo */}
          <div
            className={`flex items-center gap-4 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 shadow-xl">
              <img src="/cs.png" alt="Logo" className="w-14 h-14 object-contain" />
            </div>
            <div>
              <div className="text-white/90 font-display text-xl tracking-[0.15em] leading-none">BOLÃO</div>
              <div className="text-[#ffdf00] font-display text-xl tracking-[0.15em] leading-none mt-0.5">COPA 2026</div>
            </div>
          </div>

          {/* Center: Cinematic Title + Trophy */}
          <div className="relative flex-1 flex items-center">
            <div className="relative w-full">
              {/* Login title */}
              <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mode === 'login' ? 'opacity-100 translate-x-0 translate-y-0 blur-0' : 'opacity-0 -translate-x-10 translate-y-4 blur-[4px] pointer-events-none absolute inset-0'}`}>
                <div className={`flex items-center gap-3 mb-6 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                  <div className="w-12 h-[2px] bg-gradient-to-r from-[#009c3b] to-[#ffdf00]" />
                  <span className="text-[#009c3b] font-bold uppercase tracking-[0.3em] text-[11px]">O Palco dos Palpites</span>
                </div>
                <h1 className={`font-display text-white text-[4.5rem] xl:text-[5.5rem] leading-[0.85] mb-8 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  MOSTRE<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdf00] to-[#ff9f00]">QUEM</span><br />
                  MANDA
                </h1>
                <p className={`text-white/50 text-base max-w-sm leading-relaxed transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                  Faça seus palpites, dispute com amigos e conquiste o topo do ranking na Copa do Mundo 2026.
                </p>
              </div>

              {/* Register title */}
              <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mode === 'register' ? 'opacity-100 translate-x-0 translate-y-0 blur-0' : 'opacity-0 translate-x-10 translate-y-4 blur-[4px] pointer-events-none absolute inset-0'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-[2px] bg-gradient-to-r from-[#ffdf00] to-[#009c3b]" />
                  <span className="text-[#ffdf00] font-bold uppercase tracking-[0.3em] text-[11px]">Participe Agora</span>
                </div>
                <h1 className="font-display text-white text-[4.5rem] xl:text-[5.5rem] leading-[0.85] mb-8">
                  JUNTE-SE<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009c3b] to-[#00d44a]">AO MAIOR</span><br />
                  BOLÃO
                </h1>
                <p className="text-white/50 text-base max-w-sm leading-relaxed">
                  Crie sua conta, dispute ponto a ponto e seja o grande campeão com seus palpites certeiros.
                </p>
              </div>
            </div>

            {/* Floating Trophy with golden aura */}
            <div
              className={`absolute -right-16 bottom-[-5rem] xl:-right-32 xl:bottom-[-8rem] transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
              style={{ animation: 'trophyFloat 6s ease-in-out infinite' }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#ffdf00]/15 rounded-full blur-[80px] scale-125" />
                <img
                  src="/TROFEU.png"
                  alt="Troféu"
                  className="w-72 xl:w-[450px] object-contain drop-shadow-[0_20px_60px_rgba(255,223,0,0.3)] relative z-10"
                />
              </div>
            </div>
          </div>

          {/* Bottom: Info */}
          <div className={`flex items-center gap-4 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#009c3b] animate-pulse" />
              <span className="text-white/30 text-xs font-medium tracking-wider">Copa do Mundo 2026</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-white/20 text-xs">EUA · CAN · MEX</span>
          </div>
        </div>

        {/* ══════════ MOBILE: Hero Banner ══════════ */}
        <div className="lg:hidden relative z-10 px-6 pt-12 pb-6 flex-shrink-0">
          <div className={`flex items-center gap-3 mb-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-2">
              <img src="/cs.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <div className="text-white font-display text-base tracking-[0.15em] leading-none">BOLÃO</div>
              <div className="text-[#ffdf00] font-display text-base tracking-[0.15em] leading-none mt-0.5">COPA 2026</div>
            </div>
          </div>

          {/* Mobile Title crossfade */}
          <div className="relative h-16 overflow-hidden">
            <div className={`absolute inset-0 transition-all duration-500 ease-out ${mode === 'login' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'}`}>
              <h1 className="font-display text-white text-4xl leading-[0.9]">
                MOSTRE <span className="text-[#ffdf00]">QUEM</span> MANDA
              </h1>
            </div>
            <div className={`absolute inset-0 transition-all duration-500 ease-out ${mode === 'register' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
              <h1 className="font-display text-white text-4xl leading-[0.9]">
                JUNTE-SE <span className="text-[#009c3b]">AO MAIOR</span> BOLÃO
              </h1>
            </div>
          </div>
        </div>

        {/* ══════════ RIGHT: FORM PANEL ══════════ */}
        <div className="flex-1 relative z-10 flex flex-col items-center justify-start lg:justify-center px-5 md:px-8 lg:px-12 xl:px-16 pb-10 lg:pb-0 overflow-y-auto">

          {/* ── Glass Card Container ── */}
          <div
            className={`w-full max-w-[420px] transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            {/* Glass card */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{ animation: 'borderGlow 4s ease-in-out infinite' }}
            >
              {/* Card background layers */}
              <div className="absolute inset-0 bg-white/[0.06] backdrop-blur-xl" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent" />
              <div className="absolute inset-0 border border-white/[0.1] rounded-3xl" />
              {/* Shimmer line across top */}
              <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden">
                <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#ffdf00]/40 to-transparent" style={{ animation: 'shimmerLine 4s ease-in-out infinite' }} />
              </div>

              <div className="relative z-10 p-5 lg:p-7">

                {/* ── Form Header ── */}
                <div className="relative h-12 mb-4 overflow-hidden">
                  <div className={`absolute inset-0 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${mode === 'login' ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 -translate-y-6 blur-[3px] pointer-events-none'}`}>
                    <h2 className="font-display text-white text-2xl tracking-wide leading-none mb-1">Bem-vindo(a)</h2>
                    <p className="text-white/40 text-sm font-medium">Faça login para acessar o bolão</p>
                  </div>
                  <div className={`absolute inset-0 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${mode === 'register' ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-6 blur-[3px] pointer-events-none'}`}>
                    <h2 className="font-display text-white text-2xl tracking-wide leading-none mb-1">Criar Conta</h2>
                    <p className="text-white/40 text-sm font-medium">Junte-se ao Bolão Copa 2026</p>
                  </div>
                </div>

                {/* ── Forms Container with fixed error area ── */}
                <div className="relative w-full">

                  {/* LOGIN FORM */}
                  <div className={`w-full transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${mode === 'login' ? 'opacity-100 translate-x-0 scale-100 relative z-20' : 'opacity-0 -translate-x-8 scale-[0.97] absolute inset-x-0 top-0 z-0 pointer-events-none'}`}>
                    <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                      <div>
                        <label className={labelClasses}>E-mail</label>
                        <input
                          id="login-email"
                          type="email"
                          required
                          value={loginForm.email}
                          onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                          className={inputClasses}
                          placeholder="seu@email.com"
                        />
                      </div>

                      <div>
                        <label className={labelClasses}>Senha</label>
                        <div className="relative">
                          <input
                            id="login-password"
                            type={showPass ? 'text' : 'password'}
                            required
                            value={loginForm.password}
                            onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                            className={`${inputClasses} pr-12`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#ffdf00] transition-colors duration-200 p-1"
                          >
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* Fixed-height error area: prevents layout shift */}
                      <div className="min-h-[36px]">
                        <div className={`transition-all duration-400 ease-out overflow-hidden ${error && mode === 'login' ? 'opacity-100 max-h-[36px] translate-y-0' : 'opacity-0 max-h-0 -translate-y-2'}`}>
                          <div className="bg-red-500/15 border border-red-400/20 backdrop-blur-sm rounded-xl p-2.5 text-red-300 text-sm text-center font-medium">
                            {error}
                          </div>
                        </div>
                      </div>

                      <button
                        id="login-submit"
                        type="submit"
                        disabled={loading}
                        className="w-full relative overflow-hidden group bg-gradient-to-r from-[#ffdf00] to-[#ffc800] hover:from-[#ffe533] hover:to-[#ffd633] text-[#0a1d42] font-bold py-3.5 rounded-xl transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-2.5 shadow-[0_8px_32px_rgba(255,223,0,0.25)] hover:shadow-[0_12px_40px_rgba(255,223,0,0.35)] text-[15px]"
                      >
                        {/* Hover shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        {loading ? (
                          <span className="flex items-center gap-2.5 relative z-10">
                            <span className="w-5 h-5 border-2 border-[#0a1d42]/30 border-t-[#0a1d42] rounded-full animate-spin" />
                            Autenticando...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2.5 relative z-10">
                            Entrar no Bolão
                            <ArrowRight size={18} />
                          </span>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* REGISTER FORM */}
                  <div className={`w-full transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${mode === 'register' ? 'opacity-100 translate-x-0 scale-100 relative z-20' : 'opacity-0 translate-x-8 scale-[0.97] absolute inset-x-0 top-0 z-0 pointer-events-none'}`}>
                    <form onSubmit={handleRegisterSubmit} className="space-y-3">
                      {/* Avatar Upload */}
                      <div className="flex items-center gap-3 bg-white/[0.06] backdrop-blur-sm rounded-xl border border-white/[0.1] p-3">
                        <div
                          onClick={() => fileInputRef.current.click()}
                          className="relative w-14 h-14 rounded-full border-2 border-dashed border-white/20 hover:border-[#ffdf00]/40 cursor-pointer flex items-center justify-center overflow-hidden bg-white/[0.05] group transition-all duration-300 flex-shrink-0"
                        >
                          {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center text-white/30 group-hover:text-[#ffdf00] transition-colors">
                              <UploadCloud size={16} className="mb-0.5" />
                              <span className="text-[7px] font-bold uppercase tracking-wider">Foto</span>
                            </div>
                          )}
                        </div>
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                        <div>
                          <div className="font-semibold text-white/80 text-sm">Foto de perfil</div>
                          <div className="text-[11px] text-white/30 mt-0.5">Toque para adicionar (opcional)</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClasses}>Usuário</label>
                          <input
                            id="register-username"
                            type="text"
                            required
                            value={registerForm.username}
                            onChange={e => setRegisterForm({ ...registerForm, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                            className={inputClasses}
                            placeholder="seunome"
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Nome</label>
                          <input
                            id="register-fullname"
                            type="text"
                            required
                            value={registerForm.fullName}
                            onChange={e => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                            className={inputClasses}
                            placeholder="Seu Nome"
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClasses}>E-mail</label>
                        <input
                          id="register-email"
                          type="email"
                          required
                          value={registerForm.email}
                          onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                          className={inputClasses}
                          placeholder="seu@email.com"
                        />
                      </div>

                      <div>
                        <label className={labelClasses}>Senha</label>
                        <div className="relative">
                          <input
                            id="register-password"
                            type={showPass ? 'text' : 'password'}
                            required
                            value={registerForm.password}
                            onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                            className={`${inputClasses} pr-11`}
                            placeholder="Min. 6 caracteres"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#ffdf00] transition-colors p-1"
                          >
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Fixed-height error area */}
                      <div className="min-h-[36px]">
                        <div className={`transition-all duration-400 ease-out overflow-hidden ${error && mode === 'register' ? 'opacity-100 max-h-[50px] translate-y-0' : 'opacity-0 max-h-0 -translate-y-2'}`}>
                          <div className="bg-red-500/15 border border-red-400/20 backdrop-blur-sm rounded-xl p-2.5 text-red-300 text-sm text-center font-medium">
                            {error}
                          </div>
                        </div>
                      </div>

                      <button
                        id="register-submit"
                        type="submit"
                        disabled={loading}
                        className="w-full relative overflow-hidden group bg-gradient-to-r from-[#009c3b] to-[#00b844] hover:from-[#00b341] hover:to-[#00cf4e] text-white font-bold py-3.5 rounded-xl transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-2.5 shadow-[0_8px_32px_rgba(0,156,59,0.3)] hover:shadow-[0_12px_40px_rgba(0,156,59,0.4)] text-[15px]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        {loading ? (
                          <span className="flex items-center gap-2.5 relative z-10">
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Criando conta...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2.5 relative z-10">
                            Cadastrar e Entrar
                            <ArrowRight size={18} />
                          </span>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* ── Separator ── */}
                <div className="flex items-center gap-4 my-5">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <span className="text-[11px] text-white/25 font-medium tracking-wider uppercase">ou</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* ── Demo Button ── */}
                <button
                  id="login-demo"
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loadingDemo || loading}
                  className="w-full relative overflow-hidden group border border-white/[0.1] hover:border-[#ffdf00]/30 bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold py-3 rounded-xl transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-2.5 text-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffdf00]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  {loadingDemo ? (
                    <span className="flex items-center gap-2 relative z-10">
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Entrando como Demo...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 relative z-10">
                      <Zap size={15} className="text-[#ffdf00]" />
                      <span>Explorar como <span className="text-[#ffdf00] font-extrabold">Demo</span></span>
                      <span className="ml-0.5 bg-[#ffdf00]/15 text-[#ffdf00] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-[#ffdf00]/20">Preview</span>
                    </span>
                  )}
                </button>

                {/* ── Toggle Mode Link ── */}
                <div className="text-center mt-5">
                  <p className="text-white/40 text-sm">
                    {mode === 'login' ? (
                      <>
                        Ainda não participa?{' '}
                        <button
                          onClick={handleRegisterClick}
                          className="text-[#ffdf00] font-bold hover:text-[#ffe44d] transition-colors duration-200 underline underline-offset-4 decoration-[#ffdf00]/30 hover:decoration-[#ffdf00]/60"
                        >
                          Criar minha conta
                        </button>
                      </>
                    ) : (
                      <>
                        Já possui uma conta?{' '}
                        <button
                          onClick={() => switchMode('login')}
                          className="text-[#ffdf00] font-bold hover:text-[#ffe44d] transition-colors duration-200 underline underline-offset-4 decoration-[#ffdf00]/30 hover:decoration-[#ffdf00]/60"
                        >
                          Fazer Login
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Brand accent below card ── */}
            <div className={`flex items-center justify-center gap-3 mt-4 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <img src="/cbf.svg" alt="" className="w-5 h-5 object-contain opacity-20" />
              <span className="text-white/15 text-[11px] font-medium tracking-wider">EUA · Canadá · México · 2026</span>
              <img src="/trophy.png" alt="" className="w-5 h-5 object-contain opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ PRANK OVERLAY ══════════ */}
      {prankStage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ animation: 'revealUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0a1d42]/95 backdrop-blur-xl" />

          {/* ── PIX Stage ── */}
          {prankStage === 'pix' && (
            <div className="relative z-10 w-[90%] max-w-[400px] text-center" style={{ animation: 'revealUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
              {/* Warning icon */}
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff3b30] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,59,48,0.4)] animate-pulse">
                <AlertTriangle size={32} className="text-white" />
              </div>

              <h2 className="font-display text-white text-3xl md:text-4xl tracking-wide mb-2">ACESSO PREMIUM</h2>
              <p className="text-white/60 text-sm mb-6">Faça o pagamento via PIX para liberar o acesso à plataforma</p>

              {/* QR Code Card */}
              <div className="bg-white rounded-2xl p-6 mx-auto max-w-[280px] mb-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]" style={{ animation: 'goldenPulse 2s ease-in-out infinite' }}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <img src="/pix_qrcode.png" alt="PIX" className="w-6 h-6 object-contain" />
                  <span className="text-[#32bcad] font-bold text-lg">PIX</span>
                </div>
                <img src="/pix_qrcode.png" alt="QR Code PIX" className="w-full aspect-square object-contain rounded-lg" />
                <div className="mt-3 text-center">
                  <span className="text-gray-800 font-bold text-xl">R$ 49,90</span>
                  <p className="text-gray-400 text-xs mt-1">Taxa de acesso ao Bolão</p>
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <Clock size={20} className="text-[#ffdf00] animate-spin" style={{ animationDuration: '2s' }} />
                <span className="text-white/80 text-sm font-medium">Aguardando pagamento...</span>
              </div>

              {/* Countdown */}
              <div className="relative mx-auto w-20 h-20 mb-4">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                  <circle
                    cx="40" cy="40" r="35"
                    fill="none"
                    stroke="#ffdf00"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${2 * Math.PI * 35 * (1 - prankTimer / 60)}`}
                    style={{ transition: 'stroke-dashoffset 0.2s linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#ffdf00] font-display text-3xl">{prankTimer}</span>
                </div>
              </div>

              <p className="text-white/30 text-xs">O acesso será liberado após a confirmação</p>

              {/* Fake progress bar */}
              <div className="mt-4 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ffdf00] to-[#ff9f00] rounded-full transition-all duration-200 ease-linear"
                  style={{ width: `${((60 - prankTimer) / 60) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* ── MEME Stage ── */}
          {prankStage === 'meme' && (
            <div className="relative z-10 w-[90%] max-w-[420px] text-center" style={{ animation: 'revealUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
              {/* Meme image */}
              <div className="mb-6 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(255,223,0,0.2)] border-4 border-[#ffdf00]/30" style={{ animation: 'goldenPulse 1s ease-in-out infinite' }}>
                <img src="/troll.png" alt="Pegadinha!" className="w-full object-contain" />
              </div>
              <p className="text-white/40 text-sm">É de graça, otário! Abrindo cadastro...</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
