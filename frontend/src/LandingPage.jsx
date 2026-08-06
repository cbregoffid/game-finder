import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    setTransitioning(false)
  }, [])

  const handleStart = () => {
    setTransitioning(true)
    setTimeout(() => navigate('/adjectives'), 300)
  }

  const handleSettings = () => {
    navigate('/settings')
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-24"
      style={{
        position: 'relative', 
        zIndex: 1,
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'scale(1.5)' : 'scale(1)',
        transition: 'opacity 0.3s, transform 0.3s'
      }}
    >
      <h1 
        className="landing-title"
      >
        GAME FINDER
      </h1>
      <div className="flex gap-8" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="pixel-btn" onClick={handleStart}>
          Start
        </button>
        <button className="pixel-btn">
          About
        </button>
        <button className="pixel-btn" onClick={handleSettings}>
          Settings
        </button>
      </div>
    </div>
  )
}

export default LandingPage