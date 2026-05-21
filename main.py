from fastapi import FastAPI
from pydantic import BaseModel
from search_games import embed_text, get_game_vector, average_vectors, search as search_games

class SearchRequest(BaseModel):
    adjectives: list[str]
    game_names: list[str]

app = FastAPI()

@app.post("/search")
async def search(request: SearchRequest):
    all_vectors = []
    adjective_vector = embed_text(", ".join(request.adjectives))
    all_vectors.append(adjective_vector)

    for game in request.game_names:
        game_vector = get_game_vector(game.strip())
        if game_vector:
            all_vectors.append(game_vector)

    query_vector = average_vectors(all_vectors)
    results = search_games(query_vector)
    
    games = []
    for result in results:
        if result.metadata["name"] not in request.game_names:
            games.append({
                "name": result.metadata["name"],
                "summary": result.metadata["summary"],
                "genres": result.metadata["genres"],
                "themes": result.metadata["themes"]
            })

    return {"results": games}