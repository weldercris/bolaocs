import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

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
    <div className="min-h-screen bg-white font-mona flex items-center justify-center overflow-hidden">
      {/* Decorações de Fundo Simples (Estilo Exemplo) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-ocean/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10 py-12">
        
        {/* Left Side - Typography Hero */}
        <div className="lg:w-1/2 flex flex-col justify-center animate-in relative">
          <div className="absolute inset-0 bg-cover bg-center opacity-10 rounded-3xl" style={{ backgroundImage: "url('/post.webp')" }}></div>
          <div className="relative z-10 py-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-0.5 bg-ruby"></div>
              <span className="text-ruby font-semibold uppercase tracking-widest text-sm">O palco dos palpites</span>
              <div className="w-12 h-0.5 bg-ruby"></div>
            </div>
            <h1 className="text-ocean text-6xl md:text-8xl font-black font-display leading-[0.9] mb-4">
              BOLÃO DA COPA
            </h1>
            <h2 className="text-gold text-7xl md:text-9xl font-black font-display leading-[0.9] mb-6 drop-shadow-sm">
              2026
            </h2>
            <p className="text-gray-500 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
              Uma cobertura completa da Copa do Mundo 2026. Chame seus amigos, faça seus palpites e mostre quem sabe mais de futebol!
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-5/12 w-full animate-in" style={{ animationDelay: '100ms' }}>
          <div className="glass-card bg-white/90 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative overflow-hidden">
            {/* Subtle background image inside card */}
            <img 
              src="/brazil-thumb.png" 
              alt="Troféu Fundo" 
              className="absolute -right-16 -bottom-16 w-64 h-64 object-contain opacity-5 pointer-events-none"
            />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center w-16 h-16 bg-ocean rounded-2xl mb-8 shadow-lg">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="font-display text-3xl text-ocean mb-2 tracking-wide">Bem-vindo(a)</h3>
              <p className="text-gray-500 mb-8">Faça login para acessar o bolão</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm text-gray-500 mb-2 block font-medium">Endereço de E-mail</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-background-gray border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/10 text-ocean placeholder-gray-400 rounded-xl px-4 py-3.5 outline-none transition-all duration-200"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-2 block font-medium">Sua Senha</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      className="w-full bg-background-gray border border-gray-200 focus:border-ocean focus:ring-2 focus:ring-ocean/10 text-ocean placeholder-gray-400 rounded-xl px-4 py-3.5 outline-none transition-all duration-200 pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ocean transition-colors"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-500 text-sm flex items-center justify-center font-medium">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg mt-4 shadow-ocean/20 shadow-lg">
                  {loading ? 'Autenticando...' : 'Entrar no Bolão'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-500">
                  Ainda não participa?{' '}
                  <Link to="/cadastro" className="text-ocean font-bold hover:text-ruby transition-colors">
                    Criar minha conta
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

