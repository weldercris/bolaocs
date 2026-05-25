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
  { to: '/jogadores', label: 'Jogadores', icon: User },
  { to: '/artilheiros', label: 'Artilheiros', icon: Trophy },
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
      {/* Header Flutuante Premium */}
      <div className="sticky top-0 z-50 pt-7 px-3 pointer-events-none">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between xl:gap-8 gap-4">
          
          {/* Logo Centralizado à Esquerda */}
          <div className="relative z-50 pointer-events-auto">
            <NavLink to="/" className="block hover:scale-105 transition-transform duration-300">
              {/* O ideal seria usar a logo-white do projeto, mas aqui mantemos o troféu adaptado */}
              <div className="flex flex-col items-center justify-center bg-ocean rounded-xl p-2 shadow-lg min-w-[4rem] min-h-[4rem]">
                <img src="/cs.png" alt="Bolão CS" className="w-20 h-20 object-contain block" />
              </div>
            </NavLink>
          </div>

          {/* Navegação Principal (Pílula) */}
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

          {/* Usuário + Logout */}
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

          {/* Botão Mobile */}
          <button
            className="lg:hidden pointer-events-auto p-3 rounded-full bg-[#ffffffc4] backdrop-blur-md border border-white text-ocean shadow-[0_0_35px_rgba(0,0,0,0.07)] hover:bg-ocean/10 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-md pt-32 px-4 pointer-events-auto lg:hidden animate-fade-in">
          <div className="flex flex-col gap-2">
            {navItems.map(({ to, label, icon: Icon, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                    isActive ? 'bg-ocean text-white shadow-md' : 'text-ocean hover:bg-ocean/5'
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
                  `flex items-center gap-3 px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                    isActive ? 'bg-ruby text-white shadow-md' : 'text-ruby hover:bg-ruby/5'
                  }`
                }
              >
                <Shield size={20} />
                Admin
              </NavLink>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-ocean/10" />
                ) : (
                  <span className="text-3xl bg-background-gray rounded-full p-2 border border-ocean/10">⚽</span>
                )}
                <span className="font-bold text-ocean text-lg">{profile?.username}</span>
              </div>
              <button onClick={handleSignOut} className="p-3 rounded-xl bg-ruby/10 text-ruby flex items-center gap-2 font-bold hover:bg-ruby hover:text-white transition-all">
                <LogOut size={18} /> Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <main className="flex-1 z-10 w-full pt-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 text-center text-gray-500 text-sm mt-12 z-10 relative">
        <p className="font-medium">⚽ Bolão da Copa 2026 · Criado para amigos</p>
      </footer>
    </div>
  )
}
