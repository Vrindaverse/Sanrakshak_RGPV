import { Route, Routes } from 'react-router-dom'
import { CustomCursor } from './components/layout/CustomCursor'
import { Grain } from './components/layout/Grain'
import { ScrollProgress } from './components/layout/ScrollProgress'
import { InfoPage } from './pages/InfoPage'
import { LandingPage } from './pages/LandingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RegisterPage } from './pages/RegisterPage'
import { LoginPage } from './pages/LoginPage'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <Grain />
      <ScrollProgress />
      <CustomCursor />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/docs" element={<InfoPage kind="docs" />} />
        <Route path="/privacy" element={<InfoPage kind="privacy" />} />
        <Route path="/terms" element={<InfoPage kind="terms" />} />
        <Route path="/contact" element={<InfoPage kind="contact" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}
