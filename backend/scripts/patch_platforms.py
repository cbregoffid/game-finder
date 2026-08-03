import requests
import os
from dotenv import load_dotenv
from pinecone import Pinecone
import time

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
    "PlayStation 5": "PlayStation 5",

    "PlayStation": "PlayStation (Retro)",
    "PlayStation 2": "PlayStation (Retro)",
    "PlayStation 3": "PlayStation (Retro)",
    "PlayStation 4": "PlayStation (Retro)",
    "PlayStation Portable": "PlayStation (Retro)",
    "PlayStation Vita": "PlayStation (Retro)",
    "PlayStation VR": "PlayStation (Retro)",
    "PlayStation VR2": "PlayStation (Retro)",

    # Xbox
    "Xbox Series X|S": "Xbox Series X|S",

    "Xbox": "Xbox (Retro)",
    "Xbox 360": "Xbox (Retro)",
    "Xbox One": "Xbox (Retro)",

    # Nintendo
    "Nintendo Switch 2": "Nintendo Switch 2",
    
    "Nintendo Switch": "Nintendo Switch",
    
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
    body = f'fields name, platforms.name, release_dates.platform.name, release_dates.date; where summary != null & rating >= 70 & rating_count > 20; limit 100; offset {offset}; sort rating_count desc;'
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

def get_released_platforms(game):
    now = time.time()
    released = []
    for entry in game.get("release_dates", []):
        is_released = False if entry.get("date") is None else entry.get("date") < now
        if is_released:
            released.append(entry["platform"]["name"])
            
    return released
            
token = get_access_token()


for batch in range(50):
    offset = batch * 100
    print(f"Fetching platform data {offset} to {offset + 100}...")
    games = fetch_games(token, offset)

    for game in games:
        grouped = group_platforms(get_released_platforms(game))
        index.update(id=str(game["id"]), set_metadata={"platforms": grouped}) 
        
    print(f"Updated {len(games)} games.")

print("Done!")