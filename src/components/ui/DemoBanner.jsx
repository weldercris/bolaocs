import { useNavigate } from 'react-router-dom'
import { useDemo } from '../../contexts/DemoContext'
import { Zap, X } from 'lucide-react'

export default function DemoBanner() {
  const { isDemo, exitDemo } = useDemo()
  const navigate = useNavigate()

  if (!isDemo) return null

  function handleExit() {
    exitDemo()
    navigate('/login')
  }

  return (
    <div className="relative z-50 w-full bg-gradient-to-r from-[#0a1d42] via-[#1a3a6b] to-[#0a1d42] border-b border-[#ffdf00]/30 overflow-hidden">
      {/* Shimmer decoration */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(255,223,0,0.03)_40px,rgba(255,223,0,0.03)_80px)]" />

      <div className="relative flex items-center justify-between max-w-6xl mx-auto px-4 py-2 gap-4">
        {/* Left — label */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 bg-[#ffdf00]/15 border border-[#ffdf00]/30 rounded-full px-3 py-1">
            <Zap size={13} className="text-[#ffdf00]" />
            <span className="text-[#ffdf00] text-[11px] font-black uppercase tracking-widest">Modo Demo</span>
          </div>
        </div>

        {/* Center — message */}
        <p className="text-white/70 text-xs font-medium text-center hidden sm:block">
          Você está visualizando dados fictícios. Nenhuma informação real é exibida.
        </p>

        {/* Right — exit */}
        <button
          onClick={handleExit}
          className="flex-shrink-0 flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-full transition-all duration-200"
        >
          <X size={12} />
          Sair do Demo
        </button>
      </div>
    </div>
  )
}
