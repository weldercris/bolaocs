export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-copa-dark flex flex-col items-center justify-center gap-4">
      <div className="text-6xl animate-bounce-slow">⚽</div>
      <div className="font-display text-2xl text-copa-gold tracking-widest">CARREGANDO...</div>
      <div className="flex gap-1 mt-2">
        {[0,1,2].map(i => (
          <div
            key={i}
            className="w-2 h-2 bg-copa-green rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
