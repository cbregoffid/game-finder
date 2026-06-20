from fastapi import FastAPI
from pydantic import BaseModel
from pinecone import Pinecone
from search_games import embed_text, get_game_vector, average_vectors, search as search_games
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index("game-finder")

class SearchRequest(BaseModel):
    adjectives: list[str]
    game_names: list[str]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://game-finder-six.vercel.app",
        "https://game-finder-git-main-cbregoffids-projects.vercel.app"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/search-games")
async def search_games_endpoint(query: str):
    results = index.query(
        vector=embed_text(query),
        top_k=5,
        include_metadata=True
    )
    
    game_list = []
    
    for match in results.matches:
        game_list.append({
            "name": match.metadata.get("name", ""),
            "cover": match.metadata.get("cover", None)
        })

    return {"results": game_list}
