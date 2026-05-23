import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import cityBg from './assets/cityBg.png'
import cityBgNight from './assets/cityBg_night.png'
import LandingPage from './LandingPage'
import AdjectivesPage from './AdjectivesPage'
import GamesPage from './GamesPage'
import ResultsPage from './ResultsPage'

function Background() {
  const location = useLocation()
  const isNight = location.pathname !== '/'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <div className="animate-scroll flex h-full" style={{ width: '200%' }}>
        <img src={cityBg} className="h-full flex-shrink-0" style={{ width: '50%' }} />
        <img src={cityBg} className="h-full flex-shrink-0" style={{ width: '50%' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: isNight ? 1 : 0, transition: 'opacity 3000ms' }}>
        <div className="animate-scroll flex h-full" style={{ width: '200%' }}>
          <img src={cityBgNight} className="h-full flex-shrink-0" style={{ width: '50%' }} />
          <img src={cityBgNight} className="h-full flex-shrink-0" style={{ width: '50%' }} />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <Background />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/adjectives" element={<AdjectivesPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App