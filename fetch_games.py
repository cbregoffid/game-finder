import requests
import os
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("TWITCH_CLIENT_ID")
CLIENT_SECRET = os.getenv("TWITCH_CLIENT_SECRET")

def get_access_token():
    url = "https://id.twitch.tv/oauth2/token"
    params = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "client_credentials"
    }
    response = requests.post(url, params=params)
    return response.json()["access_token"]

def fetch_games(access_token):
    url = "https://api.igdb.com/v4/games"
    headers = {
        "Client-ID": CLIENT_ID,
        "Authorization": f"Bearer {access_token}"
    }
    body = 'fields name, summary, genres.name, themes.name; limit 5;'
    response = requests.post(url, headers=headers, data=body)
    return response.json()

token = get_access_token()
games = fetch_games(token)

for game in games:
    print(game["name"])
    print(game.get("summary", "No summary available"))
    print("---")