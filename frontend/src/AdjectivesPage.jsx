import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AdjectivesPage() {
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [adjectives, setAdjectives] = useState([])
  const [flickering, setFlickering] = useState([false, false, false])
  const [flickeringOut, setFlickeringOut] = useState([false, false, false])
  const navigate = useNavigate()
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    if (input.length < 2) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      const response = await fetch(`https://api.datamuse.com/words?sp=${input}*&max=8&md=p`)
      const data = await response.json()
      const filtered = data.filter(w => w.tags && w.tags.includes('adj') && !w.word.includes(' ') && !w.word.includes(',')).sort((a, b) => {
        if (a.word === input) return -1
        if (b.word === input) return 1
        return 0
      })
      setSuggestions(filtered)
    }

    fetchSuggestions()
  }, [input])

  const handleNext = () => {
    setTransitioning(true)
    setTimeout(() => navigate('/games'), 500)
  }
  const handleAddAdjective = (word) => {
    if (adjectives.includes(word)) return
    if (adjectives.length >= 3) return
    const newIndex = adjectives.length
    setAdjectives([...adjectives, word])
    const newFlickering = [false, false, false]
    newFlickering[newIndex] = true
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
      setAdjectives(adjectives.filter(a => a !== word))
      setFlickeringOut([false, false, false])
    }, 800)
  }

  const neonColors = ['#00ffff', '#ff00ff', '#bf00ff', '#ff6600', '#00ff99']
  const neonTextColors = ['#ff00ff', '#00ffff', '#ff6600', '#00ff99', '#bf00ff']

  return (
    <div>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ background: 'white', color: 'black', padding: '8px' }}
        />
        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 10, background: 'white', color: 'black', width: '100%' }}>
          {suggestions.map((suggestion) => (
            <div key={suggestion.word} onClick={() => handleAddAdjective(suggestion.word)}>
              {suggestion.word}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '4vw', justifyContent: 'center', marginTop: '400px' }}>
        {[0, 1, 2].map((slot) => (
          <div key={slot} style={{
            color: neonTextColors[slot],
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            textShadow: `0 0 5px ${neonTextColors[slot]}, 0 0 8px ${neonTextColors[slot]}`,
            border: `2px solid ${neonColors[slot]}`,
            boxShadow: `0 0 10px ${neonColors[slot]}, 0 0 20px ${neonColors[slot]}`,
            borderRadius: '4px',
            width: '25vw',
            height: '15vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4vw',
            fontFamily: 'Boxigen, sans-serif',
            position: 'relative',
          }}>
            {adjectives[slot] ? (
              <>
                <span className={flickeringOut[slot] ? 'neon-flicker-out' : flickering[slot] ? 'neon-flicker' : ''}>
                  {adjectives[slot]}
                  <button
                    onClick={() => handleRemoveAdjective(adjectives[slot])}
                    style={{
                      position: 'absolute',
                      top: '0.5vw',
                      right: '1.2vw',
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      fontSize: '2vw',
                    }}
                  >✕</button>
                </span>
              </>
            ) : ''}
          </div>
        ))}
      </div>

      <div>
        <button onClick={handleNext}>Next</button>
      </div>

    </div>
  )
}

export default AdjectivesPage