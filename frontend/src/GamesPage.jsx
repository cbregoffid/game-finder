import { useState, useEffect } from 'react'

function GamesPage() {
  const [input, setInput] = useState("")
  const [games, setGames] = useState([null, null, null])
  const [suggestions, setSuggestions] = useState([])
  const [activeSlot, setActiveSlot] = useState(null)

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

    </div>
  )
}

export default GamesPage