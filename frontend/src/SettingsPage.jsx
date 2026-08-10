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
            <div className="settings-back-row">
                <button className="pixel-btn" onClick={handleBack}>
                    Back
                </button>
            </div>
        </div>
    )
}

export default SettingsPage