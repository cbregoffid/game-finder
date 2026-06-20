import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function GamesPage({ games, setGames }) {
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [activeSlot, setActiveSlot] = useState(null)
  const [hoveredSlot, setHoveredSlot] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (input.length < 2) {
      setSuggestions([])
      return
    }

    let cancelled = false

    const fetchSuggestions = async () => {
      const response = await fetch(`https://game-finder-api-t4iu.onrender.com/search-games?query=${input}`)
      const data = await response.json()
      if (!cancelled) {
        setSuggestions(data.results)
      }
    }

    fetchSuggestions()

    return () => {
      cancelled = true
    }
  }, [input])

  const handleAddGame = (game) => {
    const updated = [...games]
    updated[activeSlot] = game
    setGames(updated)
    setActiveSlot(null)
    setInput("")
    setSuggestions([])
  }

  const handleNext = () => {
    if (games.every(g => g === null)) {
      setError("Please add at least one game!")
      setTimeout(() => setError(""), 3000)
      return
    }
    setError("")
    setTransitioning(true)
    navigate('/results')
  }

  const handleBack = () => {
    navigate('/adjectives')
  }

  return (
    <div>
      {activeSlot !== null && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => { setActiveSlot(null); setInput(""); setSuggestions([]) }}
        >
          <div
            style={{ position: 'relative', marginBottom: '300px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              className="pixel-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for a game..."
              autoFocus
            />
            {suggestions.length > 0 && (
              <div className="pixel-dropdown" style={{ position: 'absolute', zIndex: 10, width: '400px' }}>
                {suggestions.map((suggestion) => (
                  <div className="pixel-dropdown-item" key={suggestion.name} onClick={() => handleAddGame(suggestion)}>
                    <img src={suggestion.cover} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                    <span>{suggestion.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="error-fade" style={{ position: 'fixed', top: '150px', width: '100%', color: 'red', textAlign: 'center', fontFamily: "'Press Start 2P', cursive", fontSize: '10px', zIndex: 50 }}>
          {error}
        </p>
      )}

      <div style={{ display: 'flex', gap: '4vw', justifyContent: 'center', marginTop: '200px' }}>
        {[0, 1, 2].map((slot) => (
          <div
            key={slot}
            onClick={() => setActiveSlot(slot)}
            onMouseEnter={() => setHoveredSlot(slot)}
            onMouseLeave={() => setHoveredSlot(null)}
            style={{
              width: '20vw',
              height: '27vw',
              backgroundColor: 'rgba(0,0,0,0.6)',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer'
            }}>
            {games[slot] ? (
              <>
                <img src={games[slot].cover} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                {hoveredSlot === slot && (
                  <div
                    onClick={(e) => { e.stopPropagation(); const updated = [...games]; updated[slot] = null; setGames(updated) }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '5vw',
                    }}
                  >
                    🗑️
                  </div>
                )}
              </>
            ) : (
              <button style={{ fontSize: '7vw', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>+</button>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 32px', position: 'fixed', bottom: 0, left: 0, right: 0 }}>
        <button onClick={handleBack} className="pixel-btn-morning">Back</button>
        <button className="pixel-btn-morning" onClick={handleNext}>Next</button>
      </div>
    </div>
  )
}

export default GamesPage