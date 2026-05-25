export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-ocean flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      {/* Fundo: gradiente + imagem de estádio */}
      <img
        src="/stadium.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-10 saturate-0"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ocean/90 to-ocean" />

      {/* Marca d'água "26" */}
      <div className="absolute text-white/5 font-display text-[22rem] font-black leading-none select-none pointer-events-none bottom-[-4rem]">
        26
      </div>

      {/* Logo e troféu */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="relative">
          <img
            src="/trophy.png"
            alt="Troféu"
            className="w-24 h-24 object-contain drop-shadow-2xl float"
          />
        </div>

        <div className="text-center">
          <div className="font-display text-white text-3xl tracking-[0.2em] leading-none mb-1">BOLÃO</div>
          <div className="font-display text-[#ffdf00] text-3xl tracking-[0.2em] leading-none">COPA 2026</div>
        </div>

        {/* Barra de progresso animada */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-[#009c3b] to-[#ffdf00] rounded-full animate-[loading-bar_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  )
}
