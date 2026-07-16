import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import cityBg from './assets/cityBg.png'
import cityBgNight from './assets/cityBg_night.png'
import cityBgMorning from './assets/cityBg_morning.png'
import cityBgDay from './assets/cityBg_day.png'
import LandingPage from './LandingPage'
import AdjectivesPage from './AdjectivesPage'
import GamesPage from './GamesPage'
import ResultsPage from './ResultsPage'

function Background() {
  const location = useLocation()
  const isNight = location.pathname == '/adjectives'
  const isMorning = location.pathname == '/games'
  const isDay = location.pathname == '/results'


  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      <div className="animate-scroll flex h-full" style={{ width: '200%', position: 'relative' }}>
        {/* Day layer - always visible as base */}
        <img src={cityBg} className="h-full flex-shrink-0" style={{ width: '50%', position: 'absolute', top: 0, left: 0 }} />
        <img src={cityBg} className="h-full flex-shrink-0" style={{ width: '50%', position: 'absolute', top: 0, left: '50%' }} />

        {/* Night layer */}
        <img src={cityBgNight} className="h-full flex-shrink-0" style={{ width: '50%', position: 'absolute', top: 0, left: 0, opacity: isNight ? 1 : 0, transition: 'opacity 4000ms' }} />
        <img src={cityBgNight} className="h-full flex-shrink-0" style={{ width: '50%', position: 'absolute', top: 0, left: '50%', opacity: isNight ? 1 : 0, transition: 'opacity 4000ms' }} />

        {/* Morning layer */}
        <img src={cityBgMorning} className="h-full flex-shrink-0" style={{ width: '50%', position: 'absolute', top: 0, left: 0, opacity: isMorning ? 1 : 0, transition: 'opacity 4000ms' }} />
        <img src={cityBgMorning} className="h-full flex-shrink-0" style={{ width: '50%', position: 'absolute', top: 0, left: '50%', opacity: isMorning ? 1 : 0, transition: 'opacity 4000ms' }} />

        {/* Day layer */}
        <img src={cityBgDay} className="h-full flex-shrink-0" style={{ width: '50%', position: 'absolute', top: 0, left: 0, opacity: isDay ? 1 : 0, transition: 'opacity 4000ms' }} />
        <img src={cityBgDay} className="h-full flex-shrink-0" style={{ width: '50%', position: 'absolute', top: 0, left: '50%', opacity: isDay ? 1 : 0, transition: 'opacity 4000ms' }} />
      </div>
    </div>
  )
}

function App() {
  const [adjectives, setAdjectives] = useState([])
  const [games, setGames] = useState([null, null, null])

  new Image().src = cityBgMorning
  new Image().src = cityBgNight
  new Image().src = cityBgDay

  useEffect(() => {
    fetch('https://game-finder-api-t4iu.onrender.com/search-games?query=a')
  }, [])

  return (
    <BrowserRouter>
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <Background />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/adjectives" element={<AdjectivesPage adjectives={adjectives} setAdjectives={setAdjectives} />} />
            <Route path="/games" element={<GamesPage games={games} setGames={setGames} />} />
            <Route path="/results" element={<ResultsPage adjectives={adjectives} games={games} setAdjectives={setAdjectives} setGames={setGames} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App