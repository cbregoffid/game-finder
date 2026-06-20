import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ResultsPage({ adjectives, games, setAdjectives, setGames }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleReset = () => {
    setAdjectives([])
    setGames([null, null, null])
    navigate('/')
  }

  const handleBack = () => {
    navigate('/games')
  }

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      const response = await fetch('http://localhost:8000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adjectives: adjectives,
          game_names: games.filter(game => game !== null).map(game => game.name)
        })
      })
      const data = await response.json()
      setLoading(false)
      setResults(data.results)
    }
    fetchResults()
  }, [])

  return (

    <div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {results.map((result, index) => (
            <div key={index} style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '24px',
              animation: `fadeInUp 0.5s ease forwards`,
              animationDelay: `${index * 0.15}s`,
              opacity: 0,
              maxWidth: '600px',
              margin: '16px auto 16px auto'
            }}>
              <h2 style={{ fontSize: '14px', color: 'white', fontFamily: "'Press Start 2P', cursive", marginBottom: '8px' }}>{result.name}</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>{result.summary}</p>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
            <button onClick={handleBack} className="pixel-btn">Back</button>
            <button onClick={handleReset} className="pixel-btn">Start Over</button>
          </div>
          
        </div>
      )}
    </div>
  )
}

export default ResultsPage