import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Home, Calendar, Target, Trophy, User, Shield, LogOut, Menu, X, Map } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/', label: 'Início', icon: Home, exact: true },
  { to: '/jogos', label: 'Jogos', icon: Calendar },
  { to: '/palpites', label: 'Palpites', icon: Target },
  { to: '/chaveamento', label: 'Chaveamento', icon: Map },
  { to: '/ranking', label: 'Ranking', icon: Trophy },
  { to: '/perfil', label: 'Perfil', icon: User },
]

export default function Layout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col font-mona bg-background-gray">
      {/* ── Header Flutuante Desktop ── */}
      <div className="sticky top-0 z-50 pt-7 px-3 pointer-events-none">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between xl:gap-8 gap-4">
          
          {/* Logo */}
          <div className="relative z-50 pointer-events-auto">
            <NavLink to="/" className="block hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center justify-center bg-ocean rounded-xl p-2 shadow-lg min-w-[4rem] min-h-[4rem]">
                <img src="/cs.png" alt="Bolão CS" className="w-20 h-20 object-contain block" />
              </div>
            </NavLink>
          </div>

          {/* Navegação Desktop (Pílula) */}
          <nav className="bg-[#ffffffc4] backdrop-blur-md xl:border border-white rounded-full shadow-[0_0_35px_rgba(0,0,0,0.07)] lg:px-2 py-1 pointer-events-auto hidden lg:block">
            <ul className="flex items-center text-sm xl:text-base font-bold text-ocean gap-1 xl:gap-2">
              {navItems.map(({ to, label, exact }) => (
                <li key={to} className="relative">
                  <NavLink
                    to={to}
                    end={exact}
                    className={({ isActive }) =>
                      `relative block px-4 xl:px-5 py-2 rounded-full isolate overflow-hidden group transition-all duration-300 ${
                        isActive ? 'text-white bg-ocean' : 'text-ocean hover:bg-ocean/10'
                      }`
                    }
                  >
                    <span className="relative z-10">{label}</span>
                  </NavLink>
                </li>
              ))}
              {profile?.is_admin && (
                <li className="relative">
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `relative block px-4 xl:px-5 py-2 rounded-full isolate overflow-hidden group transition-all duration-300 ${
                        isActive ? 'text-white bg-ruby' : 'text-ruby hover:bg-ruby/10'
                      }`
                    }
                  >
                    <span className="relative z-10 flex items-center gap-1"><Shield size={16}/> Admin</span>
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>

          {/* Usuário + Logout Desktop */}
          <div className="flex items-center gap-3 pointer-events-auto bg-[#ffffffc4] backdrop-blur-md border border-white rounded-full shadow-[0_0_35px_rgba(0,0,0,0.07)] p-2 pr-4 hidden lg:flex">
            <div className="flex items-center gap-2 text-sm">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-ocean/10" />
              ) : (
                <span className="text-xl bg-background-gray rounded-full p-1 border border-ocean/10">⚽</span>
              )}
              <span className="text-ocean font-bold">{profile?.username}</span>
            </div>
            <button onClick={handleSignOut} className="ml-2 p-2 rounded-full text-gray-400 hover:text-white hover:bg-ruby transition-all">
              <LogOut size={16} />
            </button>
          </div>

          {/* Botão Mobile Hamburger */}
          <button
            className="lg:hidden pointer-events-auto p-3 rounded-full bg-[#ffffffc4] backdrop-blur-md border border-white text-ocean shadow-[0_0_35px_rgba(0,0,0,0.07)] hover:bg-ocean/10 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Menu Mobile Drawer ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden animate-fade"
          onClick={() => setMobileOpen(false)}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Drawer deslizando da direita */}
          <div
            className="absolute right-0 top-0 h-full w-[80%] max-w-[320px] bg-white shadow-2xl flex flex-col overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Topo do drawer com foto do estádio */}
            <div className="relative h-36 flex-shrink-0 overflow-hidden">
              <img src="/stadium.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-ocean/80" />
              <div className="relative z-10 flex flex-col justify-end h-full px-5 pb-4">
                {/* Avatar + nome do usuário */}
                <div className="flex items-center gap-3">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white/30 shadow-md" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-2xl">⚽</div>
                  )}
                  <div>
                    <div className="font-bold text-white text-base leading-tight capitalize">{profile?.username}</div>
                    <div className="text-white/50 text-xs">Bolão Copa 2026</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Links de navegação */}
            <nav className="flex-1 px-3 py-4">
              <div className="flex flex-col gap-1">
                {navItems.map(({ to, label, icon: Icon, exact }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={exact}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                        isActive
                          ? 'bg-ocean text-white shadow-md shadow-ocean/20'
                          : 'text-ocean hover:bg-ocean/5 active:bg-ocean/10'
                      }`
                    }
                  >
                    <Icon size={20} />
                    {label}
                  </NavLink>
                ))}
                {profile?.is_admin && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                        isActive ? 'bg-ruby text-white shadow-md' : 'text-ruby hover:bg-ruby/5'
                      }`
                    }
                  >
                    <Shield size={20} />
                    Admin
                  </NavLink>
                )}
              </div>
            </nav>

            {/* Rodapé do drawer */}
            <div className="border-t border-gray-100 px-5 py-4">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 text-ruby font-bold text-sm hover:bg-ruby hover:text-white active:bg-ruby active:text-white transition-all"
              >
                <LogOut size={18} />
                Sair da conta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Nav inferior fixo (Mobile) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {navItems.slice(0, 5).map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-[52px] ${
                  isActive ? 'text-ocean' : 'text-gray-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-ocean/10' : ''}`}>
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className={`text-[10px] font-bold leading-none transition-all ${isActive ? 'text-ocean' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 z-10 w-full pt-2 lg:pt-6 pb-24 lg:pb-0">
        <Outlet />
      </main>

      {/* Footer Premium (Desktop only) */}
      <footer className="hidden lg:block border-t border-gray-100 bg-white mt-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo - somente foto */}
          <div className="bg-ocean rounded-xl p-2 shadow-md">
            <img src="/cs.png" alt="Logo" className="w-10 h-10 object-contain" />
          </div>

          {/* Centro */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              
              <p className="text-gray-400 text-sm font-medium">⚽ Criado para amigos · Copa do Mundo 2026</p>
            </div>
            <p className="text-gray-300 text-xs">EUA · Canadá · México · 11 Jun – 19 Jul 2026</p>
          </div>

          {/* Direita */}
          <img src="/trophy.png" alt="Troféu" className="w-12 h-12 object-contain opacity-30 float" />
        </div>
      </footer>
    </div>
  )
}
