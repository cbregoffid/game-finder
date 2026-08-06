import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AdjectivesPage({ adjectives, setAdjectives }) {
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [flickering, setFlickering] = useState([false, false, false])
  const [flickeringOut, setFlickeringOut] = useState([false, false, false])
  const navigate = useNavigate()
  const [error, setError] = useState("")

  useEffect(() => {
    if (input.length < 2) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      const response = await fetch(`https://api.datamuse.com/words?sp=${input}*&max=8&md=p`)
      const data = await response.json()
      const filtered = data.filter(w =>
        w.tags &&
        w.tags.includes('adj') &&
        !w.word.includes(' ') &&
        !w.word.includes(','))
        .sort((a, b) => {
          if (a.word === input) return -1
          if (b.word === input) return 1
          return 0
        })
      setSuggestions(filtered)
    }

    fetchSuggestions()
  }, [input])

  const getFontSize = (word) => {
    const scale = window.innerWidth <= 480 ? 3 : 1
    const threshold = 10
    const baseline = 4 * scale
    if (word.length <= threshold) return `${baseline}vw`
    const size = (baseline * threshold) / word.length
    return `${Math.max(scale, size)}vw`
  }

  const handleNext = () => {
    if (adjectives.every(a => a === null)) {
      setError("Please add at least one adjective")
      setTimeout(() => setError(""), 3000)
      return
    }
    setError("")
    navigate('/games')
  }

  const handleBack = () => {
    navigate('/')
  }

  const handleAddAdjective = (word) => {
    if (adjectives.includes(word)) return
    const emptySlot = adjectives.indexOf(null)
    if (emptySlot === -1) return
    const updated = [...adjectives]
    updated[emptySlot] = word
    setAdjectives(updated)
    const newFlickering = [false, false, false]
    newFlickering[emptySlot] = true
    setFlickering(newFlickering)
    setTimeout(() => setFlickering([false, false, false]), 2000)

    setInput("")
    setSuggestions([])
  }

  const handleRemoveAdjective = (word) => {
    const index = adjectives.indexOf(word)
    const newFlickeringOut = [false, false, false]
    newFlickeringOut[index] = true
    setFlickeringOut(newFlickeringOut)
    setTimeout(() => {
      const updated = [...adjectives]
      updated[index] = null
      setAdjectives(updated)
      setFlickeringOut([false, false, false])
    }, 800)
  }

  const neonColors = ['#00ffff', '#ff00ff', '#bf00ff', '#ff6600', '#00ff99']
  const neonTextColors = ['#ff00ff', '#00ffff', '#ff6600', '#00ff99', '#bf00ff']

  return (
    <div style={{ position: 'relative' }}>
      {error && (
        <p className="error-fade" style={{ position: 'absolute', top: '-20px', width: '100%', color: 'red', textAlign: 'center', fontFamily: "'Press Start 2P', cursive", fontSize: '10px' }}>
          {error}
        </p>
      )}

      <div className="pixel-box">
        <input
          className="pixel-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter an adjective..."
        />
        <div className="pixel-dropdown" style={{ position: 'absolute', top: '100%', zIndex: 10 }}>
          {suggestions.map((suggestion) => (
            <div key={suggestion.word} className="pixel-dropdown-item" onClick={() => handleAddAdjective(suggestion.word)}>
              {suggestion.word}
            </div>
          ))}
        </div>
      </div>
      <div className="neon-row">
        {[0, 1, 2].map((slot) => (
          <div key={slot} className="neon-slot" style={{
            color: neonTextColors[slot],
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            textShadow: `0 0 5px ${neonTextColors[slot]}, 0 0 8px ${neonTextColors[slot]}`,
            border: `2px solid ${neonColors[slot]}`,
            boxShadow: `0 0 10px ${neonColors[slot]}, 0 0 20px ${neonColors[slot]}`,
            fontSize: adjectives[slot] ? getFontSize(adjectives[slot]) : '4vw',
            fontFamily: 'Boxigen, sans-serif',
          }}>

            {adjectives[slot] ? (
              <>
                <span className={flickeringOut[slot] ? 'neon-flicker-out' : flickering[slot] ? 'neon-flicker' : ''}>
                  {adjectives[slot]}
                  <button
                    className="neon-x-btn"
                    onClick={() => handleRemoveAdjective(adjectives[slot])}
                  >✕</button>
                </span>
              </>
            ) : ''}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 32px', position: 'fixed', bottom: 0, left: 0, right: 0 }}>
        <button onClick={handleBack} className="pixel-btn-night">Back</button>
        <button className="pixel-btn-night" onClick={handleNext}>Next</button>
      </div>

    </div>
  )
}

export default AdjectivesPage