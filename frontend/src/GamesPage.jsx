import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function GamesPage({ games, setGames }) {
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [activeSlot, setActiveSlot] = useState(null)
  const [hoveredSlot, setHoveredSlot] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (input.length < 2) {
      setSuggestions([])
      return
    }

    let cancelled = false

    const fetchSuggestions = async () => {
      const response = await fetch(`http://localhost:8000/search-games?query=${input}`)
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
    setTransitioning(true)
    setTimeout(() => navigate('/results'), 500)
  }

  const handleBack = () => {
    navigate('/adjectives')
  }

  return (
    <div>
      {activeSlot !== null ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <input
            className="pixel-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ background: 'white', color: 'black', padding: '8px' }}
          />
          {suggestions.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 10, background: 'white', color: 'black', width: '100%' }}>
              {suggestions.map((suggestion) => (
                <div key={suggestion.name} onClick={() => handleAddGame(suggestion)}>
                  <img src={suggestion.cover} style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                  <span>{suggestion.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

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
        <button onClick={handleBack} className="pixel-btn">Back</button>
        <button className="pixel-btn" onClick={handleNext}>Next</button>
      </div>
    </div>
  )
}

export default GamesPage