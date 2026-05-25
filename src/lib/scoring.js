/**
 * Calcula pontos de um palpite
 * Placar exato = 5 pontos
 * Acertar vencedor/empate = 3 pontos
 * Acertar saldo de gols = +1 ponto
 */
export function calculatePoints(predHome, predAway, realHome, realAway) {
  if (realHome === null || realAway === null) return null

  const getWinner = (h, a) => h > a ? 'home' : h < a ? 'away' : 'draw'

  // Placar exato
  if (predHome === realHome && predAway === realAway) return 5

  const predWinner = getWinner(predHome, predAway)
  const realWinner = getWinner(realHome, realAway)

  if (predWinner !== realWinner) return 0

  // Vencedor correto
  let points = 3
  // Saldo de gols correto
  if ((predHome - predAway) === (realHome - realAway)) points += 1

  return points
}

export function getPointsLabel(points) {
  if (points === 5) return { label: 'Placar Exato!', color: 'text-copa-gold-light', bg: 'bg-copa-gold/20' }
  if (points === 4) return { label: 'Vencedor + Saldo', color: 'text-green-400', bg: 'bg-green-400/20' }
  if (points === 3) return { label: 'Acertou Vencedor', color: 'text-blue-400', bg: 'bg-blue-400/20' }
  if (points === 0) return { label: 'Errou', color: 'text-red-400', bg: 'bg-red-400/20' }
  return { label: `${points} pts`, color: 'text-gray-400', bg: 'bg-gray-400/20' }
}

export function getMedal(position) {
  if (position === 1) return { emoji: '🥇', label: 'Ouro', color: 'text-yellow-400' }
  if (position === 2) return { emoji: '🥈', label: 'Prata', color: 'text-gray-300' }
  if (position === 3) return { emoji: '🥉', label: 'Bronze', color: 'text-amber-600' }
  return null
}

export const AVATAR_EMOJIS = ['⚽', '🏆', '🦁', '🐯', '🦅', '🐺', '🦊', '🐉', '🐶', '🌟', '🔥', '⚡', '🎯', '🏅', '🎲']
