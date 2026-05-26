// High-fidelity Mock Supabase Client that runs 100% locally in the browser
// This ensures NO network requests are made, keeping queries and passwords entirely hidden.

import { DEMO_GAMES, DEMO_RANKING, DEMO_PREDICTIONS } from '../contexts/DemoContext'

// Helper to load/save from localStorage
const getLocal = (key, fallback) => {
  const val = localStorage.getItem(key)
  if (!val) {
    localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }
  return JSON.parse(val)
}

const saveLocal = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

// Initial Data Population
const initialUsers = [
  { id: 'r1', email: 'craque@suri.ai', username: 'craque_silva', full_name: 'Carlos Silva', is_admin: false },
  { id: 'r2', email: 'palpiteiro@chatbotmaker.io', username: 'palpiteiro10', full_name: 'João Matos', is_admin: false },
  { id: 'admin-user-id', email: 'admin@suri.ai', username: 'admin_bolao', full_name: 'Administrador Principal', is_admin: true }
]

const initialProfiles = [
  { id: 'r1', username: 'craque_silva', full_name: 'Carlos Silva', avatar_url: null, is_admin: false, created_at: new Date().toISOString() },
  { id: 'r2', username: 'palpiteiro10', full_name: 'João Matos', avatar_url: null, is_admin: false, created_at: new Date().toISOString() },
  { id: 'admin-user-id', username: 'admin_bolao', full_name: 'Administrador Principal', avatar_url: null, is_admin: true, created_at: new Date().toISOString() }
]

// Convert DEMO_GAMES to matches
const initialGames = DEMO_GAMES.map(g => ({
  id: g.id,
  home_team: g.home_team,
  away_team: g.away_team,
  home_flag: g.home_flag,
  away_flag: g.away_flag,
  match_date: g.match_date,
  stadium: g.stadium || 'Estádio da Copa',
  round: g.round,
  group_name: g.group || 'A',
  home_score: g.home_score,
  away_score: g.away_score,
  penalty_home_score: g.penalty_home_score || null,
  penalty_away_score: g.penalty_away_score || null,
  allow_predictions: true
}))

// Simple points calculator
function calculatePoints(predHome, predAway, gameHome, gameAway) {
  if (gameHome === null || gameAway === null || gameHome === undefined || gameAway === undefined) return null
  const ph = parseInt(predHome)
  const pa = parseInt(predAway)
  const gh = parseInt(gameHome)
  const ga = parseInt(gameAway)

  if (ph === gh && pa === ga) return 5 // Placar Exato

  const gameOutcome = Math.sign(gh - ga)
  const predOutcome = Math.sign(ph - pa)

  if (gameOutcome === predOutcome) {
    if ((gh - ga) === (ph - pa)) return 4 // Outcome + Diff
    return 3 // Outcome only
  }
  return 0
}

// Database simulation core
class LocalDatabase {
  constructor() {
    this.users = getLocal('bolao_users', initialUsers)
    this.profiles = getLocal('bolao_profiles', initialProfiles)
    this.games = getLocal('bolao_games', initialGames)
    this.predictions = getLocal('bolao_predictions', DEMO_PREDICTIONS)
    this.session = getLocal('bolao_session', null)
    this.authListeners = []
  }

  save() {
    saveLocal('bolao_users', this.users)
    saveLocal('bolao_profiles', this.profiles)
    saveLocal('bolao_games', this.games)
    saveLocal('bolao_predictions', this.predictions)
    saveLocal('bolao_session', this.session)
  }

  // Auth Operations
  signUp(email, password, username, fullName) {
    const emailDomain = email.split('@')[1]?.toLowerCase()
    const allowedDomains = ['suri.ai', 'chatbotmaker.io']
    if (!allowedDomains.includes(emailDomain)) {
      return { error: { message: 'Acesso restrito. Use email @suri.ai ou @chatbotmaker.io' } }
    }

    if (this.users.some(u => u.email === email)) {
      return { error: { message: 'Email já cadastrado' } }
    }
    if (this.users.some(u => u.username === username)) {
      return { error: { message: 'Username já em uso' } }
    }

    const id = 'user-' + Math.random().toString(36).substr(2, 9)
    const newUser = { id, email, username, full_name: fullName, is_admin: false }
    const newProfile = { id, username, full_name: fullName, avatar_url: null, is_admin: false, created_at: new Date().toISOString() }

    this.users.push(newUser)
    this.profiles.push(newProfile)
    this.save()

    return { data: { user: newUser }, error: null }
  }

  signIn(email, password) {
    const user = this.users.find(u => u.email === email)
    if (!user) {
      return { error: { message: 'Email ou senha inválidos' } }
    }

    const profile = this.profiles.find(p => p.id === user.id)
    this.session = { user, profile }
    this.save()

    this.notifyAuthChange('SIGNED_IN')
    return { data: { session: this.session }, error: null }
  }

  signOut() {
    this.session = null
    this.save()
    this.notifyAuthChange('SIGNED_OUT')
    return { error: null }
  }

  notifyAuthChange(event) {
    this.authListeners.forEach(l => l(event, this.session))
  }

