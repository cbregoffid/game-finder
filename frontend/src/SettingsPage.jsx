import { useNavigate } from 'react-router-dom'

const CATEGORIES = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Nintendo (Retro)", "iOS", "Android"]

function SettingsPage({ platforms, setPlatforms }) {
    const navigate = useNavigate()

    const togglePlatform = (platform) => {
        if (platforms.includes(platform)) {
            setPlatforms(platforms.filter(p => p !== platform))
        } else {
            setPlatforms([...platforms, platform])
        }
    }

    const handleBack = () => {
        navigate('/')
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '120px' }}>
            <h1
                style={{
                    fontFamily: "'Uncial Antiqua', cursive",
                    color: 'white',
                    fontSize: '48px',
                    textShadow: '1px 1px 4px #8B3A2A',
                    marginBottom: '48px'
                }}
            >
                SETTINGS
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', maxWidth: '600px', marginBottom: '64px' }}>
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

export default SettingsPage