import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60)
      };
    } else {
      timeLeft = { dias: 0, horas: 0, minutos: 0, segundos: 0 };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl p-6 mb-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="absolute top-0 left-0 w-32 h-32 bg-gold/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-ocean/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-full bg-ocean text-white flex items-center justify-center shadow-md">
          <Calendar size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-ocean font-display leading-tight">Copa do Mundo 2026</h3>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">América do Norte</p>
        </div>
      </div>

      <div className="flex gap-3 relative z-10">
        {Object.entries(timeLeft).map(([unit, value], idx) => (
          <div key={idx} className="flex flex-col items-center min-w-[70px]">
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl w-16 h-16 flex items-center justify-center mb-1">
              <span className="text-2xl font-black text-ruby font-display">{String(value).padStart(2, '0')}</span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