  subscribeAuth(callback) {
    this.authListeners.push(callback)
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.authListeners = this.authListeners.filter(l => l !== callback)
          }
        }
      }
    }
  }

  // Get current active ranking
  getRanking() {
    // Recompute total ranking points dynamically
    const rankingMap = {}

    // Init ranking map for all profiles
    this.profiles.forEach(p => {
      rankingMap[p.id] = {
        id: p.id,
        username: p.username,
        full_name: p.full_name,
        avatar_url: p.avatar_url,
        total_points: 0,
        total_predictions: 0,
        exact_scores: 0,
        correct_results: 0,
        is_admin: p.is_admin
      }
    })

    // Compute points based on predictions and games
    this.predictions.forEach(pred => {
      const game = this.games.find(g => g.id === pred.game_id)
      if (!game || game.home_score === null || game.away_score === null) return

      const pts = calculatePoints(pred.home_score, pred.away_score, game.home_score, game.away_score)
      if (pts !== null) {
        if (!rankingMap[pred.user_id]) return
        rankingMap[pred.user_id].total_predictions += 1
        rankingMap[pred.user_id].total_points += pts
        if (pts === 5) rankingMap[pred.user_id].exact_scores += 1
        if (pts >= 3) rankingMap[pred.user_id].correct_results += 1
      }
    })

    // Sort rankings
    const sorted = Object.values(rankingMap)
      .sort((a, b) => b.total_points - a.total_points || b.exact_scores - a.exact_scores)

    // Apply positions
    return sorted.map((p, index) => ({ ...p, position: index + 1 }))
  }
}

const db = new LocalDatabase()

// Supabase client builder simulation
class QueryBuilder {
  constructor(table) {
    this.table = table
    this.filters = []
    this.orders = []
    this.limitVal = null
    this.isSingle = false
    this.isMaybeSingle = false
  }

  select(fields) {
    return this
  }

  eq(field, value) {
    this.filters.push(item => item[field] === value)
    return this
  }

  gte(field, value) {
    this.filters.push(item => new Date(item[field]) >= new Date(value))
    return this
  }

  order(field, { ascending = true } = {}) {
    this.orders.push((a, b) => {
      if (a[field] < b[field]) return ascending ? -1 : 1
      if (a[field] > b[field]) return ascending ? 1 : -1
      return 0
    })
    return this
  }

  limit(val) {
    this.limitVal = val
    return this
  }

  single() {
    this.isSingle = true
    return this
  }

  maybeSingle() {
    this.isMaybeSingle = true
    return this
  }

  async executeGet() {
    let list = []
    if (this.table === 'ranking') {
      list = db.getRanking()
    } else {
      list = [...db[this.table]]
    }

    // Apply filters
    this.filters.forEach(filterFn => {
      list = list.filter(filterFn)
    })

    // Apply orders
    this.orders.forEach(orderFn => {
      list.sort(orderFn)
    })

    // Apply limit
    if (this.limitVal !== null) {
      list = list.slice(0, this.limitVal)
    }

    if (this.isSingle) {
      if (list.length === 0) return { data: null, error: { message: 'Registro não encontrado' } }
      return { data: list[0], error: null }
    }

    if (this.isMaybeSingle) {
      return { data: list.length > 0 ? list[0] : null, error: null }
    }

    return { data: list, error: null }
  }

  // Promise resolution support so we can "await supabase.from('...').select(...)"
  then(onfulfilled, onrejected) {
    return this.executeGet().then(onfulfilled, onrejected)
  }

  async update(updates) {
    let count = 0
    let updatedList = []

    db[this.table] = db[this.table].map(item => {
      let match = true
      this.filters.forEach(filterFn => {
        if (!filterFn(item)) match = false
      })

      if (match) {
        count++
        const updated = { ...item, ...updates }
        updatedList.push(updated)
        return updated
      }
      return item
    })

    db.save()
    return { data: updatedList, error: null }
  }

  async insert(data) {
    const list = Array.isArray(data) ? data : [data]
    list.forEach(item => {
      if (!item.id) item.id = 'id-' + Math.random().toString(36).substr(2, 9)
      db[this.table].push(item)
    })
    db.save()
    return { data, error: null }
  }

  async upsert(data) {
    const list = Array.isArray(data) ? data : [data]
    list.forEach(item => {
      const idx = db[this.table].findIndex(x => x.game_id === item.game_id && x.user_id === item.user_id)
      if (idx !== -1) {
        db[this.table][idx] = { ...db[this.table][idx], ...item }
      } else {
        if (!item.id) item.id = 'pred-' + Math.random().toString(36).substr(2, 9)
        db[this.table].push(item)
      }
    })
    db.save()
    return { data, error: null }
  }

  async delete() {
    db[this.table] = db[this.table].filter(item => {
      let match = true
      this.filters.forEach(filterFn => {
        if (!filterFn(item)) match = false
      })
      return !match
    })
    db.save()
    return { error: null }
  }
}

// Client Export
export const supabaseMock = {
  auth: {
    signUp: async ({ email, password, options }) => {
      const username = options?.data?.username || ''
      const fullName = options?.data?.full_name || ''
      return db.signUp(email, password, username, fullName)
    },
    signInWithPassword: async ({ email, password }) => {
      return db.signIn(email, password)
    },
    signOut: async () => {
      return db.signOut()
    },
    getSession: async () => {
      return { data: { session: db.session }, error: null }
    },
    onAuthStateChange: (callback) => {
      return db.subscribeAuth(callback)
    }
  },

  from: (table) => {
    return new QueryBuilder(table)
  },

  storage: {
    from: () => ({
      upload: async (fileName, file) => {
        // Mock file upload: save mock base64/object URL
        return { data: { path: fileName }, error: null }
      },
      getPublicUrl: (fileName) => {
        // Return a soccer ball or placeholder so it's a completely local URL
        return { data: { publicUrl: null } }
      }
    })
  }
}
