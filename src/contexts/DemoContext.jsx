import { createContext, useContext, useState } from 'react'

const DemoContext = createContext({})

// ─── Perfil fictício ────────────────────────────────────────────
export const DEMO_PROFILE = {
  id: 'demo-user-id',
  username: 'demo',
  full_name: 'Usuário Demo',
  avatar_url: null,
  is_admin: false,
}

// ─── Stats do usuário demo na home ─────────────────────────────
export const DEMO_STATS = {
  id: 'demo-user-id',
  username: 'demo',
  total_points: 47,
  total_predictions: 12,
  exact_scores: 3,
  correct_results: 10,
  position: 4,
}

// ─── Ranking fictício ───────────────────────────────────────────
export const DEMO_RANKING = [
  { id: 'r1', username: 'craque_silva', full_name: 'Carlos Silva',   avatar_url: null, total_points: 89, total_predictions: 24, exact_scores: 7, correct_results: 14, position: 1 },
  { id: 'r2', username: 'palpiteiro10', full_name: 'João Matos',    avatar_url: null, total_points: 76, total_predictions: 22, exact_scores: 5, correct_results: 12, position: 2 },
  { id: 'r3', username: 'rainha_da_bola', full_name: 'Ana Beatriz', avatar_url: null, total_points: 64, total_predictions: 20, exact_scores: 4, correct_results: 11, position: 3 },
  { id: 'demo-user-id', username: 'demo', full_name: 'Usuário Demo',avatar_url: null, total_points: 47, total_predictions: 12, exact_scores: 3, correct_results: 10, position: 4 },
  { id: 'r5', username: 'torcedor_fiel', full_name: 'Pedro Alves',  avatar_url: null, total_points: 39, total_predictions: 16, exact_scores: 2, correct_results:  8, position: 5 },
  { id: 'r6', username: 'goleiro_nato',  full_name: 'Lucas Ferreira',avatar_url: null, total_points: 28, total_predictions: 14, exact_scores: 1, correct_results:  7, position: 6 },
  { id: 'r7', username: 'fanático26',   full_name: 'Mariana Costa', avatar_url: null, total_points: 19, total_predictions: 10, exact_scores: 1, correct_results:  5, position: 7 },
  { id: 'r8', username: 'zagueirão',    full_name: 'Rafael Souza',  avatar_url: null, total_points:  8, total_predictions:  6, exact_scores: 0, correct_results:  3, position: 8 },
]

// ─── Campeão da Demo (Copa finalizada) ──────────────────────────
export const DEMO_CHAMPION = {
  team: 'Brasil',
  flag: '🇧🇷',
  finalScore: '2 × 1',
  opponent: 'Bélgica',
  opponentFlag: '🇧🇪',
}

// ─── Jogos fictícios (TODOS FINALIZADOS) ────────────────────────
// No modo demo a Copa já acabou e o Brasil é campeão
const pastDate = (daysAgo, hour = 18) => {
  const dt = new Date()
  dt.setDate(dt.getDate() - daysAgo)
  dt.setHours(hour, 0, 0, 0)
  return dt.toISOString()
}

