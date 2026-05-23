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
    setTimeout(() => navigate('/adjectives'), 500)
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
        className="text-8xl font-bold text-white mb-20"
        style={{ 
          fontFamily: "'Uncial Antiqua', cursive",
          textShadow: '1px 1px 4px #8B3A2A'
        }}
      >
        GAME FINDER
      </h1>
      <div className="flex gap-8">
        <button className="pixel-btn" onClick={handleStart}>
          Start
        </button>
        <button className="pixel-btn">
          About
        </button>
        <button className="pixel-btn">
          Settings
        </button>
      </div>
    </div>
  )
}

export default LandingPage