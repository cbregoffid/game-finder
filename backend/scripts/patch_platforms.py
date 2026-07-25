import requests
import os
from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv()

CLIENT_ID = os.getenv("TWITCH_CLIENT_ID")
CLIENT_SECRET = os.getenv("TWITCH_CLIENT_SECRET")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index("game-finder")

PLATFORM_GROUPS = {
    # PC
    "PC (Microsoft Windows)": "PC",
    "Linux": "PC",
    "Mac": "PC",
    "DOS": "PC",

    # PlayStation
    "PlayStation": "PlayStation",
    "PlayStation 2": "PlayStation",
    "PlayStation 3": "PlayStation",
    "PlayStation 4": "PlayStation",
    "PlayStation 5": "PlayStation",
    "PlayStation Portable": "PlayStation",
    "PlayStation Vita": "PlayStation",
    "PlayStation VR": "PlayStation",
    "PlayStation VR2": "PlayStation",

    # Xbox
    "Xbox": "Xbox",
    "Xbox 360": "Xbox",
    "Xbox One": "Xbox",
    "Xbox Series X|S": "Xbox",

    # Nintendo - Switch + Retro Consoles separate
    "Nintendo Switch": "Nintendo Switch",
    "Nintendo Switch 2": "Nintendo Switch",

    "Nintendo 64": "Nintendo (Retro)",
    "Wii": "Nintendo (Retro)",
    "Wii U": "Nintendo (Retro)",
    "Nintendo Entertainment System": "Nintendo (Retro)",
    "Super Nintendo Entertainment System": "Nintendo (Retro)",
    "Nintendo DS": "Nintendo (Retro)",
    "Nintendo DSi": "Nintendo (Retro)",
    "Nintendo 3DS": "Nintendo (Retro)",
    "New Nintendo 3DS": "Nintendo (Retro)",
    "Nintendo GameCube": "Nintendo (Retro)",
    "Game Boy": "Nintendo (Retro)",
    "Game Boy Color": "Nintendo (Retro)",
    "Game Boy Advance": "Nintendo (Retro)",
    "Virtual Boy": "Nintendo (Retro)",
    "Virtual Console": "Nintendo (Retro)",
    "Super Famicom": "Nintendo (Retro)",
    "Family Computer": "Nintendo (Retro)",
    "Family Computer Disk System": "Nintendo (Retro)",
    "Super NES CD-ROM System": "Nintendo (Retro)",
    "Satellaview": "Nintendo (Retro)",
    "Game & Watch": "Nintendo (Retro)",
    "Pokémon mini": "Nintendo (Retro)",
    "64DD": "Nintendo (Retro)",

    # Mobile
    "iOS": "iOS",
    "Android": "Android",
}

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
    body = f'fields name, platforms.name; where summary != null & rating >= 70 & rating_count > 20; limit 100; offset {offset}; sort rating_count desc;'
    response = requests.post(url, headers=headers, data=body)
    return response.json()

def group_platforms(raw_platform_names):
    grouped = []
    for name in raw_platform_names:
        if name in PLATFORM_GROUPS:
            group = PLATFORM_GROUPS[name]
            if group not in grouped:
                grouped.append(group)
        else:
            print(f"Unknown platform: {name}")

    return grouped

token = get_access_token()

for batch in range(50):
    offset = batch * 100
    print(f"Fetching platform data {offset} to {offset + 100}...")
    games = fetch_games(token, offset)

    for game in games:
        raw_names = [p["name"] for p in game.get("platforms", [])]
        grouped = group_platforms(raw_names)
        index.update(id=str(game["id"]), set_metadata={"platforms": grouped}) 
        
    print(f"Updated {len(games)} games.")

print("Done!")