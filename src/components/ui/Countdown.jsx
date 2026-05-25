import { useState, useEffect } from 'react';
import { Calendar, Zap } from 'lucide-react';

export function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0) {
      return {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        min: Math.floor((difference / 1000 / 60) % 60),
        seg: Math.floor((difference / 1000) % 60),
      };
    }
    return { dias: 0, horas: 0, min: 0, seg: 0 };
  }

  useEffect(() => {
    const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearTimeout(timer);
  });

  const isLive = timeLeft.dias === 0 && timeLeft.horas === 0 && timeLeft.min === 0 && timeLeft.seg === 0;

  return (
    <div className="relative overflow-hidden rounded-3xl mb-10">
      {/* Fundo: imagem de estádio */}
      <img
        src="/stadium.jpg"
        alt="Estádio Copa 2026"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Overlay azul escuro */}
      <div className="absolute inset-0 bg-gradient-to-r from-ocean/95 via-ocean/85 to-ocean/60" />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-7">
        {/* Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
            <img src="/trophy.png" alt="Troféu" className="w-9 h-9 object-contain float" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              {isLive ? (
                <span className="flex items-center gap-1.5 bg-[#009c3b] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  <Zap size={10} className="fill-current" /> AO VIVO
                </span>
              ) : (
                <span className="flex items-center gap-1.5 bg-white/10 text-white/70 text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                  <Calendar size={10} /> 11 JUN 2026
                </span>
              )}
            </div>
            <h3 className="text-white font-display text-2xl tracking-wider leading-none">COPA DO MUNDO</h3>
            <p className="text-white/50 text-xs font-medium uppercase tracking-widest mt-0.5">EUA · Canadá · México</p>
          </div>
        </div>

        {/* Contador */}
        <div className="flex gap-3">
          {Object.entries(timeLeft).map(([unit, value], idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl w-[68px] h-[68px] flex items-center justify-center shadow-lg">
                <span className="text-3xl font-black text-white font-display tabular-nums">
                  {String(value).padStart(2, '0')}
                </span>
              </div>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1.5">{unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
