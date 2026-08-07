import { useNavigate } from 'react-router-dom'

const CATEGORIES = ["PC", "PlayStation 5", "PlayStation (Retro)", "Xbox Series X|S", "Xbox (Retro)", "Nintendo Switch 2", "Nintendo Switch", "Nintendo (Retro)", "iOS", "Android"]

function PlatformFilterPage({ platforms, setPlatforms }) {
    const navigate = useNavigate()

    const togglePlatform = (platform) => {
        if (platforms.includes(platform)) {
            setPlatforms(platforms.filter(p => p !== platform))
        } else {
            setPlatforms([...platforms, platform])
        }
    }

    const handleBack = () => {
        navigate('/settings')
    }

    return (
        <div className="settings-page">
            <h1 className="settings-title">
                PLATFORM FILTER
            </h1>

            <div className="platform-categories">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => togglePlatform(category)}
                        className="pixel-btn"
                        style={{
                            borderColor: platforms.includes(category) ? '#00ff99' : undefined,
                            boxShadow: platforms.includes(category) ? '4px 4px 0px #00994d' : undefined,
                            fontSize: '12px',
                            padding: '12px 20px'
                        }}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <button className="pixel-btn" onClick={handleBack}>Back</button>
        </div>
    )
}

export default PlatformFilterPage