export const DEMO_GAMES = [
  // Fase de Grupos — todos concluídos
  { id: 'g1',  home_team: 'Brasil',    away_team: 'Argentina',     home_flag: '🇧🇷', away_flag: '🇦🇷', match_date: pastDate(30, 15), round: 'Fase de Grupos', home_score: 2, away_score: 1, group: 'A' },
  { id: 'g2',  home_team: 'França',    away_team: 'Alemanha',      home_flag: '🇫🇷', away_flag: '🇩🇪', match_date: pastDate(29, 18), round: 'Fase de Grupos', home_score: 1, away_score: 1, group: 'B' },
  { id: 'g3',  home_team: 'Portugal',  away_team: 'Espanha',       home_flag: '🇵🇹', away_flag: '🇪🇸', match_date: pastDate(28, 21), round: 'Fase de Grupos', home_score: 3, away_score: 2, group: 'C' },
  { id: 'g4',  home_team: 'Itália',    away_team: 'Inglaterra',    home_flag: '🇮🇹', away_flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', match_date: pastDate(27, 15), round: 'Fase de Grupos', home_score: 0, away_score: 1, group: 'D' },
  { id: 'g5',  home_team: 'México',    away_team: 'EUA',           home_flag: '🇲🇽', away_flag: '🇺🇸', match_date: pastDate(26, 18), round: 'Fase de Grupos', home_score: 2, away_score: 2, group: 'E' },
  { id: 'g6',  home_team: 'Marrocos',  away_team: 'Senegal',       home_flag: '🇲🇦', away_flag: '🇸🇳', match_date: pastDate(25, 21), round: 'Fase de Grupos', home_score: 1, away_score: 0, group: 'F' },
  { id: 'g7',  home_team: 'Japão',     away_team: 'Coreia do Sul', home_flag: '🇯🇵', away_flag: '🇰🇷', match_date: pastDate(24, 15), round: 'Fase de Grupos', home_score: 2, away_score: 1, group: 'G' },
  { id: 'g8',  home_team: 'Holanda',   away_team: 'Bélgica',       home_flag: '🇳🇱', away_flag: '🇧🇪', match_date: pastDate(23, 18), round: 'Fase de Grupos', home_score: 0, away_score: 2, group: 'H' },
  { id: 'g9',  home_team: 'Uruguai',   away_team: 'Colômbia',      home_flag: '🇺🇾', away_flag: '🇨🇴', match_date: pastDate(22, 21), round: 'Fase de Grupos', home_score: 1, away_score: 1, group: 'A' },
  // Oitavas de Final — concluídos
  { id: 'g10', home_team: 'Brasil',    away_team: 'França',        home_flag: '🇧🇷', away_flag: '🇫🇷', match_date: pastDate(15, 18), round: 'Oitavas',        home_score: 3, away_score: 1, group: null },
  { id: 'g11', home_team: 'Portugal',  away_team: 'Inglaterra',    home_flag: '🇵🇹', away_flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', match_date: pastDate(14, 21), round: 'Oitavas',        home_score: 2, away_score: 2, group: null },
  // Final — concluída: Brasil Campeão!
  { id: 'g12', home_team: 'Brasil',    away_team: 'Bélgica',       home_flag: '🇧🇷', away_flag: '🇧🇪', match_date: pastDate(3, 16),  round: 'Final',          home_score: 2, away_score: 1, group: null },
]

// ─── Palpites fictícios do usuário demo (TODOS OS JOGOS) ────────
export const DEMO_PREDICTIONS = [
  { id: 'p1',  user_id: 'demo-user-id', game_id: 'g1',  home_score: 2, away_score: 0, points: 3 },
  { id: 'p2',  user_id: 'demo-user-id', game_id: 'g2',  home_score: 1, away_score: 1, points: 5 },
  { id: 'p3',  user_id: 'demo-user-id', game_id: 'g3',  home_score: 2, away_score: 1, points: 3 },
  { id: 'p4',  user_id: 'demo-user-id', game_id: 'g4',  home_score: 1, away_score: 1, points: 0 },
  { id: 'p5',  user_id: 'demo-user-id', game_id: 'g5',  home_score: 2, away_score: 2, points: 5 },
  { id: 'p6',  user_id: 'demo-user-id', game_id: 'g6',  home_score: 1, away_score: 0, points: 5 },
  { id: 'p7',  user_id: 'demo-user-id', game_id: 'g7',  home_score: 1, away_score: 0, points: 3 },
  { id: 'p8',  user_id: 'demo-user-id', game_id: 'g8',  home_score: 0, away_score: 2, points: 5 },
  { id: 'p9',  user_id: 'demo-user-id', game_id: 'g9',  home_score: 2, away_score: 1, points: 0 },
  { id: 'p10', user_id: 'demo-user-id', game_id: 'g10', home_score: 3, away_score: 1, points: 5 },
  { id: 'p11', user_id: 'demo-user-id', game_id: 'g11', home_score: 1, away_score: 2, points: 3 },
  { id: 'p12', user_id: 'demo-user-id', game_id: 'g12', home_score: 2, away_score: 1, points: 5 },
]

// ─── Jogos do Chaveamento (73 a 104) ────────────────────────────
export const DEMO_BRACKET_GAMES = [
  // Round of 32 (73-88)
  { match_number: 73, home_team: 'Brasil', away_team: 'Uruguai', home_score: 2, away_score: 0 },
  { match_number: 74, home_team: 'Argentina', away_team: 'Chile', home_score: 3, away_score: 1 },
  { match_number: 75, home_team: 'França', away_team: 'Suíça', home_score: 2, away_score: 1 },
  { match_number: 76, home_team: 'Inglaterra', away_team: 'Equador', home_score: 1, away_score: 0 },
  { match_number: 77, home_team: 'Espanha', away_team: 'Japão', home_score: 2, away_score: 2 },
  { match_number: 78, home_team: 'Alemanha', away_team: 'Marrocos', home_score: 3, away_score: 0 },
  { match_number: 79, home_team: 'Portugal', away_team: 'Senegal', home_score: 1, away_score: 1 },
  { match_number: 80, home_team: 'Holanda', away_team: 'EUA', home_score: 2, away_score: 0 },
  { match_number: 81, home_team: 'Itália', away_team: 'Colômbia', home_score: 1, away_score: 2 },
  { match_number: 82, home_team: 'Bélgica', away_team: 'Canadá', home_score: 2, away_score: 1 },
  { match_number: 83, home_team: 'Croácia', away_team: 'Dinamarca', home_score: 0, away_score: 0 },
  { match_number: 84, home_team: 'México', away_team: 'Polônia', home_score: 1, away_score: 0 },
  { match_number: 85, home_team: 'Suécia', away_team: 'Sérvia', home_score: 2, away_score: 1 },
  { match_number: 86, home_team: 'Austrália', away_team: 'C. do Marfim', home_score: 0, away_score: 1 },
  { match_number: 87, home_team: 'Peru', away_team: 'Camarões', home_score: 1, away_score: 2 },
  { match_number: 88, home_team: 'Nigéria', away_team: 'Coreia do Sul', home_score: 1, away_score: 1 },
  
  // Round of 16 (89-96)
  { match_number: 89, home_team: 'Brasil', away_team: 'Colômbia', home_score: 2, away_score: 1 },
  { match_number: 90, home_team: 'Argentina', away_team: 'Inglaterra', home_score: 1, away_score: 0 },
  { match_number: 91, home_team: 'França', away_team: 'Alemanha', home_score: 0, away_score: 1 },
  { match_number: 92, home_team: 'Portugal', away_team: 'Holanda', home_score: 2, away_score: 2 },
  { match_number: 93, home_team: 'Itália', away_team: 'Croácia', home_score: 1, away_score: 0 },
  { match_number: 94, home_team: 'Bélgica', away_team: 'México', home_score: 3, away_score: 1 },
  { match_number: 95, home_team: 'Suécia', away_team: 'Camarões', home_score: 1, away_score: 0 },
  { match_number: 96, home_team: 'C. do Marfim', away_team: 'Nigéria', home_score: 2, away_score: 1 },

  // Quarter-finals (97-100)
  { match_number: 97, home_team: 'Brasil', away_team: 'Itália', home_score: 2, away_score: 0 },
  { match_number: 98, home_team: 'Argentina', away_team: 'Bélgica', home_score: 1, away_score: 2 },
  { match_number: 99, home_team: 'Alemanha', away_team: 'Suécia', home_score: 3, away_score: 0 },
  { match_number: 100, home_team: 'Holanda', away_team: 'C. do Marfim', home_score: 2, away_score: 1 },

  // Semi-finals (101-102)
  { match_number: 101, home_team: 'Brasil', away_team: 'Alemanha', home_score: 2, away_score: 1 },
  { match_number: 102, home_team: 'Bélgica', away_team: 'Holanda', home_score: 1, away_score: 0 },

  // Third Place (103)
  { match_number: 103, home_team: 'Alemanha', away_team: 'Holanda', home_score: 2, away_score: 3 },

  // Final (104) — BRASIL CAMPEÃO! 🏆
  { match_number: 104, home_team: 'Brasil', away_team: 'Bélgica', home_score: 2, away_score: 1 }
]

// ─── Provider ───────────────────────────────────────────────────
export function DemoProvider({ children }) {
  const [isDemo, setIsDemo] = useState(false)

  function enterDemo() {
    setIsDemo(true)
  }

  function exitDemo() {
    setIsDemo(false)
  }

  return (
    <DemoContext.Provider value={{ isDemo, enterDemo, exitDemo }}>
      {children}
    </DemoContext.Provider>
  )
}

export const useDemo = () => useContext(DemoContext)
