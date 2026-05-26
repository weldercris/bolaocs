import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DemoProvider } from './contexts/DemoContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useDemo } from './contexts/DemoContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GamesPage from './pages/GamesPage'
import PredictionsPage from './pages/PredictionsPage'
import RankingPage from './pages/RankingPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import BracketPage from './pages/BracketPage'
import LoadingScreen from './components/ui/LoadingScreen'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const { isDemo } = useDemo()
  if (loading) return <LoadingScreen />
  return (user || isDemo) ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return profile?.is_admin ? children : <Navigate to="/" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  const { isDemo } = useDemo()
  if (loading) return <LoadingScreen />
  return (!user && !isDemo) ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <DemoProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/cadastro" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<HomePage />} />
              <Route path="jogos" element={<GamesPage />} />
              <Route path="palpites" element={<PredictionsPage />} />
              <Route path="chaveamento" element={<BracketPage />} />
              <Route path="ranking" element={<RankingPage />} />
              <Route path="perfil" element={<ProfilePage />} />
              <Route path="admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </DemoProvider>
  )
}

