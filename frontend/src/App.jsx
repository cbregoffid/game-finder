import cityBg from "./assets/cityBg.png"

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center pt-24 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-scroll flex h-full" style={{ width: '200%' }}>
          <img src={cityBg} className="h-full flex-shrink-0" style={{ width: '50%' }} />
          <img src={cityBg} className="h-full flex-shrink-0" style={{ width: '50%' }} />
        </div>
      </div>

      {/* Content */}
      <h1 
        className="text-8xl font-bold text-white mb-20 relative z-10"
        style={{ fontFamily: "'Uncial Antiqua', cursive",
                textShadow: '1px 1px 4px #8B3A2A'
        }}
      >
        GAME FINDER
      </h1>
      <div className="flex gap-8 relative z-10">
        <button className="pixel-btn w-43">
          Start
        </button>
        <button className="pixel-btn w-43">
          About
        </button>
        <button className="pixel-btn">
          Settings
        </button>
      </div>
    </div>
  )
}
export default App