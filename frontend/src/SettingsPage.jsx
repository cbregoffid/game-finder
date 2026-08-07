import { useNavigate } from 'react-router-dom'

function SettingsPage() {
    const handleBack = () => {
        navigate('/')
    }
    const navigate = useNavigate()

    return (
        <div className="settings-page">
            <h1 className="settings-title">SETTINGS</h1>
            <button className="pixel-btn" onClick={() => navigate('/settings/platforms')}>
                Platform Filter
            </button>
            <button className="pixel-btn" style={{ marginTop: '500px' }} onClick={handleBack}>
                Back
            </button>
        </div>
    )
}

export default SettingsPage