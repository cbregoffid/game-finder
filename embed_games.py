import requests
import os
from dotenv import load_dotenv
from openai import OpenAI
from pinecone import Pinecone

load_dotenv()

CLIENT_ID = os.getenv("TWITCH_CLIENT_ID")
CLIENT_SECRET = os.getenv("TWITCH_CLIENT_SECRET")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

openai_client = OpenAI(api_key=OPENAI_API_KEY)
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index("game-finder")

def get_access_token():
    url = "https://id.twitch.tv/oauth2/token"
    params = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "client_credentials"
    }
    response = requests.post(url, params=params)
    return response.json()["access_token"]

def fetch_games(access_token, offset=0):
    url = "https://api.igdb.com/v4/games"
    headers = {
        "Client-ID": CLIENT_ID,
        "Authorization": f"Bearer {access_token}"
    }
    body = f'fields name, summary, genres.name, themes.name, cover.url; where summary != null & rating >= 75 & rating_count > 50; limit 100; offset {offset}; sort rating_count desc;'
    response = requests.post(url, headers=headers, data=body)
    return response.json()

def build_text(game):
    name = game.get("name", "")
    summary = game.get("summary", "")
    genres = ", ".join([g["name"] for g in game.get("genres", [])])
    themes = ", ".join([t["name"] for t in game.get("themes", [])])
    return f"Game: {name}. Summary: {summary}. Genres: {genres}. Themes: {themes}."

def embed_text(text):
    response = openai_client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

token = get_access_token()
print("Token acquired:", token[:10])

for batch in range(10):
    offset = batch * 100
    print(f"Fetching games {offset} to {offset + 100}...")
    games = fetch_games(token, offset)
    print("Games fetched:", len(games))

    vectors = []
    for game in games:
        text = build_text(game)
        embedding = embed_text(text)
        vectors.append({
            "id": str(game["id"]),
            "values": embedding,
            "metadata": {
                "name": game.get("name", ""),
                "summary": game.get("summary", ""),
                "genres": ", ".join([g["name"] for g in game.get("genres", [])]),
                "themes": ", ".join([t["name"] for t in game.get("themes", [])]),
                "cover": ("https:" + game["cover"]["url"].replace("t_thumb", "t_1080p")) if game.get("cover") else None
            }
        })

    index.upsert(vectors=vectors)
    print(f"Uploaded {len(vectors)} games to Pinecone.")

print("Done!")