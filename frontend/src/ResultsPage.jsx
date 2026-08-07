import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import xIcon from './assets/xIcon.png'

function ResultsPage({ adjectives, games, setAdjectives, setGames, platforms, setPlatforms }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [referenceFranchiseIds, setReferenceFranchiseIds] = useState([])
  const [hideSequels, setHideSequels] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [visibleCount, setVisibleCount] = useState(10)
  const navigate = useNavigate()

  const handleReset = () => {
    setAdjectives([null, null, null])
    setGames([null, null, null])
    setPlatforms([])
    navigate('/')
  }

  const handleBack = () => {
    navigate('/games')
  }

  const isSequel = (result) => {
    return result.franchise_ids.some(id => referenceFranchiseIds.includes(id))
  }

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adjectives: adjectives.filter(a => a !== null),
          game_names: games.filter(game => game !== null).map(game => game.name),
          platforms: platforms
        })
      })
      const data = await response.json()
      setLoading(false)
      setResults(data.results)
      setReferenceFranchiseIds(data.reference_franchise_ids)
    }
    fetchResults()
  }, [])

  const displayedResults = hideSequels ? results.filter(result => !isSequel(result)) : results

  return (

    <div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="loader"></div>
        </div>
      ) : (
        <div>
          <button className="filter-trigger-btn" onClick={() => setShowFilterMenu(!showFilterMenu)}>
            Filter
          </button>

          {showFilterMenu && (
            <div className="filter-menu-backdrop" onClick={() => setShowFilterMenu(false)}>
              <div className="filter-menu" onClick={(e) => e.stopPropagation()}>
                <div className="filter-row" onClick={() => setHideSequels(!hideSequels)}>
                  <div className="filter-checkbox">
                    {hideSequels && <img src={xIcon} className="filter-x-icon" />}
                  </div>
                  <span className="filter-label">Hide Sequels</span>
                </div>
              </div>
            </div>
          )}

          {displayedResults.slice(0, visibleCount).map((result, index) => (
            <div key={index} style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '24px',
              animation: index < 10 ? `fadeInUp 0.5s ease forwards`: 'none',
              animationDelay: index < 10 ? `${index * 0.15}s`: '0s',
              opacity: index < 10 ? 0 : 1,
              maxWidth: '600px',
              margin: '16px auto 16px auto'
            }}>
              <h2 style={{ fontSize: '14px', color: 'white', fontFamily: "'Press Start 2P', cursive", marginBottom: '8px' }}>{result.name}</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>{result.summary}</p>
            </div>
          ))}

          { displayedResults.length > visibleCount && (
            <div>
              <span className="load-more-text" onClick={() => setVisibleCount(visibleCount + 10)}>
                Load More
              </span>
            </div>
          )}

          { displayedResults.length <= visibleCount && (
            <div>
              <span className="show-less-text" onClick={() => setVisibleCount(10)}>
                Show Less
              </span>
            </div>
          )}

          <div className="results-buttons">
            <button onClick={handleBack} className="pixel-btn-day">Back</button>
            <button onClick={handleReset} className="pixel-btn-day">Start Over</button>
          </div>

        </div>
      )}
    </div>
  )
}

export default ResultsPage