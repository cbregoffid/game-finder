import { useState, useEffect } from 'react'

function AdjectivesPage() {
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [adjectives, setAdjectives] = useState([])

  useEffect(() => {
    if (input.length < 2){
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      console.log("fetching for:", input)
      const response = await fetch(`https://api.datamuse.com/words?sp=${input}*&max=8&md=p`)
      const data = await response.json()
      console.log(data)
      const filtered = data.filter(w => w.tags && w.tags.includes('adj') && !w.word.includes(' ') && !w.word.includes(',')).sort((a, b) => {
        if (a.word === input) return -1
        if (b.word === input) return 1
        return 0
      })
      setSuggestions(filtered)
      console.log(filtered)
    }

    fetchSuggestions()
  }, [input])

    const handleAddAdjective = (word) => {
    setAdjectives([...adjectives, word])
    setInput("")
    setSuggestions([])
  }

  return (
    <div>
      <h1>Adjectives Page</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{background: 'white', color: 'black', padding: '8px'}}
        />
        {suggestions.map((suggestion) => ( 
        <div key={suggestion.word} onClick={() => handleAddAdjective(suggestion.word)}>
          {suggestion.word}
        </div>
        ))}

    </div>
  )
}

export default AdjectivesPage